// Meta-progression: Legacy system
// Points accumulate across runs and unlock permanent bonuses

export const LEGACY_TREE = [
  {
    id: "advisor_economist",
    name: "Советник «Финансист»",
    icon: "💰",
    cost: 50,
    desc: "+5% доходов каждый ран",
    effect: { incomeBonus: 0.05 },
  },
  {
    id: "advisor_ecologist",
    name: "Советник «Эколог»",
    icon: "🌿",
    cost: 50,
    desc: "Экология стартует +5",
    effect: { ecologyStart: 5 },
  },
  {
    id: "old_budget",
    name: "Старый бюджет",
    icon: "🏦",
    cost: 80,
    desc: "+100 к стартовому бюджету",
    effect: { budgetBonus: 100 },
  },
  {
    id: "scenario_legacy",
    name: "Сценарий «Наследие»",
    icon: "📜",
    cost: 100,
    desc: "Новый сценарий — начни с достижениями предшественника",
    effect: { unlocksScenario: "legacy" },
  },
  {
    id: "experienced_mayor",
    name: "Опытный мэр",
    icon: "🎩",
    cost: 150,
    desc: "+1 решение на выбор каждый ход",
    effect: { extraPick: 1 },
  },
  {
    id: "city_archives",
    name: "Архивы города",
    icon: "🗃️",
    cost: 200,
    desc: "Показывает статистику прошлых ранов в итогах",
    effect: { showHistory: true },
  },
  {
    id: "master_advisor",
    name: "Мастер-советник",
    icon: "🧙",
    cost: 300,
    desc: "Особый советник с уникальными советами каждый ход",
    effect: { masterAdvisor: true },
  },
];

const STORAGE_KEY = "zvenigorod_legacy";

export function getLegacyState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { points: 0, unlocked: [], runs: 0, bestGrade: null, bestScore: 0 };
    return JSON.parse(raw);
  } catch {
    return { points: 0, unlocked: [], runs: 0, bestGrade: null, bestScore: 0 };
  }
}

function saveLegacyState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

export function addLegacyPoints(zvScore, grade) {
  const multipliers = { S: 3, A: 2, B: 1.5, C: 1, D: 0.5, F: 0 };
  const mult = multipliers[grade] ?? 0;
  const earned = Math.round(zvScore * mult);
  const current = getLegacyState();
  const gradeOrder = ["F", "D", "C", "B", "A", "S"];
  const isBetter = !current.bestGrade || gradeOrder.indexOf(grade) > gradeOrder.indexOf(current.bestGrade);
  const next = {
    ...current,
    points: current.points + earned,
    runs: current.runs + 1,
    bestGrade: isBetter ? grade : current.bestGrade,
    bestScore: Math.max(current.bestScore || 0, zvScore),
  };
  saveLegacyState(next);
  return earned;
}

export function unlockLegacy(id) {
  const current = getLegacyState();
  const item = LEGACY_TREE.find(x => x.id === id);
  if (!item) return false;
  if (current.unlocked.includes(id)) return false;
  if (current.points < item.cost) return false;
  const next = {
    ...current,
    points: current.points - item.cost,
    unlocked: [...current.unlocked, id],
  };
  saveLegacyState(next);
  return true;
}

export function applyLegacyBonuses(initialState, legacyState) {
  if (!legacyState || !legacyState.unlocked || legacyState.unlocked.length === 0) return initialState;
  let state = { ...initialState };
  for (const id of legacyState.unlocked) {
    const item = LEGACY_TREE.find(x => x.id === id);
    if (!item) continue;
    const { effect } = item;
    if (effect.budgetBonus) state = { ...state, budget: state.budget + effect.budgetBonus };
    if (effect.ecologyStart) state = { ...state, metrics: { ...state.metrics, ecology: state.metrics.ecology + effect.ecologyStart } };
    if (effect.extraPick) state = { ...state, maxPicks: (state.maxPicks || 2) + effect.extraPick };
  }
  return state;
}

export function isFirstRun() {
  const s = getLegacyState();
  return s.runs === 0;
}
