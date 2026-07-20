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
    }, 1400);
    return () => clearTimeout(t);
  }, [answerState]);

  const handleAnswer = (opt: string) => {
    if (answerState !== 'idle') return;
    setChosen(opt);
    setAnswerState(opt === card.answer ? 'correct' : 'wrong');
  };

  const parts = card.sentence.split('___');

  return (
    <div className="bg-white rounded-3xl border-2 border-border p-6">
      <p className="text-[11px] font-bold text-muted tracking-widest mb-4">VOCAB · FILL IN THE BLANK</p>

      <div className="rounded-2xl bg-navy p-6 mb-4 min-h-[110px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-xl font-semibold text-center leading-9"
            style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
          >
            {answerState === 'idle' ? (
              <span className="text-cream">
                {parts[0]}
                <span className="text-orange">___</span>
                {parts[1]}
              </span>
            ) : (
              <span className="text-cream">
                {parts[0]}
                <span style={{ color: answerState === 'correct' ? '#4ADE80' : '#FCA5A5' }}>{card.answer}</span>
                {parts[1]}
              </span>
            )}
          </motion.p>
        </AnimatePresence>
      </div>

      <p className="text-xs text-muted text-center mb-4 h-4">
        {answerState !== 'idle' ? card.translation : ' '}
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        {card.options.map((opt) => {
          const isCorrect = answerState !== 'idle' && opt === card.answer;
          const isWrongChoice = answerState === 'wrong' && opt === chosen;
          return (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              disabled={answerState !== 'idle'}
              className="py-3 rounded-xl border-2 font-bold text-base transition-all"
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
