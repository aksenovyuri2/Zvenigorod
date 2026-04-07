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
  // ── Phase 4 unlocks ──
  {
    id: "speed_bonus",
    name: "Быстрый старт",
    icon: "⚡",
    cost: 60,
    desc: "Первые 3 решения бесплатны",
    effect: { freeDecisions: 3 },
  },
  {
    id: "district_insight",
    name: "Знание районов",
    icon: "🗺️",
    cost: 80,
    desc: "Видишь скрытые потребности районов",
    effect: { districtInsight: true },
  },
  {
    id: "crisis_warning",
    name: "Система оповещения",
    icon: "🔔",
    cost: 100,
    desc: "Предупреждение за 1 ход до кризиса",
    effect: { crisisWarning: true },
  },
  {
    id: "budget_advisor",
    name: "Финансовый аналитик",
    icon: "📈",
    cost: 120,
    desc: "Прогноз бюджета на 3 хода вперёд",
    effect: { budgetForecast: true },
  },
  {
    id: "population_magnet",
    name: "Магнит для людей",
    icon: "🧲",
    cost: 150,
    desc: "+10% к миграции",
    effect: { migrationBonus: 0.1 },
  },
  {
    id: "event_preview",
    name: "Разведка событий",
    icon: "🔮",
    cost: 200,
    desc: "Видишь следующее событие заранее",
    effect: { eventPreview: true },
  },
  {
    id: "metric_shield",
    name: "Щит метрик",
    icon: "🛡️",
    cost: 250,
    desc: "Метрики не падают ниже 10",
    effect: { metricFloor: 10 },
  },
  {
    id: "prestige_title",
    name: "Почётный мэр",
    icon: "👑",
    cost: 500,
    desc: "Золотая рамка и титул «Почётный мэр Звенигорода»",
    effect: { prestigeTitle: true },
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

// ── Streak system ──

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysBetween(a, b) {
  return Math.round(Math.abs(new Date(a) - new Date(b)) / 86400000);
}

export function getStreak() {
  const ls = getLegacyState();
  return { streak: ls.streak || 0, lastPlayDate: ls.lastPlayDate || null, streakBest: ls.streakBest || 0 };
}

export function updateStreak() {
  const current = getLegacyState();
  const today = todayStr();
  const last = current.lastPlayDate;
  let streak = current.streak || 0;

  if (last === today) return { streak, mult: getStreakMultiplier(streak) };
  if (last && daysBetween(last, today) === 1) {
    streak += 1;
  } else if (!last || daysBetween(last, today) > 1) {
    streak = 1;
  }

  const next = { ...current, streak, lastPlayDate: today, streakBest: Math.max(current.streakBest || 0, streak) };
  saveLegacyState(next);
  return { streak, mult: getStreakMultiplier(streak) };
}

export function getStreakMultiplier(streak) {
  if (streak >= 14) return 3;
  if (streak >= 7) return 2;
  if (streak >= 3) return 1.5;
  return 1;
}

// ── Weekly challenge ──

const WEEKLY_KEY = "zvenigorod_weekly";

export function getWeeklyResult() {
  try {
    const raw = localStorage.getItem(WEEKLY_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const currentWeek = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
    if (data.week === currentWeek && data.year === now.getFullYear()) return data;
    return null;
  } catch { return null; }
}

export function saveWeeklyResult(score, grade) {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
  try {
    localStorage.setItem(WEEKLY_KEY, JSON.stringify({ week, year: now.getFullYear(), score, grade }));
  } catch {}
}
