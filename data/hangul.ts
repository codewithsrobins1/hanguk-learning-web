import { HangulCharacter } from '@/types';

export const hangulVowels: HangulCharacter[] = [
  { char: 'ㅏ', romanization: 'a', sound: "Like 'ah'", example: { word: '아빠', romanization: 'appa', meaning: 'dad' } },
  { char: 'ㅐ', romanization: 'ae', sound: "Like 'eh'", example: { word: '애기', romanization: 'aegi', meaning: 'baby' } },
  { char: 'ㅑ', romanization: 'ya', sound: "Like 'yah'", example: { word: '야구', romanization: 'yagu', meaning: 'baseball' } },
  { char: 'ㅒ', romanization: 'yae', sound: "Like 'yeh'", example: { word: '얘기', romanization: 'yaegi', meaning: 'talk, story' } },
  { char: 'ㅓ', romanization: 'eo', sound: "Like 'uh'", example: { word: '어머니', romanization: 'eomeoni', meaning: 'mother' } },
  { char: 'ㅔ', romanization: 'e', sound: "Like 'eh'", example: { word: '에어컨', romanization: 'eeokeon', meaning: 'air conditioner' } },
  { char: 'ㅕ', romanization: 'yeo', sound: "Like 'yuh'", example: { word: '여자', romanization: 'yeoja', meaning: 'woman' } },
  { char: 'ㅖ', romanization: 'ye', sound: "Like 'yeh'", example: { word: '예의', romanization: 'yeui', meaning: 'manners' } },
  { char: 'ㅗ', romanization: 'o', sound: "Like 'oh'", example: { word: '오빠', romanization: 'oppa', meaning: "older brother (said by a woman)" } },
  { char: 'ㅛ', romanization: 'yo', sound: "Like 'yoh'", example: { word: '요리', romanization: 'yori', meaning: 'cooking' } },
  { char: 'ㅜ', romanization: 'u', sound: "Like 'oo'", example: { word: '우유', romanization: 'uyu', meaning: 'milk' } },
  { char: 'ㅠ', romanization: 'yu', sound: "Like 'you'", example: { word: '유치원', romanization: 'yuchiwon', meaning: 'kindergarten' } },
  { char: 'ㅡ', romanization: 'eu', sound: "Like 'ugh'", example: { word: '음악', romanization: 'eumak', meaning: 'music' } },
  { char: 'ㅣ', romanization: 'i', sound: "Like 'ee'", example: { word: '이름', romanization: 'ireum', meaning: 'name' } },
  { char: 'ㅘ', romanization: 'wa', sound: "Like 'wah'", example: { word: '과자', romanization: 'gwaja', meaning: 'snack' } },
  { char: 'ㅙ', romanization: 'wae', sound: "Like 'weh'", example: { word: '왜', romanization: 'wae', meaning: 'why' } },
  { char: 'ㅚ', romanization: 'oe', sound: "Like 'weh'", example: { word: '회사', romanization: 'hoesa', meaning: 'company' } },
  { char: 'ㅝ', romanization: 'wo', sound: "Like 'wuh'", example: { word: '뭐', romanization: 'mwo', meaning: 'what' } },
  { char: 'ㅞ', romanization: 'we', sound: "Like 'weh'", example: { word: '웨딩', romanization: 'weding', meaning: 'wedding' } },
  { char: 'ㅟ', romanization: 'wi', sound: "Like 'wee'", example: { word: '위', romanization: 'wi', meaning: 'above, stomach' } },
  { char: 'ㅢ', romanization: 'ui', sound: "Like 'ee'", example: { word: '의사', romanization: 'uisa', meaning: 'doctor' } },
];

export const hangulConsonants: HangulCharacter[] = [
  { char: 'ㄱ', romanization: 'g/k', sound: "Like 'g' in go", example: { word: '가족', romanization: 'gajok', meaning: 'family' } },
  { char: 'ㄴ', romanization: 'n', sound: "Like 'n' in no", example: { word: '나무', romanization: 'namu', meaning: 'tree' } },
  { char: 'ㄷ', romanization: 'd/t', sound: "Like 'd' in do", example: { word: '다리', romanization: 'dari', meaning: 'leg, bridge' } },
  { char: 'ㄹ', romanization: 'r/l', sound: 'Between r and l', example: { word: '라면', romanization: 'ramyeon', meaning: 'ramen' } },
  { char: 'ㅁ', romanization: 'm', sound: "Like 'm' in me", example: { word: '마음', romanization: 'maeum', meaning: 'heart, mind' } },
  { char: 'ㅂ', romanization: 'b/p', sound: "Like 'b' in boy", example: { word: '바다', romanization: 'bada', meaning: 'sea' } },
  { char: 'ㅅ', romanization: 's', sound: "Like 's' in so", example: { word: '사람', romanization: 'saram', meaning: 'person' } },
  { char: 'ㅇ', romanization: 'ng/—', sound: 'Silent at start', example: { word: '아이', romanization: 'ai', meaning: 'child' } },
  { char: 'ㅈ', romanization: 'j', sound: "Like 'j' in joy", example: { word: '자동차', romanization: 'jadongcha', meaning: 'car' } },
  { char: 'ㅊ', romanization: 'ch', sound: "Like 'ch' in chin", example: { word: '친구', romanization: 'chingu', meaning: 'friend' } },
  { char: 'ㅋ', romanization: 'k', sound: "Like 'k' in kit", example: { word: '커피', romanization: 'keopi', meaning: 'coffee' } },
  { char: 'ㅌ', romanization: 't', sound: "Like 't' in top", example: { word: '토끼', romanization: 'tokki', meaning: 'rabbit' } },
  { char: 'ㅍ', romanization: 'p', sound: "Like 'p' in pop", example: { word: '파티', romanization: 'pati', meaning: 'party' } },
  { char: 'ㅎ', romanization: 'h', sound: "Like 'h' in hat", example: { word: '학교', romanization: 'hakgyo', meaning: 'school' } },
  { char: 'ㄲ', romanization: 'kk', sound: "Tense 'k' sound", example: { word: '까치', romanization: 'kkachi', meaning: 'magpie' } },
  { char: 'ㄸ', romanization: 'tt', sound: "Tense 't' sound", example: { word: '딸기', romanization: 'ttalgi', meaning: 'strawberry' } },
  { char: 'ㅃ', romanization: 'pp', sound: "Tense 'p' sound", example: { word: '빵', romanization: 'ppang', meaning: 'bread' } },
  { char: 'ㅆ', romanization: 'ss', sound: "Tense 's' sound", example: { word: '쌀', romanization: 'ssal', meaning: 'rice' } },
  { char: 'ㅉ', romanization: 'jj', sound: "Tense 'j' sound", example: { word: '짜장면', romanization: 'jjajangmyeon', meaning: 'black bean noodles' } },
];

export const allHangul = [...hangulVowels, ...hangulConsonants];
