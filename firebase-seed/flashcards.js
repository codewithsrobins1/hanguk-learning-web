// ─── FLASHCARDS ────────────────────────────────────────────────
// Each card belongs to a set via set_id.
// sentence_parts is an array of strings that form the full sentence.
// The element at key_index is highlighted in red in the app (the focus word).
//
// Example structure:
//   sentence_parts: ['저는 매일 ', '공부해요', '.']
//   key_index: 1   ← '공부해요' gets highlighted
//
// To add cards to an existing set, just append to the array.
// To add cards for a NEW set, make sure the set exists in flashcard-sets.js first.

const flashcards = [
  // ── Verbs (set_verbs) ──────────────────────────────────────
  {
    id: 'card_v1',
    set_id: 'set_verbs',
    sentence_parts: ['저는 매일 ', '공부해요', '.'],
    key_index: 1,
    translation: 'I study every day.',
    sort_order: 1,
  },
  {
    id: 'card_v2',
    set_id: 'set_verbs',
    sentence_parts: ['오늘 친구를 ', '만났어요', '.'],
    key_index: 1,
    translation: 'I met a friend today.',
    sort_order: 2,
  },
  {
    id: 'card_v3',
    set_id: 'set_verbs',
    sentence_parts: ['저는 한국어를 ', '배우고', ' 싶어요.'],
    key_index: 1,
    translation: 'I want to learn Korean.',
    sort_order: 3,
  },
  {
    id: 'card_v4',
    set_id: 'set_verbs',
    sentence_parts: ['내일 ', '갈게요', '.'],
    key_index: 1,
    translation: "I'll go tomorrow.",
    sort_order: 4,
  },
  {
    id: 'card_v5',
    set_id: 'set_verbs',
    sentence_parts: ['밥을 ', '먹었어요', '.'],
    key_index: 1,
    translation: 'I ate rice / a meal.',
    sort_order: 5,
  },
  {
    id: 'card_v6',
    set_id: 'set_verbs',
    sentence_parts: ['음악을 ', '들어요', '.'],
    key_index: 1,
    translation: 'I listen to music.',
    sort_order: 6,
  },
  {
    id: 'card_v7',
    set_id: 'set_verbs',
    sentence_parts: ['한국 드라마를 ', '봐요', '.'],
    key_index: 1,
    translation: 'I watch Korean dramas.',
    sort_order: 7,
  },
  {
    id: 'card_v8',
    set_id: 'set_verbs',
    sentence_parts: ['커피를 ', '마셔요', '.'],
    key_index: 1,
    translation: 'I drink coffee.',
    sort_order: 8,
  },

  // ── Nouns (set_nouns) ──────────────────────────────────────
  {
    id: 'card_n1',
    set_id: 'set_nouns',
    sentence_parts: ['이것은 ', '사과', '예요.'],
    key_index: 1,
    translation: 'This is an apple.',
    sort_order: 1,
  },
  {
    id: 'card_n2',
    set_id: 'set_nouns',
    sentence_parts: ['저는 ', '학생', '이에요.'],
    key_index: 1,
    translation: 'I am a student.',
    sort_order: 2,
  },
  {
    id: 'card_n3',
    set_id: 'set_nouns',
    sentence_parts: ['그 ', '가게', '는 커요.'],
    key_index: 1,
    translation: 'That store is big.',
    sort_order: 3,
  },
  {
    id: 'card_n4',
    set_id: 'set_nouns',
    sentence_parts: ['우리 ', '가족', '은 다섯 명이에요.'],
    key_index: 1,
    translation: 'Our family has five members.',
    sort_order: 4,
  },
  {
    id: 'card_n5',
    set_id: 'set_nouns',
    sentence_parts: ['오늘 ', '날씨', '가 좋아요.'],
    key_index: 1,
    translation: "Today's weather is nice.",
    sort_order: 5,
  },

  // ── Food & Drink (set_food) ────────────────────────────────
  {
    id: 'card_f1',
    set_id: 'set_food',
    sentence_parts: ['', '김치', '가 매워요.'],
    key_index: 1,
    translation: 'Kimchi is spicy.',
    sort_order: 1,
  },
  {
    id: 'card_f2',
    set_id: 'set_food',
    sentence_parts: ['', '비빔밥', ' 주세요.'],
    key_index: 1,
    translation: 'Bibimbap, please.',
    sort_order: 2,
  },
  {
    id: 'card_f3',
    set_id: 'set_food',
    sentence_parts: ['아이스 ', '아메리카노', ' 한 잔 주세요.'],
    key_index: 1,
    translation: 'One iced Americano, please.',
    sort_order: 3,
  },
  {
    id: 'card_f4',
    set_id: 'set_food',
    sentence_parts: ['이 ', '떡볶이', ' 정말 맛있어요!'],
    key_index: 1,
    translation: 'This tteokbokki is really delicious!',
    sort_order: 4,
  },
  {
    id: 'card_f5',
    set_id: 'set_food',
    sentence_parts: ['', '물', ' 주세요.'],
    key_index: 1,
    translation: 'Water, please.',
    sort_order: 5,
  },

  // ── K-Pop & Music (set_kpop) ───────────────────────────────
  {
    id: 'card_k1',
    set_id: 'set_kpop',
    sentence_parts: ['이 ', '노래', ' 좋아해요.'],
    key_index: 1,
    translation: 'I like this song.',
    sort_order: 1,
  },
  {
    id: 'card_k2',
    set_id: 'set_kpop',
    sentence_parts: ['', '콘서트', '에 가고 싶어요.'],
    key_index: 1,
    translation: 'I want to go to a concert.',
    sort_order: 2,
  },
  {
    id: 'card_k3',
    set_id: 'set_kpop',
    sentence_parts: ['', '가수', '가 춤을 잘 춰요.'],
    key_index: 1,
    translation: 'The singer dances well.',
    sort_order: 3,
  },
  {
    id: 'card_k4',
    set_id: 'set_kpop',
    sentence_parts: ['새 ', '앨범', '이 나왔어요.'],
    key_index: 1,
    translation: 'A new album came out.',
    sort_order: 4,
  },

  // ── Travel (set_travel) ────────────────────────────────────
  {
    id: 'card_t1',
    set_id: 'set_travel',
    sentence_parts: ['', '공항', '이 어디예요?'],
    key_index: 1,
    translation: 'Where is the airport?',
    sort_order: 1,
  },
  {
    id: 'card_t2',
    set_id: 'set_travel',
    sentence_parts: ['', '호텔', '까지 얼마예요?'],
    key_index: 1,
    translation: 'How much to the hotel?',
    sort_order: 2,
  },
  {
    id: 'card_t3',
    set_id: 'set_travel',
    sentence_parts: ['', '지하철', ' 역이 어디예요?'],
    key_index: 1,
    translation: 'Where is the subway station?',
    sort_order: 3,
  },
  {
    id: 'card_t4',
    set_id: 'set_travel',
    sentence_parts: ['', '여권', ' 보여주세요.'],
    key_index: 1,
    translation: 'Please show your passport.',
    sort_order: 4,
  },
];

module.exports = { flashcards };
