// Web Audio API synthesized sound engine — no external files needed

let ctx = null;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function tone(freq, duration, type = "sine", gain = 0.3, detune = 0) {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gainNode = ac.createGain();
    osc.connect(gainNode);
    gainNode.connect(ac.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    if (detune) osc.detune.setValueAtTime(detune, ac.currentTime);
    gainNode.gain.setValueAtTime(gain, ac.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + duration);
  } catch {}
}

function chord(freqs, duration, type = "sine", gain = 0.2) {
  freqs.forEach(f => tone(f, duration, type, gain / freqs.length));
}

export const audio = {
  decision() {
    tone(440, 0.08, "sine", 0.15);
    setTimeout(() => tone(660, 0.1, "sine", 0.1), 60);
  },

  metricUp() {
    tone(523, 0.1, "triangle", 0.2);
    setTimeout(() => tone(659, 0.15, "triangle", 0.15), 80);
  },

  metricDown() {
    tone(330, 0.15, "sawtooth", 0.15);
    setTimeout(() => tone(220, 0.2, "sawtooth", 0.1), 100);
  },

  achievement() {
    // Fanfare: 3 ascending notes
    tone(523, 0.12, "sine", 0.3);
    setTimeout(() => tone(659, 0.12, "sine", 0.25), 130);
    setTimeout(() => chord([784, 988], 0.4, "sine", 0.4), 260);
  },

  crisis() {
    tone(220, 0.3, "sawtooth", 0.25);
    setTimeout(() => tone(185, 0.3, "sawtooth", 0.2), 200);
    setTimeout(() => tone(165, 0.4, "sawtooth", 0.15), 400);
  },

  turnEnd() {
    // Soft chime
    chord([523, 659, 784], 0.6, "sine", 0.2);
  },

  gameEnd(grade) {
    const isGood = ["S", "A", "B"].includes(grade);
    if (isGood) {
      chord([523, 659, 784], 0.3, "sine", 0.25);
      setTimeout(() => chord([659, 784, 988], 0.3, "sine", 0.2), 350);
      setTimeout(() => chord([784, 988, 1175], 0.8, "sine", 0.3), 700);
    } else {
      tone(440, 0.4, "sawtooth", 0.2);
      setTimeout(() => tone(330, 0.4, "sawtooth", 0.15), 450);
      setTimeout(() => tone(220, 0.7, "sawtooth", 0.1), 900);
    }
  },

  click() {
    tone(880, 0.04, "sine", 0.08);
  },

  rankUp() {
    tone(523, 0.1, "triangle", 0.2);
    setTimeout(() => tone(784, 0.15, "triangle", 0.2), 100);
    setTimeout(() => tone(1047, 0.2, "triangle", 0.15), 200);
  },
};

let enabled = true;

export function setAudioEnabled(v) { enabled = v; }
export function isAudioEnabled() { return enabled; }

// Wrap all methods to respect enabled flag
for (const key of Object.keys(audio)) {
  const orig = audio[key];
  audio[key] = (...args) => { if (enabled) orig(...args); };
}
