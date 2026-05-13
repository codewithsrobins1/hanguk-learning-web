'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useMilestoneQuestions, saveMilestoneResult, parseMilestoneId } from '@/hooks/useGrammar';
import { addXp } from '@/lib/xp';

const LEVEL_LABELS: Record<string, string> = {
  beg: 'Beginner',
  int: 'Intermediate',
  adv: 'Advanced',
};

export default function MilestonePage() {
  const { milestoneId } = useParams<{ milestoneId: string }>();
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const { questions, loading } = useMilestoneQuestions(milestoneId);

  const [selected, setSelected] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const { prefix, group } = parseMilestoneId(milestoneId);
  const levelLabel = LEVEL_LABELS[prefix] ?? '';
  const allAnswered = Object.keys(selected).length === questions.length;
  const score = submitted ? questions.filter((q, i) => selected[i] === q.answer_index).length : 0;

  const handleSubmit = async () => {
    if (!allAnswered) return;
    const s = questions.filter((q, i) => selected[i] === q.answer_index).length;
    setSubmitted(true);
    if (user) {
      const didPass = await saveMilestoneResult(user.uid, milestoneId, s, questions.length);
      setPassed(didPass);
      if (didPass) {
        const xp = s === questions.length ? 15 : 10;
        setXpEarned(xp);
        await addXp(user.uid, xp);
        await refreshProfile();
      }
    }
  };

  const handleRetry = () => {
    setSelected({});
    setSubmitted(false);
    setPassed(false);
    setXpEarned(0);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-red border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 pb-16">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-2xl text-muted hover:text-ink transition-colors">←</button>
        <div>
          <p className="text-[11px] font-bold text-muted tracking-widest">CHECKPOINT</p>
          <h1 className="text-xl font-extrabold text-ink">{levelLabel} · Milestone {group}</h1>
        </div>
      </div>

      {/* Intro card */}
      {!submitted && (
        <div className="bg-navy rounded-2xl p-5 mb-6 text-center">
          <p className="text-3xl mb-3">🏆</p>
          <p className="text-cream font-extrabold text-lg mb-1">Checkpoint Quiz</p>
          <p className="text-gray-400 text-sm">4 questions from the last 5 lessons. Score 3 or more to unlock the next group.</p>
        </div>
      )}

      {/* Questions */}
      {questions.map((q, qi) => (
        <div key={qi} className="bg-white rounded-2xl border border-border p-4 mb-3">
          <p className="font-bold text-ink text-sm mb-3 leading-5">{qi + 1}. {q.prompt}</p>
          <div className="grid grid-cols-2 gap-2">
            {q.options.map((opt, oi) => {
              const isSel = selected[qi] === oi;
              const isRight = submitted && oi === q.answer_index;
              const isWrong = submitted && isSel && oi !== q.answer_index;
              return (
                <button
                  key={oi}
                  onClick={() => !submitted && setSelected({ ...selected, [qi]: oi })}
                  disabled={submitted}
                  className={`p-2.5 rounded-xl border-2 text-sm font-bold text-center transition-colors ${
                    isRight ? 'bg-greenLight border-green text-green'
                    : isWrong ? 'bg-redLight border-red text-red'
                    : isSel ? 'bg-ink border-ink text-cream'
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

      {/* Submit / Results */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={`w-full py-4 rounded-xl font-bold transition-colors ${
            allAnswered ? 'bg-red text-white hover:opacity-90' : 'bg-border text-muted cursor-not-allowed'
          }`}
        >
          Submit →
        </button>
      ) : passed ? (
        <>
          <div className="rounded-2xl p-6 text-center border-2 bg-greenLight border-green mb-3">
            <p className="text-3xl mb-2">🎉</p>
            <p className="text-2xl font-extrabold text-ink mb-1">{score}/{questions.length} correct</p>
            <p className="text-sm font-semibold" style={{ color: '#16A34A' }}>Checkpoint passed! Next group unlocked.</p>
            {xpEarned > 0 && (
              <div className="flex items-center justify-center gap-2 mt-3 px-4 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.6)' }}>
                <span>⚡</span>
                <p className="text-sm font-bold text-ink">+{xpEarned} XP earned{xpEarned === 15 ? ' · Perfect!' : ''}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => router.push('/grammar')}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-cream hover:opacity-90 transition-opacity"
            style={{ background: '#1A1F36' }}
          >
            Continue on Roadmap →
          </button>
        </>
      ) : (
        <>
          <div className="rounded-2xl p-6 text-center border-2 bg-redLight border-red mb-3">
            <p className="text-3xl mb-2">💪</p>
            <p className="text-2xl font-extrabold text-ink mb-1">{score}/{questions.length} correct</p>
            <p className="text-sm text-muted">You need 3 or more to pass. Review the lessons and try again.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 py-3.5 rounded-xl border-2 border-border bg-white font-bold text-sm text-ink hover:bg-cream transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/grammar')}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm text-cream hover:opacity-90"
              style={{ background: '#1A1F36' }}
            >
              Back to Roadmap
            </button>
          </div>
        </>
      )}
    </div>
  );
}
