export const CONTRACTORS = [
  { name: 'ООО «СтройМастер»',    reliability: 0.7,  costModifier: 1.0 },
  { name: 'ГК «МосИнжСтрой»',     reliability: 0.95, costModifier: 1.3 },
  { name: 'ИП Хасанов',           reliability: 0.5,  costModifier: 0.7 },
  { name: 'ООО «ЗвениСтрой»',     reliability: 0.8,  costModifier: 1.1 },
  { name: 'АО «ПромСтандарт»',    reliability: 0.85, costModifier: 1.2 },
  { name: 'ИП Козлов и партнёры', reliability: 0.6,  costModifier: 0.8 },
];

const PROBLEMS = [
  { type: "delay",     label: "Задержка",   desc: "Сроки сдвинулись на 1 квартал" },
  { type: "overrun",   label: "Перерасход", desc: "Затраты выросли на 20%" },
  { type: "scandal",   label: "Скандал",    desc: "Подрядчик ворует — газеты пишут", approvalDelta: -3 },
  { type: "defect",    label: "Брак",       desc: "Обнаружен строительный брак" },
];

export function shouldBeProject(decision) {
  return decision.cost > 80;
}

export function generateContractors(rng, count = 3) {
  return rng.shuffle([...CONTRACTORS]).slice(0, count);
}

export function createProject(decision, contractor) {
  const totalCost = Math.round(decision.cost * contractor.costModifier);
  const totalTurns = Math.max(2, Math.min(5, Math.ceil(decision.cost / 60)));
  const costPerTurn = Math.round(totalCost / totalTurns);

  const partialEffects = {};
  const fullEffects = {};
  for (const [k, v] of Object.entries(decision.effects || {})) {
    partialEffects[k] = Math.round(v * 0.3);
    fullEffects[k] = v;
  }

  return {
    decisionId: decision.id,
    name: decision.name,
    totalCost,
    paidCost: 0,
    costPerTurn,
    totalTurns,
    currentTurn: 0,
    status: "building",
    riskPerTurn: 15,
    partialEffects,
    fullEffects,
    contractor: { name: contractor.name, reliability: contractor.reliability, costModifier: contractor.costModifier },
  };
}

export function advanceProject(project, rng) {
  if (project.status !== "building") return { project, problem: null };

  const next = {
    ...project,
    currentTurn: project.currentTurn + 1,
    paidCost: project.paidCost + project.costPerTurn,
  };

  if (next.currentTurn >= next.totalTurns) {
    return { project: { ...next, status: "completed" }, problem: null };
  }

  const riskThreshold = next.riskPerTurn * (1 / next.contractor.reliability);
  const roll = rng.next() * 100;

  if (roll < riskThreshold) {
    const problem = rng.pick(PROBLEMS);
    let updated = { ...next };

    switch (problem.type) {
      case "delay":
        updated = { ...updated, totalTurns: updated.totalTurns + 1 };
        break;
      case "overrun": {
        const remaining = updated.totalCost - updated.paidCost;
        updated = { ...updated, totalCost: updated.totalCost + Math.round(remaining * 0.2) };
        updated = { ...updated, costPerTurn: Math.round((updated.totalCost - updated.paidCost) / (updated.totalTurns - updated.currentTurn)) };
        break;
      }
      case "defect": {
        const weakened = {};
        for (const [k, v] of Object.entries(updated.partialEffects)) {
          weakened[k] = Math.round(v * 0.5);
        }
        updated = { ...updated, partialEffects: weakened };
        break;
      }
      default:
        break;
    }
    return { project: updated, problem: { ...problem } };
  }

  return { project: next, problem: null };
}

export function getProjectsCostThisTurn(projects) {
  return projects
    .filter(p => p.status === "building")
    .reduce((sum, p) => sum + p.costPerTurn, 0);
}

export function getProjectsPartialEffects(projects) {
  const effects = {};
  for (const p of projects) {
    if (p.status !== "building") continue;
    for (const [k, v] of Object.entries(p.partialEffects)) {
      effects[k] = (effects[k] || 0) + v;
    }
  }
  return effects;
}

export function getCompletedProjectEffects(projects) {
  const effects = {};
  for (const p of projects) {
    if (p.status !== "completed") continue;
    for (const [k, v] of Object.entries(p.fullEffects)) {
      effects[k] = (effects[k] || 0) + v;
    }
  }
  return effects;
}
