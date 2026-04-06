import { METRIC_KEYS } from "./constants.js";

export const ALL_EVENTS = [
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
  // New events v3.5
  { id:"gas_leak", text:"💨 Утечка газа на ул. Московской. Эвакуация!", effects:{safety:-6,infrastructure:-3}, budget:-35, approval:-3 },
  { id:"sports_medal", text:"🥇 Спортсмен из Звенигорода взял олимпийское золото!", effects:{culture:5,education:3}, budget:0, population:200 },
  { id:"road_accident", text:"🚗 Серия ДТП на нерегулируемых перекрёстках.", effects:{safety:-4,infrastructure:-2}, budget:0, approval:-3, requires:{safety_lt:40} },
  { id:"heritage_site", text:"🏛️ ЮНЕСКО рассматривает монастырь как наследие.",
    choices:[
      { label:"Подать заявку (затратно, но престижно)", effects:{culture:10,economy:5}, budget:-100 },
      { label:"Не подавать — слишком дорого", effects:{}, budget:0 },
    ] },
  { id:"cyber_attack", text:"💻 Хакеры атаковали городские системы!", effects:{digital:-6,safety:-3}, budget:-25, requires:{digital:40} },
  { id:"startup_exit", text:"🚀 Стартап из Звенигорода продан за $50M!", effects:{economy:6,digital:4}, budget:30, population:200 },
  { id:"water_contamination", text:"☠️ Загрязнение водопроводной воды!", effects:{healthcare:-8,ecology:-4}, budget:-60, approval:-5, requires:{infrastructure_lt:45} },
  { id:"street_art_festival", text:"🎨 Фестиваль уличного искусства привлёк тысячи!", effects:{culture:5,economy:2}, budget:0, population:150 },
  { id:"volunteer_wave", text:"🤝 Волонтёрское движение набирает силу!", effects:{safety:3,healthcare:2,culture:2}, budget:0, approval:3 },
  { id:"real_estate_boom", text:"🏠 Цены на жильё стремительно растут!",
    choices:[
      { label:"Ввести ценовые ограничения", effects:{economy:-3,safety:2}, budget:0, approval:3 },
      { label:"Дать рынку регулировать", effects:{economy:4}, budget:0, approval:-3 },
    ] },
  { id:"celebrity_move", text:"⭐ Знаменитость переехала в Звенигород!", effects:{culture:4,economy:3}, budget:0, population:100 },
  { id:"power_outage", text:"⚡ Массовое отключение электричества на 3 дня!", effects:{infrastructure:-5,safety:-3,digital:-2}, budget:-40 },
  { id:"mosfilm_shooting", text:"🎬 Мосфильм хочет снимать сериал в Звенигороде!",
    choices:[
      { label:"Перекрыть улицы для съёмок", effects:{culture:6,economy:4,infrastructure:-2}, budget:20 },
      { label:"Разрешить, но без закрытия улиц", effects:{culture:3,economy:2}, budget:10 },
    ] },
  { id:"school_crisis", text:"📚 Учителя массово увольняются из-за зарплат!",
    choices:[
      { label:"Повысить зарплаты", effects:{education:5}, budget:-60, approval:3 },
      { label:"Привлечь волонтёров и студентов", effects:{education:2}, budget:-15, approval:-2 },
    ] },
  // Milestone events
  { id:"milestone_10", text:"📊 Губернатор лично приехал проверить прогресс Звенигорода. «Посмотрим, что покажете дальше».", minTurn:10,
    choices:[
      { label:"Попросить федеральный грант", effects:{}, budget:100, approval:3 },
      { label:"Предложить совместный проект", effects:{infrastructure:4,economy:3}, budget:0 },
    ] },
  { id:"milestone_30", text:"⏰ Журналисты подводят промежуточный итог вашего правления.", minTurn:28,
    choices:[
      { label:"Дать интервью — рассказать об успехах", effects:{culture:3}, budget:0, approval:5 },
      { label:"Действия говорят громче слов", effects:{}, budget:0, approval:2 },
    ] },
  { id:"train_lastochka", text:"🚂 РЖД запустила «Ласточку» до Звенигорода!", effects:{infrastructure:6,economy:5}, budget:0, population:700, minTurn:8 },
  { id:"graffiti", text:"🎨 Граффитисты разрисовали новые фасады.", effects:{}, budget:0, randomCulture:true },
  { id:"measles", text:"🏥 Эпидемия кори! Не хватает вакцин.", effects:{healthcare:-8,safety:-3}, budget:0, population:-200, requires:{healthcare_lt:40} },
  // Chain events
  { id:"factory_complaints", text:"😤 Жители жалуются на выбросы от завода.", effects:{ecology:-5,healthcare:-2}, budget:0, chain:true, approval:-5 },
  { id:"factory_river", text:"☠️ Завод загрязнил Москву-реку!", effects:{ecology:-10,healthcare:-5}, budget:-100, chain:true, approval:-10 },
  { id:"cowork_startup", text:"🚀 Стартап из коворкинга привлёк $2M инвестиций!", effects:{economy:5,digital:3}, budget:0, chain:true },
  { id:"festival_forbes", text:"✨ Фестиваль попал в Forbes Travel!", effects:{culture:4}, budget:0, population:300, chain:true },
];

export const ADVISORS = [
  { name:"Марина Сергеевна", role:"Зам по социалке", avatar:"👩‍💼", bias:["healthcare","education","safety"],
    phrases:{ healthcare:"Людям нужна больница, не коворкинг.", education:"Инвестиции в школы — инвестиции в будущее.", safety:"Безопасность — базовая потребность.", default:"Думайте о людях, мэр." } },
  { name:"Артём", role:"Зам по развитию", avatar:"👨‍💻", bias:["digital","economy","culture"],
    phrases:{ digital:"Оптоволокно — фундамент всего!", economy:"Нужны рабочие места и стартапы.", culture:"Креативный класс привлекает инвестиции.", default:"Звенигород может стать мини-Сингапуром!" } },
  { name:"Виктор Петрович", role:"Бывший мэр", avatar:"🧓", bias:["infrastructure","ecology","safety"],
    phrases:{ infrastructure:"Сначала — дороги. Я видел трёх мэров до вас.", ecology:"Не губите природу ради сиюминутной выгоды.", safety:"Я помню, как три мэра обанкротили город.", default:"Молодой человек, не торопитесь." } },
];

export const OPPONENTS = [
  { name:"Дмитрий Козлов", slogan:"Снизим налоги, построим ТЦ!", strength:45, avatar:"👨‍💼" },
  { name:"Елена Волкова", slogan:"Экология — приоритет №1!", strength:50, avatar:"👩‍🔬" },
  { name:"Сергей Николаев", slogan:"Вернём порядок и безопасность!", strength:55, avatar:"👮" },
  { name:"Анна Белова", slogan:"Звенигород для молодых!", strength:40, avatar:"👩‍💻" },
  { name:"Геннадий Крылов", slogan:"Опыт важнее экспериментов!", strength:60, avatar:"🧓" },
];

export const ACHIEVEMENTS = [
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
  { id:"pacifier", name:"Усмиритель", cond:(s)=>(s.resolvedProtests||0)>=3, icon:"✊" },
  { id:"financier", name:"Финансист", cond:(s)=>s.debt===0&&s.turn>=20, icon:"🏦" },
  { id:"balance_master", name:"Баланс мастер", cond:(s)=>METRIC_KEYS.every(k=>s.metrics[k]>=40&&s.metrics[k]<=70), icon:"🎯" },
  { id:"comeback", name:"Камбэк", cond:(s)=>s.approval>=60&&(s.approvalHistory||[]).some(a=>a<20), icon:"🔄" },
  { id:"diplomat", name:"Дипломат", cond:(s)=>{const r=s.neighborRelations||{};return Object.values(r).every(v=>v.relationship>=30)}, icon:"🤝" },
  { id:"builder", name:"Великий строитель", cond:(s)=>s.metrics.infrastructure>=85, icon:"🏗️" },
  { id:"healer", name:"Целитель", cond:(s)=>s.metrics.healthcare>=85, icon:"🏥" },
  { id:"educator", name:"Просветитель", cond:(s)=>s.metrics.education>=85, icon:"📚" },
  { id:"marathon", name:"Марафонец", cond:(s)=>s.turn>=40, icon:"🏁" },
];

export const ELECTION_PROMISES = [
  { id:"edu_promise", label:"Удвоить бюджет на образование", bonus:{education:5}, check:{metric:"education",min:70,byTurn:30}, penalty:-10 },
  { id:"infra_promise", label:"Победить пробки", bonus:{infrastructure:5}, check:{metric:"infrastructure",min:70,byTurn:30}, penalty:-10 },
  { id:"eco_promise", label:"Сделать город зелёным", bonus:{ecology:5}, check:{metric:"ecology",min:70,byTurn:30}, penalty:-10 },
  { id:"digital_promise", label:"Превратить в умный город", bonus:{digital:5}, check:{metric:"digital",min:60,byTurn:30}, penalty:-10 },
  { id:"safety_promise", label:"Искоренить преступность", bonus:{safety:5}, check:{metric:"safety",min:70,byTurn:30}, penalty:-10 },
  { id:"health_promise", label:"Современная медицина каждому", bonus:{healthcare:5}, check:{metric:"healthcare",min:65,byTurn:30}, penalty:-10 },
];
