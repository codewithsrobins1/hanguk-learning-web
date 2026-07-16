'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LevelUpOverlay() {
  const [level, setLevel] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ level: number }>).detail;
      setLevel(detail.level);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setLevel(null), 2000);
    };
    window.addEventListener('hanguk:levelup', handler);
    return () => {
      window.removeEventListener('hanguk:levelup', handler);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {level !== null && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(26,31,54,0.85)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setLevel(null)}
        >
          <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <span className="text-6xl mb-3">🎉</span>
            <p className="font-quicksand font-extrabold text-cream text-5xl mb-1">Level {level}!</p>
            <p className="text-white/60 text-sm font-semibold">You leveled up</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
