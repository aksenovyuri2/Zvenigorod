export function getDailySeed(date) {
  const d = date || new Date();
  const str = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 42;
}

export function getWeeklySeed(date) {
  const d = date || new Date();
  const start = new Date(d.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((d - start) / 86400000 + start.getDay() + 1) / 7);
  const str = `week-${d.getFullYear()}-${weekNum}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 77;
}

export function createRNG(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  const next = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  const nextInt = (min, max) => min + Math.floor(next() * (max - min + 1));
  const pick = (arr) => arr[Math.floor(next() * arr.length)];
  const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  return { next, nextInt, pick, shuffle, getSeed: () => s };
}
