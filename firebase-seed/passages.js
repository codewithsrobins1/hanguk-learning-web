// ─── READING PASSAGES ──────────────────────────────────────────
// Each passage has a set of Korean lines with English translations.
// Users can tap each line to highlight it and toggle translations on/off.
//
// Fields:
//   id         → unique key, e.g. 'passage_market'
//   title      → Korean title shown at the top
//   title_en   → English subtitle
//   category   → filter pill value ('Daily Life', 'Food', 'Music', 'Travel', etc.)
//   read_time  → display string, e.g. '3 min read'
//   sort_order → controls display order in the list
//   lines      → array of { korean, translation } objects
//
// NOTE: Each passage should have matching questions in questions.js.
//       Use the same passage id as the passage_id in each question.

const passages = [
  {
    id: 'passage_cafe',
    title: '카페에서',
    title_en: 'At the Café',
    category: 'Daily Life',
    read_time: '3 min read',
    sort_order: 1,
    lines: [
      {
        korean: '저는 매일 아침 카페에 가요.',
        translation: 'I go to the café every morning.',
      },
      {
        korean: '아이스 아메리카노 한 잔 주세요.',
        translation: 'One iced Americano, please.',
      },
      {
        korean: '카페가 정말 예뻐요.',
        translation: 'The café is really pretty.',
      },
      {
        korean: '친구를 기다려요.',
        translation: 'I am waiting for a friend.',
      },
    ],
  },
  {
    id: 'passage_family',
    title: '우리 가족',
    title_en: 'My Family',
    category: 'Daily Life',
    read_time: '4 min read',
    sort_order: 2,
    lines: [
      {
        korean: '우리 가족은 다섯 명이에요.',
        translation: 'Our family has five members.',
      },
      {
        korean: '아버지는 선생님이에요.',
        translation: 'My father is a teacher.',
      },
      {
        korean: '어머니는 요리를 잘해요.',
        translation: 'My mother cooks well.',
      },
      {
        korean: '동생은 대학생이에요.',
        translation: 'My younger sibling is a university student.',
      },
      {
        korean: '저는 한국어를 공부해요.',
        translation: 'I study Korean.',
      },
    ],
  },
  {
    id: 'passage_bbq',
    title: '한국 고기집',
    title_en: 'Korean BBQ',
    category: 'Food',
    read_time: '3 min read',
    sort_order: 3,
    lines: [
      {
        korean: '오늘 친구들과 고기집에 갔어요.',
        translation: 'Today I went to a BBQ restaurant with friends.',
      },
      {
        korean: '삼겹살을 세 인분 주문했어요.',
        translation: 'We ordered three servings of samgyeopsal.',
      },
      {
        korean: '상추에 고기를 싸 먹었어요.',
        translation: 'We wrapped the meat in lettuce and ate it.',
      },
      {
        korean: '정말 맛있었어요!',
        translation: 'It was really delicious!',
      },
    ],
  },
  {
    id: 'passage_concert',
    title: '콘서트',
    title_en: 'K-Pop Concert',
    category: 'Music',
    read_time: '3 min read',
    sort_order: 4,
    lines: [
      {
        korean: '어제 콘서트에 갔어요.',
        translation: 'I went to a concert yesterday.',
      },
      {
        korean: '가수가 노래를 정말 잘했어요.',
        translation: 'The singer sang really well.',
      },
      {
        korean: '팬들이 많이 왔어요.',
        translation: 'Many fans came.',
      },
      {
        korean: '다음 콘서트도 가고 싶어요.',
        translation: 'I want to go to the next concert too.',
      },
    ],
  },
];

module.exports = { passages };
