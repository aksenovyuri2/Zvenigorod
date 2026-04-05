import React, { useReducer, useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  Building2, TreePine, Palette, Wifi, Shield, Heart, GraduationCap,
  TrendingUp, Users, Coins, AlertTriangle, Play, ArrowRight,
  RotateCcw, ChevronDown, ChevronUp, MapPin, Crown,
} from "lucide-react";

// ─── Section 1: Constants ────────────────────────────────────────────────────

const METRIC_KEYS = [
  "infrastructure", "ecology", "culture", "digital",
  "safety", "healthcare", "education", "economy",
];

const METRICS_CFG = {
  infrastructure: { name: "Инфраструктура", color: "#f59e0b", Icon: Building2 },
  ecology:        { name: "Экология",       color: "#22c55e", Icon: TreePine },
  culture:        { name: "Культура",       color: "#a855f7", Icon: Palette },
  digital:        { name: "Цифровизация",   color: "#3b82f6", Icon: Wifi },
  safety:         { name: "Безопасность",   color: "#ef4444", Icon: Shield },
  healthcare:     { name: "Здравоохранение", color: "#ec4899", Icon: Heart },
  education:      { name: "Образование",    color: "#06b6d4", Icon: GraduationCap },
  economy:        { name: "Экономика",      color: "#f97316", Icon: TrendingUp },
};

const GROUPS = {
  elderly:     { name: "Пожилые",        weights: { healthcare: 0.30, safety: 0.25, ecology: 0.20, culture: 0.15, infrastructure: 0.10 } },
  freelancers: { name: "Фрилансеры",     weights: { digital: 0.30, culture: 0.20, ecology: 0.20, economy: 0.15, infrastructure: 0.15 } },
  families:    { name: "Семьи с детьми",  weights: { education: 0.30, safety: 0.25, healthcare: 0.20, infrastructure: 0.15, ecology: 0.10 } },
  youth:       { name: "Молодёжь",        weights: { culture: 0.25, digital: 0.25, economy: 0.20, education: 0.20, ecology: 0.10 } },
  business:    { name: "Бизнес",          weights: { economy: 0.30, infrastructure: 0.25, digital: 0.20, safety: 0.15, education: 0.10 } },
};

const GROUP_KEYS = Object.keys(GROUPS);

const INIT_METRICS = {
  infrastructure: 35, ecology: 65, culture: 45, digital: 20,
  safety: 40, healthcare: 35, education: 40, economy: 30,
};

const INIT_BUDGET = 850;
const INIT_POP = 25000;
const MAX_TURNS = 20;
const MAX_PICKS = 2;

// ─── Section 2: Decisions Catalog ────────────────────────────────────────────

const ALL_DECISIONS = [
  // Infrastructure
  { id: "road_repair", name: "Ремонт дорог", desc: "Капитальный ремонт дорожного покрытия в центре и жилых кварталах.", cost: 110, effects: { infrastructure: 12, safety: 3, economy: 2 }, cat: "infrastructure" },
  { id: "storm_drain", name: "Ливневая канализация", desc: "Современная система отвода дождевой воды по всему городу.", cost: 120, effects: { infrastructure: 10, safety: 5, ecology: 3 }, once: true, cat: "infrastructure" },
  { id: "shuttle", name: "Шаттл до ж/д станции", desc: "Регулярный автобус-шаттл связывает районы с железнодорожной станцией.", cost: 45, effects: { infrastructure: 7, economy: 3 }, cat: "infrastructure" },
  { id: "housing", name: "Программа доступного жилья", desc: "Строительство нового жилого комплекса для молодых семей.", cost: 160, effects: { economy: 6, infrastructure: 5 }, populationEffect: 300, cat: "infrastructure" },
  { id: "waterworks", name: "Реконструкция водопровода", desc: "Полная замена изношенных труб и насосных станций.", cost: 130, effects: { infrastructure: 11, healthcare: 3 }, once: true, cat: "infrastructure" },

  // Digital
  { id: "fiber", name: "Оптоволокно во все районы", desc: "Прокладка высокоскоростного оптоволоконного интернета.", cost: 120, effects: { digital: 12, economy: 3, infrastructure: 2 }, once: true, cat: "digital" },
  { id: "smart_city", name: "Платформа «Умный Звенигород»", desc: "Единая цифровая платформа городских сервисов для жителей.", cost: 95, effects: { digital: 10, infrastructure: 3, safety: 3 }, once: true, cat: "digital" },
  { id: "wifi", name: "Wi-Fi в общественных местах", desc: "Бесплатный Wi-Fi в парках, на площадях и остановках.", cost: 40, effects: { digital: 5, culture: 2 }, cat: "digital" },
  { id: "digital_library", name: "Цифровая библиотека", desc: "Онлайн-каталог и электронные читальные залы для всех жителей.", cost: 40, effects: { education: 6, digital: 4, culture: 3 }, cat: "digital" },

  // Ecology
  { id: "park_river", name: "Парк у Москвы-реки", desc: "Реконструкция набережной с зонами отдыха и велодорожками.", cost: 90, effects: { ecology: 8, culture: 4, safety: 2 }, cat: "ecology" },
  { id: "recycling", name: "Раздельный сбор мусора", desc: "Установка контейнеров и запуск программы переработки отходов.", cost: 55, effects: { ecology: 9, culture: 2 }, cat: "ecology" },
  { id: "greening", name: "Озеленение улиц", desc: "Высадка деревьев и кустарников на центральных улицах.", cost: 35, effects: { ecology: 6, culture: 2 }, cat: "ecology" },
  { id: "solar", name: "Солнечные панели", desc: "Установка солнечных панелей на муниципальных зданиях.", cost: 100, effects: { ecology: 7, economy: 4, digital: 2 }, cat: "ecology" },
  { id: "water_treatment", name: "Очистные сооружения", desc: "Строительство современных очистных для сточных вод.", cost: 140, effects: { ecology: 12, healthcare: 3 }, once: true, cat: "ecology" },

  // Culture
  { id: "festival", name: "«Звенигородские вечера»", desc: "Ежегодный фестиваль музыки и искусства на открытом воздухе.", cost: 30, effects: { culture: 8, economy: 3 }, cat: "culture" },
  { id: "monastery", name: "Реставрация монастыря", desc: "Восстановление Саввино-Сторожевского монастыря XIV века.", cost: 90, effects: { culture: 12, economy: 4 }, once: true, cat: "culture" },
  { id: "branding", name: "Бренд «Город у реки»", desc: "Создание туристического бренда и маркетинговая кампания.", cost: 50, effects: { culture: 5, economy: 6 }, once: true, cat: "culture" },
  { id: "farmer_market", name: "Фермерский рынок", desc: "Еженедельный рынок фермерских продуктов на центральной площади.", cost: 25, effects: { economy: 5, culture: 4, ecology: 2 }, cat: "culture" },
  { id: "art_residence", name: "Арт-резиденция", desc: "Творческое пространство для художников и мастер-классов.", cost: 60, effects: { culture: 7, education: 2 }, cat: "culture" },

  // Healthcare
  { id: "clinic_upgrade", name: "Модернизация поликлиники", desc: "Новое оборудование и ремонт городской поликлиники.", cost: 150, effects: { healthcare: 14, safety: 2 }, once: true, cat: "healthcare" },
  { id: "senior_center", name: "Центр активного долголетия", desc: "Оздоровительный и досуговый центр для пожилых жителей.", cost: 80, effects: { healthcare: 6, culture: 5, safety: 2 }, cat: "healthcare" },
  { id: "ambulance", name: "Новые машины скорой", desc: "Обновление парка автомобилей скорой медицинской помощи.", cost: 70, effects: { healthcare: 8, safety: 3 }, cat: "healthcare" },
  { id: "prevention", name: "Программа профилактики", desc: "Бесплатные медосмотры и вакцинация для всех жителей.", cost: 45, effects: { healthcare: 5, education: 2 }, cat: "healthcare" },

  // Education
  { id: "school_repair", name: "Ремонт школ", desc: "Капитальный ремонт зданий и оснащение современным оборудованием.", cost: 100, effects: { education: 10, safety: 3 }, cat: "education" },
  { id: "kindergarten", name: "Новый детский сад", desc: "Строительство детского сада на 120 мест в новом микрорайоне.", cost: 130, effects: { education: 8, safety: 2 }, once: true, populationEffect: 200, cat: "education" },
  { id: "it_classes", name: "IT-классы в школах", desc: "Компьютерные классы с робототехникой и программированием.", cost: 60, effects: { education: 6, digital: 4 }, cat: "education" },
  { id: "scholarships", name: "Стипендии для студентов", desc: "Муниципальные стипендии для талантливых выпускников.", cost: 35, effects: { education: 5, culture: 2 }, cat: "education" },

  // Safety
  { id: "cameras", name: "Умные камеры", desc: "Система видеонаблюдения с аналитикой на ключевых перекрёстках.", cost: 70, effects: { safety: 10, digital: 3 }, cat: "safety" },
  { id: "fire_station", name: "Модернизация пожарной части", desc: "Новая техника и расширение пожарного депо.", cost: 70, effects: { safety: 9, infrastructure: 2 }, once: true, cat: "safety" },
  { id: "street_lights", name: "Уличное освещение", desc: "Светодиодные фонари на тёмных улицах и во дворах.", cost: 50, effects: { safety: 7, infrastructure: 2 }, cat: "safety" },
  { id: "patrol", name: "Народная дружина", desc: "Организация добровольных дружин для охраны общественного порядка.", cost: 20, effects: { safety: 4, culture: 2 }, cat: "safety" },

  // Economy
  { id: "it_tax_breaks", name: "Налоговые льготы для IT", desc: "Налоговые каникулы для IT-компаний, переезжающих в город.", cost: 40, effects: { economy: 8, digital: 4 }, recurring: -40, once: true, cat: "economy" },
  { id: "small_biz_grants", name: "Гранты малому бизнесу", desc: "Программа грантов для начинающих предпринимателей.", cost: 60, effects: { economy: 9, digital: 2 }, cat: "economy" },
  { id: "coworking", name: "Муниципальный коворкинг", desc: "Современное рабочее пространство для фрилансеров и стартапов.", cost: 60, effects: { digital: 6, economy: 5, culture: 3 }, cat: "economy" },
  { id: "logistics_hub", name: "Логистический хаб", desc: "Транспортно-логистический центр на въезде в город.", cost: 110, effects: { economy: 10, infrastructure: 4 }, once: true, cat: "economy" },

  // Trade-offs
  { id: "factory", name: "Завод на окраине", desc: "Промышленное предприятие: рабочие места ценой экологии.", cost: 80, effects: { economy: 12, ecology: -8 }, populationEffect: 500, recurring: 80, once: true, cat: "tradeoff" },
  { id: "luxury_housing", name: "Элитный ЖК", desc: "Дорогой жилой комплекс: доход для бюджета, нагрузка на инфраструктуру.", cost: 60, effects: { economy: 8, ecology: -4, infrastructure: -3 }, cat: "tradeoff" },
  { id: "parking_lots", name: "Вырубка леса под парковки", desc: "Больше парковок для автомобилистов за счёт зелёных зон.", cost: 40, effects: { infrastructure: 8, ecology: -10 }, cat: "tradeoff" },
  { id: "casino_zone", name: "Казино-зона", desc: "Развлекательный комплекс с казино: огромный доход, но удар по культуре.", cost: 100, effects: { economy: 15, culture: -5, safety: -6 }, recurring: 100, once: true, cat: "tradeoff" },
  { id: "paid_parking", name: "Платные парковки в центре", desc: "Плата за парковку в историческом центре.", cost: 20, effects: { economy: 4, culture: -3 }, recurring: 30, once: true, cat: "tradeoff" },
];

// ─── Section 3: Events Catalog ───────────────────────────────────────────────

const ALL_EVENTS = [
  // Natural
  { id: "flood", text: "🌊 Паводок затопил улицы нижнего Звенигорода. Спасатели эвакуируют жителей.", effects: { infrastructure: -5, safety: -3 }, budget: -40 },
  { id: "frost", text: "❄️ Аномальные морозы повредили водопровод. Часть города осталась без воды.", effects: { infrastructure: -6, healthcare: -2 }, budget: -60 },
  { id: "drought", text: "☀️ Аномальная жара и засуха. Газоны выгорели, деревья сохнут.", effects: { ecology: -4, healthcare: -2 }, budget: -20 },
  { id: "storm", text: "🌪️ Сильный ураган повалил деревья и повредил крыши домов.", effects: { ecology: -3, infrastructure: -2, safety: -2 }, budget: -30 },

  // Economic
  { id: "federal_grant", text: "🏛️ Федеральный грант на развитие малых городов! Звенигород получил крупное финансирование.", effects: {}, budget: 150 },
  {
    id: "investor_factory", text: "🏭 Крупный инвестор предлагает построить завод. Рабочие места, но риски для экологии.",
    choices: [
      { label: "Принять предложение", effects: { economy: 10, ecology: -6 }, budget: 0, population: 400, chainEvents: [{ eventId: "factory_complaints", delay: 3 }, { eventId: "factory_river", delay: 7 }], recurring: 60 },
      { label: "Отказать инвестору", effects: {}, budget: 0 },
    ],
  },
  { id: "price_hike", text: "📈 Подрядчики подняли цены. Все строительные проекты подорожали.", effects: {}, budget: -50 },
  {
    id: "tech_company", text: "💻 Крупная IT-компания хочет открыть офис в Звенигороде.",
    requires: { digital: 50 },
    choices: [
      { label: "Выделить площадку", effects: { economy: 8, digital: 5 }, budget: -30, population: 300 },
      { label: "Отказать — нет условий", effects: {}, budget: 0 },
    ],
  },
  { id: "material_inflation", text: "🧱 Рост мировых цен на стройматериалы. Все строительные решения дорожают на 20% на 3 хода.", effects: {}, budget: 0, setCostMultiplier: true },

  // Social
  { id: "blogger", text: "📱 Известный блогер снял восторженное видео о Звенигороде. Просмотры зашкаливают!", effects: { culture: 4, economy: 5 }, budget: 0, population: 600 },
  { id: "olympiad", text: "🏆 Ученик звенигородской школы выиграл всероссийскую олимпиаду по математике!", effects: { education: 4, culture: 2 }, budget: 0 },
  {
    id: "protest", text: "📢 Жители собрались на митинг против новой стройки в зелёной зоне.",
    choices: [
      { label: "Уступить жителям", effects: { culture: 3, economy: -4 }, budget: 0 },
      { label: "Продолжить стройку", effects: { culture: -4, economy: 3, safety: -2 }, budget: 0 },
    ],
  },
  { id: "remote_workers", text: "🏠 Волна удалёнщиков из Москвы переезжает за город. Звенигород в тренде!", requires: { digital: 40 }, effects: { economy: 3 }, budget: 0, population: 400 },
  { id: "flu_epidemic", text: "🤒 Эпидемия гриппа охватила город. Поликлиники переполнены.", effects: { healthcare: -4 }, budget: -25 },

  // Political
  {
    id: "merger", text: "🏛️ Губернатор предлагает объединить Звенигород с соседним посёлком Введенское.",
    choices: [
      { label: "Согласиться на объединение", effects: { infrastructure: -5 }, budget: 100, population: 3000 },
      { label: "Сохранить независимость", effects: {}, budget: 0 },
    ],
  },
  { id: "audit", text: "🔍 Прокуратура нашла нарушения в муниципальных закупках. Штраф!", effects: { safety: -2 }, budget: -80 },
  { id: "council_election", text: "🗳️ Выборы в городскую думу. Результат зависит от одобрения жителей.", effects: {}, budget: 0, specialCheck: "council" },

  // Cultural
  { id: "film_crew", text: "🎬 Съёмочная группа снимает исторический фильм в Звенигороде!", effects: { culture: 5, economy: 3 }, budget: 20 },
  { id: "rare_birds", text: "🦅 Экологи обнаружили гнездовья редких птиц. Звенигороду присвоен статус экозоны!", effects: { ecology: 6 }, budget: 0 },
  { id: "architect", text: "🏗️ Известный архитектор предлагает бесплатно спроектировать новый парк.", effects: { culture: 5, ecology: 3 }, budget: 0 },

  // Chain events (never randomly selected)
  { id: "factory_complaints", text: "😤 Жители жалуются на выбросы и запах от завода на окраине.", effects: { ecology: -5, healthcare: -2 }, budget: 0, chain: true },
  { id: "factory_river", text: "☠️ Завод загрязнил Москву-реку! Экологическая катастрофа.", effects: { ecology: -10, healthcare: -5 }, budget: -100, chain: true },
];

// ─── Section 4: PRNG ─────────────────────────────────────────────────────────

function createRNG(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  const next = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  const nextInt = (min, max) => min + Math.floor(next() * (max - min + 1));
  const pick = (arr) => arr[Math.floor(next() * arr.length)];
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  return { next, nextInt, pick, shuffle, getSeed: () => s };
}

// ─── Section 5: Engine Functions ─────────────────────────────────────────────

function calcDecay(val) {
  return Math.max(1, Math.floor(val / 40));
}

function applyDecay(metrics) {
  const m = { ...metrics };
  for (const k of METRIC_KEYS) {
    m[k] = Math.max(0, m[k] - calcDecay(m[k]));
  }
  return m;
}

function clampMetrics(metrics) {
  const m = { ...metrics };
  for (const k of METRIC_KEYS) {
    m[k] = Math.max(0, Math.min(100, Math.round(m[k])));
  }
  return m;
}

function calcSatisfaction(metrics, weights) {
  let s = 0;
  for (const [k, w] of Object.entries(weights)) {
    s += (metrics[k] || 0) * w;
  }
  return Math.round(s * 10) / 10;
}

function calcAllSatisfactions(metrics) {
  const r = {};
  for (const [gk, g] of Object.entries(GROUPS)) {
    r[gk] = calcSatisfaction(metrics, g.weights);
  }
  return r;
}

function calcAvgSatisfaction(sats) {
  const vals = Object.values(sats);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function calcRevenue(pop, metrics) {
  return Math.round(400 + pop * 0.012 + metrics.economy * 2.0 + metrics.culture * 1.2);
}

function calcMandatory(pop) {
  return Math.round(200 + pop * 0.005);
}

function calcMigration(avgSat, rng) {
  let migration = 0;
  if (avgSat > 60) {
    migration = (avgSat - 60) * 15 + rng.nextInt(-50, 50);
  } else if (avgSat < 40) {
    migration = (avgSat - 40) * 20 + rng.nextInt(-50, 50);
  } else {
    migration = rng.nextInt(-100, 100);
  }
  return Math.round(migration);
}

function calcGlobalRank(metrics, pop, avgSat) {
  let avgM = 0;
  for (const k of METRIC_KEYS) avgM += metrics[k];
  avgM /= METRIC_KEYS.length;
  const popFactor = Math.min(1.0, pop / 100000);
  const score = avgM * 0.7 + popFactor * 15 + avgSat * 0.3;
  return Math.max(1, Math.round(10000 - score * 100));
}

function findWeakestCategory(metrics) {
  let worst = null;
  let worstVal = Infinity;
  for (const k of METRIC_KEYS) {
    if (metrics[k] < worstVal) {
      worstVal = metrics[k];
      worst = k;
    }
  }
  return worst;
}

function generateAvailableDecisions(state, rng) {
  const { metrics, budget, usedOnceDecisions, lastTurnDecisionIds, decisionHistory, costMultiplier } = state;

  let pool = ALL_DECISIONS.filter((d) => {
    if (d.once && usedOnceDecisions.includes(d.id)) return false;
    if (d.requires) {
      for (const [k, v] of Object.entries(d.requires)) {
        if ((metrics[k] || 0) < v) return false;
      }
    }
    return true;
  });

  const effectiveCost = (d) => Math.round(d.cost * (costMultiplier || 1));

  const cheapOnes = pool.filter((d) => effectiveCost(d) <= 40);
  const tradeoffs = pool.filter((d) => d.cat === "tradeoff");
  const weakCat = findWeakestCategory(metrics);
  const weakOnes = pool.filter((d) => d.cat === weakCat);

  const notLastTurn = pool.filter((d) => !(lastTurnDecisionIds || []).includes(d.id));
  const preferred = notLastTurn.length >= 6 ? notLastTurn : pool;

  const selected = [];
  const usedIds = new Set();

  const addOne = (candidates) => {
    const avail = candidates.filter((d) => !usedIds.has(d.id));
    if (avail.length > 0) {
      const d = rng.pick(avail);
      selected.push(d);
      usedIds.add(d.id);
    }
  };

  addOne(cheapOnes.length ? cheapOnes : pool);
  addOne(tradeoffs.length ? tradeoffs : pool);
  addOne(weakOnes.length ? weakOnes : pool);

  const rest = rng.shuffle(preferred.filter((d) => !usedIds.has(d.id)));
  for (const d of rest) {
    if (selected.length >= 6) break;
    selected.push(d);
    usedIds.add(d.id);
  }

  while (selected.length < 5 && pool.length > selected.length) {
    const remaining = pool.filter((d) => !usedIds.has(d.id));
    if (remaining.length === 0) break;
    const d = rng.pick(remaining);
    selected.push(d);
    usedIds.add(d.id);
  }

  return selected.sort((a, b) => effectiveCost(a) - effectiveCost(b));
}

function selectEvent(state, rng) {
  const { eventQueue, turn, metrics, usedEventIds } = state;

  const queued = (eventQueue || []).filter((q) => q.targetTurn === turn + 1);
  if (queued.length > 0) {
    const qe = queued[0];
    return ALL_EVENTS.find((e) => e.id === qe.eventId) || null;
  }

  if (rng.next() > 0.4) return null;

  const eligible = ALL_EVENTS.filter((e) => {
    if (e.chain) return false;
    if ((usedEventIds || []).includes(e.id)) return false;
    if (e.requires) {
      for (const [k, v] of Object.entries(e.requires)) {
        if ((metrics[k] || 0) < v) return false;
      }
    }
    return true;
  });

  if (eligible.length === 0) return null;
  return rng.pick(eligible);
}

function processTurn(state, selectedIds, eventChoiceIndex) {
  const rng = createRNG(state.seed);

  let metrics = { ...state.metrics };
  const prevMetrics = { ...state.metrics };
  const prevPop = state.population;
  const prevBudget = state.budget;
  const prevRank = state.globalRank;
  const prevSatisfactions = { ...state.satisfactions };

  // 1. Apply event effects
  let eventBudget = 0;
  let eventPopulation = 0;
  let newEventQueue = [...(state.eventQueue || [])].filter((q) => q.targetTurn !== state.turn + 1);
  let newRecurring = { ...state.recurringEffects };
  let newCostMultiplier = state.costMultiplier || 1;
  let newCostMultiplierTurns = state.costMultiplierTurns || 0;
  let newUsedEventIds = [...(state.usedEventIds || [])];

  if (state.currentEvent) {
    const evt = state.currentEvent;
    newUsedEventIds.push(evt.id);

    if (evt.choices && eventChoiceIndex !== undefined && eventChoiceIndex !== null) {
      const choice = evt.choices[eventChoiceIndex];
      if (choice) {
        for (const [k, v] of Object.entries(choice.effects || {})) {
          metrics[k] = (metrics[k] || 0) + v;
        }
        eventBudget += choice.budget || 0;
        eventPopulation += choice.population || 0;
        if (choice.chainEvents) {
          for (const ce of choice.chainEvents) {
            newEventQueue.push({ eventId: ce.eventId, targetTurn: state.turn + 1 + ce.delay });
          }
        }
        if (choice.recurring) {
          newRecurring = { ...newRecurring, budget: (newRecurring.budget || 0) + choice.recurring };
        }
      }
    } else if (!evt.choices) {
      for (const [k, v] of Object.entries(evt.effects || {})) {
        metrics[k] = (metrics[k] || 0) + v;
      }
      eventBudget += evt.budget || 0;
      eventPopulation += evt.population || 0;

      if (evt.setCostMultiplier) {
        newCostMultiplier = 1.2;
        newCostMultiplierTurns = 3;
      }

      if (evt.specialCheck === "council") {
        const sats = calcAllSatisfactions(metrics);
        const avg = calcAvgSatisfaction(sats);
        if (avg < 50) {
          for (const k of METRIC_KEYS) metrics[k] -= 3;
        } else {
          metrics.culture += 2;
        }
      }
    }
  }

  // 2. Apply decay
  metrics = applyDecay(metrics);

  // 3. Apply decision effects
  let budget = state.budget + eventBudget;
  let population = state.population + eventPopulation;
  const newDecisionHistory = { ...state.decisionHistory };
  const newUsedOnce = [...state.usedOnceDecisions];
  const effectiveCostMult = newCostMultiplier;

  for (const id of selectedIds) {
    const dec = ALL_DECISIONS.find((d) => d.id === id);
    if (!dec) continue;
    const timesUsed = newDecisionHistory[id] || 0;
    const multiplier = Math.pow(0.7, timesUsed);
    for (const [k, v] of Object.entries(dec.effects)) {
      metrics[k] = (metrics[k] || 0) + v * multiplier;
    }
    budget -= Math.round(dec.cost * effectiveCostMult);
    if (dec.recurring) {
      newRecurring = { ...newRecurring, budget: (newRecurring.budget || 0) + dec.recurring };
    }
    if (dec.once) newUsedOnce.push(id);
    if (dec.populationEffect) population += dec.populationEffect;
    newDecisionHistory[id] = timesUsed + 1;
  }

  // 4. Recurring effects
  budget += newRecurring.budget || 0;

  // 5. Mandatory expenses
  const mandatory = calcMandatory(population);
  budget -= mandatory;

  // 6. Revenue
  const revenue = calcRevenue(population, metrics);
  budget += revenue;

  // 7. Debt handling
  let debt = state.debt || 0;
  if (budget < 0) {
    debt += Math.abs(budget);
    budget = 0;
  }
  debt = Math.round(debt * 1.05);
  if (debt > 0 && budget > 0) {
    const payment = Math.min(budget, debt);
    budget -= payment;
    debt -= payment;
  }
  let defaulted = false;
  if (debt > 500) {
    for (const k of METRIC_KEYS) metrics[k] -= 2;
  }
  if (debt > 1000) {
    defaulted = true;
  }

  // 8. Clamp
  metrics = clampMetrics(metrics);

  // 9. Satisfactions
  const satisfactions = calcAllSatisfactions(metrics);
  const avgSat = calcAvgSatisfaction(satisfactions);

  // 10. Migration
  const migration = calcMigration(avgSat, rng);
  const naturalGrowth = Math.round(population * 0.001);
  population += migration + naturalGrowth;
  population = Math.max(1000, population);

  // 11. Rank
  const globalRank = calcGlobalRank(metrics, population, avgSat);

  // 12. Cost multiplier decay
  if (newCostMultiplierTurns > 0) {
    newCostMultiplierTurns -= 1;
    if (newCostMultiplierTurns <= 0) {
      newCostMultiplier = 1;
    }
  }

  // 13. Next event
  const nextTurn = state.turn + 1;
  let nextEvent = null;
  if (nextTurn < MAX_TURNS) {
    nextEvent = selectEvent(
      { ...state, eventQueue: newEventQueue, turn: state.turn, metrics, usedEventIds: newUsedEventIds },
      rng
    );
  }

  // 14. Snapshot
  const snapshot = {
    turn: nextTurn,
    metrics: { ...metrics },
    population,
    budget,
    globalRank,
    satisfaction: { ...satisfactions },
  };

  // 15. Next decisions
  let nextDecisions = [];
  if (nextTurn < MAX_TURNS && !defaulted) {
    nextDecisions = generateAvailableDecisions(
      { metrics, budget, usedOnceDecisions: newUsedOnce, lastTurnDecisionIds: selectedIds, decisionHistory: newDecisionHistory, costMultiplier: newCostMultiplier },
      rng
    );
  }

  const phase = defaulted || nextTurn >= MAX_TURNS ? "end" : "results";

  return {
    phase,
    turn: nextTurn,
    budget: Math.round(budget),
    debt: Math.round(debt),
    population,
    metrics,
    prevMetrics,
    prevPopulation: prevPop,
    prevBudget,
    prevRank,
    prevSatisfactions,
    selectedDecisions: [],
    availableDecisions: nextDecisions,
    usedOnceDecisions: newUsedOnce,
    decisionHistory: newDecisionHistory,
    recurringEffects: newRecurring,
    currentEvent: nextEvent,
    eventQueue: newEventQueue,
    history: [...state.history, snapshot],
    globalRank,
    turnRevenue: revenue,
    turnExpenses: mandatory + selectedIds.reduce((s, id) => {
      const d = ALL_DECISIONS.find((x) => x.id === id);
      return s + (d ? Math.round(d.cost * effectiveCostMult) : 0);
    }, 0),
    seed: rng.getSeed(),
    costMultiplier: newCostMultiplier,
    costMultiplierTurns: newCostMultiplierTurns,
    satisfactions,
    defaulted,
    usedEventIds: newUsedEventIds,
    lastTurnDecisionIds: selectedIds,
  };
}

// ─── Section 6: Reducer ──────────────────────────────────────────────────────

function createInitialState(seed) {
  const rng = createRNG(seed);
  const metrics = { ...INIT_METRICS };
  const satisfactions = calcAllSatisfactions(metrics);
  const avgSat = calcAvgSatisfaction(satisfactions);
  const rank = calcGlobalRank(metrics, INIT_POP, avgSat);
  const decisions = generateAvailableDecisions(
    { metrics, budget: INIT_BUDGET, usedOnceDecisions: [], lastTurnDecisionIds: [], decisionHistory: {}, costMultiplier: 1 },
    rng
  );

  return {
    phase: "start",
    turn: 0,
    budget: INIT_BUDGET,
    debt: 0,
    population: INIT_POP,
    metrics,
    prevMetrics: { ...metrics },
    prevPopulation: INIT_POP,
    prevBudget: INIT_BUDGET,
    prevRank: rank,
    prevSatisfactions: { ...satisfactions },
    selectedDecisions: [],
    availableDecisions: decisions,
    usedOnceDecisions: [],
    decisionHistory: {},
    recurringEffects: { budget: 0 },
    currentEvent: null,
    eventQueue: [],
    history: [{ turn: 0, metrics: { ...metrics }, population: INIT_POP, budget: INIT_BUDGET, globalRank: rank, satisfaction: { ...satisfactions } }],
    globalRank: rank,
    turnRevenue: 0,
    turnExpenses: 0,
    seed: rng.getSeed(),
    costMultiplier: 1,
    costMultiplierTurns: 0,
    satisfactions,
    defaulted: false,
    usedEventIds: [],
    lastTurnDecisionIds: [],
  };
}

function gameReducer(state, action) {
  switch (action.type) {
    case "START_GAME": {
      const s = createInitialState(action.seed || Date.now());
      const rng = createRNG(s.seed);
      const evt = selectEvent(s, rng);
      return {
        ...s,
        phase: evt ? "event" : "decisions",
        currentEvent: evt,
        seed: rng.getSeed(),
      };
    }

    case "SELECT_DECISION": {
      const id = action.id;
      const sel = state.selectedDecisions.includes(id)
        ? state.selectedDecisions.filter((x) => x !== id)
        : state.selectedDecisions.length < MAX_PICKS
          ? [...state.selectedDecisions, id]
          : state.selectedDecisions;
      return { ...state, selectedDecisions: sel };
    }

    case "SUBMIT_DECISIONS": {
      return processTurn(state, state.selectedDecisions, null);
    }

    case "CONTINUE_EVENT": {
      return { ...state, phase: "decisions" };
    }

    case "CHOOSE_EVENT": {
      return { ...state, phase: "decisions", eventChoiceIndex: action.index };
    }

    case "NEXT_TURN": {
      if (state.turn >= MAX_TURNS || state.defaulted) {
        return { ...state, phase: "end" };
      }
      if (state.currentEvent) {
        return { ...state, phase: "event" };
      }
      return { ...state, phase: "decisions" };
    }

    case "SUBMIT_WITH_EVENT": {
      return processTurn(state, state.selectedDecisions, state.eventChoiceIndex ?? null);
    }

    case "RESTART": {
      return { ...createInitialState(Date.now()), phase: "start" };
    }

    default:
      return state;
  }
}

// ─── Section 7: UI Helpers ───────────────────────────────────────────────────

function DeltaValue({ value, suffix = "" }) {
  if (!value || value === 0) return null;
  const positive = value > 0;
  return (
    <span className={positive ? "text-emerald-400 text-sm font-medium" : "text-red-400 text-sm font-medium"}>
      {positive ? "+" : ""}{typeof value === "number" ? Math.round(value) : value}{suffix}
    </span>
  );
}

function MetricBar({ metricKey, value, prevValue, compact = false }) {
  const cfg = METRICS_CFG[metricKey];
  if (!cfg) return null;
  const { name, color, Icon } = cfg;
  const delta = Math.round(value - prevValue);
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div className={compact ? "mb-1.5" : "mb-3"}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <Icon size={compact ? 14 : 16} style={{ color }} />
          <span className={compact ? "text-xs text-slate-300" : "text-sm text-slate-300"}>{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={compact ? "text-xs font-bold text-white" : "text-sm font-bold text-white"}>{Math.round(value)}</span>
          {delta !== 0 && <DeltaValue value={delta} />}
        </div>
      </div>
      <div className={`w-full rounded-full overflow-hidden ${compact ? "h-1.5" : "h-2"}`} style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function GroupSatisfaction({ groupKey, value, prevValue }) {
  const g = GROUPS[groupKey];
  if (!g) return null;
  const delta = Math.round(value - prevValue);
  const pct = Math.max(0, Math.min(100, value));
  const barColor = pct >= 60 ? "#22c55e" : pct >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-xs text-slate-400">{g.name}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white">{Math.round(pct)}%</span>
          {delta !== 0 && <DeltaValue value={delta} suffix="%" />}
        </div>
      </div>
      <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </div>
    </div>
  );
}

function EffectBadge({ metricKey, value }) {
  const cfg = METRICS_CFG[metricKey];
  if (!cfg) return null;
  const positive = value > 0;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
      style={{
        backgroundColor: positive ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
        color: positive ? "#86efac" : "#fca5a5",
      }}
    >
      <cfg.Icon size={12} />
      {positive ? "+" : ""}{value}
    </span>
  );
}

function DecisionCard({ decision, selected, affordable, onToggle, usageCount, costMultiplier = 1 }) {
  const cost = Math.round(decision.cost * costMultiplier);
  const disabled = !affordable && !selected;
  const hasNegative = Object.values(decision.effects).some((v) => v < 0);

  return (
    <button
      onClick={() => !disabled && onToggle(decision.id)}
      disabled={disabled}
      className={`
        w-full text-left rounded-xl p-4 border-2 transition-all duration-300
        ${selected
          ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10"
          : disabled
            ? "border-slate-700/50 bg-slate-800/30 opacity-50 cursor-not-allowed"
            : hasNegative
              ? "border-amber-700/40 bg-slate-800/60 hover:border-amber-500/60 hover:bg-slate-800/80 cursor-pointer"
              : "border-slate-700/40 bg-slate-800/60 hover:border-slate-500/60 hover:bg-slate-800/80 cursor-pointer"
        }
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-bold text-white leading-tight pr-2">{decision.name}</h3>
        <div className="flex items-center gap-1 shrink-0">
          <Coins size={14} className="text-yellow-500" />
          <span className="text-sm font-bold text-yellow-500">{cost}</span>
        </div>
      </div>
      <p className="text-xs text-slate-400 mb-3 leading-relaxed">{decision.desc}</p>
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(decision.effects).map(([k, v]) => (
          <EffectBadge key={k} metricKey={k} value={usageCount > 0 ? Math.round(v * Math.pow(0.7, usageCount)) : v} />
        ))}
        {decision.recurring && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-500/15 text-purple-300">
            {decision.recurring > 0 ? "+" : ""}{decision.recurring}/ход
          </span>
        )}
        {decision.populationEffect && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-cyan-500/15 text-cyan-300">
            <Users size={12} />+{decision.populationEffect}
          </span>
        )}
        {decision.once && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-600/30 text-slate-400">
            Разовое
          </span>
        )}
      </div>
      {usageCount > 0 && (
        <div className="mt-2 text-xs text-amber-400/70">Эффект снижен (принято ранее: {usageCount})</div>
      )}
    </button>
  );
}

function FadeIn({ children, className = "" }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${className}`}>
      {children}
    </div>
  );
}

// ─── Section 8: Start Screen ─────────────────────────────────────────────────

function StartScreen({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />

      <FadeIn className="relative z-10 text-center max-w-2xl">
        <div className="mb-8">
          <svg viewBox="0 0 400 180" className="w-80 mx-auto mb-6 opacity-80">
            <rect x="0" y="140" width="400" height="40" rx="4" fill="#1e3a5f" opacity="0.3" />
            <path d="M40,140 Q200,100 360,140" stroke="#3b82f6" fill="none" strokeWidth="2" opacity="0.4" />

            <rect x="60" y="80" width="35" height="60" rx="2" fill="#334155" />
            <rect x="65" y="85" width="8" height="10" rx="1" fill="#fbbf24" opacity="0.6" />
            <rect x="80" y="85" width="8" height="10" rx="1" fill="#fbbf24" opacity="0.4" />
            <rect x="65" y="100" width="8" height="10" rx="1" fill="#fbbf24" opacity="0.5" />
            <rect x="80" y="100" width="8" height="10" rx="1" fill="#fbbf24" opacity="0.3" />

            <rect x="110" y="60" width="40" height="80" rx="2" fill="#475569" />
            <polygon points="130,40 108,60 152,60" fill="#64748b" />
            <circle cx="130" cy="52" r="4" fill="#fbbf24" opacity="0.7" />
            <rect x="115" y="70" width="8" height="12" rx="1" fill="#fbbf24" opacity="0.5" />
            <rect x="135" y="70" width="8" height="12" rx="1" fill="#fbbf24" opacity="0.4" />
            <rect x="120" y="110" width="18" height="30" rx="1" fill="#1e293b" />

            <rect x="170" y="55" width="60" height="85" rx="2" fill="#475569" />
            <polygon points="200,30 167,55 233,55" fill="#64748b" />
            <circle cx="200" cy="43" r="5" fill="#f59e0b" opacity="0.8" />
            <rect x="180" y="65" width="10" height="14" rx="1" fill="#fbbf24" opacity="0.6" />
            <rect x="195" y="65" width="10" height="14" rx="1" fill="#fbbf24" opacity="0.4" />
            <rect x="210" y="65" width="10" height="14" rx="1" fill="#fbbf24" opacity="0.5" />
            <rect x="188" y="105" width="24" height="35" rx="2" fill="#1e293b" />

            <rect x="250" y="75" width="45" height="65" rx="2" fill="#334155" />
            <rect x="255" y="80" width="10" height="12" rx="1" fill="#fbbf24" opacity="0.5" />
            <rect x="270" y="80" width="10" height="12" rx="1" fill="#fbbf24" opacity="0.4" />
            <rect x="255" y="97" width="10" height="12" rx="1" fill="#fbbf24" opacity="0.3" />
            <rect x="270" y="97" width="10" height="12" rx="1" fill="#fbbf24" opacity="0.6" />
            <rect x="262" y="115" width="16" height="25" rx="1" fill="#1e293b" />

            <rect x="310" y="90" width="35" height="50" rx="2" fill="#334155" />
            <rect x="315" y="95" width="8" height="10" rx="1" fill="#fbbf24" opacity="0.5" />
            <rect x="330" y="95" width="8" height="10" rx="1" fill="#fbbf24" opacity="0.3" />
            <rect x="318" y="115" width="14" height="25" rx="1" fill="#1e293b" />

            <circle cx="25" cy="30" r="2" fill="#fbbf24" opacity="0.4" />
            <circle cx="375" cy="45" r="1.5" fill="#fbbf24" opacity="0.3" />
            <circle cx="340" cy="25" r="2" fill="#fbbf24" opacity="0.5" />
            <circle cx="70" cy="20" r="1.5" fill="#fbbf24" opacity="0.3" />

            <g transform="translate(160,135)" opacity="0.3">
              <TreePine size={20} />
            </g>
          </svg>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <MapPin className="text-blue-400" size={24} />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
            Звенигород
          </h1>
        </div>
        <h2 className="text-xl md:text-2xl font-light text-slate-400 mb-8 tracking-wide">
          Симулятор Мэра
        </h2>

        <p className="text-base text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed">
          Вы — новый мэр Звенигорода. У вас 5 лет (20 кварталов), чтобы
          превратить тихий подмосковный город в лучшее место для жизни
          на планете.
        </p>

        <button
          onClick={onStart}
          className="group inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/20 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Play size={22} className="group-hover:scale-110 transition-transform" />
          Начать игру
        </button>

        <div className="mt-12 flex items-center gap-6 text-xs text-slate-600 justify-center">
          <span>Население: 25 000</span>
          <span>Бюджет: 850 млн</span>
          <span>Рейтинг: ~8500</span>
        </div>
      </FadeIn>
    </div>
  );
}

// ─── Section 9: Event Phase ──────────────────────────────────────────────────

function EventPhase({ event, onContinue, onChoice }) {
  if (!event) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <FadeIn className="max-w-xl w-full">
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-950/30 to-slate-900/80 p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="text-amber-400" size={20} />
            <span className="text-sm font-bold text-amber-400 uppercase tracking-wider">Событие</span>
          </div>

          <p className="text-xl text-white leading-relaxed mb-6">{event.text}</p>

          {!event.choices && (
            <>
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(event.effects || {}).map(([k, v]) => (
                  <EffectBadge key={k} metricKey={k} value={v} />
                ))}
                {event.budget !== 0 && event.budget && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${event.budget > 0 ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}>
                    <Coins size={12} />{event.budget > 0 ? "+" : ""}{event.budget} млн
                  </span>
                )}
                {event.population && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-cyan-500/15 text-cyan-300">
                    <Users size={12} />+{event.population}
                  </span>
                )}
              </div>
              <button
                onClick={onContinue}
                className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors"
              >
                Продолжить
              </button>
            </>
          )}

          {event.choices && (
            <div className="space-y-3">
              {event.choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => onChoice(i)}
                  className="w-full text-left rounded-xl p-4 border border-slate-600/50 bg-slate-800/60 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all"
                >
                  <div className="font-bold text-white mb-2">{choice.label}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(choice.effects || {}).map(([k, v]) => (
                      <EffectBadge key={k} metricKey={k} value={v} />
                    ))}
                    {choice.budget !== 0 && choice.budget && (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${choice.budget > 0 ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}>
                        <Coins size={12} />{choice.budget > 0 ? "+" : ""}{choice.budget} млн
                      </span>
                    )}
                    {choice.population && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-cyan-500/15 text-cyan-300">
                        <Users size={12} />+{choice.population}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}

// ─── Section 10: Decision Phase ──────────────────────────────────────────────

function DecisionPhase({ state, dispatch }) {
  const { turn, budget, debt, population, metrics, prevMetrics, selectedDecisions, availableDecisions, globalRank, satisfactions, prevSatisfactions, recurringEffects, costMultiplier, costMultiplierTurns } = state;

  const totalCost = selectedDecisions.reduce((s, id) => {
    const d = ALL_DECISIONS.find((x) => x.id === id);
    return s + (d ? Math.round(d.cost * (costMultiplier || 1)) : 0);
  }, 0);

  const revenue = calcRevenue(population, metrics);
  const mandatory = calcMandatory(population);

  const [showGroups, setShowGroups] = useState(true);
  const avgSat = calcAvgSatisfaction(satisfactions);

  const rankTrend = state.history.length >= 2
    ? state.history[state.history.length - 2].globalRank - globalRank
    : 0;

  return (
    <div className="min-h-screen px-3 md:px-6 py-4 md:py-6">
      <FadeIn>
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg md:text-xl font-black text-white">
              Квартал {turn + 1} из {MAX_TURNS}
            </h1>
            <div className="flex items-center gap-2">
              <Crown size={16} className="text-yellow-500" />
              <span className="text-sm font-bold text-white">#{globalRank}</span>
              {rankTrend !== 0 && <DeltaValue value={rankTrend} />}
            </div>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${((turn) / MAX_TURNS) * 100}%` }}
            />
          </div>
        </div>

        {costMultiplierTurns > 0 && (
          <div className="mb-4 px-4 py-2 rounded-lg bg-amber-900/30 border border-amber-700/40 text-amber-300 text-xs">
            Цены на строительство повышены на 20% (осталось ходов: {costMultiplierTurns})
          </div>
        )}

        {debt > 0 && (
          <div className={`mb-4 px-4 py-2 rounded-lg border text-xs ${debt > 500 ? "bg-red-900/30 border-red-700/40 text-red-300" : "bg-yellow-900/30 border-yellow-700/40 text-yellow-300"}`}>
            Долг: {Math.round(debt)} млн руб. {debt > 500 ? "(Штраф: -2 ко всем метрикам каждый ход!)" : "(5% годовых)"}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Left: City Dashboard */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            {/* Budget */}
            <div className="rounded-xl bg-slate-800/50 border border-slate-700/40 p-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Бюджет</h2>
              <div className="text-2xl font-black text-white mb-2">
                {Math.round(budget)} <span className="text-sm font-normal text-slate-400">млн руб.</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-slate-400">Доход/кв.:</div>
                <div className="text-emerald-400 font-medium text-right">+{revenue}</div>
                <div className="text-slate-400">Обяз. расходы:</div>
                <div className="text-red-400 font-medium text-right">-{mandatory}</div>
                {(recurringEffects.budget || 0) !== 0 && (
                  <>
                    <div className="text-slate-400">Рекуррентные:</div>
                    <div className={`font-medium text-right ${recurringEffects.budget > 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {recurringEffects.budget > 0 ? "+" : ""}{recurringEffects.budget}
                    </div>
                  </>
                )}
                <div className="text-slate-400">Выбрано:</div>
                <div className="text-yellow-400 font-medium text-right">-{totalCost}</div>
              </div>
            </div>

            {/* Population */}
            <div className="rounded-xl bg-slate-800/50 border border-slate-700/40 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-cyan-400" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Население</span>
                </div>
                <span className="text-lg font-black text-white">{population.toLocaleString("ru-RU")}</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="rounded-xl bg-slate-800/50 border border-slate-700/40 p-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Метрики города</h2>
              {METRIC_KEYS.map((k) => (
                <MetricBar key={k} metricKey={k} value={metrics[k]} prevValue={prevMetrics[k]} />
              ))}
            </div>

            {/* Groups */}
            <div className="rounded-xl bg-slate-800/50 border border-slate-700/40 p-4">
              <button
                onClick={() => setShowGroups(!showGroups)}
                className="flex items-center justify-between w-full mb-2"
              >
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Удовлетворённость ({Math.round(avgSat)}%)
                </h2>
                {showGroups ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
              </button>
              {showGroups && GROUP_KEYS.map((k) => (
                <GroupSatisfaction key={k} groupKey={k} value={satisfactions[k]} prevValue={(prevSatisfactions || {})[k] || satisfactions[k]} />
              ))}
            </div>
          </div>

          {/* Right: Decisions */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-300">
                Решения <span className="text-slate-500">({selectedDecisions.length} из {MAX_PICKS})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {availableDecisions.map((d) => {
                const cost = Math.round(d.cost * (costMultiplier || 1));
                const selected = selectedDecisions.includes(d.id);
                const otherCost = totalCost - (selected ? cost : 0);
                const affordable = (budget - otherCost - cost) >= -50;
                return (
                  <DecisionCard
                    key={d.id}
                    decision={d}
                    selected={selected}
                    affordable={affordable || selected}
                    onToggle={(id) => dispatch({ type: "SELECT_DECISION", id })}
                    usageCount={state.decisionHistory[d.id] || 0}
                    costMultiplier={costMultiplier || 1}
                  />
                );
              })}
            </div>

            <button
              onClick={() => {
                if (state.eventChoiceIndex !== undefined && state.eventChoiceIndex !== null) {
                  dispatch({ type: "SUBMIT_WITH_EVENT" });
                } else {
                  dispatch({ type: "SUBMIT_DECISIONS" });
                }
              }}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl transition-all text-lg"
            >
              {selectedDecisions.length === 0 ? "Пропустить ход" : "Завершить ход"}
              {selectedDecisions.length > 0 && <span className="text-blue-200 ml-2">(-{totalCost} млн)</span>}
            </button>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

// ─── Section 11: Results Phase ───────────────────────────────────────────────

function ResultsPhase({ state, dispatch }) {
  const { metrics, prevMetrics, population, prevPopulation, budget, prevBudget, globalRank, prevRank, satisfactions, prevSatisfactions, turnRevenue, turnExpenses, debt, turn } = state;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <FadeIn className="max-w-2xl w-full">
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/40 p-6 md:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-black text-white mb-1">Итоги квартала {turn}</h2>
            <p className="text-sm text-slate-400">Результаты ваших решений</p>
          </div>

          {/* Rank */}
          <div className="text-center mb-6 p-4 rounded-xl bg-slate-900/50">
            <div className="text-xs text-slate-400 mb-1">Глобальный рейтинг</div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-black text-white">#{globalRank}</span>
              <DeltaValue value={prevRank - globalRank} />
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Метрики</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              {METRIC_KEYS.map((k) => {
                const delta = Math.round(metrics[k] - prevMetrics[k]);
                return (
                  <div key={k} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-1.5">
                      {React.createElement(METRICS_CFG[k].Icon, { size: 14, style: { color: METRICS_CFG[k].color } })}
                      <span className="text-sm text-slate-300">{METRICS_CFG[k].name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{Math.round(metrics[k])}</span>
                      {delta !== 0 && <DeltaValue value={delta} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Budget & Population */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl bg-slate-900/50 p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">Бюджет</div>
              <div className="text-lg font-bold text-white">{Math.round(budget)}</div>
              <DeltaValue value={Math.round(budget - prevBudget)} suffix=" млн" />
            </div>
            <div className="rounded-xl bg-slate-900/50 p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">Население</div>
              <div className="text-lg font-bold text-white">{population.toLocaleString("ru-RU")}</div>
              <DeltaValue value={population - prevPopulation} />
            </div>
          </div>

          {debt > 0 && (
            <div className={`mb-6 p-3 rounded-xl text-center text-sm font-bold ${debt > 500 ? "bg-red-900/30 text-red-300" : "bg-yellow-900/30 text-yellow-300"}`}>
              Долг: {Math.round(debt)} млн руб.
            </div>
          )}

          {/* Satisfactions */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Удовлетворённость</h3>
            <div className="grid grid-cols-1 gap-1">
              {GROUP_KEYS.map((k) => (
                <GroupSatisfaction key={k} groupKey={k} value={satisfactions[k]} prevValue={(prevSatisfactions || {})[k] || satisfactions[k]} />
              ))}
            </div>
          </div>

          <button
            onClick={() => dispatch({ type: "NEXT_TURN" })}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors text-lg flex items-center justify-center gap-2"
          >
            {turn >= MAX_TURNS || state.defaulted ? "Результаты" : "Следующий квартал"}
            <ArrowRight size={20} />
          </button>
        </div>
      </FadeIn>
    </div>
  );
}

// ─── Section 12: End Screen ──────────────────────────────────────────────────

function getGrade(rank) {
  if (rank <= 50) return { letter: "S", label: "Легенда", color: "#fbbf24", bg: "from-yellow-900/40 to-yellow-950/20" };
  if (rank <= 200) return { letter: "A", label: "Мировой лидер", color: "#22c55e", bg: "from-green-900/40 to-green-950/20" };
  if (rank <= 1000) return { letter: "B", label: "Город мечты", color: "#3b82f6", bg: "from-blue-900/40 to-blue-950/20" };
  if (rank <= 3000) return { letter: "C", label: "Растущая звезда", color: "#a855f7", bg: "from-purple-900/40 to-purple-950/20" };
  if (rank <= 6000) return { letter: "D", label: "Середнячок", color: "#f59e0b", bg: "from-amber-900/40 to-amber-950/20" };
  return { letter: "F", label: "Провал", color: "#ef4444", bg: "from-red-900/40 to-red-950/20" };
}

function EndScreen({ state, onRestart }) {
  const grade = getGrade(state.globalRank);
  const initMetrics = INIT_METRICS;
  const history = state.history;

  const rankData = history.map((h) => ({ turn: `К${h.turn}`, rank: h.globalRank }));
  const popData = history.map((h) => ({ turn: `К${h.turn}`, pop: h.population }));

  const bestMetric = METRIC_KEYS.reduce((best, k) => {
    const delta = state.metrics[k] - initMetrics[k];
    return delta > best.delta ? { key: k, delta } : best;
  }, { key: "", delta: -Infinity });

  const worstMetric = METRIC_KEYS.reduce((worst, k) => {
    const delta = state.metrics[k] - initMetrics[k];
    return delta < worst.delta ? { key: k, delta } : worst;
  }, { key: "", delta: Infinity });

  return (
    <div className="min-h-screen px-4 py-8 md:py-12">
      <FadeIn className="max-w-3xl mx-auto">
        {/* Grade */}
        <div className={`text-center rounded-2xl bg-gradient-to-b ${grade.bg} border border-slate-700/40 p-8 mb-6`}>
          {state.defaulted && (
            <div className="mb-4 px-4 py-2 inline-block rounded-full bg-red-900/50 text-red-300 text-sm font-bold">
              Дефолт! Город обанкротился.
            </div>
          )}
          <div className="text-8xl font-black mb-2" style={{ color: grade.color }}>{grade.letter}</div>
          <div className="text-xl font-bold text-white mb-1">{grade.label}</div>
          <div className="text-slate-400">Финальный рейтинг: <span className="text-white font-bold">#{state.globalRank}</span></div>
          <div className="text-slate-500 text-sm mt-1">Население: {state.population.toLocaleString("ru-RU")}</div>
        </div>

        {/* Metrics Comparison */}
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/40 p-6 mb-6">
          <h3 className="text-sm font-bold text-slate-300 mb-4">Сравнение метрик</h3>
          <div className="space-y-2">
            {METRIC_KEYS.map((k) => {
              const start = initMetrics[k];
              const end = Math.round(state.metrics[k]);
              const delta = end - start;
              return (
                <div key={k} className="flex items-center gap-3">
                  {React.createElement(METRICS_CFG[k].Icon, { size: 16, style: { color: METRICS_CFG[k].color } })}
                  <span className="text-sm text-slate-400 w-32 shrink-0">{METRICS_CFG[k].name}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-8 text-right">{start}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${end}%`, backgroundColor: METRICS_CFG[k].color }} />
                    </div>
                    <span className="text-sm font-bold text-white w-8">{end}</span>
                    <div className="w-12 text-right"><DeltaValue value={delta} /></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl bg-slate-800/60 border border-slate-700/40 p-4">
            <h3 className="text-sm font-bold text-slate-300 mb-3">Рейтинг</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rankData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="turn" tick={{ fill: "#64748b", fontSize: 10 }} />
                  <YAxis reversed tick={{ fill: "#64748b", fontSize: 10 }} domain={["dataMin - 200", "dataMax + 200"]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                    labelStyle={{ color: "#94a3b8" }}
                    itemStyle={{ color: "#3b82f6" }}
                  />
                  <Line type="monotone" dataKey="rank" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: "#3b82f6" }} name="Рейтинг" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-800/60 border border-slate-700/40 p-4">
            <h3 className="text-sm font-bold text-slate-300 mb-3">Население</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={popData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="turn" tick={{ fill: "#64748b", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                    labelStyle={{ color: "#94a3b8" }}
                    itemStyle={{ color: "#06b6d4" }}
                  />
                  <Line type="monotone" dataKey="pop" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3, fill: "#06b6d4" }} name="Население" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/40 p-6 mb-6">
          <h3 className="text-sm font-bold text-slate-300 mb-3">Итоги правления</h3>
          <div className="space-y-2 text-sm text-slate-400">
            {bestMetric.delta > 0 && (
              <p>Лучший рост: <span className="text-white font-medium">{METRICS_CFG[bestMetric.key]?.name}</span> <span className="text-emerald-400">+{bestMetric.delta}</span></p>
            )}
            {worstMetric.delta < 0 && (
              <p>Наибольшее падение: <span className="text-white font-medium">{METRICS_CFG[worstMetric.key]?.name}</span> <span className="text-red-400">{worstMetric.delta}</span></p>
            )}
            <p>Финальный бюджет: <span className="text-white font-medium">{Math.round(state.budget)} млн руб.</span></p>
            {state.debt > 0 && <p>Непогашенный долг: <span className="text-red-400 font-medium">{Math.round(state.debt)} млн руб.</span></p>}
            <p>Рост населения: <span className="text-white font-medium">{state.population > INIT_POP ? "+" : ""}{state.population - INIT_POP}</span></p>
            <p>Кварталов сыграно: <span className="text-white font-medium">{state.turn}</span></p>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors text-lg flex items-center justify-center gap-2"
        >
          <RotateCcw size={20} />
          Играть снова
        </button>
      </FadeIn>
    </div>
  );
}

// ─── Section 13: Main Component ──────────────────────────────────────────────

export default function ZvenigorodMayorSim() {
  const [state, dispatch] = useReducer(gameReducer, Date.now(), createInitialState);

  const handleStart = () => dispatch({ type: "START_GAME", seed: Date.now() });
  const handleRestart = () => dispatch({ type: "RESTART" });
  const handleContinueEvent = () => dispatch({ type: "CONTINUE_EVENT" });
  const handleChoiceEvent = (index) => dispatch({ type: "CHOOSE_EVENT", index });
  const handleNextTurn = () => dispatch({ type: "NEXT_TURN" });

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-blue-500/30">
      {state.phase === "start" && <StartScreen onStart={handleStart} />}
      {state.phase === "event" && <EventPhase event={state.currentEvent} onContinue={handleContinueEvent} onChoice={handleChoiceEvent} />}
      {state.phase === "decisions" && <DecisionPhase state={state} dispatch={dispatch} />}
      {state.phase === "results" && <ResultsPhase state={state} dispatch={dispatch} />}
      {state.phase === "end" && <EndScreen state={state} onRestart={handleRestart} />}
    </div>
  );
}
