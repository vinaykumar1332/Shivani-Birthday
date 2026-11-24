// Lightweight synthesized audio — no external sound files needed.
// Browsers block autoplay audio, so every call here must follow a user gesture (a click).

let ctx;
function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export const getAudioContext = getCtx;

// Sound-effects bus (crackers, whooshes, ticks). Kept separate from the music
// bus so a fireworks show can be cut instantly without touching the song.
let sfx;
function getSfx() {
  const audioCtx = getCtx();
  if (!sfx) {
    sfx = audioCtx.createGain();
    sfx.gain.value = 0.9;
    sfx.connect(audioCtx.destination);
  }
  return sfx;
}

export function stopSfx() {
  if (!sfx) return;
  sfx.disconnect();
  sfx = null;
}

function noiseBuffer(seconds, shape = () => 1) {
  const audioCtx = getCtx();
  const size = Math.max(1, Math.floor(audioCtx.sampleRate * seconds));
  const buffer = audioCtx.createBuffer(1, size, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = (Math.random() * 2 - 1) * shape(i / size);
  return buffer;
}

function tone(freq, startTime, duration, gainPeak = 0.18) {
  const audioCtx = getCtx();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.connect(gain).connect(getSfx());
  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

// Shared music bus: gentle compression plus a soft filtered echo, so the
// melody sounds warm and full instead of like a bare test tone.
let bus;
function getBus() {
  const audioCtx = getCtx();
  if (bus) return bus;

  const input = audioCtx.createGain();
  input.gain.value = 0.9;

  const comp = audioCtx.createDynamicsCompressor();
  comp.threshold.value = -14;
  comp.knee.value = 20;
  comp.ratio.value = 4;

  const delay = audioCtx.createDelay(1);
  delay.delayTime.value = 0.27;
  const feedback = audioCtx.createGain();
  feedback.gain.value = 0.28;
  const wet = audioCtx.createGain();
  wet.gain.value = 0.22;
  const damp = audioCtx.createBiquadFilter();
  damp.type = "lowpass";
  damp.frequency.value = 3200;

  input.connect(comp);
  input.connect(delay);
  delay.connect(damp);
  damp.connect(feedback);
  feedback.connect(delay);
  damp.connect(wet);
  wet.connect(comp);
  comp.connect(audioCtx.destination);

  bus = input;
  return bus;
}

// Hard-stop any song in flight: every scheduled note feeds the bus input, so
// disconnecting it silences them all. The next note builds a fresh bus.
export function stopMusic() {
  if (!bus) return;
  bus.disconnect();
  bus = null;
}

// A music-box style voice: triangle fundamental plus a soft octave harmonic.
function voice(freq, start, dur, { type = "triangle", gain = 0.16, attack = 0.02, release = 0.25, harmonic = 0.22 } = {}) {
  const audioCtx = getCtx();
  const out = audioCtx.createGain();
  out.gain.setValueAtTime(0.0001, start);
  out.gain.linearRampToValueAtTime(gain, start + attack);
  out.gain.exponentialRampToValueAtTime(gain * 0.55, start + attack + dur * 0.4);
  out.gain.exponentialRampToValueAtTime(0.0001, start + dur + release);

  const fundamental = audioCtx.createOscillator();
  fundamental.type = type;
  fundamental.frequency.value = freq;
  const overtone = audioCtx.createOscillator();
  overtone.type = "sine";
  overtone.frequency.value = freq * 2;
  const overtoneGain = audioCtx.createGain();
  overtoneGain.gain.value = harmonic;

  fundamental.connect(out);
  overtone.connect(overtoneGain).connect(out);
  out.connect(getBus());

  const end = start + dur + release + 0.05;
  fundamental.start(start);
  overtone.start(start);
  fundamental.stop(end);
  overtone.stop(end);
}

const N = {
  F2: 87.31, G2: 98, A2: 110, B2: 123.47, C3: 130.81, D3: 146.83, E3: 164.81, G3: 196,
  G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, C6: 1046.5, E6: 1318.5,
};
const CHORDS = { C: [N.C3, N.E3, N.G3], G: [N.G2, N.B2, N.D3], F: [N.F2, N.A2, N.C3] };
const BEAT = 0.42;

// The full song — all four phrases — as [note, beats, chord-to-start-here].
const SONG = [
  [N.G4, 0.75], [N.G4, 0.25], [N.A4, 1, "C"], [N.G4, 1], [N.C5, 1], [N.B4, 2, "G"],
  [N.G4, 0.75], [N.G4, 0.25], [N.A4, 1, "G"], [N.G4, 1], [N.D5, 1], [N.C5, 2, "C"],
  [N.G4, 0.75], [N.G4, 0.25], [N.G5, 1, "C"], [N.E5, 1], [N.C5, 1], [N.B4, 1, "F"], [N.A4, 2],
  [N.F5, 0.75], [N.F5, 0.25], [N.E5, 1, "C"], [N.C5, 1], [N.D5, 1, "G"], [N.C5, 2.5, "C"],
];

export function playBirthdayMelody() {
  const audioCtx = getCtx();
  let t = audioCtx.currentTime + 0.08;

  SONG.forEach(([freq, beats, chord]) => {
    const dur = beats * BEAT;
    voice(freq, t, dur * 0.92, { gain: 0.17 });
    if (chord) {
      CHORDS[chord].forEach((f) =>
        voice(f, t, BEAT * 2.6, { type: "sine", gain: 0.05, attack: 0.08, release: 0.4, harmonic: 0.1 })
      );
    }
    t += dur;
  });

  return (t - audioCtx.currentTime + 0.4) * 1000;
}

// A rising sparkle arpeggio — the "magic" sound for reveals.
export function playMagicChime() {
  const audioCtx = getCtx();
  const t = audioCtx.currentTime + 0.02;
  [N.C5, N.E5, N.G5, N.C6, N.E6].forEach((f, i) =>
    voice(f, t + i * 0.07, 0.45, { gain: 0.1, harmonic: 0.3, release: 0.5 })
  );
}

// A burst of synthesized firecracker "pops" — filtered noise with a sharp
// attack/decay envelope, randomly staggered like real crackers going off.
function pop(startTime, volume = 0.3) {
  const audioCtx = getCtx();
  const duration = 0.18 + Math.random() * 0.08;
  const bufferSize = Math.floor(audioCtx.sampleRate * duration);
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const bandpass = audioCtx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 900 + Math.random() * 1400;
  bandpass.Q.value = 0.8;

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  noise.connect(bandpass).connect(gain).connect(getSfx());
  noise.start(startTime);
  noise.stop(startTime + duration + 0.02);
}

export function playCrackers(count = 10) {
  const audioCtx = getCtx();
  let t = audioCtx.currentTime + 0.02;
  let totalMs = 0;
  for (let i = 0; i < count; i++) {
    pop(t, 0.3 + Math.random() * 0.2);
    const gap = 0.08 + Math.random() * 0.16;
    t += gap;
    totalMs += gap * 1000;
    if (Math.random() < 0.3) {
      pop(t - gap / 2, 0.2);
    }
  }
  return totalMs + 150;
}

// Rocket launch: a rising pitch whistle.
function whistle(startTime, duration, volume = 0.16) {
  const audioCtx = getCtx();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(280, startTime);
  osc.frequency.exponentialRampToValueAtTime(1500, startTime + duration);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + duration * 0.4);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  const filter = audioCtx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 400;
  osc.connect(filter).connect(gain).connect(getSfx());
  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

// Firework explosion: a deep sub-bass thump plus a wide noise boom.
function boom(startTime, volume = 0.34) {
  const audioCtx = getCtx();
  const duration = 0.6 + Math.random() * 0.2;

  const sub = audioCtx.createOscillator();
  const subGain = audioCtx.createGain();
  sub.type = "sine";
  sub.frequency.setValueAtTime(110, startTime);
  sub.frequency.exponentialRampToValueAtTime(40, startTime + 0.35);
  subGain.gain.setValueAtTime(volume, startTime);
  subGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.4);
  sub.connect(subGain).connect(getSfx());
  sub.start(startTime);
  sub.stop(startTime + 0.45);

  const bufferSize = Math.floor(audioCtx.sampleRate * duration);
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.6);
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const lowpass = audioCtx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 1800;
  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(volume * 0.8, startTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  noise.connect(lowpass).connect(noiseGain).connect(getSfx());
  noise.start(startTime);
  noise.stop(startTime + duration + 0.05);
}

// ---- Cracker sounds, one per firework type. The visual engine triggers these
// at the matching moments (launch, burst, ignition) so sound and sight line up.

// `volume` (0–1) lets continuous/background shows sit quieter than the main event.
export function playRocketWhistle(flightMs, volume = 1) {
  const t = getCtx().currentTime + 0.02;
  whistle(t, flightMs / 1000, 0.12 * volume);
}

// Shell burst: boom plus a crackle tail; willow/big shells boom deeper.
export function playBurst(big = false, volume = 1) {
  const t = getCtx().currentTime + 0.01;
  boom(t, (big ? 0.42 : 0.3) * volume);
  const crackles = 3 + Math.floor(Math.random() * 4);
  for (let k = 0; k < crackles; k++) pop(t + 0.08 + k * 0.05 + Math.random() * 0.04, 0.12 * volume);
}

// Anaar (flower pot): a long fizzing hiss with a natural flutter.
export function playFountain(durationMs) {
  const audioCtx = getCtx();
  const t = audioCtx.currentTime + 0.02;
  const dur = durationMs / 1000;

  const noise = audioCtx.createBufferSource();
  noise.buffer = noiseBuffer(dur);
  const band = audioCtx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 4200;
  band.Q.value = 0.6;

  const env = audioCtx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.linearRampToValueAtTime(0.11, t + 0.35);
  env.gain.setValueAtTime(0.11, t + dur - 0.4);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  const flutter = audioCtx.createOscillator();
  flutter.frequency.value = 13;
  const flutterDepth = audioCtx.createGain();
  flutterDepth.gain.value = 0.035;
  flutter.connect(flutterDepth).connect(env.gain);

  noise.connect(band).connect(env).connect(getSfx());
  noise.start(t);
  flutter.start(t);
  noise.stop(t + dur + 0.05);
  flutter.stop(t + dur + 0.05);
}

// Chakri (ground spinner): a whirring whizz that speeds up as it spins.
export function playChakri(durationMs) {
  const audioCtx = getCtx();
  const t = audioCtx.currentTime + 0.02;
  const dur = durationMs / 1000;

  const noise = audioCtx.createBufferSource();
  noise.buffer = noiseBuffer(dur);
  const band = audioCtx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 2400;
  band.Q.value = 3.5;

  const spin = audioCtx.createOscillator();
  spin.frequency.setValueAtTime(5, t);
  spin.frequency.linearRampToValueAtTime(12, t + dur * 0.6);
  const spinDepth = audioCtx.createGain();
  spinDepth.gain.value = 1100;
  spin.connect(spinDepth).connect(band.frequency);

  const env = audioCtx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.linearRampToValueAtTime(0.1, t + 0.25);
  env.gain.setValueAtTime(0.1, t + dur - 0.35);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  noise.connect(band).connect(env).connect(getSfx());
  noise.start(t);
  spin.start(t);
  noise.stop(t + dur + 0.05);
  spin.stop(t + dur + 0.05);
}

// Sparkler (phuljhadi): faint hiss sprinkled with tiny sharp crackles.
export function playSparkler(durationMs) {
  const audioCtx = getCtx();
  const t = audioCtx.currentTime + 0.02;
  const dur = durationMs / 1000;

  const noise = audioCtx.createBufferSource();
  noise.buffer = noiseBuffer(dur, () => (Math.random() < 0.002 ? 9 : 0.25));
  const high = audioCtx.createBiquadFilter();
  high.type = "highpass";
  high.frequency.value = 3000;

  const env = audioCtx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.linearRampToValueAtTime(0.07, t + 0.2);
  env.gain.setValueAtTime(0.07, t + dur - 0.3);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  noise.connect(high).connect(env).connect(getSfx());
  noise.start(t);
  noise.stop(t + dur + 0.05);
}

// Jet fly-by: a rushing roar that rises and falls (a cheap Doppler) while
// panning across the stereo field in the plane's direction of travel.
export function playJetFlyby(durationMs, direction = 1) {
  const audioCtx = getCtx();
  const t = audioCtx.currentTime + 0.02;
  const dur = durationMs / 1000;

  const noise = audioCtx.createBufferSource();
  noise.buffer = noiseBuffer(dur);

  const band = audioCtx.createBiquadFilter();
  band.type = "bandpass";
  band.Q.value = 0.9;
  band.frequency.setValueAtTime(500, t);
  band.frequency.linearRampToValueAtTime(1400, t + dur * 0.45);
  band.frequency.linearRampToValueAtTime(420, t + dur);

  const env = audioCtx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.linearRampToValueAtTime(0.16, t + dur * 0.45);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  let chain = noise.connect(band).connect(env);
  if (audioCtx.createStereoPanner) {
    const pan = audioCtx.createStereoPanner();
    pan.pan.setValueAtTime(-0.9 * direction, t);
    pan.pan.linearRampToValueAtTime(0.9 * direction, t + dur);
    chain = chain.connect(pan);
  }
  chain.connect(getSfx());

  noise.start(t);
  noise.stop(t + dur + 0.05);
}

// A soft "fffhh" breath — someone blowing out the candles.
export function playBlow() {
  const audioCtx = getCtx();
  const t = audioCtx.currentTime + 0.01;
  const dur = 0.75;

  const noise = audioCtx.createBufferSource();
  noise.buffer = noiseBuffer(dur);
  const lowpass = audioCtx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.Q.value = 0.7;
  lowpass.frequency.setValueAtTime(600, t);
  lowpass.frequency.exponentialRampToValueAtTime(1800, t + 0.15);
  lowpass.frequency.exponentialRampToValueAtTime(400, t + dur);

  const env = audioCtx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.linearRampToValueAtTime(0.24, t + 0.08);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  noise.connect(lowpass).connect(env).connect(getSfx());
  noise.start(t);
  noise.stop(t + dur + 0.05);
}

// Ground bomb: the biggest bang — deep thump, wide blast, then a crackle.
export function playBomb() {
  const t = getCtx().currentTime + 0.01;
  boom(t, 0.55);
  boom(t + 0.02, 0.3);
  for (let k = 0; k < 4; k++) pop(t + 0.12 + k * 0.07, 0.16);
}

// A soft air "whoosh" — bandpass noise swept upward, like a card sliding out.
function whoosh(startTime, duration = 0.3, volume = 0.14) {
  const audioCtx = getCtx();
  const bufferSize = Math.floor(audioCtx.sampleRate * duration);
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 1.1;
  filter.frequency.setValueAtTime(400, startTime);
  filter.frequency.exponentialRampToValueAtTime(2800, startTime + duration);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + duration * 0.3);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  noise.connect(filter).connect(gain).connect(getSfx());
  noise.start(startTime);
  noise.stop(startTime + duration + 0.02);
}

// A crisp little tick — like a card snapping into place.
function cardTick(startTime, volume = 0.12) {
  tone(1400, startTime, 0.05, volume);
  tone(2000, startTime + 0.02, 0.04, volume * 0.6);
}

// A deck of cards bursting out and snapping into a fan — whoosh + ticks,
// staggered per card. Returns per-card timing so visuals can sync.
export function playCardsBurst(count = 4) {
  const audioCtx = getCtx();
  const events = [];
  let t = audioCtx.currentTime + 0.05;

  for (let i = 0; i < count; i++) {
    const whooshDur = 0.26 + Math.random() * 0.1;
    whoosh(t, whooshDur, 0.15);
    const tickAt = t + whooshDur * 0.85;
    cardTick(tickAt);
    events.push({ delayMs: (t - audioCtx.currentTime) * 1000 });
    t += 0.16 + Math.random() * 0.06;
  }

  const totalMs = (t - audioCtx.currentTime) * 1000 + 300;
  return { events, totalMs };
}

export function speak(text, { rate = 0.95, pitch = 1.1 } = {}) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = rate;
  utter.pitch = pitch;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find((v) => /female|zira|samantha|google uk english female/i.test(v.name));
  if (preferred) utter.voice = preferred;
  window.speechSynthesis.speak(utter);
}
