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
];

// Districts of Zvenigorod
export const DISTRICTS = ["Верхний Посад", "Нижний Посад", "Саввинская слобода", "Дютьково",
  "Введенское", "Супонево", "район ж/д станции", "улица Московская", "Почтовая улица",
  "микрорайон Восточный", "набережная"];
