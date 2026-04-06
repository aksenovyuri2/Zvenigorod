export const ALL_DECISIONS = [
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
