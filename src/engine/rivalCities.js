// Rival cities — nearby cities that dynamically compete with Zvenigorod
// Each rival has a score that changes each turn based on their AI "strategy"

export const RIVAL_CITIES = [
  { id: "odintsovo", name: "Одинцово", icon: "🏙️", baseScore: 45, strategy: "economy", personality: "Агрессивный инвестор" },
  { id: "istra", name: "Истра", icon: "⛪", baseScore: 38, strategy: "culture", personality: "Хранитель наследия" },
  { id: "ruza", name: "Руза", icon: "🌾", baseScore: 32, strategy: "ecology", personality: "Зелёный район" },
  { id: "mozhaysk", name: "Можайск", icon: "🏰", baseScore: 35, strategy: "balanced", personality: "Осторожный середняк" },
  { id: "naro_fominsk", name: "Наро-Фоминск", icon: "🏭", baseScore: 40, strategy: "infrastructure", personality: "Промышленный центр" },
];

const STRATEGY_WEIGHTS = {
  economy:        { economy: 0.4, infrastructure: 0.2, digital: 0.2, culture: 0.1, ecology: 0.1 },
  culture:        { culture: 0.4, ecology: 0.2, education: 0.2, economy: 0.1, infrastructure: 0.1 },
  ecology:        { ecology: 0.4, healthcare: 0.2, culture: 0.2, economy: 0.1, infrastructure: 0.1 },
  balanced:       { economy: 0.2, infrastructure: 0.2, culture: 0.15, ecology: 0.15, digital: 0.15, education: 0.15 },
  infrastructure: { infrastructure: 0.4, economy: 0.2, digital: 0.2, safety: 0.1, healthcare: 0.1 },
};

export function initRivalCities(rng) {
  return RIVAL_CITIES.map(city => ({
    ...city,
    score: city.baseScore + rng.nextInt(-3, 3),
    trend: 0,
    lastEvent: null,
  }));
}

const RIVAL_EVENTS = [
  { text: "построил(а) новый торговый центр", scoreDelta: 2, strategy: "economy" },
  { text: "открыл(а) IT-парк", scoreDelta: 3, strategy: "economy" },
  { text: "потерял(а) крупного инвестора", scoreDelta: -3, strategy: "economy" },
  { text: "открыл(а) музей современного искусства", scoreDelta: 2, strategy: "culture" },
  { text: "провёл(а) международный фестиваль", scoreDelta: 2, strategy: "culture" },
  { text: "реставрирует историческое здание", scoreDelta: 1, strategy: "culture" },
  { text: "запустил(а) программу озеленения", scoreDelta: 2, strategy: "ecology" },
  { text: "получил(а) штраф за загрязнение", scoreDelta: -2, strategy: "ecology" },
  { text: "отремонтировал(а) центральные дороги", scoreDelta: 2, strategy: "infrastructure" },
  { text: "страдает от аварии на водопроводе", scoreDelta: -3, strategy: "infrastructure" },
  { text: "внедряет умные светофоры", scoreDelta: 2, strategy: "infrastructure" },
  { text: "запускает цифровые госуслуги", scoreDelta: 2, strategy: "balanced" },
  { text: "борется со скандалом в администрации", scoreDelta: -4, strategy: "balanced" },
  { text: "привлекает молодёжь новым коворкингом", scoreDelta: 1, strategy: "balanced" },
  { text: "открыл(а) новую поликлинику", scoreDelta: 2, strategy: "balanced" },
];

export function processRivalTurn(rivals, rng, playerScore) {
  return rivals.map(city => {
    // Base trend: strategy alignment gives slight growth, random variance
    const weights = STRATEGY_WEIGHTS[city.strategy] || STRATEGY_WEIGHTS.balanced;
    const strategyBonus = Object.values(weights).reduce((s, w) => s + w * 0.3, 0);
    const baseDelta = (strategyBonus - 0.1) + rng.nextInt(-1, 1) * 0.5;

    // Rubber-band: cities far behind get a slight boost, cities far ahead slow down
    const gap = playerScore - city.score;
    const catchup = gap > 10 ? 0.5 : gap < -10 ? -0.3 : 0;

    // Random event (30% chance)
    let event = null;
    let eventDelta = 0;
    if (rng.next() < 0.3) {
      const relevantEvents = RIVAL_EVENTS.filter(e => e.strategy === city.strategy || e.strategy === "balanced");
      event = rng.pick(relevantEvents);
      eventDelta = event.scoreDelta;
    }

    const totalDelta = Math.round((baseDelta + catchup + eventDelta) * 10) / 10;
    const newScore = Math.max(15, Math.min(95, Math.round((city.score + totalDelta) * 10) / 10));

    return {
      ...city,
      score: newScore,
      trend: Math.round((newScore - city.score) * 10) / 10,
      lastEvent: event ? `${city.name} ${event.text}` : null,
    };
  });
}
