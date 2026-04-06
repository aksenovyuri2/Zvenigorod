export const NEIGHBORS = [
  {
    id: "odintsovo", name: "Одинцово", icon: "🏙️",
    personality: "competitive", strength: 80,
    interests: ["economy", "infrastructure"],
    baseRelationship: 10,
    hostileAction: { desc: "Одинцово переманивает бизнес", effects: { economy: -3 } },
  },
  {
    id: "ruza", name: "Рузский район", icon: "🌾",
    personality: "cooperative", strength: 30,
    interests: ["ecology", "economy"],
    baseRelationship: 30,
    hostileAction: { desc: "Рузский район перенаправляет сточные воды", effects: { ecology: -4 } },
  },
  {
    id: "moscow", name: "Москва", icon: "🏛️",
    personality: "dominant", strength: 100,
    interests: ["infrastructure", "digital", "economy"],
    baseRelationship: 0,
    hostileAction: { desc: "Москва угрожает присоединением", approvalDelta: -5 },
  },
  {
    id: "istra", name: "Истра", icon: "⛪",
    personality: "friendly", strength: 40,
    interests: ["culture", "ecology"],
    baseRelationship: 25,
    hostileAction: { desc: "Истра перехватывает туристический поток", effects: { culture: -3 } },
  },
];

export const JOINT_PROJECTS = [
  {
    id: "bus_odintsovo", name: "Скоростной автобус Звенигород—Одинцово",
    partner: "odintsovo", costShare: 0.5, totalCost: 120,
    effects: { infrastructure: 8, economy: 4 }, duration: 3,
    relationshipRequired: 20,
  },
  {
    id: "farm_cluster", name: "Фермерский кластер",
    partner: "ruza", costShare: 0.4, totalCost: 100,
    effects: { ecology: 5, economy: 6 }, duration: 3,
    relationshipRequired: 15,
  },
  {
    id: "moscow_invest", name: "Москва инвестирует в Звенигород",
    partner: "moscow", costShare: 0, totalCost: 0,
    effects: { infrastructure: 10, digital: 8, culture: -5 }, duration: 4,
    relationshipRequired: 60,
  },
  {
    id: "golden_ring", name: "Золотое кольцо Подмосковья",
    partner: "istra", costShare: 0.5, totalCost: 70,
    effects: { culture: 7, economy: 5 }, duration: 2,
    relationshipRequired: 30,
  },
  {
    id: "eco_corridor", name: "Экологический коридор",
    partner: "ruza", costShare: 0.3, totalCost: 80,
    effects: { ecology: 8, healthcare: 3 }, duration: 3,
    relationshipRequired: 25,
  },
  {
    id: "tech_hub", name: "Совместный IT-хаб",
    partner: "odintsovo", costShare: 0.5, totalCost: 150,
    effects: { digital: 10, economy: 6 }, duration: 4,
    relationshipRequired: 40,
  },
];

export const DIPLOMATIC_ACTIONS = [
  { id: "joint_project", name: "Предложить совместный проект", baseCost: 0, relationshipDelta: 10 },
  { id: "trade_deal",    name: "Торговое соглашение",         baseCost: 20, relationshipDelta: 5,  effects: { economy: 4 } },
  { id: "ask_help",      name: "Попросить помощь",           baseCost: 0,  relationshipDelta: -10 },
  { id: "compete",       name: "Конкурировать за инвестора", baseCost: 40, relationshipDelta: -15, effects: { economy: 8 } },
  { id: "summit",        name: "Провести саммит",           baseCost: 30, relationshipDelta: 15,  effects: { culture: 3 }, allNeighbors: true },
];

export function initNeighborRelations(rng) {
  const relations = {};
  for (const neighbor of NEIGHBORS) {
    relations[neighbor.id] = {
      relationship: neighbor.baseRelationship + rng.nextInt(-20, 20),
      activeProject: null,
      actionThisTurn: false,
      lastActionTurn: -1,
    };
  }
  return relations;
}

export function applyDiplomaticAction(relations, neighborId, actionId, rng, metrics) {
  const action = DIPLOMATIC_ACTIONS.find(a => a.id === actionId);
  if (!action) return { relations, effects: {}, cost: 0 };

  const effects = { ...(action.effects || {}) };
  let cost = action.baseCost;

  // For "compete" — 60% chance of winning based on metrics
  if (actionId === "compete") {
    const neighbor = NEIGHBORS.find(n => n.id === neighborId);
    const avgMetric = ((metrics.economy || 0) + (metrics.infrastructure || 0)) / 2;
    const winChance = Math.min(0.8, avgMetric / (neighbor ? neighbor.strength : 50));
    if (rng.next() > winChance) {
      // Lost the competition
      return {
        relations: updateRelation(relations, neighborId, action.relationshipDelta),
        effects: {},
        cost,
        won: false,
      };
    }
  }

  // For "ask_help" — one-time bonus
  if (actionId === "ask_help") {
    const neighbor = NEIGHBORS.find(n => n.id === neighborId);
    if (neighbor) {
      const helpMetric = rng.pick(neighbor.interests);
      effects[helpMetric] = (effects[helpMetric] || 0) + 5;
    }
  }

  // Apply to all neighbors if summit
  if (action.allNeighbors) {
    const newRelations = {};
    for (const [nid, rel] of Object.entries(relations)) {
      newRelations[nid] = { ...rel, relationship: Math.min(100, rel.relationship + action.relationshipDelta) };
    }
    return { relations: newRelations, effects, cost };
  }

  return {
    relations: updateRelation(relations, neighborId, action.relationshipDelta),
    effects,
    cost,
    won: true,
  };
}

function updateRelation(relations, neighborId, delta) {
  const rel = relations[neighborId];
  if (!rel) return relations;
  return {
    ...relations,
    [neighborId]: {
      ...rel,
      relationship: Math.max(-100, Math.min(100, rel.relationship + delta)),
      actionThisTurn: true,
    },
  };
}

export function checkHostileActions(relations) {
  const hostileActions = [];
  for (const neighbor of NEIGHBORS) {
    const rel = relations[neighbor.id];
    if (rel && rel.relationship < -30) {
      hostileActions.push({
        neighborId: neighbor.id,
        neighborName: neighbor.name,
        ...neighbor.hostileAction,
      });
    }
  }
  return hostileActions;
}

export function startJointProject(relations, neighborId, projectId) {
  const project = JOINT_PROJECTS.find(p => p.id === projectId);
  if (!project) return relations;
  const rel = relations[neighborId];
  if (!rel || rel.activeProject) return relations;
  if (rel.relationship < project.relationshipRequired) return relations;

  return {
    ...relations,
    [neighborId]: {
      ...rel,
      activeProject: {
        projectId: project.id,
        name: project.name,
        currentTurn: 0,
        totalTurns: project.duration,
        cost: Math.round(project.totalCost * project.costShare),
        effects: { ...project.effects },
      },
    },
  };
}

export function advanceJointProject(relations, neighborId) {
  const rel = relations[neighborId];
  if (!rel || !rel.activeProject) return { relations, completed: null };

  const proj = rel.activeProject;
  const next = { ...proj, currentTurn: proj.currentTurn + 1 };

  if (next.currentTurn >= next.totalTurns) {
    return {
      relations: {
        ...relations,
        [neighborId]: { ...rel, activeProject: null, relationship: Math.min(100, rel.relationship + 10) },
      },
      completed: { name: next.name, effects: next.effects },
    };
  }

  return {
    relations: { ...relations, [neighborId]: { ...rel, activeProject: next } },
    completed: null,
  };
}

export function resetTurnFlags(relations) {
  const newRel = {};
  for (const [nid, rel] of Object.entries(relations)) {
    newRel[nid] = { ...rel, actionThisTurn: false };
  }
  return newRel;
}
