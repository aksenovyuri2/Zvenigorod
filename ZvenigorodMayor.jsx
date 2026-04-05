import React, { useReducer, useEffect, useState, useRef, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  Building2, TreePine, Palette, Wifi, Shield, Heart, GraduationCap,
  TrendingUp, Users, Coins, AlertTriangle, Play, ArrowRight,
  RotateCcw, ChevronDown, ChevronUp, MapPin, Crown, Vote,
  Trophy, Snowflake, Sun, Leaf, CloudRain, MessageCircle, X,
  Award, Zap, Globe, ThumbsUp, Info, Newspaper,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1: CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const METRIC_KEYS = ["infrastructure","ecology","culture","digital","safety","healthcare","education","economy"];

const METRICS_CFG = {
  infrastructure: { name: "Инфраструктура", color: "#f59e0b", Icon: Building2, desc: "Дороги, водопровод, ЖКХ, транспорт" },
  ecology:        { name: "Экология",       color: "#22c55e", Icon: TreePine, desc: "Чистота воздуха, зелень, переработка" },
  culture:        { name: "Культура",       color: "#a855f7", Icon: Palette, desc: "Достопримечательности, мероприятия, досуг" },
  digital:        { name: "Цифровизация",   color: "#3b82f6", Icon: Wifi, desc: "Интернет, цифровые сервисы, умный город" },
  safety:         { name: "Безопасность",   color: "#ef4444", Icon: Shield, desc: "Полиция, пожарные, МЧС, освещение" },
  healthcare:     { name: "Здравоохранение", color: "#ec4899", Icon: Heart, desc: "Медицина, поликлиники, скорая" },
  education:      { name: "Образование",    color: "#06b6d4", Icon: GraduationCap, desc: "Школы, детсады, библиотеки" },
  economy:        { name: "Экономика",      color: "#f97316", Icon: TrendingUp, desc: "Бизнес-среда, рабочие места" },
};

const GROUPS = {
  elderly:     { name: "Пожилые",       weights: { healthcare:.30, safety:.25, ecology:.20, culture:.15, infrastructure:.10 } },
  freelancers: { name: "Фрилансеры",    weights: { digital:.30, culture:.20, ecology:.20, economy:.15, infrastructure:.15 } },
  families:    { name: "Семьи с детьми", weights: { education:.30, safety:.25, healthcare:.20, infrastructure:.15, ecology:.10 } },
  youth:       { name: "Молодёжь",       weights: { culture:.25, digital:.25, economy:.20, education:.20, ecology:.10 } },
  business:    { name: "Бизнес",         weights: { economy:.30, infrastructure:.25, digital:.20, safety:.15, education:.10 } },
};
const GROUP_KEYS = Object.keys(GROUPS);

const INIT_METRICS = { infrastructure:35, ecology:65, culture:45, digital:20, safety:40, healthcare:35, education:40, economy:30 };
const INIT_BUDGET = 850;
const INIT_POP = 25000;
const MAX_TURNS = 40;
const ELECTION_TURN = 20;
const MAX_PICKS = 2;
const INIT_APPROVAL = 60;

const SEASON_NAMES = ["Зима","Весна","Лето","Осень"];
const SEASON_ICONS = [Snowflake, Leaf, Sun, CloudRain];
const SEASON_EFFECTS = [
  { infrastructure:-1, healthcare:-1 },
  { ecology:1, infrastructure:-1 },
  { culture:1, economy:1, ecology:-1 },
  { education:1, economy:-1 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2: WORLD CITIES (100)
// ═══════════════════════════════════════════════════════════════════════════════

const WORLD_CITIES = [
  { name:"Вена, Австрия", flag:"🇦🇹", score:98, icon:"🎵", tagline:"Столица музыки и кофе" },
  { name:"Цюрих, Швейцария", flag:"🇨🇭", score:97, icon:"⛰️", tagline:"Альпы, банки, шоколад" },
  { name:"Копенгаген, Дания", flag:"🇩🇰", score:96, icon:"🚲", tagline:"Город велосипедов и хюгге" },
  { name:"Мельбурн, Австралия", flag:"🇦🇺", score:95, icon:"☕", tagline:"Кофейная столица мира" },
  { name:"Ванкувер, Канада", flag:"🇨🇦", score:95, icon:"🌲", tagline:"Горы встречают океан" },
  { name:"Хельсинки, Финляндия", flag:"🇫🇮", score:94, icon:"🧖", tagline:"Сауны и дизайн" },
  { name:"Осло, Норвегия", flag:"🇳🇴", score:93, icon:"🛥️", tagline:"Фьорды и благополучие" },
  { name:"Токио, Япония", flag:"🇯🇵", score:93, icon:"🗼", tagline:"Порядок, технологии, рамен" },
  { name:"Амстердам, Нидерланды", flag:"🇳🇱", score:92, icon:"🌷", tagline:"Каналы и свобода" },
  { name:"Мюнхен, Германия", flag:"🇩🇪", score:92, icon:"🍺", tagline:"Баварская столица" },
  { name:"Сингапур", flag:"🇸🇬", score:91, icon:"🏙️", tagline:"Город-сад будущего" },
  { name:"Барселона, Испания", flag:"🇪🇸", score:90, icon:"🎨", tagline:"Гауди, пляжи, тапас" },
  { name:"Окленд, Новая Зеландия", flag:"🇳🇿", score:90, icon:"⛵", tagline:"Город парусов" },
  { name:"Стокгольм, Швеция", flag:"🇸🇪", score:89, icon:"🏔️", tagline:"14 островов и инновации" },
  { name:"Берлин, Германия", flag:"🇩🇪", score:88, icon:"🎶", tagline:"Культура и стартапы" },
  { name:"Монреаль, Канада", flag:"🇨🇦", score:87, icon:"🎭", tagline:"Французский шарм" },
  { name:"Лиссабон, Португалия", flag:"🇵🇹", score:86, icon:"🌊", tagline:"Мягкий климат и азулежу" },
  { name:"Сеул, Южная Корея", flag:"🇰🇷", score:86, icon:"📱", tagline:"K-pop и технологии" },
  { name:"Прага, Чехия", flag:"🇨🇿", score:85, icon:"🏰", tagline:"Средневековье и пиво" },
  { name:"Тайбэй, Тайвань", flag:"🇹🇼", score:84, icon:"🏮", tagline:"Ночные рынки и хайтек" },
  { name:"Таллин, Эстония", flag:"🇪🇪", score:83, icon:"💻", tagline:"Цифровое государство" },
  { name:"Дубай, ОАЭ", flag:"🇦🇪", score:82, icon:"🏗️", tagline:"Небоскрёбы в пустыне" },
  { name:"Куала-Лумпур, Малайзия", flag:"🇲🇾", score:82, icon:"🏗️", tagline:"Башни-близнецы" },
  { name:"Монтевидео, Уругвай", flag:"🇺🇾", score:81, icon:"🧉", tagline:"Мате и спокойствие" },
  { name:"Варшава, Польша", flag:"🇵🇱", score:80, icon:"🏛️", tagline:"Возрождённый из пепла" },
  { name:"Будапешт, Венгрия", flag:"🇭🇺", score:79, icon:"♨️", tagline:"Термальные купальни" },
  { name:"Буэнос-Айрес, Аргентина", flag:"🇦🇷", score:78, icon:"💃", tagline:"Танго и стейки" },
  { name:"Маскат, Оман", flag:"🇴🇲", score:78, icon:"🕌", tagline:"Тихая роскошь Аравии" },
  { name:"Загреб, Хорватия", flag:"🇭🇷", score:77, icon:"🏘️", tagline:"Барочный уют Балкан" },
  { name:"Братислава, Словакия", flag:"🇸🇰", score:76, icon:"🏰", tagline:"Маленькая столица" },
  { name:"Мехико, Мексика", flag:"🇲🇽", score:75, icon:"🌮", tagline:"Хаос и культура" },
  { name:"Тбилиси, Грузия", flag:"🇬🇪", score:74, icon:"🍷", tagline:"Вино и гостеприимство" },
  { name:"Москва, Россия", flag:"🇷🇺", score:74, icon:"🏛️", tagline:"Столица, которая никогда не спит" },
  { name:"Бухарест, Румыния", flag:"🇷🇴", score:73, icon:"🏛️", tagline:"Маленький Париж Востока" },
  { name:"Белград, Сербия", flag:"🇷🇸", score:72, icon:"🎺", tagline:"Ночная жизнь у двух рек" },
  { name:"Санкт-Петербург, Россия", flag:"🇷🇺", score:71, icon:"🏛️", tagline:"Культурная столица" },
  { name:"Ереван, Армения", flag:"🇦🇲", score:70, icon:"🏔️", tagline:"Розовый город у Арарата" },
  { name:"Медельин, Колумбия", flag:"🇨🇴", score:69, icon:"🌺", tagline:"Город вечной весны" },
  { name:"Казань, Россия", flag:"🇷🇺", score:68, icon:"🕌", tagline:"Третья столица России" },
  { name:"Бангкок, Таиланд", flag:"🇹🇭", score:67, icon:"🛕", tagline:"Уличная еда и хаос" },
  { name:"Лима, Перу", flag:"🇵🇪", score:66, icon:"🏛️", tagline:"Гастрономическая столица" },
  { name:"Екатеринбург, Россия", flag:"🇷🇺", score:65, icon:"🏭", tagline:"Столица Урала" },
  { name:"Нижний Новгород, Россия", flag:"🇷🇺", score:64, icon:"⛪", tagline:"Слияние Оки и Волги" },
  { name:"Стамбул, Турция", flag:"🇹🇷", score:63, icon:"🕌", tagline:"Мост между мирами" },
  { name:"Кейптаун, ЮАР", flag:"🇿🇦", score:62, icon:"🏔️", tagline:"Столовая гора и океан" },
  { name:"Краснодар, Россия", flag:"🇷🇺", score:61, icon:"🌻", tagline:"Южная столица" },
  { name:"Тюмень, Россия", flag:"🇷🇺", score:60, icon:"🛢️", tagline:"Нефтяная столица Сибири" },
  { name:"Калуга, Россия", flag:"🇷🇺", score:58, icon:"🚀", tagline:"Колыбель космонавтики" },
  { name:"Новосибирск, Россия", flag:"🇷🇺", score:57, icon:"🔬", tagline:"Академгородок" },
  { name:"Ханой, Вьетнам", flag:"🇻🇳", score:56, icon:"🏍️", tagline:"Миллион мотобайков" },
  { name:"Каир, Египет", flag:"🇪🇬", score:55, icon:"🔺", tagline:"У подножья пирамид" },
  { name:"Самара, Россия", flag:"🇷🇺", score:54, icon:"🚀", tagline:"Космический город" },
  { name:"Воронеж, Россия", flag:"🇷🇺", score:52, icon:"⚓", tagline:"Колыбель русского флота" },
  { name:"Якарта, Индонезия", flag:"🇮🇩", score:50, icon:"🏙️", tagline:"Тонущий мегаполис" },
  { name:"Манила, Филиппины", flag:"🇵🇭", score:48, icon:"🏝️", tagline:"Хаотичный рай" },
  { name:"Саратов, Россия", flag:"🇷🇺", score:46, icon:"🌾", tagline:"Волжская провинция" },
  { name:"Найроби, Кения", flag:"🇰🇪", score:44, icon:"🦁", tagline:"Сафари и контрасты" },
  { name:"Аддис-Абеба, Эфиопия", flag:"🇪🇹", score:42, icon:"☕", tagline:"Родина кофе" },
  { name:"Карачи, Пакистан", flag:"🇵🇰", score:40, icon:"🏭", tagline:"Порт и промышленность" },
  { name:"Лагос, Нигерия", flag:"🇳🇬", score:38, icon:"🎵", tagline:"Афробит и 20 миллионов" },
  { name:"Алматы, Казахстан", flag:"🇰🇿", score:37, icon:"🍎", tagline:"Город яблок" },
  { name:"Омск, Россия", flag:"🇷🇺", score:36, icon:"🏭", tagline:"Не пытайся уехать" },
  { name:"Дакка, Бангладеш", flag:"🇧🇩", score:32, icon:"🧵", tagline:"Мировая швейная фабрика" },
  { name:"Рейкьявик, Исландия", flag:"🇮🇸", score:94, icon:"🌋", tagline:"Гейзеры и северное сияние" },
  { name:"Дублин, Ирландия", flag:"🇮🇪", score:87, icon:"🍀", tagline:"Пабы, литература, IT" },
  { name:"Брюссель, Бельгия", flag:"🇧🇪", score:85, icon:"🧇", tagline:"Вафли и евробюрократия" },
  { name:"Люксембург", flag:"🇱🇺", score:91, icon:"🏦", tagline:"Маленький, но богатый" },
  { name:"Рига, Латвия", flag:"🇱🇻", score:76, icon:"🏰", tagline:"Югендстиль и шпроты" },
  { name:"Вильнюс, Литва", flag:"🇱🇹", score:75, icon:"🏛️", tagline:"Барочная жемчужина Балтии" },
  { name:"Любляна, Словения", flag:"🇸🇮", score:80, icon:"🐉", tagline:"Зелёная столица Европы" },
  { name:"Афины, Греция", flag:"🇬🇷", score:72, icon:"🏛️", tagline:"Колыбель демократии" },
  { name:"Рим, Италия", flag:"🇮🇹", score:83, icon:"🏟️", tagline:"Вечный город" },
  { name:"Мадрид, Испания", flag:"🇪🇸", score:84, icon:"☀️", tagline:"Жизнь на площади" },
  { name:"Сантьяго, Чили", flag:"🇨🇱", score:73, icon:"🏔️", tagline:"Анды за окном" },
  { name:"Богота, Колумбия", flag:"🇨🇴", score:64, icon:"🌿", tagline:"2600 метров над морем" },
  { name:"Пуна, Индия", flag:"🇮🇳", score:53, icon:"💻", tagline:"IT-столица Индии" },
  { name:"Хошимин, Вьетнам", flag:"🇻🇳", score:58, icon:"🛵", tagline:"Энергия Юго-Востока" },
  { name:"Доха, Катар", flag:"🇶🇦", score:79, icon:"🏟️", tagline:"Пустыня и амбиции" },
  { name:"Эр-Рияд, Саудовская Аравия", flag:"🇸🇦", score:71, icon:"🏙️", tagline:"NEOM и будущее" },
  { name:"Абу-Даби, ОАЭ", flag:"🇦🇪", score:84, icon:"🕌", tagline:"Культура и нефть" },
  { name:"Росток, Германия", flag:"🇩🇪", score:78, icon:"⚓", tagline:"Балтийские ворота" },
  { name:"Порту, Португалия", flag:"🇵🇹", score:81, icon:"🍷", tagline:"Портвейн и азулежу" },
  { name:"Сараево, Босния", flag:"🇧🇦", score:62, icon:"🌉", tagline:"Восток встречает Запад" },
  { name:"Тирана, Албания", flag:"🇦🇱", score:59, icon:"🏛️", tagline:"Цветные фасады Балкан" },
  { name:"Аккра, Гана", flag:"🇬🇭", score:46, icon:"🏖️", tagline:"Ворота Западной Африки" },
  { name:"Дар-эс-Салам, Танзания", flag:"🇹🇿", score:41, icon:"🌅", tagline:"Гавань мира" },
  { name:"Касабланка, Марокко", flag:"🇲🇦", score:57, icon:"🕌", tagline:"Белый город на Атлантике" },
  { name:"Тунис, Тунис", flag:"🇹🇳", score:55, icon:"🏛️", tagline:"Карфаген и жасмин" },
  { name:"Пномпень, Камбоджа", flag:"🇰🇭", score:43, icon:"🏛️", tagline:"Кхмерское возрождение" },
  { name:"Уфа, Россия", flag:"🇷🇺", score:51, icon:"🏔️", tagline:"Три реки, три культуры" },
  { name:"Пермь, Россия", flag:"🇷🇺", score:49, icon:"🎭", tagline:"Край настоящих людей" },
  { name:"Ростов-на-Дону, Россия", flag:"🇷🇺", score:56, icon:"🌻", tagline:"Ворота Кавказа" },
  { name:"Владивосток, Россия", flag:"🇷🇺", score:54, icon:"🌊", tagline:"Там, где начинается Россия" },
  { name:"Кигали, Руанда", flag:"🇷🇼", score:47, icon:"🏔️", tagline:"Чистейший город Африки" },
  { name:"Ташкент, Узбекистан", flag:"🇺🇿", score:52, icon:"🕌", tagline:"Восточный базар и плов" },
  { name:"Баку, Азербайджан", flag:"🇦🇿", score:63, icon:"🔥", tagline:"Город ветров и огня" },
  { name:"Астана, Казахстан", flag:"🇰🇿", score:66, icon:"🏙️", tagline:"Футуристическая столица степи" },
  { name:"Минск, Беларусь", flag:"🇧🇾", score:61, icon:"🏛️", tagline:"Город-герой" },
  { name:"Киев, Украина", flag:"🇺🇦", score:60, icon:"🌻", tagline:"Золотые купола и каштаны" },
  { name:"Кабул, Афганистан", flag:"🇦🇫", score:22, icon:"🏔️", tagline:"Город, который не сдаётся" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3: DECISIONS (40+)
// ═══════════════════════════════════════════════════════════════════════════════

const ALL_DECISIONS = [
  // Infrastructure
  { id:"road_repair", name:"Ремонт дорог", desc:"Капитальный ремонт дорожного покрытия.", cost:110, effects:{infrastructure:12,safety:3,economy:2}, cat:"infrastructure" },
  { id:"storm_drain", name:"Ливневая канализация", desc:"Система отвода дождевой воды.", cost:120, effects:{infrastructure:10,safety:5,ecology:3}, once:true, cat:"infrastructure" },
  { id:"shuttle", name:"Шаттл до ж/д станции", desc:"Регулярный автобус-шаттл к станции.", cost:45, effects:{infrastructure:7,economy:3}, cat:"infrastructure" },
  { id:"housing", name:"Программа доступного жилья", desc:"Жилой комплекс для молодых семей.", cost:160, effects:{economy:6,infrastructure:5}, populationEffect:300, cat:"infrastructure" },
  { id:"waterworks", name:"Реконструкция водопровода", desc:"Замена изношенных труб и насосов.", cost:130, effects:{infrastructure:11,healthcare:3}, once:true, cat:"infrastructure" },
  // Digital
  { id:"fiber", name:"Оптоволокно во все районы", desc:"Высокоскоростной интернет.", cost:120, effects:{digital:12,economy:3,infrastructure:2}, once:true, cat:"digital", unlocks:["smart_city"] },
  { id:"smart_city", name:"Платформа «Умный Звенигород»", desc:"Единая цифровая платформа городских сервисов.", cost:95, effects:{digital:10,infrastructure:3,safety:3}, once:true, requires:{digital:30}, cat:"digital", unlocks:["ai_city"] },
  { id:"wifi", name:"Wi-Fi в общественных местах", desc:"Бесплатный Wi-Fi в парках и на остановках.", cost:40, effects:{digital:5,culture:2}, cat:"digital" },
  { id:"digital_library", name:"Цифровая библиотека", desc:"Онлайн-каталог и электронные читальные залы.", cost:40, effects:{education:6,digital:4,culture:3}, cat:"digital" },
  { id:"ai_city", name:"AI-система управления", desc:"Искусственный интеллект оптимизирует городские процессы.", cost:120, effects:{digital:8,safety:5,economy:3}, once:true, requires:{digital:60}, cat:"digital" },
  // Ecology
  { id:"park_river", name:"Парк у Москвы-реки", desc:"Реконструкция набережной с велодорожками.", cost:90, effects:{ecology:8,culture:4,safety:2}, cat:"ecology" },
  { id:"recycling", name:"Раздельный сбор мусора", desc:"Контейнеры и программа переработки.", cost:55, effects:{ecology:9,culture:2}, cat:"ecology" },
  { id:"greening", name:"Озеленение улиц", desc:"Высадка деревьев на центральных улицах.", cost:35, effects:{ecology:6,culture:2}, cat:"ecology" },
  { id:"solar", name:"Солнечные панели", desc:"Панели на муниципальных зданиях.", cost:100, effects:{ecology:7,economy:4,digital:2}, cat:"ecology" },
  { id:"water_treatment", name:"Очистные сооружения", desc:"Современные очистные для сточных вод.", cost:140, effects:{ecology:12,healthcare:3}, once:true, cat:"ecology" },
  { id:"eco_route", name:"Эко-маршрут «Москва-река»", desc:"Пешеходно-велосипедный маршрут вдоль реки.", cost:70, effects:{ecology:6,culture:5}, once:true, requires:{ecology:50}, cat:"ecology" },
  // Culture
  { id:"festival", name:"«Звенигородские вечера»", desc:"Фестиваль музыки и искусства.", cost:30, effects:{culture:8,economy:3}, cat:"culture" },
  { id:"monastery", name:"Реставрация монастыря", desc:"Восстановление Саввино-Сторожевского монастыря.", cost:90, effects:{culture:12,economy:4}, once:true, cat:"culture", unlocks:["tourism_cluster"] },
  { id:"branding", name:"Бренд «Город у реки»", desc:"Туристический бренд и маркетинговая кампания.", cost:50, effects:{culture:5,economy:6}, once:true, cat:"culture" },
  { id:"farmer_market", name:"Фермерский рынок", desc:"Еженедельный рынок на центральной площади.", cost:25, effects:{economy:5,culture:4,ecology:2}, cat:"culture" },
  { id:"art_residence", name:"Арт-резиденция", desc:"Творческое пространство для художников.", cost:60, effects:{culture:7,education:2}, cat:"culture" },
  { id:"tourism_cluster", name:"Туристический кластер", desc:"Комплексное развитие туризма у монастыря.", cost:150, effects:{culture:10,economy:8}, once:true, requires:{culture:55}, cat:"culture" },
  // Healthcare
  { id:"clinic_upgrade", name:"Модернизация поликлиники", desc:"Новое оборудование и ремонт.", cost:150, effects:{healthcare:14,safety:2}, once:true, cat:"healthcare", unlocks:["telemedicine"] },
  { id:"senior_center", name:"Центр активного долголетия", desc:"Центр для пожилых жителей.", cost:80, effects:{healthcare:6,culture:5,safety:2}, cat:"healthcare" },
  { id:"ambulance", name:"Новые машины скорой", desc:"Обновление парка скорой помощи.", cost:70, effects:{healthcare:8,safety:3}, cat:"healthcare" },
  { id:"prevention", name:"Программа профилактики", desc:"Бесплатные медосмотры и вакцинация.", cost:45, effects:{healthcare:5,education:2}, cat:"healthcare" },
  { id:"telemedicine", name:"Телемедицина", desc:"Дистанционные консультации врачей.", cost:80, effects:{healthcare:8,digital:4}, once:true, requires:{healthcare:45}, cat:"healthcare" },
  // Education
  { id:"school_repair", name:"Ремонт школ", desc:"Капитальный ремонт и оборудование.", cost:100, effects:{education:10,safety:3}, cat:"education", unlocks:["stem_lab"] },
  { id:"kindergarten", name:"Новый детский сад", desc:"Детский сад на 120 мест.", cost:130, effects:{education:8,safety:2}, once:true, populationEffect:200, cat:"education" },
  { id:"it_classes", name:"IT-классы в школах", desc:"Робототехника и программирование.", cost:60, effects:{education:6,digital:4}, cat:"education" },
  { id:"scholarships", name:"Стипендии для студентов", desc:"Муниципальные стипендии.", cost:35, effects:{education:5,culture:2}, cat:"education" },
  { id:"stem_lab", name:"IT-академия для подростков", desc:"Продвинутый центр IT-образования.", cost:100, effects:{education:8,digital:5}, once:true, requires:{education:50}, cat:"education" },
  // Safety
  { id:"cameras", name:"Умные камеры", desc:"Видеонаблюдение с аналитикой.", cost:70, effects:{safety:10,digital:3}, cat:"safety" },
  { id:"fire_station", name:"Модернизация пожарной части", desc:"Новая техника и расширение депо.", cost:70, effects:{safety:9,infrastructure:2}, once:true, cat:"safety" },
  { id:"street_lights", name:"Уличное освещение", desc:"LED-фонари на тёмных улицах.", cost:50, effects:{safety:7,infrastructure:2}, cat:"safety" },
  { id:"patrol", name:"Народная дружина", desc:"Добровольные дружины.", cost:20, effects:{safety:4,culture:2}, cat:"safety" },
  // Economy
  { id:"it_tax_breaks", name:"Налоговые льготы для IT", desc:"Налоговые каникулы для IT-компаний.", cost:40, effects:{economy:8,digital:4}, recurring:-40, once:true, cat:"economy", unlocks:["technopark"] },
  { id:"small_biz_grants", name:"Гранты малому бизнесу", desc:"Программа грантов.", cost:60, effects:{economy:9,digital:2}, cat:"economy" },
  { id:"coworking", name:"Муниципальный коворкинг", desc:"Рабочее пространство для фрилансеров.", cost:60, effects:{digital:6,economy:5,culture:3}, cat:"economy" },
  { id:"logistics_hub", name:"Логистический хаб", desc:"Транспортно-логистический центр.", cost:110, effects:{economy:10,infrastructure:4}, once:true, cat:"economy" },
  { id:"technopark", name:"Технопарк «Звенигород-Тех»", desc:"Технологический парк для IT и стартапов.", cost:200, effects:{economy:12,digital:8}, once:true, requires:{economy:50,digital:45}, cat:"economy" },
  // Trade-offs
  { id:"factory", name:"Завод на окраине", desc:"Рабочие места ценой экологии.", cost:80, effects:{economy:12,ecology:-8}, populationEffect:500, recurring:80, once:true, cat:"tradeoff" },
  { id:"luxury_housing", name:"Элитный ЖК", desc:"Доход для бюджета, нагрузка на инфраструктуру.", cost:60, effects:{economy:8,ecology:-4,infrastructure:-3}, cat:"tradeoff" },
  { id:"parking_lots", name:"Вырубка леса под парковки", desc:"Больше парковок за счёт зелёных зон.", cost:40, effects:{infrastructure:8,ecology:-10}, cat:"tradeoff" },
  { id:"casino_zone", name:"Казино-зона", desc:"Огромный доход, но удар по культуре.", cost:100, effects:{economy:15,culture:-5,safety:-6}, recurring:100, once:true, cat:"tradeoff" },
  { id:"paid_parking", name:"Платные парковки в центре", desc:"Плата за парковку в историческом центре.", cost:20, effects:{economy:4,culture:-3}, recurring:30, once:true, cat:"tradeoff" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4: EVENTS (50+)
// ═══════════════════════════════════════════════════════════════════════════════

const ALL_EVENTS = [
  // Natural (6)
  { id:"flood", text:"🌊 Паводок затопил улицы нижнего Звенигорода.", effects:{infrastructure:-5,safety:-3}, budget:-40 },
  { id:"frost", text:"❄️ Аномальные морозы повредили водопровод.", effects:{infrastructure:-6,healthcare:-2}, budget:-60, season:0 },
  { id:"drought", text:"☀️ Аномальная жара — засуха в парках.", effects:{ecology:-5,healthcare:-2}, budget:-20, season:2 },
  { id:"storm", text:"🌪️ Ураган повалил деревья и повредил крыши.", effects:{ecology:-3,infrastructure:-4,safety:-3}, budget:-50 },
  { id:"storm2", text:"🌪️ Сильный шторм обрушился на Звенигород.", effects:{infrastructure:-4,safety:-2}, budget:-30 },
  { id:"bridge_collapse", text:"🚧 Обвал моста через Москву-реку! Экстренный ремонт.", effects:{infrastructure:-8,safety:-4,economy:-3}, budget:-80, requires:{infrastructure_lt:40} },
  // Economic (7)
  { id:"federal_grant", text:"🏛️ Федеральный грант на развитие малых городов!", effects:{}, budget:150 },
  { id:"investor_factory", text:"🏭 Инвестор предлагает построить завод.",
    choices:[
      { label:"Принять предложение", effects:{economy:10,ecology:-6}, budget:0, population:400, chainEvents:[{eventId:"factory_complaints",delay:3},{eventId:"factory_river",delay:7}], recurring:60 },
      { label:"Отказать инвестору", effects:{}, budget:0 },
    ] },
  { id:"price_hike", text:"📈 Подрядчики подняли цены на работы.", effects:{}, budget:-50 },
  { id:"tech_company", text:"💻 Крупная IT-компания хочет открыть офис.", requires:{digital:50},
    choices:[
      { label:"Выделить площадку", effects:{economy:8,digital:5}, budget:-30, population:300 },
      { label:"Отказать", effects:{}, budget:0 },
    ] },
  { id:"material_inflation", text:"🧱 Рост мировых цен на стройматериалы. Строительные решения дорожают на 20% на 3 хода.", effects:{}, budget:0, setCostMultiplier:true },
  { id:"economic_crisis", text:"📉 Экономический кризис в стране. Бюджеты секвестированы.", effects:{economy:-6}, budget:-100, population:-500 },
  { id:"employer_leaves", text:"💼 Крупный работодатель уходит из города.", effects:{economy:-8}, budget:0, population:-600, requires:{economy_lt:35} },
  // Social (8)
  { id:"blogger", text:"📱 Известный блогер снял восторженное видео о Звенигороде!", effects:{culture:4,economy:5}, budget:0, population:600 },
  { id:"olympiad", text:"🏆 Ученик школы выиграл всероссийскую олимпиаду!", effects:{education:4,culture:2}, budget:0 },
  { id:"protest", text:"📢 Жители собрались на митинг против стройки в зелёной зоне.",
    choices:[
      { label:"Уступить жителям", effects:{culture:3,economy:-4}, budget:0, approval:5 },
      { label:"Продолжить стройку", effects:{culture:-4,economy:3,safety:-2}, budget:0, approval:-5 },
    ] },
  { id:"remote_workers", text:"🏠 Волна удалёнщиков из Москвы переезжает!", requires:{digital:40}, effects:{economy:3}, budget:0, population:400 },
  { id:"flu_epidemic", text:"🤒 Эпидемия гриппа. Поликлиники переполнены.", effects:{healthcare:-4}, budget:-25 },
  { id:"tiktok_band", text:"🎸 Местная группа стала вирусной в TikTok!", effects:{culture:6}, budget:0, population:300 },
  { id:"fox_school", text:"🦊 Лиса забежала в школу — забавная новость облетела соцсети.", effects:{culture:2}, budget:0 },
  { id:"dog_attack", text:"🐕 Бездомные собаки кусают жителей. Паника!", effects:{safety:-5,healthcare:-2}, budget:0, requires:{safety_lt:35} },
  // Political (5)
  { id:"merger", text:"🏛️ Губернатор предлагает объединить Звенигород с Введенским.",
    choices:[
      { label:"Согласиться", effects:{infrastructure:-5}, budget:100, population:3000 },
      { label:"Сохранить независимость", effects:{}, budget:0 },
    ] },
  { id:"audit", text:"🔍 Прокуратура нашла нарушения в закупках. Штраф!", effects:{safety:-2}, budget:-80, approval:-5 },
  { id:"council_election", text:"🗳️ Выборы в городскую думу.", effects:{}, budget:0, specialCheck:"council" },
  { id:"tv_report", text:"📺 Местное ТВ сняло репортаж о проблемах города.", effects:{}, budget:0, approval:-5 },
  { id:"federal_highway", text:"🌳 Федералы предлагают вырубить лес под трассу.",
    choices:[
      { label:"Согласиться — хорошая дорога", effects:{infrastructure:10,economy:5,ecology:-12}, budget:0 },
      { label:"Бороться за альтернативный маршрут", effects:{ecology:3,culture:4,infrastructure:2}, budget:-40 },
    ] },
  // Cultural (5)
  { id:"film_crew", text:"🎬 Съёмочная группа снимает фильм в Звенигороде!", effects:{culture:5,economy:3}, budget:20 },
  { id:"rare_birds", text:"🦅 Экологи нашли гнездовья редких птиц — статус экозоны!", effects:{ecology:6}, budget:0 },
  { id:"architect", text:"🏗️ Известный архитектор спроектировал парк бесплатно.", effects:{culture:5,ecology:3}, budget:0 },
  { id:"mgu_branch", text:"🎓 МГУ хочет открыть филиал в Звенигороде!", requires:{education:55}, effects:{education:6,economy:4}, budget:0, population:400 },
  { id:"best_city_award", text:"🏆 Звенигород получил премию «Лучший малый город»!", effects:{culture:5,economy:3}, budget:0, population:500, requires:{rank_lt:40} },
  // New choice events
  { id:"demolish_quarter", text:"🏗️ Застройщик хочет снести исторический квартал.",
    choices:[
      { label:"Разрешить снос и строительство ЖК", effects:{infrastructure:8,economy:6,culture:-10,ecology:-3}, budget:0 },
      { label:"Запретить и дать статус памятника", effects:{culture:8,safety:2,economy:-2}, budget:0 },
    ] },
  { id:"college_transfer", text:"🎓 Москва предлагает перевести колледж в Звенигород.",
    choices:[
      { label:"Принять — дать здание и льготы", effects:{education:8,economy:4}, budget:-80, population:600 },
      { label:"Отказать — нет ресурсов", effects:{}, budget:0 },
    ] },
  { id:"close_factory", text:"🏭 Экологи требуют закрыть старый завод.",
    choices:[
      { label:"Закрыть завод", effects:{ecology:10,economy:-8}, budget:-40, population:-400 },
      { label:"Модернизировать (дороже)", effects:{ecology:5,economy:2}, budget:-120 },
      { label:"Игнорировать", effects:{ecology:-3}, budget:0, approval:-5 },
    ] },
  { id:"moscow_migrants", text:"🏠 Волна переселенцев из Москвы хочет в Звенигород.",
    choices:[
      { label:"Программа релокации", effects:{infrastructure:-4}, budget:-60, population:1500 },
      { label:"Контролировать рост — квоты", effects:{culture:2}, budget:0, population:500 },
    ] },
  { id:"yandex_cars", text:"📱 Яндекс хочет тестировать беспилотные авто в городе.",
    choices:[
      { label:"Разрешить", effects:{digital:8,economy:5,safety:-3}, budget:0 },
      { label:"Отказать — город не готов", effects:{safety:2}, budget:0 },
    ] },
  { id:"theater", text:"🎭 Режиссёр хочет открыть независимый театр.",
    choices:[
      { label:"Дать грант и помещение", effects:{culture:7}, budget:-40 },
      { label:"Пусть ищет инвесторов", effects:{culture:2}, budget:0 },
    ] },
  { id:"night_construction", text:"🔥 Жители жалуются на шум от стройки ночью.",
    choices:[
      { label:"Запретить ночную стройку", effects:{safety:3,culture:2,infrastructure:-2}, budget:0, approval:3 },
      { label:"Оставить как есть", effects:{infrastructure:2}, budget:0, approval:-3 },
    ] },
  { id:"free_vaccine", text:"💊 Фармкомпания предлагает бесплатную вакцинацию.",
    choices:[
      { label:"Принять", effects:{healthcare:6,digital:-2}, budget:0 },
      { label:"Организовать свою программу", effects:{healthcare:4}, budget:-30 },
    ] },
  { id:"bank_loan", text:"🏦 Банк предлагает кредит на развитие под 8%.",
    choices:[
      { label:"Взять 500 млн", effects:{}, budget:500, addDebt:500 },
      { label:"Отказать", effects:{}, budget:0 },
    ] },
  { id:"christmas_fair", text:"🎄 Рождественская ярмарка прошла с аншлагом!", effects:{culture:4,economy:3}, budget:15, season:3 },
  { id:"train_lastochka", text:"🚂 РЖД запустила «Ласточку» до Звенигорода!", effects:{infrastructure:6,economy:5}, budget:0, population:700, minTurn:8 },
  { id:"graffiti", text:"🎨 Граффитисты разрисовали новые фасады.", effects:{}, budget:0, randomCulture:true },
  { id:"measles", text:"🏥 Эпидемия кори! Не хватает вакцин.", effects:{healthcare:-8,safety:-3}, budget:0, population:-200, requires:{healthcare_lt:40} },
  // Chain events
  { id:"factory_complaints", text:"😤 Жители жалуются на выбросы от завода.", effects:{ecology:-5,healthcare:-2}, budget:0, chain:true, approval:-5 },
  { id:"factory_river", text:"☠️ Завод загрязнил Москву-реку!", effects:{ecology:-10,healthcare:-5}, budget:-100, chain:true, approval:-10 },
  { id:"cowork_startup", text:"🚀 Стартап из коворкинга привлёк $2M инвестиций!", effects:{economy:5,digital:3}, budget:0, chain:true },
  { id:"festival_forbes", text:"✨ Фестиваль попал в Forbes Travel!", effects:{culture:4}, budget:0, population:300, chain:true },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5: ADVISORS, OPPONENTS, ACHIEVEMENTS
// ═══════════════════════════════════════════════════════════════════════════════

const ADVISORS = [
  { name:"Марина Сергеевна", role:"Зам по социалке", avatar:"👩‍💼", bias:["healthcare","education","safety"],
    phrases:{ healthcare:"Людям нужна больница, не коворкинг.", education:"Инвестиции в школы — инвестиции в будущее.", safety:"Безопасность — базовая потребность.", default:"Думайте о людях, мэр." } },
  { name:"Артём", role:"Зам по развитию", avatar:"👨‍💻", bias:["digital","economy","culture"],
    phrases:{ digital:"Оптоволокно — фундамент всего!", economy:"Нужны рабочие места и стартапы.", culture:"Креативный класс привлекает инвестиции.", default:"Звенигород может стать мини-Сингапуром!" } },
  { name:"Виктор Петрович", role:"Бывший мэр", avatar:"🧓", bias:["infrastructure","ecology","safety"],
    phrases:{ infrastructure:"Сначала — дороги. Я видел трёх мэров до вас.", ecology:"Не губите природу ради сиюминутной выгоды.", safety:"Я помню, как три мэра обанкротили город.", default:"Молодой человек, не торопитесь." } },
];

const OPPONENTS = [
  { name:"Дмитрий Козлов", slogan:"Снизим налоги, построим ТЦ!", strength:45, avatar:"👨‍💼" },
  { name:"Елена Волкова", slogan:"Экология — приоритет №1!", strength:50, avatar:"👩‍🔬" },
  { name:"Сергей Николаев", slogan:"Вернём порядок и безопасность!", strength:55, avatar:"👮" },
  { name:"Анна Белова", slogan:"Звенигород для молодых!", strength:40, avatar:"👩‍💻" },
  { name:"Геннадий Крылов", slogan:"Опыт важнее экспериментов!", strength:60, avatar:"🧓" },
];

const ACHIEVEMENTS = [
  { id:"green_city", name:"Зелёный город", cond:(s)=>s.metrics.ecology>=90, icon:"🌿" },
  { id:"silicon_valley", name:"Кремниевая долина", cond:(s)=>s.metrics.digital>=90, icon:"💻" },
  { id:"safe_haven", name:"Безопасная гавань", cond:(s)=>s.metrics.safety>=90, icon:"🛡️" },
  { id:"boom_town", name:"Бум-таун", cond:(s)=>s.population>60000, icon:"📈" },
  { id:"debt_free", name:"Без долгов", cond:(s)=>s.neverHadDebt, icon:"💰" },
  { id:"balanced", name:"Баланс", cond:(s)=>METRIC_KEYS.every(k=>s.metrics[k]>=60), icon:"⚖️" },
  { id:"beloved", name:"Народный мэр", cond:(s)=>s.approval>=90, icon:"❤️" },
  { id:"underdog", name:"Из грязи в князи", cond:(s)=>s.worstRank>80&&s.globalRankIdx<20, icon:"🏆" },
  { id:"speed_run", name:"Спидран", cond:(s)=>s.turn<=10&&s.globalRankIdx<30, icon:"⚡" },
  { id:"survivor", name:"Выживший", cond:(s)=>s.negativeStreakMax>=3, icon:"🔥" },
  { id:"overtake_spb", name:"Лучше Петербурга", cond:(s)=>s.zvenigorodScore>71, icon:"🇷🇺" },
  { id:"world_best", name:"Лучший на планете", cond:(s)=>s.globalRankIdx===0, icon:"🌍" },
];

const ELECTION_PROMISES = [
  { id:"edu_promise", label:"Удвоить бюджет на образование", bonus:{education:5}, check:{metric:"education",min:70,byTurn:30}, penalty:-10 },
  { id:"infra_promise", label:"Победить пробки", bonus:{infrastructure:5}, check:{metric:"infrastructure",min:70,byTurn:30}, penalty:-10 },
  { id:"eco_promise", label:"Сделать город зелёным", bonus:{ecology:5}, check:{metric:"ecology",min:70,byTurn:30}, penalty:-10 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 6: PRNG & ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

function createRNG(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  const next = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  const nextInt = (min, max) => min + Math.floor(next() * (max - min + 1));
  const pick = (arr) => arr[Math.floor(next() * arr.length)];
  const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  return { next, nextInt, pick, shuffle, getSeed: () => s };
}

function calcDecay(val) { return Math.max(1, Math.floor(val / 40)); }

function applyDecay(metrics) {
  const m = { ...metrics };
  for (const k of METRIC_KEYS) m[k] = Math.max(0, m[k] - calcDecay(m[k]));
  return m;
}

function applySeason(metrics, turn) {
  const season = turn % 4;
  const fx = SEASON_EFFECTS[season];
  const m = { ...metrics };
  for (const [k, v] of Object.entries(fx)) m[k] = (m[k] || 0) + v;
  return m;
}

function clampMetrics(metrics) {
  const m = { ...metrics };
  for (const k of METRIC_KEYS) m[k] = Math.max(0, Math.min(100, Math.round(m[k])));
  return m;
}

function calcSatisfaction(metrics, weights) {
  let s = 0;
  for (const [k, w] of Object.entries(weights)) s += (metrics[k] || 0) * w;
  return Math.round(s * 10) / 10;
}

function calcAllSatisfactions(metrics) {
  const r = {};
  for (const [gk, g] of Object.entries(GROUPS)) r[gk] = calcSatisfaction(metrics, g.weights);
  return r;
}

function calcAvgSatisfaction(sats) {
  const v = Object.values(sats);
  return v.reduce((a, b) => a + b, 0) / v.length;
}

function calcRevenue(pop, metrics) {
  return Math.round(400 + pop * 0.012 + metrics.economy * 2.0 + metrics.culture * 1.2);
}

function calcMandatory(pop) { return Math.round(200 + pop * 0.005); }

function calcMigration(avgSat, rng) {
  let m = 0;
  if (avgSat > 60) m = (avgSat - 60) * 15 + rng.nextInt(-50, 50);
  else if (avgSat < 40) m = (avgSat - 40) * 20 + rng.nextInt(-50, 50);
  else m = rng.nextInt(-100, 100);
  return Math.round(m);
}

function calcZvenigorodScore(metrics, pop, sats) {
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

function getZvenigorodRankIdx(score) {
  let idx = WORLD_CITIES.length;
  for (let i = 0; i < WORLD_CITIES.length; i++) {
    if (score >= WORLD_CITIES[i].score) { idx = i; break; }
  }
  return idx;
}

function findWeakestCategory(metrics) {
  let worst = null, worstVal = Infinity;
  for (const k of METRIC_KEYS) { if (metrics[k] < worstVal) { worstVal = metrics[k]; worst = k; } }
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
    if (d.unlocks) { /* unlock check is on the target, not source */ }
    return true;
  });
  const effectiveCost = (d) => Math.round(d.cost * (costMultiplier || 1));
  const cheapOnes = pool.filter((d) => effectiveCost(d) <= 40);
  const tradeoffs = pool.filter((d) => d.cat === "tradeoff");
  const weakCat = findWeakestCategory(metrics);
  const weakOnes = pool.filter((d) => d.cat === weakCat);
  const notLast = pool.filter((d) => !(lastTurnDecisionIds || []).includes(d.id));
  const preferred = notLast.length >= 6 ? notLast : pool;
  const selected = [];
  const usedIds = new Set();
  const addOne = (cands) => { const a = cands.filter((d) => !usedIds.has(d.id)); if (a.length) { const d = rng.pick(a); selected.push(d); usedIds.add(d.id); } };
  addOne(cheapOnes.length ? cheapOnes : pool);
  addOne(tradeoffs.length ? tradeoffs : pool);
  addOne(weakOnes.length ? weakOnes : pool);
  const rest = rng.shuffle(preferred.filter((d) => !usedIds.has(d.id)));
  for (const d of rest) { if (selected.length >= 6) break; selected.push(d); usedIds.add(d.id); }
  while (selected.length < 5 && pool.length > selected.length) {
    const rem = pool.filter((d) => !usedIds.has(d.id));
    if (!rem.length) break;
    const d = rng.pick(rem);
    selected.push(d);
    usedIds.add(d.id);
  }
  return selected.sort((a, b) => effectiveCost(a) - effectiveCost(b));
}

function checkEventRequires(evt, state) {
  if (!evt.requires) return true;
  const r = evt.requires;
  for (const [k, v] of Object.entries(r)) {
    if (k === "rank_lt") { if (state.globalRankIdx >= v) return false; }
    else if (k.endsWith("_lt")) { const mk = k.replace("_lt",""); if ((state.metrics[mk]||0) >= v) return false; }
    else { if ((state.metrics[k]||0) < v) return false; }
  }
  return true;
}

function selectEvent(state, rng) {
  const { eventQueue, turn, usedEventIds } = state;
  const queued = (eventQueue || []).filter((q) => q.targetTurn === turn + 1);
  if (queued.length > 0) return ALL_EVENTS.find((e) => e.id === queued[0].eventId) || null;
  if (rng.next() > 0.4) return null;
  const season = (turn + 1) % 4;
  const eligible = ALL_EVENTS.filter((e) => {
    if (e.chain) return false;
    if ((usedEventIds || []).includes(e.id)) return false;
    if (e.season !== undefined && e.season !== season) return false;
    if (e.minTurn && (turn + 1) < e.minTurn) return false;
    if (!checkEventRequires(e, state)) return false;
    return true;
  });
  if (!eligible.length) return null;
  return rng.pick(eligible);
}

function generateAdvisorComments(decisions, state, rng) {
  const comments = {};
  for (const advisor of ADVISORS) {
    const relevant = decisions.filter(d => advisor.bias.some(b => d.effects[b] && d.effects[b] > 0));
    const target = relevant.length > 0 ? rng.pick(relevant) : rng.pick(decisions);
    const matchedBias = advisor.bias.find(b => target.effects[b] && target.effects[b] > 0);
    const phrase = matchedBias && advisor.phrases[matchedBias] ? advisor.phrases[matchedBias] : advisor.phrases.default;
    comments[target.id] = comments[target.id] || [];
    comments[target.id].push({ advisor: advisor.name, avatar: advisor.avatar, text: phrase });
  }
  return comments;
}

function calcApprovalChange(state, newMetrics, prevMetrics) {
  const avgOld = METRIC_KEYS.reduce((s,k)=>s+prevMetrics[k],0)/METRIC_KEYS.length;
  const avgNew = METRIC_KEYS.reduce((s,k)=>s+newMetrics[k],0)/METRIC_KEYS.length;
  let change = (avgNew - avgOld) * 0.5;
  if (state.debt > 200) change -= 3;
  if (METRIC_KEYS.some(k => newMetrics[k] < 20)) change -= 2;
  return Math.round(change);
}

function checkAchievements(state) {
  const newAch = [];
  for (const a of ACHIEVEMENTS) {
    if (state.achievements.includes(a.id)) continue;
    if (a.cond(state)) newAch.push(a.id);
  }
  return newAch;
}

function generateNews(state, selectedIds, eventText) {
  const news = [];
  for (const id of selectedIds) {
    const d = ALL_DECISIONS.find(x => x.id === id);
    if (d) news.push(`Мэр одобрил: ${d.name}`);
  }
  if (eventText) news.push(eventText.replace(/^[^\s]+\s/, ""));
  if (state.population > 30000 && state.prevPopulation <= 30000) news.push("Население впервые превысило 30 000!");
  if (state.population > 50000 && state.prevPopulation <= 50000) news.push("Население превысило 50 000!");
  return news;
}

function processTurn(state, selectedIds, eventChoiceIndex) {
  const rng = createRNG(state.seed);
  let metrics = { ...state.metrics };
  const prevMetrics = { ...state.metrics };
  const prevPop = state.population;
  const prevBudget = state.budget;
  const prevSatisfactions = { ...state.satisfactions };

  let eventBudget = 0, eventPopulation = 0;
  let newEventQueue = [...(state.eventQueue || [])].filter(q => q.targetTurn !== state.turn + 1);
  let newRecurring = { ...state.recurringEffects };
  let newCostMultiplier = state.costMultiplier || 1;
  let newCostMultiplierTurns = state.costMultiplierTurns || 0;
  let newUsedEventIds = [...(state.usedEventIds || [])];
  let approvalDelta = 0;
  let newDebt = state.debt || 0;
  let eventNewsText = null;

  // 1. Apply event
  if (state.currentEvent) {
    const evt = state.currentEvent;
    newUsedEventIds.push(evt.id);
    eventNewsText = evt.text;
    if (evt.choices && eventChoiceIndex != null) {
      const choice = evt.choices[eventChoiceIndex];
      if (choice) {
        for (const [k, v] of Object.entries(choice.effects || {})) metrics[k] = (metrics[k]||0) + v;
        eventBudget += choice.budget || 0;
        eventPopulation += choice.population || 0;
        if (choice.approval) approvalDelta += choice.approval;
        if (choice.chainEvents) for (const ce of choice.chainEvents) newEventQueue.push({ eventId: ce.eventId, targetTurn: state.turn + 1 + ce.delay });
        if (choice.recurring) newRecurring = { ...newRecurring, budget: (newRecurring.budget||0) + choice.recurring };
        if (choice.addDebt) newDebt += choice.addDebt;
      }
    } else if (!evt.choices) {
      for (const [k, v] of Object.entries(evt.effects || {})) metrics[k] = (metrics[k]||0) + v;
      eventBudget += evt.budget || 0;
      eventPopulation += evt.population || 0;
      if (evt.approval) approvalDelta += evt.approval;
      if (evt.setCostMultiplier) { newCostMultiplier = 1.2; newCostMultiplierTurns = 3; }
      if (evt.randomCulture) metrics.culture += rng.nextInt(-2, 3);
      if (evt.specialCheck === "council") {
        const sats = calcAllSatisfactions(metrics);
        if (calcAvgSatisfaction(sats) < 50) { for (const k of METRIC_KEYS) metrics[k] -= 3; approvalDelta -= 5; }
        else { metrics.culture += 2; approvalDelta += 3; }
      }
    }
  }

  // 2. Decay + season
  metrics = applyDecay(metrics);
  metrics = applySeason(metrics, state.turn);

  // 3. Decisions
  let budget = state.budget + eventBudget;
  let population = state.population + eventPopulation;
  const newDecisionHistory = { ...state.decisionHistory };
  const newUsedOnce = [...state.usedOnceDecisions];

  for (const id of selectedIds) {
    const dec = ALL_DECISIONS.find(d => d.id === id);
    if (!dec) continue;
    const timesUsed = newDecisionHistory[id] || 0;
    const multiplier = Math.pow(0.7, timesUsed);
    for (const [k, v] of Object.entries(dec.effects)) metrics[k] = (metrics[k]||0) + v * multiplier;
    budget -= Math.round(dec.cost * (newCostMultiplier || 1));
    if (dec.recurring) newRecurring = { ...newRecurring, budget: (newRecurring.budget||0) + dec.recurring };
    if (dec.once) newUsedOnce.push(id);
    if (dec.populationEffect) population += dec.populationEffect;
    newDecisionHistory[id] = timesUsed + 1;
    // Chain triggers from decisions
    if (dec.id === "coworking") newEventQueue.push({ eventId:"cowork_startup", targetTurn: state.turn + 3 });
    if (dec.id === "festival") newEventQueue.push({ eventId:"festival_forbes", targetTurn: state.turn + 2 });
  }

  // 4. Recurring
  budget += newRecurring.budget || 0;

  // 5. Mandatory
  const mandatory = calcMandatory(population);
  budget -= mandatory;

  // 6. Revenue
  const revenue = calcRevenue(population, metrics);
  budget += revenue;

  // 7. Debt
  if (budget < 0) { newDebt += Math.abs(budget); budget = 0; }
  newDebt = Math.round(newDebt * 1.05);
  if (newDebt > 0 && budget > 0) { const pay = Math.min(budget, newDebt); budget -= pay; newDebt -= pay; }
  let defaulted = false;
  if (newDebt > 500) for (const k of METRIC_KEYS) metrics[k] -= 2;
  if (newDebt > 1000) defaulted = true;

  // 8. Clamp
  metrics = clampMetrics(metrics);

  // 9. Satisfaction, migration, rank
  const satisfactions = calcAllSatisfactions(metrics);
  const avgSat = calcAvgSatisfaction(satisfactions);
  const migration = calcMigration(avgSat, rng);
  population += migration + Math.round(population * 0.001);
  population = Math.max(1000, population);

  const zvScore = calcZvenigorodScore(metrics, population, satisfactions);
  const globalRankIdx = getZvenigorodRankIdx(zvScore);

  // 10. Approval
  approvalDelta += calcApprovalChange(state, metrics, prevMetrics);
  // Promise check
  if (state.electionPromise && state.turn === state.electionPromise.check.byTurn) {
    if (metrics[state.electionPromise.check.metric] < state.electionPromise.check.min) {
      approvalDelta += state.electionPromise.penalty;
    }
  }
  const newApproval = Math.max(0, Math.min(100, state.approval + approvalDelta));

  // 11. Cost multiplier decay
  if (newCostMultiplierTurns > 0) { newCostMultiplierTurns--; if (newCostMultiplierTurns <= 0) newCostMultiplier = 1; }

  // 12. Achievements
  const neverHadDebt = state.neverHadDebt && newDebt === 0;
  const negativeStreak = (state.currentEvent && !state.currentEvent.choices && Object.values(state.currentEvent.effects||{}).some(v=>v<0)) ? (state.negativeStreak||0)+1 : 0;
  const negativeStreakMax = Math.max(state.negativeStreakMax||0, negativeStreak);
  const worstRank = Math.max(state.worstRank||0, globalRankIdx);

  const achState = { metrics, population, approval: newApproval, neverHadDebt, globalRankIdx, turn: state.turn + 1, zvenigorodScore: zvScore, worstRank, negativeStreakMax, achievements: state.achievements, debt: newDebt };
  const newAchievements = checkAchievements(achState);

  // 13. Rank overtake detection
  const prevRankIdx = state.globalRankIdx;
  let overtakeMsg = null;
  if (globalRankIdx < prevRankIdx) {
    const overtaken = WORLD_CITIES.slice(globalRankIdx, prevRankIdx);
    if (overtaken.length > 0) {
      const city = overtaken[overtaken.length - 1];
      const isRussian = city.flag === "🇷🇺";
      overtakeMsg = isRussian
        ? `📰 «Звенигород обошёл ${city.name.split(",")[0]} в мировом рейтинге!» — заголовок на РБК`
        : `🎉 Звенигород обогнал ${city.name} и поднялся на #${globalRankIdx + 1}!`;
    }
  }

  // 14. News
  const news = generateNews({ ...state, prevPopulation: prevPop }, selectedIds, eventNewsText);
  if (overtakeMsg) news.unshift(overtakeMsg.replace(/^[^\s]+\s/, ""));

  // 15. Next event & decisions
  const nextTurn = state.turn + 1;
  let nextEvent = null;
  if (nextTurn < MAX_TURNS && !defaulted && nextTurn !== ELECTION_TURN) {
    nextEvent = selectEvent({ ...state, eventQueue: newEventQueue, turn: state.turn, metrics, usedEventIds: newUsedEventIds, globalRankIdx }, rng);
  }
  let nextDecisions = [];
  if (nextTurn < MAX_TURNS && !defaulted && nextTurn !== ELECTION_TURN) {
    nextDecisions = generateAvailableDecisions({ metrics, budget, usedOnceDecisions: newUsedOnce, lastTurnDecisionIds: selectedIds, decisionHistory: newDecisionHistory, costMultiplier: newCostMultiplier }, rng);
  }

  const snapshot = { turn: nextTurn, metrics: { ...metrics }, population, budget, globalRankIdx, satisfaction: { ...satisfactions }, approval: newApproval, zvScore };

  let phase;
  if (defaulted) phase = "end";
  else if (nextTurn >= MAX_TURNS) phase = "end";
  else phase = "results";

  return {
    phase, turn: nextTurn, budget: Math.round(budget), debt: Math.round(newDebt), population, metrics,
    prevMetrics, prevPopulation: prevPop, prevBudget, prevSatisfactions,
    selectedDecisions: [], availableDecisions: nextDecisions, usedOnceDecisions: newUsedOnce,
    decisionHistory: newDecisionHistory, recurringEffects: newRecurring,
    currentEvent: nextEvent, eventQueue: newEventQueue, history: [...state.history, snapshot],
    globalRankIdx, zvenigorodScore: zvScore,
    turnRevenue: revenue,
    turnExpenses: mandatory + selectedIds.reduce((s, id) => { const d = ALL_DECISIONS.find(x => x.id === id); return s + (d ? Math.round(d.cost * (newCostMultiplier || 1)) : 0); }, 0),
    seed: rng.getSeed(), costMultiplier: newCostMultiplier, costMultiplierTurns: newCostMultiplierTurns,
    satisfactions, defaulted, usedEventIds: newUsedEventIds, lastTurnDecisionIds: selectedIds,
    approval: newApproval, neverHadDebt, negativeStreak, negativeStreakMax, worstRank,
    achievements: [...state.achievements, ...newAchievements], newAchievements,
    overtakeMsg, news, electionPromise: state.electionPromise,
    advisorComments: nextDecisions.length ? generateAdvisorComments(nextDecisions, { ...state, metrics }, rng) : {},
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 7: REDUCER
// ═══════════════════════════════════════════════════════════════════════════════

function createInitialState(seed) {
  const rng = createRNG(seed);
  const metrics = { ...INIT_METRICS };
  const satisfactions = calcAllSatisfactions(metrics);
  const zvScore = calcZvenigorodScore(metrics, INIT_POP, satisfactions);
  const globalRankIdx = getZvenigorodRankIdx(zvScore);
  const decisions = generateAvailableDecisions({ metrics, budget: INIT_BUDGET, usedOnceDecisions: [], lastTurnDecisionIds: [], decisionHistory: {}, costMultiplier: 1 }, rng);
  const advisorComments = generateAdvisorComments(decisions, { metrics }, rng);
  return {
    phase: "start", turn: 0, budget: INIT_BUDGET, debt: 0, population: INIT_POP,
    metrics, prevMetrics: { ...metrics }, prevPopulation: INIT_POP, prevBudget: INIT_BUDGET, prevSatisfactions: { ...satisfactions },
    selectedDecisions: [], availableDecisions: decisions, usedOnceDecisions: [], decisionHistory: {},
    recurringEffects: { budget: 0 }, currentEvent: null, eventQueue: [],
    history: [{ turn: 0, metrics: { ...metrics }, population: INIT_POP, budget: INIT_BUDGET, globalRankIdx, satisfaction: { ...satisfactions }, approval: INIT_APPROVAL, zvScore }],
    globalRankIdx, zvenigorodScore: zvScore, turnRevenue: 0, turnExpenses: 0,
    seed: rng.getSeed(), costMultiplier: 1, costMultiplierTurns: 0,
    satisfactions, defaulted: false, usedEventIds: [], lastTurnDecisionIds: [],
    approval: INIT_APPROVAL, neverHadDebt: true, negativeStreak: 0, negativeStreakMax: 0, worstRank: globalRankIdx,
    achievements: [], newAchievements: [], overtakeMsg: null, news: [],
    electionPromise: null, electionResult: null, advisorComments,
    onboardingStep: 0,
  };
}

function gameReducer(state, action) {
  switch (action.type) {
    case "START_GAME": {
      const s = createInitialState(action.seed || Date.now());
      const rng = createRNG(s.seed);
      const evt = selectEvent(s, rng);
      return { ...s, phase: evt ? "event" : "decisions", currentEvent: evt, seed: rng.getSeed(), onboardingStep: 1 };
    }
    case "SELECT_DECISION": {
      const id = action.id;
      const sel = state.selectedDecisions.includes(id)
        ? state.selectedDecisions.filter(x => x !== id)
        : state.selectedDecisions.length < MAX_PICKS ? [...state.selectedDecisions, id] : state.selectedDecisions;
      return { ...state, selectedDecisions: sel };
    }
    case "SUBMIT_DECISIONS":
      return processTurn(state, state.selectedDecisions, null);
    case "CONTINUE_EVENT":
      return { ...state, phase: "decisions" };
    case "CHOOSE_EVENT":
      return { ...state, phase: "decisions", eventChoiceIndex: action.index };
    case "SUBMIT_WITH_EVENT":
      return processTurn(state, state.selectedDecisions, state.eventChoiceIndex ?? null);
    case "NEXT_TURN": {
      if (state.turn >= MAX_TURNS || state.defaulted) return { ...state, phase: "end" };
      if (state.turn === ELECTION_TURN) return { ...state, phase: "election_campaign" };
      if (state.currentEvent) return { ...state, phase: "event" };
      return { ...state, phase: "decisions" };
    }
    case "START_ELECTION": return { ...state, phase: "election_vote" };
    case "ELECTION_RESULT": {
      const rng = createRNG(state.seed);
      const opponent = rng.pick(OPPONENTS);
      const startScore = state.history[0]?.zvScore || 38;
      const attrGrowth = ((state.zvenigorodScore - startScore) / Math.max(1, startScore)) * 100;
      const popGrowth = ((state.population - INIT_POP) / INIT_POP) * 100;
      const noBankBonus = state.neverHadDebt ? 100 : (state.debt < 500 ? 50 : 0);
      const randomF = rng.nextInt(0, 100);
      const winProb = state.approval * 0.40 + attrGrowth * 0.25 + popGrowth * 0.15 + noBankBonus * 0.10 + randomF * 0.10;
      const won = winProb >= 50;
      const votePercent = Math.max(30, Math.min(70, 50 + (winProb - 50) * 0.4));
      return { ...state, phase: "election_result", electionResult: { won, votePercent: Math.round(votePercent * 10) / 10, opponent }, seed: rng.getSeed() };
    }
    case "CHOOSE_PROMISE": {
      const promise = ELECTION_PROMISES[action.index];
      const newMetrics = { ...state.metrics };
      for (const [k, v] of Object.entries(promise.bonus)) newMetrics[k] = Math.min(100, (newMetrics[k]||0) + v);
      return { ...state, electionPromise: promise, metrics: newMetrics };
    }
    case "START_SECOND_TERM": {
      const rng = createRNG(state.seed);
      const decisions = generateAvailableDecisions(state, rng);
      const evt = selectEvent(state, rng);
      const advisorComments = generateAdvisorComments(decisions, state, rng);
      return { ...state, phase: evt ? "event" : "decisions", currentEvent: evt, availableDecisions: decisions, seed: rng.getSeed(), advisorComments };
    }
    case "DISMISS_ONBOARDING":
      return { ...state, onboardingStep: 0 };
    case "NEXT_ONBOARDING":
      return { ...state, onboardingStep: state.onboardingStep >= 4 ? 0 : state.onboardingStep + 1 };
    case "RESTART":
      return { ...createInitialState(Date.now()), phase: "start" };
    default: return state;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 8: UI HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function DeltaValue({ value, suffix = "" }) {
  if (!value || value === 0) return null;
  const pos = value > 0;
  return <span className={pos ? "text-emerald-400 text-sm font-medium" : "text-red-400 text-sm font-medium"}>{pos ? "+" : ""}{Math.round(value)}{suffix}</span>;
}

function MetricBar({ metricKey, value, prevValue, compact = false }) {
  const cfg = METRICS_CFG[metricKey];
  if (!cfg) return null;
  const delta = Math.round(value - prevValue);
  const pct = Math.max(0, Math.min(100, value));
  const critical = value < 20;
  return (
    <div className={compact ? "mb-1.5" : "mb-3"}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <cfg.Icon size={compact ? 14 : 16} style={{ color: cfg.color }} />
          <span className={`${compact ? "text-xs" : "text-sm"} text-slate-300`}>{cfg.name}</span>
          {critical && <span className="text-red-500 animate-pulse text-xs">!</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className={`${compact ? "text-xs" : "text-sm"} font-bold text-white`}>{Math.round(value)}</span>
          {delta !== 0 && <DeltaValue value={delta} />}
        </div>
      </div>
      <div className={`w-full rounded-full overflow-hidden ${compact ? "h-1.5" : "h-2"}`} style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, backgroundColor: critical ? "#ef4444" : cfg.color }} />
      </div>
    </div>
  );
}

function Sparkline({ data, color, width = 80, height = 24 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(" ");
  return <svg width={width} height={height} className="inline-block"><polyline points={points} fill="none" stroke={color} strokeWidth="1.5" /></svg>;
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
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </div>
    </div>
  );
}

function EffectBadge({ metricKey, value }) {
  const cfg = METRICS_CFG[metricKey];
  if (!cfg) return null;
  const pos = value > 0;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: pos ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: pos ? "#86efac" : "#fca5a5" }}>
      <cfg.Icon size={12} />{pos ? "+" : ""}{value}
    </span>
  );
}

function DecisionCard({ decision, selected, affordable, onToggle, usageCount, costMultiplier = 1, advisorComment }) {
  const cost = Math.round(decision.cost * costMultiplier);
  const disabled = !affordable && !selected;
  const hasNeg = Object.values(decision.effects).some(v => v < 0);
  return (
    <button onClick={() => !disabled && onToggle(decision.id)} disabled={disabled}
      className={`w-full text-left rounded-xl p-4 border-2 transition-all duration-300
        ${selected ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10"
        : disabled ? "border-slate-700/50 bg-slate-800/30 opacity-50 cursor-not-allowed"
        : hasNeg ? "border-amber-700/40 bg-slate-800/60 hover:border-amber-500/60 cursor-pointer"
        : "border-slate-700/40 bg-slate-800/60 hover:border-slate-500/60 cursor-pointer"}`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-bold text-white leading-tight pr-2">{decision.name}</h3>
        <div className="flex items-center gap-1 shrink-0"><Coins size={14} className="text-yellow-500" /><span className="text-sm font-bold text-yellow-500">{cost}</span></div>
      </div>
      <p className="text-xs text-slate-400 mb-3 leading-relaxed">{decision.desc}</p>
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(decision.effects).map(([k, v]) => <EffectBadge key={k} metricKey={k} value={usageCount > 0 ? Math.round(v * Math.pow(0.7, usageCount)) : v} />)}
        {decision.recurring && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-500/15 text-purple-300">{decision.recurring > 0 ? "+" : ""}{decision.recurring}/ход</span>}
        {decision.populationEffect && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-cyan-500/15 text-cyan-300"><Users size={12} />+{decision.populationEffect}</span>}
        {decision.once && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-600/30 text-slate-400">Разовое</span>}
        {decision.requires && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-600/20 text-blue-300">Цепочка</span>}
      </div>
      {usageCount > 0 && <div className="mt-2 text-xs text-amber-400/70">Эффект снижен (x{usageCount})</div>}
      {advisorComment && advisorComment.map((c, i) => (
        <div key={i} className="mt-2 flex items-start gap-2 p-2 rounded-lg bg-slate-700/30 border border-slate-600/30">
          <span className="text-lg">{c.avatar}</span>
          <div><span className="text-xs text-slate-400">{c.advisor}:</span><p className="text-xs text-slate-300 italic">«{c.text}»</p></div>
        </div>
      ))}
    </button>
  );
}

function FadeIn({ children, className = "" }) {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), 50); return () => clearTimeout(t); }, []);
  return <div className={`transition-all duration-500 ${v ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${className}`}>{children}</div>;
}

function NewsBar({ news }) {
  if (!news || !news.length) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 border-t border-slate-700/50 px-4 py-2 z-50 overflow-hidden">
      <div className="flex items-center gap-2">
        <Newspaper size={14} className="text-yellow-500 shrink-0" />
        <div className="overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-marquee">
            <span className="text-xs text-slate-300">{news.map((n, i) => <span key={i}><span className="text-yellow-500 mx-2">|</span>{n}</span>)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AchievementToast({ achievements }) {
  if (!achievements || !achievements.length) return null;
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {achievements.map(id => {
        const a = ACHIEVEMENTS.find(x => x.id === id);
        if (!a) return null;
        return (
          <FadeIn key={id}>
            <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-yellow-900/80 to-amber-900/80 border border-yellow-600/50 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{a.icon}</span>
                <div><div className="text-xs text-yellow-400 font-bold">Достижение!</div><div className="text-sm text-white font-medium">{a.name}</div></div>
              </div>
            </div>
          </FadeIn>
        );
      })}
    </div>
  );
}

function OvertakeToast({ msg, onDismiss }) {
  if (!msg) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <FadeIn>
        <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-900/80 to-cyan-900/80 border border-emerald-600/50 shadow-lg flex items-center gap-3">
          <span className="text-sm text-white">{msg}</span>
          <button onClick={onDismiss} className="text-slate-400 hover:text-white"><X size={14} /></button>
        </div>
      </FadeIn>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 9: RANKING TABLE
// ═══════════════════════════════════════════════════════════════════════════════

function RankingTable({ zvScore, rankIdx, expanded, onToggle }) {
  const nearby = 3;
  const start = Math.max(0, rankIdx - nearby);
  const end = Math.min(WORLD_CITIES.length, rankIdx + nearby + 1);
  const visible = expanded ? WORLD_CITIES : WORLD_CITIES.slice(start, end);
  const zvEntry = { name: "Звенигород", flag: "🏛️", score: zvScore, icon: "🏛️", tagline: "Ваш город", isPlayer: true };

  const allEntries = expanded
    ? [...WORLD_CITIES.slice(0, rankIdx), zvEntry, ...WORLD_CITIES.slice(rankIdx)]
    : [...WORLD_CITIES.slice(start, rankIdx), zvEntry, ...WORLD_CITIES.slice(rankIdx, end)];

  return (
    <div className="rounded-xl bg-slate-800/50 border border-slate-700/40 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Globe size={14} className="text-blue-400" /> Мировой рейтинг — #{rankIdx + 1} из {WORLD_CITIES.length + 1}
        </h2>
        <button onClick={onToggle} className="text-xs text-blue-400 hover:text-blue-300">{expanded ? "Свернуть" : "Полный список"}</button>
      </div>
      <div className={expanded ? "max-h-80 overflow-y-auto space-y-1 pr-1" : "space-y-1"}>
        {allEntries.map((city, i) => {
          const pos = expanded ? i + 1 : start + i + 1;
          const isZv = city.isPlayer;
          return (
            <div key={city.name + i} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs ${isZv ? "bg-blue-500/15 border border-blue-500/30" : "hover:bg-slate-700/30"}`}>
              <span className="text-slate-500 w-6 text-right font-mono">#{pos}</span>
              <span>{city.flag || city.icon}</span>
              <span className={`flex-1 ${isZv ? "text-blue-300 font-bold" : "text-slate-300"}`}>{city.name}</span>
              <span className="text-slate-400 font-mono">{typeof city.score === "number" ? city.score.toFixed(1) : city.score}</span>
              <div className="w-16 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                <div className="h-full rounded-full" style={{ width: `${city.score}%`, backgroundColor: isZv ? "#3b82f6" : "#475569" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 10: PHASE SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

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
            <rect x="60" y="80" width="35" height="60" rx="2" fill="#334155" /><rect x="65" y="85" width="8" height="10" rx="1" fill="#fbbf24" opacity="0.6" /><rect x="80" y="85" width="8" height="10" rx="1" fill="#fbbf24" opacity="0.4" /><rect x="65" y="100" width="8" height="10" rx="1" fill="#fbbf24" opacity="0.5" /><rect x="80" y="100" width="8" height="10" rx="1" fill="#fbbf24" opacity="0.3" />
            <rect x="110" y="60" width="40" height="80" rx="2" fill="#475569" /><polygon points="130,40 108,60 152,60" fill="#64748b" /><circle cx="130" cy="52" r="4" fill="#fbbf24" opacity="0.7" /><rect x="120" y="110" width="18" height="30" rx="1" fill="#1e293b" />
            <rect x="170" y="55" width="60" height="85" rx="2" fill="#475569" /><polygon points="200,30 167,55 233,55" fill="#64748b" /><circle cx="200" cy="43" r="5" fill="#f59e0b" opacity="0.8" /><rect x="180" y="65" width="10" height="14" rx="1" fill="#fbbf24" opacity="0.6" /><rect x="195" y="65" width="10" height="14" rx="1" fill="#fbbf24" opacity="0.4" /><rect x="210" y="65" width="10" height="14" rx="1" fill="#fbbf24" opacity="0.5" /><rect x="188" y="105" width="24" height="35" rx="2" fill="#1e293b" />
            <rect x="250" y="75" width="45" height="65" rx="2" fill="#334155" /><rect x="255" y="80" width="10" height="12" rx="1" fill="#fbbf24" opacity="0.5" /><rect x="270" y="80" width="10" height="12" rx="1" fill="#fbbf24" opacity="0.4" /><rect x="262" y="115" width="16" height="25" rx="1" fill="#1e293b" />
            <rect x="310" y="90" width="35" height="50" rx="2" fill="#334155" /><rect x="315" y="95" width="8" height="10" rx="1" fill="#fbbf24" opacity="0.5" /><rect x="330" y="95" width="8" height="10" rx="1" fill="#fbbf24" opacity="0.3" /><rect x="318" y="115" width="14" height="25" rx="1" fill="#1e293b" />
          </svg>
        </div>
        <div className="flex items-center justify-center gap-2 mb-4">
          <MapPin className="text-blue-400" size={24} />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">Звенигород</h1>
        </div>
        <h2 className="text-xl md:text-2xl font-light text-slate-400 mb-8 tracking-wide">Симулятор Мэра</h2>
        <p className="text-base text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed">
          Вы — новый мэр Звенигорода. У вас два срока по 5 лет, чтобы превратить тихий подмосковный город в лучшее место для жизни на планете. Обгоняйте реальные города — от Омска до Вены.
        </p>
        <button onClick={onStart} className="group inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/20 hover:-translate-y-0.5">
          <Play size={22} className="group-hover:scale-110 transition-transform" />Начать игру
        </button>
        <div className="mt-12 flex items-center gap-6 text-xs text-slate-600 justify-center">
          <span>Население: 25 000</span><span>Бюджет: 850 млн</span><span>40 ходов, 2 срока</span>
        </div>
      </FadeIn>
    </div>
  );
}

function EventPhase({ event, onContinue, onChoice }) {
  if (!event) return null;
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <FadeIn className="max-w-xl w-full">
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-950/30 to-slate-900/80 p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6"><AlertTriangle className="text-amber-400" size={20} /><span className="text-sm font-bold text-amber-400 uppercase tracking-wider">Событие</span></div>
          <p className="text-xl text-white leading-relaxed mb-6">{event.text}</p>
          {!event.choices && (
            <>
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(event.effects || {}).map(([k, v]) => <EffectBadge key={k} metricKey={k} value={v} />)}
                {event.budget !== 0 && event.budget && <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${event.budget > 0 ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}><Coins size={12} />{event.budget > 0 ? "+" : ""}{event.budget} млн</span>}
                {event.population && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-cyan-500/15 text-cyan-300"><Users size={12} />{event.population > 0 ? "+" : ""}{event.population}</span>}
                {event.approval && <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${event.approval > 0 ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}><ThumbsUp size={12} />{event.approval > 0 ? "+" : ""}{event.approval}</span>}
              </div>
              <button onClick={onContinue} className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors">Продолжить</button>
            </>
          )}
          {event.choices && (
            <div className="space-y-3">
              {event.choices.map((choice, i) => (
                <button key={i} onClick={() => onChoice(i)} className="w-full text-left rounded-xl p-4 border border-slate-600/50 bg-slate-800/60 hover:border-blue-500/50 transition-all">
                  <div className="font-bold text-white mb-2">{choice.label}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(choice.effects || {}).map(([k, v]) => <EffectBadge key={k} metricKey={k} value={v} />)}
                    {choice.budget !== 0 && choice.budget && <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${choice.budget > 0 ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}><Coins size={12} />{choice.budget > 0 ? "+" : ""}{choice.budget}</span>}
                    {choice.population && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-cyan-500/15 text-cyan-300"><Users size={12} />{choice.population > 0 ? "+" : ""}{choice.population}</span>}
                    {choice.approval && <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${choice.approval > 0 ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}><ThumbsUp size={12} />{choice.approval > 0 ? "+" : ""}{choice.approval}</span>}
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

function DecisionPhase({ state, dispatch }) {
  const { turn, budget, debt, population, metrics, prevMetrics, selectedDecisions, availableDecisions, globalRankIdx, satisfactions, prevSatisfactions, recurringEffects, costMultiplier, costMultiplierTurns, approval, zvenigorodScore, advisorComments } = state;
  const totalCost = selectedDecisions.reduce((s, id) => { const d = ALL_DECISIONS.find(x => x.id === id); return s + (d ? Math.round(d.cost * (costMultiplier || 1)) : 0); }, 0);
  const revenue = calcRevenue(population, metrics);
  const mandatory = calcMandatory(population);
  const [showGroups, setShowGroups] = useState(true);
  const [showRankFull, setShowRankFull] = useState(false);
  const avgSat = calcAvgSatisfaction(satisfactions);
  const season = turn % 4;
  const SeasonIcon = SEASON_ICONS[season];
  const year = 2025 + Math.floor(turn / 4);
  const quarter = (turn % 4) + 1;
  const term = turn < ELECTION_TURN ? 1 : 2;
  const termTurn = turn < ELECTION_TURN ? turn + 1 : turn - ELECTION_TURN + 1;
  const metricHistory = (mk) => state.history.map(h => h.metrics[mk]);

  return (
    <div className="min-h-screen px-3 md:px-6 py-4 md:py-6 pb-16">
      <FadeIn>
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-lg md:text-xl font-black text-white">Q{quarter} {year}</h1>
              <span className="text-xs text-slate-500">Срок {term}, ход {termTurn}/{ELECTION_TURN}</span>
              <span className="flex items-center gap-1 text-xs text-slate-400"><SeasonIcon size={14} />{SEASON_NAMES[season]}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1" title="Одобрение мэра">
                <ThumbsUp size={14} className={approval >= 60 ? "text-emerald-400" : approval >= 40 ? "text-yellow-400" : "text-red-400"} />
                <span className="text-sm font-bold text-white">{Math.round(approval)}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Crown size={16} className="text-yellow-500" />
                <span className="text-sm font-bold text-white">#{globalRankIdx + 1}</span>
              </div>
            </div>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
            <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${(turn / MAX_TURNS) * 100}%` }} />
          </div>
        </div>

        {costMultiplierTurns > 0 && <div className="mb-4 px-4 py-2 rounded-lg bg-amber-900/30 border border-amber-700/40 text-amber-300 text-xs">Цены на строительство +20% (осталось: {costMultiplierTurns})</div>}
        {debt > 0 && <div className={`mb-4 px-4 py-2 rounded-lg border text-xs ${debt > 500 ? "bg-red-900/30 border-red-700/40 text-red-300" : "bg-yellow-900/30 border-yellow-700/40 text-yellow-300"}`}>Долг: {Math.round(debt)} млн {debt > 500 && "(Штраф: -2 ко всем метрикам!)"}</div>}
        {METRIC_KEYS.some(k => metrics[k] < 20) && <div className="mb-4 px-4 py-2 rounded-lg bg-red-900/30 border border-red-700/40 text-red-300 text-xs flex items-center gap-2"><AlertTriangle size={14} />Критическая ситуация: {METRIC_KEYS.filter(k=>metrics[k]<20).map(k=>METRICS_CFG[k].name).join(", ")} на критическом уровне!</div>}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Left */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            <div className="rounded-xl bg-slate-800/50 border border-slate-700/40 p-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Бюджет</h2>
              <div className="text-2xl font-black text-white mb-2">{Math.round(budget)} <span className="text-sm font-normal text-slate-400">млн</span></div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-slate-400">Доход/кв.:</div><div className="text-emerald-400 font-medium text-right">+{revenue}</div>
                <div className="text-slate-400">Обяз. расходы:</div><div className="text-red-400 font-medium text-right">-{mandatory}</div>
                {(recurringEffects.budget||0) !== 0 && <><div className="text-slate-400">Рекуррентные:</div><div className={`font-medium text-right ${recurringEffects.budget > 0 ? "text-emerald-400" : "text-red-400"}`}>{recurringEffects.budget > 0 ? "+" : ""}{recurringEffects.budget}</div></>}
                <div className="text-slate-400">Выбрано:</div><div className="text-yellow-400 font-medium text-right">-{totalCost}</div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-800/50 border border-slate-700/40 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><Users size={16} className="text-cyan-400" /><span className="text-xs font-bold text-slate-400 uppercase">Население</span></div>
                <span className="text-lg font-black text-white">{population.toLocaleString("ru-RU")}</span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-800/50 border border-slate-700/40 p-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Метрики города</h2>
              {METRIC_KEYS.map(k => (
                <div key={k} className="flex items-center gap-2">
                  <div className="flex-1"><MetricBar metricKey={k} value={metrics[k]} prevValue={prevMetrics[k]} compact /></div>
                  <Sparkline data={metricHistory(k)} color={METRICS_CFG[k].color} width={50} height={16} />
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-slate-800/50 border border-slate-700/40 p-4">
              <button onClick={() => setShowGroups(!showGroups)} className="flex items-center justify-between w-full mb-2">
                <h2 className="text-xs font-bold text-slate-400 uppercase">Удовлетворённость ({Math.round(avgSat)}%)</h2>
                {showGroups ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
              </button>
              {showGroups && GROUP_KEYS.map(k => <GroupSatisfaction key={k} groupKey={k} value={satisfactions[k]} prevValue={(prevSatisfactions||{})[k]||satisfactions[k]} />)}
            </div>

            <RankingTable zvScore={zvenigorodScore} rankIdx={globalRankIdx} expanded={showRankFull} onToggle={() => setShowRankFull(!showRankFull)} />
          </div>

          {/* Right */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-300">Решения <span className="text-slate-500">({selectedDecisions.length} из {MAX_PICKS})</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {availableDecisions.map(d => {
                const cost = Math.round(d.cost * (costMultiplier||1));
                const selected = selectedDecisions.includes(d.id);
                const otherCost = totalCost - (selected ? cost : 0);
                const affordable = (budget - otherCost - cost) >= -50;
                return <DecisionCard key={d.id} decision={d} selected={selected} affordable={affordable||selected} onToggle={id => dispatch({ type: "SELECT_DECISION", id })} usageCount={state.decisionHistory[d.id]||0} costMultiplier={costMultiplier||1} advisorComment={(advisorComments||{})[d.id]} />;
              })}
            </div>
            <button onClick={() => { if (state.eventChoiceIndex != null) dispatch({ type: "SUBMIT_WITH_EVENT" }); else dispatch({ type: "SUBMIT_DECISIONS" }); }}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-lg">
              {selectedDecisions.length === 0 ? "Пропустить ход" : "Завершить ход"}{selectedDecisions.length > 0 && <span className="text-blue-200 ml-2">(-{totalCost} млн)</span>}
            </button>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

function ResultsPhase({ state, dispatch }) {
  const { metrics, prevMetrics, population, prevPopulation, budget, prevBudget, globalRankIdx, satisfactions, prevSatisfactions, turnRevenue, turnExpenses, debt, turn, approval, zvenigorodScore } = state;
  const prevRankIdx = state.history.length >= 2 ? state.history[state.history.length - 2].globalRankIdx : globalRankIdx;
  const [dismissed, setDismissed] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      {!dismissed && <OvertakeToast msg={state.overtakeMsg} onDismiss={() => setDismissed(true)} />}
      <AchievementToast achievements={state.newAchievements} />
      <FadeIn className="max-w-2xl w-full">
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/40 p-6 md:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-black text-white mb-1">Итоги Q{(turn - 1) % 4 + 1} {2025 + Math.floor((turn - 1) / 4)}</h2>
            <p className="text-sm text-slate-400">Квартал {turn} из {MAX_TURNS}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center p-3 rounded-xl bg-slate-900/50">
              <div className="text-xs text-slate-400 mb-1">Рейтинг</div>
              <div className="text-2xl font-black text-white">#{globalRankIdx + 1}</div>
              <DeltaValue value={prevRankIdx - globalRankIdx} />
            </div>
            <div className="text-center p-3 rounded-xl bg-slate-900/50">
              <div className="text-xs text-slate-400 mb-1">Бюджет</div>
              <div className="text-lg font-bold text-white">{Math.round(budget)}</div>
              <DeltaValue value={Math.round(budget - prevBudget)} suffix=" млн" />
            </div>
            <div className="text-center p-3 rounded-xl bg-slate-900/50">
              <div className="text-xs text-slate-400 mb-1">Одобрение</div>
              <div className="text-lg font-bold text-white">{Math.round(approval)}%</div>
              <DeltaValue value={Math.round(approval - (state.history.length >= 2 ? state.history[state.history.length - 2].approval : approval))} suffix="%" />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Метрики</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              {METRIC_KEYS.map(k => {
                const delta = Math.round(metrics[k] - prevMetrics[k]);
                return (
                  <div key={k} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-1.5">{React.createElement(METRICS_CFG[k].Icon, { size: 14, style: { color: METRICS_CFG[k].color } })}<span className="text-sm text-slate-300">{METRICS_CFG[k].name}</span></div>
                    <div className="flex items-center gap-2"><span className="text-sm font-bold text-white">{Math.round(metrics[k])}</span>{delta !== 0 && <DeltaValue value={delta} />}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-6 p-3 rounded-xl bg-slate-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2"><Users size={16} className="text-cyan-400" /><span className="text-sm text-slate-300">Население</span></div>
            <div className="flex items-center gap-2"><span className="text-sm font-bold text-white">{population.toLocaleString("ru-RU")}</span><DeltaValue value={population - prevPopulation} /></div>
          </div>

          {debt > 0 && <div className={`mb-6 p-3 rounded-xl text-center text-sm font-bold ${debt > 500 ? "bg-red-900/30 text-red-300" : "bg-yellow-900/30 text-yellow-300"}`}>Долг: {Math.round(debt)} млн</div>}

          <button onClick={() => dispatch({ type: "NEXT_TURN" })}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-lg flex items-center justify-center gap-2">
            {turn >= MAX_TURNS || state.defaulted ? "Результаты" : turn === ELECTION_TURN ? "К выборам!" : "Следующий квартал"}<ArrowRight size={20} />
          </button>
        </div>
      </FadeIn>
      <NewsBar news={state.news} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 11: ELECTION
// ═══════════════════════════════════════════════════════════════════════════════

function ElectionCampaign({ state, dispatch }) {
  const [promiseIdx, setPromiseIdx] = useState(null);
  const startScore = state.history[0]?.zvScore || 38;
  const attrGrowth = Math.round(((state.zvenigorodScore - startScore) / Math.max(1, startScore)) * 100);
  const popGrowth = Math.round(((state.population - INIT_POP) / INIT_POP) * 100);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <FadeIn className="max-w-xl w-full">
        <div className="rounded-2xl bg-gradient-to-b from-indigo-950/50 to-slate-900/80 border border-indigo-500/30 p-8 shadow-2xl">
          <div className="text-center mb-6">
            <Vote className="mx-auto text-indigo-400 mb-3" size={40} />
            <h2 className="text-2xl font-black text-white mb-2">Выборы мэра Звенигорода</h2>
            <p className="text-sm text-slate-400">Ваш первый срок подошёл к концу. Жители решают, достойны ли вы второго срока.</p>
          </div>

          <div className="space-y-2 mb-6 p-4 rounded-xl bg-slate-800/50">
            <div className="flex justify-between text-sm"><span className="text-slate-400">Одобрение:</span><span className="text-white font-bold">{Math.round(state.approval)}%</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-400">Рост привлекательности:</span><span className={`font-bold ${attrGrowth > 0 ? "text-emerald-400" : "text-red-400"}`}>{attrGrowth > 0 ? "+" : ""}{attrGrowth}%</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-400">Население:</span><span className="text-white font-bold">{INIT_POP.toLocaleString("ru-RU")} → {state.population.toLocaleString("ru-RU")} ({popGrowth > 0 ? "+" : ""}{popGrowth}%)</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-400">Финансовая стабильность:</span><span className={state.neverHadDebt ? "text-emerald-400 font-bold" : "text-yellow-400 font-bold"}>{state.neverHadDebt ? "Без долгов ✓" : "Были проблемы"}</span></div>
          </div>

          <h3 className="text-sm font-bold text-slate-300 mb-3">Предвыборное обещание:</h3>
          <div className="space-y-2 mb-6">
            {ELECTION_PROMISES.map((p, i) => (
              <button key={p.id} onClick={() => { setPromiseIdx(i); dispatch({ type: "CHOOSE_PROMISE", index: i }); }}
                className={`w-full text-left p-3 rounded-xl border transition-all ${promiseIdx === i ? "border-blue-500 bg-blue-500/10" : "border-slate-600/50 bg-slate-800/50 hover:border-slate-500/50"}`}>
                <div className="text-sm font-bold text-white">{p.label}</div>
                <div className="text-xs text-slate-400 mt-1">Бонус: {Object.entries(p.bonus).map(([k,v])=>`${METRICS_CFG[k]?.name} +${v}`).join(", ")} | Если не выполните — штраф к одобрению</div>
              </button>
            ))}
          </div>

          <button onClick={() => dispatch({ type: "START_ELECTION" })} disabled={promiseIdx === null}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl text-lg">
            Начать подсчёт голосов
          </button>
        </div>
      </FadeIn>
    </div>
  );
}

function ElectionVote({ state, dispatch }) {
  const [counting, setCounting] = useState(true);
  const [displayPct, setDisplayPct] = useState(50);

  useEffect(() => {
    dispatch({ type: "ELECTION_RESULT" });
  }, []);

  useEffect(() => {
    if (!state.electionResult) return;
    const target = state.electionResult.votePercent;
    let current = 50;
    const interval = setInterval(() => {
      current += (target - current) * 0.1 + (Math.random() - 0.5) * 2;
      setDisplayPct(Math.round(current * 10) / 10);
      if (Math.abs(current - target) < 0.5) {
        setDisplayPct(target);
        setCounting(false);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [state.electionResult]);

  if (!state.electionResult) return null;
  const { won, votePercent, opponent } = state.electionResult;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <FadeIn className="max-w-xl w-full">
        <div className="rounded-2xl bg-gradient-to-b from-indigo-950/50 to-slate-900/80 border border-indigo-500/30 p-8 shadow-2xl text-center">
          <h2 className="text-xl font-black text-white mb-6">Подсчёт голосов</h2>

          <div className="mb-4">
            <div className="text-sm text-slate-400 mb-2">Ваш оппонент: <span className="text-white">{opponent.avatar} {opponent.name}</span></div>
            <div className="text-xs text-slate-500 italic">«{opponent.slogan}»</div>
          </div>

          <div className="relative h-8 rounded-full overflow-hidden bg-red-900/30 mb-4">
            <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-300 bg-blue-600" style={{ width: `${displayPct}%` }} />
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">{displayPct}% за вас | {Math.round((100 - displayPct) * 10) / 10}% за оппонента</div>
          </div>

          {!counting && (
            <FadeIn>
              <div className={`text-3xl font-black mb-4 ${won ? "text-emerald-400" : "text-red-400"}`}>{won ? "🎉 Вы переизбраны!" : "😔 Вы проиграли"}</div>
              <p className="text-sm text-slate-400 mb-6">{won ? "Жители доверили вам ещё 5 лет. Не подведите!" : `Жители выбрали ${opponent.name} новым мэром.`}</p>
              <button onClick={() => { if (won) dispatch({ type: "START_SECOND_TERM" }); else dispatch({ type: "NEXT_TURN" }); }}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-lg">
                {won ? "Начать второй срок" : "Посмотреть итоги"}
              </button>
            </FadeIn>
          )}
        </div>
      </FadeIn>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 12: END SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

function getGrade(rankIdx) {
  if (rankIdx < 5) return { letter:"S", label:"Легенда", color:"#fbbf24", bg:"from-yellow-900/40 to-yellow-950/20" };
  if (rankIdx < 15) return { letter:"A", label:"Мировой лидер", color:"#22c55e", bg:"from-green-900/40 to-green-950/20" };
  if (rankIdx < 30) return { letter:"B", label:"Город мечты", color:"#3b82f6", bg:"from-blue-900/40 to-blue-950/20" };
  if (rankIdx < 50) return { letter:"C", label:"Растущая звезда", color:"#a855f7", bg:"from-purple-900/40 to-purple-950/20" };
  if (rankIdx < 70) return { letter:"D", label:"Середнячок", color:"#f59e0b", bg:"from-amber-900/40 to-amber-950/20" };
  return { letter:"F", label:"Провал", color:"#ef4444", bg:"from-red-900/40 to-red-950/20" };
}

function getPlayStyle(history) {
  if (!history || history.length < 2) return "Новичок";
  const last = history[history.length - 1]?.metrics || {};
  const top = METRIC_KEYS.reduce((a, k) => last[k] > (last[a]||0) ? k : a, METRIC_KEYS[0]);
  const styles = { digital:"Технократ", economy:"Капиталист", ecology:"Эколог", culture:"Культуролог", healthcare:"Гуманист", education:"Просветитель", safety:"Силовик", infrastructure:"Строитель" };
  const balanced = METRIC_KEYS.every(k => last[k] >= 50);
  if (balanced) return "Сбалансированный";
  return styles[top] || "Мэр";
}

function EndScreen({ state, onRestart }) {
  const grade = getGrade(state.globalRankIdx);
  const history = state.history;
  const rankData = history.map(h => ({ turn:`К${h.turn}`, rank: h.globalRankIdx + 1 }));
  const popData = history.map(h => ({ turn:`К${h.turn}`, pop: h.population }));
  const playStyle = getPlayStyle(history);

  const bestMetric = METRIC_KEYS.reduce((b, k) => { const d = state.metrics[k] - INIT_METRICS[k]; return d > b.delta ? { key: k, delta: d } : b; }, { key: "", delta: -Infinity });
  const worstMetric = METRIC_KEYS.reduce((w, k) => { const d = state.metrics[k] - INIT_METRICS[k]; return d < w.delta ? { key: k, delta: d } : w; }, { key: "", delta: Infinity });

  return (
    <div className="min-h-screen px-4 py-8 md:py-12">
      <FadeIn className="max-w-3xl mx-auto">
        <div className={`text-center rounded-2xl bg-gradient-to-b ${grade.bg} border border-slate-700/40 p-8 mb-6`}>
          {state.defaulted && <div className="mb-4 px-4 py-2 inline-block rounded-full bg-red-900/50 text-red-300 text-sm font-bold">Дефолт! Город обанкротился.</div>}
          {state.electionResult && !state.electionResult.won && <div className="mb-4 px-4 py-2 inline-block rounded-full bg-red-900/50 text-red-300 text-sm font-bold">Проиграл выборы.</div>}
          <div className="text-8xl font-black mb-2" style={{ color: grade.color }}>{grade.letter}</div>
          <div className="text-xl font-bold text-white mb-1">{grade.label}</div>
          <div className="text-slate-400">Рейтинг: <span className="text-white font-bold">#{state.globalRankIdx + 1}</span> из {WORLD_CITIES.length + 1}</div>
          <div className="text-slate-500 text-sm mt-1">Население: {state.population.toLocaleString("ru-RU")} | Стиль: {playStyle}</div>
        </div>

        {/* Achievements */}
        {state.achievements.length > 0 && (
          <div className="rounded-2xl bg-slate-800/60 border border-slate-700/40 p-6 mb-6">
            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2"><Trophy size={16} className="text-yellow-500" />Достижения</h3>
            <div className="flex flex-wrap gap-3">
              {state.achievements.map(id => { const a = ACHIEVEMENTS.find(x => x.id === id); return a ? <div key={id} className="px-3 py-2 rounded-lg bg-yellow-900/20 border border-yellow-700/30 text-sm"><span className="mr-1">{a.icon}</span>{a.name}</div> : null; })}
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/40 p-6 mb-6">
          <h3 className="text-sm font-bold text-slate-300 mb-4">Сравнение метрик</h3>
          <div className="space-y-2">
            {METRIC_KEYS.map(k => {
              const start = INIT_METRICS[k];
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl bg-slate-800/60 border border-slate-700/40 p-4">
            <h3 className="text-sm font-bold text-slate-300 mb-3">Рейтинг</h3>
            <div className="h-48"><ResponsiveContainer width="100%" height="100%"><LineChart data={rankData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="turn" tick={{ fill:"#64748b", fontSize:10 }} /><YAxis reversed tick={{ fill:"#64748b", fontSize:10 }} /><RTooltip contentStyle={{ backgroundColor:"#1e293b", border:"1px solid #334155", borderRadius:"8px" }} /><Line type="monotone" dataKey="rank" stroke="#3b82f6" strokeWidth={2} dot={{ r:2, fill:"#3b82f6" }} name="Позиция" /></LineChart></ResponsiveContainer></div>
          </div>
          <div className="rounded-2xl bg-slate-800/60 border border-slate-700/40 p-4">
            <h3 className="text-sm font-bold text-slate-300 mb-3">Население</h3>
            <div className="h-48"><ResponsiveContainer width="100%" height="100%"><LineChart data={popData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="turn" tick={{ fill:"#64748b", fontSize:10 }} /><YAxis tick={{ fill:"#64748b", fontSize:10 }} /><RTooltip contentStyle={{ backgroundColor:"#1e293b", border:"1px solid #334155", borderRadius:"8px" }} /><Line type="monotone" dataKey="pop" stroke="#06b6d4" strokeWidth={2} dot={{ r:2, fill:"#06b6d4" }} name="Население" /></LineChart></ResponsiveContainer></div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/40 p-6 mb-6">
          <h3 className="text-sm font-bold text-slate-300 mb-3">Итоги правления</h3>
          <div className="space-y-2 text-sm text-slate-400">
            {bestMetric.delta > 0 && <p>Лучший рост: <span className="text-white font-medium">{METRICS_CFG[bestMetric.key]?.name}</span> <span className="text-emerald-400">+{bestMetric.delta}</span></p>}
            {worstMetric.delta < 0 && <p>Наибольшее падение: <span className="text-white font-medium">{METRICS_CFG[worstMetric.key]?.name}</span> <span className="text-red-400">{worstMetric.delta}</span></p>}
            <p>Финальный бюджет: <span className="text-white font-medium">{Math.round(state.budget)} млн</span></p>
            {state.debt > 0 && <p>Долг: <span className="text-red-400 font-medium">{Math.round(state.debt)} млн</span></p>}
            <p>Население: <span className="text-white font-medium">{state.population > INIT_POP ? "+" : ""}{state.population - INIT_POP}</span></p>
            <p>Кварталов: <span className="text-white font-medium">{state.turn}</span> | Одобрение: <span className="text-white font-medium">{Math.round(state.approval)}%</span></p>
          </div>
        </div>

        <button onClick={onRestart} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-lg flex items-center justify-center gap-2"><RotateCcw size={20} />Играть снова</button>
      </FadeIn>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 13: MAIN
// ═══════════════════════════════════════════════════════════════════════════════

export default function ZvenigorodMayorSim() {
  const [state, dispatch] = useReducer(gameReducer, Date.now(), createInitialState);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-blue-500/30">
      <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } } .animate-marquee { animation: marquee 30s linear infinite; }`}</style>
      {state.phase === "start" && <StartScreen onStart={() => dispatch({ type: "START_GAME", seed: Date.now() })} />}
      {state.phase === "event" && <EventPhase event={state.currentEvent} onContinue={() => dispatch({ type: "CONTINUE_EVENT" })} onChoice={(i) => dispatch({ type: "CHOOSE_EVENT", index: i })} />}
      {state.phase === "decisions" && <DecisionPhase state={state} dispatch={dispatch} />}
      {state.phase === "results" && <ResultsPhase state={state} dispatch={dispatch} />}
      {state.phase === "election_campaign" && <ElectionCampaign state={state} dispatch={dispatch} />}
      {state.phase === "election_vote" && <ElectionVote state={state} dispatch={dispatch} />}
      {state.phase === "election_result" && <ElectionVote state={state} dispatch={dispatch} />}
      {state.phase === "end" && <EndScreen state={state} onRestart={() => dispatch({ type: "RESTART" })} />}
    </div>
  );
}
