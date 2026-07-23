'use client';
import { useState, useEffect } from 'react';
import { isSoundMuted, setSoundMuted } from '@/lib/sounds';

export default function SoundToggleButton({ className }: { className?: string }) {
  const [muted, setMuted] = useState(false);
  useEffect(() => { setMuted(isSoundMuted()); }, []);

  return (
    <button
      type="button"
      onClick={() => { const next = !muted; setMuted(next); setSoundMuted(next); }}
      title={muted ? 'Enable sounds' : 'Mute sounds'}
      aria-label={muted ? 'Enable sounds' : 'Mute sounds'}
      className={className ?? 'text-lg text-muted hover:text-ink transition-colors'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
