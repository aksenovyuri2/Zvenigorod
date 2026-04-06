// ═══════════════════════════════════════════════════════════════════════════════
// ALL DECISIONS — ~500 decisions organized by category and tier
// Tiers: basic (cost ≤50), standard (50-100), advanced (100-180), mega (180+)
// ═══════════════════════════════════════════════════════════════════════════════

export const ALL_DECISIONS = [

  // ─────────────────────────────────────────────────────────────────────────────
  // INFRASTRUCTURE (60 decisions)
  // ─────────────────────────────────────────────────────────────────────────────

  // Basic
  { id:"road_patch", name:"Ямочный ремонт", desc:"Заделка ям и трещин на дорогах.", cost:25, effects:{infrastructure:3,safety:1}, cat:"infrastructure" },
  { id:"bus_stops", name:"Новые остановки", desc:"Современные остановки с навесами.", cost:30, effects:{infrastructure:3,safety:1}, cat:"infrastructure" },
  { id:"sidewalks", name:"Ремонт тротуаров", desc:"Замена плитки и бордюров.", cost:35, effects:{infrastructure:3,safety:2}, cat:"infrastructure" },
  { id:"road_signs", name:"Дорожные знаки", desc:"Обновление и установка знаков.", cost:20, effects:{infrastructure:2,safety:2}, cat:"infrastructure" },
  { id:"public_toilet", name:"Общественные туалеты", desc:"Туалетные модули в парках.", cost:15, effects:{infrastructure:2,culture:1}, cat:"infrastructure" },
  { id:"bench_install", name:"Скамейки и урны", desc:"Малые формы на улицах.", cost:15, effects:{infrastructure:1,culture:1,ecology:1}, cat:"infrastructure" },
  { id:"speed_bumps", name:"Лежачие полицейские", desc:"У школ и детских садов.", cost:10, effects:{safety:3,infrastructure:1}, cat:"infrastructure" },
  { id:"shuttle", name:"Шаттл до ж/д станции", desc:"Регулярный автобус-шаттл к станции.", cost:55, effects:{infrastructure:5,economy:2,ecology:-1}, cat:"infrastructure" },
  { id:"parking_meters", name:"Паркоматы", desc:"Автоматизация оплаты парковки.", cost:30, effects:{infrastructure:2,digital:1,economy:1}, cat:"infrastructure" },
  { id:"trash_bins_smart", name:"Умные урны", desc:"Урны с прессованием и датчиками.", cost:40, effects:{infrastructure:2,ecology:2,digital:1}, cat:"infrastructure" },

  // Standard
  { id:"road_repair", name:"Ремонт дорог", desc:"Капитальный ремонт дорожного покрытия.", cost:140, effects:{infrastructure:10,safety:2,economy:1,ecology:-2}, cat:"infrastructure" },
  { id:"bridge_repair", name:"Ремонт моста", desc:"Укрепление моста через Москву-реку.", cost:90, effects:{infrastructure:7,safety:3}, once:true, cat:"infrastructure" },
  { id:"parking_complex", name:"Многоуровневая парковка", desc:"Паркинг в центре на 200 мест.", cost:100, effects:{infrastructure:6,economy:2,ecology:-1}, once:true, cat:"infrastructure" },
  { id:"road_widening", name:"Расширение улиц", desc:"Расширение ключевых магистралей.", cost:120, effects:{infrastructure:8,economy:2,ecology:-3}, cat:"infrastructure" },
  { id:"pedestrian_zone", name:"Пешеходная зона", desc:"Пешеходная улица в центре.", cost:80, effects:{infrastructure:4,culture:4,economy:2,ecology:1}, once:true, cat:"infrastructure" },
  { id:"bus_fleet", name:"Обновление автобусного парка", desc:"Новые автобусы для города.", cost:100, effects:{infrastructure:6,ecology:1,safety:1}, cat:"infrastructure" },
  { id:"bike_lanes", name:"Велодорожки", desc:"Сеть велодорожек по городу.", cost:70, effects:{infrastructure:4,ecology:3,safety:1}, cat:"infrastructure" },
  { id:"road_lighting_upgrade", name:"Модернизация дорожного освещения", desc:"Замена устаревших светильников на трассах.", cost:60, effects:{infrastructure:4,safety:3}, cat:"infrastructure" },
  { id:"railway_crossing", name:"Ремонт ж/д переезда", desc:"Модернизация переезда с шлагбаумом.", cost:75, effects:{infrastructure:5,safety:4}, once:true, cat:"infrastructure" },
  { id:"embankment_repair", name:"Укрепление набережной", desc:"Ремонт набережной Москвы-реки.", cost:90, effects:{infrastructure:6,ecology:2,culture:1}, once:true, cat:"infrastructure" },

  // Advanced
  { id:"storm_drain", name:"Ливневая канализация", desc:"Система отвода дождевой воды.", cost:160, effects:{infrastructure:8,safety:4,ecology:2}, once:true, cat:"infrastructure" },
  { id:"waterworks", name:"Реконструкция водопровода", desc:"Замена изношенных труб и насосов.", cost:170, effects:{infrastructure:9,healthcare:2}, once:true, cat:"infrastructure" },
  { id:"gas_network", name:"Модернизация газовых сетей", desc:"Замена старых газопроводов.", cost:150, effects:{infrastructure:8,safety:4}, once:true, cat:"infrastructure" },
  { id:"heating_plant", name:"Модернизация котельной", desc:"Новое оборудование теплоснабжения.", cost:140, effects:{infrastructure:7,ecology:2,healthcare:1}, once:true, cat:"infrastructure" },
  { id:"waste_station", name:"Мусороперегрузочная станция", desc:"Современная станция обработки отходов.", cost:130, effects:{infrastructure:5,ecology:4}, once:true, cat:"infrastructure" },
  { id:"electric_grid", name:"Реконструкция электросетей", desc:"Замена подстанций и кабелей.", cost:160, effects:{infrastructure:8,safety:3,digital:1}, once:true, cat:"infrastructure" },
  { id:"underground_utilities", name:"Подземные коммуникации", desc:"Перенос проводов под землю.", cost:180, effects:{infrastructure:7,safety:3,culture:2}, once:true, cat:"infrastructure" },
  { id:"sewage_upgrade", name:"Модернизация канализации", desc:"Расширение и ремонт канализационных сетей.", cost:150, effects:{infrastructure:7,ecology:3,healthcare:1}, once:true, cat:"infrastructure" },
  { id:"cargo_bypass", name:"Грузовой объезд", desc:"Объездная дорога для грузовиков.", cost:180, effects:{infrastructure:8,ecology:3,safety:2,economy:1}, once:true, cat:"infrastructure" },
  { id:"transport_hub", name:"Транспортный узел", desc:"Мультимодальный транспортный узел.", cost:170, effects:{infrastructure:9,economy:3}, once:true, requires:{infrastructure:40}, cat:"infrastructure" },

  // Mega
  { id:"housing", name:"Программа доступного жилья", desc:"Жилой комплекс для молодых семей.", cost:200, effects:{economy:4,infrastructure:3,ecology:-3}, populationEffect:200, cat:"infrastructure" },
  { id:"new_district", name:"Новый микрорайон", desc:"Строительство нового жилого района.", cost:300, effects:{infrastructure:8,economy:5,ecology:-5}, populationEffect:500, once:true, requires:{infrastructure:50}, cat:"infrastructure" },
  { id:"metro_station", name:"Станция лёгкого метро", desc:"Первая станция легкорельсового транспорта.", cost:350, effects:{infrastructure:12,economy:6,ecology:2}, once:true, requires:{infrastructure:60}, cat:"infrastructure", unlocks:["metro_line"] },
  { id:"metro_line", name:"Линия лёгкого метро", desc:"Полная линия из 3 станций.", cost:500, effects:{infrastructure:15,economy:8,ecology:3}, once:true, requires:{infrastructure:70}, cat:"infrastructure" },
  { id:"smart_traffic", name:"Умные светофоры", desc:"AI-управление дорожным движением.", cost:200, effects:{infrastructure:8,digital:4,safety:3,ecology:1}, once:true, requires:{digital:40}, cat:"infrastructure" },

  // Repeatable improvements
  { id:"pothole_campaign", name:"Кампания «Дорога без ям»", desc:"Масштабная кампания ремонта.", cost:50, effects:{infrastructure:4,safety:1}, cat:"infrastructure" },
  { id:"winter_prep", name:"Подготовка к зиме", desc:"Закупка реагентов и техники.", cost:40, effects:{infrastructure:3,safety:2}, cat:"infrastructure" },
  { id:"playground_repair", name:"Ремонт детских площадок", desc:"Обновление площадок во дворах.", cost:25, effects:{infrastructure:2,safety:2,education:1}, cat:"infrastructure" },
  { id:"elevator_program", name:"Замена лифтов", desc:"Замена старых лифтов в многоэтажках.", cost:80, effects:{infrastructure:5,safety:3}, cat:"infrastructure" },
  { id:"roof_program", name:"Программа ремонта крыш", desc:"Ремонт протекающих крыш.", cost:70, effects:{infrastructure:5,safety:1}, cat:"infrastructure" },
  { id:"facade_program", name:"Программа ремонта фасадов", desc:"Обновление фасадов зданий.", cost:60, effects:{infrastructure:3,culture:2}, cat:"infrastructure" },
  { id:"drainage_ditches", name:"Мелиорация", desc:"Очистка и ремонт дренажных канав.", cost:35, effects:{infrastructure:3,ecology:2}, cat:"infrastructure" },
  { id:"street_cleanup", name:"Генеральная уборка улиц", desc:"Масштабная уборка после зимы.", cost:20, effects:{infrastructure:2,ecology:2,culture:1}, cat:"infrastructure" },

  // Late-game
  { id:"city_wifi_mesh", name:"Городская Wi-Fi-сеть", desc:"Бесшовный Wi-Fi на улицах.", cost:120, effects:{infrastructure:4,digital:6}, once:true, requires:{digital:50}, cat:"infrastructure" },
  { id:"fiber_backbone", name:"Оптоволоконная магистраль", desc:"Высокоскоростной бэкбон через весь город.", cost:140, effects:{infrastructure:5,digital:7}, once:true, requires:{digital:40}, cat:"infrastructure" },
  { id:"ev_charging", name:"Сеть зарядных станций", desc:"Зарядки для электромобилей.", cost:80, effects:{infrastructure:4,ecology:3,digital:1}, once:true, cat:"infrastructure" },
  { id:"accessible_ramps", name:"Безбарьерная среда", desc:"Пандусы, подъёмники, тактильная плитка.", cost:60, effects:{infrastructure:4,healthcare:2,culture:1}, once:true, cat:"infrastructure" },
  { id:"water_tower", name:"Новая водонапорная башня", desc:"Резервное водоснабжение.", cost:100, effects:{infrastructure:6,safety:2}, once:true, cat:"infrastructure" },
  { id:"central_square", name:"Реконструкция площади", desc:"Обновление центральной площади.", cost:110, effects:{infrastructure:5,culture:4,economy:2}, once:true, cat:"infrastructure" },
  { id:"river_bridge_new", name:"Новый мост через реку", desc:"Второй мост через Москву-реку.", cost:250, effects:{infrastructure:10,economy:4,safety:2}, once:true, requires:{infrastructure:45}, cat:"infrastructure" },
  { id:"flood_protection", name:"Система противопаводковой защиты", desc:"Дамбы и водоотведение.", cost:180, effects:{infrastructure:6,safety:5,ecology:2}, once:true, cat:"infrastructure" },

  // ─────────────────────────────────────────────────────────────────────────────
  // DIGITAL (55 decisions)
  // ─────────────────────────────────────────────────────────────────────────────

  // Basic
  { id:"wifi", name:"Wi-Fi в общественных местах", desc:"Бесплатный Wi-Fi в парках и на остановках.", cost:50, effects:{digital:4,culture:1}, cat:"digital" },
  { id:"city_app", name:"Мобильное приложение города", desc:"Приложение с расписаниями, новостями, жалобами.", cost:40, effects:{digital:3,infrastructure:1}, once:true, cat:"digital" },
  { id:"qr_navigation", name:"QR-навигация", desc:"QR-коды на остановках и достопримечательностях.", cost:20, effects:{digital:2,culture:1}, once:true, cat:"digital" },
  { id:"digital_payments", name:"Безналичная оплата", desc:"Терминалы оплаты в транспорте и учреждениях.", cost:35, effects:{digital:3,economy:1}, once:true, cat:"digital" },
  { id:"website_redesign", name:"Новый сайт администрации", desc:"Современный сайт с госуслугами.", cost:25, effects:{digital:3,culture:1}, once:true, cat:"digital" },
  { id:"social_media", name:"SMM-отдел", desc:"Команда по соцсетям администрации.", cost:20, effects:{digital:2,culture:2}, cat:"digital" },
  { id:"computer_classes", name:"Компьютерные курсы", desc:"Курсы для пожилых жителей.", cost:15, effects:{digital:2,education:1,healthcare:1}, cat:"digital" },
  { id:"free_ebooks", name:"Электронные книги", desc:"Бесплатный доступ к электронной библиотеке.", cost:15, effects:{digital:1,education:2,culture:1}, cat:"digital" },
  { id:"open_data", name:"Открытые данные", desc:"Портал открытых данных города.", cost:20, effects:{digital:3,economy:1}, once:true, cat:"digital" },

  // Standard
  { id:"digital_library", name:"Цифровая библиотека", desc:"Онлайн-каталог и электронные читальные залы.", cost:55, effects:{education:5,digital:3,culture:2}, cat:"digital" },
  { id:"cctv_analytics", name:"Видеоаналитика", desc:"AI-анализ камер наблюдения.", cost:70, effects:{digital:4,safety:4}, requires:{safety:25}, cat:"digital" },
  { id:"iot_sensors", name:"IoT-датчики", desc:"Датчики качества воздуха и шума.", cost:60, effects:{digital:4,ecology:2,healthcare:1}, cat:"digital" },
  { id:"e_document", name:"Электронный документооборот", desc:"Перевод документов в цифру.", cost:50, effects:{digital:4,economy:1}, once:true, cat:"digital" },
  { id:"digital_queue", name:"Электронная очередь", desc:"Электронная запись в учреждения.", cost:30, effects:{digital:3,healthcare:1}, once:true, cat:"digital" },
  { id:"cybersecurity", name:"Кибербезопасность", desc:"Система защиты данных.", cost:60, effects:{digital:3,safety:3}, once:true, cat:"digital" },
  { id:"smart_meters", name:"Умные счётчики", desc:"Дистанционный учёт ресурсов.", cost:70, effects:{digital:4,infrastructure:2,ecology:1}, once:true, cat:"digital" },
  { id:"gis_system", name:"ГИС-система", desc:"Геоинформационная система города.", cost:55, effects:{digital:4,infrastructure:2}, once:true, cat:"digital" },
  { id:"chatbot", name:"Чат-бот администрации", desc:"AI-помощник для жителей.", cost:25, effects:{digital:3,culture:1}, once:true, cat:"digital" },
  { id:"digital_twin_basic", name:"Цифровой двойник (базовый)", desc:"3D-модель города для планирования.", cost:80, effects:{digital:5,infrastructure:2}, once:true, requires:{digital:30}, cat:"digital" },

  // Advanced
  { id:"fiber", name:"Оптоволокно во все районы", desc:"Высокоскоростной интернет.", cost:160, effects:{digital:10,economy:2,infrastructure:1}, once:true, cat:"digital", unlocks:["smart_city"] },
  { id:"smart_city", name:"Платформа «Умный Звенигород»", desc:"Единая цифровая платформа городских сервисов.", cost:130, effects:{digital:8,infrastructure:2,safety:2}, once:true, requires:{digital:30}, cat:"digital", unlocks:["ai_city"] },
  { id:"smart_lighting", name:"Умное освещение", desc:"Адаптивное уличное освещение.", cost:100, effects:{digital:4,safety:3,ecology:2,infrastructure:1}, once:true, requires:{digital:25}, cat:"digital" },
  { id:"smart_parking", name:"Умные парковки", desc:"Система поиска свободных мест.", cost:80, effects:{digital:4,infrastructure:3,economy:1}, once:true, requires:{digital:30}, cat:"digital" },
  { id:"smart_waste", name:"Умный сбор мусора", desc:"Оптимизация маршрутов мусоровозов.", cost:70, effects:{digital:3,ecology:3,infrastructure:1}, once:true, requires:{digital:25}, cat:"digital" },
  { id:"telehealth_platform", name:"Телемедицинская платформа", desc:"Онлайн-консультации врачей.", cost:100, effects:{digital:4,healthcare:5}, once:true, requires:{digital:35}, cat:"digital" },
  { id:"ed_tech_platform", name:"Образовательная платформа", desc:"Онлайн-обучение для школьников.", cost:80, effects:{digital:4,education:5}, once:true, requires:{digital:30}, cat:"digital" },
  { id:"blockchain_registry", name:"Блокчейн-реестр", desc:"Блокчейн для земельных и имущественных данных.", cost:100, effects:{digital:5,safety:2,economy:1}, once:true, requires:{digital:45}, cat:"digital" },
  { id:"5g_network", name:"Пилотная 5G-сеть", desc:"5G на центральных улицах.", cost:120, effects:{digital:7,economy:2}, once:true, requires:{digital:40}, cat:"digital" },
  { id:"traffic_ai", name:"AI-управление трафиком", desc:"ИИ-оптимизация дорожного движения.", cost:110, effects:{digital:5,infrastructure:4,safety:2}, once:true, requires:{digital:40}, cat:"digital" },

  // Mega
  { id:"ai_city", name:"AI-система управления", desc:"Искусственный интеллект оптимизирует городские процессы.", cost:160, effects:{digital:6,safety:3,economy:2}, once:true, requires:{digital:60}, cat:"digital" },
  { id:"digital_twin_full", name:"Полный цифровой двойник", desc:"Симуляция всех городских систем в реальном времени.", cost:250, effects:{digital:10,infrastructure:4,safety:2,economy:2}, once:true, requires:{digital:65}, cat:"digital" },
  { id:"autonomous_transport", name:"Автономный транспорт", desc:"Беспилотные маршрутки.", cost:300, effects:{digital:8,infrastructure:6,safety:2,economy:3}, once:true, requires:{digital:70}, cat:"digital" },
  { id:"city_brain", name:"«Мозг города»", desc:"Единый центр управления всеми системами.", cost:200, effects:{digital:8,infrastructure:3,safety:4}, once:true, requires:{digital:65}, cat:"digital" },

  // Repeatable
  { id:"it_training", name:"IT-обучение сотрудников", desc:"Повышение квалификации чиновников.", cost:25, effects:{digital:2,education:1}, cat:"digital" },
  { id:"hackathon", name:"Городской хакатон", desc:"Соревнование разработчиков.", cost:20, effects:{digital:2,culture:1,economy:1}, cat:"digital" },
  { id:"digital_festival", name:"Фестиваль цифровых технологий", desc:"Выставка инноваций для жителей.", cost:30, effects:{digital:2,culture:2,education:1}, cat:"digital" },
  { id:"server_upgrade", name:"Обновление серверов", desc:"Новые серверы для муниципальных систем.", cost:40, effects:{digital:3,safety:1}, cat:"digital" },
  { id:"software_licenses", name:"Обновление ПО", desc:"Лицензии на новое программное обеспечение.", cost:25, effects:{digital:2}, cat:"digital" },

  // Late-game
  { id:"drone_delivery", name:"Дроны-курьеры", desc:"Пилотный проект доставки дронами.", cost:80, effects:{digital:5,economy:3,safety:-1}, requires:{digital:50}, cat:"digital" },
  { id:"ar_tourism", name:"AR-туризм", desc:"Дополненная реальность для туристов.", cost:60, effects:{digital:3,culture:4,economy:2}, requires:{digital:40}, once:true, cat:"digital" },
  { id:"smart_benches", name:"Умные скамейки", desc:"Скамейки с зарядкой и Wi-Fi.", cost:35, effects:{digital:2,infrastructure:1,culture:1}, cat:"digital" },
  { id:"robot_guide", name:"Робот-экскурсовод", desc:"Робот для туристов у монастыря.", cost:50, effects:{digital:3,culture:2}, once:true, requires:{digital:35}, cat:"digital" },
  { id:"data_center", name:"Мини-дата-центр", desc:"Локальный дата-центр города.", cost:120, effects:{digital:6,economy:2}, once:true, requires:{digital:45}, cat:"digital" },
  { id:"smart_playground", name:"Интерактивная площадка", desc:"Площадка с цифровыми играми.", cost:45, effects:{digital:2,education:2,culture:1}, cat:"digital" },

  // ─────────────────────────────────────────────────────────────────────────────
  // ECOLOGY (60 decisions)
  // ─────────────────────────────────────────────────────────────────────────────

  // Basic
  { id:"greening", name:"Озеленение улиц", desc:"Высадка деревьев на центральных улицах.", cost:45, effects:{ecology:5,culture:1}, cat:"ecology" },
  { id:"flower_beds", name:"Цветочные клумбы", desc:"Клумбы на центральных улицах.", cost:15, effects:{ecology:2,culture:2}, cat:"ecology" },
  { id:"bird_houses", name:"Скворечники", desc:"Скворечники и кормушки в парках.", cost:10, effects:{ecology:2,education:1}, cat:"ecology" },
  { id:"composting", name:"Программа компостирования", desc:"Городская программа компостирования.", cost:30, effects:{ecology:4,education:1}, cat:"ecology" },
  { id:"public_garden", name:"Общественный огород", desc:"Городские грядки для жителей.", cost:20, effects:{ecology:3,culture:2,healthcare:1}, cat:"ecology" },
  { id:"eco_education", name:"Уроки экологии", desc:"Экологические уроки в школах.", cost:15, effects:{ecology:2,education:2}, cat:"ecology" },
  { id:"anti_litter", name:"Кампания против мусора", desc:"Штрафы и просветительская кампания.", cost:10, effects:{ecology:2,safety:1}, cat:"ecology" },
  { id:"tree_nursery", name:"Городской питомник", desc:"Питомник саженцев для озеленения.", cost:25, effects:{ecology:3,economy:1}, once:true, cat:"ecology" },
  { id:"eco_bags", name:"Раздача эко-сумок", desc:"Бесплатные эко-сумки жителям.", cost:10, effects:{ecology:1,culture:1}, cat:"ecology" },
  { id:"rain_barrels", name:"Дождевые бочки", desc:"Сбор дождевой воды в парках.", cost:15, effects:{ecology:2,infrastructure:1}, cat:"ecology" },

  // Standard
  { id:"recycling", name:"Раздельный сбор мусора", desc:"Контейнеры и программа переработки.", cost:70, effects:{ecology:7,culture:1}, cat:"ecology" },
  { id:"park_river", name:"Парк у Москвы-реки", desc:"Реконструкция набережной с велодорожками.", cost:120, effects:{ecology:6,culture:3,safety:1}, cat:"ecology" },
  { id:"bike_sharing", name:"Велопрокат", desc:"Система городского велопроката.", cost:60, effects:{ecology:4,infrastructure:2,culture:2}, cat:"ecology" },
  { id:"river_cleanup", name:"Очистка Москвы-реки", desc:"Экологическая очистка реки.", cost:90, effects:{ecology:8,healthcare:2,culture:1}, cat:"ecology" },
  { id:"solar", name:"Солнечные панели", desc:"Панели на муниципальных зданиях.", cost:130, effects:{ecology:5,economy:2,digital:1}, cat:"ecology" },
  { id:"green_roof", name:"Зелёные крыши", desc:"Озеленение крыш муниципальных зданий.", cost:60, effects:{ecology:4,infrastructure:1}, cat:"ecology" },
  { id:"eco_patrol", name:"Экологический патруль", desc:"Контроль за соблюдением чистоты.", cost:30, effects:{ecology:3,safety:1}, cat:"ecology" },
  { id:"beekeeping", name:"Городские пасеки", desc:"Пасеки на крышах и в парках.", cost:20, effects:{ecology:3,education:1,culture:1}, cat:"ecology" },
  { id:"forest_protection", name:"Охрана леса", desc:"Патрулирование и противопожарная защита.", cost:40, effects:{ecology:4,safety:2}, cat:"ecology" },
  { id:"noise_barriers", name:"Шумозащитные экраны", desc:"Барьеры вдоль шумных дорог.", cost:50, effects:{ecology:3,healthcare:2}, cat:"ecology" },
  { id:"green_corridor", name:"Зелёный коридор", desc:"Аллея из деревьев через весь город.", cost:60, effects:{ecology:5,culture:2}, once:true, cat:"ecology" },
  { id:"pond_restoration", name:"Восстановление прудов", desc:"Очистка и благоустройство прудов.", cost:70, effects:{ecology:5,culture:2,healthcare:1}, once:true, cat:"ecology" },
  { id:"organic_market", name:"Органический рынок", desc:"Рынок экологически чистых продуктов.", cost:35, effects:{ecology:2,economy:2,healthcare:1}, cat:"ecology" },
  { id:"wetland_preserve", name:"Заповедная территория", desc:"Охрана заболоченных территорий.", cost:50, effects:{ecology:5,education:1}, once:true, cat:"ecology" },

  // Advanced
  { id:"water_treatment", name:"Очистные сооружения", desc:"Современные очистные для сточных вод.", cost:180, effects:{ecology:10,healthcare:2}, once:true, cat:"ecology" },
  { id:"electric_buses", name:"Электрические автобусы", desc:"Замена дизельных автобусов.", cost:180, effects:{ecology:6,infrastructure:4,digital:2}, once:true, cat:"ecology" },
  { id:"wind_turbine", name:"Ветрогенератор", desc:"Ветрогенератор на окраине города.", cost:150, effects:{ecology:6,digital:2,economy:1}, once:true, cat:"ecology" },
  { id:"recycling_plant", name:"Мусороперерабатывающий завод", desc:"Завод по переработке отходов.", cost:200, effects:{ecology:10,economy:3,infrastructure:2}, once:true, requires:{ecology:35}, cat:"ecology" },
  { id:"river_dam", name:"Малая ГЭС", desc:"Гидроэлектростанция на Москве-реке.", cost:180, effects:{ecology:5,infrastructure:3,economy:2,digital:1}, once:true, requires:{ecology:40}, cat:"ecology" },
  { id:"smart_irrigation", name:"Умная ирригация", desc:"Автополив парков с датчиками влажности.", cost:60, effects:{ecology:4,digital:2,infrastructure:1}, once:true, requires:{digital:25}, cat:"ecology" },
  { id:"air_monitoring", name:"Сеть мониторинга воздуха", desc:"Станции мониторинга по всему городу.", cost:80, effects:{ecology:5,digital:3,healthcare:2}, once:true, cat:"ecology" },
  { id:"heat_pumps", name:"Тепловые насосы", desc:"Геотермальное отопление зданий.", cost:150, effects:{ecology:6,infrastructure:3}, once:true, requires:{ecology:40}, cat:"ecology" },

  // Mega
  { id:"eco_route", name:"Эко-маршрут «Москва-река»", desc:"Пешеходно-велосипедный маршрут вдоль реки.", cost:90, effects:{ecology:5,culture:4}, once:true, requires:{ecology:50}, cat:"ecology" },
  { id:"zero_waste", name:"Город Zero Waste", desc:"Комплексная программа нулевых отходов.", cost:250, effects:{ecology:12,culture:3,economy:2}, once:true, requires:{ecology:60}, cat:"ecology" },
  { id:"eco_city_district", name:"Эко-район", desc:"Район с энергоэффективными домами.", cost:300, effects:{ecology:10,infrastructure:5,economy:3}, populationEffect:300, once:true, requires:{ecology:55}, cat:"ecology" },
  { id:"carbon_neutral", name:"Углеродная нейтральность", desc:"Программа полной компенсации выбросов.", cost:200, effects:{ecology:8,culture:3,digital:2}, once:true, requires:{ecology:65}, cat:"ecology" },

  // Repeatable
  { id:"tree_planting", name:"Посадка деревьев", desc:"Акция массовой посадки.", cost:20, effects:{ecology:3}, cat:"ecology" },
  { id:"spring_cleanup", name:"Весенний субботник", desc:"Общегородской субботник.", cost:10, effects:{ecology:2,culture:1}, cat:"ecology" },
  { id:"eco_fair", name:"Экологическая ярмарка", desc:"Ярмарка экотоваров и мастер-классы.", cost:15, effects:{ecology:1,culture:2,education:1}, cat:"ecology" },
  { id:"river_monitoring", name:"Мониторинг реки", desc:"Регулярный анализ воды.", cost:15, effects:{ecology:2,healthcare:1}, cat:"ecology" },
  { id:"park_maintenance", name:"Обслуживание парков", desc:"Стрижка, уход, ремонт дорожек.", cost:25, effects:{ecology:3,culture:1}, cat:"ecology" },
  { id:"wildlife_census", name:"Перепись фауны", desc:"Учёт диких животных и птиц.", cost:10, effects:{ecology:2,education:1}, cat:"ecology" },
  { id:"eco_stickers", name:"Экологическая маркировка", desc:"Маркировка экотоваров на рынке.", cost:5, effects:{ecology:1,culture:1}, cat:"ecology" },
  { id:"leaf_removal", name:"Уборка листвы", desc:"Механизированная уборка листвы осенью.", cost:15, effects:{ecology:2,infrastructure:1}, cat:"ecology" },

  // ─────────────────────────────────────────────────────────────────────────────
  // CULTURE (55 decisions)
  // ─────────────────────────────────────────────────────────────────────────────

  // Basic
  { id:"farmer_market", name:"Фермерский рынок", desc:"Еженедельный рынок на центральной площади.", cost:30, effects:{economy:3,culture:3,ecology:1}, cat:"culture" },
  { id:"street_art", name:"Стрит-арт проект", desc:"Муралы на фасадах зданий.", cost:15, effects:{culture:3,economy:1}, cat:"culture" },
  { id:"city_newspaper", name:"Городская газета", desc:"Еженедельная газета о жизни города.", cost:10, effects:{culture:2,education:1}, cat:"culture" },
  { id:"book_exchange", name:"Книгообмен", desc:"Уличные книжные шкафы.", cost:10, effects:{culture:2,education:1}, cat:"culture" },
  { id:"photo_contest", name:"Фотоконкурс", desc:"Конкурс «Мой Звенигород».", cost:10, effects:{culture:2}, cat:"culture" },
  { id:"local_heroes", name:"Доска почёта", desc:"Стенд с заслуженными жителями.", cost:10, effects:{culture:2,safety:1}, cat:"culture" },
  { id:"holiday_decorations", name:"Праздничное оформление", desc:"Украшение города к праздникам.", cost:20, effects:{culture:3,economy:1}, cat:"culture" },
  { id:"chess_tables", name:"Шахматные столы", desc:"Столы для шахмат в парках.", cost:10, effects:{culture:2,education:1}, cat:"culture" },
  { id:"walking_tours", name:"Пешеходные экскурсии", desc:"Бесплатные экскурсии по городу.", cost:10, effects:{culture:2,economy:1}, cat:"culture" },

  // Standard
  { id:"festival", name:"«Звенигородские вечера»", desc:"Фестиваль музыки и искусства.", cost:45, effects:{culture:6,economy:2,safety:-2}, cat:"culture" },
  { id:"branding", name:"Бренд «Город у реки»", desc:"Туристический бренд и маркетинговая кампания.", cost:65, effects:{culture:4,economy:4}, once:true, cat:"culture" },
  { id:"art_residence", name:"Арт-резиденция", desc:"Творческое пространство для художников.", cost:75, effects:{culture:5,education:1}, cat:"culture" },
  { id:"night_lighting", name:"Архитектурная подсветка", desc:"Подсветка исторических зданий.", cost:45, effects:{culture:4,safety:3,economy:1}, cat:"culture" },
  { id:"music_school", name:"Музыкальная школа", desc:"Бесплатная музыкальная школа.", cost:70, effects:{culture:5,education:4}, cat:"culture" },
  { id:"heritage_restoration", name:"Реставрация усадеб", desc:"Восстановление усадеб и памятников.", cost:150, effects:{culture:8,economy:3,education:1}, cat:"culture" },
  { id:"open_air_cinema", name:"Кинотеатр под открытым небом", desc:"Летний кинотеатр в парке.", cost:30, effects:{culture:3,economy:1}, cat:"culture" },
  { id:"craft_workshops", name:"Мастерские ремёсел", desc:"Кружки гончарного дела, столярки.", cost:40, effects:{culture:4,education:2,economy:1}, cat:"culture" },
  { id:"local_cuisine", name:"Фестиваль местной кухни", desc:"Гастрономический фестиваль.", cost:25, effects:{culture:3,economy:2}, cat:"culture" },
  { id:"historical_plaques", name:"Мемориальные таблички", desc:"Таблички на исторических зданиях.", cost:15, effects:{culture:2,education:1}, once:true, cat:"culture" },
  { id:"theater_group", name:"Народный театр", desc:"Любительская театральная труппа.", cost:30, effects:{culture:4,education:1}, cat:"culture" },
  { id:"city_museum", name:"Краеведческий музей", desc:"Экспозиция истории Звенигорода.", cost:80, effects:{culture:6,education:3,economy:1}, once:true, cat:"culture" },
  { id:"sculpture_park", name:"Парк скульптур", desc:"Скульптуры под открытым небом.", cost:50, effects:{culture:4,ecology:1}, once:true, cat:"culture" },
  { id:"folk_ensemble", name:"Фольклорный ансамбль", desc:"Городской ансамбль народного танца.", cost:25, effects:{culture:3,education:1}, cat:"culture" },
  { id:"summer_reading", name:"Летнее чтение", desc:"Программа чтения для детей и взрослых.", cost:10, effects:{culture:2,education:2}, cat:"culture" },
  { id:"bell_tower", name:"Восстановление колокольни", desc:"Реставрация колокольни.", cost:90, effects:{culture:6,economy:2}, once:true, cat:"culture" },
  { id:"souvenir_shop", name:"Сувенирная лавка", desc:"Муниципальная сувенирная лавка.", cost:20, effects:{culture:2,economy:2}, once:true, cat:"culture" },

  // Advanced
  { id:"monastery", name:"Реставрация монастыря", desc:"Восстановление Саввино-Сторожевского монастыря.", cost:120, effects:{culture:10,economy:3}, once:true, cat:"culture", unlocks:["tourism_cluster"] },
  { id:"concert_hall", name:"Концертный зал", desc:"Зал на 500 мест.", cost:180, effects:{culture:8,economy:3,education:1}, once:true, requires:{culture:40}, cat:"culture" },
  { id:"amphitheater", name:"Амфитеатр на реке", desc:"Открытая сцена на набережной.", cost:120, effects:{culture:7,economy:2,ecology:1}, once:true, cat:"culture" },
  { id:"art_gallery", name:"Художественная галерея", desc:"Постоянная галерея современного искусства.", cost:100, effects:{culture:6,education:2,economy:1}, once:true, requires:{culture:35}, cat:"culture" },
  { id:"creative_cluster", name:"Творческий кластер", desc:"Район для дизайнеров, художников, мастеров.", cost:150, effects:{culture:7,economy:4,digital:1}, once:true, requires:{culture:40}, cat:"culture" },
  { id:"cinema", name:"Современный кинотеатр", desc:"Мультиплекс на 3 зала.", cost:120, effects:{culture:5,economy:3,digital:1}, once:true, cat:"culture" },
  { id:"international_fest", name:"Международный фестиваль", desc:"Фестиваль с участием иностранных артистов.", cost:100, effects:{culture:7,economy:4}, requires:{culture:45}, cat:"culture" },

  // Mega
  { id:"tourism_cluster", name:"Туристический кластер", desc:"Комплексное развитие туризма у монастыря.", cost:200, effects:{culture:8,economy:6,infrastructure:-2}, once:true, requires:{culture:55}, cat:"culture" },
  { id:"unesco_bid", name:"Заявка в ЮНЕСКО", desc:"Номинация монастыря в список наследия.", cost:150, effects:{culture:12,economy:5}, once:true, requires:{culture:70}, cat:"culture" },
  { id:"theme_park", name:"Исторический тематический парк", desc:"Парк «Древний Звенигород».", cost:300, effects:{culture:10,economy:8,infrastructure:2}, populationEffect:200, once:true, requires:{culture:60}, cat:"culture" },

  // Repeatable
  { id:"city_day", name:"День города", desc:"Праздничные мероприятия.", cost:35, effects:{culture:4,economy:1}, cat:"culture" },
  { id:"jazz_evening", name:"Джазовый вечер", desc:"Джаз на набережной.", cost:15, effects:{culture:3}, cat:"culture" },
  { id:"poetry_slam", name:"Поэтический слэм", desc:"Поэтические вечера.", cost:10, effects:{culture:2,education:1}, cat:"culture" },
  { id:"art_exhibition", name:"Выставка картин", desc:"Выставка местных художников.", cost:15, effects:{culture:3,education:1}, cat:"culture" },
  { id:"film_screening", name:"Кинопоказ", desc:"Показ авторского кино.", cost:10, effects:{culture:2}, cat:"culture" },
  { id:"master_class", name:"Мастер-класс", desc:"Мастер-класс от приглашённого мастера.", cost:10, effects:{culture:2,education:1}, cat:"culture" },
  { id:"christmas_fair", name:"Рождественская ярмарка", desc:"Зимняя ярмарка с ёлкой.", cost:25, effects:{culture:4,economy:2}, cat:"culture" },
  { id:"summer_fest", name:"Летний фестиваль", desc:"Фестиваль на открытом воздухе.", cost:30, effects:{culture:4,economy:2,ecology:-1}, cat:"culture" },

  // ─────────────────────────────────────────────────────────────────────────────
  // HEALTHCARE (55 decisions)
  // ─────────────────────────────────────────────────────────────────────────────

  // Basic
  { id:"first_aid_kits", name:"Аптечки в общественных местах", desc:"Аптечки на остановках и в парках.", cost:10, effects:{healthcare:2,safety:1}, cat:"healthcare" },
  { id:"health_lectures", name:"Лекции о здоровье", desc:"Бесплатные лекции врачей.", cost:10, effects:{healthcare:2,education:1}, cat:"healthcare" },
  { id:"flu_vaccination", name:"Вакцинация от гриппа", desc:"Бесплатная сезонная вакцинация.", cost:20, effects:{healthcare:3,safety:1}, cat:"healthcare" },
  { id:"prevention", name:"Программа профилактики", desc:"Бесплатные медосмотры и вакцинация.", cost:55, effects:{healthcare:4,education:1}, cat:"healthcare" },
  { id:"defibrillators", name:"Дефибрилляторы", desc:"АНД в общественных местах.", cost:25, effects:{healthcare:2,safety:2}, once:true, cat:"healthcare" },
  { id:"health_app", name:"Приложение «Моё здоровье»", desc:"Мобильное приложение для записи к врачу.", cost:20, effects:{healthcare:2,digital:2}, once:true, cat:"healthcare" },
  { id:"vitamin_program", name:"Витамины для детей", desc:"Бесплатные витамины в детсадах.", cost:15, effects:{healthcare:2,education:1}, cat:"healthcare" },
  { id:"smoking_ban", name:"Запрет курения в парках", desc:"Зоны без курения.", cost:5, effects:{healthcare:1,ecology:1}, once:true, cat:"healthcare" },
  { id:"clean_water_dispensers", name:"Питьевые фонтанчики", desc:"Фонтанчики с чистой водой.", cost:15, effects:{healthcare:2,infrastructure:1}, cat:"healthcare" },

  // Standard
  { id:"ambulance", name:"Новые машины скорой", desc:"Обновление парка скорой помощи.", cost:90, effects:{healthcare:6,safety:2}, cat:"healthcare" },
  { id:"senior_center", name:"Центр активного долголетия", desc:"Центр для пожилых жителей.", cost:100, effects:{healthcare:5,culture:3,safety:1}, cat:"healthcare" },
  { id:"senior_bus", name:"Бесплатный автобус для пожилых", desc:"Бесплатный маршрут для пенсионеров.", cost:40, effects:{healthcare:3,safety:2,infrastructure:1}, cat:"healthcare" },
  { id:"dental_clinic", name:"Стоматологическая клиника", desc:"Муниципальная стоматология.", cost:80, effects:{healthcare:5,economy:1}, once:true, cat:"healthcare" },
  { id:"pharmacy_network", name:"Муниципальные аптеки", desc:"Сеть аптек с низкими ценами.", cost:60, effects:{healthcare:4,economy:1}, once:true, cat:"healthcare" },
  { id:"rehabilitation_center", name:"Реабилитационный центр", desc:"Центр восстановления после травм.", cost:100, effects:{healthcare:6,safety:1}, once:true, cat:"healthcare" },
  { id:"blood_bank", name:"Станция переливания крови", desc:"Муниципальный банк крови.", cost:50, effects:{healthcare:4,safety:1}, once:true, cat:"healthcare" },
  { id:"mental_health", name:"Психологическая помощь", desc:"Центр психологической помощи.", cost:60, effects:{healthcare:4,safety:2,education:1}, once:true, cat:"healthcare" },
  { id:"maternity_ward", name:"Родильное отделение", desc:"Модернизация роддома.", cost:100, effects:{healthcare:6,safety:1}, once:true, cat:"healthcare", populationEffect:100 },
  { id:"ambulance_station", name:"Подстанция скорой помощи", desc:"Дополнительная подстанция.", cost:70, effects:{healthcare:5,safety:2}, once:true, cat:"healthcare" },
  { id:"nursing_home", name:"Дом престарелых", desc:"Современный дом для пожилых.", cost:90, effects:{healthcare:5,safety:2}, once:true, cat:"healthcare" },
  { id:"mobile_clinic", name:"Мобильная клиника", desc:"Автомобиль-поликлиника для отдалённых районов.", cost:50, effects:{healthcare:4,infrastructure:1}, cat:"healthcare" },
  { id:"fitness_equipment", name:"Уличные тренажёры", desc:"Тренажёры в парках и дворах.", cost:25, effects:{healthcare:2,culture:1}, cat:"healthcare" },
  { id:"swimming_pool", name:"Бассейн", desc:"Муниципальный бассейн.", cost:120, effects:{healthcare:5,culture:3,education:1}, once:true, cat:"healthcare" },

  // Advanced
  { id:"clinic_upgrade", name:"Модернизация поликлиники", desc:"Новое оборудование и ремонт.", cost:200, effects:{healthcare:12,safety:1}, once:true, cat:"healthcare", unlocks:["telemedicine"] },
  { id:"telemedicine", name:"Телемедицина", desc:"Дистанционные консультации врачей.", cost:100, effects:{healthcare:6,digital:3}, once:true, requires:{healthcare:45}, cat:"healthcare" },
  { id:"sport_complex", name:"Спорткомплекс", desc:"Физкультурно-оздоровительный комплекс.", cost:200, effects:{healthcare:6,education:3,culture:3,safety:1}, once:true, cat:"healthcare" },
  { id:"mri_scanner", name:"МРТ-аппарат", desc:"Собственный МРТ в поликлинике.", cost:150, effects:{healthcare:8,digital:1}, once:true, requires:{healthcare:40}, cat:"healthcare" },
  { id:"cancer_screening", name:"Скрининг онкологии", desc:"Программа раннего выявления рака.", cost:80, effects:{healthcare:6}, once:true, requires:{healthcare:35}, cat:"healthcare" },
  { id:"children_hospital", name:"Детская больница", desc:"Отдельная детская больница.", cost:200, effects:{healthcare:10,education:2,safety:1}, once:true, requires:{healthcare:45}, cat:"healthcare" },

  // Mega
  { id:"medical_center", name:"Медицинский центр", desc:"Многопрофильный медицинский центр.", cost:300, effects:{healthcare:14,economy:3,digital:2}, once:true, requires:{healthcare:55}, cat:"healthcare" },
  { id:"health_resort", name:"Санаторий", desc:"Санаторий на берегу реки.", cost:250, effects:{healthcare:8,culture:4,economy:5}, once:true, requires:{healthcare:50,ecology:40}, cat:"healthcare" },

  // Repeatable
  { id:"health_fair", name:"День здоровья", desc:"Бесплатные анализы и консультации.", cost:15, effects:{healthcare:2,culture:1}, cat:"healthcare" },
  { id:"yoga_classes", name:"Бесплатная йога", desc:"Йога в парках.", cost:10, effects:{healthcare:2,culture:1}, cat:"healthcare" },
  { id:"sports_tournament", name:"Спортивный турнир", desc:"Городской турнир по футболу/волейболу.", cost:15, effects:{healthcare:2,culture:2}, cat:"healthcare" },
  { id:"healthy_food", name:"Здоровое питание в школах", desc:"Улучшение школьного меню.", cost:25, effects:{healthcare:3,education:1}, cat:"healthcare" },
  { id:"massage_program", name:"Массаж для пожилых", desc:"Бесплатный массаж в центре долголетия.", cost:10, effects:{healthcare:2}, cat:"healthcare" },
  { id:"running_event", name:"Городской забег", desc:"Массовый забег по набережной.", cost:15, effects:{healthcare:2,culture:2,economy:1}, cat:"healthcare" },

  // ─────────────────────────────────────────────────────────────────────────────
  // EDUCATION (55 decisions)
  // ─────────────────────────────────────────────────────────────────────────────

  // Basic
  { id:"school_supplies", name:"Канцтовары для школ", desc:"Бесплатные тетради и ручки.", cost:10, effects:{education:2}, cat:"education" },
  { id:"scholarships", name:"Стипендии для студентов", desc:"Муниципальные стипендии.", cost:45, effects:{education:4,culture:1}, cat:"education" },
  { id:"tutoring", name:"Бесплатное репетиторство", desc:"Репетиторы для отстающих учеников.", cost:20, effects:{education:3}, cat:"education" },
  { id:"school_library", name:"Школьные библиотеки", desc:"Обновление книжных фондов.", cost:15, effects:{education:2,culture:1}, cat:"education" },
  { id:"parental_lectures", name:"Лекции для родителей", desc:"Курсы по детской психологии.", cost:10, effects:{education:2,healthcare:1}, cat:"education" },
  { id:"science_olympiad", name:"Олимпиады", desc:"Подготовка к предметным олимпиадам.", cost:15, effects:{education:3}, cat:"education" },
  { id:"language_courses", name:"Языковые курсы", desc:"Бесплатные курсы иностранных языков.", cost:20, effects:{education:3,culture:1}, cat:"education" },
  { id:"chess_club", name:"Шахматный клуб", desc:"Кружок шахмат для детей.", cost:10, effects:{education:2,culture:1}, cat:"education" },
  { id:"reading_marathon", name:"Марафон чтения", desc:"Конкурс на самого читающего класса.", cost:5, effects:{education:1,culture:1}, cat:"education" },

  // Standard
  { id:"school_repair", name:"Ремонт школ", desc:"Капитальный ремонт и оборудование.", cost:130, effects:{education:8,safety:2}, cat:"education", unlocks:["stem_lab"] },
  { id:"it_classes", name:"IT-классы в школах", desc:"Робототехника и программирование.", cost:75, effects:{education:5,digital:3}, cat:"education" },
  { id:"youth_center", name:"Молодёжный центр", desc:"Площадка для кружков и мероприятий.", cost:80, effects:{education:4,culture:4,safety:2}, cat:"education" },
  { id:"art_school", name:"Художественная школа", desc:"Школа рисования и дизайна.", cost:60, effects:{education:4,culture:3}, once:true, cat:"education" },
  { id:"robotics_lab", name:"Лаборатория робототехники", desc:"Кружок робототехники.", cost:50, effects:{education:4,digital:2}, cat:"education" },
  { id:"sports_school", name:"Спортивная школа", desc:"ДЮСШ с профессиональными тренерами.", cost:80, effects:{education:4,healthcare:3,culture:1}, once:true, cat:"education" },
  { id:"eco_lab", name:"Экологическая лаборатория", desc:"Школьная лаборатория экологии.", cost:40, effects:{education:3,ecology:2}, cat:"education" },
  { id:"teachers_housing", name:"Жильё для учителей", desc:"Служебные квартиры для педагогов.", cost:100, effects:{education:6,infrastructure:1}, once:true, cat:"education" },
  { id:"school_canteen", name:"Модернизация столовых", desc:"Ремонт школьных столовых.", cost:50, effects:{education:3,healthcare:2}, cat:"education" },
  { id:"exchange_program", name:"Программа обмена", desc:"Обмен учениками с другими городами.", cost:30, effects:{education:3,culture:2}, cat:"education" },
  { id:"mobile_planetarium", name:"Мобильный планетарий", desc:"Передвижной планетарий для школ.", cost:25, effects:{education:3,culture:1}, cat:"education" },
  { id:"stem_camp", name:"STEM-лагерь", desc:"Летний лагерь с научной программой.", cost:35, effects:{education:3,digital:1}, cat:"education" },
  { id:"adult_education", name:"Курсы для взрослых", desc:"Вечерние курсы переквалификации.", cost:40, effects:{education:3,economy:2}, cat:"education" },

  // Advanced
  { id:"kindergarten", name:"Новый детский сад", desc:"Детский сад на 120 мест.", cost:170, effects:{education:6,safety:1}, once:true, populationEffect:150, cat:"education" },
  { id:"stem_lab", name:"IT-академия для подростков", desc:"Продвинутый центр IT-образования.", cost:130, effects:{education:6,digital:4}, once:true, requires:{education:50}, cat:"education" },
  { id:"university_branch", name:"Филиал вуза", desc:"Филиал московского университета.", cost:200, effects:{education:10,economy:3,digital:2}, once:true, requires:{education:55}, cat:"education" },
  { id:"innovation_lab", name:"Инновационная лаборатория", desc:"Лаборатория для экспериментов.", cost:100, effects:{education:5,digital:3,economy:1}, once:true, requires:{education:40}, cat:"education" },
  { id:"inclusive_school", name:"Инклюзивная школа", desc:"Школа для детей с ОВЗ.", cost:120, effects:{education:6,healthcare:2,safety:1}, once:true, cat:"education" },
  { id:"digital_school", name:"Цифровая школа", desc:"Школа с полным цифровым оснащением.", cost:150, effects:{education:7,digital:5}, once:true, requires:{digital:35}, cat:"education" },

  // Mega
  { id:"science_center", name:"Научный центр", desc:"Интерактивный научный центр для детей.", cost:200, effects:{education:8,culture:4,digital:2}, once:true, requires:{education:50}, cat:"education" },
  { id:"campus", name:"Студенческий кампус", desc:"Кампус при филиале вуза.", cost:250, effects:{education:10,economy:4,culture:3}, populationEffect:300, once:true, requires:{education:60}, cat:"education" },

  // Repeatable
  { id:"teacher_bonus", name:"Премии учителям", desc:"Квартальные премии лучшим педагогам.", cost:20, effects:{education:2}, cat:"education" },
  { id:"science_fair", name:"Научная ярмарка", desc:"Выставка школьных проектов.", cost:15, effects:{education:2,culture:1}, cat:"education" },
  { id:"career_day", name:"День профессий", desc:"Встречи с представителями профессий.", cost:10, effects:{education:2,economy:1}, cat:"education" },
  { id:"book_donation", name:"Сбор книг", desc:"Акция сбора книг для библиотек.", cost:5, effects:{education:1,culture:1}, cat:"education" },
  { id:"parent_meeting", name:"Родительское собрание", desc:"Городское собрание по образованию.", cost:5, effects:{education:1}, cat:"education" },
  { id:"school_bus", name:"Школьный автобус", desc:"Маршрут для отдалённых районов.", cost:30, effects:{education:3,safety:1,infrastructure:1}, cat:"education" },

  // ─────────────────────────────────────────────────────────────────────────────
  // SAFETY (50 decisions)
  // ─────────────────────────────────────────────────────────────────────────────

  // Basic
  { id:"patrol", name:"Народная дружина", desc:"Добровольные дружины.", cost:25, effects:{safety:3,culture:1}, cat:"safety" },
  { id:"street_lights", name:"Уличное освещение", desc:"LED-фонари на тёмных улицах.", cost:65, effects:{safety:5,infrastructure:1}, cat:"safety" },
  { id:"crosswalk_upgrade", name:"Освещённые пешеходные переходы", desc:"Подсветка переходов у школ.", cost:20, effects:{safety:3,infrastructure:1}, cat:"safety" },
  { id:"safety_signs", name:"Знаки безопасности", desc:"Предупреждающие знаки в опасных местах.", cost:10, effects:{safety:2}, cat:"safety" },
  { id:"emergency_phones", name:"Телефоны экстренной связи", desc:"Стойки SOS на улицах.", cost:15, effects:{safety:2,digital:1}, cat:"safety" },
  { id:"safety_lecture", name:"Уроки безопасности", desc:"Лекции по ОБЖ для жителей.", cost:10, effects:{safety:2,education:1}, cat:"safety" },
  { id:"reflective_vests", name:"Светоотражающие жилеты", desc:"Бесплатные жилеты для пешеходов.", cost:5, effects:{safety:1,infrastructure:1}, cat:"safety" },
  { id:"dog_catchers", name:"Отлов бродячих собак", desc:"Гуманный отлов и стерилизация.", cost:20, effects:{safety:3,ecology:1}, cat:"safety" },
  { id:"ice_prevention", name:"Антигололёдная обработка", desc:"Обработка тротуаров зимой.", cost:15, effects:{safety:2,healthcare:1}, cat:"safety" },

  // Standard
  { id:"cameras", name:"Умные камеры", desc:"Видеонаблюдение с аналитикой.", cost:90, effects:{safety:8,digital:2}, cat:"safety" },
  { id:"fire_station", name:"Модернизация пожарной части", desc:"Новая техника и расширение депо.", cost:90, effects:{safety:7,infrastructure:1}, once:true, cat:"safety" },
  { id:"emergency_center", name:"Центр МЧС", desc:"Новый пост МЧС с современным оснащением.", cost:120, effects:{safety:8,infrastructure:2}, once:true, cat:"safety" },
  { id:"police_station", name:"Новый участок полиции", desc:"Дополнительный полицейский участок.", cost:80, effects:{safety:6,infrastructure:1}, once:true, cat:"safety" },
  { id:"alarm_system", name:"Система оповещения", desc:"Громкоговорители и сирены.", cost:50, effects:{safety:4,infrastructure:1}, once:true, cat:"safety" },
  { id:"fire_hydrants", name:"Пожарные гидранты", desc:"Установка и проверка гидрантов.", cost:30, effects:{safety:3,infrastructure:1}, cat:"safety" },
  { id:"traffic_police", name:"Дорожная полиция", desc:"Усиление дорожного контроля.", cost:40, effects:{safety:4,infrastructure:1}, cat:"safety" },
  { id:"disaster_drill", name:"Учебная эвакуация", desc:"Тренировка населения.", cost:15, effects:{safety:3,education:1}, cat:"safety" },
  { id:"neighborhood_watch", name:"Соседский дозор", desc:"Программа наблюдения жителями.", cost:15, effects:{safety:3,culture:1}, cat:"safety" },
  { id:"safe_school", name:"Безопасная школа", desc:"Охрана и турникеты в школах.", cost:40, effects:{safety:4,education:1}, cat:"safety" },
  { id:"shelter", name:"Пункт обогрева", desc:"Пункт обогрева для бездомных.", cost:20, effects:{safety:2,healthcare:1}, cat:"safety" },
  { id:"rescue_boat", name:"Спасательный катер", desc:"Катер для спасения на реке.", cost:40, effects:{safety:3}, once:true, cat:"safety" },
  { id:"flood_alarm", name:"Система раннего оповещения о паводке", desc:"Датчики уровня воды.", cost:30, effects:{safety:3,digital:1}, once:true, cat:"safety" },

  // Advanced
  { id:"surveillance_center", name:"Ситуационный центр", desc:"Центральный пункт мониторинга.", cost:150, effects:{safety:8,digital:4}, once:true, requires:{safety:35}, cat:"safety" },
  { id:"fireproof_buildings", name:"Огнезащита зданий", desc:"Обработка деревянных зданий.", cost:80, effects:{safety:5,infrastructure:2}, once:true, cat:"safety" },
  { id:"bomb_shelter", name:"Укрытия ГО", desc:"Модернизация гражданских убежищ.", cost:100, effects:{safety:6,infrastructure:2}, once:true, cat:"safety" },
  { id:"riot_equipment", name:"Спецтехника", desc:"Техника для ликвидации ЧС.", cost:100, effects:{safety:6}, once:true, cat:"safety" },
  { id:"forensic_lab", name:"Криминалистическая лаборатория", desc:"Лаборатория при полиции.", cost:80, effects:{safety:5,digital:1}, once:true, requires:{safety:40}, cat:"safety" },
  { id:"smart_911", name:"Умная система 112", desc:"AI-маршрутизация экстренных вызовов.", cost:100, effects:{safety:6,digital:3}, once:true, requires:{digital:35}, cat:"safety" },

  // Mega
  { id:"safe_city", name:"Программа «Безопасный город»", desc:"Комплексная программа безопасности.", cost:250, effects:{safety:12,digital:4,infrastructure:2}, once:true, requires:{safety:50}, cat:"safety" },

  // Repeatable
  { id:"community_patrol", name:"Рейд дружинников", desc:"Усиленное патрулирование.", cost:10, effects:{safety:2}, cat:"safety" },
  { id:"fire_check", name:"Проверка пожарной безопасности", desc:"Проверка зданий.", cost:10, effects:{safety:2}, cat:"safety" },
  { id:"self_defense", name:"Курсы самообороны", desc:"Бесплатные курсы для жителей.", cost:10, effects:{safety:2,education:1}, cat:"safety" },
  { id:"night_patrol", name:"Ночное патрулирование", desc:"Усиленный патруль в тёмное время.", cost:15, effects:{safety:3}, cat:"safety" },
  { id:"road_safety_campaign", name:"Кампания «Безопасная дорога»", desc:"Просветительская кампания.", cost:10, effects:{safety:2,education:1}, cat:"safety" },

  // ─────────────────────────────────────────────────────────────────────────────
  // ECONOMY (55 decisions)
  // ─────────────────────────────────────────────────────────────────────────────

  // Basic
  { id:"food_delivery", name:"Партнёрство с доставкой", desc:"Городская программа поддержки локальной доставки.", cost:35, effects:{economy:4,digital:2}, cat:"economy" },
  { id:"market_days", name:"Торговые дни", desc:"Ежемесячные ярмарки для предпринимателей.", cost:15, effects:{economy:2,culture:1}, cat:"economy" },
  { id:"business_consulting", name:"Бесплатные консультации", desc:"Юридические консультации для бизнеса.", cost:10, effects:{economy:2}, cat:"economy" },
  { id:"startup_grants", name:"Микрогранты стартапам", desc:"Гранты до 100 тыс. рублей.", cost:30, effects:{economy:3,digital:1}, cat:"economy" },
  { id:"job_fair", name:"Ярмарка вакансий", desc:"Городская ярмарка вакансий.", cost:10, effects:{economy:2,education:1}, cat:"economy" },
  { id:"advertising_boards", name:"Рекламные щиты", desc:"Муниципальная реклама для бизнеса.", cost:15, effects:{economy:2,culture:-1}, cat:"economy" },
  { id:"tourist_signs", name:"Туристические указатели", desc:"Навигация для туристов.", cost:15, effects:{economy:2,culture:1}, once:true, cat:"economy" },
  { id:"business_directory", name:"Каталог бизнесов", desc:"Онлайн-каталог городских бизнесов.", cost:10, effects:{economy:2,digital:1}, once:true, cat:"economy" },

  // Standard
  { id:"small_biz_grants", name:"Гранты малому бизнесу", desc:"Программа грантов.", cost:75, effects:{economy:7,digital:1}, cat:"economy" },
  { id:"coworking", name:"Муниципальный коворкинг", desc:"Рабочее пространство для фрилансеров.", cost:75, effects:{digital:4,economy:4,culture:2}, cat:"economy" },
  { id:"hotel", name:"Гостиница", desc:"Муниципальная гостиница для туристов.", cost:120, effects:{economy:6,culture:2}, once:true, cat:"economy" },
  { id:"trade_center", name:"Торговый центр", desc:"Небольшой ТЦ на окраине.", cost:100, effects:{economy:6,infrastructure:1}, once:true, cat:"economy" },
  { id:"food_court", name:"Фуд-корт", desc:"Площадка общественного питания.", cost:50, effects:{economy:4,culture:2}, once:true, cat:"economy" },
  { id:"craft_brewery", name:"Крафтовая пивоварня", desc:"Поддержка местной пивоварни.", cost:40, effects:{economy:4,culture:2}, once:true, cat:"economy" },
  { id:"farm_store", name:"Фермерский магазин", desc:"Магазин местных продуктов.", cost:30, effects:{economy:3,ecology:1}, cat:"economy" },
  { id:"bank_branch", name:"Отделение банка", desc:"Привлечение банка в город.", cost:20, effects:{economy:3,digital:1}, once:true, cat:"economy" },
  { id:"taxi_service", name:"Муниципальное такси", desc:"Доступное такси для жителей.", cost:50, effects:{economy:3,infrastructure:2}, cat:"economy" },
  { id:"conference_hall", name:"Конференц-зал", desc:"Зал для бизнес-мероприятий.", cost:80, effects:{economy:4,culture:1,digital:1}, once:true, cat:"economy" },
  { id:"warehouse_zone", name:"Складская зона", desc:"Территория для складов.", cost:60, effects:{economy:4,infrastructure:1}, once:true, cat:"economy" },
  { id:"agro_cluster", name:"Агрокластер", desc:"Поддержка местных фермеров.", cost:80, effects:{economy:5,ecology:2}, once:true, cat:"economy" },

  // Advanced
  { id:"logistics_hub", name:"Логистический хаб", desc:"Транспортно-логистический центр.", cost:150, effects:{economy:8,infrastructure:3,ecology:-2}, once:true, cat:"economy" },
  { id:"it_tax_breaks", name:"Налоговые льготы для IT", desc:"Налоговые каникулы для IT-компаний.", cost:50, effects:{economy:6,digital:3}, recurringIncome:{base:0,maintenance:40,decayPerTurn:0}, once:true, cat:"economy", unlocks:["technopark"] },
  { id:"startup_incubator", name:"Бизнес-инкубатор", desc:"Инкубатор для стартапов при технопарке.", cost:100, effects:{economy:6,digital:4,education:2}, requires:{economy:40}, cat:"economy" },
  { id:"industrial_zone", name:"Индустриальный парк", desc:"Подготовленная промзона.", cost:150, effects:{economy:8,infrastructure:2,ecology:-3}, once:true, requires:{economy:35}, cat:"economy" },
  { id:"free_trade_zone", name:"Свободная экономическая зона", desc:"Налоговые льготы на территории.", cost:100, effects:{economy:7,digital:1}, once:true, requires:{economy:45}, cat:"economy" },
  { id:"export_center", name:"Центр экспорта", desc:"Помощь бизнесу с экспортом.", cost:80, effects:{economy:5,digital:2}, once:true, requires:{economy:40}, cat:"economy" },
  { id:"venture_fund", name:"Венчурный фонд", desc:"Муниципальный венчурный фонд.", cost:120, effects:{economy:6,digital:3}, once:true, requires:{economy:50}, cat:"economy" },

  // Mega
  { id:"technopark", name:"Технопарк «Звенигород-Тех»", desc:"Технологический парк для IT и стартапов.", cost:250, effects:{economy:10,digital:6}, once:true, requires:{economy:50,digital:45}, cat:"economy" },
  { id:"special_economic_zone", name:"Особая экономическая зона", desc:"ОЭЗ с федеральными льготами.", cost:300, effects:{economy:12,infrastructure:4,digital:3}, once:true, requires:{economy:60}, cat:"economy" },
  { id:"international_hub", name:"Международный бизнес-центр", desc:"Центр для иностранных компаний.", cost:250, effects:{economy:10,digital:4,culture:2}, once:true, requires:{economy:65,digital:50}, cat:"economy" },

  // Repeatable
  { id:"business_training", name:"Бизнес-тренинги", desc:"Тренинги для предпринимателей.", cost:15, effects:{economy:2,education:1}, cat:"economy" },
  { id:"investment_forum", name:"Инвестиционный форум", desc:"Презентация города инвесторам.", cost:30, effects:{economy:3,culture:1}, cat:"economy" },
  { id:"shop_renovation", name:"Программа ремонта магазинов", desc:"Субсидии на ремонт фасадов.", cost:25, effects:{economy:2,culture:1,infrastructure:1}, cat:"economy" },
  { id:"networking_event", name:"Бизнес-нетворкинг", desc:"Встреча предпринимателей.", cost:10, effects:{economy:2}, cat:"economy" },
  { id:"product_expo", name:"Выставка местных товаров", desc:"Выставка-продажа местных товаров.", cost:20, effects:{economy:3,culture:1}, cat:"economy" },

  // ─────────────────────────────────────────────────────────────────────────────
  // TRADEOFF (50 decisions)
  // ─────────────────────────────────────────────────────────────────────────────

  // Economy vs Ecology
  { id:"factory", name:"Завод на окраине", desc:"Рабочие места ценой экологии.", cost:100, effects:{economy:10,ecology:-10}, populationEffect:300, recurringIncome:{base:50,maintenance:20,decayPerTurn:2}, once:true, cat:"tradeoff" },
  { id:"quarry", name:"Каменный карьер", desc:"Карьер даёт доход, но портит ландшафт.", cost:60, effects:{economy:6,ecology:-8,infrastructure:2}, recurringIncome:{base:30,maintenance:10,decayPerTurn:1}, once:true, cat:"tradeoff" },
  { id:"logging", name:"Санитарная вырубка", desc:"Продажа древесины из городского леса.", cost:10, effects:{economy:4,ecology:-6}, cat:"tradeoff" },
  { id:"chemical_plant", name:"Химическое производство", desc:"Высокодоходное, но грязное производство.", cost:120, effects:{economy:12,ecology:-12,healthcare:-3}, populationEffect:200, recurringIncome:{base:60,maintenance:25,decayPerTurn:2}, once:true, cat:"tradeoff" },
  { id:"oil_depot", name:"Нефтебаза", desc:"Топливный склад — доход и риски.", cost:80, effects:{economy:8,ecology:-6,safety:-3}, recurringIncome:{base:40,maintenance:15,decayPerTurn:1}, once:true, cat:"tradeoff" },
  { id:"intensive_farming", name:"Интенсивное земледелие", desc:"Высокий урожай, истощение почвы.", cost:40, effects:{economy:5,ecology:-5,healthcare:-1}, cat:"tradeoff" },
  { id:"waste_import", name:"Приём мусора из Москвы", desc:"Москва платит, но мусор копится.", cost:0, effects:{economy:8,ecology:-10,healthcare:-2}, recurringIncome:{base:50,maintenance:10,decayPerTurn:3}, once:true, cat:"tradeoff" },

  // Infrastructure vs Ecology
  { id:"luxury_housing", name:"Элитный ЖК", desc:"Доход для бюджета, нагрузка на инфраструктуру.", cost:80, effects:{economy:6,ecology:-5,infrastructure:-4}, cat:"tradeoff" },
  { id:"parking_lots", name:"Вырубка леса под парковки", desc:"Больше парковок за счёт зелёных зон.", cost:50, effects:{infrastructure:6,ecology:-12}, cat:"tradeoff" },
  { id:"highway_through_park", name:"Дорога через парк", desc:"Прямая дорога, но через зелёную зону.", cost:80, effects:{infrastructure:8,ecology:-10,economy:2}, once:true, cat:"tradeoff" },
  { id:"concrete_riverbank", name:"Бетонная набережная", desc:"Прочная, но неэстетичная.", cost:70, effects:{infrastructure:6,safety:2,ecology:-5,culture:-3}, once:true, cat:"tradeoff" },

  // Economy vs Culture
  { id:"casino_zone", name:"Казино-зона", desc:"Огромный доход, но удар по культуре.", cost:130, effects:{economy:12,culture:-7,safety:-8}, recurringIncome:{base:60,maintenance:25,decayPerTurn:3}, once:true, cat:"tradeoff" },
  { id:"paid_parking", name:"Платные парковки в центре", desc:"Плата за парковку в историческом центре.", cost:25, effects:{economy:3,culture:-4}, recurringIncome:{base:20,maintenance:8,decayPerTurn:1}, once:true, cat:"tradeoff" },
  { id:"billboard_city", name:"Город рекламы", desc:"Баннеры везде — выручка, но уродство.", cost:10, effects:{economy:5,culture:-6}, recurringIncome:{base:25,maintenance:5,decayPerTurn:1}, once:true, cat:"tradeoff" },
  { id:"fast_food_chain", name:"Сеть фастфуда", desc:"Рабочие места, но вытесняет кафе.", cost:20, effects:{economy:5,culture:-3,healthcare:-1}, once:true, cat:"tradeoff" },
  { id:"sell_heritage", name:"Продажа памятника", desc:"Продать историческое здание под бизнес.", cost:0, effects:{economy:8,culture:-10}, once:true, cat:"tradeoff" },
  { id:"demolish_park", name:"Снос парка под ТЦ", desc:"Торговый центр вместо парка.", cost:50, effects:{economy:10,ecology:-12,culture:-5,infrastructure:3}, once:true, cat:"tradeoff" },

  // Safety vs Budget/Freedom
  { id:"total_surveillance", name:"Тотальная слежка", desc:"Камеры повсюду.", cost:120, effects:{safety:10,culture:-5,digital:2}, once:true, cat:"tradeoff" },
  { id:"curfew", name:"Комендантский час", desc:"Ночной комендантский час для подростков.", cost:10, effects:{safety:4,culture:-4,education:-1}, once:true, cat:"tradeoff" },
  { id:"fence_parks", name:"Ограждение парков", desc:"Заборы вокруг парков с охраной.", cost:30, effects:{safety:3,culture:-3,ecology:-1}, cat:"tradeoff" },
  { id:"ban_alcohol", name:"Запрет алкоголя на улицах", desc:"Штрафы за распитие.", cost:10, effects:{safety:3,healthcare:1,culture:-2,economy:-1}, once:true, cat:"tradeoff" },

  // Digital vs Privacy
  { id:"social_credit", name:"Система рейтинга жителей", desc:"Социальный рейтинг с бонусами.", cost:80, effects:{digital:6,safety:4,culture:-8}, once:true, requires:{digital:40}, cat:"tradeoff" },
  { id:"data_monetization", name:"Монетизация данных", desc:"Продажа анонимизированных данных.", cost:10, effects:{economy:6,digital:2,culture:-4}, recurringIncome:{base:30,maintenance:5,decayPerTurn:1}, once:true, cat:"tradeoff" },

  // Healthcare vs Economy
  { id:"pharma_deal", name:"Контракт с фармкомпанией", desc:"Эксклюзивный контракт — дешёвые лекарства, но зависимость.", cost:0, effects:{healthcare:5,economy:-3}, once:true, cat:"tradeoff" },
  { id:"mandatory_testing", name:"Обязательное тестирование", desc:"Принудительные медосмотры.", cost:40, effects:{healthcare:5,safety:2,culture:-3}, once:true, cat:"tradeoff" },

  // Education vs Budget
  { id:"elite_school", name:"Элитная гимназия", desc:"Гимназия для талантливых, но элитарная.", cost:150, effects:{education:10,culture:-3,safety:-1}, once:true, cat:"tradeoff" },
  { id:"military_school", name:"Военно-патриотическая школа", desc:"Дисциплина и патриотизм.", cost:80, effects:{education:5,safety:4,culture:-4}, once:true, cat:"tradeoff" },

  // Short-term vs Long-term
  { id:"emergency_loan", name:"Экстренный кредит", desc:"Быстрые деньги под высокий процент.", cost:0, effects:{}, recurringIncome:{base:-30,maintenance:0,decayPerTurn:0}, once:true, cat:"tradeoff" },
  { id:"sell_land", name:"Продажа земли", desc:"Одноразовый доход — продажа участка.", cost:0, effects:{economy:3,ecology:-3}, cat:"tradeoff" },
  { id:"postpone_repairs", name:"Отложить ремонт", desc:"Экономия сейчас, проблемы потом.", cost:0, effects:{infrastructure:-4,economy:2}, cat:"tradeoff" },
  { id:"unpaid_overtime", name:"Неоплачиваемые переработки", desc:"Чиновники работают бесплатно сверхурочно.", cost:0, effects:{economy:2,safety:-1,healthcare:-1}, cat:"tradeoff" },
  { id:"lottery", name:"Городская лотерея", desc:"Лотерея — доход, но азартные игры.", cost:10, effects:{economy:4,culture:-2}, recurringIncome:{base:15,maintenance:5,decayPerTurn:1}, once:true, cat:"tradeoff" },

  // Population tradeoffs
  { id:"migrant_workers", name:"Привлечение мигрантов", desc:"Дешёвая рабочая сила, но напряжённость.", cost:20, effects:{economy:5,infrastructure:2,safety:-3,culture:-2}, populationEffect:500, once:true, cat:"tradeoff" },
  { id:"gated_community", name:"Закрытый посёлок", desc:"Элитный район — доход и неравенство.", cost:60, effects:{economy:6,safety:2,culture:-4}, populationEffect:100, once:true, cat:"tradeoff" },
  { id:"dormitory_district", name:"Район общежитий", desc:"Дешёвое жильё, но перенаселённость.", cost:80, effects:{economy:3,infrastructure:-3,safety:-2}, populationEffect:400, once:true, cat:"tradeoff" },

  // Controversial
  { id:"rename_streets", name:"Переименование улиц", desc:"Новые названия — споры и затраты.", cost:30, effects:{culture:3,safety:-1}, cat:"tradeoff" },
  { id:"demolish_soviet", name:"Снос советских зданий", desc:"Модернизация или уничтожение истории?", cost:40, effects:{infrastructure:4,culture:-5}, cat:"tradeoff" },
  { id:"church_land", name:"Передача земли церкви", desc:"Земля монастырю — лояльность, но потеря.", cost:0, effects:{culture:4,economy:-3,ecology:-2}, once:true, cat:"tradeoff" },
  { id:"prison_labor", name:"Труд заключённых", desc:"Бесплатная рабочая сила с колонии.", cost:10, effects:{economy:4,infrastructure:3,culture:-5,safety:-2}, once:true, cat:"tradeoff" },
  { id:"tax_haven", name:"Налоговая гавань", desc:"Минимальные налоги привлекают бизнес.", cost:30, effects:{economy:10,culture:-3,safety:-2}, once:true, cat:"tradeoff" },
  { id:"propaganda", name:"Пропаганда успехов", desc:"Агрессивный PR скрывает проблемы.", cost:20, effects:{culture:-3,safety:-1}, cat:"tradeoff" },
  { id:"cut_social", name:"Сокращение социальных программ", desc:"Экономия бюджета ценой недовольства.", cost:0, effects:{economy:4,healthcare:-3,education:-2,safety:-1}, cat:"tradeoff" },
  { id:"night_construction", name:"Ночная стройка", desc:"Быстрее, но шумно.", cost:60, effects:{infrastructure:6,healthcare:-2,safety:-1,ecology:-1}, cat:"tradeoff" },

  // ─────────────────────────────────────────────────────────────────────────────
  // EXTRA — fill to ~500 (more depth per category)
  // ─────────────────────────────────────────────────────────────────────────────

  // Economy extra
  { id:"crypto_hub", name:"Крипто-хаб", desc:"Пространство для блокчейн-стартапов.", cost:80, effects:{economy:5,digital:4}, once:true, requires:{digital:40}, cat:"economy" },
  { id:"cinema_studio", name:"Киностудия", desc:"Малая киностудия для рекламы и контента.", cost:90, effects:{economy:4,culture:4,digital:2}, once:true, cat:"economy" },
  { id:"delivery_depot", name:"Депо доставки", desc:"Склад для маркетплейсов.", cost:50, effects:{economy:4,infrastructure:1}, once:true, cat:"economy" },
  { id:"artisan_market", name:"Рынок ремесленников", desc:"Постоянная площадка для мастеров.", cost:30, effects:{economy:3,culture:3}, cat:"economy" },
  { id:"tourism_office", name:"Туристический офис", desc:"Информационный центр для гостей.", cost:25, effects:{economy:3,culture:2}, once:true, cat:"economy" },
  { id:"night_economy", name:"Ночная экономика", desc:"Поддержка баров, клубов, ресторанов.", cost:40, effects:{economy:4,culture:2,safety:-2}, cat:"economy" },
  { id:"green_bonds", name:"Зелёные облигации", desc:"Муниципальные облигации на экопроекты.", cost:30, effects:{economy:3,ecology:2}, once:true, cat:"economy" },
  { id:"makers_space", name:"Мейкерспейс", desc:"Мастерская с 3D-принтерами и станками.", cost:60, effects:{economy:3,digital:2,education:2}, once:true, cat:"economy" },
  { id:"shared_kitchen", name:"Общая кухня", desc:"Кухня-инкубатор для кулинарных стартапов.", cost:35, effects:{economy:3,culture:2}, once:true, cat:"economy" },
  { id:"franchise_attract", name:"Привлечение франшиз", desc:"Привлечение сетевых брендов.", cost:20, effects:{economy:3,infrastructure:1}, cat:"economy" },
  { id:"pension_fund", name:"Муниципальный пенсионный фонд", desc:"Дополнительные пенсии для жителей.", cost:60, effects:{economy:2,healthcare:2,safety:1}, once:true, cat:"economy" },
  { id:"barter_platform", name:"Платформа обмена", desc:"Цифровая платформа обмена услугами.", cost:20, effects:{economy:2,digital:2,culture:1}, once:true, cat:"economy" },
  { id:"local_currency", name:"Местная валюта", desc:"Городская бонусная валюта.", cost:15, effects:{economy:3,culture:1}, once:true, cat:"economy" },
  { id:"farmer_coop", name:"Кооператив фермеров", desc:"Объединение местных производителей.", cost:25, effects:{economy:3,ecology:1}, cat:"economy" },
  { id:"market_automation", name:"Автоматизация рынка", desc:"Электронные весы и онлайн-каталог.", cost:25, effects:{economy:2,digital:2}, cat:"economy" },

  // Safety extra
  { id:"body_cameras", name:"Нательные камеры", desc:"Камеры для патрульных.", cost:30, effects:{safety:3,digital:1}, cat:"safety" },
  { id:"k9_unit", name:"Кинологическая служба", desc:"Собаки для поиска и охраны.", cost:40, effects:{safety:4}, once:true, cat:"safety" },
  { id:"cyber_police", name:"Киберполиция", desc:"Отдел по киберпреступлениям.", cost:50, effects:{safety:3,digital:2}, once:true, requires:{digital:30}, cat:"safety" },
  { id:"safe_route", name:"Безопасный маршрут в школу", desc:"Освещённые и контролируемые маршруты.", cost:25, effects:{safety:3,education:1}, cat:"safety" },
  { id:"emergency_generator", name:"Аварийный генератор", desc:"Резервный генератор для города.", cost:50, effects:{safety:4,infrastructure:1}, once:true, cat:"safety" },
  { id:"gas_detectors", name:"Датчики газа", desc:"Датчики утечки газа в жилых домах.", cost:30, effects:{safety:3,infrastructure:1}, cat:"safety" },
  { id:"water_rescue", name:"Спасатели на воде", desc:"Спасательный пост на реке.", cost:25, effects:{safety:3}, cat:"safety" },
  { id:"seismic_sensors", name:"Сейсмодатчики", desc:"Мониторинг устойчивости зданий.", cost:40, effects:{safety:3,digital:1,infrastructure:1}, once:true, cat:"safety" },
  { id:"volunteer_fire", name:"Добровольная пожарная дружина", desc:"Обучение и экипировка добровольцев.", cost:20, effects:{safety:3,culture:1}, cat:"safety" },
  { id:"child_gps", name:"GPS-браслеты для детей", desc:"Браслеты для безопасности детей.", cost:15, effects:{safety:2,digital:1}, cat:"safety" },
  { id:"traffic_cameras", name:"Камеры фиксации нарушений", desc:"Камеры на перекрёстках.", cost:50, effects:{safety:4,economy:1,digital:1}, cat:"safety" },
  { id:"panic_buttons", name:"Кнопки паники", desc:"Тревожные кнопки в подъездах.", cost:20, effects:{safety:3}, cat:"safety" },
  { id:"safe_internet", name:"Безопасный интернет", desc:"Фильтрация контента в школьной сети.", cost:15, effects:{safety:2,education:1,digital:1}, cat:"safety" },
  { id:"anti_drug", name:"Программа против наркотиков", desc:"Профилактика наркомании.", cost:25, effects:{safety:3,healthcare:2,education:1}, cat:"safety" },
  { id:"witness_protection", name:"Защита свидетелей", desc:"Программа защиты свидетелей.", cost:30, effects:{safety:3}, once:true, cat:"safety" },

  // Healthcare extra
  { id:"eye_clinic", name:"Офтальмологический кабинет", desc:"Проверка зрения и очки.", cost:40, effects:{healthcare:3,education:1}, once:true, cat:"healthcare" },
  { id:"allergy_center", name:"Центр аллергологии", desc:"Диагностика и лечение аллергий.", cost:50, effects:{healthcare:4}, once:true, cat:"healthcare" },
  { id:"dietitian", name:"Городской диетолог", desc:"Бесплатные консультации по питанию.", cost:15, effects:{healthcare:2,education:1}, cat:"healthcare" },
  { id:"blood_donation", name:"День донора", desc:"Акция сдачи крови.", cost:10, effects:{healthcare:2,culture:1}, cat:"healthcare" },
  { id:"baby_box", name:"Бэби-бокс", desc:"Комплекты для новорождённых.", cost:15, effects:{healthcare:2,education:1}, cat:"healthcare" },
  { id:"air_purifiers", name:"Очистители воздуха", desc:"В школах и детсадах.", cost:30, effects:{healthcare:3,ecology:1}, cat:"healthcare" },
  { id:"fitness_park", name:"Фитнес-парк", desc:"Парк с тренажёрами и беговыми дорожками.", cost:50, effects:{healthcare:4,culture:2,ecology:1}, once:true, cat:"healthcare" },
  { id:"hospice", name:"Хоспис", desc:"Паллиативная помощь.", cost:80, effects:{healthcare:5,safety:1}, once:true, cat:"healthcare" },
  { id:"lab_equipment", name:"Лабораторное оборудование", desc:"Обновление оборудования лаборатории.", cost:60, effects:{healthcare:4,digital:1}, cat:"healthcare" },
  { id:"school_nurse", name:"Медсёстры в школах", desc:"Медработник в каждой школе.", cost:30, effects:{healthcare:3,education:1,safety:1}, cat:"healthcare" },
  { id:"water_testing", name:"Тестирование воды", desc:"Регулярный анализ питьевой воды.", cost:15, effects:{healthcare:2,ecology:1}, cat:"healthcare" },
  { id:"sports_medicine", name:"Спортивная медицина", desc:"Кабинет спортивного врача.", cost:40, effects:{healthcare:3,education:1}, once:true, cat:"healthcare" },
  { id:"wheelchair_program", name:"Программа инвалидных колясок", desc:"Бесплатные коляски для инвалидов.", cost:20, effects:{healthcare:2,safety:1}, cat:"healthcare" },

  // Education extra
  { id:"coding_bootcamp", name:"Кодинг-буткемп", desc:"Интенсивные курсы программирования.", cost:40, effects:{education:3,digital:3}, cat:"education" },
  { id:"astronomy_club", name:"Астрономический кружок", desc:"Телескоп и наблюдения.", cost:15, effects:{education:2,culture:1}, cat:"education" },
  { id:"garden_school", name:"Школьный огород", desc:"Грядки при школах.", cost:10, effects:{education:2,ecology:1}, cat:"education" },
  { id:"debate_club", name:"Дебатный клуб", desc:"Клуб дебатов для подростков.", cost:10, effects:{education:2,culture:1}, cat:"education" },
  { id:"history_project", name:"Проект «Моя история»", desc:"Школьники изучают историю города.", cost:10, effects:{education:2,culture:2}, cat:"education" },
  { id:"3d_printing", name:"3D-печать в школах", desc:"Принтеры для уроков технологии.", cost:30, effects:{education:3,digital:2}, cat:"education" },
  { id:"teacher_exchange", name:"Обмен учителями", desc:"Учителя из Москвы ведут мастер-классы.", cost:20, effects:{education:3,culture:1}, cat:"education" },
  { id:"vocational_training", name:"Профобучение", desc:"Курсы сварки, электрики, сантехники.", cost:40, effects:{education:4,economy:2,infrastructure:1}, cat:"education" },
  { id:"music_instruments", name:"Музыкальные инструменты", desc:"Инструменты для школьного оркестра.", cost:20, effects:{education:2,culture:2}, cat:"education" },
  { id:"e_learning", name:"Электронное обучение", desc:"Планшеты и онлайн-курсы.", cost:50, effects:{education:4,digital:3}, requires:{digital:25}, cat:"education" },
  { id:"mentoring", name:"Программа наставничества", desc:"Бизнесмены наставляют школьников.", cost:15, effects:{education:3,economy:1}, cat:"education" },
  { id:"nature_class", name:"Уроки на природе", desc:"Занятия в парке и лесу.", cost:10, effects:{education:2,ecology:1}, cat:"education" },
  { id:"tech_olympiad", name:"Техническая олимпиада", desc:"Городская олимпиада по технологиям.", cost:15, effects:{education:3,digital:1}, cat:"education" },
  { id:"scholarship_fund", name:"Фонд стипендий", desc:"Муниципальный стипендиальный фонд.", cost:40, effects:{education:4,economy:1}, once:true, cat:"education" },

  // Ecology extra
  { id:"butterfly_garden", name:"Сад бабочек", desc:"Сад с цветами для бабочек.", cost:15, effects:{ecology:2,culture:1,education:1}, cat:"ecology" },
  { id:"mushroom_trail", name:"Грибная тропа", desc:"Маршрут для грибников.", cost:10, effects:{ecology:2,culture:1}, once:true, cat:"ecology" },
  { id:"solar_boats", name:"Солнечные лодки", desc:"Экологичные прогулочные лодки.", cost:40, effects:{ecology:3,culture:2,economy:1}, once:true, cat:"ecology" },
  { id:"vertical_gardens", name:"Вертикальные сады", desc:"Зелёные стены на зданиях.", cost:30, effects:{ecology:3,culture:2}, cat:"ecology" },
  { id:"bat_houses", name:"Домики для летучих мышей", desc:"Естественная борьба с комарами.", cost:5, effects:{ecology:1,healthcare:1}, cat:"ecology" },
  { id:"permaculture", name:"Пермакультура", desc:"Экоферма с замкнутым циклом.", cost:40, effects:{ecology:4,education:1,economy:1}, once:true, cat:"ecology" },
  { id:"biogas_plant", name:"Биогазовая установка", desc:"Энергия из органических отходов.", cost:100, effects:{ecology:5,infrastructure:2,economy:1}, once:true, requires:{ecology:35}, cat:"ecology" },
  { id:"fish_stocking", name:"Зарыбление реки", desc:"Выпуск мальков в Москву-реку.", cost:15, effects:{ecology:3,culture:1}, cat:"ecology" },
  { id:"eco_hotel", name:"Эко-отель", desc:"Гостиница с нулевым выбросом.", cost:120, effects:{ecology:4,economy:4,culture:2}, once:true, requires:{ecology:45}, cat:"ecology" },
  { id:"urban_forest", name:"Городской лес", desc:"Высадка леса на пустыре.", cost:40, effects:{ecology:5,healthcare:1}, once:true, cat:"ecology" },
  { id:"electric_scooters", name:"Электросамокаты", desc:"Прокат электросамокатов.", cost:30, effects:{ecology:2,infrastructure:1,safety:-1}, cat:"ecology" },
  { id:"green_office", name:"Зелёный офис", desc:"Экостандарт для муниципальных зданий.", cost:25, effects:{ecology:2,digital:1}, once:true, cat:"ecology" },
  { id:"radon_testing", name:"Тест на радон", desc:"Проверка уровня радона в зданиях.", cost:15, effects:{ecology:1,healthcare:2,safety:1}, cat:"ecology" },

  // Culture extra
  { id:"podcast_studio", name:"Подкаст-студия", desc:"Студия для местных подкастеров.", cost:20, effects:{culture:2,digital:2}, once:true, cat:"culture" },
  { id:"vinyl_market", name:"Виниловый маркет", desc:"Ежемесячный рынок пластинок.", cost:10, effects:{culture:2,economy:1}, cat:"culture" },
  { id:"mural_project", name:"Проект «100 муралов»", desc:"Масштабный стрит-арт проект.", cost:40, effects:{culture:4,economy:1}, once:true, cat:"culture" },
  { id:"food_truck_zone", name:"Зона фудтраков", desc:"Площадка для фудтраков.", cost:20, effects:{culture:2,economy:2}, once:true, cat:"culture" },
  { id:"literary_prize", name:"Литературная премия", desc:"Городская премия за лучшую книгу.", cost:15, effects:{culture:2,education:1}, cat:"culture" },
  { id:"dance_school", name:"Школа танцев", desc:"Бесплатные уроки танцев.", cost:25, effects:{culture:3,healthcare:1}, cat:"culture" },
  { id:"comic_festival", name:"Фестиваль комиксов", desc:"Фестиваль рисованных историй.", cost:20, effects:{culture:3,education:1}, cat:"culture" },
  { id:"time_capsule", name:"Капсула времени", desc:"Послание потомкам.", cost:5, effects:{culture:2,education:1}, once:true, cat:"culture" },
  { id:"sister_city", name:"Город-побратим", desc:"Побратимство с зарубежным городом.", cost:30, effects:{culture:3,economy:2}, once:true, cat:"culture" },
  { id:"oral_history", name:"Устная история", desc:"Запись воспоминаний пожилых жителей.", cost:10, effects:{culture:2,education:1}, once:true, cat:"culture" },
  { id:"outdoor_gym", name:"Качалка на воздухе", desc:"Уличный спортзал.", cost:20, effects:{culture:2,healthcare:2}, cat:"culture" },
  { id:"community_radio", name:"Городское радио", desc:"Радиостанция для жителей.", cost:25, effects:{culture:3,digital:1}, once:true, cat:"culture" },
  { id:"graffiti_wall", name:"Легальная стена для граффити", desc:"Пространство для граффити-артистов.", cost:10, effects:{culture:2,safety:1}, once:true, cat:"culture" },

  // Infrastructure extra
  { id:"roundabout", name:"Кольцевая развязка", desc:"Кольцо на опасном перекрёстке.", cost:60, effects:{infrastructure:4,safety:3}, once:true, cat:"infrastructure" },
  { id:"paving_stones", name:"Мощение улиц", desc:"Брусчатка на исторических улицах.", cost:50, effects:{infrastructure:3,culture:3}, cat:"infrastructure" },
  { id:"cable_car", name:"Канатная дорога", desc:"Канатка через реку.", cost:200, effects:{infrastructure:6,culture:5,economy:3}, once:true, requires:{infrastructure:50}, cat:"infrastructure" },
  { id:"helipad", name:"Вертолётная площадка", desc:"Площадка для санитарной авиации.", cost:80, effects:{infrastructure:4,healthcare:3,safety:2}, once:true, cat:"infrastructure" },
  { id:"boat_pier", name:"Причал для лодок", desc:"Речной причал.", cost:40, effects:{infrastructure:3,culture:2,economy:1}, once:true, cat:"infrastructure" },
  { id:"underground_parking", name:"Подземная парковка", desc:"Парковка под площадью.", cost:150, effects:{infrastructure:6,economy:2,ecology:1}, once:true, requires:{infrastructure:40}, cat:"infrastructure" },
  { id:"snow_melting", name:"Снегоплавильная станция", desc:"Утилизация снега.", cost:60, effects:{infrastructure:3,ecology:2,safety:1}, once:true, cat:"infrastructure" },
  { id:"bicycle_parking", name:"Велопарковки", desc:"Крытые велопарковки у учреждений.", cost:20, effects:{infrastructure:2,ecology:1}, cat:"infrastructure" },
  { id:"road_markings", name:"Дорожная разметка", desc:"Обновление разметки.", cost:15, effects:{infrastructure:2,safety:2}, cat:"infrastructure" },

  // Tradeoff extra
  { id:"coal_heating", name:"Угольная котельная", desc:"Дёшево, но грязно.", cost:50, effects:{infrastructure:4,economy:3,ecology:-7,healthcare:-2}, once:true, cat:"tradeoff" },
  { id:"tourist_tax", name:"Туристический сбор", desc:"Налог для туристов — доход, но отпугивает.", cost:5, effects:{economy:4,culture:-3}, recurringIncome:{base:15,maintenance:3,decayPerTurn:1}, once:true, cat:"tradeoff" },
  { id:"noise_tolerance", name:"Разрешение шума до 23:00", desc:"Бизнесу хорошо, жителям — нет.", cost:0, effects:{economy:3,culture:-2,healthcare:-1}, once:true, cat:"tradeoff" },
  { id:"outsource_services", name:"Аутсорсинг услуг", desc:"Передача ЖКХ частникам.", cost:0, effects:{economy:4,infrastructure:-2,safety:-1}, once:true, cat:"tradeoff" },
  { id:"dam_removal", name:"Снос плотины", desc:"Восстановление реки, но потеря энергии.", cost:30, effects:{ecology:6,infrastructure:-4,economy:-2}, once:true, cat:"tradeoff" },
  { id:"high_rise", name:"Многоэтажка", desc:"Квартиры, но нагрузка на сети.", cost:100, effects:{economy:5,infrastructure:-3,ecology:-2}, populationEffect:400, once:true, cat:"tradeoff" },
  { id:"austerity", name:"Режим экономии", desc:"Сокращение расходов на всё.", cost:0, effects:{economy:3,infrastructure:-2,culture:-2,healthcare:-1}, cat:"tradeoff" },
];
