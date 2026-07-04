'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { usePattern, savePatternProgress, PatternQuestion } from '@/hooks/usePatterns';
import {
  DndContext, DragEndEvent, DragStartEvent,
  MouseSensor, TouchSensor, useSensor, useSensors,
  useDraggable, useDroppable, DragOverlay,
} from '@dnd-kit/core';

// ── Draggable chip ────────────────────────────────────────────────
function Chip({ id, korean, english, showEn, disabled, dimmed }:
  { id: string; korean: string; english: string; showEn: boolean; disabled?: boolean; dimmed?: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id, disabled });

  return (
    <div ref={setNodeRef} {...(disabled ? {} : { ...listeners, ...attributes })}
      className="rounded-xl text-center transition-all select-none"
      style={{
        background: dimmed ? '#F0F0F0' : '#fff',
        border: `2px solid ${dimmed ? '#E0E0E0' : '#E8E3D8'}`,
        padding: '12px 8px',
        opacity: isDragging ? 0.3 : dimmed ? 0.45 : 1,
        cursor: disabled ? 'default' : 'grab',
        touchAction: 'none',
      }}>
      <p className="font-bold text-lg text-ink" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{korean}</p>
      {showEn && <p className="text-[11px] text-muted mt-1">{english}</p>}
    </div>
  );
}

// ── Drop slot ─────────────────────────────────────────────────────
function DropSlot({ filled, slotKorean, showEn, slotEnglish, isCorrect, isWrong }:
  { filled: boolean; slotKorean?: string; showEn: boolean; slotEnglish?: string; isCorrect?: boolean; isWrong?: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'slot' });

  const bg     = isCorrect ? '#EAF3DE' : isWrong ? '#FFF0EE' : filled ? '#1A1F36' : isOver ? '#EFF6FF' : '#F7F4EE';
  const border = isCorrect ? '#86EFAC' : isWrong ? '#FCA5A5' : filled ? 'transparent' : isOver ? '#93C5FD' : '#C4BFBA';
  const color  = filled && !isCorrect && !isWrong ? '#F7F4EE' : isCorrect ? '#16A34A' : isWrong ? '#E8412C' : '#888';

  return (
    <div ref={setNodeRef}
      className="rounded-xl flex items-center justify-center min-w-[100px] px-4 py-3 transition-all"
      style={{ background: bg, border: `2px dashed ${border}`, minHeight: 56 }}>
      {filled && slotKorean ? (
        <div className="text-center">
          <p className="font-bold text-lg" style={{ fontFamily: 'Noto Sans KR, sans-serif', color }}>
            {slotKorean}
          </p>
          {showEn && slotEnglish && (
            <p className="text-[11px] mt-0.5" style={{ color }}>{slotEnglish}</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted font-semibold">Drop here</p>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function PatternPracticePage() {
  const { patternId } = useParams<{ patternId: string }>();
  const router        = useRouter();
  const { user }      = useAuth();
  const { pattern, loading } = usePattern(patternId);

  const [roundIndex,    setRoundIndex]    = useState(0);
  const [qIndex,        setQIndex]        = useState(0);
  const [showEn,        setShowEn]        = useState(false);
  const [slotFilled,    setSlotFilled]    = useState<number | null>(null); // index into options
  const [answerState,   setAnswerState]   = useState<'idle'|'correct'|'wrong'>('idle');
  const [score,         setScore]         = useState(0);
  const [roundDone,     setRoundDone]     = useState(false);
  const [allDone,       setAllDone]       = useState(false);
  const [draggingId,    setDraggingId]    = useState<string|null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-red border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!pattern) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-muted">Pattern not found.</p>
      <button onClick={() => router.back()} className="bg-navy text-cream px-6 py-3 rounded-2xl font-bold text-sm">Go Back</button>
    </div>
  );

  const rounds       = pattern.rounds ?? [];
  const currentRound = rounds[roundIndex];
  const currentQ     = currentRound?.questions?.[qIndex];

  if (!currentRound || !currentQ) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted">No practice questions yet — check back soon!</p>
        <button onClick={() => router.back()} className="bg-navy text-cream px-6 py-3 rounded-2xl font-bold text-sm">Go Back</button>
      </div>
    );
  }

  const handleDragStart = (e: DragStartEvent) => setDraggingId(String(e.active.id));
  const handleDragEnd   = (e: DragEndEvent) => {
    setDraggingId(null);
    if (!e.over || e.over.id !== 'slot' || answerState !== 'idle') return;
    const optionIndex = parseInt(String(e.active.id).replace('opt-', ''));
    placeAnswer(optionIndex);
  };

  // Tap-to-select on mobile — tap chip when slot is empty
  const handleChipTap = (optionIndex: number) => {
    if (answerState !== 'idle' || slotFilled !== null) return;
    placeAnswer(optionIndex);
  };

  const placeAnswer = (optionIndex: number) => {
    setSlotFilled(optionIndex);
    const correct = optionIndex === currentQ.answer_index;
    setAnswerState(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);
  };

  const handleRetry = () => {
    setSlotFilled(null);
    setAnswerState('idle');
  };

  const handleNext = async () => {
    const nextQ = qIndex + 1;
    if (nextQ < currentRound.questions.length) {
      setQIndex(nextQ);
      setSlotFilled(null);
      setAnswerState('idle');
    } else {
      // Round complete
      const nextRound = roundIndex + 1;
      const completedRounds = nextRound;
      if (user) await savePatternProgress(user.uid, patternId, completedRounds);
      if (nextRound >= rounds.length) {
        setAllDone(true);
      } else {
        setRoundDone(true);
      }
    }
  };

  const startNextRound = () => {
    setRoundIndex(r => r + 1);
    setQIndex(0);
    setSlotFilled(null);
    setAnswerState('idle');
    setScore(0);
    setRoundDone(false);
  };

  // ── All rounds complete ───────────────────────────────────────
  if (allDone) {
    return (
      <div className="max-w-xl mx-auto px-6 py-10 flex flex-col items-center text-center">
        <p className="text-5xl mb-4">🎉</p>
        <h2 className="font-quicksand font-bold text-ink text-2xl mb-1">Pattern mastered!</h2>
        <p className="text-sm text-muted mb-1"
          style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{pattern.frame}</p>
        <p className="text-xs text-muted mb-6">{pattern.frame_translation}</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button onClick={() => router.push('/patterns')}
            className="btn-press w-full bg-navy text-cream py-4 rounded-2xl font-quicksand font-bold text-base">
            ← Back to Patterns
          </button>
        </div>
      </div>
    );
  }

  // ── Round complete ────────────────────────────────────────────
  if (roundDone) {
    return (
      <div className="max-w-xl mx-auto px-6 py-10 flex flex-col items-center text-center">
        <p className="text-4xl mb-4">✅</p>
        <h2 className="font-quicksand font-bold text-ink text-2xl mb-1">
          Round {roundIndex + 1} complete
        </h2>
        <p className="text-sm text-muted mb-6">
          {score}/{currentRound.questions.length} correct ·
          Last completed: {new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {roundIndex + 1 < rounds.length && (
            <button onClick={startNextRound}
              className="btn-press-red w-full bg-red text-white py-4 rounded-2xl font-quicksand font-bold text-base">
              Start Round {roundIndex + 2} →
            </button>
          )}
          <button onClick={() => router.push('/patterns')}
            className="w-full py-3.5 rounded-2xl border-2 border-border font-bold text-sm text-ink hover:bg-cream transition-colors">
            Back to Patterns
          </button>
        </div>
      </div>
    );
  }

  const filledOption = slotFilled !== null ? currentQ.options[slotFilled] : undefined;
  // Find translation for filled option — match against slot
  const filledEn = slotFilled !== null && slotFilled === currentQ.answer_index
    ? currentQ.slot_translation : undefined;

  // ── Practice session ──────────────────────────────────────────
  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen flex flex-col" style={{ background: '#F7F4EE' }}>

        {/* Header */}
        <div className="bg-navy px-5 py-4" style={{ flexShrink: 0 }}>
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => router.back()}
              className="text-white/50 hover:text-white text-2xl transition-colors">←</button>
            <div className="text-center">
              <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">
                {pattern.category} · Round {roundIndex + 1} of {rounds.length}
              </p>
              <p className="text-cream font-quicksand font-bold text-xl leading-tight"
                style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                {pattern.frame}
              </p>
            </div>
            <button onClick={() => setShowEn(s => !s)}
              className="text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all"
              style={{
                background: showEn ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}>
              {showEn ? '한' : 'EN'}
            </button>
          </div>
          {showEn && (
            <p className="text-white/40 text-sm text-center">{pattern.frame_translation}</p>
          )}
          {/* Progress bar */}
          <div className="rounded-full overflow-hidden mt-3" style={{ background: 'rgba(255,255,255,0.12)', height: 4 }}>
            <div className="h-full rounded-full transition-all duration-300"
              style={{ width: `${((qIndex) / currentRound.questions.length) * 100}%`, background: '#E8412C' }} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-5 py-6 flex flex-col gap-5">

          {/* Question counter */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted font-semibold">
              Question {qIndex + 1} of {currentRound.questions.length}
            </span>
            <span className="text-xs text-muted">{score} correct so far</span>
          </div>

          {/* Context card */}
          <div className="bg-white rounded-2xl p-4 border-2 border-border">
            <p className="text-[10px] font-bold text-muted tracking-widest mb-2">CONTEXT</p>
            <p className="text-base font-semibold text-muted">{currentQ.context}</p>
          </div>

          {/* Complete the pattern */}
          <div>
            <p className="text-[10px] font-bold text-muted tracking-widest mb-2">COMPLETE THE PATTERN</p>
            <div className="bg-white rounded-2xl p-4 border-2 border-border flex items-center gap-3 flex-wrap">
              <DropSlot
                filled={slotFilled !== null}
                slotKorean={filledOption}
                slotEnglish={filledEn}
                showEn={showEn}
                isCorrect={answerState === 'correct'}
                isWrong={answerState === 'wrong'}
              />
              <p className="text-xl font-bold text-ink" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                {pattern.frame.replace('...', '').trim()}
              </p>
            </div>
          </div>

          {/* Result feedback */}
          {answerState !== 'idle' && (
            <div className="rounded-2xl p-4 border-2"
              style={{
                background: answerState === 'correct' ? '#EAF3DE' : '#FFF0EE',
                borderColor: answerState === 'correct' ? '#86EFAC' : '#FCA5A5',
              }}>
              <p className="font-bold text-sm mb-1"
                style={{ color: answerState === 'correct' ? '#16A34A' : '#E8412C' }}>
                {answerState === 'correct' ? '✓ Correct!' : `✗ The answer is "${currentQ.options[currentQ.answer_index]}"`}
              </p>
              <p className="font-bold text-lg" style={{ fontFamily: 'Noto Sans KR, sans-serif', color: '#111' }}>
                {currentQ.full_sentence}
              </p>
              {showEn && (
                <p className="text-sm text-muted mt-1">{currentQ.sentence_translation}</p>
              )}
            </div>
          )}

          {/* Options grid */}
          <div>
            <p className="text-[10px] font-bold text-muted tracking-widest mb-2">OPTIONS — tap or drag</p>
            <div className="grid grid-cols-2 gap-2">
              {currentQ.options.map((opt, i) => (
                <div key={i} onClick={() => handleChipTap(i)}>
                  <Chip
                    id={`opt-${i}`}
                    korean={opt}
                    english={currentQ.slot_translation}
                    showEn={showEn}
                    disabled={answerState !== 'idle'}
                    dimmed={slotFilled === i}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed bottom buttons */}
        <div className="px-5 pb-8 pt-3 bg-white border-t border-border flex gap-3">
          {answerState === 'idle' ? (
            <div className="flex-1 py-4 rounded-2xl bg-border text-muted text-center font-bold text-sm">
              Drag or tap an option above
            </div>
          ) : answerState === 'wrong' ? (
            <>
              <button onClick={handleRetry}
                className="flex-1 py-4 rounded-2xl border-2 border-border font-bold text-sm text-ink hover:bg-cream transition-colors">
                🔄 Try Again
              </button>
              <button onClick={handleNext}
                className="btn-press flex-1 py-4 rounded-2xl bg-navy text-cream font-quicksand font-bold text-sm">
                {qIndex + 1 >= currentRound.questions.length ? 'Finish Round' : 'Next →'}
              </button>
            </>
          ) : (
            <button onClick={handleNext}
              className="btn-press w-full py-4 rounded-2xl bg-navy text-cream font-quicksand font-bold text-base">
              {qIndex + 1 >= currentRound.questions.length ? 'Finish Round ✓' : 'Next →'}
            </button>
          )}
        </div>
      </div>

      {/* Drag overlay — renders the floating chip while dragging */}
      <DragOverlay>
        {draggingId ? (() => {
          const i   = parseInt(draggingId.replace('opt-', ''));
          const opt = currentQ.options[i];
          return (
            <div className="rounded-xl text-center px-4 py-3 shadow-xl"
              style={{ background: '#1A1F36', border: '2px solid #1A1F36' }}>
              <p className="font-bold text-lg text-cream" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{opt}</p>
            </div>
          );
        })() : null}
      </DragOverlay>
    </DndContext>
  );
}
