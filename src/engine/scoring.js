import { METRIC_KEYS } from "./constants.js";
import { WORLD_CITIES } from "./cities.js";

export function calcZvenigorodScore(metrics, pop, sats) {
  let avgM = 0;
  for (const k of METRIC_KEYS) avgM += metrics[k];
  avgM /= METRIC_KEYS.length;
  const popBonus = Math.min(10, pop / 10000);
  const satVals = Object.values(sats);
  const minSat = Math.min(...satVals);
  const maxSat = Math.max(...satVals);
  const divBonus = maxSat > 0 ? Math.min(5, (minSat / maxSat) * 5) : 0;
  return Math.round((avgM * 0.85 + popBonus + divBonus) * 10) / 10;
}

export function getZvenigorodRankIdx(score, dynamicCities) {
  const cities = dynamicCities || WORLD_CITIES;
  const scores = dynamicCities
    ? [...dynamicCities.map(c => c.currentScore)].sort((a, b) => b - a)
    : cities.map(c => c.score);
  let idx = scores.length;
  for (let i = 0; i < scores.length; i++) {
    if (score >= scores[i]) { idx = i; break; }
  }
  return idx;
}

export function getGrade(rank, totalCities) {
  const pct = rank / totalCities;
  if (pct <= 0.05) return "S";
  if (pct <= 0.15) return "A";
  if (pct <= 0.35) return "B";
  if (pct <= 0.55) return "C";
  if (pct <= 0.75) return "D";
  return "F";
}

export function getPlayStyle(decisionHistory, decisions) {
  const catCounts = {};
  for (const [id, count] of Object.entries(decisionHistory)) {
    const d = decisions.find(x => x.id === id);
    if (d) catCounts[d.cat] = (catCounts[d.cat] || 0) + count;
  }
  const sorted = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
  if (!sorted.length) return "Неопределённый";
  const top = sorted[0][0];
  const styles = {
    infrastructure: "Строитель",
    digital: "Технократ",
    ecology: "Эколог",
    culture: "Культуртрегер",
    healthcare: "Гуманист",
    education: "Просветитель",
    safety: "Силовик",
    economy: "Капиталист",
    tradeoff: "Прагматик",
  };
  return styles[top] || "Универсал";
}
