'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePassageDetail, useSavePassageProgress, useWordBank } from '@/hooks/usePassages';
import { useAuth } from '@/lib/auth';
import { addXp } from '@/lib/xp';
import { categoryPill } from '@/lib/category-colors';
import ReportIssueButton from '@/components/ReportIssueButton';
import { playLessonComplete } from '@/lib/sounds';

// Strips leading/trailing punctuation from a whitespace-split token before
// it's saved to the word bank — the display text (with punctuation) is
// untouched. Korean sentences here end with the period glued to the last
// word (e.g. "왔어요."), so this keeps saved entries clean.
function cleanWord(token: string) {
  return token.replace(/^[.,!?"'“”‘’(（]+/, '').replace(/[.,!?"'“”‘’)）]+$/, '');
}

export default function PassagePage() {
  const { passageId } = useParams<{ passageId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { passage, questions, loading } = usePassageDetail(passageId);
  const saveProgress = useSavePassageProgress();
  const { entries: wordBank, loading: wordBankLoading, addWord, removeWord } = useWordBank(passageId);

  const [showTranslation, setShowTranslation] = useState(false);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [translatedQ, setTranslatedQ] = useState<Record<number, boolean>>({});
  const [xpEarned, setXpEarned] = useState(0);
  // A "selection" is a contiguous span of word-tokens on one line — tapping a
  // word starts it, tapping another word on the same line extends it (in
  // either direction), letting you chain several words into one phrase
  // before adding it to the word bank as a single entry.
  const [pendingSelection, setPendingSelection] = useState<{ lineIndex: number; startIdx: number; endIdx: number } | null>(null);
  const [addingKey, setAddingKey] = useState<string | null>(null);

  if (loading || !passage)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const cat = categoryPill(passage.category);
  const hasQuiz = questions.length > 0;
  const allAnswered = hasQuiz && Object.keys(selected).length === questions.length;
  const score = submitted
    ? questions.filter((q, i) => selected[i] === q.answer_index).length
    : 0;

  const handleSubmit = async () => {
    if (!allAnswered) return;
    setSubmitted(true);
    playLessonComplete();
    const s = questions.filter((q, i) => selected[i] === q.answer_index).length;
    await saveProgress(passageId, s, questions.length);
    if (user) {
      const isPerfect = s === questions.length;
      const xp = isPerfect ? 15 : 10;
      setXpEarned(xp);
      await addXp(user.uid, xp);
    }
  };

  const handleConfirmAdd = async () => {
    if (!pendingSelection) return;
    const { lineIndex, startIdx, endIdx } = pendingSelection;
    const lo = Math.min(startIdx, endIdx);
    const hi = Math.max(startIdx, endIdx);
    const line = passage.lines[lineIndex];
    const phrase = cleanWord(line.korean.split(' ').slice(lo, hi + 1).join(' '));
    setPendingSelection(null);
    if (!phrase) return;
    setAddingKey(`${lineIndex}-${lo}-${hi}`);
    await addWord(phrase, line.korean);
    setAddingKey(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <button
        onClick={() => router.back()}
        className="text-2xl text-muted mb-5 hover:scale-110 transition-transform hover:text-ink transition-colors block"
      >
        ←
      </button>

      {/* Title */}
      <div className="flex items-center justify-between mb-1">
        <h1
          className="text-2xl font-extrabold text-ink"
          style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
        >
          {passage.title}
        </h1>
        <span
          className="text-[11px] font-bold px-3 py-1 rounded-full"
          style={{ backgroundColor: cat.bg, color: cat.text }}
        >
          {passage.category}
        </span>
      </div>
      <p className="text-sm text-muted mb-4">
        {passage.title_en} · {passage.read_time}
      </p>

      {/* Translation toggle */}
      <button
        onClick={() => setShowTranslation(!showTranslation)}
        className={`text-xs font-semibold px-4 py-2 rounded-full mb-4 transition-colors ${
          showTranslation ? 'bg-ink text-cream' : 'bg-tag text-inkLight'
        }`}
      >
        {showTranslation ? '✓ ' : ''}Translation
      </button>

      {/* Passage lines */}
      <div className="bg-white rounded-2xl p-4 mb-5 shadow-sm border border-border">
        {passage.lines.map((line, i) => {
          const tokens = line.korean.split(' ');
          const sel = pendingSelection?.lineIndex === i ? pendingSelection : null;
          const lo = sel ? Math.min(sel.startIdx, sel.endIdx) : -1;
          const hi = sel ? Math.max(sel.startIdx, sel.endIdx) : -1;
          const phrase = sel ? cleanWord(tokens.slice(lo, hi + 1).join(' ')) : '';

          let addingRange: { lo: number; hi: number } | null = null;
          if (addingKey) {
            const [aLine, aLo, aHi] = addingKey.split('-').map(Number);
            if (aLine === i) addingRange = { lo: aLo, hi: aHi };
          }

          return (
            <div key={i} className="p-3 mb-1">
              <div
                className="text-lg font-semibold text-ink leading-7 flex flex-wrap"
                style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
              >
                {tokens.map((token, wi) => {
                  const word = cleanWord(token);
                  const inBank = wordBank.some(
                    (e) => e.word === word || (e.sentence === line.korean && e.word.split(' ').map(cleanWord).includes(word))
                  );
                  const isSelected = !!sel && wi >= lo && wi <= hi;
                  const isAdding = !!addingRange && wi >= addingRange.lo && wi <= addingRange.hi;

                  return (
                    <span key={wi} className="relative inline-block mr-[0.35em]">
                      <span
                        onClick={() => {
                          if (!word) return;
                          if (!sel) {
                            setPendingSelection({ lineIndex: i, startIdx: wi, endIdx: wi });
                          } else if (lo === hi && lo === wi) {
                            setPendingSelection(null);
                          } else {
                            setPendingSelection({ lineIndex: i, startIdx: sel.startIdx, endIdx: wi });
                          }
                        }}
                        className={`cursor-pointer rounded transition-colors ${
                          isSelected ? '' : inBank ? 'text-ink' : 'hover:bg-cream'
                        } ${isAdding ? 'opacity-50' : ''}`}
                        style={
                          isSelected
                            ? { background: '#FDE7C8' }
                            : inBank
                              ? { background: '#FEF3C7' }
                              : undefined
                        }
                      >
                        {token}
                      </span>

                      {sel && wi === hi && (
                        <div
                          className="absolute z-20 top-full left-0 mt-1.5 bg-navy rounded-xl p-3 shadow-lg"
                          style={{ width: 220 }}
                        >
                          <p className="text-cream text-xs font-semibold mb-1 leading-snug">
                            Add "{phrase}" to word bank?
                          </p>
                          {lo === hi && (
                            <p className="text-[10px] mb-1.5 leading-snug" style={{ color: 'rgba(247,244,238,0.6)' }}>
                              Tap another word to grab a phrase
                            </p>
                          )}
                          <div className="flex gap-1.5 mt-1.5">
                            <button
                              onClick={handleConfirmAdd}
                              className="flex-1 py-1.5 rounded-lg bg-orange text-white text-xs font-bold"
                            >
                              Add
                            </button>
                            <button
                              onClick={() => setPendingSelection(null)}
                              className="flex-1 py-1.5 rounded-lg text-xs font-bold"
                              style={{ background: 'rgba(255,255,255,0.15)', color: '#F7F4EE' }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </span>
                  );
                })}
              </div>
              {showTranslation && (
                <p className="text-xs text-orange mt-1">{line.translation}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Word bank */}
      <div className="bg-white rounded-2xl p-4 mb-5 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-ink text-sm">📖 Word Bank</p>
          {!wordBankLoading && wordBank.length > 0 && (
            <span className="text-[11px] text-muted">{wordBank.length} saved</span>
          )}
        </div>

        {wordBankLoading ? (
          <p className="text-xs text-muted">Loading…</p>
        ) : wordBank.length === 0 ? (
          <p className="text-xs text-muted leading-relaxed">
            Tap any word in the passage above to save it here with its meaning in context — or
            tap through a few words in a row to chain them into a phrase before saving.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {wordBank.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between gap-2 bg-cream rounded-lg px-3 py-2 min-w-0">
                <p className="text-xs font-semibold text-ink truncate" title={`${entry.word} — ${entry.definition}`}>
                  <span style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{entry.word}</span>
                  <span className="text-muted font-normal"> — {entry.definition}</span>
                </p>
                <button
                  onClick={() => removeWord(entry.id)}
                  aria-label="Remove word"
                  className="text-muted hover:text-red transition-colors flex-shrink-0 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quiz */}
      <div className="flex justify-between items-center mb-3">
        <h2
          className="font-bold text-ink"
          style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
        >
          이해 확인
        </h2>
        <span className="text-xs text-muted">Comprehension Check</span>
      </div>

      {/* No quiz available — guard against the empty-quiz bug */}
      {!hasQuiz && (
        <div className="bg-white rounded-2xl p-6 mb-5 border border-border text-center">
          <p className="text-2xl mb-2">📝</p>
          <p className="font-bold text-ink text-sm mb-1">Quiz coming soon</p>
          <p className="text-xs text-muted mb-4">This passage doesn't have a comprehension quiz yet.</p>
          <button
            onClick={() => router.push('/read')}
            className="px-5 py-2.5 rounded-xl font-bold text-sm text-cream hover:opacity-90 transition-opacity"
            style={{ background: '#1A1F36' }}
          >
            ← Back to Reading
          </button>
        </div>
      )}

      {hasQuiz && questions.map((q, qi) => (
        <div
          key={qi}
          className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-border"
        >
          <div className="flex justify-between items-start mb-3">
            <p className="font-bold text-ink text-sm flex-1 leading-5">
              {qi + 1}. {translatedQ[qi] ? q.question_translated : q.question}
            </p>
            <button
              onClick={() =>
                setTranslatedQ((prev) => ({ ...prev, [qi]: !prev[qi] }))
              }
              className={`ml-2 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors ${
                translatedQ[qi] ? 'bg-ink text-cream' : 'bg-tag text-inkLight'
              }`}
            >
              {translatedQ[qi] ? '가' : 'EN'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {q.options.map((opt, oi) => {
              const isSel = selected[qi] === oi;
              const isRight = submitted && oi === q.answer_index;
              const isWrong = submitted && isSel && oi !== q.answer_index;
              return (
                <button
                  key={oi}
                  onClick={() =>
                    !submitted && setSelected({ ...selected, [qi]: oi })
                  }
                  disabled={submitted}
                  className={`p-2.5 rounded-xl border-2 text-sm font-bold text-center transition-colors ${
                    isRight
                      ? 'bg-greenLight border-green text-green'
                      : isWrong
                        ? 'bg-redLight border-red text-red'
                        : isSel
                          ? 'bg-ink border-ink text-cream'
                          : 'bg-cream border-border text-ink hover:border-ink'
                  }`}
                >
                  {translatedQ[qi] ? q.options_translated[oi] : opt}
                </button>
              );
            })}
          </div>
          {submitted && (
            <div className="flex justify-end mt-3">
              <ReportIssueButton
                module="read"
                content_id={passageId}
                item_index={qi}
                snapshot={{
                  question: q.question,
                  options: q.options,
                  answer: q.options[q.answer_index],
                  chosen: selected[qi] !== undefined ? q.options[selected[qi]] : undefined,
                }}
              />
            </div>
          )}
        </div>
      ))}

      {hasQuiz && !submitted && (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={`w-full py-4 rounded-xl font-bold transition-colors ${
            allAnswered
              ? 'bg-orange text-white hover:opacity-90'
              : 'bg-border text-muted cursor-not-allowed'
          }`}
        >
          제출하기 →
        </button>
      )}

      {hasQuiz && submitted && (
        <>
          <div
            className={`rounded-2xl p-5 text-center border-2 ${
              score === questions.length
                ? 'bg-greenLight border-green'
                : 'bg-redLight border-red'
            }`}
          >
            <p className="text-2xl font-extrabold text-ink mb-1">
              {score}/{questions.length} 정답
            </p>
            <p className="text-sm text-muted">
              {score === questions.length
                ? '🎉 완벽해요! Perfect!'
                : '다시 읽어보세요. Try again.'}
            </p>
            {xpEarned > 0 && (
              <div
                className="flex items-center justify-center gap-2 mt-3 px-4 py-2 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.6)' }}
              >
                <span className="text-sm">⚡</span>
                <p className="text-sm font-bold text-ink">
                  +{xpEarned} XP earned
                  {xpEarned === 15 ? ' · Perfect score!' : ''}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => router.push('/read')}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-cream mt-3 hover:opacity-90 transition-opacity"
            style={{ background: '#1A1F36' }}
          >
            ← Back to Reading
          </button>
        </>
      )}

      <div className="h-24" />
    </div>
  );
}
