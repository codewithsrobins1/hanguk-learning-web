'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePassageDetail, useSavePassageProgress } from '@/hooks/usePassages';
import { useAuth } from '@/lib/auth';
import { addXp } from '@/lib/xp';

const catColors: Record<string, { bg: string; text: string }> = {
  'Daily Life': { bg: '#EFF6FF', text: '#3B82F6' },
  Food: { bg: '#FFF7ED', text: '#F97316' },
  Music: { bg: '#F5F3FF', text: '#8B5CF6' },
  Travel: { bg: '#FFF0EE', text: '#E8412C' },
};

export default function PassagePage() {
  const { passageId } = useParams<{ passageId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { passage, questions, loading } = usePassageDetail(passageId);
  const saveProgress = useSavePassageProgress();

  const [showTranslation, setShowTranslation] = useState(false);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [translatedQ, setTranslatedQ] = useState<Record<number, boolean>>({});
  const [xpEarned, setXpEarned] = useState(0);

  if (loading || !passage)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const cat = catColors[passage.category] || { bg: '#E8E3D8', text: '#888' };
  const allAnswered = Object.keys(selected).length === questions.length;
  const score = submitted
    ? questions.filter((q, i) => selected[i] === q.answer_index).length
    : 0;

  const handleSubmit = async () => {
    if (!allAnswered) return;
    setSubmitted(true);
    const s = questions.filter((q, i) => selected[i] === q.answer_index).length;
    await saveProgress(passageId, s, questions.length);
    if (user) {
      const isPerfect = s === questions.length;
      const xp = isPerfect ? 15 : 10;
      setXpEarned(xp);
      await addXp(user.uid, xp);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <button
        onClick={() => router.back()}
        className="text-2xl text-muted mb-5 hover:text-ink transition-colors block"
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
        {passage.lines.map((line, i) => (
          <button
            key={i}
            onClick={() => setActiveLine(activeLine === i ? null : i)}
            className={`w-full text-left p-3 rounded-xl border-l-[3px] mb-1 transition-colors ${
              activeLine === i
                ? 'border-red bg-redLight'
                : 'border-transparent hover:bg-cream'
            }`}
          >
            <p
              className="text-lg font-semibold text-ink leading-7"
              style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
            >
              {line.korean}
            </p>
            {showTranslation && (
              <p className="text-xs text-red mt-1">{line.translation}</p>
            )}
          </button>
        ))}
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

      {questions.map((q, qi) => (
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
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={`w-full py-4 rounded-xl font-bold transition-colors ${
            allAnswered
              ? 'bg-red text-white hover:opacity-90'
              : 'bg-border text-muted cursor-not-allowed'
          }`}
        >
          제출하기 →
        </button>
      ) : (
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
            <div className="flex items-center justify-center gap-2 mt-3 px-4 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.6)' }}>
              <span className="text-sm">⚡</span>
              <p className="text-sm font-bold text-ink">+{xpEarned} XP earned{xpEarned === 15 ? ' · Perfect score!' : ''}</p>
            </div>
          )}
        </div>
      )}

      <div className="h-8" />
    </div>
  );
}
