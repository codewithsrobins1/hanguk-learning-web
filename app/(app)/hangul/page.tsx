'use client';
import Link from 'next/link';
import { hangulVowels, hangulConsonants } from '@/data/hangul';

function SummaryCard({
  title,
  count,
  chars,
  href,
}: {
  title: string;
  count: string;
  chars: string[];
  href: string;
}) {
  return (
    <div className="bg-navy rounded-3xl p-6 flex flex-col gap-3.5">
      <p className="text-white/50 text-xs font-semibold tracking-wider">{title}</p>
      <p className="font-quicksand font-bold text-cream text-xl">{count}</p>
      <div className="flex gap-2 flex-wrap">
        {chars.map((c) => (
          <span
            key={c}
            className="bg-cream text-ink font-bold px-3 py-1.5 rounded-full text-sm"
            style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
          >
            {c}
          </span>
        ))}
      </div>
      <Link
        href={href}
        className="self-start mt-1 px-4 py-2.5 rounded-xl bg-orange text-white font-bold text-xs hover:opacity-90 transition-opacity"
      >
        View all →
      </Link>
    </div>
  );
}

export default function HangulPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-4">
      <div>
        <h1 className="font-quicksand font-bold text-ink text-3xl mb-1">Hangul</h1>
        <p className="text-sm text-muted">Learn the Korean alphabet</p>
      </div>

      <SummaryCard
        title="모음 · VOWELS"
        count={`${hangulVowels.length} vowels`}
        chars={hangulVowels.slice(0, 5).map((c) => c.char)}
        href="/hangul/reference?tab=vowels"
      />
      <SummaryCard
        title="자음 · CONSONANTS"
        count={`${hangulConsonants.length} consonants`}
        chars={hangulConsonants.slice(0, 5).map((c) => c.char)}
        href="/hangul/reference?tab=consonants"
      />

      <div className="bg-white rounded-2xl p-5" style={{ border: '1.5px solid #1A1F36' }}>
        <p className="font-quicksand font-bold text-ink text-base mb-3">Ready to practice?</p>
        <Link
          href="/hangul/session"
          className="btn-press-orange block text-center w-full py-4 rounded-2xl bg-orange text-white font-quicksand font-bold text-base"
        >
          Start Hangul Practice →
        </Link>
      </div>
    </div>
  );
}
