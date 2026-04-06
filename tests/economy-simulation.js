/**
 * Economy balance simulation — tests all 4 difficulty levels over 40 turns.
 *
 * Simulates an "average" player making reasonable (but not optimal) decisions:
 * - Picks 2 cheapest available decisions each turn (1 for hardcore)
 * - Always accepts positive events, rejects risky ones
 * - No tax changes (stays at 10%)
 * - Standard scenario only
 *
 * Run: node tests/economy-simulation.js
 */

import { createRNG } from "../src/engine/random.js";
import {
  METRIC_KEYS, INIT_METRICS, INIT_BUDGET, INIT_POP, MAX_TURNS,
  DIFFICULTIES, SCENARIOS, SEASON_EFFECTS,
} from "../src/engine/constants.js";
import {
  applyDecay, applySeason, clampMetrics,
  calcGroupSatisfactions, calcAvgSatisfaction,
  calcRevenue, calcMandatoryExpenses, calcMigration,
} from "../src/engine/calculator.js";
import { createInitialEconomy, updateEconomy, getTaxRevenueMultiplier } from "../src/engine/economyEngine.js";
import { ALL_DECISIONS } from "../src/engine/decisions.js";

// ── Simulation config ──

const SEEDS = [42, 137, 2025, 7777, 31415]; // 5 seeds for statistical averaging
const DIFFICULTY_IDS = ["easy", "normal", "hard", "hardcore"];
const SCENARIO = SCENARIOS[0]; // standard

// ── Simulate one full game ──

function simulateGame(seed, difficultyId) {
  const rng = createRNG(seed);
  const difficulty = DIFFICULTIES[difficultyId];
  const maxPicks = difficulty.maxPicks;
  const decayMult = difficulty.decayMult;
  const revenueMult = difficulty.revenueMult;
  const taxMult = getTaxRevenueMultiplier(10); // default 10% tax

  let metrics = { ...INIT_METRICS };
  let budget = Math.round(INIT_BUDGET * difficulty.budgetMult);
  let debt = 0;
  let population = INIT_POP;
  let economy = createInitialEconomy(SCENARIO);
  const usedOnce = new Set();
  const decisionHistory = {};
  let defaulted = false;
  let bankruptTurn = null;
  let costMultiplier = 1;

  const turnLog = [];

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const prevMetrics = { ...metrics };
    const prevBudget = budget;

    // ── 1. Decay + season ──
    metrics = applyDecay(metrics, decayMult);
    metrics = applySeason(metrics, turn);

    // ── 2. Simulate event (random budget impact based on probability) ──
    let eventBudget = 0;
    if (rng.next() < difficulty.eventProb) {
      // Simulate average event impact: mix of positive and negative
      const eventRoll = rng.next();
      if (eventRoll < 0.3) {
        // Positive event
        eventBudget = rng.nextInt(15, 100);
      } else if (eventRoll < 0.7) {
        // Neutral/minor negative
        eventBudget = rng.nextInt(-50, 0);
      } else {
        // Major negative
        eventBudget = rng.nextInt(-80, -20);
        // Negative metric impact
        const worstKey = METRIC_KEYS[rng.nextInt(0, METRIC_KEYS.length - 1)];
        metrics[worstKey] = Math.max(0, metrics[worstKey] - rng.nextInt(2, 6));
      }
    }
    budget += eventBudget;

    // ── 3. Pick decisions (cheapest available, up to maxPicks) ──
    const available = ALL_DECISIONS.filter(d => {
      if (d.once && usedOnce.has(d.id)) return false;
      if (d.requires) {
        for (const [k, v] of Object.entries(d.requires)) {
          if ((metrics[k] || 0) < v) return false;
        }
      }
      return true;
    });

    // Sort by cost-effectiveness: effects sum / cost
    const scored = available.map(d => {
      const totalEffect = Object.values(d.effects).reduce((a, b) => a + b, 0);
      const effectiveCost = Math.max(1, d.cost * costMultiplier);
      return { ...d, score: totalEffect / effectiveCost };
    }).sort((a, b) => b.score - a.score);

    // Pick top N that we can afford
    let turnCost = 0;
    const picked = [];
    for (const d of scored) {
      if (picked.length >= maxPicks) break;
      const cost = Math.round(d.cost * costMultiplier);
      if (budget - turnCost - cost >= -50) { // allow slight overspend
        picked.push(d);
        turnCost += cost;
      }
    }

    // Apply decisions
    for (const dec of picked) {
      const timesUsed = decisionHistory[dec.id] || 0;
      const multiplier = Math.pow(0.7, timesUsed);
      for (const [k, v] of Object.entries(dec.effects)) {
        metrics[k] = (metrics[k] || 0) + v * multiplier;
      }
      budget -= Math.round(dec.cost * costMultiplier);
      if (dec.once) usedOnce.add(dec.id);
      if (dec.populationEffect) population += dec.populationEffect;
      decisionHistory[dec.id] = timesUsed + 1;
    }

    // ── 4. Mandatory expenses & revenue ──
    const expenseMult = difficulty.expenseMult || 1;
    const mandatory = Math.round(calcMandatoryExpenses(population, metrics) * expenseMult);
    budget -= mandatory;
    const revenue = calcRevenue(population, metrics, taxMult * revenueMult);
    budget += revenue;

    // ── 5. Debt processing ──
    if (budget < 0) {
      debt += Math.abs(budget);
      budget = 0;
    }
    const interestRate = debt < 100 ? 0.03 : debt < 300 ? 0.06 : debt < 500 ? 0.10 : 0.15;
    debt = Math.round(debt * (1 + interestRate));

    // Debt penalties
    if (debt > 200) {
      for (const k of METRIC_KEYS) metrics[k] -= 1;
    }
    if (debt > 300) {
      for (const k of METRIC_KEYS) metrics[k] -= 2;
    }
    if (debt > 500) {
      for (const k of METRIC_KEYS) metrics[k] -= 3;
    }
    if (debt > 700) {
      defaulted = true;
      if (!bankruptTurn) bankruptTurn = turn;
    }

    // Debt repayment
    if (debt > 0 && budget > 0) {
      const minPay = Math.min(budget, Math.max(20, Math.round(debt * 0.1)));
      budget -= minPay;
      debt -= minPay;
    }

    // ── 6. Clamp metrics ──
    metrics = clampMetrics(metrics);

    // ── 7. Economy update ──
    economy = updateEconomy(economy, metrics, population);

    // ── 8. Migration ──
    const satisfactions = calcGroupSatisfactions(metrics);
    const avgSat = calcAvgSatisfaction(satisfactions);
    const migration = calcMigration(avgSat, rng);
    population += migration + Math.round(population * 0.001);
    population = Math.max(1000, population);

    // ── Log ──
    const avgMetric = METRIC_KEYS.reduce((s, k) => s + metrics[k], 0) / METRIC_KEYS.length;
    turnLog.push({
      turn: turn + 1,
      budget: Math.round(budget),
      debt: Math.round(debt),
      revenue,
      mandatory,
      netIncome: revenue - mandatory,
      population,
      avgMetric: Math.round(avgMetric * 10) / 10,
      avgSat: Math.round(avgSat * 10) / 10,
      decisionsCost: turnCost,
      eventBudget,
      defaulted,
    });
  }

  return { turnLog, defaulted, bankruptTurn, finalMetrics: metrics, finalBudget: budget, finalDebt: debt, finalPop: population };
}

// ── Run all simulations ──

console.log("═══════════════════════════════════════════════════════════════");
console.log("   ECONOMY BALANCE SIMULATION — Zvenigorod Mayor");
console.log("   5 seeds × 4 difficulties × 40 turns = 800 turn simulations");
console.log("═══════════════════════════════════════════════════════════════\n");

const results = {};

for (const diffId of DIFFICULTY_IDS) {
  const diff = DIFFICULTIES[diffId];
  const runs = SEEDS.map(seed => simulateGame(seed, diffId));

  // Aggregate stats
  const stats = {
    label: diff.label,
    startBudget: Math.round(INIT_BUDGET * diff.budgetMult),
    bankruptcies: runs.filter(r => r.defaulted).length,
    avgBankruptTurn: runs.filter(r => r.bankruptTurn).reduce((s, r) => s + r.bankruptTurn, 0) / Math.max(1, runs.filter(r => r.bankruptTurn).length),

    // Final state averages
    avgFinalBudget: Math.round(runs.reduce((s, r) => s + r.finalBudget, 0) / runs.length),
    avgFinalDebt: Math.round(runs.reduce((s, r) => s + r.finalDebt, 0) / runs.length),
    avgFinalPop: Math.round(runs.reduce((s, r) => s + r.finalPop, 0) / runs.length),

    // Per-turn averages (across all seeds)
    turnAvgs: [],
  };

  // Calculate per-turn averages
  for (let t = 0; t < MAX_TURNS; t++) {
    const turnData = runs.map(r => r.turnLog[t]);
    stats.turnAvgs.push({
      turn: t + 1,
      budget: Math.round(turnData.reduce((s, d) => s + d.budget, 0) / runs.length),
      debt: Math.round(turnData.reduce((s, d) => s + d.debt, 0) / runs.length),
      revenue: Math.round(turnData.reduce((s, d) => s + d.revenue, 0) / runs.length),
      mandatory: Math.round(turnData.reduce((s, d) => s + d.mandatory, 0) / runs.length),
      netIncome: Math.round(turnData.reduce((s, d) => s + d.netIncome, 0) / runs.length),
      avgMetric: Math.round(turnData.reduce((s, d) => s + d.avgMetric, 0) / runs.length * 10) / 10,
      avgSat: Math.round(turnData.reduce((s, d) => s + d.avgSat, 0) / runs.length * 10) / 10,
      decisionsCost: Math.round(turnData.reduce((s, d) => s + d.decisionsCost, 0) / runs.length),
    });
  }

  // Final metrics averages
  const avgFinalMetrics = {};
  for (const k of METRIC_KEYS) {
    avgFinalMetrics[k] = Math.round(runs.reduce((s, r) => s + r.finalMetrics[k], 0) / runs.length);
  }
  stats.avgFinalMetrics = avgFinalMetrics;

  results[diffId] = stats;
}

// ── Print results ──

for (const diffId of DIFFICULTY_IDS) {
  const s = results[diffId];
  console.log(`\n${"═".repeat(70)}`);
  console.log(`  ${s.label.toUpperCase()} (${diffId})`);
  console.log(`  Start budget: ${s.startBudget} | Bankruptcies: ${s.bankruptcies}/5`);
  if (s.bankruptcies > 0) console.log(`  Avg bankrupt turn: ${Math.round(s.avgBankruptTurn)}`);
  console.log(`${"═".repeat(70)}`);

  // Key turns table
  console.log("\n  Turn │ Budget │  Debt │ Revenue │ Expenses │ Net │ AvgMetric │ Satisfaction");
  console.log("  ─────┼────────┼───────┼─────────┼──────────┼─────┼───────────┼─────────────");
  const keyTurns = [0, 4, 9, 14, 19, 24, 29, 34, 39];
  for (const t of keyTurns) {
    if (t >= s.turnAvgs.length) continue;
    const d = s.turnAvgs[t];
    console.log(
      `  ${String(d.turn).padStart(4)} │ ${String(d.budget).padStart(6)} │ ${String(d.debt).padStart(5)} │ ${String(d.revenue).padStart(7)} │ ${String(d.mandatory).padStart(8)} │ ${String(d.netIncome).padStart(3)} │ ${String(d.avgMetric).padStart(9)} │ ${String(d.avgSat).padStart(9)}`
    );
  }

  console.log(`\n  Final state (avg across ${SEEDS.length} seeds):`);
  console.log(`    Budget: ${s.avgFinalBudget} | Debt: ${s.avgFinalDebt} | Population: ${s.avgFinalPop}`);
  console.log(`    Metrics: ${Object.entries(s.avgFinalMetrics).map(([k,v]) => `${k}:${v}`).join(", ")}`);
}

// ── Balance Analysis ──

console.log(`\n\n${"═".repeat(70)}`);
console.log("  BALANCE ANALYSIS");
console.log(`${"═".repeat(70)}`);

for (const diffId of DIFFICULTY_IDS) {
  const s = results[diffId];
  const issues = [];

  // Check budget trajectory
  const midBudget = s.turnAvgs[19]?.budget || 0;
  const finalBudget = s.avgFinalBudget;
  const finalDebt = s.avgFinalDebt;
  const avgNet = s.turnAvgs.reduce((sum, t) => sum + t.netIncome, 0) / s.turnAvgs.length;
  const finalAvgMetric = Object.values(s.avgFinalMetrics).reduce((a, b) => a + b, 0) / METRIC_KEYS.length;

  // Budget health checks
  if (s.bankruptcies >= 3) issues.push(`CRITICAL: Too many bankruptcies (${s.bankruptcies}/5) — economy too punishing`);
  if (diffId === "easy" && s.bankruptcies > 0) issues.push("CRITICAL: Easy mode should never bankrupt");
  if (diffId === "normal" && s.bankruptcies > 1) issues.push("WARNING: Normal mode too many bankruptcies");

  // Net income checks
  if (avgNet < -30) issues.push(`WARNING: Average net income heavily negative (${Math.round(avgNet)}/turn) — player bleeds money`);
  if (diffId === "easy" && avgNet < 0) issues.push(`WARNING: Easy mode has negative net income (${Math.round(avgNet)}) — should be slightly positive`);
  if (diffId === "normal" && avgNet < -20) issues.push(`WARNING: Normal mode net income too negative (${Math.round(avgNet)})`);

  // Debt spiral check
  if (finalDebt > 500) issues.push(`CRITICAL: Final debt ${finalDebt} causes death spiral`);
  if (finalDebt > 300 && diffId !== "hardcore") issues.push(`WARNING: High final debt ${finalDebt} — may cause runaway debt`);

  // Metric health
  if (finalAvgMetric < 15) issues.push(`CRITICAL: Metrics collapsed to ${Math.round(finalAvgMetric)} — unplayable`);
  if (finalAvgMetric < 25 && diffId !== "hardcore") issues.push(`WARNING: Metrics very low (${Math.round(finalAvgMetric)}) — game feels hopeless`);
  if (diffId === "easy" && finalAvgMetric < 40) issues.push(`WARNING: Easy mode metrics too low (${Math.round(finalAvgMetric)})`);

  // Budget accumulation (too easy check)
  if (diffId === "easy" && finalBudget > 3000) issues.push(`INFO: Easy mode too generous — budget ${finalBudget} feels unchallenging`);
  if (diffId === "normal" && finalBudget > 2000) issues.push(`INFO: Normal mode excess budget ${finalBudget}`);

  // Decision affordability
  const avgDecCost = s.turnAvgs.reduce((sum, t) => sum + t.decisionsCost, 0) / s.turnAvgs.length;
  if (avgDecCost < 50 && diffId !== "hardcore") issues.push(`WARNING: Players spending very little (${Math.round(avgDecCost)}/turn) — decisions too expensive or budget too tight`);

  // Population
  if (s.avgFinalPop < 15000) issues.push(`WARNING: Population declined to ${s.avgFinalPop} — city dying`);

  console.log(`\n  ${s.label} (${diffId}):`);
  if (issues.length === 0) {
    console.log("    ✓ No major balance issues detected");
  } else {
    for (const issue of issues) {
      const prefix = issue.startsWith("CRITICAL") ? "🔴" : issue.startsWith("WARNING") ? "🟡" : "🔵";
      console.log(`    ${prefix} ${issue}`);
    }
  }
}

// ── Revenue vs Expenses Breakdown ──

console.log(`\n\n${"═".repeat(70)}`);
console.log("  REVENUE vs EXPENSES (Turn 1 and Turn 20 averages)");
console.log(`${"═".repeat(70)}`);

for (const diffId of DIFFICULTY_IDS) {
  const s = results[diffId];
  const t1 = s.turnAvgs[0];
  const t20 = s.turnAvgs[19];
  const t40 = s.turnAvgs[39];

  console.log(`\n  ${s.label}:`);
  console.log(`    Turn  1: Revenue ${t1.revenue} - Mandatory ${t1.mandatory} = Net ${t1.netIncome} | Decisions cost: ${t1.decisionsCost}`);
  console.log(`    Turn 20: Revenue ${t20.revenue} - Mandatory ${t20.mandatory} = Net ${t20.netIncome} | Decisions cost: ${t20.decisionsCost}`);
  console.log(`    Turn 40: Revenue ${t40.revenue} - Mandatory ${t40.mandatory} = Net ${t40.netIncome} | Decisions cost: ${t40.decisionsCost}`);
}

// ── Metric Decay Analysis ──

console.log(`\n\n${"═".repeat(70)}`);
console.log("  METRIC DECAY ANALYSIS");
console.log(`${"═".repeat(70)}`);

for (const diffId of DIFFICULTY_IDS) {
  const diff = DIFFICULTIES[diffId];
  console.log(`\n  ${diff.label} (decayMult: ${diff.decayMult}):`);

  // Simulate pure decay (no decisions) for reference
  let testMetrics = { ...INIT_METRICS };
  for (let t = 0; t < 10; t++) {
    testMetrics = applyDecay(testMetrics, diff.decayMult);
    testMetrics = clampMetrics(testMetrics);
  }
  const avgAfter10 = METRIC_KEYS.reduce((s, k) => s + testMetrics[k], 0) / METRIC_KEYS.length;

  let testMetrics20 = { ...INIT_METRICS };
  for (let t = 0; t < 20; t++) {
    testMetrics20 = applyDecay(testMetrics20, diff.decayMult);
    testMetrics20 = clampMetrics(testMetrics20);
  }
  const avgAfter20 = METRIC_KEYS.reduce((s, k) => s + testMetrics20[k], 0) / METRIC_KEYS.length;

  console.log(`    Pure decay (no decisions): avg metric after 10 turns: ${Math.round(avgAfter10 * 10) / 10}, after 20 turns: ${Math.round(avgAfter20 * 10) / 10}`);
  console.log(`    Starting avg: ${Math.round(METRIC_KEYS.reduce((s, k) => s + INIT_METRICS[k], 0) / METRIC_KEYS.length * 10) / 10}`);
  console.log(`    Decay rate per turn (avg at start): ${Math.round((METRIC_KEYS.reduce((s, k) => s + INIT_METRICS[k], 0) / METRIC_KEYS.length - avgAfter10 / 1) / 1 * 10) / 10} over 10 turns`);
}

// ── Ideal Balance Targets ──

console.log(`\n\n${"═".repeat(70)}`);
console.log("  IDEAL BALANCE TARGETS");
console.log(`${"═".repeat(70)}`);
console.log(`
  Easy:     0% bankruptcies, metrics 45-65, positive net income, tutorial-friendly
  Normal:   0-20% bankruptcies, metrics 30-50, tight but manageable budget
  Hard:     20-40% bankruptcies, metrics 20-40, strategic budget management needed
  Hardcore: 40-80% bankruptcies, metrics 10-30, extreme challenge, survival mode
`);

console.log("Done.\n");
