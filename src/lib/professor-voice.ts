// Deep old professor mumbling - short phrase-like utterances, gibberish language

let audioCtx: AudioContext | null = null;

function getCtx() {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

// Formant frequencies for vowel-like sounds (F1, F2 pairs) - very deep male
const FORMANTS: [number, number][] = [
  [90, 280],   // "uh"
  [85, 320],   // "oh" 
  [95, 250],   // "mm"
  [80, 300],   // "hm"
  [100, 270],  // "ah" deep
];

function playFormant(f1: number, f2: number, duration: number, volume: number) {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Fundamental voice (very deep)
  const fundamental = ctx.createOscillator();
  fundamental.type = "sawtooth";
  const pitch = 55 + Math.random() * 25; // 55-80 Hz, very deep
  fundamental.frequency.setValueAtTime(pitch, now);
  fundamental.frequency.linearRampToValueAtTime(pitch * (0.9 + Math.random() * 0.1), now + duration);

  // Formant 1 (throat resonance)
  const filt1 = ctx.createBiquadFilter();
  filt1.type = "bandpass";
  filt1.frequency.setValueAtTime(f1, now);
  filt1.Q.setValueAtTime(5, now);

  // Formant 2 (mouth shape)
  const filt2 = ctx.createBiquadFilter();
  filt2.type = "bandpass";
  filt2.frequency.setValueAtTime(f2, now);
  filt2.Q.setValueAtTime(4, now);

  // Overall lowpass to keep it muffled
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(500, now);

  // Envelope - natural speech shape
  const gain = ctx.createGain();
  const attack = duration * 0.15;
  const release = duration * 0.3;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + attack);
  gain.gain.setValueAtTime(volume * 0.85, now + duration - release);
  gain.gain.linearRampToValueAtTime(0, now + duration);

  // Route: fundamental -> formants (parallel) -> lowpass -> output
  const merge = ctx.createGain();
  merge.gain.setValueAtTime(1, now);

  fundamental.connect(filt1);
  fundamental.connect(filt2);
  filt1.connect(merge);
  filt2.connect(merge);
  merge.connect(lp);
  lp.connect(gain);
  gain.connect(ctx.destination);

  fundamental.start(now);
  fundamental.stop(now + duration);
}

// Speak a short gibberish phrase (2-5 syllables) — called once per dialogue bubble
let speaking = false;

export function speakMumble() {
  if (speaking) return;
  speaking = true;

  const ctx = getCtx();
  const syllables = 2 + Math.floor(Math.random() * 4); // 2-5 syllables
  let time = 0;

  for (let i = 0; i < syllables; i++) {
    const formant = FORMANTS[Math.floor(Math.random() * FORMANTS.length)];
    const dur = 0.1 + Math.random() * 0.12; // 100-220ms per syllable
    const vol = 0.06 + Math.random() * 0.03;
    const gap = 0.03 + Math.random() * 0.05; // small gap between syllables

    setTimeout(() => {
      playFormant(formant[0], formant[1], dur, vol);
    }, time * 1000);

    time += dur + gap;
  }

  setTimeout(() => { speaking = false; }, time * 1000 + 200);
}

export function resumeAudio() {
  if (audioCtx?.state === "suspended") audioCtx.resume();
}
