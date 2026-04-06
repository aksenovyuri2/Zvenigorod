// ═══════════════════════════════════════════════════════════════════════════════
// GAME LOOP — Central turn processor integrating all v3 systems
// ═══════════════════════════════════════════════════════════════════════════════

import { createRNG } from "./random.js";
import {
  METRIC_KEYS, GROUPS,
  INIT_METRICS, INIT_BUDGET, INIT_POP, MAX_TURNS, ELECTION_TURN, MAX_PICKS,
  INIT_APPROVAL, DIFFICULTIES, SCENARIOS,
} from "./constants.js";
import { WORLD_CITIES } from "./cities.js";
import { ALL_DECISIONS } from "./decisions.js";
import { ALL_EVENTS, ADVISORS, OPPONENTS, ACHIEVEMENTS, ELECTION_PROMISES } from "./events.js";
import {
  applyDecay, applySeason, clampMetrics,
  calcGroupSatisfactions, calcAvgSatisfaction,
  calcRevenue, calcMandatoryExpenses, calcMigration, calcApprovalChange,
} from "./calculator.js";
import { calcZvenigorodScore, getZvenigorodRankIdx, getGrade, getPlayStyle } from "./scoring.js";
import { createInitialEconomy, updateEconomy, getTaxRevenueMultiplier } from "./economyEngine.js";
import {
  shouldBeProject, generateContractors, createProject, advanceProject,
  getProjectsCostThisTurn, getCompletedProjectEffects,
} from "./projectManager.js";
import { checkCrisisTrigger, startCrisis, getCurrentCrisisPhase, advanceCrisis } from "./crises.js";
import { generateNPCs } from "../npc/npcGenerator.js";
import { processNPCTurn, selectLetterWriters } from "../npc/npcEngine.js";
import { generateDeputies, checkImpeachment, checkRecallVote, executeRecallVote } from "../political/dumaEngine.js";
import { checkProtests, processProtests } from "./protestEngine.js";
import { initNeighborRelations, checkHostileActions, advanceJointProject, resetTurnFlags, applyDiplomaticAction } from "../political/diplomacy.js";

// ── Internal helpers ──

function findWeakestCategory(metrics) {
  let worst = null, worstVal = Infinity;
  for (const k of METRIC_KEYS) { if (metrics[k] < worstVal) { worstVal = metrics[k]; worst = k; } }
  return worst;
}

function checkEventRequires(evt, state) {
  if (!evt.requires) return true;
  const r = evt.requires;
  for (const [k, v] of Object.entries(r)) {
    if (k === "rank_lt") { if (state.globalRankIdx >= v) return false; }
    else if (k.endsWith("_lt")) { const mk = k.replace("_lt", ""); if ((state.metrics[mk] || 0) >= v) return false; }
    else { if ((state.metrics[k] || 0) < v) return false; }
  }
  return true;
}

function checkAchievements(state) {
  const newAch = [];
  for (const a of ACHIEVEMENTS) {
    if (state.achievements.includes(a.id)) continue;
    if (a.cond(state)) newAch.push(a.id);
  }
  return newAch;
}

// ── Exported helpers ──

export function generateAvailableDecisions(state, rng) {
  const { metrics, budget, usedOnceDecisions, lastTurnDecisionIds, decisionHistory, costMultiplier } = state;
  const blockedIds = (state.blockedDecisions || [])
    .filter(b => b.unblockTurn > (state.turn || 0))
    .map(b => b.decisionId);

  let pool = ALL_DECISIONS.filter(d => {
    if (d.once && usedOnceDecisions.includes(d.id)) return false;
    if (blockedIds.includes(d.id)) return false;
    if (d.requires) {
      for (const [k, v] of Object.entries(d.requires)) {
        if ((metrics[k] || 0) < v) return false;
      }
    }
    return true;
  });

  const effectiveCost = d => Math.round(d.cost * (costMultiplier || 1));
  const cheapOnes = pool.filter(d => effectiveCost(d) <= 40);
  const tradeoffs = pool.filter(d => d.cat === "tradeoff");
  const weakCat = findWeakestCategory(metrics);
  const weakOnes = pool.filter(d => d.cat === weakCat);
  const notLast = pool.filter(d => !(lastTurnDecisionIds || []).includes(d.id));
  const preferred = notLast.length >= 6 ? notLast : pool;

  const selected = [];
  const usedIds = new Set();
  const addOne = cands => {
    const a = cands.filter(d => !usedIds.has(d.id));
    if (a.length) { const d = rng.pick(a); selected.push(d); usedIds.add(d.id); }
  };
  addOne(cheapOnes.length ? cheapOnes : pool);
  addOne(tradeoffs.length ? tradeoffs : pool);
  addOne(weakOnes.length ? weakOnes : pool);
  const rest = rng.shuffle(preferred.filter(d => !usedIds.has(d.id)));
  for (const d of rest) { if (selected.length >= 6) break; selected.push(d); usedIds.add(d.id); }
  while (selected.length < 5 && pool.length > selected.length) {
    const rem = pool.filter(d => !usedIds.has(d.id));
    if (!rem.length) break;
    const d = rng.pick(rem);
    selected.push(d);
    usedIds.add(d.id);
  }
  return selected.sort((a, b) => effectiveCost(a) - effectiveCost(b));
}

export function generateAdvisorComments(decisions, state, rng) {
  const comments = {};
  for (const advisor of ADVISORS) {
    const relevant = decisions.filter(d => advisor.bias.some(b => d.effects[b] && d.effects[b] > 0));
    const target = relevant.length > 0 ? rng.pick(relevant) : rng.pick(decisions);
    const matchedBias = advisor.bias.find(b => target.effects[b] && target.effects[b] > 0);
    const phrase = matchedBias && advisor.phrases[matchedBias] ? advisor.phrases[matchedBias] : advisor.phrases.default;
    comments[target.id] = comments[target.id] || [];
    comments[target.id].push({ advisor: advisor.name, avatar: advisor.avatar, text: phrase });
  }
  return comments;
}

export function selectEvent(state, rng) {
  const { eventQueue, turn, usedEventIds } = state;
  const eventProb = (state.difficulty || {}).eventProb || 0.4;
  const queued = (eventQueue || []).filter(q => q.targetTurn === turn + 1);
  if (queued.length > 0) return ALL_EVENTS.find(e => e.id === queued[0].eventId) || null;
  if (rng.next() > eventProb) return null;
  const season = (turn + 1) % 4;
  const eligible = ALL_EVENTS.filter(e => {
    if (e.chain) return false;
    if ((usedEventIds || []).includes(e.id)) return false;
    if (e.season !== undefined && e.season !== season) return false;
    if (e.minTurn && (turn + 1) < e.minTurn) return false;
    if (!checkEventRequires(e, state)) return false;
    return true;
  });
  if (!eligible.length) return null;
  return rng.pick(eligible);
}

// ── Initial state ──

export function createInitialState(seed, scenarioId = "standard", difficultyId = "normal") {
  const rng = createRNG(seed);
  const scenario = SCENARIOS.find(s => s.id === scenarioId) || SCENARIOS[0];
  const difficulty = DIFFICULTIES[difficultyId] || DIFFICULTIES.normal;

  let metrics = { ...INIT_METRICS };
  if (scenario.metricsModifier._all) {
    for (const k of METRIC_KEYS) metrics[k] += scenario.metricsModifier._all;
  }
  for (const [k, v] of Object.entries(scenario.metricsModifier)) {
    if (k !== "_all" && metrics[k] !== undefined) metrics[k] += v;
  }
  metrics = clampMetrics(metrics);

  const budget = Math.round(INIT_BUDGET * difficulty.budgetMult) + (scenario.budgetModifier || 0);
  const debt = scenario.debtModifier || 0;
  const approval = INIT_APPROVAL + (scenario.approvalModifier || 0);

  const satisfactions = calcGroupSatisfactions(metrics);
  const zvScore = calcZvenigorodScore(metrics, INIT_POP, satisfactions);
  const globalRankIdx = getZvenigorodRankIdx(zvScore);

  const decisions = generateAvailableDecisions({
    metrics, budget, usedOnceDecisions: [], lastTurnDecisionIds: [],
    decisionHistory: {}, costMultiplier: 1,
  }, rng);
  const advisorComments = generateAdvisorComments(decisions, { metrics }, rng);

  const npcs = generateNPCs(rng);
  const deputies = generateDeputies(rng);
  const neighborRelations = initNeighborRelations(rng);
  const economy = createInitialEconomy(scenario);

  return {
    phase: "start", turn: 0, budget, debt, population: INIT_POP,
    metrics, prevMetrics: { ...metrics }, prevPopulation: INIT_POP, prevBudget: budget, prevSatisfactions: { ...satisfactions },
    selectedDecisions: [], availableDecisions: decisions, usedOnceDecisions: [], decisionHistory: {},
    recurringEffects: { budget: 0 }, recurringIncomes: [], currentEvent: null, eventQueue: [], usedEventIds: [], lastTurnDecisionIds: [],
    history: [{ turn: 0, metrics: { ...metrics }, population: INIT_POP, budget, globalRankIdx, satisfaction: { ...satisfactions }, approval, zvScore }],
    globalRankIdx, zvenigorodScore: zvScore, turnRevenue: 0, turnExpenses: 0,
    seed: rng.getSeed(), costMultiplier: 1, costMultiplierTurns: 0,
    satisfactions, approval, defaulted: false,
    neverHadDebt: true, negativeStreak: 0, negativeStreakMax: 0, worstRank: globalRankIdx,
    achievements: [], newAchievements: [], overtakeMsg: null, news: [],
    electionPromise: null, electionResult: null, advisorComments, onboardingStep: 0,
    // v3 config
    scenarioId, difficultyId, difficulty, scenario,
    // v3 NPC
    npcs, npcLetters: [], npcDepartures: [], npcArrivals: [],
    // v3 Political
    deputies, dumaVotePending: null, dumaVoteResult: null, blockedDecisions: [], corruptionEvents: [],
    // v3 Economy
    economy,
    // v3 Projects
    projects: [], projectProblems: [], pendingContractorChoice: null,
    // v3 Protests & Exile
    activeProtests: [], approvalHistory: [], exiled: false, resolvedProtests: 0,
    // v3 Crises
    activeCrisis: null, resolvedCrises: [], crisisActionChosen: false,
    // v3 Diplomacy
    neighborRelations, diplomaticResults: [], completedJointProjects: [],
  };
}

// ── Main turn processor ──

export function processTurn(state, selectedIds, eventChoiceIndex) {
  const rng = createRNG(state.seed);
  let metrics = { ...state.metrics };
  const prevMetrics = { ...state.metrics };
  const prevPop = state.population;
  const prevBudget = state.budget;
  const prevSatisfactions = { ...state.satisfactions };
  const decayMult = (state.difficulty || {}).decayMult || 1;

  let eventBudget = 0, eventPopulation = 0;
  let newEventQueue = [...(state.eventQueue || [])].filter(q => q.targetTurn !== state.turn + 1);
  let newRecurring = { ...state.recurringEffects };
  let newRecurringIncomes = [...(state.recurringIncomes || [])];
  let newCostMultiplier = state.costMultiplier || 1;
  let newCostMultiplierTurns = state.costMultiplierTurns || 0;
  let newUsedEventIds = [...(state.usedEventIds || [])];
  let approvalDelta = 0;
  let newDebt = state.debt || 0;
  let eventNewsText = null;

  // ── 1. Apply current event ──
  if (state.currentEvent) {
    const evt = state.currentEvent;
    newUsedEventIds.push(evt.id);
    eventNewsText = evt.text;
    if (evt.choices && eventChoiceIndex != null) {
      const choice = evt.choices[eventChoiceIndex];
      if (choice) {
        for (const [k, v] of Object.entries(choice.effects || {})) metrics[k] = (metrics[k] || 0) + v;
        eventBudget += choice.budget || 0;
        eventPopulation += choice.population || 0;
        if (choice.approval) approvalDelta += choice.approval;
        if (choice.chainEvents) for (const ce of choice.chainEvents) newEventQueue.push({ eventId: ce.eventId, targetTurn: state.turn + 1 + ce.delay });
        if (choice.recurring) newRecurring = { ...newRecurring, budget: (newRecurring.budget || 0) + choice.recurring };
        if (choice.addDebt) newDebt += choice.addDebt;
      }
    } else if (!evt.choices) {
      for (const [k, v] of Object.entries(evt.effects || {})) metrics[k] = (metrics[k] || 0) + v;
      eventBudget += evt.budget || 0;
      eventPopulation += evt.population || 0;
      if (evt.approval) approvalDelta += evt.approval;
      if (evt.setCostMultiplier) { newCostMultiplier = 1.2; newCostMultiplierTurns = 3; }
      if (evt.randomCulture) metrics.culture += rng.nextInt(-2, 3);
    }
  }

  // ── 2. Decay + season ──
  metrics = applyDecay(metrics, decayMult);
  metrics = applySeason(metrics, state.turn);

  // ── 3. Apply decisions ──
  let budget = state.budget + eventBudget;
  let population = state.population + eventPopulation;
  const newDecisionHistory = { ...state.decisionHistory };
  const newUsedOnce = [...state.usedOnceDecisions];
  let newProjects = [...state.projects];
  const newProjectProblems = [];

  for (const id of selectedIds) {
    const dec = ALL_DECISIONS.find(d => d.id === id);
    if (!dec) continue;
    const timesUsed = newDecisionHistory[id] || 0;
    const multiplier = Math.pow(0.7, timesUsed);

    if (shouldBeProject(dec)) {
      const contractors = generateContractors(rng, 3);
      const contractor = contractors[0];
      const project = createProject(dec, contractor);
      newProjects = [...newProjects, project];
      budget -= project.costPerTurn;
    } else {
      for (const [k, v] of Object.entries(dec.effects)) metrics[k] = (metrics[k] || 0) + v * multiplier;
      budget -= Math.round(dec.cost * (newCostMultiplier || 1));
    }

    if (dec.recurringIncome) newRecurringIncomes = [...newRecurringIncomes, { ...dec.recurringIncome, startTurn: state.turn + 1, decisionId: dec.id }];
    if (dec.once) newUsedOnce.push(id);
    if (dec.populationEffect) population += dec.populationEffect;
    newDecisionHistory[id] = timesUsed + 1;

    if (dec.id === "coworking") newEventQueue.push({ eventId: "cowork_startup", targetTurn: state.turn + 3 });
    if (dec.id === "festival") newEventQueue.push({ eventId: "festival_forbes", targetTurn: state.turn + 2 });
  }

  // ── 4. Advance existing projects ──
  const advancedProjects = [];
  for (const proj of newProjects) {
    if (proj.status === "building" && proj.currentTurn > 0) {
      const { project: advanced, problem } = advanceProject(proj, rng);
      advancedProjects.push({ ...advanced, currentProblem: problem || null });
      if (problem) newProjectProblems.push({ projectName: proj.name, ...problem });
      if (advanced.status === "building") budget -= advanced.costPerTurn;
    } else {
      advancedProjects.push(proj);
    }
  }
  newProjects = advancedProjects;

  const completedEffects = getCompletedProjectEffects(newProjects);
  for (const [k, v] of Object.entries(completedEffects)) {
    metrics[k] = (metrics[k] || 0) + v;
  }

  // ── 5. Crisis processing ──
  let newActiveCrisis = state.activeCrisis;
  let newResolvedCrises = [...(state.resolvedCrises || [])];

  if (newActiveCrisis) {
    const phase = getCurrentCrisisPhase(newActiveCrisis);
    if (phase) {
      for (const [k, v] of Object.entries(phase.autoEffects || {})) metrics[k] = (metrics[k] || 0) + v;
      if (phase.populationDelta) population += phase.populationDelta;
      if (phase.approvalDelta) approvalDelta += phase.approvalDelta;
    }
    const advanced = advanceCrisis(newActiveCrisis);
    if (!advanced) {
      newResolvedCrises = [...newResolvedCrises, newActiveCrisis.crisisId];
      newActiveCrisis = null;
    } else {
      newActiveCrisis = advanced;
    }
  } else {
    const triggered = checkCrisisTrigger({ ...state, metrics, turn: state.turn + 1 }, rng);
    if (triggered) {
      newActiveCrisis = { ...startCrisis(triggered), startTurn: state.turn + 1 };
    }
  }

  // ── 6. Diplomacy ──
  let newNeighborRelations = resetTurnFlags(state.neighborRelations);
  const newCompletedJointProjects = [];

  for (const neighborId of Object.keys(newNeighborRelations)) {
    const rel = newNeighborRelations[neighborId];
    if (rel.activeProject) {
      const { relations: updated, completed } = advanceJointProject(newNeighborRelations, neighborId);
      newNeighborRelations = updated;
      if (completed) {
        newCompletedJointProjects.push(completed);
        for (const [k, v] of Object.entries(completed.effects || {})) metrics[k] = (metrics[k] || 0) + v;
      }
    }
  }

  const hostileActions = checkHostileActions(newNeighborRelations);
  for (const action of hostileActions) {
    if (action.effects) for (const [k, v] of Object.entries(action.effects)) metrics[k] = (metrics[k] || 0) + v;
    if (action.approvalDelta) approvalDelta += action.approvalDelta;
  }

  // ── 6.5. Protests ──
  let newActiveProtests = [...(state.activeProtests || [])];
  const newProtests = checkProtests({ ...state, metrics, turn: state.turn + 1 });
  newActiveProtests = [...newActiveProtests, ...newProtests];
  const protestResult = processProtests(newActiveProtests, metrics, state.turn + 1);
  newActiveProtests = protestResult.activeProtests;
  for (const [k, v] of Object.entries(protestResult.metricChanges)) {
    metrics[k] = Math.max(0, (metrics[k] || 0) + v);
  }
  approvalDelta += protestResult.approvalDelta;
  const resolvedCount = (state.activeProtests || []).length - newActiveProtests.length;
  const newResolvedProtests = (state.resolvedProtests || 0) + Math.max(0, resolvedCount);
  const protestNews = newProtests.map(p => `⚠️ ${p.name}!`);

  // ── 6.6. Recall & Impeachment ──
  let exiled = false;
  const approvalHistory = [...(state.approvalHistory || []), state.approval];
  if (checkRecallVote(approvalHistory)) {
    const recallResult = executeRecallVote(state.approval + approvalDelta, calcGroupSatisfactions(metrics), state.deputies);
    if (recallResult) exiled = true;
  }
  if (!exiled && checkImpeachment(state.deputies, state.approval + approvalDelta)) {
    exiled = true;
  }

  // ── 7. Recurring ──
  let recurringTotal = 0;
  for (const ri of newRecurringIncomes) {
    const turnsActive = (state.turn + 1) - ri.startTurn;
    const currentYield = Math.max(0, ri.base - ri.decayPerTurn * turnsActive);
    recurringTotal += currentYield - ri.maintenance;
  }
  budget += recurringTotal + (newRecurring.budget || 0);

  // ── 8. Mandatory & revenue ──
  const mandatory = calcMandatoryExpenses(population, metrics);
  budget -= mandatory;
  const taxMult = getTaxRevenueMultiplier((state.economy || {}).taxRate || 10);
  const revenueMult = (state.difficulty || {}).revenueMult || 1;
  const revenue = calcRevenue(population, metrics, taxMult * revenueMult);
  budget += revenue;

  // ── 9. Progressive debt ──
  if (budget < 0) { newDebt += Math.abs(budget); budget = 0; }
  const interestRate = newDebt < 100 ? 0.03 : newDebt < 300 ? 0.06 : newDebt < 500 ? 0.10 : 0.15;
  newDebt = Math.round(newDebt * (1 + interestRate));
  let defaulted = false;
  if (newDebt > 100) approvalDelta -= 2;
  if (newDebt > 200) { for (const k of METRIC_KEYS) metrics[k] -= 1; }
  if (newDebt > 300) { for (const k of METRIC_KEYS) metrics[k] -= 2; approvalDelta -= 3; }
  if (newDebt > 500) { for (const k of METRIC_KEYS) metrics[k] -= 3; approvalDelta -= 5; }
  if (newDebt > 700) defaulted = true;
  if (newDebt > 0 && budget > 0) {
    const minPay = Math.min(budget, Math.max(20, Math.round(newDebt * 0.1)));
    budget -= minPay; newDebt -= minPay;
  }

  // ── 10. Clamp ──
  metrics = clampMetrics(metrics);

  // ── 11. Economy update ──
  const newEconomy = updateEconomy(state.economy || createInitialEconomy(), metrics, population);

  // ── 12. Satisfaction, migration, rank ──
  const satisfactions = calcGroupSatisfactions(metrics);
  const avgSat = calcAvgSatisfaction(satisfactions);
  const migration = calcMigration(avgSat, rng);
  population += migration + Math.round(population * 0.001);
  population = Math.max(1000, population);

  const zvScore = calcZvenigorodScore(metrics, population, satisfactions);
  const globalRankIdx = getZvenigorodRankIdx(zvScore);

  // ── 13. NPC processing ──
  const { updatedNPCs, departed, arrived } = processNPCTurn(state.npcs || [], metrics, state.turn + 1, rng, state.approval + approvalDelta);
  const letterWriters = selectLetterWriters(updatedNPCs, state.turn + 1);

  // ── 14. Approval ──
  approvalDelta += calcApprovalChange(prevMetrics, metrics, newDebt);
  if (state.electionPromise && state.turn === (state.electionPromise.check || {}).byTurn) {
    if (metrics[(state.electionPromise.check || {}).metric] < (state.electionPromise.check || {}).min) {
      approvalDelta += state.electionPromise.penalty || 0;
    }
  }
  const newApproval = Math.max(0, Math.min(100, state.approval + approvalDelta));

  // ── 15. Cost multiplier decay ──
  if (newCostMultiplierTurns > 0) { newCostMultiplierTurns--; if (newCostMultiplierTurns <= 0) newCostMultiplier = 1; }

  // ── 16. Achievements ──
  const neverHadDebt = state.neverHadDebt && newDebt === 0;
  const negativeStreak = (state.currentEvent && !state.currentEvent.choices && Object.values(state.currentEvent.effects || {}).some(v => v < 0)) ? (state.negativeStreak || 0) + 1 : 0;
  const negativeStreakMax = Math.max(state.negativeStreakMax || 0, negativeStreak);
  const worstRank = Math.max(state.worstRank || 0, globalRankIdx);

  const achState = { metrics, population, approval: newApproval, neverHadDebt, globalRankIdx, turn: state.turn + 1, zvenigorodScore: zvScore, worstRank, negativeStreakMax, achievements: state.achievements, debt: newDebt };
  const newAchievements = checkAchievements(achState);

  // ── 17. Rank overtake ──
  const prevRankIdx = state.globalRankIdx;
  let overtakeMsg = null;
  if (globalRankIdx < prevRankIdx) {
    const overtaken = WORLD_CITIES.slice(globalRankIdx, prevRankIdx);
    if (overtaken.length > 0) {
      const city = overtaken[overtaken.length - 1];
      const isRussian = city.flag === "\u{1F1F7}\u{1F1FA}";
      overtakeMsg = isRussian
        ? `\u{1F4F0} \u{00AB}${city.name.split(",")[0]} \u2014 \u0417\u0432\u0435\u043D\u0438\u0433\u043E\u0440\u043E\u0434 \u043E\u0431\u043E\u0448\u0451\u043B \u0432 \u043C\u0438\u0440\u043E\u0432\u043E\u043C \u0440\u0435\u0439\u0442\u0438\u043D\u0433\u0435!\u{00BB} \u2014 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043D\u0430 \u0420\u0411\u041A`
        : `\u{1F389} \u0417\u0432\u0435\u043D\u0438\u0433\u043E\u0440\u043E\u0434 \u043E\u0431\u043E\u0433\u043D\u0430\u043B ${city.name} \u0438 \u043F\u043E\u0434\u043D\u044F\u043B\u0441\u044F \u043D\u0430 #${globalRankIdx + 1}!`;
    }
  }

  // ── 18. News ──
  const news = [];
  for (const id of selectedIds) {
    const d = ALL_DECISIONS.find(x => x.id === id);
    if (d) news.push(`\u041C\u044D\u0440 \u043E\u0434\u043E\u0431\u0440\u0438\u043B: ${d.name}`);
  }
  if (eventNewsText) news.push(eventNewsText.replace(/^[^\s]+\s/, ""));
  if (population > 30000 && prevPop <= 30000) news.push("\u041D\u0430\u0441\u0435\u043B\u0435\u043D\u0438\u0435 \u0432\u043F\u0435\u0440\u0432\u044B\u0435 \u043F\u0440\u0435\u0432\u044B\u0441\u0438\u043B\u043E 30 000!");
  if (population > 50000 && prevPop <= 50000) news.push("\u041D\u0430\u0441\u0435\u043B\u0435\u043D\u0438\u0435 \u043F\u0440\u0435\u0432\u044B\u0441\u0438\u043B\u043E 50 000!");
  if (overtakeMsg) news.unshift(overtakeMsg.replace(/^[^\s]+\s/, ""));
  for (const d of departed) news.push(`${d.npc.shortName || d.npc.name} \u0443\u0435\u0445\u0430\u043B(\u0430) \u0438\u0437 \u0433\u043E\u0440\u043E\u0434\u0430.`);
  for (const a of arrived) news.push(`${a.shortName || a.name} \u043F\u0435\u0440\u0435\u0435\u0445\u0430\u043B(\u0430) \u0432 \u0417\u0432\u0435\u043D\u0438\u0433\u043E\u0440\u043E\u0434!`);
  for (const cp of newCompletedJointProjects) news.push(`\u0421\u043E\u0432\u043C\u0435\u0441\u0442\u043D\u044B\u0439 \u043F\u0440\u043E\u0435\u043A\u0442 \u{00AB}${cp.name}\u{00BB} \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D!`);
  for (const pp of newProjectProblems) news.push(`\u26A0\uFE0F \u041F\u0440\u043E\u0431\u043B\u0435\u043C\u0430 \u043D\u0430 \u0441\u0442\u0440\u043E\u0439\u043A\u0435 \u{00AB}${pp.projectName}\u{00BB}: ${pp.desc || pp.label}`);
  for (const pn of protestNews) news.push(pn);

  // ── 19. Next turn prep ──
  const nextTurn = state.turn + 1;
  let nextEvent = null;
  if (nextTurn < MAX_TURNS && !defaulted && nextTurn !== ELECTION_TURN) {
    nextEvent = selectEvent({ ...state, eventQueue: newEventQueue, turn: state.turn, metrics, usedEventIds: newUsedEventIds, globalRankIdx, difficulty: state.difficulty }, rng);
  }
  let nextDecisions = [];
  if (nextTurn < MAX_TURNS && !defaulted && nextTurn !== ELECTION_TURN) {
    nextDecisions = generateAvailableDecisions({ metrics, budget, usedOnceDecisions: newUsedOnce, lastTurnDecisionIds: selectedIds, decisionHistory: newDecisionHistory, costMultiplier: newCostMultiplier, blockedDecisions: state.blockedDecisions, turn: nextTurn }, rng);
  }

  const snapshot = { turn: nextTurn, metrics: { ...metrics }, population, budget, globalRankIdx, satisfaction: { ...satisfactions }, approval: newApproval, zvScore };

  let phase;
  if (defaulted || exiled) phase = "end";
  else if (nextTurn >= MAX_TURNS) phase = "end";
  else phase = "results";

  return {
    phase, turn: nextTurn, budget: Math.round(budget), debt: Math.round(newDebt), population, metrics,
    prevMetrics, prevPopulation: prevPop, prevBudget, prevSatisfactions,
    selectedDecisions: [], availableDecisions: nextDecisions, usedOnceDecisions: newUsedOnce,
    decisionHistory: newDecisionHistory, recurringEffects: { budget: recurringTotal }, recurringIncomes: newRecurringIncomes,
    currentEvent: nextEvent, eventQueue: newEventQueue, history: [...state.history, snapshot],
    globalRankIdx, zvenigorodScore: zvScore,
    turnRevenue: revenue,
    turnExpenses: mandatory + selectedIds.reduce((s, id) => { const d = ALL_DECISIONS.find(x => x.id === id); return s + (d ? Math.round(d.cost * (newCostMultiplier || 1)) : 0); }, 0),
    seed: rng.getSeed(), costMultiplier: newCostMultiplier, costMultiplierTurns: newCostMultiplierTurns,
    satisfactions, defaulted, usedEventIds: newUsedEventIds, lastTurnDecisionIds: selectedIds,
    approval: newApproval, neverHadDebt, negativeStreak, negativeStreakMax, worstRank,
    achievements: [...state.achievements, ...newAchievements], newAchievements,
    overtakeMsg, news, electionPromise: state.electionPromise, electionResult: state.electionResult,
    advisorComments: nextDecisions.length ? generateAdvisorComments(nextDecisions, { ...state, metrics }, rng) : {},
    onboardingStep: state.onboardingStep,
    // v3 config
    scenarioId: state.scenarioId, difficultyId: state.difficultyId, difficulty: state.difficulty, scenario: state.scenario,
    // v3 systems
    npcs: updatedNPCs, npcLetters: letterWriters, npcDepartures: departed, npcArrivals: arrived,
    deputies: state.deputies, dumaVotePending: null, dumaVoteResult: state.dumaVoteResult,
    blockedDecisions: state.blockedDecisions || [], corruptionEvents: state.corruptionEvents || [],
    economy: newEconomy, projects: newProjects, projectProblems: newProjectProblems, pendingContractorChoice: null,
    activeCrisis: newActiveCrisis, resolvedCrises: newResolvedCrises, crisisActionChosen: false,
    neighborRelations: newNeighborRelations, diplomaticResults: [], completedJointProjects: newCompletedJointProjects,
    activeProtests: newActiveProtests, approvalHistory, exiled, resolvedProtests: newResolvedProtests,
  };
}

// ── Reducer ──

export function gameReducer(state, action) {
  switch (action.type) {
    case "START_GAME": {
      const s = createInitialState(action.seed || Date.now(), action.scenarioId, action.difficultyId);
      const rng = createRNG(s.seed);
      const evt = selectEvent(s, rng);
      return { ...s, phase: evt ? "event" : "decisions", currentEvent: evt, seed: rng.getSeed(), onboardingStep: 1 };
    }
    case "SELECT_DECISION": {
      const id = action.id;
      const maxPicks = (state.difficulty || {}).maxPicks || MAX_PICKS;
      const sel = state.selectedDecisions.includes(id)
        ? state.selectedDecisions.filter(x => x !== id)
        : state.selectedDecisions.length < maxPicks ? [...state.selectedDecisions, id] : state.selectedDecisions;
      return { ...state, selectedDecisions: sel };
    }
    case "SUBMIT_DECISIONS":
      return processTurn(state, state.selectedDecisions, null);
    case "CONTINUE_EVENT":
      return { ...state, phase: "decisions" };
    case "CHOOSE_EVENT":
      return { ...state, phase: "decisions", eventChoiceIndex: action.index };
    case "SUBMIT_WITH_EVENT":
      return processTurn(state, state.selectedDecisions, state.eventChoiceIndex ?? null);
    case "NEXT_TURN": {
      if (state.turn >= MAX_TURNS || state.defaulted || state.exiled) return { ...state, phase: "end" };
      if (state.turn === ELECTION_TURN) return { ...state, phase: "election_campaign" };
      if (state.activeCrisis && !state.crisisActionChosen) return { ...state, phase: "crisis" };
      if (state.currentEvent) return { ...state, phase: "event" };
      return { ...state, phase: "decisions" };
    }
    case "CRISIS_ACTION": {
      const phase = getCurrentCrisisPhase(state.activeCrisis);
      if (!phase) return state;
      const emergAction = phase.emergencyActions[action.actionIdx];
      if (!emergAction) return { ...state, crisisActionChosen: true };
      const effects = emergAction.effects || {};
      const newMetrics = { ...state.metrics };
      for (const [k, v] of Object.entries(effects)) newMetrics[k] = Math.max(0, Math.min(100, (newMetrics[k] || 0) + v));
      return {
        ...state,
        metrics: newMetrics,
        budget: state.budget - (emergAction.cost || 0) + (emergAction.budgetBonus || 0),
        debt: state.debt + (emergAction.debtAdd || 0),
        approval: Math.max(0, Math.min(100, state.approval + (emergAction.approvalDelta || 0))),
        crisisActionChosen: true,
        phase: state.currentEvent ? "event" : "decisions",
      };
    }
    case "SKIP_CRISIS_ACTION":
      return { ...state, crisisActionChosen: true, phase: state.currentEvent ? "event" : "decisions" };
    case "START_ELECTION":
      return { ...state, phase: "election_vote" };
    case "ELECTION_RESULT": {
      const rng = createRNG(state.seed);
      const opponent = rng.pick(OPPONENTS);
      const startScore = state.history[0]?.zvScore || 38;
      const attrGrowth = ((state.zvenigorodScore - startScore) / Math.max(1, startScore)) * 100;
      const popGrowth = ((state.population - INIT_POP) / INIT_POP) * 100;
      const noBankBonus = state.neverHadDebt ? 100 : (state.debt < 500 ? 50 : 0);
      const randomF = rng.nextInt(0, 100);
      const winProb = state.approval * 0.40 + attrGrowth * 0.25 + popGrowth * 0.15 + noBankBonus * 0.10 + randomF * 0.10;
      const won = winProb >= 50;
      const votePercent = Math.max(30, Math.min(70, 50 + (winProb - 50) * 0.4));
      const resultPhase = won ? "election_result" : "election_loss";
      return { ...state, phase: resultPhase, electionResult: { won, votePercent: Math.round(votePercent * 10) / 10, opponent }, seed: rng.getSeed() };
    }
    case "CHOOSE_PROMISE": {
      const promise = ELECTION_PROMISES[action.index];
      const newMetrics = { ...state.metrics };
      for (const [k, v] of Object.entries(promise.bonus)) newMetrics[k] = Math.min(100, (newMetrics[k] || 0) + v);
      return { ...state, electionPromise: promise, metrics: newMetrics };
    }
    case "START_SECOND_TERM": {
      const rng = createRNG(state.seed);
      const decisions = generateAvailableDecisions(state, rng);
      const evt = selectEvent(state, rng);
      const advisorComments = generateAdvisorComments(decisions, state, rng);
      return { ...state, phase: evt ? "event" : "decisions", currentEvent: evt, availableDecisions: decisions, seed: rng.getSeed(), advisorComments };
    }
    case "DISMISS_ONBOARDING":
      return { ...state, onboardingStep: 0 };
    case "NEXT_ONBOARDING":
      return { ...state, onboardingStep: state.onboardingStep >= 4 ? 0 : state.onboardingStep + 1 };
    case "APPLY_DIPLOMATIC_ACTION": {
      const { neighborId, actionId } = action;
      const rng = createRNG(state.seed);
      const { relations, effects, cost } = applyDiplomaticAction(
        state.neighborRelations, neighborId, actionId, rng, state.metrics
      );
      const newMetrics = { ...state.metrics };
      for (const [k, v] of Object.entries(effects || {})) {
        newMetrics[k] = Math.max(0, Math.min(100, (newMetrics[k] || 0) + v));
      }
      return { ...state, neighborRelations: relations, budget: state.budget - (cost || 0), metrics: newMetrics, seed: rng.getSeed() };
    }
    case "ELECTION_LOSS_END":
      return { ...state, phase: "end" };
    case "RESTART_FRESH":
      return { ...createInitialState(Date.now()), phase: "start" };
    case "RESTART":
      return { ...createInitialState(Date.now(), state.scenarioId, state.difficultyId), phase: "start" };
    default:
      return state;
  }
}

// ── Re-exports for UI convenience ──

export { METRIC_KEYS, MAX_TURNS, MAX_PICKS, ELECTION_TURN, INIT_POP };
export { METRICS_CFG, GROUPS, DIFFICULTIES, SCENARIOS } from "./constants.js";
export { ALL_DECISIONS };
export { ALL_EVENTS, ADVISORS, OPPONENTS, ACHIEVEMENTS, ELECTION_PROMISES };
export { WORLD_CITIES };
export { getGrade, getPlayStyle };
export { calcGroupSatisfactions, calcAvgSatisfaction } from "./calculator.js";
