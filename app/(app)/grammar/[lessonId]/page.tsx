'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useGrammarLesson, saveGrammarProgress } from '@/hooks/useGrammar';
import { addXp } from '@/lib/xp';
import Link from 'next/link';

const LEVEL_COLORS = {
  Beginner: { bg: '#F0FFF4', text: '#16A34A' },
  Intermediate: { bg: '#FFF7ED', text: '#F97316' },
  Advanced: { bg: '#FFF0EE', text: '#E8412C' },
};

type AIContent = {
  examples: { korean: string; translation: string }[];
  dialogue: {
    context: string;
    lines: { speaker: string; korean: string; translation: string }[];
  };
};

const selectStyle = {
  backgroundColor: '#fff',
  border: '1.5px solid #E8E3D8',
  borderRadius: 12,
  padding: '0 12px',
  height: 36,
  fontSize: 12,
  fontWeight: 600,
  color: '#111',
  outline: 'none',
  cursor: 'pointer',
  appearance: 'none' as const,
  WebkitAppearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  paddingRight: 28,
};

export default function GrammarLessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();
  const { lesson, questions, loading } = useGrammarLesson(lessonId);

  // Quiz state
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  // AI content state
  const [aiContent, setAiContent] = useState<AIContent | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const [activeInterest, setActiveInterest] = useState('');

  const interests: string[] = profile?.interests ?? [];

  const fetchAiContent = useCallback(
    async (interest: string) => {
      if (!lesson || !interest) return;
      setAiLoading(true);
      setAiError(false);
      try {
        const res = await fetch('/api/grammar/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titleKo: lesson.title_ko,
            titleEn: lesson.title_en,
            explanation: lesson.explanation,
            interest,
          }),
        });
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        setAiContent(data);
      } catch {
        setAiError(true);
      } finally {
        setAiLoading(false);
      }
    },
    [lesson]
  );

  // Pick random interest and fetch on lesson load
  useEffect(() => {
    if (!lesson || interests.length === 0) return;
    const random = interests[Math.floor(Math.random() * interests.length)];
    setActiveInterest(random);
    fetchAiContent(random);
  }, [lesson]); // eslint-disable-line

  const handleInterestChange = (interest: string) => {
    setActiveInterest(interest);
    setAiContent(null);
    fetchAiContent(interest);
  };

  const handleSubmit = async () => {
    if (!Object.keys(selected).length) return;
    const allAnswered = Object.keys(selected).length === questions.length;
    if (!allAnswered) return;
    setSubmitted(true);
    const s = questions.filter((q, i) => selected[i] === q.answer_index).length;
    if (user) {
      await saveGrammarProgress(user.uid, lessonId, s, questions.length);
      const isPerfect = s === questions.length;
      const xp = isPerfect ? 15 : 10;
      setXpEarned(xp);
      await addXp(user.uid, xp);
      await refreshProfile();
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!lesson)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8">
        <p className="text-muted">Lesson not found.</p>
        <button
          onClick={() => router.back()}
          className="bg-ink text-cream px-6 py-3 rounded-xl font-bold text-sm"
        >
          Go Back
        </button>
      </div>
    );

  const levelColor = LEVEL_COLORS[lesson.level] ?? LEVEL_COLORS.Beginner;
  const allAnswered = Object.keys(selected).length === questions.length;
  const score = submitted
    ? questions.filter((q, i) => selected[i] === q.answer_index).length
    : 0;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="text-2xl text-muted hover:text-ink transition-colors"
        >
          ←
        </button>
        <span
          className="text-xs font-bold px-3 py-1 rounded-full"
          style={{ background: levelColor.bg, color: levelColor.text }}
        >
          {lesson.level}
        </span>
      </div>

      {/* Title */}
      <h1
        className="text-4xl font-extrabold text-ink mb-1"
        style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
      >
        {lesson.title_ko}
      </h1>
      <p className="text-base text-muted font-semibold mb-6">
        {lesson.title_en}
      </p>

      {/* Explanation */}
      <div className="bg-white rounded-2xl border border-border p-5 mb-5">
        <p className="text-[11px] font-bold text-muted tracking-widest mb-2">
          EXPLANATION
        </p>
        <p className="text-sm text-ink leading-relaxed">{lesson.explanation}</p>
      </div>

      {/* AI Examples */}
      <div className="bg-white rounded-2xl border border-border p-5 mb-6">
        {/* Section header with interest dropdown */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-bold text-muted tracking-widest">
            EXAMPLES
          </p>
          {interests.length > 1 && (
            <select
              value={activeInterest}
              onChange={(e) => handleInterestChange(e.target.value)}
              style={selectStyle}
              disabled={aiLoading}
            >
              {interests.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Loading state */}
        {aiLoading && (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="w-6 h-6 border-2 border-navy border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-muted">
              {aiContent ? 'Updating your lesson...' : 'Generating examples...'}
            </p>
          </div>
        )}

        {/* Error state */}
        {aiError && !aiLoading && (
          <div className="flex flex-col items-center py-6 gap-3">
            <p className="text-xs text-muted text-center">
              Couldn't load examples.
            </p>
            <button
              onClick={() => fetchAiContent(activeInterest)}
              className="text-xs font-bold text-navy hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* AI content */}
        {aiContent && !aiLoading && (
          <>
            {/* 5 examples */}
            <div className="flex flex-col gap-3 mb-5">
              {aiContent.examples.map((ex, i) => (
                <div key={i} className="border-l-[3px] border-navy pl-3">
                  <p
                    className="text-base font-semibold text-ink leading-relaxed"
                    style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
                  >
                    {ex.korean}
                  </p>
                  <p className="text-xs text-muted mt-0.5">{ex.translation}</p>
                </div>
              ))}
            </div>

            {/* Mini dialogue */}
            <div className="bg-cream rounded-xl p-4">
              <p className="text-[10px] font-bold text-muted tracking-widest mb-1">
                MINI DIALOGUE
              </p>
              <p className="text-[11px] text-muted italic mb-3">
                {aiContent.dialogue.context}
              </p>
              <div className="flex flex-col gap-2.5">
                {aiContent.dialogue.lines.map((line, i) => {
                  const isA = line.speaker === 'A';
                  return (
                    <div
                      key={i}
                      className={`flex gap-2 ${isA ? '' : 'flex-row-reverse'}`}
                    >
                      <div
                        className="flex items-center justify-center flex-shrink-0 w-6 h-6 rounded-full text-[10px] font-extrabold text-white mt-1"
                        style={{ background: isA ? '#1A1F36' : '#E8412C' }}
                      >
                        {line.speaker}
                      </div>
                      <div
                        className={`max-w-[80%] px-3 py-2 rounded-xl ${isA ? 'rounded-tl-none' : 'rounded-tr-none'} bg-white border border-border`}
                      >
                        <p
                          className="text-sm font-semibold text-ink"
                          style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
                        >
                          {line.korean}
                        </p>
                        <p className="text-[11px] text-muted mt-0.5">
                          {line.translation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* No interests fallback */}
        {!aiLoading && !aiContent && !aiError && interests.length === 0 && (
          <p className="text-xs text-muted text-center py-4">
            <Link
              href="/grammar"
              className="text-navy font-bold hover:underline"
            >
              Set your interests
            </Link>{' '}
            to see personalized examples.
          </p>
        )}
      </div>

      {/* Quiz */}
      {questions.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-bold text-muted tracking-widest">
              QUICK QUIZ
            </p>
            <p className="text-xs text-muted">Fill in the blank</p>
          </div>

          {questions.map((q, qi) => (
            <div
              key={qi}
              className="bg-white rounded-2xl border border-border p-4 mb-3"
            >
              <p className="font-bold text-ink text-sm mb-3 leading-5">
                {qi + 1}. {q.prompt}
              </p>
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
                      {opt}
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
              Submit →
            </button>
          ) : (
            <>
              <div
                className={`rounded-2xl p-5 text-center border-2 ${score === questions.length ? 'bg-greenLight border-green' : 'bg-redLight border-red'}`}
              >
                <p className="text-2xl font-extrabold text-ink mb-1">
                  {score}/{questions.length} correct
                </p>
                <p className="text-sm text-muted">
                  {score === questions.length
                    ? '🎉 Perfect score!'
                    : 'Keep practicing!'}
                </p>
                {xpEarned > 0 && (
                  <div
                    className="flex items-center justify-center gap-2 mt-3 px-4 py-2 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.6)' }}
                  >
                    <span className="text-sm">⚡</span>
                    <p className="text-sm font-bold text-ink">
                      +{xpEarned} XP earned
                      {xpEarned === 15 ? ' · Perfect!' : ''}
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={() => router.push('/grammar')}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-cream mt-3 hover:opacity-90 transition-opacity"
                style={{ background: '#1A1F36' }}
              >
                ← Back to Grammar
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}
