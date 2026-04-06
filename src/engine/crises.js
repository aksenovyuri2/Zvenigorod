import { METRIC_KEYS } from "./constants.js";

export const ALL_CRISES = [
  // 1. Epidemic
  {
    id: "epidemic",
    name: "Эпидемия",
    icon: "Bug",
    minTurn: 4,
    maxTurn: 18,
    triggerCondition(state, rng) {
      return state.metrics.healthcare < 30 && rng.next() < 0.15;
    },
    phases: [
      {
        phaseNum: 1,
        description: "Вспышка вируса. 20 заболевших.",
        autoEffects: { healthcare: -3 },
        emergencyActions: [
          { name: "Закупить лекарства", cost: 30, effects: { healthcare: 2 }, description: "Экстренная закупка медикаментов" },
        ],
      },
      {
        phaseNum: 2,
        description: "Больница переполнена. Очереди. Паника.",
        autoEffects: { healthcare: -5, economy: -2 },
        emergencyActions: [
          { name: "Полевой госпиталь", cost: 60, effects: { healthcare: 4 }, description: "Развернуть полевой госпиталь" },
          { name: "Помощь Москвы", cost: 0, effects: { healthcare: 2 }, approvalDelta: -2, description: "Запросить помощь — не справился сам" },
        ],
      },
      {
        phaseNum: 3,
        description: "200 заболевших. Школы закрыты.",
        autoEffects: { education: -4, economy: -5, safety: -2 },
        emergencyActions: [
          { name: "Карантин", cost: 0, effects: { economy: -8, healthcare: 3, safety: 2 }, description: "Ввести карантин" },
          { name: "Не вводить карантин", cost: 0, effects: { healthcare: -3 }, description: "Продолжить без ограничений" },
        ],
      },
      {
        phaseNum: 4,
        description: "Эпидемия идёт на спад.",
        autoEffects: {},
        emergencyActions: [],
      },
    ],
  },

  // 2. Economic crash
  {
    id: "economic_crash",
    name: "Экономический крах",
    icon: "TrendingDown",
    minTurn: 4,
    maxTurn: 20,
    triggerCondition(state, _rng) {
      return state.metrics.economy < 25 || (state.debt || 0) > 300;
    },
    phases: [
      {
        phaseNum: 1,
        description: "Крупный работодатель закрывается.",
        autoEffects: { economy: -5 },
        emergencyActions: [
          { name: "Предложить льготы", cost: 80, effects: { economy: 3 }, description: "Налоговые льготы работодателю" },
          { name: "Отпустить", cost: 0, effects: {}, description: "Не вмешиваться" },
        ],
      },
      {
        phaseNum: 2,
        description: "Безработица растёт.",
        autoEffects: { economy: -3 },
        emergencyActions: [
          { name: "Общественные работы", cost: 100, effects: { infrastructure: 3, economy: 2 }, description: "Программа занятости" },
          { name: "Гранты малому бизнесу", cost: 60, effects: { economy: 4 }, description: "Поддержка предпринимателей" },
        ],
      },
      {
        phaseNum: 3,
        description: "Жители уезжают.",
        autoEffects: { economy: -2 },
        populationDelta: -500,
        emergencyActions: [
          { name: "Снизить налоги", cost: 0, effects: { economy: 3 }, description: "Стимулировать через налоги" },
          { name: "Рекламная кампания", cost: 40, effects: { culture: 2 }, description: "PR-акция для привлечения" },
        ],
      },
      {
        phaseNum: 4,
        description: "Дно. Пустые витрины.",
        autoEffects: { economy: -3, culture: -2 },
        emergencyActions: [
          { name: "Федеральный кредит", cost: 0, effects: {}, budgetBonus: 300, debtAdd: 300, description: "Взять кредит у федералов" },
          { name: "Жёсткая экономия", cost: 0, effects: {}, description: "Затянуть пояса" },
        ],
      },
      {
        phaseNum: 5,
        description: "Медленное восстановление.",
        autoEffects: { economy: 2 },
        emergencyActions: [],
      },
    ],
  },

  // 3. Eco disaster
  {
    id: "eco_disaster",
    name: "Экологическая катастрофа",
    icon: "Skull",
    minTurn: 4,
    maxTurn: 20,
    triggerCondition(state, _rng) {
      return state.metrics.ecology < 25;
    },
    phases: [
      {
        phaseNum: 1,
        description: "Загрязнение реки. Вода окрасилась в бурый цвет.",
        autoEffects: { ecology: -5 },
        emergencyActions: [
          { name: "Экстренная очистка", cost: 50, effects: { ecology: 3 }, description: "Очистить русло реки" },
        ],
      },
      {
        phaseNum: 2,
        description: "Массовая гибель рыбы. Запах разносится по городу.",
        autoEffects: { ecology: -3, healthcare: -2 },
        emergencyActions: [
          { name: "Привлечь экологов", cost: 30, effects: { ecology: 2 }, description: "Пригласить экспертов-экологов" },
        ],
      },
      {
        phaseNum: 3,
        description: "Жители жалуются на здоровье. Дети болеют.",
        autoEffects: { healthcare: -4 },
        emergencyActions: [
          { name: "Раздать фильтры для воды", cost: 20, effects: { healthcare: 2 }, description: "Обеспечить чистой водой" },
        ],
      },
      {
        phaseNum: 4,
        description: "Федеральная проверка. Прокуратура интересуется.",
        autoEffects: {},
        approvalDelta: -5,
        emergencyActions: [
          { name: "Показательный отчёт", cost: 40, effects: { ecology: 2 }, approvalDelta: 3, description: "Подготовить отчёт о мерах" },
        ],
      },
    ],
  },

  // 4. Infrastructure collapse
  {
    id: "infra_collapse",
    name: "Инфраструктурный коллапс",
    icon: "AlertTriangle",
    minTurn: 4,
    maxTurn: 20,
    triggerCondition(state, _rng) {
      return state.metrics.infrastructure < 20;
    },
    phases: [
      {
        phaseNum: 1,
        description: "Авария водопровода. Три района без воды.",
        autoEffects: { infrastructure: -5, safety: -3 },
        emergencyActions: [
          { name: "Аварийный ремонт", cost: 70, effects: { infrastructure: 4 }, description: "Экстренный ремонт трубопровода" },
        ],
      },
      {
        phaseNum: 2,
        description: "Отключение отопления в разгар зимы.",
        autoEffects: { infrastructure: -3, healthcare: -3, safety: -2 },
        populationDelta: -300,
        emergencyActions: [
          { name: "МЧС и обогреватели", cost: 50, effects: { safety: 3, healthcare: 2 }, description: "Развернуть пункты обогрева" },
        ],
      },
      {
        phaseNum: 3,
        description: "Массовое отселение. Дома признаны аварийными.",
        autoEffects: {},
        populationDelta: -500,
        emergencyActions: [
          { name: "Капитальный ремонт сетей", cost: 120, effects: { infrastructure: 8 }, description: "Полная замена коммуникаций" },
        ],
      },
    ],
  },

  // 5. Social protest
  {
    id: "social_protest",
    name: "Социальный протест",
    icon: "Megaphone",
    minTurn: 5,
    maxTurn: 20,
    triggerCondition(state, _rng) {
      return (state.approval || 50) < 25;
    },
    phases: [
      {
        phaseNum: 1,
        description: "Митинг на центральной площади. 200 человек требуют перемен.",
        autoEffects: { safety: -2 },
        emergencyActions: [
          { name: "Выйти к людям", cost: 0, effects: { safety: 1 }, approvalDelta: 3, description: "Лично поговорить с митингующими" },
          { name: "Игнорировать", cost: 0, effects: {}, approvalDelta: -2, description: "Не реагировать на протест" },
        ],
      },
      {
        phaseNum: 2,
        description: "Забастовка коммунальщиков. Мусор не вывозится.",
        autoEffects: { ecology: -3, economy: -2, safety: -2 },
        emergencyActions: [
          { name: "Повысить зарплаты", cost: 60, effects: { economy: -1 }, approvalDelta: 4, description: "Поднять оклады работникам ЖКХ" },
          { name: "Нанять временных", cost: 30, effects: { ecology: 1 }, description: "Временные рабочие для уборки" },
        ],
      },
      {
        phaseNum: 3,
        description: "Блокировка центральных улиц. Движение парализовано.",
        autoEffects: { economy: -4, safety: -3 },
        emergencyActions: [
          { name: "Переговоры", cost: 0, effects: { safety: 2 }, approvalDelta: 2, description: "Сесть за стол переговоров" },
          { name: "Разогнать", cost: 0, effects: { safety: -2 }, approvalDelta: -5, description: "Силовой разгон протеста" },
        ],
      },
      {
        phaseNum: 4,
        description: "Требование отставки мэра. Петиция набирает подписи.",
        autoEffects: { economy: -2 },
        approvalDelta: -4,
        emergencyActions: [
          { name: "Публичный отчёт", cost: 20, effects: {}, approvalDelta: 5, description: "Открытый отчёт о работе и планах" },
          { name: "Досрочные обещания", cost: 50, effects: { infrastructure: 2, healthcare: 2 }, approvalDelta: 3, description: "Пообещать срочные улучшения" },
        ],
      },
    ],
  },

  // 6. Flood
  {
    id: "flood",
    name: "Наводнение",
    icon: "Waves",
    minTurn: 4,
    maxTurn: 20,
    triggerCondition(state, _rng) {
      return state.turn % 4 === 1 && state.metrics.infrastructure < 40;
    },
    phases: [
      {
        phaseNum: 1,
        description: "Весеннее половодье. Москва-река вышла из берегов. Затоплены подвалы.",
        autoEffects: { infrastructure: -4, safety: -3 },
        emergencyActions: [
          { name: "Мешки с песком", cost: 25, effects: { infrastructure: 2, safety: 2 }, description: "Укрепить берега мешками с песком" },
          { name: "Эвакуация", cost: 40, effects: { safety: 4 }, description: "Эвакуировать жителей прибрежной зоны" },
        ],
      },
      {
        phaseNum: 2,
        description: "Вода прибывает. Размыты дороги, повреждены коммуникации.",
        autoEffects: { infrastructure: -5, ecology: -3, economy: -3 },
        emergencyActions: [
          { name: "Аварийная откачка", cost: 50, effects: { infrastructure: 3 }, description: "Насосы для откачки воды" },
          { name: "Запросить МЧС", cost: 0, effects: { safety: 3, infrastructure: 2 }, approvalDelta: -1, description: "Вызвать федеральных спасателей" },
        ],
      },
      {
        phaseNum: 3,
        description: "Вода отступает. Город подсчитывает убытки.",
        autoEffects: { ecology: -2 },
        emergencyActions: [
          { name: "Программа восстановления", cost: 80, effects: { infrastructure: 5, ecology: 2 }, description: "Комплексное восстановление после паводка" },
          { name: "Построить дамбу", cost: 100, effects: { infrastructure: 6, safety: 3 }, description: "Защитная дамба на будущее" },
        ],
      },
    ],
  },

  // 7. Cyber attack
  {
    id: "cyber_attack",
    name: "Цифровая атака",
    icon: "ShieldAlert",
    minTurn: 6,
    maxTurn: 20,
    triggerCondition(state, rng) {
      return state.metrics.digital > 60 && rng.next() < 0.12;
    },
    phases: [
      {
        phaseNum: 1,
        description: "Взлом муниципальных систем. Сайт администрации недоступен.",
        autoEffects: { digital: -5, safety: -2 },
        emergencyActions: [
          { name: "Нанять специалистов", cost: 40, effects: { digital: 3, safety: 1 }, description: "Привлечь экспертов по кибербезопасности" },
          { name: "Откатить системы", cost: 10, effects: { digital: -2 }, description: "Вернуться к бумажному документообороту временно" },
        ],
      },
      {
        phaseNum: 2,
        description: "Утечка персональных данных жителей. Скандал в прессе.",
        autoEffects: { safety: -3, digital: -3 },
        approvalDelta: -3,
        emergencyActions: [
          { name: "Уведомить жителей", cost: 15, effects: { safety: 2 }, approvalDelta: 2, description: "Честно предупредить об утечке" },
          { name: "Замять историю", cost: 0, effects: {}, approvalDelta: -3, description: "Попытаться скрыть масштаб утечки" },
        ],
      },
      {
        phaseNum: 3,
        description: "Паника. Жители боятся цифровых сервисов.",
        autoEffects: { digital: -4, economy: -2 },
        emergencyActions: [
          { name: "Аудит и защита", cost: 60, effects: { digital: 5, safety: 3 }, description: "Полный аудит и обновление систем безопасности" },
          { name: "Страхование данных", cost: 30, effects: { safety: 2 }, approvalDelta: 1, description: "Программа страхования цифровых рисков" },
        ],
      },
    ],
  },

  // 8. Demographic hole
  {
    id: "demographic_hole",
    name: "Демографическая яма",
    icon: "UserMinus",
    minTurn: 6,
    maxTurn: 20,
    triggerCondition(state, _rng) {
      const history = state.history || [];
      if (history.length < 3) return false;
      const recent = history.slice(-3);
      for (let i = 1; i < recent.length; i++) {
        if ((recent[i].population || 0) >= (recent[i - 1].population || 0)) return false;
      }
      return true;
    },
    phases: [
      {
        phaseNum: 1,
        description: "Школа закрывается — не хватает учеников.",
        autoEffects: { education: -5 },
        populationDelta: -200,
        emergencyActions: [
          { name: "Объединить классы", cost: 10, effects: { education: 2 }, description: "Реорганизация школьной сети" },
          { name: "Программа «Молодая семья»", cost: 50, effects: { education: 3 }, approvalDelta: 2, description: "Льготы для молодых семей с детьми" },
        ],
      },
      {
        phaseNum: 2,
        description: "Магазины и кафе закрываются — нет клиентов.",
        autoEffects: { economy: -4, culture: -2 },
        populationDelta: -300,
        emergencyActions: [
          { name: "Арендные каникулы", cost: 30, effects: { economy: 3 }, description: "Освободить малый бизнес от аренды" },
          { name: "Фестиваль", cost: 25, effects: { culture: 3, economy: 1 }, description: "Привлечь внимание культурным событием" },
        ],
      },
      {
        phaseNum: 3,
        description: "Врачи и учителя уезжают. Кадровый голод.",
        autoEffects: { healthcare: -4, education: -3 },
        populationDelta: -400,
        emergencyActions: [
          { name: "Подъёмные специалистам", cost: 70, effects: { healthcare: 3, education: 3 }, description: "Выплаты за переезд в город" },
          { name: "Удалённые услуги", cost: 40, effects: { digital: 3, healthcare: 2 }, description: "Телемедицина и онлайн-образование" },
        ],
      },
      {
        phaseNum: 4,
        description: "Каскадный отток. Город теряет критическую массу.",
        autoEffects: { economy: -5, infrastructure: -3 },
        populationDelta: -600,
        emergencyActions: [
          { name: "Генеральный план возрождения", cost: 100, effects: { economy: 4, infrastructure: 3, culture: 2 }, description: "Комплексная программа привлечения жителей" },
          { name: "IT-кластер", cost: 80, effects: { digital: 5, economy: 4 }, description: "Создать технологический кластер с удалёнными рабочими местами" },
        ],
      },
      {
        phaseNum: 5,
        description: "Стабилизация. Отток замедляется.",
        autoEffects: { economy: 1 },
        emergencyActions: [],
      },
    ],
  },
];

export function checkCrisisTrigger(state, rng) {
  if (state.activeCrisis) return null;
  if (state.turn < 4) return null;

  for (const crisis of ALL_CRISES) {
    if (state.turn < crisis.minTurn || state.turn > crisis.maxTurn) continue;
    if ((state.resolvedCrises || []).includes(crisis.id)) continue;
    if (crisis.triggerCondition(state, rng)) {
      return crisis;
    }
  }
  return null;
}

export function startCrisis(crisis) {
  return {
    crisisId: crisis.id,
    name: crisis.name,
    icon: crisis.icon,
    currentPhase: 0,
    totalPhases: crisis.phases.length,
    actionsChosen: [],
    startTurn: 0,
  };
}

export function getCurrentCrisisPhase(activeCrisis) {
  const crisis = ALL_CRISES.find(c => c.id === activeCrisis.crisisId);
  if (!crisis) return null;
  return crisis.phases[activeCrisis.currentPhase] || null;
}

export function advanceCrisis(activeCrisis) {
  const next = activeCrisis.currentPhase + 1;
  const crisis = ALL_CRISES.find(c => c.id === activeCrisis.crisisId);
  if (!crisis || next >= crisis.phases.length) {
    return null;
  }
  return { ...activeCrisis, currentPhase: next };
}

export function applyEmergencyAction(activeCrisis, actionIdx) {
  const phase = getCurrentCrisisPhase(activeCrisis);
  if (!phase) return { effects: {}, cost: 0 };
  const action = phase.emergencyActions[actionIdx];
  if (!action) return { effects: {}, cost: 0 };
  return {
    effects: action.effects || {},
    cost: action.cost || 0,
    approvalDelta: action.approvalDelta || 0,
    budgetBonus: action.budgetBonus || 0,
    debtAdd: action.debtAdd || 0,
    populationDelta: action.populationDelta || 0,
  };
}
