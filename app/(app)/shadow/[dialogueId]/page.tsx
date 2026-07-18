'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDialogue, saveDialogueProgress } from '@/hooks/useShadowing';
import { useAuth } from '@/lib/auth';
import { addXp } from '@/lib/xp';

type RecordState = 'idle' | 'requesting' | 'recording' | 'processing';

type LineResult = {
  status: 'graded' | 'skipped';
  score?: number;
  feedback?: string;
  transcript?: string;
};

function scoreBadge(score: number) {
  if (score >= 86)
    return { emoji: '✅', color: '#16A34A', bg: '#F0FFF4', border: '#86EFAC' };
  if (score >= 61)
    return { emoji: '🟡', color: '#F97316', bg: '#FFF7ED', border: '#FED7AA' };
  return { emoji: '❌', color: '#E8412C', bg: '#FFF0EE', border: '#FCA5A5' };
}

function calcAvg(results: Record<number, LineResult>) {
  const graded = Object.values(results).filter(
    (r) => r.status === 'graded' && r.score != null
  );
  if (!graded.length) return null;
  return Math.round(
    graded.reduce((s, r) => s + (r.score ?? 0), 0) / graded.length
  );
}

export default function ShadowSessionPage() {
  const { dialogueId } = useParams<{ dialogueId: string }>();
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const { dialogue, loading } = useDialogue(dialogueId);

  const [currentLine, setCurrentLine] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [recordState, setRecordState] = useState<RecordState>('idle');
  const [results, setResults] = useState<Record<number, LineResult>>({});
  const [sessionDone, setSessionDone] = useState(false);
  const [newBest, setNewBest] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const currentBubbleRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to current line
  useEffect(() => {
    currentBubbleRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [currentLine]);

  // ── Recording ─────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    setPermissionDenied(false);
    setRecordState('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : '';
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setRecordState('recording');
    } catch {
      setPermissionDenied(true);
      setRecordState('idle');
    }
  }, []);

  const stopRecording = useCallback(() => {
    const mr = mediaRecorderRef.current;
    if (!mr) return;
    setRecordState('processing');
    mr.onstop = async () => {
      mr.stream.getTracks().forEach((t) => t.stop());
      const mimeType = mr.mimeType || 'audio/webm';
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const expected = dialogue?.lines[currentLine]?.korean ?? '';
      try {
        const fd = new FormData();
        fd.append('audio', blob);
        fd.append('expected', expected);
        const res = await fetch('/api/shadow/evaluate', {
          method: 'POST',
          body: fd,
        });
        const data = await res.json();
        setResults((prev) => ({
          ...prev,
          [currentLine]: {
            status: 'graded',
            score: data.score,
            feedback: data.feedback,
            transcript: data.transcript,
          },
        }));
      } catch {
        setResults((prev) => ({
          ...prev,
          [currentLine]: { status: 'skipped' },
        }));
      } finally {
        setRecordState('idle');
      }
    };
    mr.stop();
  }, [dialogue, currentLine]);

  const skipLine = () =>
    setResults((prev) => ({ ...prev, [currentLine]: { status: 'skipped' } }));

  const retryLine = () => {
    setResults((prev) => {
      const n = { ...prev };
      delete n[currentLine];
      return n;
    });
    setRecordState('idle');
  };

  const goNext = async () => {
    if (!dialogue) return;
    const next = currentLine + 1;
    if (next >= dialogue.lines.length) {
      const sessionScore = calcAvg(results);
      if (user) {
        await saveDialogueProgress(
          user.uid,
          dialogueId,
          sessionScore ?? undefined
        );
        const xp = sessionScore != null && sessionScore >= 86 ? 15 : 10;
        setXpEarned(xp);
        await addXp(user.uid, xp);
        await refreshProfile();
        if (sessionScore != null) setNewBest(true);
      }
      setSessionDone(true);
    } else {
      setCurrentLine(next);
      setRecordState('idle');
    }
  };

  const practiceAgain = () => {
    setCurrentLine(0);
    setResults({});
    setSessionDone(false);
    setRecordState('idle');
    setNewBest(false);
    setXpEarned(0);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!dialogue)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8">
        <p className="text-muted">Dialogue not found.</p>
        <button
          onClick={() => router.back()}
          className="bg-ink text-cream px-6 py-3 rounded-xl font-bold text-sm"
        >
          Go Back
        </button>
      </div>
    );

  const lineResult = results[currentLine];
  const isGraded = lineResult?.status === 'graded';
  const isSkipped = lineResult?.status === 'skipped';
  const isAnswered = isGraded || isSkipped;
  const sessionScore = calcAvg(results);
  const gradedCount = Object.values(results).filter(
    (r) => r.status === 'graded'
  ).length;
  const skippedCount = Object.values(results).filter(
    (r) => r.status === 'skipped'
  ).length;

  // ── Session complete ─────────────────────────────────────────
  if (sessionDone) {
    return (
      <div className="max-w-xl mx-auto px-6 py-10 flex flex-col items-center">
        <span className="text-5xl mb-4">🎉</span>
        <h2 className="text-2xl font-extrabold text-ink mb-1">
          Session Complete!
        </h2>
        {sessionScore != null ? (
          <>
            <p
              className="text-5xl font-extrabold mb-1 mt-4"
              style={{ color: scoreBadge(sessionScore).color }}
            >
              {sessionScore}%
            </p>
            {newBest && (
              <p
                className="text-sm font-bold mb-1"
                style={{ color: '#F59E0B' }}
              >
                🏆 New best score!
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-muted mt-4 mb-1">No lines graded</p>
        )}
        <p className="text-xs text-muted mb-2">
          {gradedCount} attempted · {skippedCount} skipped
        </p>
        {xpEarned > 0 && (
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl mb-6"
            style={{ background: '#F0F7FF' }}
          >
            <span>⚡</span>
            <p className="text-sm font-bold text-ink">+{xpEarned} XP earned</p>
          </div>
        )}
        <div className="w-full bg-white rounded-2xl border border-border overflow-hidden mb-6">
          {dialogue.lines.map((l, i) => {
            const r = results[i];
            const badge =
              r?.status === 'graded' && r.score != null
                ? scoreBadge(r.score)
                : null;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3 ${i < dialogue.lines.length - 1 ? 'border-b border-border' : ''}`}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold"
                  style={{
                    background: badge?.bg ?? '#F7F4EE',
                    color: badge?.color ?? '#888',
                  }}
                >
                  {r?.status === 'graded' ? `${r.score}` : '—'}
                </div>
                <p
                  className="text-xs text-ink truncate flex-1"
                  style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
                >
                  {l.korean.slice(0, 45)}
                  {l.korean.length > 45 ? '…' : ''}
                </p>
                {badge && <span className="flex-shrink-0">{badge.emoji}</span>}
                {r?.status === 'skipped' && (
                  <span className="text-[11px] text-muted flex-shrink-0">
                    skipped
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={practiceAgain}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-cream hover:opacity-90"
            style={{ background: '#1A1F36' }}
          >
            🔄 Practice Again
          </button>
          <button
            onClick={() => router.push('/shadow')}
            className="w-full py-3.5 rounded-xl border-[1.5px] border-border font-bold text-sm text-ink hover:bg-cream transition-colors"
          >
            ← Back to Dialogues
          </button>
        </div>
      </div>
    );
  }

  // ── Main session ─────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      {/* Header */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-3 flex-shrink-0"
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
          onClick={() => setShowTranslation((s) => !s)}
          className="px-3 py-2 rounded-xl font-bold text-sm flex-shrink-0"
          style={{
            background: showTranslation ? '#F97316' : 'rgba(255,255,255,0.12)',
            border: showTranslation
              ? '1.5px solid #F97316'
              : '1.5px solid rgba(255,255,255,0.18)',
            color: '#F7F4EE',
          }}
        >
          {showTranslation ? 'Hide EN' : 'Show EN'}
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ background: '#E8E3D8', height: 4, flexShrink: 0 }}>
        <div
          style={{
            background: '#F97316',
            height: 4,
            width: `${((currentLine + 1) / dialogue.lines.length) * 100}%`,
            transition: 'width 0.3s',
          }}
        />
      </div>

      {/* Dialogue bubbles — scrollable */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
        style={{ paddingBottom: permissionDenied ? 220 : 160 }}
      >
        {dialogue.lines.map((l, i) => {
          const isA = l.speaker === 'A';
          const isCurrent = i === currentLine;
          const isPast = i < currentLine;
          const isFuture = i > currentLine;
          const r = results[i];
          const badge =
            r?.status === 'graded' && r.score != null
              ? scoreBadge(r.score)
              : null;

          return (
            <div
              key={i}
              ref={isCurrent ? currentBubbleRef : null}
              style={{
                opacity: isFuture ? 0.35 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              <div className={`flex gap-2 ${isA ? '' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: isA ? '#1A1F36' : '#F97316',
                    marginTop: 3,
                  }}
                >
                  <span
                    style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}
                  >
                    {l.speaker}
                  </span>
                </div>

                {/* Bubble */}
                <div
                  style={{
                    maxWidth: '74%',
                    padding: '11px 14px',
                    borderRadius: isA
                      ? '4px 16px 16px 16px'
                      : '16px 4px 16px 16px',
                    background: isCurrent
                      ? isA
                        ? '#1A1F36'
                        : '#F97316'
                      : '#fff',
                    border: isCurrent
                      ? '2.5px solid transparent'
                      : `1.5px solid ${isCurrent ? 'transparent' : '#E8E3D8'}`,
                    boxShadow: isCurrent
                      ? '0 4px 16px rgba(0,0,0,0.15)'
                      : 'none',
                    outline: isCurrent ? '2.5px solid #F97316' : 'none',
                    outlineOffset: 2,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 600,
                      color: isCurrent ? '#F7F4EE' : '#111',
                      fontFamily: 'Noto Sans KR, sans-serif',
                      lineHeight: 1.5,
                    }}
                  >
                    {l.korean}
                  </p>
                  {showTranslation && (
                    <p
                      style={{
                        margin: '5px 0 0',
                        fontSize: 13,
                        color: isCurrent ? 'rgba(255,255,255,0.65)' : '#888',
                        lineHeight: 1.4,
                      }}
                    >
                      {l.translation}
                    </p>
                  )}
                </div>

                {/* Score badge on past lines */}
                {(isPast || (isCurrent && isAnswered)) && r && (
                  <div className="flex items-center flex-shrink-0 self-center">
                    {badge ? (
                      <span
                        className="text-sm font-bold px-2 py-0.5 rounded-full text-[11px]"
                        style={{
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                        }}
                      >
                        {r.score}%
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted px-2">—</span>
                    )}
                  </div>
                )}
              </div>

              {/* Inline feedback for current graded line */}
              {isCurrent && isGraded && lineResult.feedback && (
                <div
                  className="mt-2 mx-8 px-3 py-2 rounded-xl text-xs text-muted leading-relaxed"
                  style={{ background: '#fff', border: '1px solid #E8E3D8' }}
                >
                  {lineResult.feedback}
                  {showTranslation && lineResult.transcript && (
                    <p className="mt-1 text-[11px]">
                      Heard:{' '}
                      <span
                        className="font-semibold text-ink"
                        style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
                      >
                        {lineResult.transcript}
                      </span>
                    </p>
                  )}
                </div>
              )}
              {isCurrent && isSkipped && (
                <div
                  className="mt-2 mx-8 px-3 py-1.5 rounded-xl text-xs text-muted text-center"
                  style={{ background: '#fff', border: '1px solid #E8E3D8' }}
                >
                  Skipped — no worries!
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fixed bottom controls */}
      <div className="fixed bottom-0 md:bottom-0 left-0 right-0 md:ml-56 bg-white border-t border-border px-5 py-4 flex flex-col gap-2">
        {permissionDenied && (
          <p
            className="text-[11px] font-bold text-center"
            style={{ color: '#E8412C' }}
          >
            Microphone access denied — enable it in your browser settings.
          </p>
        )}

        <div className="flex gap-3">
          {!isAnswered ? (
            <>
              {recordState === 'idle' && (
                <button
                  onClick={startRecording}
                  className="btn-press-orange flex-1 py-3.5 rounded-2xl font-quicksand font-bold text-sm text-cream flex items-center justify-center gap-2"
                  style={{ background: '#F97316' }}
                >
                  🎤 Tap to Record
                </button>
              )}
              {recordState === 'requesting' && (
                <div className="flex-1 py-3.5 rounded-xl font-bold text-sm text-muted bg-border flex items-center justify-center">
                  Requesting mic...
                </div>
              )}
              {recordState === 'recording' && (
                <button
                  onClick={stopRecording}
                  className="btn-press-orange flex-1 py-3.5 rounded-2xl font-quicksand font-bold text-sm text-white flex items-center justify-center gap-2 animate-pulse"
                  style={{ background: '#F97316' }}
                >
                  ⏹ Stop Recording
                </button>
              )}
              {recordState === 'processing' && (
                <div className="flex-1 py-3.5 rounded-xl font-bold text-sm text-muted bg-white border border-border flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-muted border-t-transparent rounded-full animate-spin" />
                  Evaluating...
                </div>
              )}
              {recordState !== 'processing' && (
                <button
                  onClick={skipLine}
                  className="px-5 py-3.5 rounded-xl border-[1.5px] border-border bg-white font-bold text-sm text-muted hover:border-ink hover:text-ink transition-colors"
                >
                  Skip →
                </button>
              )}
            </>
          ) : (
            <>
              {isGraded && (
                <button
                  onClick={retryLine}
                  className="flex-1 py-3.5 rounded-xl border-[1.5px] border-border bg-white font-bold text-sm text-ink hover:bg-cream transition-colors"
                >
                  🔄 Try Again
                </button>
              )}
              <button
                onClick={goNext}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm text-cream hover:opacity-90 transition-opacity"
                style={{ background: '#1A1F36' }}
              >
                {currentLine + 1 >= dialogue.lines.length
                  ? 'Finish ✓'
                  : 'Next →'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
