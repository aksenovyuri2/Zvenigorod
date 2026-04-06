import { METRIC_KEYS } from "../engine/constants.js";
import {
  FIRST_NAMES_MALE,
  FIRST_NAMES_FEMALE,
  LAST_NAMES,
  PATRONYMICS_MALE,
  PATRONYMICS_FEMALE,
} from "../npc/npcNames.js";

export const FACTIONS = {
  progress:    { name: "Прогресс",                count: 2, priorities: ["digital","economy","culture"],       desc: "Молодые, хотят инноваций и роста", icon: "Rocket" },
  tradition:   { name: "Традиция",                count: 2, priorities: ["culture","ecology","safety"],        desc: "Консерваторы, защищают наследие", icon: "Landmark" },
  business:    { name: "Бизнес-клуб",             count: 1, priorities: ["economy","infrastructure"],          desc: "Предприниматели, хотят выгоду", icon: "Briefcase" },
  social:      { name: "Социальная справедливость", count: 1, priorities: ["healthcare","education","safety"],  desc: "За пенсионеров и детей", icon: "Heart" },
  independent: { name: "Независимый",              count: 1, priorities: [],                                    desc: "Непредсказуем, голосует по ситуации", icon: "HelpCircle" },
};

const DEPUTY_AVATARS = ["👩‍💼", "👨‍💻", "🧓", "👨‍💼", "💼", "👩‍⚕️", "🤷"];

export function generateDeputies(rng) {
  const deputies = [];
  let idx = 0;

  for (const [factionKey, faction] of Object.entries(FACTIONS)) {
    for (let i = 0; i < faction.count; i++) {
      const isFemale = rng.next() > 0.5;
      const firstName = rng.pick(isFemale ? FIRST_NAMES_FEMALE : FIRST_NAMES_MALE);
      const patronymic = rng.pick(isFemale ? PATRONYMICS_FEMALE : PATRONYMICS_MALE);
      let lastName = rng.pick(LAST_NAMES);
      if (isFemale && lastName.endsWith("ов")) lastName += "а";
      else if (isFemale && lastName.endsWith("ев")) lastName += "а";
      else if (isFemale && lastName.endsWith("ин")) lastName += "а";

      deputies.push({
        id: `deputy_${idx}`,
        name: `${firstName} ${patronymic} ${lastName}`,
        shortName: lastName + (isFemale && !lastName.endsWith("а") ? "" : ""),
        faction: factionKey,
        avatar: DEPUTY_AVATARS[idx % DEPUTY_AVATARS.length],
        loyalty: rng.nextInt(30, 60),
        corruptibility: rng.nextInt(10, 70),
        priorities: factionKey === "independent"
          ? rng.shuffle([...METRIC_KEYS]).slice(0, 2)
          : [...faction.priorities],
        voteHistory: [],
      });
      idx++;
    }
  }

  return deputies;
}

// Decision requires duma vote if expensive, has tradeoff, or is once+expensive
export function requiresDumaVote(decision) {
  if (decision.cost > 120) return true;
  // Check for negative effects (tradeoff)
  const hasNegative = Object.values(decision.effects || {}).some(v => v < 0);
  if (hasNegative) return true;
  if (decision.once && decision.cost > 80) return true;
  return false;
}

function getDeputyVoteIntent(deputy, decision, metrics) {
  let score = 0;

  // Check alignment of decision effects with deputy priorities
  for (const priority of deputy.priorities) {
    const effect = (decision.effects || {})[priority];
    if (effect > 0) score += effect * 2;
    if (effect < 0) score -= Math.abs(effect) * 3; // negatives weigh more
  }

  // Loyalty to mayor influence
  score += (deputy.loyalty - 50) * 0.3;

  // City needs: if a priority metric is low and decision helps, bonus
  for (const priority of deputy.priorities) {
    if ((metrics[priority] || 50) < 30 && (decision.effects || {})[priority] > 0) {
      score += 5;
    }
  }

  if (score > 5) return "for";
  if (score < -5) return "against";
  return "undecided";
}

export function predictVotes(deputies, decision, metrics) {
  return deputies.map(deputy => {
    const vote = getDeputyVoteIntent(deputy, decision, metrics);
    const faction = FACTIONS[deputy.faction];
    let reason = "";
    if (vote === "for") reason = `${faction.name}: решение совпадает с приоритетами фракции`;
    else if (vote === "against") reason = `${faction.name}: решение противоречит интересам фракции`;
    else reason = `${faction.name}: взвешивает за и против`;
    return { deputy, vote, reason };
  });
}

export function executeVote(deputies, decision, metrics) {
  const predictions = predictVotes(deputies, decision, metrics);

  // Resolve undecided based on loyalty
  const votes = predictions.map(p => {
    if (p.vote !== "undecided") return { ...p };
    // Undecided lean based on loyalty: >50 = lean for, <50 = lean against
    const resolved = p.deputy.loyalty > 50 ? "for" : "against";
    return { ...p, vote: resolved };
  });

  const forCount = votes.filter(v => v.vote === "for").length;
  const passed = forCount >= 4; // 4 out of 7 needed

  // Update vote history in deputies
  const updatedDeputies = deputies.map(d => {
    const v = votes.find(vv => vv.deputy.id === d.id);
    return {
      ...d,
      voteHistory: [...d.voteHistory, { decisionId: decision.id, vote: v ? v.vote : "abstain", turn: 0 }],
    };
  });

  return { passed, votes, margin: forCount, updatedDeputies };
}

// Mayor speech: +5 to +15 loyalty for undecided deputies
export function applySpeech(deputies, decision, metrics) {
  const predictions = predictVotes(deputies, decision, metrics);
  return deputies.map(d => {
    const p = predictions.find(pp => pp.deputy.id === d.id);
    if (p && p.vote === "undecided") {
      return { ...d, loyalty: Math.min(100, d.loyalty + 10) };
    }
    return d;
  });
}

// Compromise: reduce cost and effects by 30%
export function applyCompromise(decision) {
  const newEffects = {};
  for (const [k, v] of Object.entries(decision.effects || {})) {
    newEffects[k] = Math.round(v * 0.7);
  }
  return {
    ...decision,
    cost: Math.round(decision.cost * 0.7),
    effects: newEffects,
    compromised: true,
  };
}

// Pressure: +20 loyalty to target, -10 to others
export function applyPressure(deputies, targetIdx) {
  return deputies.map((d, i) => {
    if (i === targetIdx) return { ...d, loyalty: Math.min(100, d.loyalty + 20) };
    return { ...d, loyalty: Math.max(0, d.loyalty - 10) };
  });
}

// Impeachment check: approval < 15 and 5/7 deputies vote against
export function checkImpeachment(deputies, approval) {
  if (approval >= 15) return false;
  const against = deputies.filter(d => d.loyalty < 30).length;
  return against >= 5;
}
