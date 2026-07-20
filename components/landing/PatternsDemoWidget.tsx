'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type DemoQuestion = {
  frame: string; // pattern name, e.g. "~고 싶어요"
  context: string; // Korean prompt
  fullSentence: string; // contains the answer literally
  answer: string;
  options: string[];
  translation: string;
};

const QUESTIONS: DemoQuestion[] = [
  {
    frame: '~을 수 있어요',
    context: '매운 음식 먹을 수 있어요?',
    fullSentence: '매운 음식 먹을 수 있어요',
    answer: '먹을 수 있어요',
    options: ['먹을 수 있어요', '먹고 싶어요', '먹었어요', '먹지 마세요'],
    translation: 'I can eat spicy food.',
  },
  {
    frame: '~고 싶어요',
    context: '뭘 배우고 싶어요?',
    fullSentence: '한국어를 배우고 싶어요',
    answer: '배우고 싶어요',
    options: ['배우고 싶어요', '배울 수 있어요', '배웠어요', '배우지 마세요'],
    translation: 'I want to learn Korean.',
  },
];

type AnswerState = 'idle' | 'correct' | 'wrong';

export default function PatternsDemoWidget() {
  const [index, setIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [chosen, setChosen] = useState<string | null>(null);

  const q = QUESTIONS[index];
  const split = q.fullSentence.split(q.answer);
  const before = split[0] ?? '';
  const after = split[1] ?? '';

  useEffect(() => {
    if (answerState === 'idle') return;
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % QUESTIONS.length);
      setAnswerState('idle');
      setChosen(null);
    }, 1800);
    return () => clearTimeout(t);
  }, [answerState]);

  const handleAnswer = (opt: string) => {
    if (answerState !== 'idle') return;
    setChosen(opt);
    setAnswerState(opt === q.answer ? 'correct' : 'wrong');
  };

  const rowStyle = (opt: string) => {
    if (answerState === 'idle') {
      return { background: '#fff', borderColor: 'rgba(26,31,54,0.08)', color: '#1A1F36', opacity: 1 };
    }
    if (chosen === opt) {
      return answerState === 'correct'
        ? { background: '#EAF6EE', borderColor: '#8FD3A8', color: '#1E8E3E', opacity: 1 }
        : { background: '#FCEBE9', borderColor: '#F2A79D', color: '#C0392B', opacity: 1 };
    }
    if (answerState === 'wrong' && opt === q.answer) {
      return { background: '#EAF6EE', borderColor: '#8FD3A8', color: '#1E8E3E', opacity: 1 };
    }
    return { background: '#F7F4EE', borderColor: 'rgba(26,31,54,0.05)', color: '#BBB', opacity: 0.55 };
  };

  return (
    <div className="bg-white rounded-3xl border border-black/[0.07] p-6" style={{ boxShadow: '0 10px 30px rgba(26,31,54,0.06)' }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-bold text-orange tracking-widest">PATTERNS · COMPLETE THE SENTENCE</p>
        <span className="px-2.5 py-1 rounded-full bg-orangeLight text-orange text-[10px] font-bold" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
          {q.frame}
        </span>
      </div>

      <div
        className={`rounded-2xl bg-navy px-5 py-4 mb-4 flex flex-col items-center gap-2 transition-shadow duration-200 ${answerState === 'wrong' ? 'shake' : ''}`}
        style={{
          boxShadow: answerState === 'correct' ? '0 0 0 3px #8FD3A8' : answerState === 'wrong' ? '0 0 0 3px #F2A79D' : 'none',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-center"
          >
            <p className="text-xs text-white/50 mb-1.5" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{q.context}</p>
            <p className="text-lg font-bold text-cream" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
              {before}
              <span style={{ borderBottom: '2px solid rgba(255,255,255,0.5)', padding: '0 8px' }}>
                {answerState === 'idle' ? '___' : q.answer}
              </span>
              {after}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="text-xs text-red text-center font-semibold mb-4 h-4">
        {answerState === 'wrong' ? `Correct answer: ${q.answer}` : ' '}
      </p>

      <div className="flex flex-col gap-2">
        {q.options.map((opt) => {
          const s = rowStyle(opt);
          return (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              disabled={answerState !== 'idle'}
              className="py-3 px-4 rounded-xl border font-bold text-sm text-left transition-all"
              style={{ fontFamily: 'Noto Sans KR, sans-serif', background: s.background, borderColor: s.borderColor, color: s.color, opacity: s.opacity }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted text-center mt-3 h-4">
        {answerState !== 'idle' ? q.translation : ' '}
      </p>
    </div>
  );
}
