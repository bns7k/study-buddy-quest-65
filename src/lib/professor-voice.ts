// Deep old professor mumbling - short, low, slow utterances

let audioCtx: AudioContext | null = null;

function getCtx() {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

export function playMumbleChar(char: string) {
  if (" \n.,!?…\"'".includes(char)) return;

  const ctx = getCtx();
  const now = ctx.currentTime;

  // Very deep base frequencies (70-130 Hz range)
  const base = 70 + Math.random() * 60;
  const duration = 0.09 + Math.random() * 0.04;

  // Main voice - triangle wave for softer, warmer tone
  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(base, now);
  // Gentle pitch drift down like an old man trailing off
  osc.frequency.linearRampToValueAtTime(base * 0.92, now + duration);

  // Second harmonic for richness
  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(base * 1.5, now);
  osc2.frequency.linearRampToValueAtTime(base * 1.4, now + duration);

  // Low-pass filter - very muffled, like speaking through a beard
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(350 + Math.random() * 100, now);
  filter.Q.setValueAtTime(1.5, now);

  // Volume envelope - soft attack, quick fade
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.07, now + 0.015);
  gain.gain.linearRampToValueAtTime(0.04, now + duration * 0.5);
  gain.gain.linearRampToValueAtTime(0, now + duration);

  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0, now);
  gain2.gain.linearRampToValueAtTime(0.025, now + 0.015);
  gain2.gain.linearRampToValueAtTime(0, now + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc2.connect(gain2);
  gain2.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration);
  osc2.start(now);
  osc2.stop(now + duration);
}

export function resumeAudio() {
  if (audioCtx?.state === "suspended") audioCtx.resume();
}
