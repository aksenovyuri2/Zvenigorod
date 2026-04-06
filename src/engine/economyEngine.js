const TAX_TABLE = {
  5:  { revenueMult: 0.7,  econEffect: 4,  businessEffect: 1 },
  8:  { revenueMult: 0.85, econEffect: 2,  businessEffect: 0 },
  10: { revenueMult: 1.0,  econEffect: 0,  businessEffect: 0 },
  12: { revenueMult: 1.1,  econEffect: -2, businessEffect: -1 },
  15: { revenueMult: 1.2,  econEffect: -5, businessEffect: -2 },
};

const VALID_RATES = [5, 8, 10, 12, 15];

export function createInitialEconomy(scenario = {}) {
  const base = {
    gdp: 12000,
    unemployment: 12,
    avgSalary: 45000,
    housingPrice: 85000,
    costOfLiving: 75,
    businessCount: 8,
    taxRate: 10,
    inflation: 4,
    lastTaxChangeTurn: -4,
  };
  if (scenario.id === "post_crisis") {
    return { ...base, gdp: 8000, unemployment: 20, avgSalary: 35000, businessCount: 5, inflation: 8 };
  }
  if (scenario.id === "golden") {
    return { ...base, gdp: 15000, businessCount: 12, avgSalary: 55000 };
  }
  return { ...base };
}

export function updateEconomy(econ, metrics, pop) {
  const economy = metrics.economy || 30;
  const unemployment = Math.max(0, Math.min(30, 15 - economy * 0.12 - econ.businessCount * 0.05));
  const avgRevenue = econ.gdp / Math.max(1, econ.businessCount);
  const gdp = Math.round(econ.businessCount * avgRevenue * (1 - unemployment / 100) * (pop / 25000));
  const avgSalary = Math.round(35000 * (1 + economy / 200) * (1 - unemployment / 50));
  const realAttractiveness = (economy + (metrics.culture || 0) + (metrics.ecology || 0)) / 3;
  const housingPrice = Math.round(70000 * (1 + pop / 50000) * (1 + realAttractiveness / 200));
  const costOfLiving = Math.round(60 + housingPrice / 1500 + econ.inflation * 2);

  // Business dynamics
  let businessCount = econ.businessCount;
  if (economy > 40 && economy > (metrics.economy || 0) - 3) {
    businessCount = Math.min(30, businessCount + (Math.random() < 0.3 ? 1 : 0));
  }
  if (economy < 30) {
    businessCount = Math.max(2, businessCount - (Math.random() < 0.2 ? 1 : 0));
  }

  const inflation = Math.max(0, Math.min(20, econ.inflation + (Math.random() < 0.5 ? 0.5 : -0.5)));

  return {
    ...econ,
    gdp, unemployment: Math.round(unemployment * 10) / 10,
    avgSalary, housingPrice, costOfLiving, businessCount,
    inflation: Math.round(inflation * 10) / 10,
  };
}

export function applyTaxChange(econ, newRate, currentTurn) {
  if (!VALID_RATES.includes(newRate)) return econ;
  if (currentTurn - econ.lastTaxChangeTurn < 4) return econ;
  return { ...econ, taxRate: newRate, lastTaxChangeTurn: currentTurn };
}

export function getTaxRevenueMultiplier(rate) {
  return (TAX_TABLE[rate] || TAX_TABLE[10]).revenueMult;
}

export function getTaxEconomyEffect(rate) {
  return (TAX_TABLE[rate] || TAX_TABLE[10]).econEffect;
}

export function canChangeTax(econ, currentTurn) {
  return currentTurn - econ.lastTaxChangeTurn >= 4;
}
