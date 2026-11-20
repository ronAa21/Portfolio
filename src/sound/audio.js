import { useCallback, useEffect, useState } from "react";

/* =====================================================================
   SHARED SOUND ENGINE: everything is synthesized, no audio files needed
   The preference defaults to ON; browsers start playback on first gesture.
   ===================================================================== */
const SOUND_KEY = "aaronSound";

function readPreference() {
  try {
    return localStorage.getItem(SOUND_KEY) !== "0";
  } catch {
    return true;
  }
}

const audio = {
  ctx: null,
  on: readPreference(),
  started: false,
  ducked: false,
  track: "home",
  master: null,
  music: null,
  fx: null,
  step: 0,
  next: 0,
  timer: null,
};

// Music level, and the level it drops to while a video with sound is playing
const MUSIC_VOL = 0.7;
const DUCK_VOL = 0.13;

// notified whenever playback starts or stops, so the UI can show the real state
const subscribers = new Set();

const midiToFreq = (n) => 440 * Math.pow(2, (n - 69) / 12);

function tone(freq, at, dur, type, vol, dest, glideTo) {
  const osc = audio.ctx.createOscillator();
  const gain = audio.ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, at + dur);
  gain.gain.setValueAtTime(vol, at);
  gain.gain.exponentialRampToValueAtTime(0.001, at + dur);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(at);
  osc.stop(at + dur + 0.02);
}

function hat(at) {
  const buffer = audio.ctx.createBuffer(1, 1024, audio.ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = audio.ctx.createBufferSource();
  const gain = audio.ctx.createGain();
  const hp = audio.ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 7000;
  src.buffer = buffer;
  gain.gain.setValueAtTime(0.05, at);
  gain.gain.exponentialRampToValueAtTime(0.001, at + 0.04);
  src.connect(hp);
  hp.connect(gain);
  gain.connect(audio.music);
  src.start(at);
}

/* One loop per tab. Every track is four chords, eight steps each. */
const TRACKS = {
  home: {
    bpm: 104,
    lead: "square",
    bass: "triangle",
    leadVol: 0.05,
    bassVol: 0.16,
    hat: true,
    arp: [0, 1, 2, 3, 2, 1, 2, 1],
    chords: [
      [45, [57, 60, 64, 69]], // Am
      [41, [53, 57, 60, 65]], // F
      [48, [60, 64, 67, 72]], // C
      [43, [55, 59, 62, 67]], // G
    ],
  },
  about: {
    bpm: 84,
    lead: "triangle",
    bass: "sine",
    leadVol: 0.08,
    bassVol: 0.15,
    hat: false,
    arp: [0, 2, 1, 3, 2, 0, 3, 1],
    chords: [
      [50, [57, 62, 65, 69]], // Dm
      [46, [58, 62, 65, 70]], // Bb
      [41, [53, 57, 60, 65]], // F
      [48, [60, 64, 67, 72]], // C
    ],
  },
  portfolio: {
    bpm: 126,
    lead: "square",
    bass: "square",
    leadVol: 0.045,
    bassVol: 0.13,
    hat: true,
    arp: [0, 1, 2, 3, 1, 2, 3, 2],
    chords: [
      [40, [55, 59, 64, 67]], // Em
      [48, [60, 64, 67, 72]], // C
      [43, [55, 59, 62, 67]], // G
      [38, [57, 62, 66, 69]], // D
    ],
  },
  achievements: {
    bpm: 100,
    lead: "square",
    bass: "triangle",
    leadVol: 0.05,
    bassVol: 0.15,
    hat: true,
    arp: [0, 2, 3, 2, 1, 2, 3, 1],
    chords: [
      [48, [60, 64, 67, 72]], // C
      [43, [55, 59, 62, 67]], // G
      [45, [57, 60, 64, 69]], // Am
      [41, [53, 57, 60, 65]], // F
    ],
  },
  contact: {
    bpm: 92,
    lead: "sine",
    bass: "triangle",
    leadVol: 0.09,
    bassVol: 0.14,
    hat: false,
    arp: [0, 2, 1, 2, 3, 2, 1, 2],
    chords: [
      [48, [60, 64, 67, 72]], // C
      [45, [57, 60, 64, 69]], // Am
      [41, [53, 57, 60, 65]], // F
      [43, [55, 59, 62, 67]], // G
    ],
  },
};

function schedule() {
  const track = TRACKS[audio.track];
  const stepDur = 60 / track.bpm / 2;
  while (audio.next < audio.ctx.currentTime + 0.2) {
    const step = audio.step % 32;
    const [root, tones] = track.chords[step >> 3];
    const i = step & 7;
    const at = audio.next;
    tone(midiToFreq(tones[track.arp[i]]), at, stepDur * 0.9, track.lead, track.leadVol, audio.music);
    if (i % 2 === 0) tone(midiToFreq(root), at, stepDur * 1.8, track.bass, track.bassVol, audio.music);
    if (track.hat && i % 2 === 1) hat(at);
    if (i === 6 && (step >> 3) % 2 === 1) {
      tone(midiToFreq(tones[2] + 12), at, stepDur * 1.5, "square", 0.03, audio.music);
    }
    audio.next += stepDur;
    audio.step++;
  }
}

// Swapping mid-play is seamless: the scheduler picks up the new chords on the next step.
export function setTrack(name) {
  if (!TRACKS[name] || audio.track === name) return;
  audio.track = name;
  audio.step = 0;
  if (audio.ctx) audio.next = audio.ctx.currentTime + 0.06;
}

export const sfx = {
  select() {
    if (!audio.started) return;
    const at = audio.ctx.currentTime;
    tone(660, at, 0.07, "square", 0.12, audio.fx);
    tone(990, at + 0.07, 0.1, "square", 0.12, audio.fx);
  },
  start() {
    if (!audio.started) return;
    const at = audio.ctx.currentTime;
    [523, 659, 784, 1047].forEach((f, i) => tone(f, at + i * 0.08, 0.12, "square", 0.13, audio.fx));
    tone(1047, at + 0.32, 0.3, "triangle", 0.12, audio.fx);
  },
  back() {
    if (!audio.started) return;
    tone(520, audio.ctx.currentTime, 0.12, "square", 0.12, audio.fx, 300);
  },
  // modal dismiss: three falling steps, a small "power down"
  close() {
    if (!audio.started) return;
    const at = audio.ctx.currentTime;
    tone(784, at, 0.05, "square", 0.1, audio.fx);
    tone(587, at + 0.05, 0.05, "square", 0.1, audio.fx);
    tone(392, at + 0.1, 0.16, "triangle", 0.11, audio.fx, 196);
  },
  coin() {
    if (!audio.started) return;
    const at = audio.ctx.currentTime;
    tone(988, at, 0.07, "square", 0.12, audio.fx);
    tone(1319, at + 0.07, 0.3, "square", 0.12, audio.fx);
  },
  type() {
    if (!audio.started) return;
    tone(700 + Math.random() * 200, audio.ctx.currentTime, 0.03, "square", 0.03, audio.fx);
  },
  // one blip per loading segment (stat bars)
  tick(step = 0) {
    if (!audio.started) return;
    tone(540 + (step % 8) * 55, audio.ctx.currentTime, 0.045, "square", 0.06, audio.fx);
  },
  // short mechanical click layered under every press
  tap() {
    if (!audio.started) return;
    const at = audio.ctx.currentTime;
    tone(1180, at, 0.018, "square", 0.055, audio.fx);
    tone(720, at + 0.02, 0.03, "square", 0.04, audio.fx);
  },
};

function createContext() {
  if (audio.ctx) return true;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return false;
  audio.ctx = new AudioCtx();
  audio.master = audio.ctx.createGain();
  audio.master.gain.value = 0.6;
  audio.master.connect(audio.ctx.destination);
  audio.music = audio.ctx.createGain();
  audio.music.gain.value = 0;
  audio.music.connect(audio.master);
  audio.fx = audio.ctx.createGain();
  audio.fx.connect(audio.master);
  return true;
}

function beginMusic() {
  if (audio.started || !audio.ctx) return;
  audio.started = true;
  audio.music.gain.setTargetAtTime(
    audio.ducked ? DUCK_VOL : MUSIC_VOL,
    audio.ctx.currentTime,
    0.3
  );
  audio.step = 0;
  audio.next = audio.ctx.currentTime + 0.1;
  clearInterval(audio.timer);
  audio.timer = setInterval(schedule, 40);
  subscribers.forEach((fn) => fn(true));
  sfx.select();
}

function startAudio() {
  if (!createContext()) return false;
  Promise.resolve(audio.ctx.resume())
    .then(() => {
      if (audio.on && audio.ctx.state === "running") beginMusic();
    })
    .catch(() => {
      /* still waiting for a gesture */
    });
  return true;
}

function stopAudio() {
  if (!audio.ctx) return;
  audio.started = false;
  clearInterval(audio.timer);
  audio.timer = null;
  audio.music.gain.setTargetAtTime(0, audio.ctx.currentTime, 0.1);
  subscribers.forEach((fn) => fn(false));
}

/* ---------- public helpers ---------- */

// Drop the loop under a video that has its own audio, then bring it back.
export function duckMusic(ducked) {
  audio.ducked = ducked;
  if (!audio.ctx || !audio.music || !audio.started) return;
  audio.music.gain.setTargetAtTime(
    ducked ? DUCK_VOL : MUSIC_VOL,
    audio.ctx.currentTime,
    0.12
  );
}

// Lets the toggle show "tap for sound" until the browser actually lets us play.
export function onStarted(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

function applySound(enabled) {
  audio.on = enabled;
  try {
    localStorage.setItem(SOUND_KEY, enabled ? "1" : "0");
  } catch {
    /* storage blocked */
  }
  if (enabled) startAudio();
  else stopAudio();
  return true;
}

// Browsers keep audio locked until a real gesture. Listen for every kind, and
// keep listening: one blocked or swallowed tap must not be our only attempt.
const UNLOCK_EVENTS = ["pointerdown", "touchend", "click", "keydown"];

export function useSound() {
  const [on, setOn] = useState(() => audio.on);
  const [started, setStarted] = useState(audio.started);

  const toggle = useCallback(() => {
    const next = !audio.on;
    applySound(next);
    setOn(next);
    setStarted(audio.started);
  }, []);

  // retry playback from an explicit click on the toggle
  const unlockNow = useCallback(() => {
    startAudio();
  }, []);

  useEffect(() => onStarted(setStarted), []);

  useEffect(() => {
    // Try to start immediately; most browsers will wait for a gesture.
    if (audio.on && !audio.started) startAudio();

    const unlock = (event) => {
      if (event?.target?.closest?.("[data-snd]")) return;
      if (!audio.on || audio.started) return;
      startAudio();
    };
    UNLOCK_EVENTS.forEach((name) => window.addEventListener(name, unlock, { passive: true }));

    const onVisibility = () => {
      if (!audio.ctx) return;
      if (document.hidden) audio.ctx.suspend();
      else if (audio.on && audio.started) audio.ctx.resume();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      UNLOCK_EVENTS.forEach((name) => window.removeEventListener(name, unlock));
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return { on, started, toggle, unlockNow };
}
