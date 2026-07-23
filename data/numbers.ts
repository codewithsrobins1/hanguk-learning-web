// Korean has two parallel number systems. Sino-Korean (한자어) is used for
// dates, money, phone numbers, minutes, and counting past 99. Native
// Korean (고유어) is used for counting objects/people, telling someone's
// age, and the hour on a clock — and only goes up to 99, since there's no
// native word for 100.
//
// Both numeral functions below are pure/rule-based rather than hand-typed
// word lists, so every value (including quiz distractors) is guaranteed
// grammatically correct — no risk of the kind of typo a "Report issue"
// would need to catch.

const SINO_DIGITS = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];

// Valid for 0–10,000. The leading "1" is dropped before 십/백/천 (100 is
// 백, not 일백), but 10,000 itself is the fixed word 만.
export function sinoNumeral(n: number): string {
  if (n === 0) return '영';
  if (n === 10000) return '만';
  let result = '';
  const thousands = Math.floor(n / 1000);
  const hundreds = Math.floor((n % 1000) / 100);
  const tens = Math.floor((n % 100) / 10);
  const ones = n % 10;
  if (thousands > 0) result += (thousands === 1 ? '' : SINO_DIGITS[thousands]) + '천';
  if (hundreds > 0) result += (hundreds === 1 ? '' : SINO_DIGITS[hundreds]) + '백';
  if (tens > 0) result += (tens === 1 ? '' : SINO_DIGITS[tens]) + '십';
  if (ones > 0) result += SINO_DIGITS[ones];
  return result;
}

const NATIVE_ONES = ['', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉'];
const NATIVE_TENS: Record<number, string> = {
  10: '열', 20: '스물', 30: '서른', 40: '마흔', 50: '쉰', 60: '예순', 70: '일흔', 80: '여든', 90: '아흔',
};

// Valid for 1–99 only — native Korean has no word for 100+.
export function nativeNumeral(n: number): string {
  if (n <= 0 || n > 99) return '';
  if (n <= 10) return n === 10 ? '열' : NATIVE_ONES[n];
  const tensBase = Math.floor(n / 10) * 10;
  const ones = n % 10;
  const tensWord = NATIVE_TENS[tensBase];
  return ones === 0 ? tensWord : tensWord + NATIVE_ONES[ones];
}

// Five native numbers contract to a shorter form when they sit directly
// before a counting word (개, 명, 살, 시...) — a common early gotcha.
export const NATIVE_COUNTER_FORMS: { full: string; contracted: string; example: string; meaning: string }[] = [
  { full: '하나', contracted: '한', example: '한 개', meaning: 'one item' },
  { full: '둘', contracted: '두', example: '두 명', meaning: 'two people' },
  { full: '셋', contracted: '세', example: '세 살', meaning: 'three years old' },
  { full: '넷', contracted: '네', example: '네 시', meaning: 'four o’clock' },
  { full: '스물', contracted: '스무', example: '스무 살', meaning: 'twenty years old' },
];

// ── Reference tables ────────────────────────────────────────────
export const SINO_ONES = Array.from({ length: 10 }, (_, n) => ({ n, word: sinoNumeral(n) }));
export const SINO_TEENS = Array.from({ length: 9 }, (_, i) => ({ n: 11 + i, word: sinoNumeral(11 + i) }));
export const SINO_TENS = [10, 20, 30, 40, 50, 60, 70, 80, 90].map((n) => ({ n, word: sinoNumeral(n) }));
export const SINO_HUNDREDS = [100, 200, 300, 400, 500, 600, 700, 800, 900].map((n) => ({ n, word: sinoNumeral(n) }));
export const SINO_THOUSANDS = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000].map((n) => ({ n, word: sinoNumeral(n) }));

export const NATIVE_ONES_TABLE = Array.from({ length: 10 }, (_, i) => ({ n: i + 1, word: nativeNumeral(i + 1) }));
export const NATIVE_TENS_TABLE = [10, 20, 30, 40, 50, 60, 70, 80, 90].map((n) => ({ n, word: nativeNumeral(n) }));
export const NATIVE_COMBO_EXAMPLES = [21, 35, 48, 52, 67, 79, 84, 99].map((n) => ({ n, word: nativeNumeral(n) }));

// ── Quiz pools ───────────────────────────────────────────────────
export type NumberQuizQuestion = {
  prompt: string;
  isKoreanPrompt: boolean; // true: prompt is Korean, options are digits; false: reversed
  options: string[];
  answer_index: number;
};

function q(n: number, distractorNs: number[], numeralFn: (n: number) => string, koreanPrompt: boolean): NumberQuizQuestion {
  const correct = numeralFn(n);
  return koreanPrompt
    ? { prompt: correct, isKoreanPrompt: true, options: [String(n), ...distractorNs.map(String)], answer_index: 0 }
    : { prompt: String(n), isKoreanPrompt: false, options: [correct, ...distractorNs.map(numeralFn)], answer_index: 0 };
}

export const SINO_QUIZ: NumberQuizQuestion[] = [
  q(3, [2, 4, 5], sinoNumeral, false),
  q(9, [8, 7, 6], sinoNumeral, true),
  q(15, [14, 16, 5], sinoNumeral, true),
  q(20, [12, 30, 200], sinoNumeral, false),
  q(47, [46, 57, 74], sinoNumeral, false),
  q(58, [68, 48, 85], sinoNumeral, true),
  q(100, [10, 1000, 10000], sinoNumeral, false),
  q(234, [233, 324, 243], sinoNumeral, false),
  q(500, [50, 5000, 105], sinoNumeral, true),
  q(678, [677, 768, 687], sinoNumeral, false),
  q(1000, [900, 10000, 1100], sinoNumeral, false),
  q(2345, [2335, 3345, 2445], sinoNumeral, false),
  q(10000, [1000, 100, 9000], sinoNumeral, false),
];

export const NATIVE_QUIZ: NumberQuizQuestion[] = [
  q(4, [3, 5, 6], nativeNumeral, false),
  q(9, [8, 7, 6], nativeNumeral, true),
  q(10, [9, 20, 11], nativeNumeral, false),
  q(13, [14, 12, 23], nativeNumeral, false),
  q(17, [16, 18, 27], nativeNumeral, true),
  {
    // Cross-system distractor: tests whether the Sino form ("이십") gets
    // mistaken for the native one — a genuinely common learner mix-up.
    prompt: '20',
    isKoreanPrompt: false,
    options: [nativeNumeral(20), nativeNumeral(30), nativeNumeral(12), sinoNumeral(20)],
    answer_index: 0,
  },
  q(23, [22, 33, 24], nativeNumeral, false),
  q(30, [20, 13, 3], nativeNumeral, true),
  q(45, [44, 55, 46], nativeNumeral, false),
  q(52, [51, 62, 25], nativeNumeral, true),
  q(68, [67, 78, 69], nativeNumeral, false),
  q(99, [98, 89, 90], nativeNumeral, false),
];
