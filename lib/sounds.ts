'use client';

/**
 * Hanguk — Audio Feedback
 * Uses the Web Audio API to play subtle tones on correct/incorrect answers.
 * No external libraries or audio files needed. Mute preference is a
 * persistent, app-wide client-side setting (localStorage) — a device
 * setting, not account data, so it isn't synced to the profile.
 */

const MUTE_KEY = 'hanguk:sound_muted';

export function isSoundMuted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(MUTE_KEY) === '1';
}

export function setSoundMuted(muted: boolean) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
}

let audioCtx: AudioContext | null = null;
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || (window as any).webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

/** Pleasant ascending chime for a correct answer */
export function playCorrect() {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  [783.99, 1046.5].forEach((freq, i) => {
    // G5 → C6
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);

    gain.gain.setValueAtTime(0.22, ctx.currentTime + i * 0.15);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + i * 0.15 + 0.5
    );

    osc.start(ctx.currentTime + i * 0.15);
    osc.stop(ctx.currentTime + i * 0.15 + 0.5);
  });
}

/** Bigger celebratory "ta-da!" for finishing a whole lesson/session — a
 *  step up from playCorrect's single ding, played once at the results
 *  screen rather than per-question. Not used on TOPIK tests, which stay
 *  silent throughout by design. Three layers: a punchy opening chord,
 *  a rising run, and a quick high sparkle flourish at the end. */
export function playLessonComplete() {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const note = (freq: number, start: number, duration: number, peak: number, type: OscillatorType = 'sine') => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(peak, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  };

  const t0 = ctx.currentTime;

  // Opening chord stab — C5 major triad, short and punchy for impact
  [523.25, 659.25, 783.99].forEach((freq) => note(freq, t0, 0.22, 0.16, 'triangle'));

  // Rising run — G5 → C6 → E6
  [783.99, 1046.5, 1318.51].forEach((freq, i) => note(freq, t0 + 0.2 + i * 0.11, 0.4, 0.22));

  // High sparkle flourish — quick shimmer at the very end
  [1567.98, 2093.0, 2637.02].forEach((freq, i) => note(freq, t0 + 0.56 + i * 0.07, 0.18, 0.12));
}

/** Low dull thud for a wrong / still learning answer */
export function playIncorrect() {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
  osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.15); // slide down

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.25);
}
