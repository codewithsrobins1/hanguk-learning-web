'use client';
import { useState } from 'react';
import Link from 'next/link';
import { hangulVowels, hangulConsonants, allHangul } from '@/data/hangul';

export default function HangulPage() {
  const [selected, setSelected] = useState<string | null>(null);

  const focusData = selected
    ? allHangul.find((c) => c.char === selected)
    : hangulConsonants.find((c) => c.char === 'ㅎ');

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-extrabold text-ink mb-6">Hangul</h1>

      {/* Study CTA */}
      <div className="bg-navy rounded-2xl p-5 mb-6 flex items-center justify-between">
        <div>
          <p className="text-cream font-extrabold text-base mb-0.5">
            Study Hangul
          </p>
          <p className="text-gray-400 text-xs">Vowels & Consonants</p>
        </div>
        <Link
          href="/hangul/session"
          className="px-5 py-2.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-90 flex-shrink-0"
          style={{ backgroundColor: '#E8412C', color: '#fff' }}
        >
          Study →
        </Link>
      </div>

      {/* Focus character */}
      <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-border mb-6">
        <p className="text-[10px] font-bold text-muted tracking-widest mb-4">
          FOCUS CHARACTER
        </p>
        <p
          className="text-[80px] font-bold text-ink leading-none mb-3"
          style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
        >
          {focusData?.char}
        </p>
        <p className="text-xl font-extrabold text-red mb-1">
          {focusData?.romanization}
        </p>
        <p className="text-sm text-muted">{focusData?.sound}</p>
      </div>

      {/* Vowels */}
      <p className="text-sm font-bold text-muted tracking-wider mb-3">VOWELS</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {hangulVowels.map((c) => (
          <button
            key={c.char}
            onClick={() => setSelected(c.char)}
            className={`w-[18%] py-2.5 rounded-xl border-[1.5px] flex flex-col items-center transition-colors ${
              selected === c.char
                ? 'bg-ink border-ink text-cream'
                : 'bg-white border-border hover:border-ink'
            }`}
          >
            <span
              className="text-lg"
              style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
            >
              {c.char}
            </span>
            <span
              className={`text-[9px] mt-0.5 ${selected === c.char ? 'text-gray-400' : 'text-muted'}`}
            >
              {c.romanization}
            </span>
          </button>
        ))}
      </div>

      {/* Consonants */}
      <p className="text-sm font-bold text-muted tracking-wider mb-3">
        CONSONANTS
      </p>
      <div className="flex flex-wrap gap-2">
        {hangulConsonants.map((c) => (
          <button
            key={c.char}
            onClick={() => setSelected(c.char)}
            className={`w-[18%] py-2.5 rounded-xl border-[1.5px] flex flex-col items-center transition-colors ${
              selected === c.char
                ? 'bg-ink border-ink text-cream'
                : 'bg-white border-border hover:border-ink'
            }`}
          >
            <span
              className="text-lg"
              style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
            >
              {c.char}
            </span>
            <span
              className={`text-[9px] mt-0.5 ${selected === c.char ? 'text-gray-400' : 'text-muted'}`}
            >
              {c.romanization}
            </span>
          </button>
        ))}
      </div>
      <div className="h-8" />
    </div>
  );
}
