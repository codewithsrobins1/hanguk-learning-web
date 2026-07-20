'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import VocabDemoWidget from './VocabDemoWidget';
import PatternsDemoWidget from './PatternsDemoWidget';

const FEATURES = [
  { icon: '⧉', label: 'Vocab', desc: 'Cloze flashcards that make you produce the word, not just recognize it.', color: '#F97316' },
  { icon: '文', label: 'Patterns', desc: 'Grammar patterns practiced inside real sentences, not isolated rules.', color: '#2563EB' },
  { icon: '≡', label: 'Reading', desc: 'Short passages with comprehension checks at your level.', color: '#7C3AED' },
  { icon: '🎧', label: 'Listening', desc: 'Native-paced audio you can slow down and replay.', color: '#0F9488' },
  { icon: '💬', label: 'Speaking', desc: 'Shadow real dialogue and get instant pronunciation feedback.', color: '#DB2777' },
  { icon: '🏅', label: 'TOPIK Prep', desc: 'Full-length practice tests scored like the real exam.', color: '#1A1F36' },
];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.5, delay, ease: 'easeOut' as const },
  };
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream overflow-x-hidden">
      {/* Nav */}
      <div className="flex items-center justify-between max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-orange rounded-xl flex items-center justify-center">
            <span className="text-white text-base font-bold" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>한</span>
          </div>
          <span className="font-quicksand font-bold text-ink text-lg tracking-tight">Hanguk</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-inkLight hover:text-ink transition-colors px-2">
            Log in
          </Link>
          <Link
            href="/signup"
            className="btn-press-orange bg-orange text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-border mb-6"
        >
          <span className="text-xs">✨</span>
          <span className="text-xs font-semibold text-inkLight">A modern, structured way to learn Korean</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-quicksand font-bold text-ink text-4xl md:text-6xl leading-tight mb-5"
        >
          Learn Korean like you<br className="hidden md:block" /> actually mean it.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-inkLight text-base md:text-lg max-w-xl mx-auto mb-9 leading-relaxed"
        >
          Vocab, grammar patterns, reading, listening, speaking, and full TOPIK practice tests —
          all in one focused app. No fluff, no ads, just real practice.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/signup"
            className="btn-press-orange bg-orange text-white px-7 py-3.5 rounded-2xl font-quicksand font-bold text-base hover:opacity-90 transition-opacity w-full sm:w-auto"
          >
            Get Started Free
          </Link>
          <a
            href="#demo"
            className="px-7 py-3.5 rounded-2xl border-2 border-border bg-white font-bold text-base text-ink hover:border-ink transition-colors w-full sm:w-auto text-center"
          >
            Try the demo below ↓
          </a>
        </motion.div>
      </div>

      {/* Feature grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              {...fadeUp(i * 0.06)}
              className="bg-white rounded-2xl border-2 border-border p-5"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-lg"
                style={{ background: `${f.color}1A`, color: f.color, fontFamily: 'Noto Sans KR, sans-serif' }}
              >
                {f.icon}
              </div>
              <p className="font-quicksand font-bold text-ink text-sm mb-1">{f.label}</p>
              <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Live demo */}
      <div id="demo" className="max-w-5xl mx-auto px-6 pb-20 scroll-mt-8">
        <motion.div {...fadeUp()} className="text-center mb-10">
          <h2 className="font-quicksand font-bold text-ink text-2xl md:text-3xl mb-2">
            Try it yourself — no sign-up required
          </h2>
          <p className="text-sm text-muted max-w-md mx-auto">
            Two real exercise types from the app, live. Tap an answer.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div {...fadeUp(0.1)}>
            <VocabDemoWidget />
          </motion.div>
          <motion.div {...fadeUp(0.2)}>
            <PatternsDemoWidget />
          </motion.div>
        </div>
      </div>

      {/* Closing CTA */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <motion.div
          {...fadeUp()}
          className="bg-navy rounded-3xl p-10 md:p-14 text-center flex flex-col items-center gap-4"
        >
          <h2 className="font-quicksand font-bold text-cream text-2xl md:text-3xl">
            Ready to actually learn Korean?
          </h2>
          <p className="text-white/60 text-sm max-w-sm">
            Free to start. Build a routine that sticks.
          </p>
          <Link
            href="/signup"
            className="btn-press-orange bg-orange text-white px-8 py-3.5 rounded-2xl font-quicksand font-bold text-base hover:opacity-90 transition-opacity mt-2"
          >
            Get Started Free
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-center gap-2 border-t border-border">
        <div className="w-6 h-6 bg-orange rounded-md flex items-center justify-center">
          <span className="text-white text-xs font-bold" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>한</span>
        </div>
        <span className="text-xs font-semibold text-muted">Hanguk</span>
      </div>
    </div>
  );
}
