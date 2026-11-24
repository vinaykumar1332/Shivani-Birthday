// Lightweight synthesized audio — no external sound files needed.
// Browsers block autoplay audio, so every call here must follow a user gesture (a click).

let ctx;
function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

// Pause/resume all scheduled audio — used to mute the experience when its
// section scrolls out of view, without tracking every individual node.
export function suspendAudio() {
  if (ctx && ctx.state === "running") ctx.suspend();
}
export function resumeAudio() {
  if (ctx && ctx.state === "suspended") ctx.resume();
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
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

// Classic "Happy Birthday" opening phrase, synthesized note by note.
const NOTE = { C4: 261.6, D4: 293.7, E4: 329.6, F4: 349.2, G4: 392.0, A4: 440.0, B4: 493.9, C5: 523.3 };
const MELODY = [
  [NOTE.C4, 0.3], [NOTE.C4, 0.2], [NOTE.D4, 0.5], [NOTE.C4, 0.5], [NOTE.F4, 0.5], [NOTE.E4, 0.9],
  [NOTE.C4, 0.3], [NOTE.C4, 0.2], [NOTE.D4, 0.5], [NOTE.C4, 0.5], [NOTE.G4, 0.5], [NOTE.F4, 0.9],
];

export function playBirthdayMelody() {
  const audioCtx = getCtx();
  let t = audioCtx.currentTime + 0.05;
  MELODY.forEach(([freq, dur]) => {
    tone(freq, t, dur);
    t += dur * 0.95;
  });
  return (MELODY.reduce((sum, [, d]) => sum + d * 0.95, 0) + 0.2) * 1000;
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

  noise.connect(bandpass).connect(gain).connect(audioCtx.destination);
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
  osc.connect(filter).connect(gain).connect(audioCtx.destination);
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
  sub.connect(subGain).connect(audioCtx.destination);
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
  noise.connect(lowpass).connect(noiseGain).connect(audioCtx.destination);
  noise.start(startTime);
  noise.stop(startTime + duration + 0.05);
}

// Full fireworks sequence: rockets whistle up, explode into booms and
// crackle, staggered like a real show. Returns timing so visuals can sync.
export function playFireworks(count = 6) {
  const audioCtx = getCtx();
  const events = [];
  let t = audioCtx.currentTime + 0.05;

  for (let i = 0; i < count; i++) {
    const launchAt = t;
    const whistleDur = 0.32 + Math.random() * 0.26;
    whistle(launchAt, whistleDur, 0.15 + Math.random() * 0.05);

    const boomAt = launchAt + whistleDur;
    boom(boomAt, 0.3 + Math.random() * 0.14);

    const crackleCount = 2 + Math.floor(Math.random() * 3);
    for (let k = 0; k < crackleCount; k++) {
      pop(boomAt + 0.05 + k * 0.06, 0.18);
    }

    events.push({
      launchDelayMs: (launchAt - audioCtx.currentTime) * 1000,
      boomDelayMs: (boomAt - audioCtx.currentTime) * 1000,
      flightMs: whistleDur * 1000,
    });

    t = boomAt + 0.22 + Math.random() * 0.3;
  }

  const totalMs = (t - audioCtx.currentTime) * 1000 + 250;
  return { events, totalMs };
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

  noise.connect(filter).connect(gain).connect(audioCtx.destination);
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

export function playChime() {
  const audioCtx = getCtx();
  const t = audioCtx.currentTime;
  [NOTE.C5, NOTE.E4, NOTE.G4].forEach((f, i) => tone(f, t + i * 0.06, 0.4, 0.12));
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
