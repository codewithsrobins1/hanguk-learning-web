'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDialogue } from '@/hooks/useShadowing';
import { useAuth } from '@/lib/auth';
import { addXp } from '@/lib/xp';

export default function ShadowSessionPage() {
  const { dialogueId } = useParams<{ dialogueId: string }>();
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const { dialogue, loading } = useDialogue(dialogueId);

  const [currentLine, setCurrentLine] = useState(0);
  const [showTranslations, setShowTranslations] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!dialogue)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8">
        <p className="text-muted text-center">Dialogue not found.</p>
        <button
          onClick={() => router.back()}
          className="bg-ink text-cream px-6 py-3 rounded-xl font-bold text-sm"
        >
          Go Back
        </button>
      </div>
    );

  const line = dialogue.lines[currentLine];
  const isFirst = currentLine === 0;
  const isLast = currentLine === dialogue.lines.length - 1;

  return (
    <div
      className="min-h-screen flex flex-col bg-cream"
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-3"
        style={{ background: '#1A1F36' }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-sm flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1.5px solid rgba(255,255,255,0.18)',
            color: '#F7F4EE',
          }}
        >
          ← Back
        </button>
        <div className="text-center flex-1 min-w-0">
          <p className="font-extrabold text-sm text-cream truncate">
            {dialogue.title}
          </p>
          <p
            className="text-[11px] text-gray-400"
            style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
          >
            {dialogue.title_ko}
          </p>
        </div>
        <button
          onClick={() => setShowTranslations((s) => !s)}
          className="px-3 py-2 rounded-xl font-bold text-sm flex-shrink-0"
          style={{
            background: showTranslations ? '#E8412C' : 'rgba(255,255,255,0.12)',
            border: showTranslations
              ? '1.5px solid #E8412C'
              : '1.5px solid rgba(255,255,255,0.18)',
            color: '#F7F4EE',
          }}
        >
          {showTranslations ? 'Hide EN' : 'Show EN'}
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ background: '#E8E3D8', height: 4 }}>
        <div
          style={{
            background: '#E8412C',
            height: 4,
            width: `${((currentLine + 1) / dialogue.lines.length) * 100}%`,
            transition: 'width 0.3s',
          }}
        />
      </div>

      {/* Dialogue bubbles */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2 pb-32">
        {dialogue.lines.map((l, i) => {
          const isA = l.speaker === 'A';
          const isActive = i === currentLine;
          const isPast = i < currentLine;

          return (
            <div
              key={i}
              className="flex gap-2"
              style={{
                flexDirection: isA ? 'row' : 'row-reverse',
                opacity: isPast ? 0.4 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {/* Avatar */}
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: isA ? '#1A1F36' : '#E8412C',
                  marginTop: 3,
                }}
              >
                <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>
                  {l.speaker}
                </span>
              </div>

              {/* Bubble */}
              <div
                onClick={() => setCurrentLine(i)}
                style={{
                  maxWidth: '74%',
                  padding: '11px 14px',
                  borderRadius: isA
                    ? '4px 16px 16px 16px'
                    : '16px 4px 16px 16px',
                  background: isActive ? (isA ? '#1A1F36' : '#E8412C') : '#fff',
                  border: `1.5px solid ${isActive ? 'transparent' : '#E8E3D8'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isActive ? '0 4px 16px rgba(0,0,0,0.15)' : 'none',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 19,
                    fontWeight: 600,
                    color: isActive ? '#F7F4EE' : '#111',
                    fontFamily: 'Noto Sans KR, sans-serif',
                    lineHeight: 1.5,
                  }}
                >
                  {l.korean}
                </p>
                {showTranslations && (
                  <p
                    style={{
                      margin: '5px 0 0',
                      fontSize: 15,
                      color: isActive ? 'rgba(255,255,255,0.65)' : '#888',
                      lineHeight: 1.4,
                    }}
                  >
                    {l.translation}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-5 py-4 flex gap-3 md:ml-56">
        <button
          onClick={() => setCurrentLine((l) => Math.max(0, l - 1))}
          disabled={isFirst}
          className="flex-1 py-3.5 rounded-xl border-[1.5px] border-border bg-white font-bold text-sm text-ink transition-colors hover:bg-cream disabled:opacity-40"
        >
          ← Prev
        </button>
        {isLast ? (
          <button
            onClick={async () => {
              if (xpEarned === 0 && user) {
                setXpEarned(10);
                await addXp(user.uid, 10);
                await refreshProfile();
              }
              router.back();
            }}
            className="flex-1 py-3.5 rounded-xl font-bold text-sm text-cream transition-opacity hover:opacity-90"
            style={{ background: '#E8412C' }}
          >
            {xpEarned > 0 ? `+${xpEarned} XP · Done ✓` : 'Finish +10 XP'}
          </button>
        ) : (
          <button
            onClick={() =>
              setCurrentLine((l) => Math.min(dialogue.lines.length - 1, l + 1))
            }
            className="flex-1 py-3.5 rounded-xl font-bold text-sm text-cream transition-opacity hover:opacity-90"
            style={{ background: '#1A1F36' }}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
