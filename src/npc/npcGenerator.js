import {
  FIRST_NAMES_MALE,
  FIRST_NAMES_FEMALE,
  PATRONYMICS_MALE,
  PATRONYMICS_FEMALE,
  LAST_NAMES,
  OCCUPATIONS,
  AVATARS,
  PERSONALITY_TYPES,
  GROUP_NEEDS,
} from "./npcNames.js";
import { DISTRICTS } from "../engine/constants.js";

export const GROUP_DISTRIBUTION = {
  elderly: 15,
  freelancers: 8,
  families: 15,
  youth: 12,
  business: 10,
};

// Age ranges per group
const AGE_RANGES = {
  elderly: [60, 85],
  freelancers: [22, 45],
  families: [28, 50],
  youth: [17, 28],
  business: [30, 60],
};

export function generateNPC(rng, group, id) {
  const isFemale = rng.next() > 0.5;
  const firstName = rng.pick(isFemale ? FIRST_NAMES_FEMALE : FIRST_NAMES_MALE);
  const patronymic = rng.pick(isFemale ? PATRONYMICS_FEMALE : PATRONYMICS_MALE);

  // Last name feminization
  let lastName = rng.pick(LAST_NAMES);
  if (isFemale && lastName.endsWith("ов")) lastName += "а";
  else if (isFemale && lastName.endsWith("ев")) lastName += "а";
  else if (isFemale && lastName.endsWith("ин")) lastName += "а";

  const [minAge, maxAge] = AGE_RANGES[group];
  const age = rng.nextInt(minAge, maxAge);
  const occupation = rng.pick(OCCUPATIONS[group] || OCCUPATIONS.families);
  const personality = rng.pick(PERSONALITY_TYPES);
  const district = rng.pick(DISTRICTS);
  const avatar = rng.pick(AVATARS[group] || ["🧑"]);

  // Pick 2-3 needs from group needs, shuffled
  const allNeeds = [...GROUP_NEEDS[group]];
  const needs = rng.shuffle(allNeeds).slice(0, rng.nextInt(2, 3));

  return {
    id: `npc_${id}`,
    name: `${firstName} ${patronymic} ${lastName}`,
    shortName: `${firstName} ${patronymic}`,
    firstName,
    age,
    group,
    avatar,
    district,
    occupation,
    personality,
    needs,
    satisfaction: 50,
    loyalty: 50,
    residenceTurn: 0,
    status: "resident",
    memory: [],
    lastLetterTurn: -10,
    lowSatisfactionStreak: 0,
  };
}

export function generateNPCs(rng) {
  const npcs = [];
  let idx = 0;
  for (const [group, count] of Object.entries(GROUP_DISTRIBUTION)) {
    for (let i = 0; i < count; i++) {
      npcs.push(generateNPC(rng, group, idx++));
    }
  }
  return npcs;
}

export function generateNewResident(rng, group, id, turn) {
  const npc = generateNPC(rng, group, id);
  return { ...npc, status: "moved_in", residenceTurn: turn, satisfaction: 55, loyalty: 40 };
}
