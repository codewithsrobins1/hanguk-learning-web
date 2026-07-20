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
    }, 1400);
    return () => clearTimeout(t);
  }, [answerState]);

  const handleAnswer = (opt: string) => {
    if (answerState !== 'idle') return;
    setChosen(opt);
    setAnswerState(opt === q.answer ? 'correct' : 'wrong');
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-bold text-muted tracking-widest">PATTERNS · COMPLETE THE SENTENCE</p>
        <span className="px-2.5 py-1 rounded-full bg-orangeLight text-orange text-[11px] font-bold" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
          {q.frame}
        </span>
      </div>

      <div className="rounded-2xl bg-navy p-6 mb-4 min-h-[110px] flex flex-col items-center justify-center gap-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-center"
          >
            <p className="text-xs text-white/40 mb-2">{q.context}</p>
            <p className="text-xl font-semibold leading-9" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
              {answerState === 'idle' ? (
                <span className="text-cream">
                  {before}
                  <span className="text-orange">___</span>
                  {after}
                </span>
              ) : (
                <span className="text-cream">
                  {before}
                  <span style={{ color: answerState === 'correct' ? '#4ADE80' : '#FCA5A5' }}>{q.answer}</span>
                  {after}
                </span>
              )}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="text-xs text-muted text-center mb-4 h-4">
        {answerState !== 'idle' ? q.translation : ' '}
      </p>

      <div className="grid grid-cols-1 gap-2.5">
        {q.options.map((opt) => {
          const isCorrect = answerState !== 'idle' && opt === q.answer;
          const isWrongChoice = answerState === 'wrong' && opt === chosen;
          return (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              disabled={answerState !== 'idle'}
              className="py-3 rounded-xl border-2 font-bold text-sm transition-all text-center"
              style={{
                fontFamily: 'Noto Sans KR, sans-serif',
                background: isCorrect ? '#F0FFF4' : isWrongChoice ? '#FFF5F5' : '#fff',
                borderColor: isCorrect ? '#86EFAC' : isWrongChoice ? '#FCA5A5' : '#E8E3D8',
                color: isCorrect ? '#16A34A' : isWrongChoice ? '#E8412C' : '#111',
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
