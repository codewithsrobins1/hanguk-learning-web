// ─── DIALOGUES ─────────────────────────────────────────────────
// Each dialogue is a short back-and-forth conversation for shadowing practice.
//
// Fields:
//   id         → unique key, e.g. 'dialogue_greetings_1'
//   title      → English title
//   title_ko   → Korean title
//   category   → filter group ('Greetings', 'Ordering Food', 'Directions', etc.)
//   difficulty → 'Beginner' | 'Intermediate' | 'Advanced'
//   sort_order → display order
//   lines      → array of { speaker: 'A' | 'B', korean, translation }
//
// NOTE: Keep exactly 2 speakers (A and B). Add at least 4 lines per dialogue.

const dialogues = [
  {
    id: 'dialogue_greetings_1',
    title: 'Nice to Meet You',
    title_ko: '처음 뵙겠습니다',
    category: 'Greetings',
    difficulty: 'Beginner',
    sort_order: 1,
    lines: [
      { speaker: 'A', korean: '안녕하세요, 처음 뵙겠습니다. 저는 민준이에요.', translation: 'Hello, nice to meet you. My name is Minjun.' },
      { speaker: 'B', korean: '안녕하세요! 저는 지우예요. 반갑습니다.', translation: 'Hello! I\'m Jiwoo. Nice to meet you.' },
      { speaker: 'A', korean: '어디서 오셨어요?', translation: 'Where are you from?' },
      { speaker: 'B', korean: '미국에서 왔어요. 민준 씨는요?', translation: 'I\'m from the United States. What about you, Minjun?' },
      { speaker: 'A', korean: '저는 한국 사람이에요. 서울 출신이에요.', translation: 'I\'m Korean. I\'m from Seoul.' },
      { speaker: 'B', korean: '와, 정말요? 한국 좋아해요!', translation: 'Wow, really? I love Korea!' },
    ],
  },
  {
    id: 'dialogue_greetings_2',
    title: 'How Are You?',
    title_ko: '잘 지냈어요?',
    category: 'Greetings',
    difficulty: 'Beginner',
    sort_order: 2,
    lines: [
      { speaker: 'A', korean: '오랜만이에요! 잘 지냈어요?', translation: 'Long time no see! How have you been?' },
      { speaker: 'B', korean: '네, 잘 지냈어요. 민준 씨는요?', translation: 'Yes, I\'ve been well. What about you, Minjun?' },
      { speaker: 'A', korean: '저도 잘 지냈어요. 요즘 바빠요?', translation: 'I\'ve been well too. Are you busy these days?' },
      { speaker: 'B', korean: '좀 바빠요. 일이 많아요.', translation: 'A little busy. There\'s a lot of work.' },
      { speaker: 'A', korean: '힘내세요! 같이 커피 마실까요?', translation: 'Hang in there! Shall we grab coffee together?' },
      { speaker: 'B', korean: '좋아요! 언제가 좋아요?', translation: 'Sure! When works for you?' },
    ],
  },
  {
    id: 'dialogue_food_1',
    title: 'At a Korean Restaurant',
    title_ko: '한식당에서',
    category: 'Ordering Food',
    difficulty: 'Beginner',
    sort_order: 3,
    lines: [
      { speaker: 'A', korean: '어서오세요! 몇 분이세요?', translation: 'Welcome! How many people?' },
      { speaker: 'B', korean: '두 명이에요.', translation: 'There are two of us.' },
      { speaker: 'A', korean: '여기 메뉴판이에요. 뭐 드시겠어요?', translation: 'Here\'s the menu. What would you like?' },
      { speaker: 'B', korean: '비빔밥 하나하고 된장찌개 하나 주세요.', translation: 'One bibimbap and one doenjang jjigae, please.' },
      { speaker: 'A', korean: '네, 잠깐만요!', translation: 'Sure, one moment please!' },
    ],
  },
  {
    id: 'dialogue_food_2',
    title: 'Ordering Coffee',
    title_ko: '커피 주문하기',
    category: 'Ordering Food',
    difficulty: 'Beginner',
    sort_order: 4,
    lines: [
      { speaker: 'A', korean: '안녕하세요! 주문하시겠어요?', translation: 'Hello! Are you ready to order?' },
      { speaker: 'B', korean: '아이스 아메리카노 한 잔 주세요.', translation: 'One iced Americano, please.' },
      { speaker: 'A', korean: '사이즈는요? 라지로 드릴까요?', translation: 'What size? Would you like a large?' },
      { speaker: 'B', korean: '미디엄으로 주세요. 얼마예요?', translation: 'Medium, please. How much is it?' },
      { speaker: 'A', korean: '사천오백 원이에요.', translation: 'It\'s 4,500 won.' },
      { speaker: 'B', korean: '여기 있어요. 감사합니다!', translation: 'Here you go. Thank you!' },
    ],
  },
  {
    id: 'dialogue_directions_1',
    title: 'Getting to the Subway',
    title_ko: '지하철 가는 길',
    category: 'Directions',
    difficulty: 'Intermediate',
    sort_order: 5,
    lines: [
      { speaker: 'A', korean: '저기요, 지하철역이 어디에 있어요?', translation: 'Excuse me, where is the subway station?' },
      { speaker: 'B', korean: '어느 역을 찾으세요?', translation: 'Which station are you looking for?' },
      { speaker: 'A', korean: '홍대입구역이요.', translation: 'Hongdae Station.' },
      { speaker: 'B', korean: '이 길로 쭉 가다가 오른쪽으로 꺾으세요.', translation: 'Go straight down this road and turn right.' },
      { speaker: 'A', korean: '얼마나 걸려요?', translation: 'How long does it take?' },
      { speaker: 'B', korean: '걸어서 오 분쯤 걸려요.', translation: 'It\'s about a 5 minute walk.' },
    ],
  },
  {
    id: 'dialogue_shopping_1',
    title: 'Buying Clothes',
    title_ko: '옷 사기',
    category: 'Shopping',
    difficulty: 'Intermediate',
    sort_order: 6,
    lines: [
      { speaker: 'A', korean: '이 옷 입어봐도 돼요?', translation: 'Can I try this on?' },
      { speaker: 'B', korean: '네, 물론이죠! 탈의실은 저쪽이에요.', translation: 'Yes, of course! The fitting room is over there.' },
      { speaker: 'A', korean: '이거 좀 더 큰 사이즈 있어요?', translation: 'Do you have this in a bigger size?' },
      { speaker: 'B', korean: '잠깐만요, 확인해 볼게요.', translation: 'One moment, let me check.' },
      { speaker: 'A', korean: '감사합니다!', translation: 'Thank you!' },
    ],
  },
  {
    id: 'dialogue_work_1',
    title: 'Morning at the Office',
    title_ko: '사무실 아침',
    category: 'At Work',
    difficulty: 'Advanced',
    sort_order: 7,
    lines: [
      { speaker: 'A', korean: '좋은 아침이에요! 회의 준비됐어요?', translation: 'Good morning! Are you ready for the meeting?' },
      { speaker: 'B', korean: '네, 자료 다 준비했어요.', translation: 'Yes, I\'ve prepared all the materials.' },
      { speaker: 'A', korean: '보고서는요? 부장님이 아까 물어봤어요.', translation: 'What about the report? The manager asked earlier.' },
      { speaker: 'B', korean: '이메일로 방금 보냈어요!', translation: 'I just sent it by email!' },
    ],
  },
];

module.exports = { dialogues };
