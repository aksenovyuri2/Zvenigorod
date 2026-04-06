import { METRIC_KEYS, GROUPS, GROUP_KEYS } from "../engine/constants.js";
import { generateNewResident } from "./npcGenerator.js";

export function updateNPCSatisfaction(npc, metrics) {
  // Satisfaction based on how well city meets NPC's needs
  let sat = 0;
  for (const need of npc.needs) {
    sat += (metrics[need] || 0);
  }
  sat = sat / npc.needs.length;

  // Personality modifier
  switch (npc.personality) {
    case "optimist": sat += 5; break;
    case "pessimist": sat -= 5; break;
    case "pragmatist": break; // neutral
    case "activist": sat += (sat > 50 ? 3 : -3); break; // amplifies feelings
    case "quiet": sat = sat * 0.9 + 5; break; // dampened
  }

  // Memory influence: recent positive memories boost, negative memories reduce
  const recentMemory = npc.memory.filter(m => m.turn >= (npc.residenceTurn || 0));
  const memoryBonus = recentMemory.reduce((sum, m) => sum + (m.sentiment === "positive" ? 2 : -2), 0);
  sat += Math.max(-10, Math.min(10, memoryBonus));

  return Math.max(0, Math.min(100, Math.round(sat)));
}

export function processNPCTurn(npcs, metrics, turn, rng, approval) {
  const updatedNPCs = [];
  const departed = [];

  for (const npc of npcs) {
    if (npc.status === "moved_out") {
      updatedNPCs.push(npc);
      continue;
    }

    const newSat = updateNPCSatisfaction(npc, metrics);
    let streak = npc.lowSatisfactionStreak;
    if (newSat < 20) {
      streak++;
    } else {
      streak = 0;
    }

    // Leave after 3 consecutive turns of low satisfaction
    if (streak >= 3) {
      const goneNPC = { ...npc, satisfaction: newSat, status: "moved_out", lowSatisfactionStreak: streak };
      updatedNPCs.push(goneNPC);
      // Find weakest need for departure reason
      const worstNeed = npc.needs.reduce((worst, n) =>
        (metrics[n] || 0) < (metrics[worst] || 0) ? n : worst, npc.needs[0]);
      departed.push({ npc: goneNPC, reason: worstNeed });
      continue;
    }

    // Update loyalty based on approval
    let loyalty = npc.loyalty;
    if (approval > 60) loyalty = Math.min(100, loyalty + 1);
    if (approval < 30) loyalty = Math.max(0, loyalty - 1);

    updatedNPCs.push({ ...npc, satisfaction: newSat, loyalty, lowSatisfactionStreak: streak });
  }

  // Generate arrivals if city is attractive
  const arrived = generateArrivals(rng, metrics, approval, updatedNPCs.filter(n => n.status === "resident" || n.status === "moved_in").length, turn, updatedNPCs.length);

  return { updatedNPCs: [...updatedNPCs, ...arrived], departed, arrived };
}

export function generateArrivals(rng, metrics, approval, residentCount, turn, totalNPCCount) {
  const avgMetric = METRIC_KEYS.reduce((s, k) => s + (metrics[k] || 0), 0) / METRIC_KEYS.length;

  // Arrivals happen if city is attractive (avg metrics > 45 and approval > 40)
  if (avgMetric < 45 || approval < 40) return [];

  // Chance of 1-2 new arrivals
  const chance = (avgMetric - 45) * 0.02 + (approval - 40) * 0.01;
  if (rng.next() > chance) return [];

  // Max 80 NPCs total
  if (totalNPCCount >= 80) return [];

  // Pick group based on what's attractive
  const groupScores = {};
  for (const [gk, g] of Object.entries(GROUPS)) {
    let score = 0;
    for (const [mk, w] of Object.entries(g.weights)) score += (metrics[mk] || 0) * w;
    groupScores[gk] = score;
  }
  const bestGroup = Object.entries(groupScores).sort((a, b) => b[1] - a[1])[0][0];

  const count = rng.next() > 0.7 ? 2 : 1;
  const arrivals = [];
  for (let i = 0; i < count && totalNPCCount + arrivals.length < 80; i++) {
    arrivals.push(generateNewResident(rng, bestGroup, totalNPCCount + i, turn));
  }
  return arrivals;
}

export function selectLetterWriters(npcs, turn) {
  const residents = npcs.filter(n => n.status === "resident" || n.status === "moved_in");
  const eligible = residents.filter(n => turn - n.lastLetterTurn >= 4);
  if (eligible.length === 0) return [];

  // Sort by extreme satisfaction (most unhappy first, then most happy)
  const sorted = [...eligible].sort((a, b) => {
    const aExtreme = Math.abs(a.satisfaction - 50);
    const bExtreme = Math.abs(b.satisfaction - 50);
    return bExtreme - aExtreme;
  });

  // Pick 1-2: prefer one unhappy and one happy
  const writers = [];
  const unhappy = sorted.find(n => n.satisfaction < 30);
  const happy = sorted.find(n => n.satisfaction > 70);
  if (unhappy) writers.push({ ...unhappy, lastLetterTurn: turn });
  if (happy && writers.length < 2) writers.push({ ...happy, lastLetterTurn: turn });
  if (writers.length === 0 && sorted.length > 0) writers.push({ ...sorted[0], lastLetterTurn: turn });

  return writers;
}

const LETTER_TEMPLATES = {
  unhappy: {
    healthcare:     ["В поликлинику запись на два месяца вперёд!", "Скорую приходится ждать по несколько часов."],
    education:      ["Школы переполнены, уроки в три смены.", "Учителя уходят — платить нечем."],
    safety:         ["По ночам страшно выйти из дома.", "Машины во дворе взламывают уже не в первый раз."],
    ecology:        ["Воздух стал заметно хуже — дышать нечем.", "Речку снова загрязнили, запах невыносим."],
    infrastructure: ["Дороги разбиты, пробки стоят каждый день.", "Горячей воды нет уже вторую неделю."],
    culture:        ["Детям некуда пойти после школы.", "Последний кинотеатр закрылся, город пустеет."],
    digital:        ["Интернет пропадает каждый вечер.", "Запись в МФЦ только по живой очереди."],
    economy:        ["Работы нет, молодёжь уезжает в Москву.", "Цены в магазинах растут каждую неделю."],
  },
  happy: {
    healthcare:     ["Наконец открыли новый корпус — очередей нет!", "Врачи стали приезжать быстро, спасибо."],
    education:      ["Дочка в восторге от новой школы!", "Олимпиада, призовые места — гордость города."],
    safety:         ["Вечером снова спокойно гулять по улицам.", "Камеры помогли — вора нашли за час."],
    ecology:        ["На набережной наконец-то дышится свободно!", "Парк преобразился, приходим каждые выходные."],
    infrastructure: ["Дорогу починили — теперь не трясёт.", "Горячую воду дали даже раньше обещанного срока."],
    culture:        ["Фестиваль — лучшее лето в моей жизни!", "Арт-центр стал нашим любимым местом в городе."],
    digital:        ["Провели оптоволокно — скорость как в Москве!", "Электронная запись к врачу — очень удобно."],
    economy:        ["Открылся коворкинг, нашёл хорошую работу!", "Рынок выходного дня — отличная идея мэра."],
  },
};

export function generateLetterText(npc, metrics) {
  const unhappy = npc.satisfaction < 40;
  const happy = npc.satisfaction > 65;
  if (!unhappy && !happy) return null;

  const sentiment = unhappy ? "unhappy" : "happy";
  const pool = unhappy ? LETTER_TEMPLATES.unhappy : LETTER_TEMPLATES.happy;

  const targetNeed = unhappy
    ? npc.needs.reduce((w, n) => (metrics[n] || 0) < (metrics[w] || 0) ? n : w, npc.needs[0])
    : npc.needs.reduce((b, n) => (metrics[n] || 0) > (metrics[b] || 0) ? n : b, npc.needs[0]);

  const templates = pool[targetNeed] || (unhappy ? ["Недоволен работой мэрии."] : ["Спасибо за работу!"]);
  const text = templates[Math.floor(Math.abs(npc.satisfaction * 17 + npc.needs.length * 7)) % templates.length];
  return { text, sentiment };
}

export function addNPCMemory(npc, turn, event, sentiment) {
  const memory = [...npc.memory, { turn, event, sentiment }];
  // Keep last 10 memories
  const trimmed = memory.length > 10 ? memory.slice(-10) : memory;
  return { ...npc, memory: trimmed };
}
