export function createRNG(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  const next = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  const nextInt = (min, max) => min + Math.floor(next() * (max - min + 1));
  const pick = (arr) => arr[Math.floor(next() * arr.length)];
  const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  return { next, nextInt, pick, shuffle, getSeed: () => s };
}
