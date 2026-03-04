// ─── COMPREHENSION QUESTIONS ───────────────────────────────────
// Each question belongs to a passage via passage_id.
// Users answer these after reading — results are saved to their profile.
//
// Fields:
//   id                  → unique key, e.g. 'q_cafe_1'
//   passage_id          → must match an id in passages.js
//   question            → question text in Korean
//   question_translated → question text in English
//   options             → array of 4 Korean answer choices
//   options_translated  → array of 4 English answer choices (same order)
//   answer_index        → index (0–3) of the correct answer
//   sort_order          → display order within the passage quiz
//
// NOTE: Keep exactly 4 options per question to match the 2x2 grid layout.
//       Always add at least 2 questions per passage.

const questions = [
  // ── At the Café (passage_cafe) ─────────────────────────────
  {
    id: 'q_cafe_1',
    passage_id: 'passage_cafe',
    question: '매일 아침 어디에 가요?',
    question_translated: 'Where do they go every morning?',
    options: ['도서관', '카페', '학교', '공원'],
    options_translated: ['Library', 'Café', 'School', 'Park'],
    answer_index: 1,
    sort_order: 1,
  },
  {
    id: 'q_cafe_2',
    passage_id: 'passage_cafe',
    question: '무엇을 주문했어요?',
    question_translated: 'What did they order?',
    options: ['따뜻한 커피', '녹차', '아이스 아메리카노', '주스'],
    options_translated: ['Hot coffee', 'Green tea', 'Iced Americano', 'Juice'],
    answer_index: 2,
    sort_order: 2,
  },

  // ── My Family (passage_family) ─────────────────────────────
  {
    id: 'q_family_1',
    passage_id: 'passage_family',
    question: '가족은 몇 명이에요?',
    question_translated: 'How many family members?',
    options: ['세 명', '네 명', '다섯 명', '여섯 명'],
    options_translated: ['Three', 'Four', 'Five', 'Six'],
    answer_index: 2,
    sort_order: 1,
  },
  {
    id: 'q_family_2',
    passage_id: 'passage_family',
    question: '아버지 직업은 뭐예요?',
    question_translated: "What is the father's job?",
    options: ['의사', '선생님', '요리사', '학생'],
    options_translated: ['Doctor', 'Teacher', 'Chef', 'Student'],
    answer_index: 1,
    sort_order: 2,
  },

  // ── Korean BBQ (passage_bbq) ───────────────────────────────
  {
    id: 'q_bbq_1',
    passage_id: 'passage_bbq',
    question: '누구와 갔어요?',
    question_translated: 'Who did they go with?',
    options: ['혼자', '친구들', '가족', '선생님'],
    options_translated: ['Alone', 'Friends', 'Family', 'Teacher'],
    answer_index: 1,
    sort_order: 1,
  },
  {
    id: 'q_bbq_2',
    passage_id: 'passage_bbq',
    question: '무엇을 주문했어요?',
    question_translated: 'What did they order?',
    options: ['불고기', '삼겹살', '비빔밥', '김치찌개'],
    options_translated: ['Bulgogi', 'Samgyeopsal', 'Bibimbap', 'Kimchi stew'],
    answer_index: 1,
    sort_order: 2,
  },

  // ── K-Pop Concert (passage_concert) ───────────────────────
  {
    id: 'q_concert_1',
    passage_id: 'passage_concert',
    question: '콘서트에 언제 갔어요?',
    question_translated: 'When did they go?',
    options: ['오늘', '어제', '내일', '지난주'],
    options_translated: ['Today', 'Yesterday', 'Tomorrow', 'Last week'],
    answer_index: 1,
    sort_order: 1,
  },
  {
    id: 'q_concert_2',
    passage_id: 'passage_concert',
    question: '가수가 무엇을 잘했어요?',
    question_translated: 'What did the singer do well?',
    options: ['춤', '노래', '연기', '요리'],
    options_translated: ['Dancing', 'Singing', 'Acting', 'Cooking'],
    answer_index: 1,
    sort_order: 2,
  },
];

module.exports = { questions };
