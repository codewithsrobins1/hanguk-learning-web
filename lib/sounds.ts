'use client';

/**
 * Hanguk — Audio Feedback
 * Uses the Web Audio API to play subtle tones on correct/incorrect answers.
 * No external libraries or audio files needed.
 */

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  return new (window.AudioContext || (window as any).webkitAudioContext)();
}

/** Pleasant ascending chime for a correct answer */
export function playCorrect() {
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
