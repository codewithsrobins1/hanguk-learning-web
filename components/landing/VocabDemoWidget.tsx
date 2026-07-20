'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type DemoCard = {
  sentence: string; // contains ___
  answer: string;
  options: string[];
  translation: string;
};

const CARDS: DemoCard[] = [
  {
    sentence: '저는 ___에 가요.',
    answer: '학교',
    options: ['학교', '병원', '공원', '시장'],
    translation: "I'm going to school.",
  },
  {
    sentence: '이것은 제 ___이에요.',
    answer: '친구',
    options: ['친구', '가족', '선생님', '학생'],
    translation: 'This is my friend.',
  },
  {
    sentence: '저는 ___를 마셔요.',
    answer: '커피',
    options: ['커피', '물', '우유', '주스'],
    translation: 'I drink coffee.',
  },
];

type AnswerState = 'idle' | 'correct' | 'wrong';

export default function VocabDemoWidget() {
  const [index, setIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [chosen, setChosen] = useState<string | null>(null);

  const card = CARDS[index];

  useEffect(() => {
    if (answerState === 'idle') return;
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % CARDS.length);
      setAnswerState('idle');
      setChosen(null);
    }, 1800);
    return () => clearTimeout(t);
  }, [answerState]);

  const handleAnswer = (opt: string) => {
    if (answerState !== 'idle') return;
    setChosen(opt);
    setAnswerState(opt === card.answer ? 'correct' : 'wrong');
  };

  const parts = card.sentence.split('___');

  const chipStyle = (opt: string) => {
    if (answerState === 'idle') {
      return { background: '#fff', borderColor: 'rgba(26,31,54,0.08)', color: '#111', opacity: 1 };
    }
    if (chosen === opt) {
      return answerState === 'correct'
        ? { background: '#EAF6EE', borderColor: '#8FD3A8', color: '#1E8E3E', opacity: 1 }
        : { background: '#FCEBE9', borderColor: '#F2A79D', color: '#C0392B', opacity: 1 };
    }
    if (answerState === 'wrong' && opt === card.answer) {
      return { background: '#EAF6EE', borderColor: '#8FD3A8', color: '#1E8E3E', opacity: 1 };
    }
    return { background: '#F7F4EE', borderColor: 'rgba(26,31,54,0.05)', color: '#BBB', opacity: 0.55 };
  };

  return (
    <div className="bg-white rounded-3xl border border-black/[0.07] p-6" style={{ boxShadow: '0 10px 30px rgba(26,31,54,0.06)' }}>
      <p className="text-[11px] font-bold text-orange tracking-widest mb-4">VOCAB · FILL IN THE BLANK</p>

      <div
        className={`rounded-2xl bg-navy p-6 mb-4 min-h-[90px] flex items-center justify-center transition-shadow duration-200 ${answerState === 'wrong' ? 'shake' : ''}`}
        style={{
          boxShadow: answerState === 'correct' ? '0 0 0 3px #8FD3A8' : answerState === 'wrong' ? '0 0 0 3px #F2A79D' : 'none',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-xl font-bold text-center text-cream"
            style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
          >
            {parts[0]}
            <span style={{ borderBottom: '2px solid rgba(255,255,255,0.5)', padding: '0 8px' }}>
              {answerState === 'idle' ? '___' : card.answer}
            </span>
            {parts[1]}
          </motion.p>
        </AnimatePresence>
      </div>

      <p className="text-xs text-red text-center font-semibold mb-4 h-4">
        {answerState === 'wrong' ? `Correct answer: ${card.answer}` : ' '}
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        {card.options.map((opt) => {
          const s = chipStyle(opt);
          return (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              disabled={answerState !== 'idle'}
              className="py-3.5 rounded-xl border font-bold text-base text-center transition-all"
              style={{ fontFamily: 'Noto Sans KR, sans-serif', background: s.background, borderColor: s.borderColor, color: s.color, opacity: s.opacity }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted text-center mt-3 h-4">
        {answerState !== 'idle' ? card.translation : ' '}
      </p>
    </div>
  );
}
