import { getAudioContext } from "./sound";

// An original, gentle background loop generated live with Web Audio:
// soft pad chords (C – G – Am – F), a music-box arpeggio with echo, and a
// quiet bass. No audio files to download.

const BPM = 76;
const STEP = 60 / BPM / 2; // eighth notes
const LEVEL = 0.55;
const DUCKED = LEVEL * 0.12;
const STORAGE_KEY = "bday-bg-music";

const PROGRESSION = [
  { bass: 65.41, pad: [261.63, 329.63, 392.0], arp: [523.25, 659.25, 783.99, 659.25, 1046.5, 783.99, 659.25, 783.99] },
  { bass: 98.0, pad: [246.94, 293.66, 392.0], arp: [493.88, 587.33, 783.99, 587.33, 987.77, 783.99, 587.33, 783.99] },
  { bass: 110.0, pad: [220.0, 261.63, 329.63], arp: [440.0, 523.25, 659.25, 523.25, 880.0, 659.25, 523.25, 659.25] },
  { bass: 87.31, pad: [220.0, 261.63, 349.23], arp: [440.0, 523.25, 698.46, 523.25, 880.0, 698.46, 523.25, 698.46] },
];

let ctx;
let master;
let echoIn;
let scheduler;
let nextTime = 0;
let step = 0;
let playing = false;
let duckTimer;
let listening = false;

function note(freq, start, dur, { type = "sine", gain = 0.03, attack = 0.02, release = 0.4, detune = 0, echo = false } = {}) {
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, start);
  env.gain.linearRampToValueAtTime(gain, start + attack);
  env.gain.setValueAtTime(gain, start + Math.max(attack, dur - release));
  env.gain.exponentialRampToValueAtTime(0.0001, start + dur + release);

  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  osc.connect(env);
  env.connect(master);
  if (echo) env.connect(echoIn);

  osc.start(start);
  osc.stop(start + dur + release + 0.05);
}

function playStep(i, t) {
  const bar = Math.floor(i / 8) % PROGRESSION.length;
  const beat = i % 8;
  const loop = Math.floor(i / 32);
  const chord = PROGRESSION[bar];
  const barLength = STEP * 8;

  if (beat === 0) {
    // Warm pad: each chord tone doubled with a slight detune for width.
    chord.pad.forEach((f) => {
      note(f, t, barLength, { gain: 0.022, attack: 0.9, release: 1.2 });
      note(f, t, barLength, { gain: 0.016, attack: 1.1, release: 1.2, detune: 7, type: "triangle" });
    });
    note(chord.bass, t, STEP * 3, { gain: 0.07, attack: 0.03, release: 0.6 });
  }
  if (beat === 4) note(chord.bass, t, STEP * 2.5, { gain: 0.05, attack: 0.03, release: 0.5 });

  // Music-box arpeggio: sparser on even loops so it breathes and varies.
  const sparse = loop % 2 === 0;
  if (!sparse || beat % 2 === 0) {
    note(chord.arp[beat], t, STEP * 0.9, { type: "triangle", gain: 0.03, attack: 0.008, release: 0.7, echo: true });
  }
}

function schedule() {
  while (nextTime < ctx.currentTime + 0.6) {
    playStep(step, nextTime);
    step += 1;
    nextTime += STEP;
  }
}

function buildGraph() {
  master = ctx.createGain();
  master.gain.value = 0.0001;
  master.connect(ctx.destination);

  // Soft echo for the arpeggio.
  echoIn = ctx.createGain();
  echoIn.gain.value = 0.35;
  const delay = ctx.createDelay(1);
  delay.delayTime.value = STEP * 3;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.35;
  const damp = ctx.createBiquadFilter();
  damp.type = "lowpass";
  damp.frequency.value = 2600;
  echoIn.connect(delay);
  delay.connect(damp);
  damp.connect(feedback);
  feedback.connect(delay);
  damp.connect(master);
}

function fadeTo(value, seconds) {
  if (!master) return;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), now);
  master.gain.exponentialRampToValueAtTime(Math.max(0.0001, value), now + seconds);
}

function runScheduler() {
  clearInterval(scheduler);
  nextTime = ctx.currentTime + 0.1;
  scheduler = setInterval(schedule, 120);
}

// Pause the loop in a background tab; pick it back up when she returns.
function onVisibility() {
  if (!playing) return;
  if (document.hidden) {
    clearInterval(scheduler);
    fadeTo(0.0001, 0.3);
  } else {
    runScheduler();
    fadeTo(LEVEL, 1.5);
  }
}

export function isMusicEnabled() {
  return localStorage.getItem(STORAGE_KEY) !== "off";
}

export function startMusic() {
  if (playing) return;
  ctx = getAudioContext();
  buildGraph();
  step = 0;
  playing = true;
  runScheduler();
  fadeTo(LEVEL, 3);
  if (!listening) {
    document.addEventListener("visibilitychange", onVisibility);
    listening = true;
  }
}

export function stopMusicLoop() {
  if (!playing) return;
  playing = false;
  clearInterval(scheduler);
  clearTimeout(duckTimer);
  const old = master;
  fadeTo(0.0001, 0.8);
  setTimeout(() => old.disconnect(), 900);
}

export function setMusicEnabled(on) {
  localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  if (on) startMusic();
  else stopMusicLoop();
}

// Dip the music under something important (song, fireworks, video).
// Pass Infinity to hold the dip until unduckMusic() is called.
export function duckMusic(ms) {
  if (!playing) return;
  clearTimeout(duckTimer);
  fadeTo(DUCKED, 0.4);
  if (Number.isFinite(ms)) duckTimer = setTimeout(unduckMusic, ms);
}

export function unduckMusic() {
  if (!playing) return;
  clearTimeout(duckTimer);
  fadeTo(LEVEL, 1.5);
}
