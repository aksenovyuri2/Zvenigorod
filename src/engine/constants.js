export const METRIC_KEYS = ["infrastructure","ecology","culture","digital","safety","healthcare","education","economy"];

export const METRICS_CFG = {
  infrastructure: { name: "Инфраструктура", color: "#f59e0b", icon: "Building2", desc: "Дороги, водопровод, ЖКХ, транспорт" },
  ecology:        { name: "Экология",       color: "#22c55e", icon: "TreePine", desc: "Чистота воздуха, зелень, переработка" },
  culture:        { name: "Культура",       color: "#a855f7", icon: "Palette", desc: "Достопримечательности, мероприятия, досуг" },
  digital:        { name: "Цифровизация",   color: "#3b82f6", icon: "Wifi", desc: "Интернет, цифровые сервисы, умный город" },
  safety:         { name: "Безопасность",   color: "#ef4444", icon: "Shield", desc: "Полиция, пожарные, МЧС, освещение" },
  healthcare:     { name: "Здравоохранение", color: "#ec4899", icon: "Heart", desc: "Медицина, поликлиники, скорая" },
  education:      { name: "Образование",    color: "#06b6d4", icon: "GraduationCap", desc: "Школы, детсады, библиотеки" },
  economy:        { name: "Экономика",      color: "#f97316", icon: "TrendingUp", desc: "Бизнес-среда, рабочие места" },
};

export const GROUPS = {
  elderly:     { name: "Пожилые",       weights: { healthcare:.30, safety:.25, ecology:.20, culture:.15, infrastructure:.10 } },
  freelancers: { name: "Фрилансеры",    weights: { digital:.30, culture:.20, ecology:.20, economy:.15, infrastructure:.15 } },
  families:    { name: "Семьи с детьми", weights: { education:.30, safety:.25, healthcare:.20, infrastructure:.15, ecology:.10 } },
  youth:       { name: "Молодёжь",       weights: { culture:.25, digital:.25, economy:.20, education:.20, ecology:.10 } },
  business:    { name: "Бизнес",         weights: { economy:.30, infrastructure:.25, digital:.20, safety:.15, education:.10 } },
};
export const GROUP_KEYS = Object.keys(GROUPS);

export const INIT_METRICS = { infrastructure:35, ecology:55, culture:40, digital:20, safety:35, healthcare:35, education:35, economy:30 };
export const INIT_BUDGET = 500;
export const INIT_POP = 25000;
export const MAX_TURNS = 40;
export const ELECTION_TURN = 20;
export const MAX_PICKS = 2;
export const INIT_APPROVAL = 55;

export const SEASON_NAMES = ["Зима","Весна","Лето","Осень"];
export const SEASON_EFFECTS = [
  { infrastructure:-1, healthcare:-1 },
  { ecology:1, infrastructure:-1 },
  { culture:1, economy:1, ecology:-1 },
  { education:1, economy:-1 },
];

// Difficulty levels for v3
export const DIFFICULTIES = {
  easy:   { label: "Лёгкий",   decayMult: 0.5, eventProb: 0.20, budgetMult: 1.3, maxPicks: 3, revenueMult: 1.15, expenseMult: 0.9 },
  normal: { label: "Нормальный", decayMult: 0.8, eventProb: 0.35,  budgetMult: 1.0, maxPicks: 2, revenueMult: 1.0, expenseMult: 1.0 },
  hard:   { label: "Сложный",   decayMult: 1.1, eventProb: 0.40, budgetMult: 0.85, maxPicks: 2, revenueMult: 0.92, expenseMult: 1.05 },
  hardcore:{ label: "Хардкор",  decayMult: 1.4, eventProb: 0.50,  budgetMult: 0.7, maxPicks: 1, revenueMult: 0.82, expenseMult: 1.1 },
};

// Scenarios for v3
export const SCENARIOS = [
  { id: "standard",   name: "Стандарт",         desc: "Классический Звенигород",                  metricsModifier: {}, budgetModifier: 0, debtModifier: 0, approvalModifier: 0 },
  { id: "post_crisis", name: "После кризиса",    desc: "Предыдущий мэр обанкротил город",         metricsModifier: { _all: -10 }, budgetModifier: -650, debtModifier: 300, approvalModifier: -20 },
  { id: "golden",      name: "Золотой наследник", desc: "Предыдущий мэр оставил запас",            metricsModifier: {}, budgetModifier: 650, debtModifier: 0, approvalModifier: -25 },
  { id: "eco_mandate", name: "Эко-мандат",        desc: "Избран на волне эко-протестов",            metricsModifier: { ecology: 20, economy: -10 }, budgetModifier: 0, debtModifier: 0, approvalModifier: 0, promise: { metric: "ecology", min: 60, penalty: -15 } },
  { id: "digital_dream", name: "Цифровая мечта", desc: "Город получил грант на цифровизацию",     metricsModifier: { digital: 15 }, budgetModifier: 200, debtModifier: 0, approvalModifier: 0, digitalOnly: true },
  { id: "tourist_mecca", name: "Туристическая Мекка", desc: "Хлынул поток туристов — инфраструктура не готова", metricsModifier: { culture: 20, infrastructure: -15, economy: 10 }, budgetModifier: 100, debtModifier: 0, approvalModifier: 5 },
  { id: "science_city",  name: "Наукоград",          desc: "ИТ-компании хотят прийти — нужно образование и digital", metricsModifier: { education: 15, digital: 10, economy: -10 }, budgetModifier: 50, debtModifier: 0, approvalModifier: -5 },
  { id: "soviet_legacy", name: "Советское наследие", desc: "Постсоветский упадок: долги, но высокое доверие", metricsModifier: { _all: -15, safety: 5 }, budgetModifier: -400, debtModifier: 500, approvalModifier: 15 },
  { id: "moscow_suburb", name: "Пригород Москвы",    desc: "Москва давит: жители уезжают, нужно удержать людей", metricsModifier: { economy: -15, infrastructure: 10 }, budgetModifier: 0, debtModifier: 0, approvalModifier: -10, annexRisk: true },
  { id: "young_city",    name: "Молодой город",      desc: "Высокая доля молодёжи, мало пожилых, быстрый рост", metricsModifier: { digital: 10, culture: 10, healthcare: -10 }, budgetModifier: 0, debtModifier: 0, approvalModifier: 5, youthBonus: true },
  // Phase 6 challenge scenarios
  { id: "speedrun",      name: "Спидран",            desc: "20 ходов. Войди в топ-30 мирового рейтинга", metricsModifier: { _all: 5 }, budgetModifier: 200, debtModifier: 0, approvalModifier: 0, maxTurns: 20 },
  { id: "green_only",    name: "Только зелёный",     desc: "Только экология, здоровье и образование. Никакой промышленности", metricsModifier: { ecology: 10, healthcare: 5, economy: -20 }, budgetModifier: -200, debtModifier: 0, approvalModifier: 0 },
  { id: "legacy",        name: "Наследие",           desc: "Начни с бонусами от прошлых ранов", metricsModifier: {}, budgetModifier: 0, debtModifier: 0, approvalModifier: 0 },
];

export const WEEKLY_SCENARIOS = [
  { id: "weekly_flood", name: "Великий паводок", desc: "Москва-река вышла из берегов — спасай город!", metricsModifier: { infrastructure: -20, ecology: -10 }, budgetModifier: -300, debtModifier: 0, approvalModifier: -15 },
  { id: "weekly_oligarch", name: "Олигарх в городе", desc: "Олигарх скупает землю. Устоишь?", metricsModifier: { economy: 20, culture: -15 }, budgetModifier: 400, debtModifier: 0, approvalModifier: -20 },
  { id: "weekly_pandemic", name: "Эпидемия", desc: "Вирус поразил Звенигород", metricsModifier: { healthcare: -25, economy: -15 }, budgetModifier: -200, debtModifier: 0, approvalModifier: -10 },
  { id: "weekly_techboom", name: "Техно-бум", desc: "IT-гиганты хотят в Звенигород, но город не готов", metricsModifier: { digital: 25, infrastructure: -20, ecology: -10 }, budgetModifier: 300, debtModifier: 0, approvalModifier: 0 },
];

// Districts of Zvenigorod (enriched for Phase 3 district gameplay)
export const DISTRICTS = [
  { id: "verkhny_posad", name: "Верхний Посад", specialty: "culture", baseMetrics: { culture: 15, infrastructure: 8 }, population: 3000, desc: "Исторический центр с видом на монастырь" },
  { id: "nizhny_posad", name: "Нижний Посад", specialty: "economy", baseMetrics: { economy: 12, infrastructure: 10 }, population: 4500, desc: "Торговый район у реки, рынок и магазины" },
  { id: "savvinskaya", name: "Саввинская слобода", specialty: "ecology", baseMetrics: { ecology: 18, culture: 10 }, population: 2000, desc: "Тихий район у монастыря, природа и паломники" },
  { id: "dyutkovo", name: "Дютьково", specialty: "culture", baseMetrics: { culture: 20, ecology: 12 }, population: 800, desc: "Посёлок художников в овраге, мастерские и тишина" },
  { id: "vvedenskoe", name: "Введенское", specialty: "healthcare", baseMetrics: { healthcare: 14, ecology: 10 }, population: 2500, desc: "Санаторная зона, бывшие усадьбы" },
  { id: "suponevo", name: "Супонево", specialty: "infrastructure", baseMetrics: { infrastructure: 14, safety: 8 }, population: 3500, desc: "Новостройки и многоэтажки, молодые семьи" },
  { id: "station", name: "Район ж/д станции", specialty: "infrastructure", baseMetrics: { infrastructure: 16, economy: 8 }, population: 3000, desc: "Транспортный узел, привокзальная площадь" },
  { id: "moskovskaya", name: "Улица Московская", specialty: "economy", baseMetrics: { economy: 14, digital: 6 }, population: 2800, desc: "Главная улица города, офисы и кафе" },
  { id: "pochtovaya", name: "Почтовая улица", specialty: "education", baseMetrics: { education: 12, culture: 8 }, population: 2200, desc: "Школы, библиотека, старинные дома" },
  { id: "vostochny", name: "Микрорайон Восточный", specialty: "digital", baseMetrics: { digital: 10, education: 8 }, population: 4000, desc: "Спальный район, новая застройка, молодёжь" },
  { id: "naberezhnaya", name: "Набережная", specialty: "ecology", baseMetrics: { ecology: 16, culture: 12 }, population: 1500, desc: "Променад вдоль Москвы-реки, парки и лодки" },
];
