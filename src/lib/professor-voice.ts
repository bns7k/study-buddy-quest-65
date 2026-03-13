// Animal Crossing / Undertale style gibberish voice for Professor Aldric
// Deep old man mumbling using Web Audio API

let audioCtx: AudioContext | null = null;

function getCtx() {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

const VOWELS = [200, 220, 180, 240, 160];
const CONSONANTS = [120, 140, 100, 90, 130];

export function playMumbleChar(char: string) {
  if (char === " " || char === "\n") return;
  
  const ctx = getCtx();
  const now = ctx.currentTime;
  const isVowel = "aeiouAEIOU".includes(char);
  const freqs = isVowel ? VOWELS : CONSONANTS;
  const baseFreq = freqs[Math.floor(Math.random() * freqs.length)];
  // Deep old man: low base + slight random variation
  const freq = baseFreq * (0.55 + Math.random() * 0.15);
  const duration = 0.06 + Math.random() * 0.03;

  // Main voice oscillator
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.linearRampToValueAtTime(freq * (0.95 + Math.random() * 0.1), now + duration);

  // Gentle filter for warmth
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(600 + Math.random() * 200, now);
  filter.Q.setValueAtTime(2, now);

  // Volume envelope
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.01);
  gain.gain.linearRampToValueAtTime(0.06, now + duration * 0.6);
  gain.gain.linearRampToValueAtTime(0, now + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration);
}

export function resumeAudio() {
  if (audioCtx?.state === "suspended") audioCtx.resume();
}
