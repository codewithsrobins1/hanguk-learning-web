import { HangulCharacter } from '@/types';

export const hangulVowels: HangulCharacter[] = [
  { char: 'ㅏ', romanization: 'a', sound: "Like 'ah'" },
  { char: 'ㅐ', romanization: 'ae', sound: "Like 'eh'" },
  { char: 'ㅑ', romanization: 'ya', sound: "Like 'yah'" },
  { char: 'ㅒ', romanization: 'yae', sound: "Like 'yeh'" },
  { char: 'ㅓ', romanization: 'eo', sound: "Like 'uh'" },
  { char: 'ㅔ', romanization: 'e', sound: "Like 'eh'" },
  { char: 'ㅕ', romanization: 'yeo', sound: "Like 'yuh'" },
  { char: 'ㅖ', romanization: 'ye', sound: "Like 'yeh'" },
  { char: 'ㅗ', romanization: 'o', sound: "Like 'oh'" },
  { char: 'ㅛ', romanization: 'yo', sound: "Like 'yoh'" },
  { char: 'ㅜ', romanization: 'u', sound: "Like 'oo'" },
  { char: 'ㅠ', romanization: 'yu', sound: "Like 'you'" },
  { char: 'ㅡ', romanization: 'eu', sound: "Like 'ugh'" },
  { char: 'ㅣ', romanization: 'i', sound: "Like 'ee'" },
  { char: 'ㅘ', romanization: 'wa', sound: "Like 'wah'" },
  { char: 'ㅙ', romanization: 'wae', sound: "Like 'weh'" },
  { char: 'ㅚ', romanization: 'oe', sound: "Like 'weh'" },
  { char: 'ㅝ', romanization: 'wo', sound: "Like 'wuh'" },
  { char: 'ㅞ', romanization: 'we', sound: "Like 'weh'" },
  { char: 'ㅟ', romanization: 'wi', sound: "Like 'wee'" },
  { char: 'ㅢ', romanization: 'ui', sound: "Like 'ee'" },
];

export const hangulConsonants: HangulCharacter[] = [
  { char: 'ㄱ', romanization: 'g/k', sound: "Like 'g' in go" },
  { char: 'ㄴ', romanization: 'n', sound: "Like 'n' in no" },
  { char: 'ㄷ', romanization: 'd/t', sound: "Like 'd' in do" },
  { char: 'ㄹ', romanization: 'r/l', sound: 'Between r and l' },
  { char: 'ㅁ', romanization: 'm', sound: "Like 'm' in me" },
  { char: 'ㅂ', romanization: 'b/p', sound: "Like 'b' in boy" },
  { char: 'ㅅ', romanization: 's', sound: "Like 's' in so" },
  { char: 'ㅇ', romanization: 'ng/—', sound: 'Silent at start' },
  { char: 'ㅈ', romanization: 'j', sound: "Like 'j' in joy" },
  { char: 'ㅊ', romanization: 'ch', sound: "Like 'ch' in chin" },
  { char: 'ㅋ', romanization: 'k', sound: "Like 'k' in kit" },
  { char: 'ㅌ', romanization: 't', sound: "Like 't' in top" },
  { char: 'ㅍ', romanization: 'p', sound: "Like 'p' in pop" },
  { char: 'ㅎ', romanization: 'h', sound: "Like 'h' in hat" },
  { char: 'ㄲ', romanization: 'kk', sound: "Tense 'k' sound" },
  { char: 'ㄸ', romanization: 'tt', sound: "Tense 't' sound" },
  { char: 'ㅃ', romanization: 'pp', sound: "Tense 'p' sound" },
  { char: 'ㅆ', romanization: 'ss', sound: "Tense 's' sound" },
  { char: 'ㅉ', romanization: 'jj', sound: "Tense 'j' sound" },
];

export const allHangul = [...hangulVowels, ...hangulConsonants];
