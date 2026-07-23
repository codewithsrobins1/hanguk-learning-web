'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  SINO_ONES, SINO_TEENS, SINO_TENS, SINO_HUNDREDS, SINO_THOUSANDS,
  NATIVE_ONES_TABLE, NATIVE_TENS_TABLE, NATIVE_COMBO_EXAMPLES, NATIVE_COUNTER_FORMS,
} from '@/data/numbers';

function NumChip({ n, word }: { n: number; word: string }) {
  return (
    <div className="flex flex-col items-center justify-center bg-cream rounded-xl border border-border py-2.5 px-1 min-w-[64px]">
      <span className="font-bold text-ink text-[16px]" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{word}</span>
      <span className="text-[12px] font-semibold text-muted mt-0.5">{n.toLocaleString()}</span>
    </div>
  );
}

type System = 'sino' | 'native';

export default function NumbersPage() {
  const [system, setSystem] = useState<System>('sino');

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">
      <div>
        <h1 className="font-quicksand font-bold text-ink text-[32px] mb-1">Numbers</h1>
        <p className="text-[16px] text-muted">Korean has two number systems — here's when to use each one.</p>
      </div>

      {/* When to use each */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-navy rounded-2xl p-5">
          <p className="text-white/50 text-[13px] font-bold tracking-widest mb-1.5">한자어 · SINO-KOREAN</p>
          <p className="text-cream text-[16px] leading-relaxed">
            Dates, money, phone numbers, minutes, floor numbers — and any number over 99.
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5" style={{ border: '2px solid #1A1F36' }}>
          <p className="text-muted text-[13px] font-bold tracking-widest mb-1.5">고유어 · NATIVE KOREAN</p>
          <p className="text-ink text-[16px] leading-relaxed">
            Counting objects or people, someone's age, and the hour on a clock. Caps out at 99 — there's no native word for 100.
          </p>
        </div>
      </div>

      {/* Toggle */}
      <div className="flex bg-white rounded-2xl border-2 border-border p-1.5 gap-1.5 sticky top-4 z-10">
        <button
          onClick={() => setSystem('sino')}
          className="flex-1 py-2.5 rounded-xl font-quicksand font-bold text-[16px] transition-all"
          style={{ background: system === 'sino' ? '#1A1F36' : 'transparent', color: system === 'sino' ? '#F7F4EE' : '#888' }}
        >
          Sino-Korean
        </button>
        <button
          onClick={() => setSystem('native')}
          className="flex-1 py-2.5 rounded-xl font-quicksand font-bold text-[16px] transition-all"
          style={{ background: system === 'native' ? '#1A1F36' : 'transparent', color: system === 'native' ? '#F7F4EE' : '#888' }}
        >
          Native Korean
        </button>
      </div>

      {/* ── Sino-Korean ─────────────────────────────────────── */}
      {system === 'sino' && (
        <div className="bg-white rounded-3xl border-2 border-border p-6 flex flex-col gap-4">
          <div>
            <p className="font-quicksand font-bold text-ink text-[22px]">Sino-Korean</p>
            <p className="text-[16px] text-muted mt-1">
              Built from 10 digit-words. Every other number is just those digits stacked together with a
              place-value word — there's nothing to memorize past 10.
            </p>
          </div>

          <div>
            <p className="text-[13px] font-bold text-muted tracking-widest mb-2">0–9</p>
            <div className="flex flex-wrap gap-2">
              {SINO_ONES.map((d) => <NumChip key={d.n} n={d.n} word={d.word} />)}
            </div>
          </div>

          <div className="bg-cream rounded-2xl p-4">
            <p className="text-[14px] font-bold text-ink mb-1.5">The rule for 10s, 100s, 1,000s</p>
            <p className="text-[14px] text-muted leading-relaxed">
              십 = 10, 백 = 100, 천 = 1,000, 만 = 10,000. To build any number, say the digit, then the
              place value, left to right — just like writing the digits themselves. One exception: don't
              say "일" before 십/백/천 (100 is 백, not 일백).
            </p>
          </div>

          <div>
            <p className="text-[13px] font-bold text-muted tracking-widest mb-2">11–19 (십 + digit)</p>
            <div className="flex flex-wrap gap-2">
              {SINO_TEENS.map((d) => <NumChip key={d.n} n={d.n} word={d.word} />)}
            </div>
          </div>

          <div>
            <p className="text-[13px] font-bold text-muted tracking-widest mb-2">10s (digit + 십)</p>
            <div className="flex flex-wrap gap-2">
              {SINO_TENS.map((d) => <NumChip key={d.n} n={d.n} word={d.word} />)}
            </div>
          </div>

          <div>
            <p className="text-[13px] font-bold text-muted tracking-widest mb-2">100s (digit + 백)</p>
            <div className="flex flex-wrap gap-2">
              {SINO_HUNDREDS.map((d) => <NumChip key={d.n} n={d.n} word={d.word} />)}
            </div>
          </div>

          <div>
            <p className="text-[13px] font-bold text-muted tracking-widest mb-2">1,000s → 10,000</p>
            <div className="flex flex-wrap gap-2">
              {SINO_THOUSANDS.map((d) => <NumChip key={d.n} n={d.n} word={d.word} />)}
            </div>
          </div>

          <Link
            href="/numbers/practice/sino"
            className="btn-press-orange w-full text-center py-4 rounded-2xl bg-orange text-white font-quicksand font-bold text-[18px]"
          >
            Practice Sino-Korean →
          </Link>
        </div>
      )}

      {/* ── Native Korean ───────────────────────────────────── */}
      {system === 'native' && (
        <div className="bg-white rounded-3xl border-2 border-border p-6 flex flex-col gap-4">
          <div>
            <p className="font-quicksand font-bold text-ink text-[22px]">Native Korean</p>
            <p className="text-[16px] text-muted mt-1">
              Only goes up to 99. 1–10 are their own words, and each ten (20, 30…90) also gets its own
              dedicated word — not built from 십 like Sino-Korean.
            </p>
          </div>

          <div>
            <p className="text-[13px] font-bold text-muted tracking-widest mb-2">1–10</p>
            <div className="flex flex-wrap gap-2">
              {NATIVE_ONES_TABLE.map((d) => <NumChip key={d.n} n={d.n} word={d.word} />)}
            </div>
          </div>

          <div>
            <p className="text-[13px] font-bold text-muted tracking-widest mb-2">20, 30, 40…90 — dedicated words</p>
            <div className="flex flex-wrap gap-2">
              {NATIVE_TENS_TABLE.map((d) => <NumChip key={d.n} n={d.n} word={d.word} />)}
            </div>
          </div>

          <div className="bg-cream rounded-2xl p-4">
            <p className="text-[14px] font-bold text-ink mb-1.5">Combining them</p>
            <p className="text-[14px] text-muted leading-relaxed mb-3">
              Same idea as Sino-Korean from here — tens word + ones word, stuck together.
            </p>
            <div className="flex flex-wrap gap-2">
              {NATIVE_COMBO_EXAMPLES.map((d) => <NumChip key={d.n} n={d.n} word={d.word} />)}
            </div>
          </div>

          <div className="rounded-2xl p-4" style={{ background: '#FFF7ED', border: '2px solid #FED7AA' }}>
            <p className="text-[14px] font-bold mb-1.5" style={{ color: '#F97316' }}>Watch for: contracted forms</p>
            <p className="text-[14px] leading-relaxed mb-3" style={{ color: '#7C3A00' }}>
              하나, 둘, 셋, 넷, and 스물 shorten when they come right before a counting word (개, 명, 살, 시…).
            </p>
            <div className="flex flex-col gap-1.5">
              {NATIVE_COUNTER_FORMS.map((c) => (
                <div key={c.full} className="flex items-center gap-2 text-[14px]">
                  <span className="font-bold text-muted line-through" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{c.full}</span>
                  <span className="text-muted">→</span>
                  <span className="font-bold" style={{ fontFamily: 'Noto Sans KR, sans-serif', color: '#B45309' }}>{c.contracted}</span>
                  <span className="text-muted">·</span>
                  <span className="font-semibold text-ink" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>{c.example}</span>
                  <span className="text-muted">({c.meaning})</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/numbers/practice/native"
            className="btn-press-orange w-full text-center py-4 rounded-2xl bg-orange text-white font-quicksand font-bold text-[18px]"
          >
            Practice Native Korean →
          </Link>
        </div>
      )}
    </div>
  );
}
