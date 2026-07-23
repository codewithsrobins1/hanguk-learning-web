'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useListeningExercise, saveListeningProgress } from '@/hooks/useListening';
import { addXp } from '@/lib/xp';
import ReportIssueButton from '@/components/ReportIssueButton';
import { playCorrect, playIncorrect } from '@/lib/sounds';
import SoundToggleButton from '@/components/SoundToggleButton';

const SPEEDS = [0.5, 0.75, 1] as const;
type Speed = typeof SPEEDS[number];
type Phase = 'ready' | 'playing' | 'question' | 'answered';

export default function ListenExercisePage() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const router         = useRouter();
  const { user, refreshProfile } = useAuth();
  const { exercise, loading }    = useListeningExercise(exerciseId);

  const [segmentIndex,   setSegmentIndex]   = useState(0);
  const [phase,          setPhase]          = useState<Phase>('ready');
  const [selected,       setSelected]       = useState<number | null>(null);
  const [answers,        setAnswers]        = useState<Record<number, number>>({});
  const [done,           setDone]           = useState(false);
  const [xpEarned,       setXpEarned]      = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [audioError,     setAudioError]    = useState(false);
  const [hasPlayed,      setHasPlayed]     = useState(false);
  const [isPlaying,      setIsPlaying]     = useState(false);
  const [speed,          setSpeed]         = useState<Speed>(0.75);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const segment  = exercise?.segments[segmentIndex];
  const isLastSegment = exercise ? segmentIndex === exercise.segments.length - 1 : false;

  const playAudio = useCallback((url: string, playbackRate: number = 1) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const audio = new Audio(url);
    audio.playbackRate = playbackRate;
    audioRef.current = audio;
    setIsPlaying(true);
    audio.onended = () => {
      setIsPlaying(false);
      setHasPlayed(true);
      setPhase('question');
    };
    audio.onerror = () => {
      setIsPlaying(false);
      setHasPlayed(true);
      setAudioError(true);
      setPhase('question');
    };
    audio.play().catch(() => {
      setIsPlaying(false);
      setHasPlayed(true);
      setPhase('question');
    });
  }, []);

  // Reset to a "ready" state when the segment changes — wait for the
  // user to tap Start rather than auto-playing immediately.
  useEffect(() => {
    setPhase('ready');
    setSelected(null);
    setHasPlayed(false);
    setIsPlaying(false);
    setAudioError(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [segmentIndex, segment?.audio_url]);

  const handleStart = () => {
    if (segment?.audio_url) {
      setPhase('playing');
      playAudio(segment.audio_url, speed);
    }
  };

  const handleReplay = () => {
    if (segment?.audio_url) {
      setIsPlaying(true);
      playAudio(segment.audio_url, speed);
    }
  };

  const handleSpeedChange = (newSpeed: Speed) => {
    setSpeed(newSpeed);
    if (audioRef.current && isPlaying) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const handleAnswer = (idx: number) => {
    if (phase === 'answered') return;
    setSelected(idx);
    setAnswers(prev => ({ ...prev, [segmentIndex]: idx }));
    setPhase('answered');
    if (segment && idx === segment.answer_index) playCorrect();
    else playIncorrect();
  };

  const handleNext = async () => {
    if (!exercise) return;
    if (isLastSegment) {
      const score = exercise.segments.filter((seg, i) => answers[i] === seg.answer_index).length;
      const total = exercise.segments.length;
      if (user) {
        await saveListeningProgress(user.uid, exerciseId, score, total);
        const xp = score === total ? 15 : 10;
        setXpEarned(xp);
        await addXp(user.uid, xp);
        await refreshProfile();
      }
      setDone(true);
    } else {
      setSegmentIndex(i => i + 1);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!exercise) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8">
      <p className="text-muted">Exercise not found.</p>
      <button onClick={() => router.back()} className="bg-navy text-cream px-6 py-3 rounded-2xl font-bold text-sm">Go Back</button>
    </div>
  );

  const score = exercise.segments.filter((seg, i) => answers[i] === seg.answer_index).length;

  // ── Results screen ────────────────────────────────────────────
  if (done) {
    const total     = exercise.segments.length;
    const isPerfect = score === total;
    return (
      <div className="max-w-xl mx-auto px-6 py-10 flex flex-col items-center">
        <span className="text-5xl mb-4">{isPerfect ? '🎉' : '💪'}</span>
        <h2 className="font-quicksand font-bold text-ink text-2xl mb-1">
          {isPerfect ? 'Perfect score!' : 'Exercise Complete!'}
        </h2>
        <p className="text-5xl font-quicksand font-bold mt-4 mb-2"
          style={{ color: isPerfect ? '#16A34A' : score >= 2 ? '#F97316' : '#E8412C' }}>
          {score} / {total}
        </p>
        <p className="text-sm text-muted mb-4">{score} correct out of {total} questions</p>

        {xpEarned > 0 && (
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl mb-6" style={{ background: '#F0F7FF' }}>
            <span>⚡</span>
            <p className="text-sm font-bold text-ink">+{xpEarned} XP earned{isPerfect ? ' · Perfect!' : ''}</p>
          </div>
        )}

        {/* Segment results */}
        <div className="w-full bg-white rounded-3xl border border-border overflow-hidden mb-5">
          {exercise.segments.map((seg, i) => {
            const correct = answers[i] === seg.answer_index;
            return (
              <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i < exercise.segments.length - 1 ? 'border-b border-border' : ''}`}>
                <span className="text-lg flex-shrink-0">{correct ? '✅' : '❌'}</span>
                <p className="text-sm text-ink flex-1">{seg.question}</p>
                {!correct && (
                  <p className="text-xs text-muted flex-shrink-0">"{seg.options[seg.answer_index]}"</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Transcript toggle */}
        <button onClick={() => setShowTranscript(s => !s)}
          className="w-full py-3 rounded-2xl border-2 border-border font-bold text-sm text-ink hover:bg-cream transition-colors mb-3">
          {showTranscript ? 'Hide Transcript' : '📄 Show Transcript'}
        </button>

        {showTranscript && (
          <div className="w-full bg-white rounded-3xl border border-border p-5 mb-5">
            <p className="text-[11px] font-bold text-muted tracking-widest mb-4">FULL TRANSCRIPT</p>
            {exercise.segments.map((seg, si) => (
              <div key={si} className={si > 0 ? 'mt-5 pt-5 border-t border-border' : ''}>
                <p className="text-[11px] font-bold text-muted mb-2">Part {si + 1}</p>
                <div className="flex flex-col gap-2">
                  {seg.lines.map((line, li) => {
                    const isA = line.speaker === 'A';
                    return (
                      <div key={li} className={`flex gap-2 ${isA ? '' : 'flex-row-reverse'}`}>
                        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white"
                          style={{ background: isA ? '#1A1F36' : '#F97316' }}>
                          {line.speaker}
                        </div>
                        <div className={`max-w-[80%] px-3 py-2 rounded-2xl ${isA ? 'rounded-tl-none' : 'rounded-tr-none'} bg-cream`}>
                          <p className="text-base font-semibold text-ink" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{line.korean}</p>
                          <p className="text-xs text-muted mt-0.5">{line.translation}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 w-full">
          <button onClick={() => { setSegmentIndex(0); setAnswers({}); setDone(false); setShowTranscript(false); setXpEarned(0); }}
            className="btn-press w-full py-4 rounded-2xl bg-navy text-cream font-quicksand font-bold text-base">
            🔄 Try Again
          </button>
          <button onClick={() => router.push('/listen')}
            className="w-full py-3.5 rounded-2xl border-2 border-border font-bold text-sm text-ink hover:bg-cream transition-colors">
            ← Back to Listening
          </button>
        </div>
      </div>
    );
  }

  if (!segment) return null;

  return (
    <div className="max-w-xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.back()} className="text-2xl text-muted hover:text-ink transition-colors">←</button>
        <div className="text-center">
          <p className="font-quicksand font-bold text-ink text-base">{exercise.title}</p>
          <p className="text-sm text-muted">Part {segmentIndex + 1} of {exercise.segments.length}</p>
        </div>
        <SoundToggleButton className="text-lg text-muted hover:text-ink transition-colors w-8 text-right" />
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 justify-center mb-6">
        {exercise.segments.map((_, i) => {
          const answered = answers[i] !== undefined;
          const correct  = answered && answers[i] === exercise.segments[i].answer_index;
          return (
            <div key={i} className="w-3 h-3 rounded-full transition-colors"
              style={{
                background: i < segmentIndex
                  ? (correct ? '#16A34A' : '#E8412C')
                  : i === segmentIndex ? '#1A1F36' : '#E8E3D8'
              }} />
          );
        })}
      </div>

      {/* Audio player card */}
      <div className="bg-navy rounded-3xl p-7 mb-6 flex flex-col items-center gap-4">
        <p className="text-sm text-white/40 font-semibold tracking-wider uppercase">
          {isPlaying ? 'Now playing...' : hasPlayed ? 'Part ' + (segmentIndex + 1) : 'Ready when you are'}
        </p>

        {/* Speaker icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: isPlaying ? '#F97316' : 'rgba(255,255,255,0.1)' }}>
            <span className="text-4xl">{isPlaying ? '🔊' : '🎧'}</span>
          </div>
          {isPlaying && (
            <div className="absolute inset-0 rounded-full animate-ping"
              style={{ background: 'rgba(249,115,22,0.25)' }} />
          )}
        </div>

        {audioError && (
          <p className="text-red text-xs text-center">Audio unavailable — answer the question below.</p>
        )}

        {/* Speed selector + Replay */}
        <div className="flex items-center gap-3 w-full">
          {/* Speed buttons */}
          <div className="flex gap-1.5 flex-1">
            {SPEEDS.map(s => (
              <button key={s} onClick={() => handleSpeedChange(s)}
                className="flex-1 py-1.5 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: speed === s ? '#fff' : 'rgba(255,255,255,0.1)',
                  color: speed === s ? '#1A1F36' : 'rgba(255,255,255,0.5)',
                }}>
                {s}×
              </button>
            ))}
          </div>

          {/* Start / Replay */}
          {phase === 'ready' ? (
            <button onClick={handleStart}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: '#F97316', color: '#fff' }}>
              ▶ Start
            </button>
          ) : hasPlayed && (
            <button onClick={handleReplay} disabled={isPlaying}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
              🔄 Replay
            </button>
          )}
        </div>
      </div>

      {/* Question + Options — appears automatically after audio */}
      {(phase === 'question' || phase === 'answered') && (
        <div>
          <div className="bg-white rounded-3xl border border-border p-5 mb-4">
            <p className="text-xs font-bold text-muted tracking-widest mb-2">QUESTION {segmentIndex + 1}</p>
            <p className="font-bold text-ink text-lg leading-snug">{segment.question}</p>
          </div>

          <div className="flex flex-col gap-3 mb-5">
            {segment.options.map((opt, oi) => {
              const isSelected = selected === oi;
              const isCorrect  = phase === 'answered' && oi === segment.answer_index;
              const isWrong    = phase === 'answered' && isSelected && oi !== segment.answer_index;
              return (
                <button key={oi}
                  onClick={() => handleAnswer(oi)}
                  disabled={phase === 'answered'}
                  className={`w-full py-4 px-5 rounded-2xl border-2 text-left font-bold text-base transition-all ${
                    isCorrect ? 'bg-greenLight border-green text-green'
                    : isWrong ? 'bg-redLight border-red text-red'
                    : isSelected ? 'bg-ink border-ink text-cream'
                    : 'bg-white border-border text-ink hover:border-ink'
                  }`}>
                  {opt}
                </button>
              );
            })}
          </div>

          {phase === 'answered' && (
            <>
              <div className="mb-4 px-4 py-3 rounded-2xl text-center"
                style={{
                  background: selected === segment.answer_index ? '#F0FFF4' : '#FFF0EE',
                  border: `2px solid ${selected === segment.answer_index ? '#86EFAC' : '#FCA5A5'}`,
                }}>
                <p className="font-bold text-base" style={{ color: selected === segment.answer_index ? '#16A34A' : '#E8412C' }}>
                  {selected === segment.answer_index
                    ? '✓ Correct!'
                    : `✗ The answer was "${segment.options[segment.answer_index]}"`}
                </p>
              </div>

              <div className="flex justify-center mb-4">
                <ReportIssueButton
                  module="listen"
                  content_id={exerciseId}
                  item_index={segmentIndex}
                  snapshot={{
                    question: segment.question,
                    options: segment.options,
                    answer: segment.options[segment.answer_index],
                    chosen: selected !== null ? segment.options[selected] : undefined,
                  }}
                />
              </div>

              <button onClick={handleNext}
                className="btn-press w-full py-4 rounded-2xl bg-navy text-cream font-quicksand font-bold text-base">
                {isLastSegment ? 'See Results →' : 'Next Part →'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
