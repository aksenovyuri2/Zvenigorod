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
  // ── PHASE 6: Zvenigorod-specific story events (20) ──
  { id:"unesco_bid", text:"🏛️ ЮНЕСКО рассматривает Саввино-Сторожевский монастырь!", requires:{culture:60},
    choices:[
      { label:"Подать заявку — инвестировать в реставрацию", effects:{culture:8,economy:4}, budget:-60, population:300 },
      { label:"Не рисковать — слишком дорого", effects:{}, budget:0 },
    ] },
  { id:"river_flood_big", text:"🌊 Москва-река вышла из берегов! Нижний Посад затоплен.", effects:{infrastructure:-7,ecology:-3,safety:-4}, budget:-100, minTurn:10 },
  { id:"dyutkovo_residency", text:"🎨 Художники со всей России хотят открыть резиденцию в Дютьково!",
    choices:[
      { label:"Выделить помещение", effects:{culture:10,economy:3}, budget:-30 },
      { label:"Нет свободных площадей", effects:{}, budget:0 },
    ] },
  { id:"railway_grant", text:"🚂 Федеральный грант на модернизацию ж/д станции!", effects:{infrastructure:8,economy:3}, budget:200, minTurn:5 },
  { id:"sanatorium_renovation", text:"🏥 Инвестор хочет восстановить советский санаторий.",
    choices:[
      { label:"Одобрить — это рабочие места", effects:{healthcare:5,economy:6,ecology:-2}, budget:0, population:200 },
      { label:"Запретить — это зелёная зона", effects:{ecology:4,culture:2}, budget:0 },
    ] },
  { id:"bell_tower_collapse", text:"🔔 Обрушилась колокольня старой церкви! Нужна срочная реставрация.", effects:{culture:-6,safety:-3}, budget:-60, minTurn:8 },
  { id:"celebrity_visit", text:"⭐ Знаменитость выложила фото из Звенигорода — вирусный пост!", effects:{culture:6,economy:4}, budget:0, population:500 },
  { id:"food_festival", text:"🍕 Фестиваль «Вкусы Звенигорода» стал хитом сезона!", effects:{culture:5,economy:5}, budget:-20, population:200, season:2 },
  { id:"artifact_discovery", text:"⚱️ Археологи нашли древний клад при строительстве!", effects:{culture:8}, budget:20,
    choices:[
      { label:"Создать музей находок", effects:{culture:10,education:5}, budget:-40 },
      { label:"Передать в Москву", effects:{culture:2}, budget:50 },
    ] },
  { id:"upstream_disaster", text:"☠️ Завод выше по течению сбросил отходы в Москву-реку!", effects:{ecology:-10,healthcare:-5,safety:-3}, budget:-50, minTurn:12 },
  { id:"film_location", text:"🎬 Звенигород выбран для съёмок нового сериала!", effects:{culture:6,economy:4}, budget:50, population:200 },
  { id:"monastery_pilgrims", text:"✝️ Поток паломников в Саввино-Сторожевский монастырь удвоился.", effects:{culture:4,economy:3}, budget:0, population:150, requires:{culture:45} },
  { id:"tech_hub_proposal", text:"💡 Яндекс предлагает открыть тестовый хаб в Звенигороде.",
    choices:[
      { label:"Согласиться — выделить землю", effects:{digital:10,economy:6}, budget:-40, population:300 },
      { label:"Отказать — сохранить дух города", effects:{culture:3}, budget:0 },
    ] },
  { id:"winter_power_outage", text:"⚡ Зимний шторм оборвал линии электропередач!", effects:{infrastructure:-5,safety:-4,healthcare:-2}, budget:-40, season:0 },
  { id:"student_protest_housing", text:"🏠 Студенты протестуют: негде жить в Звенигороде!", effects:{}, budget:0, approval:-5, requires:{education:50},
    choices:[
      { label:"Построить общежитие", effects:{education:5,infrastructure:2}, budget:-80, population:200 },
      { label:"Субсидировать аренду", effects:{education:2}, budget:-30, approval:3 },
    ] },
  { id:"dacha_fire", text:"🔥 Пожар в дачном посёлке! Жертв нет, но десятки домов сгорели.", effects:{safety:-6,infrastructure:-3}, budget:-40, population:-100 },
  { id:"zvenigorod_brand", text:"📦 Местные фермеры создали бренд «Звенигородское» — хит Москвы!", effects:{economy:6,culture:3}, budget:30 },
  { id:"cycling_path", text:"🚴 Общественники просят велодорожку вдоль реки.",
    choices:[
      { label:"Построить — здоровый город", effects:{ecology:4,healthcare:3,infrastructure:2}, budget:-30 },
      { label:"Нет денег на это", effects:{}, budget:0, approval:-2 },
    ] },
  { id:"old_cemetery", text:"⚰️ Обнаружено древнее кладбище на месте стройки.",
    choices:[
      { label:"Остановить стройку, провести раскопки", effects:{culture:6,education:3}, budget:-20 },
      { label:"Перенести захоронения и продолжить", effects:{infrastructure:3,economy:2,culture:-5}, budget:0, approval:-3 },
    ] },
  { id:"electric_bus", text:"🚌 Мосэнерго предлагает запустить электробус Москва-Звенигород.",
    choices:[
      { label:"Участвовать в пилоте", effects:{infrastructure:5,ecology:4,digital:2}, budget:-50 },
      { label:"Дорого, подождём", effects:{}, budget:0 },
    ] },
  // Chain events
  { id:"factory_complaints", text:"😤 Жители жалуются на выбросы от завода.", effects:{ecology:-5,healthcare:-2}, budget:0, chain:true, approval:-5 },
  { id:"factory_river", text:"☠️ Завод загрязнил Москву-реку!", effects:{ecology:-10,healthcare:-5}, budget:-100, chain:true, approval:-10 },
  { id:"cowork_startup", text:"🚀 Стартап из коворкинга привлёк $2M инвестиций!", effects:{economy:5,digital:3}, budget:0, chain:true },
  { id:"festival_forbes", text:"✨ Фестиваль попал в Forbes Travel!", effects:{culture:4}, budget:0, population:300, chain:true },

  // ── MORAL DILEMMAS (isMoral:true — tracked for end-game judgment) ──
  { id:"moral_homeless", text:"🏚️ Бездомные обосновались в парке. Жители требуют выселения.", isMoral:true,
    choices:[
      { label:"Построить приют", effects:{healthcare:3,safety:2,culture:-1}, budget:-50, approval:3, moralTag:"compassionate" },
      { label:"Выселить — парк для всех", effects:{safety:3,culture:2}, budget:0, approval:-2, moralTag:"utilitarian" },
    ] },
  { id:"moral_factory_offer", text:"🏭 Химзавод обещает 500 рабочих мест. Но река под угрозой.", isMoral:true,
    choices:[
      { label:"Отказать — река важнее", effects:{ecology:5}, budget:0, moralTag:"compassionate" },
      { label:"Принять с условиями очистки", effects:{economy:6,ecology:-3}, budget:-30, moralTag:"balanced" },
      { label:"Принять без ограничений", effects:{economy:10,ecology:-8}, budget:0, population:500, moralTag:"utilitarian" },
    ] },
  { id:"moral_surveillance", text:"📹 Полиция просит установить камеры во всех дворах.", isMoral:true,
    choices:[
      { label:"Установить — безопасность прежде всего", effects:{safety:8,digital:2}, budget:-40, moralTag:"utilitarian" },
      { label:"Только в проблемных районах", effects:{safety:4,digital:1}, budget:-20, moralTag:"balanced" },
      { label:"Отказать — это слежка", effects:{culture:3}, budget:0, moralTag:"compassionate" },
    ] },
  { id:"moral_historic_quarter", text:"🏛️ Застройщик хочет снести исторический квартал ради ЖК.", isMoral:true,
    choices:[
      { label:"Разрешить снос — жильё важнее", effects:{infrastructure:5,economy:5,culture:-8}, budget:50, population:300, moralTag:"utilitarian" },
      { label:"Запретить — это память города", effects:{culture:6}, budget:0, moralTag:"compassionate" },
    ] },
  { id:"moral_whistleblower", text:"🔍 Сотрудник мэрии сообщил о воровстве подрядчика. Но подрядчик — ваш друг.", isMoral:true,
    choices:[
      { label:"Уволить подрядчика и начать расследование", effects:{safety:3}, budget:-30, approval:5, moralTag:"compassionate" },
      { label:"Замять скандал", effects:{}, budget:0, approval:-3, moralTag:"utilitarian" },
    ] },
  { id:"moral_school_or_stadium", text:"⚖️ Бюджет только на одно: новую школу ИЛИ стадион.", isMoral:true,
    choices:[
      { label:"Школу — дети важнее", effects:{education:8}, budget:-80, moralTag:"compassionate" },
      { label:"Стадион — нужны события", effects:{culture:6,economy:3}, budget:-80, moralTag:"utilitarian" },
    ] },
  { id:"moral_oligarch", text:"💰 Олигарх предлагает спонсировать город в обмен на... влияние.", isMoral:true,
    choices:[
      { label:"Принять деньги — город нуждается", effects:{economy:5}, budget:200, approval:-5, moralTag:"utilitarian" },
      { label:"Отказать — независимость не продаётся", effects:{}, budget:0, approval:5, moralTag:"compassionate" },
    ] },
  { id:"moral_env_vs_jobs", text:"🌊 Ливневые стоки заводов травят реку. Закрытие — потеря 300 рабочих мест.", isMoral:true,
    choices:[
      { label:"Закрыть заводы — река умирает", effects:{ecology:8,economy:-6}, budget:0, population:-300, moralTag:"compassionate" },
      { label:"Штрафы и модернизация", effects:{ecology:3,economy:-2}, budget:-40, moralTag:"balanced" },
      { label:"Не трогать — рабочие места важнее", effects:{economy:3,ecology:-5}, budget:0, moralTag:"utilitarian" },
    ] },
];

// ── SEASONAL REAL-WORLD EVENTS (triggered by actual calendar date) ──
export const SEASONAL_EVENTS = [
  { id:"seasonal_newyear", text:"🎄 Новый год! Звенигород украшен, ярмарка на площади.", effects:{culture:4,economy:3}, budget:-20, population:100,
    dateCheck: d => (d.getMonth() === 11 && d.getDate() >= 25) || (d.getMonth() === 0 && d.getDate() <= 7) },
  { id:"seasonal_maslenitsa", text:"🥞 Масленица в Звенигороде! Блины, хороводы, сжигание чучела.", effects:{culture:5}, budget:-15,
    dateCheck: d => d.getMonth() === 2 && d.getDate() >= 1 && d.getDate() <= 15 },
  { id:"seasonal_may", text:"🎆 Майские праздники. Звенигородцы на шашлыках и субботниках.", effects:{ecology:2,culture:3}, budget:0,
    dateCheck: d => d.getMonth() === 4 && d.getDate() >= 1 && d.getDate() <= 9 },
  { id:"seasonal_cityday", text:"🎉 День города Звенигорода! Концерты, фейерверк, гулянья.", effects:{culture:6,economy:4}, budget:-40, population:200,
    dateCheck: d => d.getMonth() === 6 && d.getDate() >= 10 && d.getDate() <= 20 },
  { id:"seasonal_sept1", text:"🎒 1 сентября — дети идут в школу. Родители обсуждают образование.", effects:{education:3}, budget:0,
    dateCheck: d => d.getMonth() === 8 && d.getDate() >= 1 && d.getDate() <= 5 },
  { id:"seasonal_nov4", text:"🇷🇺 День народного единства. Митинг и возложение цветов к памятнику.", effects:{culture:2,safety:2}, budget:0,
    dateCheck: d => d.getMonth() === 10 && d.getDate() >= 3 && d.getDate() <= 5 },
];

// ── STORY CHARACTERS — recurring NPCs with 3-event arcs ──
export const STORY_CHARACTERS = [
  { id:"baba_nina", name:"Баба Нина", avatar:"👵", group:"elderly",
    arc:[
      { minTurn:3, maxTurn:8, eventId:"nina_1", text:"👵 Баба Нина из Верхнего Посада жалуется: «Поликлиника закрыта на ремонт третий месяц!»", effects:{}, approval:-2 },
      { minTurn:13, maxTurn:20, eventId:"nina_2", requires:{healthcare:50},
        textGood:"👵 Баба Нина благодарит: «Спасибо, мэр! Новый ФАП спас мне жизнь.»", effectsGood:{approval:3},
        textBad:"👵 Баба Нина сидит в очереди в единственную поликлинику. «Не дождусь...»", effectsBad:{healthcare:-2,approval:-2} },
      { minTurn:28, maxTurn:38, eventId:"nina_3",
        textGood:"👵 Баба Нина подарила мэру банку малинового варенья на День города. «За заботу!»", effectsGood:{culture:2,approval:2},
        textBad:"👵 Баба Нина переехала к дочери в Москву. «Здесь обо мне некому позаботиться.»", effectsBad:{population:-10,approval:-3} },
    ], moralQuestion:"Позаботились ли вы о тех, кто не может помочь себе сам?" },
  { id:"kirill", name:"Кирилл", avatar:"💻", group:"freelancers",
    arc:[
      { minTurn:4, maxTurn:10, eventId:"kirill_1", text:"💻 Кирилл-программист: «Интернет тормозит, коворкинга нет. Уеду обратно в Москву.»", effects:{}, approval:-1 },
      { minTurn:14, maxTurn:22, eventId:"kirill_2", requires:{digital:50},
        textGood:"💻 Кирилл запустил стартап прямо в Звенигороде! «Наконец нормальный интернет!»", effectsGood:{economy:3,digital:2},
        textBad:"💻 Кирилл уехал. «Извини, мэр. Звенигород — деревня.»", effectsBad:{population:-20,digital:-1} },
      { minTurn:30, maxTurn:38, eventId:"kirill_3",
        textGood:"💻 Стартап Кирилла привлёк инвестиции — открывает офис на 30 человек!", effectsGood:{economy:5,digital:3,population:30},
        textBad:"💻 В Москве Кирилл рассказывает друзьям: «В Звенигород — только на экскурсию.»", effectsBad:{} },
    ], moralQuestion:"Создали ли вы условия для тех, кто хочет строить будущее?" },
  { id:"petrovy", name:"Семья Петровых", avatar:"👨‍👩‍👧‍👦", group:"families",
    arc:[
      { minTurn:2, maxTurn:7, eventId:"petrovy_1", text:"👨‍👩‍👧‍👦 Семья Петровых: «В школу не попасть, очередь в детсад — 2 года!»", effects:{}, approval:-1 },
      { minTurn:12, maxTurn:20, eventId:"petrovy_2", requires:{education:50},
        textGood:"👨‍👩‍👧‍👦 Маша Петрова пошла в новую школу. Родители счастливы!", effectsGood:{education:2,approval:3},
        textBad:"👨‍👩‍👧‍👦 Петровы возят дочь в школу в Одинцово. «Стыдно за город.»", effectsBad:{approval:-2} },
      { minTurn:28, maxTurn:38, eventId:"petrovy_3",
        textGood:"👨‍👩‍👧‍👦 Маша Петрова выиграла олимпиаду! «Спасибо нашей школе!»", effectsGood:{education:3,culture:2},
        textBad:"👨‍👩‍👧‍👦 Петровы продали квартиру. «Переезжаем ближе к нормальным школам.»", effectsBad:{population:-30} },
    ], moralQuestion:"Дали ли вы детям шанс на достойное будущее?" },
  { id:"dasha", name:"Студентка Даша", avatar:"🎓", group:"youth",
    arc:[
      { minTurn:5, maxTurn:10, eventId:"dasha_1", text:"🎓 Даша-студентка: «В Звенигороде НЕЧЕГО делать по вечерам. Все тусят в Москве.»", effects:{}, approval:-1 },
      { minTurn:15, maxTurn:22, eventId:"dasha_2", requires:{culture:55},
        textGood:"🎓 Даша ведёт блог «Звенигород — не спальник!» — 50K подписчиков.", effectsGood:{culture:3,population:50},
        textBad:"🎓 Даша: «Город для пенсионеров. Молодёжи тут нечего ловить.»", effectsBad:{culture:-2} },
      { minTurn:30, maxTurn:38, eventId:"dasha_3",
        textGood:"🎓 Даша организовала первый городской фестиваль. Аншлаг!", effectsGood:{culture:5,economy:2},
        textBad:"🎓 Даша переехала в Питер. На прощание: «Позовите, когда тут будет жизнь.»", effectsBad:{population:-15} },
    ], moralQuestion:"Сделали ли вы город живым — или молодёжь бежит от скуки?" },
  { id:"ahmed", name:"Ахмед", avatar:"📊", group:"business",
    arc:[
      { minTurn:6, maxTurn:12, eventId:"ahmed_1", text:"📊 Бизнесмен Ахмед хочет открыть ресторан, но аренда запредельная.", effects:{}, budget:0 },
      { minTurn:16, maxTurn:24, eventId:"ahmed_2", requires:{economy:50},
        textGood:"📊 Ахмед открыл ресторан «У горы»! Звенигородцы в восторге.", effectsGood:{economy:3,culture:2},
        textBad:"📊 Ахмед уехал в Истру. «Там бизнесу рады, а тут — одни проверки.»", effectsBad:{economy:-2} },
      { minTurn:30, maxTurn:38, eventId:"ahmed_3",
        textGood:"📊 Ахмед открыл вторую точку и нанял 20 местных. «Спасибо за климат!»", effectsGood:{economy:4,population:20},
        textBad:"📊 Ресторан Ахмеда в Истре попал в рейтинг лучших. Звенигород проиграл.", effectsBad:{} },
    ], moralQuestion:"Дали ли вы шанс тем, кто хочет создавать рабочие места?" },
  { id:"lidiya", name:"Лидия Ивановна", avatar:"👩‍🏫", group:"families",
    arc:[
      { minTurn:3, maxTurn:8, eventId:"lidiya_1", text:"👩‍🏫 Учительница Лидия Ивановна: «Зарплаты мизерные. Молодые учителя не идут.»", effects:{education:-1} },
      { minTurn:14, maxTurn:22, eventId:"lidiya_2", requires:{education:55},
        textGood:"👩‍🏫 Лидия Ивановна: «Наконец-то новые учебники и нормальная зарплата!»", effectsGood:{education:3,approval:2},
        textBad:"👩‍🏫 Лидия Ивановна написала заявление. 35 лет стажа, а на пенсию не хватает.", effectsBad:{education:-3,approval:-2} },
      { minTurn:28, maxTurn:38, eventId:"lidiya_3",
        textGood:"👩‍🏫 Ученик Лидии Ивановны поступил в МГУ. «Это лучшая награда.»", effectsGood:{education:2},
        textBad:"👩‍🏫 Школа осталась без учителя математики. Лидия Ивановна на больничном.", effectsBad:{education:-2} },
    ], moralQuestion:"Цените ли вы тех, кто учит ваших детей?" },
  { id:"vorontsov", name:"Доктор Воронцов", avatar:"🩺", group:"elderly",
    arc:[
      { minTurn:4, maxTurn:9, eventId:"vorontsov_1", text:"🩺 Доктор Воронцов: «Скорая не успевает. Одна бригада на весь город.»", effects:{healthcare:-1} },
      { minTurn:15, maxTurn:22, eventId:"vorontsov_2", requires:{healthcare:55},
        textGood:"🩺 Доктор Воронцов: «Новое оборудование! Наконец можем лечить, а не отписываться!»", effectsGood:{healthcare:3,safety:1},
        textBad:"🩺 Доктор Воронцов уехал в частную клинику в Москву. «Устал от нищеты.»", effectsBad:{healthcare:-3} },
      { minTurn:28, maxTurn:38, eventId:"vorontsov_3",
        textGood:"🩺 Воронцов стал главврачом. Очередь на приём сократилась в 3 раза.", effectsGood:{healthcare:4,approval:3},
        textBad:"🩺 В больнице кадровый голод. Операции откладываются.", effectsBad:{healthcare:-4,approval:-3} },
    ], moralQuestion:"Заботились ли вы о тех, кто заботится о здоровье горожан?" },
  { id:"masha_activist", name:"Активистка Маша", avatar:"🌱", group:"youth",
    arc:[
      { minTurn:5, maxTurn:10, eventId:"masha_1", text:"🌱 Активистка Маша собрала 500 подписей: «Река грязная! Когда очистят?»", effects:{}, approval:-2 },
      { minTurn:15, maxTurn:22, eventId:"masha_2", requires:{ecology:55},
        textGood:"🌱 Маша: «Река стала чище! Мы даже рыбу видели!» Снимает видео.", effectsGood:{ecology:2,culture:2},
        textBad:"🌱 Маша подала в суд на мэрию за загрязнение реки.", effectsBad:{ecology:-2,approval:-5} },
      { minTurn:28, maxTurn:38, eventId:"masha_3",
        textGood:"🌱 Маша создала эко-центр «Москва-река». Туристы приезжают специально!", effectsGood:{ecology:3,culture:3,economy:2},
        textBad:"🌱 Маша уехала в Швецию. «Там экологию ценят, а тут — бетон и трубы.»", effectsBad:{population:-10} },
    ], moralQuestion:"Оставили ли вы чистую реку следующим поколениям?" },
  { id:"fedor", name:"Строитель Фёдор", avatar:"🔨", group:"business",
    arc:[
      { minTurn:3, maxTurn:8, eventId:"fedor_1", text:"🔨 Строитель Фёдор: «Мост разваливается. Когда ремонт? Мы ходим по нему каждый день.»", effects:{infrastructure:-1} },
      { minTurn:14, maxTurn:22, eventId:"fedor_2", requires:{infrastructure:50},
        textGood:"🔨 Фёдор: «Наконец-то дороги как в Москве! Горжусь городом.»", effectsGood:{infrastructure:2,approval:2},
        textBad:"🔨 Фёдор: «Яма на яме. У меня машина уже третий раз в ремонте.»", effectsBad:{infrastructure:-2,approval:-2} },
      { minTurn:28, maxTurn:38, eventId:"fedor_3",
        textGood:"🔨 Фёдор открыл строительную фирму. «Хочу отстраивать наш город сам!»", effectsGood:{infrastructure:3,economy:2},
        textBad:"🔨 Фёдор уехал на заработки. «В Звенигороде строить нечего.»", effectsBad:{population:-15} },
    ], moralQuestion:"Дали ли вы городу крепкий фундамент?" },
  { id:"sidorov", name:"Полковник Сидоров", avatar:"🎖️", group:"elderly",
    arc:[
      { minTurn:4, maxTurn:9, eventId:"sidorov_1", text:"🎖️ Полковник Сидоров: «Фонари не горят, во дворах темно. Где участковый?»", effects:{safety:-1} },
      { minTurn:14, maxTurn:22, eventId:"sidorov_2", requires:{safety:50},
        textGood:"🎖️ Полковник Сидоров: «Порядок навели! Внук гуляет до вечера — не страшно.»", effectsGood:{safety:2,approval:2},
        textBad:"🎖️ Полковник Сидоров организовал добровольную дружину. «Раз мэрия не справляется...»", effectsBad:{safety:1,approval:-3} },
      { minTurn:28, maxTurn:38, eventId:"sidorov_3",
        textGood:"🎖️ Сидоров: «За 10 лет ни одного серьёзного инцидента. Мэр — молодец.»", effectsGood:{safety:2,approval:3},
        textBad:"🎖️ Сидоров написал письмо губернатору: «Верните нам безопасный город.»", effectsBad:{safety:-2,approval:-4} },
    ], moralQuestion:"Сделали ли вы так, чтобы люди чувствовали себя в безопасности?" },
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
  // New achievements
  { id:"first_million", name:"Первый миллион", cond:(s)=>s.population>=100000, icon:"🎆" },
  { id:"winter_mayor", name:"Зимний мэр", cond:(s)=>{
    const h=s.history||[];
    const winters=h.filter(t=>t.turn>0&&(t.turn%4)===1);
    return winters.length>=2&&winters.every(t=>(t.metrics?.infrastructure||0)>=40);
  }, icon:"❄️" },
  { id:"grand_diplomat", name:"Дипломатический гений", cond:(s)=>{
    const r=s.neighborRelations||{};
    return Object.values(r).filter(v=>v.relationship>=70).length>=5;
  }, icon:"🌐" },
  { id:"clean_hands", name:"Чистые руки", cond:(s)=>(s.corruptionEvents||[]).length===0&&s.turn>=20, icon:"🤍" },
  { id:"populist", name:"Популист", cond:(s)=>{
    const sats=s.satisfactions||{};
    return Object.values(sats).every(v=>v>=65);
  }, icon:"📣" },
  { id:"crisis_manager", name:"Кризис-менеджер", cond:(s)=>(s.resolvedCrises||[]).length>=3, icon:"🚨" },
  { id:"tight_spread", name:"Мастер баланса", cond:(s)=>{
    const vals=METRIC_KEYS.map(k=>s.metrics[k]);
    return Math.max(...vals)-Math.min(...vals)<15&&s.turn>=20;
  }, icon:"🎯" },
  { id:"eco_tech", name:"ЭкоТех", cond:(s)=>s.metrics.ecology>=80&&s.metrics.digital>=80, icon:"🌱" },
  { id:"culture_boom", name:"Культурный взрыв", cond:(s)=>s.metrics.culture>=85, icon:"🎭" },
  { id:"no_protests", name:"Тишина на улицах", cond:(s)=>(s.activeProtests||[]).length===0&&s.turn>=30, icon:"🕊️" },
  { id:"budget_hero", name:"Богатый город", cond:(s)=>s.budget>=1500, icon:"💎" },
  { id:"comeback_king", name:"Феникс", cond:(s)=>s.globalRankIdx<10&&s.worstRank>50, icon:"🦅" },
  { id:"all_groups", name:"Народное единство", cond:(s)=>{
    const sats=s.satisfactions||{};
    return Object.values(sats).every(v=>v>=75);
  }, icon:"🤝" },
  { id:"speed_demon", name:"Быстрый мэр", cond:(s)=>s.turn<=15&&s.globalRankIdx<20, icon:"💨" },
  { id:"top3_world", name:"Тройка лучших", cond:(s)=>s.globalRankIdx<3, icon:"🥉" },
  // Phase 6 achievements
  { id:"district_hero", name:"Районный герой", cond:(s)=>(s.districts||[]).every(d=>d.development>=60), icon:"🏘️" },
  { id:"streak_7", name:"7 дней подряд", cond:(s)=>{ try { return JSON.parse(localStorage.getItem("zvenigorod_legacy"))?.streak>=7; } catch { return false; } }, icon:"🔥" },
  { id:"moral_compass", name:"Моральный компас", cond:(s)=>(s.moralChoices||[]).length>=4&&(s.moralChoices||[]).every(c=>c.moralTag==="compassionate"), icon:"💚" },
  { id:"pragmatist", name:"Прагматик", cond:(s)=>(s.moralChoices||[]).length>=4&&(s.moralChoices||[]).every(c=>c.moralTag==="utilitarian"), icon:"📊" },
  { id:"story_saver", name:"Спаситель горожан", cond:(s)=>{const ss=s.storyState||{};return Object.values(ss).filter(v=>v.outcomes?.length>=2&&v.outcomes.every(o=>o)).length>=5;}, icon:"🦸" },
  { id:"full_story", name:"Полная история", cond:(s)=>{const ss=s.storyState||{};return Object.values(ss).filter(v=>v.step>=3).length>=8;}, icon:"📖" },
  { id:"perfect_districts", name:"Идеальные районы", cond:(s)=>(s.districts||[]).every(d=>d.satisfaction>=70), icon:"🌟" },
  { id:"weekly_winner", name:"Недельный чемпион", cond:(s)=>{ try { const w=JSON.parse(localStorage.getItem("zvenigorod_weekly")); return w&&["S","A"].includes(w.grade); } catch { return false; } }, icon:"🏋️" },
  { id:"night_mayor", name:"Мэр-полуночник", cond:(s)=>{ const h=new Date().getHours(); return h>=0&&h<5; }, icon:"🌙" },
  { id:"all_metrics_80", name:"Идеальный город", cond:(s)=>METRIC_KEYS.every(k=>s.metrics[k]>=80), icon:"✨" },
];

export const ELECTION_PROMISES = [
  { id:"edu_promise", label:"Удвоить бюджет на образование", bonus:{education:5}, check:{metric:"education",min:70,byTurn:30}, penalty:-10 },
  { id:"infra_promise", label:"Победить пробки", bonus:{infrastructure:5}, check:{metric:"infrastructure",min:70,byTurn:30}, penalty:-10 },
  { id:"eco_promise", label:"Сделать город зелёным", bonus:{ecology:5}, check:{metric:"ecology",min:70,byTurn:30}, penalty:-10 },
  { id:"digital_promise", label:"Превратить в умный город", bonus:{digital:5}, check:{metric:"digital",min:60,byTurn:30}, penalty:-10 },
  { id:"safety_promise", label:"Искоренить преступность", bonus:{safety:5}, check:{metric:"safety",min:70,byTurn:30}, penalty:-10 },
  { id:"health_promise", label:"Современная медицина каждому", bonus:{healthcare:5}, check:{metric:"healthcare",min:65,byTurn:30}, penalty:-10 },
];
