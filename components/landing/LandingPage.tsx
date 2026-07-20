'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import VocabDemoWidget from './VocabDemoWidget';
import PatternsDemoWidget from './PatternsDemoWidget';

type Feature = {
  label: string;
  desc: string;
  iconBg: string;
  icon: React.ReactNode;
  dark?: boolean;
};

const FEATURES: Feature[] = [
  {
    label: 'Vocab',
    desc: 'Cloze flashcards that make you produce the word, not just recognize it.',
    iconBg: '#FFF3E8',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="4"
          y="4"
          width="11"
          height="11"
          rx="2"
          stroke="#F97316"
          strokeWidth="1.7"
        />
        <rect
          x="9"
          y="9"
          width="11"
          height="11"
          rx="2"
          stroke="#F97316"
          strokeWidth="1.7"
        />
      </svg>
    ),
  },
  {
    label: 'Patterns',
    desc: 'Grammar patterns practiced inside real sentences, not isolated rules.',
    iconBg: '#EAF1FF',
    icon: (
      <span
        className="font-bold text-lg"
        style={{ fontFamily: 'Noto Sans KR, sans-serif', color: '#2563EB' }}
      >
        文
      </span>
    ),
  },
  {
    label: 'Reading',
    desc: 'Short passages with comprehension checks at your level.',
    iconBg: '#F3E8FF',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 6h16M4 12h16M4 18h10"
          stroke="#7C3AED"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: 'Listening',
    desc: 'Native-paced audio you can slow down and replay.',
    iconBg: '#E6FAF5',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 13v-1a8 8 0 0116 0v1"
          stroke="#0F9488"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <rect
          x="2.5"
          y="12"
          width="4.5"
          height="7"
          rx="1.5"
          stroke="#0F9488"
          strokeWidth="1.7"
        />
        <rect
          x="17"
          y="12"
          width="4.5"
          height="7"
          rx="1.5"
          stroke="#0F9488"
          strokeWidth="1.7"
        />
      </svg>
    ),
  },
  {
    label: 'Speaking',
    desc: 'Shadow real dialogue and get instant pronunciation feedback.',
    iconBg: '#FCE7F3',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 5h16v10H9l-5 4v-4H4z"
          stroke="#DB2777"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'TOPIK Prep',
    desc: 'Practice tests scored like the real exam.',
    iconBg: 'rgba(249,115,22,0.18)',
    dark: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="5"
          y="4"
          width="14"
          height="17"
          rx="2"
          stroke="#F97316"
          strokeWidth="1.8"
        />
        <path d="M9 3h6v3H9z" fill="#F97316" />
      </svg>
    ),
  },
];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
  };
}

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-cream overflow-x-hidden"
      style={{ fontFamily: "'Sora', sans-serif" }}
    >
      {/* Sticky nav */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
        style={{
          background: 'rgba(247,244,238,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(26,31,54,0.06)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-orange rounded-lg flex items-center justify-center">
            <span
              className="text-white text-sm font-black"
              style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
            >
              한
            </span>
          </div>
          <span className="font-quicksand font-bold text-ink text-lg">
            Hanguk
          </span>
        </div>
        <div className="flex items-center gap-8">
          <a
            href="#features"
            className="hidden sm:inline text-sm font-semibold text-inkLight hover:text-ink transition-colors"
          >
            Features
          </a>
          <a
            href="#demo"
            className="hidden sm:inline text-sm font-semibold text-inkLight hover:text-ink transition-colors"
          >
            Demo
          </a>
          <Link
            href="/login"
            className="text-sm font-semibold text-inkLight hover:text-ink transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="btn-press-navy bg-navy text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="relative px-6 pt-20 md:pt-24 pb-20 flex flex-col items-center text-center overflow-hidden">
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: -120,
            left: '8%',
            width: 420,
            height: 420,
            background: '#F97316',
            opacity: 0.16,
            filter: 'blur(90px)',
            animation: 'blobFloatA 12s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: 60,
            right: '6%',
            width: 380,
            height: 380,
            background: '#1A1F36',
            opacity: 0.12,
            filter: 'blur(90px)',
            animation: 'blobFloatB 14s ease-in-out infinite',
          }}
        />

        <div className="relative flex flex-col items-center gap-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{ animation: 'gentleFloat 5s ease-in-out infinite' }}
            className="inline-flex items-center gap-2 bg-white border border-black/[0.08] rounded-full px-5 py-2 text-[13px] font-semibold text-ink"
          >
            <span className="text-orange">✦</span> Structured way to learn
            Korean
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-quicksand font-bold text-ink text-4xl md:text-6xl leading-[1.08]"
          >
            Learn Korean like
            <br className="hidden md:block" /> you actually mean it.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-inkLight text-base md:text-lg max-w-xl leading-relaxed"
          >
            Vocab, grammar patterns, reading, listening, speaking, and full
            TOPIK practice tests — all in one focused app. No fluff, no ads,
            just real practice.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-3.5 mt-1"
          >
            <Link
              href="/signup"
              className="btn-press-orange bg-orange text-white px-7 py-4 rounded-2xl font-bold text-[15px] hover:brightness-105 transition-all w-full sm:w-auto"
            >
              Get Started Free
            </Link>
            <a
              href="#demo"
              className="px-6 py-4 rounded-2xl border-[1.5px] border-black/[0.15] bg-white font-bold text-[15px] text-ink hover:border-black/30 hover:-translate-y-0.5 transition-all w-full sm:w-auto text-center"
            >
              Try the demo below ↓
            </a>
          </motion.div>
        </div>
      </div>

      {/* Feature grid */}
      <div id="features" className="max-w-6xl mx-auto px-6 pb-24 scroll-mt-20">
        <motion.div {...fadeUp()} className="text-center mb-11">
          <div className="text-[13px] font-bold text-orange tracking-widest uppercase mb-2.5">
            Everything you need
          </div>
          <h2 className="font-quicksand font-bold text-ink text-3xl md:text-4xl">
            Six skills. One app.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              {...fadeUp((i % 3) * 0.05)}
              className="hg-feature-card rounded-[20px] p-6 flex flex-col gap-3"
              style={{
                background: f.dark ? '#1A1F36' : '#fff',
                border: f.dark
                  ? '1px solid #1A1F36'
                  : '1px solid rgba(26,31,54,0.06)',
              }}
            >
              <div
                className="w-11 h-11 rounded-[13px] flex items-center justify-center"
                style={{ background: f.iconBg }}
              >
                {f.icon}
              </div>
              <p
                className="font-quicksand font-bold text-[15px]"
                style={{ color: f.dark ? '#fff' : '#1A1F36' }}
              >
                {f.label}
              </p>
              <p
                className="text-[13.5px] leading-relaxed"
                style={{ color: f.dark ? 'rgba(255,255,255,0.6)' : '#888' }}
              >
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Live demo */}
      <div id="demo" className="max-w-5xl mx-auto px-6 pb-24 scroll-mt-8">
        <motion.div {...fadeUp()} className="text-center mb-10">
          <h2 className="font-quicksand font-bold text-ink text-2xl md:text-3xl mb-2">
            Try it yourself — no sign-up required
          </h2>
          <p className="text-sm text-muted max-w-md mx-auto">
            Two real exercise types from the app, live. Tap an answer.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp(0.1)}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <VocabDemoWidget />
          <PatternsDemoWidget />
        </motion.div>
      </div>

      {/* Closing CTA */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          {...fadeUp()}
          className="relative bg-navy rounded-[28px] p-10 md:p-14 text-center flex flex-col items-center gap-4 overflow-hidden"
        >
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              top: -100,
              right: -60,
              width: 280,
              height: 280,
              background: '#F97316',
              opacity: 0.2,
              filter: 'blur(70px)',
            }}
          />
          <h2 className="relative font-quicksand font-bold text-cream text-2xl md:text-3xl">
            Start speaking Korean with confidence.
          </h2>
          <p className="relative text-white/60 text-sm max-w-sm">
            Free to start. No credit card required.
          </p>
          <Link
            href="/signup"
            className="btn-press-orange relative bg-orange text-white px-8 py-4 rounded-2xl font-bold text-[15px] hover:brightness-105 transition-all mt-2"
          >
            Get Started Free
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-7 flex items-center justify-between border-t border-black/[0.06]">
        <span className="text-[13px] text-muted/70">© 2026 Hanguk</span>
        <div className="flex gap-5">
          <a
            href="#"
            className="text-[13px] text-muted hover:text-ink transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-[13px] text-muted hover:text-ink transition-colors"
          >
            Terms
          </a>
        </div>
      </div>

      <style>{`
        .hg-feature-card { transition: transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s ease, border-color 0.25s ease; }
        .hg-feature-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(26,31,54,0.12); border-color: rgba(249,115,22,0.3); }
      `}</style>
    </div>
  );
}
