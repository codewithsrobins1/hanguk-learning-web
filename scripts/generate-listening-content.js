require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const EXERCISES = [
  // Daily Life - Beginner
  {
    id: 'listen_daily_life_1',
    title: 'Talking about the weather',
    title_ko: '날씨 이야기',
    category: 'Daily Life',
    difficulty: 'Beginner',
    sort_order: 1,
  },
  {
    id: 'listen_daily_life_2',
    title: "Asking how someone's day was",
    title_ko: '오늘 하루 어땠어?',
    category: 'Daily Life',
    difficulty: 'Beginner',
    sort_order: 2,
  },
  {
    id: 'listen_daily_life_3',
    title: 'Talking about your morning routine',
    title_ko: '아침 루틴 이야기',
    category: 'Daily Life',
    difficulty: 'Beginner',
    sort_order: 3,
  },
  {
    id: 'listen_daily_life_4',
    title: 'Discussing weekend plans',
    title_ko: '주말 계획',
    category: 'Daily Life',
    difficulty: 'Beginner',
    sort_order: 4,
  },
  {
    id: 'listen_daily_life_5',
    title: 'Asking what someone is doing right now',
    title_ko: '지금 뭐 해?',
    category: 'Daily Life',
    difficulty: 'Beginner',
    sort_order: 5,
  },
  {
    id: 'listen_daily_life_6',
    title: 'Talking about being tired/busy',
    title_ko: '피곤하고 바쁜 이야기',
    category: 'Daily Life',
    difficulty: 'Beginner',
    sort_order: 6,
  },
  {
    id: 'listen_daily_life_7',
    title: 'Discussing sleep habits',
    title_ko: '수면 습관',
    category: 'Daily Life',
    difficulty: 'Beginner',
    sort_order: 7,
  },
  {
    id: 'listen_daily_life_8',
    title: 'Talking about errands and chores',
    title_ko: '심부름과 집안일',
    category: 'Daily Life',
    difficulty: 'Beginner',
    sort_order: 8,
  },
  // Food - Beginner
  {
    id: 'listen_food_1',
    title: 'Ordering at a restaurant',
    title_ko: '식당에서 주문하기',
    category: 'Food',
    difficulty: 'Beginner',
    sort_order: 1,
  },
  {
    id: 'listen_food_2',
    title: 'Talking about favorite foods',
    title_ko: '좋아하는 음식',
    category: 'Food',
    difficulty: 'Beginner',
    sort_order: 2,
  },
  {
    id: 'listen_food_3',
    title: 'Asking if food is spicy',
    title_ko: '음식이 매워요?',
    category: 'Food',
    difficulty: 'Beginner',
    sort_order: 3,
  },
  {
    id: 'listen_food_4',
    title: 'Korean BBQ conversations',
    title_ko: '한국 바베큐',
    category: 'Food',
    difficulty: 'Beginner',
    sort_order: 4,
  },
  {
    id: 'listen_food_5',
    title: 'Ordering delivery food',
    title_ko: '배달 음식 주문',
    category: 'Food',
    difficulty: 'Beginner',
    sort_order: 5,
  },
  {
    id: 'listen_food_6',
    title: 'Talking about cooking at home',
    title_ko: '집에서 요리하기',
    category: 'Food',
    difficulty: 'Beginner',
    sort_order: 6,
  },
  {
    id: 'listen_food_7',
    title: 'Asking for recommendations',
    title_ko: '추천 부탁드려요',
    category: 'Food',
    difficulty: 'Beginner',
    sort_order: 7,
  },
  {
    id: 'listen_food_8',
    title: 'Paying the bill / splitting the bill',
    title_ko: '계산하기',
    category: 'Food',
    difficulty: 'Beginner',
    sort_order: 8,
  },
  // Counting & Numbers - Beginner
  {
    id: 'listen_counting_1',
    title: 'Counting people',
    title_ko: '사람 수 세기',
    category: 'Counting & Numbers',
    difficulty: 'Beginner',
    sort_order: 1,
  },
  {
    id: 'listen_counting_2',
    title: 'Ordering items in quantities',
    title_ko: '수량으로 주문하기',
    category: 'Counting & Numbers',
    difficulty: 'Beginner',
    sort_order: 2,
  },
  {
    id: 'listen_counting_3',
    title: 'Asking for prices',
    title_ko: '가격 묻기',
    category: 'Counting & Numbers',
    difficulty: 'Beginner',
    sort_order: 3,
  },
  {
    id: 'listen_counting_4',
    title: 'Telling time',
    title_ko: '시간 말하기',
    category: 'Counting & Numbers',
    difficulty: 'Beginner',
    sort_order: 4,
  },
  {
    id: 'listen_counting_5',
    title: 'Talking about age',
    title_ko: '나이 이야기',
    category: 'Counting & Numbers',
    difficulty: 'Beginner',
    sort_order: 5,
  },
  {
    id: 'listen_counting_6',
    title: 'Phone numbers and addresses',
    title_ko: '전화번호와 주소',
    category: 'Counting & Numbers',
    difficulty: 'Beginner',
    sort_order: 6,
  },
  {
    id: 'listen_counting_7',
    title: 'Dates and birthdays',
    title_ko: '날짜와 생일',
    category: 'Counting & Numbers',
    difficulty: 'Beginner',
    sort_order: 7,
  },
  {
    id: 'listen_counting_8',
    title: 'Counting money/change in stores',
    title_ko: '돈 계산하기',
    category: 'Counting & Numbers',
    difficulty: 'Beginner',
    sort_order: 8,
  },
  // Music - Intermediate
  {
    id: 'listen_music_1',
    title: 'Talking about favorite artists',
    title_ko: '좋아하는 아티스트',
    category: 'Music',
    difficulty: 'Intermediate',
    sort_order: 1,
  },
  {
    id: 'listen_music_2',
    title: 'Discussing K-pop groups',
    title_ko: '케이팝 그룹 이야기',
    category: 'Music',
    difficulty: 'Intermediate',
    sort_order: 2,
  },
  {
    id: 'listen_music_3',
    title: 'Asking what music someone likes',
    title_ko: '어떤 음악 좋아해?',
    category: 'Music',
    difficulty: 'Intermediate',
    sort_order: 3,
  },
  {
    id: 'listen_music_4',
    title: 'Talking about concerts',
    title_ko: '콘서트 이야기',
    category: 'Music',
    difficulty: 'Intermediate',
    sort_order: 4,
  },
  {
    id: 'listen_music_5',
    title: 'Recommending songs',
    title_ko: '노래 추천',
    category: 'Music',
    difficulty: 'Intermediate',
    sort_order: 5,
  },
  {
    id: 'listen_music_6',
    title: 'Discussing instruments',
    title_ko: '악기 이야기',
    category: 'Music',
    difficulty: 'Intermediate',
    sort_order: 6,
  },
  {
    id: 'listen_music_7',
    title: 'Singing at karaoke',
    title_ko: '노래방에서',
    category: 'Music',
    difficulty: 'Intermediate',
    sort_order: 7,
  },
  {
    id: 'listen_music_8',
    title: 'Studying while listening to music',
    title_ko: '음악 들으며 공부하기',
    category: 'Music',
    difficulty: 'Intermediate',
    sort_order: 8,
  },
  // Study - Intermediate
  {
    id: 'listen_study_1',
    title: 'Talking about homework',
    title_ko: '숙제 이야기',
    category: 'Study',
    difficulty: 'Intermediate',
    sort_order: 1,
  },
  {
    id: 'listen_study_2',
    title: 'Asking for help with Korean',
    title_ko: '한국어 도움 요청',
    category: 'Study',
    difficulty: 'Intermediate',
    sort_order: 2,
  },
  {
    id: 'listen_study_3',
    title: 'Discussing test preparation',
    title_ko: '시험 준비',
    category: 'Study',
    difficulty: 'Intermediate',
    sort_order: 3,
  },
  {
    id: 'listen_study_4',
    title: 'Talking about classes and majors',
    title_ko: '수업과 전공',
    category: 'Study',
    difficulty: 'Intermediate',
    sort_order: 4,
  },
  {
    id: 'listen_study_5',
    title: 'Studying at a café',
    title_ko: '카페에서 공부하기',
    category: 'Study',
    difficulty: 'Intermediate',
    sort_order: 5,
  },
  {
    id: 'listen_study_6',
    title: 'Talking about language learning goals',
    title_ko: '언어 학습 목표',
    category: 'Study',
    difficulty: 'Intermediate',
    sort_order: 6,
  },
  {
    id: 'listen_study_7',
    title: 'Asking how to say something in Korean',
    title_ko: '한국어로 어떻게 말해요?',
    category: 'Study',
    difficulty: 'Intermediate',
    sort_order: 7,
  },
  {
    id: 'listen_study_8',
    title: 'Discussing difficult grammar/vocabulary',
    title_ko: '어려운 문법과 어휘',
    category: 'Study',
    difficulty: 'Intermediate',
    sort_order: 8,
  },
  // Gaming - Intermediate
  {
    id: 'listen_gaming_1',
    title: 'Talking about favorite games',
    title_ko: '좋아하는 게임',
    category: 'Gaming',
    difficulty: 'Intermediate',
    sort_order: 1,
  },
  {
    id: 'listen_gaming_2',
    title: 'Playing games with friends online',
    title_ko: '친구랑 온라인 게임',
    category: 'Gaming',
    difficulty: 'Intermediate',
    sort_order: 2,
  },
  {
    id: 'listen_gaming_3',
    title: 'Discussing ranks/competitive play',
    title_ko: '랭크와 경쟁',
    category: 'Gaming',
    difficulty: 'Intermediate',
    sort_order: 3,
  },
  {
    id: 'listen_gaming_4',
    title: 'Talking at a PC방',
    title_ko: 'PC방에서',
    category: 'Gaming',
    difficulty: 'Intermediate',
    sort_order: 4,
  },
  {
    id: 'listen_gaming_5',
    title: 'Explaining game mechanics',
    title_ko: '게임 메카닉 설명',
    category: 'Gaming',
    difficulty: 'Intermediate',
    sort_order: 5,
  },
  {
    id: 'listen_gaming_6',
    title: 'Discussing new game releases',
    title_ko: '새 게임 출시',
    category: 'Gaming',
    difficulty: 'Intermediate',
    sort_order: 6,
  },
  {
    id: 'listen_gaming_7',
    title: 'Trash talk / friendly banter',
    title_ko: '친한 농담',
    category: 'Gaming',
    difficulty: 'Intermediate',
    sort_order: 7,
  },
  {
    id: 'listen_gaming_8',
    title: 'Looking for teammates',
    title_ko: '팀원 구하기',
    category: 'Gaming',
    difficulty: 'Intermediate',
    sort_order: 8,
  },
  // Family - Intermediate
  {
    id: 'listen_family_1',
    title: 'Introducing family members',
    title_ko: '가족 소개',
    category: 'Family',
    difficulty: 'Intermediate',
    sort_order: 1,
  },
  {
    id: 'listen_family_2',
    title: 'Talking about siblings',
    title_ko: '형제자매 이야기',
    category: 'Family',
    difficulty: 'Intermediate',
    sort_order: 2,
  },
  {
    id: 'listen_family_3',
    title: "Discussing parents' jobs",
    title_ko: '부모님 직업',
    category: 'Family',
    difficulty: 'Intermediate',
    sort_order: 3,
  },
  {
    id: 'listen_family_4',
    title: 'Talking about childhood memories',
    title_ko: '어린 시절 추억',
    category: 'Family',
    difficulty: 'Intermediate',
    sort_order: 4,
  },
  {
    id: 'listen_family_5',
    title: 'Visiting grandparents',
    title_ko: '할머니 할아버지 방문',
    category: 'Family',
    difficulty: 'Intermediate',
    sort_order: 5,
  },
  {
    id: 'listen_family_6',
    title: 'Discussing marriage/dating',
    title_ko: '결혼과 연애',
    category: 'Family',
    difficulty: 'Intermediate',
    sort_order: 6,
  },
  {
    id: 'listen_family_7',
    title: 'Family gatherings during holidays',
    title_ko: '명절 가족 모임',
    category: 'Family',
    difficulty: 'Intermediate',
    sort_order: 7,
  },
  {
    id: 'listen_family_8',
    title: 'Talking about pets as family',
    title_ko: '반려동물 이야기',
    category: 'Family',
    difficulty: 'Intermediate',
    sort_order: 8,
  },
  // Travel - Advanced
  {
    id: 'listen_travel_1',
    title: 'Asking for directions',
    title_ko: '길 묻기',
    category: 'Travel',
    difficulty: 'Advanced',
    sort_order: 1,
  },
  {
    id: 'listen_travel_2',
    title: 'Using the subway/bus',
    title_ko: '지하철/버스 이용',
    category: 'Travel',
    difficulty: 'Advanced',
    sort_order: 2,
  },
  {
    id: 'listen_travel_3',
    title: 'Checking into a hotel',
    title_ko: '호텔 체크인',
    category: 'Travel',
    difficulty: 'Advanced',
    sort_order: 3,
  },
  {
    id: 'listen_travel_4',
    title: 'Talking to airport staff',
    title_ko: '공항 직원과 대화',
    category: 'Travel',
    difficulty: 'Advanced',
    sort_order: 4,
  },
  {
    id: 'listen_travel_5',
    title: 'Asking about tourist attractions',
    title_ko: '관광지 묻기',
    category: 'Travel',
    difficulty: 'Advanced',
    sort_order: 5,
  },
  {
    id: 'listen_travel_6',
    title: 'Renting a car or taking a taxi',
    title_ko: '렌터카와 택시',
    category: 'Travel',
    difficulty: 'Advanced',
    sort_order: 6,
  },
  {
    id: 'listen_travel_7',
    title: 'Asking where the bathroom is',
    title_ko: '화장실 어디예요?',
    category: 'Travel',
    difficulty: 'Advanced',
    sort_order: 7,
  },
  {
    id: 'listen_travel_8',
    title: 'Talking about travel experiences',
    title_ko: '여행 경험 이야기',
    category: 'Travel',
    difficulty: 'Advanced',
    sort_order: 8,
  },
  // Culture - Advanced
  {
    id: 'listen_culture_1',
    title: 'Talking about Korean holidays',
    title_ko: '한국 명절 이야기',
    category: 'Culture',
    difficulty: 'Advanced',
    sort_order: 1,
  },
  {
    id: 'listen_culture_2',
    title: 'Discussing age and honorifics',
    title_ko: '나이와 존댓말',
    category: 'Culture',
    difficulty: 'Advanced',
    sort_order: 2,
  },
  {
    id: 'listen_culture_3',
    title: 'Bowing and greetings etiquette',
    title_ko: '인사 예절',
    category: 'Culture',
    difficulty: 'Advanced',
    sort_order: 3,
  },
  {
    id: 'listen_culture_4',
    title: 'Korean drinking culture',
    title_ko: '한국 음주 문화',
    category: 'Culture',
    difficulty: 'Advanced',
    sort_order: 4,
  },
  {
    id: 'listen_culture_5',
    title: 'Talking about beauty/skincare culture',
    title_ko: '뷰티와 스킨케어',
    category: 'Culture',
    difficulty: 'Advanced',
    sort_order: 5,
  },
  {
    id: 'listen_culture_6',
    title: 'Discussing food etiquette',
    title_ko: '음식 예절',
    category: 'Culture',
    difficulty: 'Advanced',
    sort_order: 6,
  },
  {
    id: 'listen_culture_7',
    title: 'Talking about dating culture',
    title_ko: '연애 문화',
    category: 'Culture',
    difficulty: 'Advanced',
    sort_order: 7,
  },
  {
    id: 'listen_culture_8',
    title: 'Comparing cultures between countries',
    title_ko: '나라별 문화 비교',
    category: 'Culture',
    difficulty: 'Advanced',
    sort_order: 8,
  },
];

async function generateSegments(exercise) {
  const prompt = `You are a Korean language teacher creating listening exercise content.

Topic: "${exercise.title}" (${exercise.title_ko})
Category: ${exercise.category}
Difficulty: ${exercise.difficulty}

Create exactly 3 segments. Each segment has 2-3 natural conversational Korean dialogue lines followed by a comprehension question.

Return ONLY valid JSON with no markdown, no explanation:
{
  "segments": [
    {
      "segment_index": 0,
      "lines": [
        { "speaker": "A", "korean": "...", "translation": "..." },
        { "speaker": "B", "korean": "...", "translation": "..." }
      ],
      "question": "...",
      "options": ["...", "...", "..."],
      "answer_index": 0
    },
    { "segment_index": 1, ... },
    { "segment_index": 2, ... }
  ]
}

Rules:
- Korean must be natural conversational Korean for the given difficulty level
- Beginner: simple vocabulary, short sentences
- Intermediate: more complex expressions, some idioms
- Advanced: natural speed expressions, cultural nuance
- Questions must be answerable purely from listening — no trick questions
- Wrong options must be plausible but clearly wrong from the dialogue
- Alternate speakers A and B naturally
- Each segment should flow naturally as a short part of a longer conversation`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const text =
    message.content[0].type === 'text' ? message.content[0].text : '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON found in response');
  const data = JSON.parse(match[0]);
  return data.segments;
}

async function main() {
  const results = [];
  for (let i = 0; i < EXERCISES.length; i++) {
    const ex = EXERCISES[i];
    console.log(`[${i + 1}/${EXERCISES.length}] Generating: ${ex.title}`);
    try {
      const segments = await generateSegments(ex);
      results.push({ ...ex, segments });
      // Small delay to avoid rate limits
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
      results.push({ ...ex, segments: [] });
    }
  }
  fs.writeFileSync(
    'listening-exercises.json',
    JSON.stringify(results, null, 2)
  );
  console.log(
    `\n✅ Done! Saved ${results.length} exercises to listening-exercises.json`
  );
}

main();
