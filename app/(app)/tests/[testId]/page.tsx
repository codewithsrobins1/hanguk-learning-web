'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useTopikTest, saveTopikAttempt } from '@/hooks/useTopik';
import { addXp } from '@/lib/xp';
import { CIRCLED } from '@/lib/format';
import ReportIssueButton from '@/components/ReportIssueButton';

const TEST_DURATION_SECONDS = 25 * 60;

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

type Phase = 'reading' | 'transition' | 'listening';

export default function TopikTestSessionPage() {
  const { testId } = useParams<{ testId: string }>();
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const { test, loading } = useTopikTest(testId);

  const [phase, setPhase] = useState<Phase>('reading');
  const [readingIndex, setReadingIndex] = useState(0);
  const [listeningIndex, setListeningIndex] = useState(0);
  const [readingAnswers, setReadingAnswers] = useState<Record<number, number>>({});
  const [listeningAnswers, setListeningAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_SECONDS);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const testRef = useRef(test);
  testRef.current = test;
  const readingAnswersRef = useRef(readingAnswers);
  readingAnswersRef.current = readingAnswers;
  const listeningAnswersRef = useRef(listeningAnswers);
  listeningAnswersRef.current = listeningAnswers;
  const timeLeftRef = useRef(timeLeft);
  timeLeftRef.current = timeLeft;
  const submittedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ── Countdown timer ──────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          submitRef.current();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Warn on tab close / refresh ──────────────────────────────
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (submittedRef.current) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  // ── Intercept browser back button ────────────────────────────
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const onPopState = () => {
      if (submittedRef.current) return;
      window.history.pushState(null, '', window.location.href);
      setShowLeaveModal(true);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const computeAndSave = async () => {
    const t = testRef.current;
    if (!t || !user) return null;
    const readingScore = t.reading_questions.filter(
      (q, i) => readingAnswersRef.current[i] === q.answer_index
    ).length;
    const listeningScore = t.listening_questions.filter(
      (q, i) => listeningAnswersRef.current[i] === q.answer_index
    ).length;
    const timeTaken = TEST_DURATION_SECONDS - timeLeftRef.current;
    const result = await saveTopikAttempt(user.uid, t, readingScore, listeningScore, timeTaken);
    const xp = result.percent >= 90 ? 15 : 10;
    await addXp(user.uid, xp);
    await refreshProfile();
    sessionStorage.setItem(
      `topik_result_${t.id}`,
      JSON.stringify({ ...result, xpEarned: xp, testTitle: t.title, level: t.level })
    );
    return result;
  };

  const handleSubmit = async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const t = testRef.current;
    await computeAndSave();
    router.push(`/tests/${t?.id ?? testId}/results`);
  };

  const handleLeave = () => {
    submittedRef.current = true;
    router.push('/tests');
  };

  const submitRef = useRef(handleSubmit);
  useEffect(() => {
    submitRef.current = handleSubmit;
  });

  // ── Auto-play listening audio ────────────────────────────────
  useEffect(() => {
    if (phase !== 'listening' || !test) return;
    setHasPlayed(false);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const q = test.listening_questions[listeningIndex];
    if (q?.audio_url) {
      const audio = new Audio(q.audio_url);
      audioRef.current = audio;
      setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        setHasPlayed(true);
      };
      audio.onerror = () => {
        setIsPlaying(false);
        setHasPlayed(true);
      };
      audio.play().catch(() => {
        setIsPlaying(false);
        setHasPlayed(true);
      });
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [phase, listeningIndex, test]);

  const handleReplay = () => {
    const q = test?.listening_questions[listeningIndex];
    if (!q?.audio_url) return;
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(q.audio_url);
    audioRef.current = audio;
    setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => setIsPlaying(false);
    audio.play().catch(() => setIsPlaying(false));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!test) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8">
      <p className="text-muted">Test not found.</p>
      <button onClick={() => router.push('/tests')} className="bg-navy text-cream px-6 py-3 rounded-2xl font-bold text-sm">
        Back to Tests
      </button>
    </div>
  );

  const readingQuestions = test.reading_questions;
  const listeningQuestions = test.listening_questions;
  const readingQ = readingQuestions[readingIndex];
  const listeningQ = listeningQuestions[listeningIndex];
  const isLastReading = readingIndex === readingQuestions.length - 1;
  const isLastListening = listeningIndex === listeningQuestions.length - 1;
  const timerLow = timeLeft < 300;

  const Header = ({ sectionLabel, progressLabel }: { sectionLabel: string; progressLabel: string }) => (
    <div className="bg-navy px-5 py-4 flex items-center justify-between">
      <button
        onClick={() => setShowLeaveModal(true)}
        className="text-white/50 hover:text-white text-2xl transition-colors"
      >
        ←
      </button>
      <div className="text-center">
        <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">{sectionLabel}</p>
        <p className="text-cream font-quicksand font-bold text-base">{progressLabel}</p>
      </div>
      <p
        className="font-quicksand font-bold text-lg tabular-nums"
        style={{ color: timerLow ? '#F87171' : '#F7F4EE' }}
      >
        {formatTime(timeLeft)}
      </p>
    </div>
  );

  const LeaveModal = () =>
    showLeaveModal ? (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-6"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        onClick={() => setShowLeaveModal(false)}
      >
        <div className="bg-white w-full max-w-sm rounded-3xl p-6" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-lg font-extrabold text-ink mb-2">Leave test?</h2>
          <p className="text-sm text-muted mb-5 leading-relaxed">
            Your progress on this attempt will be lost and won't count toward your tries.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowLeaveModal(false)}
              className="flex-1 py-3 rounded-xl border border-border font-bold text-sm text-ink hover:bg-cream transition-colors"
            >
              Stay
            </button>
            <button
              onClick={handleLeave}
              className="flex-1 py-3 rounded-xl font-bold text-sm text-white"
              style={{ background: '#F97316' }}
            >
              Leave
            </button>
          </div>
        </div>
      </div>
    ) : null;

  // ── Transition screen ────────────────────────────────────────
  if (phase === 'transition') {
    const answeredCount = Object.keys(readingAnswers).length;
    return (
      <>
        <div className="max-w-xl mx-auto px-6 py-10 flex flex-col items-center text-center">
          <p className="text-4xl mb-4">✅</p>
          <h2 className="font-quicksand font-bold text-ink text-2xl mb-2">Section 1 Complete</h2>
          <p className="text-sm text-muted mb-6">
            Reading &amp; Grammar: {answeredCount}/{readingQuestions.length} answered
          </p>
          <div className="bg-white rounded-3xl border border-border p-5 mb-6 w-full max-w-sm text-left">
            <p className="font-bold text-ink mb-1">Section 2: Listening</p>
            <p className="text-sm text-muted mb-2">{listeningQuestions.length} questions · ~5 minutes</p>
            <p className="text-xs text-muted">You cannot return to the Reading section once you continue.</p>
          </div>
          <button
            onClick={() => setPhase('listening')}
            className="btn-press-orange w-full max-w-xs py-4 rounded-2xl bg-orange text-white font-quicksand font-bold text-base"
          >
            Start Listening →
          </button>
        </div>
        <LeaveModal />
      </>
    );
  }

  // ── Reading & Grammar section ────────────────────────────────
  if (phase === 'reading') {
    if (!readingQ) return null;
    const selected = readingAnswers[readingIndex] ?? null;
    return (
      <>
        <Header
          sectionLabel="Reading & Grammar"
          progressLabel={`Question ${readingIndex + 1} of ${readingQuestions.length}`}
        />
        <div className="max-w-xl mx-auto px-6 py-6">
          <div className="rounded-3xl p-5 mb-5" style={{ background: '#EFF6FF', border: '2px solid #1A1F36' }}>
            <p className="text-[11px] font-bold tracking-widest mb-3" style={{ color: '#1A1F36' }}>QUESTION</p>
            {readingQ.passage && (
              <p
                className="text-ink leading-relaxed mb-4"
                style={{ fontFamily: 'Noto Sans KR, sans-serif', fontSize: 22 }}
              >
                {readingQ.passage}
              </p>
            )}
            <p
              className="font-bold text-ink leading-snug"
              style={{ fontFamily: 'Noto Sans KR, sans-serif', fontSize: 20 }}
            >
              {readingQ.question}
            </p>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            {readingQ.options.map((opt, oi) => {
              const isSelected = selected === oi;
              return (
                <button
                  key={oi}
                  onClick={() => setReadingAnswers((prev) => ({ ...prev, [readingIndex]: oi }))}
                  className={`w-full py-4 px-5 rounded-2xl border-2 text-left font-bold transition-all ${
                    isSelected ? 'bg-ink border-ink text-cream' : 'bg-white border-border text-ink hover:border-ink'
                  }`}
                  style={{ fontFamily: 'Noto Sans KR, sans-serif', fontSize: 19 }}
                >
                  <span style={{ color: '#F97316' }}>{CIRCLED[oi]}</span> {opt}
                </button>
              );
            })}
          </div>

          <div className="flex justify-center mb-4">
            <ReportIssueButton
              module="tests"
              content_id={testId}
              item_index={readingIndex}
              section="reading"
              snapshot={{
                question: readingQ.question,
                passage: readingQ.passage,
                options: readingQ.options,
                answer: readingQ.options[readingQ.answer_index],
                chosen: selected !== null ? readingQ.options[selected] : undefined,
              }}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setReadingIndex((i) => Math.max(0, i - 1))}
              disabled={readingIndex === 0}
              className="flex-1 py-3.5 rounded-2xl border-2 border-border font-bold text-sm text-ink hover:bg-cream transition-colors disabled:opacity-40"
            >
              ← Previous
            </button>
            <button
              onClick={() => (isLastReading ? setPhase('transition') : setReadingIndex((i) => i + 1))}
              className="btn-press flex-1 py-3.5 rounded-2xl bg-navy text-cream font-quicksand font-bold text-sm"
            >
              {isLastReading ? 'Continue to Listening →' : 'Next →'}
            </button>
          </div>
        </div>
        <LeaveModal />
      </>
    );
  }

  // ── Listening section ─────────────────────────────────────────
  if (!listeningQ) return null;
  const selectedL = listeningAnswers[listeningIndex] ?? null;
  return (
    <>
      <Header
        sectionLabel="Listening"
        progressLabel={`Question ${listeningIndex + 1} of ${listeningQuestions.length}`}
      />
      <div className="max-w-xl mx-auto px-6 py-6">
        <div className="bg-navy rounded-3xl p-6 mb-5 flex flex-col items-center gap-3">
          <p className="text-sm text-white/40 font-semibold tracking-wider uppercase">
            {isPlaying ? 'Now playing…' : hasPlayed ? 'Played' : 'Loading…'}
          </p>
          <div className="relative">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: isPlaying ? '#F97316' : 'rgba(255,255,255,0.1)' }}
            >
              <span className="text-3xl">{isPlaying ? '🔊' : '🎧'}</span>
            </div>
            {isPlaying && (
              <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(232,65,44,0.25)' }} />
            )}
          </div>
          {hasPlayed && (
            <button
              onClick={handleReplay}
              disabled={isPlaying}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
            >
              🔄 Replay
            </button>
          )}
        </div>

        <div className="rounded-3xl p-5 mb-5" style={{ background: '#EFF6FF', border: '2px solid #1A1F36' }}>
          <p className="text-[11px] font-bold tracking-widest mb-3" style={{ color: '#1A1F36' }}>QUESTION</p>
          <p
            className="font-bold text-ink leading-snug"
            style={{ fontFamily: 'Noto Sans KR, sans-serif', fontSize: 20 }}
          >
            {listeningQ.question}
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {listeningQ.options.map((opt, oi) => {
            const isSelected = selectedL === oi;
            return (
              <button
                key={oi}
                onClick={() => setListeningAnswers((prev) => ({ ...prev, [listeningIndex]: oi }))}
                className={`w-full py-4 px-5 rounded-2xl border-2 text-left font-bold transition-all ${
                  isSelected ? 'bg-ink border-ink text-cream' : 'bg-white border-border text-ink hover:border-ink'
                }`}
                style={{ fontFamily: 'Noto Sans KR, sans-serif', fontSize: 19 }}
              >
                <span style={{ color: '#F97316' }}>{CIRCLED[oi]}</span> {opt}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center mb-4">
          <ReportIssueButton
            module="tests"
            content_id={testId}
            item_index={listeningIndex}
            section="listening"
            snapshot={{
              question: listeningQ.question,
              options: listeningQ.options,
              answer: listeningQ.options[listeningQ.answer_index],
              chosen: selectedL !== null ? listeningQ.options[selectedL] : undefined,
            }}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setListeningIndex((i) => Math.max(0, i - 1))}
            disabled={listeningIndex === 0}
            className="flex-1 py-3.5 rounded-2xl border-2 border-border font-bold text-sm text-ink hover:bg-cream transition-colors disabled:opacity-40"
          >
            ← Previous
          </button>
          <button
            onClick={() => (isLastListening ? handleSubmit() : setListeningIndex((i) => i + 1))}
            className="btn-press-orange flex-1 py-3.5 rounded-2xl bg-orange text-white font-quicksand font-bold text-sm"
          >
            {isLastListening ? 'Submit Test →' : 'Next →'}
          </button>
        </div>
      </div>
      <LeaveModal />
    </>
  );
}
