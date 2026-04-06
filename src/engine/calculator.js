import { METRIC_KEYS, GROUPS, GROUP_KEYS, SEASON_EFFECTS } from "./constants.js";

// Per-metric decay: higher metrics decay faster. decayMult from difficulty (default 1.0)
// Metrics ≤15 don't decay. Decay = (val-15)/40 * decayMult, so ~1/turn at 55 on normal.
export function calcDecay(val, decayMult = 1) {
  if (val <= 15) return 0;
  const raw = ((val - 15) / 40) * decayMult;
  return Math.max(0, Math.round(raw * 10) / 10); // keep one decimal for fractional accumulation
}

export function applyDecay(metrics, decayMult = 1) {
  const m = { ...metrics };
  for (const k of METRIC_KEYS) {
    const decay = calcDecay(m[k], decayMult);
    m[k] = Math.max(0, m[k] - Math.round(decay));
  }
  return m;
}

export function applySeason(metrics, turn) {
  const season = turn % 4;
  const fx = SEASON_EFFECTS[season];
  const m = { ...metrics };
  for (const [k, v] of Object.entries(fx)) m[k] = (m[k] || 0) + v;
  return m;
}

export function clampMetrics(metrics) {
  const m = { ...metrics };
  for (const k of METRIC_KEYS) m[k] = Math.max(0, Math.min(100, Math.round(m[k])));
  return m;
}

export function calcSatisfaction(metrics, weights) {
  let s = 0;
  for (const [k, w] of Object.entries(weights)) s += (metrics[k] || 0) * w;
  return Math.round(s * 10) / 10;
}

export function calcGroupSatisfactions(metrics) {
  const r = {};
  for (const [gk, g] of Object.entries(GROUPS)) r[gk] = calcSatisfaction(metrics, g.weights);
  return r;
}

export function calcAvgSatisfaction(sats) {
  const v = Object.values(sats);
  return v.reduce((a, b) => a + b, 0) / v.length;
}

export function calcApproval(groupSatisfactions) {
  return calcAvgSatisfaction(groupSatisfactions);
}

export function calcApprovalChange(prevMetrics, newMetrics, debt) {
  const avgOld = METRIC_KEYS.reduce((s, k) => s + prevMetrics[k], 0) / METRIC_KEYS.length;
  const avgNew = METRIC_KEYS.reduce((s, k) => s + newMetrics[k], 0) / METRIC_KEYS.length;
  let change = (avgNew - avgOld) * 0.5;
  if (debt > 200) change -= 3;
  for (const k of METRIC_KEYS) {
    if (newMetrics[k] < 10) change -= 5;
    else if (newMetrics[k] < 20) change -= 2;
  }
  return Math.round(change);
}

export function calcRevenue(pop, metrics, taxMult = 1) {
  const econF = metrics.economy / 100;
  const base = 200 + pop * 0.006;
  const bonus = econF * 200 + (metrics.culture / 100) * 60 + (metrics.infrastructure / 100) * 50 + (metrics.digital / 100) * 30;
  return Math.round((base + bonus) * taxMult);
}

export function calcMandatoryExpenses(pop, metrics) {
  const base = 150 + pop * 0.004;
  const maintenance = METRIC_KEYS.reduce((s, k) => s + Math.max(0, (metrics[k] - 40) * 0.2), 0);
  return Math.round(base + maintenance);
}

// migration based on avg satisfaction + rng
export function calcMigration(avgSat, rng) {
  let m = 0;
  if (avgSat > 60) m = (avgSat - 60) * 15 + rng.nextInt(-50, 50);
  else if (avgSat < 40) m = (avgSat - 40) * 20 + rng.nextInt(-50, 50);
  else m = rng.nextInt(-100, 100);
  return Math.round(m);
}
