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
