import { METRIC_KEYS } from "./constants.js";

export const PROTEST_TYPES = [
  { id: "workers_strike", trigger: "economy", threshold: 15, name: "Забастовка рабочих",
    debuffs: { economy: -3, infrastructure: -2 }, approvalHit: -2, icon: "Briefcase" },
  { id: "crime_wave", trigger: "safety", threshold: 15, name: "Волна преступности",
    debuffs: { safety: -4, economy: -2, culture: -1 }, approvalHit: -3, icon: "Shield" },
  { id: "health_crisis", trigger: "healthcare", threshold: 15, name: "Кризис здравоохранения",
    debuffs: { healthcare: -3, education: -1 }, approvalHit: -2, icon: "Heart" },
  { id: "education_exodus", trigger: "education", threshold: 15, name: "Отток учителей",
    debuffs: { education: -4, culture: -1 }, approvalHit: -1, icon: "GraduationCap" },
  { id: "eco_protest", trigger: "ecology", threshold: 15, name: "Экологический протест",
    debuffs: { ecology: -2, economy: -2, culture: -1 }, approvalHit: -2, icon: "TreePine" },
  { id: "infra_collapse_protest", trigger: "infrastructure", threshold: 15, name: "Протест против разрухи",
    debuffs: { infrastructure: -3, safety: -2 }, approvalHit: -3, icon: "Building2" },
];

export function checkProtests(state) {
  const newProtests = [];
  const activeIds = (state.activeProtests || []).map(p => p.id);
  for (const pt of PROTEST_TYPES) {
    if (activeIds.includes(pt.id)) continue;
    if ((state.metrics[pt.trigger] || 0) < pt.threshold) {
      newProtests.push({ ...pt, startTurn: state.turn, turnsActive: 0 });
    }
  }
  return newProtests;
}

export function processProtests(activeProtests, metrics, turn) {
  const continuing = [];
  const metricChanges = {};
  let approvalDelta = 0;

  for (const protest of activeProtests) {
    if (metrics[protest.trigger] >= protest.threshold + 10) {
      continue;
    }
    const updated = { ...protest, turnsActive: protest.turnsActive + 1 };
    continuing.push(updated);
    for (const [k, v] of Object.entries(protest.debuffs)) {
      metricChanges[k] = (metricChanges[k] || 0) + v;
    }
    approvalDelta += protest.approvalHit;
  }

  return { activeProtests: continuing, metricChanges, approvalDelta };
}
