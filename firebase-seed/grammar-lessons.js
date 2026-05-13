const grammarLessons = [
  // ── BEGINNER ────────────────────────────────────────────────
  {
    id: 'lesson_beg_1',
    level: 'Beginner',
    sort_order: 1,
    title_ko: '이에요 / 예요',
    title_en: 'To Be',
    explanation:
      'Use 이에요 after consonant-ending nouns and 예요 after vowel-ending nouns to say "is/am/are." This is the standard polite form of the verb "to be."',
    examples: [
      { korean: '저는 학생이에요.', translation: 'I am a student.' },
      { korean: '이것은 사과예요.', translation: 'This is an apple.' },
      { korean: '저는 미국 사람이에요.', translation: 'I am American.' },
    ],
  },
  {
    id: 'lesson_beg_2',
    level: 'Beginner',
    sort_order: 2,
    title_ko: '은 / 는',
    title_en: 'Topic Marker',
    explanation:
      '은 follows consonant-ending nouns; 는 follows vowel-ending nouns. It marks the topic of the sentence — what you are talking about. It often translates as "as for."',
    examples: [
      {
        korean: '저는 커피를 좋아해요.',
        translation: 'As for me, I like coffee.',
      },
      {
        korean: '날씨는 맑아요.',
        translation: 'As for the weather, it is clear.',
      },
      {
        korean: '이 책은 재미있어요.',
        translation: 'As for this book, it is interesting.',
      },
    ],
  },
  {
    id: 'lesson_beg_3',
    level: 'Beginner',
    sort_order: 3,
    title_ko: '이 / 가',
    title_en: 'Subject Marker',
    explanation:
      '이 follows consonant-ending nouns; 가 follows vowel-ending nouns. It marks the grammatical subject of the sentence — who or what is doing the action.',
    examples: [
      { korean: '비가 와요.', translation: 'It is raining.' },
      { korean: '친구가 왔어요.', translation: 'A friend came.' },
      { korean: '커피가 맛있어요.', translation: 'The coffee is delicious.' },
    ],
  },
  {
    id: 'lesson_beg_4',
    level: 'Beginner',
    sort_order: 4,
    title_ko: '을 / 를',
    title_en: 'Object Marker',
    explanation:
      '을 follows consonant-ending nouns; 를 follows vowel-ending nouns. It marks the direct object of a verb — what the action is done to.',
    examples: [
      { korean: '밥을 먹어요.', translation: 'I eat rice.' },
      { korean: '음악을 들어요.', translation: 'I listen to music.' },
      { korean: '커피를 마셔요.', translation: 'I drink coffee.' },
    ],
  },
  {
    id: 'lesson_beg_5',
    level: 'Beginner',
    sort_order: 5,
    title_ko: '있어요 / 없어요',
    title_en: 'To Have / Not Have',
    explanation:
      '있어요 means "there is" or "I have." 없어요 means "there is not" or "I do not have." Both also express existence of people or things.',
    examples: [
      { korean: '시간이 있어요?', translation: 'Do you have time?' },
      { korean: '돈이 없어요.', translation: 'I have no money.' },
      { korean: '고양이가 있어요.', translation: 'I have a cat.' },
    ],
  },
  {
    id: 'lesson_beg_6',
    level: 'Beginner',
    sort_order: 6,
    title_ko: '아니에요',
    title_en: 'Is Not',
    explanation:
      'The negative of 이에요/예요. Used to say something "is not" something else. The noun being negated takes the subject marker 이/가 before 아니에요.',
    examples: [
      { korean: '저는 선생님이 아니에요.', translation: 'I am not a teacher.' },
      { korean: '이것은 커피가 아니에요.', translation: 'This is not coffee.' },
      {
        korean: '저는 일본 사람이 아니에요.',
        translation: 'I am not Japanese.',
      },
    ],
  },
  {
    id: 'lesson_beg_7',
    level: 'Beginner',
    sort_order: 7,
    title_ko: '아/어요',
    title_en: 'Present Tense',
    explanation:
      'The standard polite present tense ending. Verbs with ㅏ or ㅗ in the stem take 아요; others take 어요. 하다 verbs become 해요.',
    examples: [
      { korean: '저는 공부해요.', translation: 'I study.' },
      { korean: '친구를 만나요.', translation: 'I meet a friend.' },
      { korean: '음악을 들어요.', translation: 'I listen to music.' },
    ],
  },
  {
    id: 'lesson_beg_8',
    level: 'Beginner',
    sort_order: 8,
    title_ko: '았/었어요',
    title_en: 'Past Tense',
    explanation:
      'The polite past tense. Add 았어요 after ㅏ/ㅗ vowel stems and 었어요 after all others. 하다 verbs become 했어요.',
    examples: [
      { korean: '어제 밥을 먹었어요.', translation: 'I ate yesterday.' },
      { korean: '친구를 만났어요.', translation: 'I met a friend.' },
      { korean: '한국에 갔어요.', translation: 'I went to Korea.' },
    ],
  },
  {
    id: 'lesson_beg_9',
    level: 'Beginner',
    sort_order: 9,
    title_ko: 'ㄹ/을 거예요',
    title_en: 'Future Tense',
    explanation:
      'Expresses future plans or predictions. After vowel-ending stems add ㄹ 거예요; after consonant-ending stems add 을 거예요.',
    examples: [
      { korean: '내일 갈 거예요.', translation: 'I will go tomorrow.' },
      { korean: '비가 올 거예요.', translation: 'It will rain.' },
      { korean: '공부할 거예요.', translation: 'I will study.' },
    ],
  },
  {
    id: 'lesson_beg_10',
    level: 'Beginner',
    sort_order: 10,
    title_ko: '하고 / 와/과',
    title_en: 'And (Nouns)',
    explanation:
      'Connects nouns together. 하고 is casual and versatile; 와 (after vowel) and 과 (after consonant) are slightly more formal.',
    examples: [
      {
        korean: '커피하고 케이크를 주세요.',
        translation: 'Coffee and cake, please.',
      },
      {
        korean: '사과와 바나나가 있어요.',
        translation: 'There are apples and bananas.',
      },
      { korean: '밥하고 국을 먹어요.', translation: 'I eat rice and soup.' },
    ],
  },
  {
    id: 'lesson_beg_11',
    level: 'Beginner',
    sort_order: 11,
    title_ko: '주세요',
    title_en: 'Please Give / Please Do',
    explanation:
      '주세요 after a noun means "please give me." After a verb stem + 아/어 it means "please do (for me)." It is the most common polite request form.',
    examples: [
      { korean: '물 주세요.', translation: 'Water, please.' },
      { korean: '천천히 말해 주세요.', translation: 'Please speak slowly.' },
      { korean: '메뉴판 주세요.', translation: 'Please give me the menu.' },
    ],
  },
  {
    id: 'lesson_beg_12',
    level: 'Beginner',
    sort_order: 12,
    title_ko: '고 싶어요',
    title_en: 'Want To Do',
    explanation:
      'Attach 고 싶어요 to a verb stem to express desire. It translates as "I want to..." The subject takes 이/가 or 은/는.',
    examples: [
      { korean: '한국에 가고 싶어요.', translation: 'I want to go to Korea.' },
      { korean: '라면을 먹고 싶어요.', translation: 'I want to eat ramen.' },
      { korean: '쉬고 싶어요.', translation: 'I want to rest.' },
    ],
  },
  {
    id: 'lesson_beg_13',
    level: 'Beginner',
    sort_order: 13,
    title_ko: '안',
    title_en: "Negation (Don't/Not)",
    explanation:
      'Place 안 directly before a verb or adjective to negate it. For 하다 verbs, insert 안 before 하다 — e.g. 공부 안 해요.',
    examples: [
      { korean: '저는 고기를 안 먹어요.', translation: 'I do not eat meat.' },
      { korean: '오늘은 안 바빠요.', translation: 'I am not busy today.' },
      { korean: '술을 안 마셔요.', translation: 'I do not drink alcohol.' },
    ],
  },
  {
    id: 'lesson_beg_14',
    level: 'Beginner',
    sort_order: 14,
    title_ko: '못',
    title_en: 'Cannot',
    explanation:
      'Place 못 before a verb to express inability. It implies the subject wants to but is unable — stronger than simply using 안.',
    examples: [
      {
        korean: '매운 음식을 못 먹어요.',
        translation: 'I cannot eat spicy food.',
      },
      { korean: '오늘 못 가요.', translation: 'I cannot go today.' },
      {
        korean: '한국어를 잘 못 해요.',
        translation: 'I cannot speak Korean well.',
      },
    ],
  },
  {
    id: 'lesson_beg_15',
    level: 'Beginner',
    sort_order: 15,
    title_ko: '어디 / 뭐 / 누구 / 언제',
    title_en: 'Question Words',
    explanation:
      'Core question words: 어디 (where), 뭐 (what), 누구 (who), 언제 (when). Place them where the answer would naturally go in the sentence.',
    examples: [
      { korean: '지금 어디에 있어요?', translation: 'Where are you now?' },
      { korean: '뭐 먹고 싶어요?', translation: 'What do you want to eat?' },
      {
        korean: '언제 한국에 가요?',
        translation: 'When are you going to Korea?',
      },
    ],
  },
  {
    id: 'lesson_beg_16',
    level: 'Beginner',
    sort_order: 16,
    title_ko: '에 / 에서',
    title_en: 'Location Particles',
    explanation:
      '에 marks a destination or static location (at/to). 에서 marks where an action takes place (at/from). They are not interchangeable.',
    examples: [
      { korean: '학교에 가요.', translation: 'I go to school.' },
      {
        korean: '도서관에서 공부해요.',
        translation: 'I study at the library.',
      },
      { korean: '서울에서 왔어요.', translation: 'I came from Seoul.' },
    ],
  },
  {
    id: 'lesson_beg_17',
    level: 'Beginner',
    sort_order: 17,
    title_ko: '한테 / 에게',
    title_en: 'To (a Person)',
    explanation:
      '한테 is casual; 에게 is more formal. Both mean "to" when giving or saying something to a person. 한테서/에게서 means "from" a person.',
    examples: [
      {
        korean: '친구한테 선물을 줬어요.',
        translation: 'I gave a gift to my friend.',
      },
      { korean: '선생님에게 물어봤어요.', translation: 'I asked the teacher.' },
      { korean: '엄마한테 전화했어요.', translation: 'I called my mom.' },
    ],
  },
  {
    id: 'lesson_beg_18',
    level: 'Beginner',
    sort_order: 18,
    title_ko: '도',
    title_en: 'Also / Too',
    explanation:
      'Replace subject or object markers with 도 to add the meaning of "also/too." It can follow almost any noun and softens comparisons.',
    examples: [
      { korean: '저도 가고 싶어요.', translation: 'I also want to go.' },
      { korean: '커피도 주세요.', translation: 'Coffee too, please.' },
      { korean: '한국어도 공부해요.', translation: 'I also study Korean.' },
    ],
  },
  {
    id: 'lesson_beg_19',
    level: 'Beginner',
    sort_order: 19,
    title_ko: '숫자 + 세는 단어',
    title_en: 'Numbers + Counters',
    explanation:
      'Korean has two number systems. Sino-Korean (일, 이, 삼...) is used with dates, money, and minutes. Native Korean (하나, 둘, 셋...) is used with most counters like 개, 명, and 잔.',
    examples: [
      { korean: '사과 두 개 주세요.', translation: 'Two apples, please.' },
      {
        korean: '학생이 세 명 있어요.',
        translation: 'There are three students.',
      },
      { korean: '커피 한 잔 주세요.', translation: 'One coffee, please.' },
    ],
  },
  {
    id: 'lesson_beg_20',
    level: 'Beginner',
    sort_order: 20,
    title_ko: '정중한 요청 표현',
    title_en: 'Polite Request Patterns',
    explanation:
      '주세요 is the basic request. 줄 수 있어요? is softer and more polite, meaning "can you...?" 해 주시겠어요? is the most formal. Choose based on the situation.',
    examples: [
      { korean: '창문 닫아 주세요.', translation: 'Please close the window.' },
      { korean: '도와줄 수 있어요?', translation: 'Can you help me?' },
      {
        korean: '좀 더 크게 말해 줄 수 있어요?',
        translation: 'Can you speak a bit louder?',
      },
    ],
  },
  {
    id: 'lesson_beg_21',
    level: 'Beginner',
    sort_order: 21,
    title_ko: '때문에',
    title_en: 'Because Of',
    explanation:
      'Use 때문에 after a noun, or 기 때문에 after a verb/adjective phrase, to give a clear reason. It is more direct than 아/어서.',
    examples: [
      {
        korean: '비 때문에 못 갔어요.',
        translation: 'I could not go because of the rain.',
      },
      {
        korean: '일 때문에 바빠요.',
        translation: 'I am busy because of work.',
      },
      {
        korean: '감기 때문에 쉬었어요.',
        translation: 'I rested because of a cold.',
      },
    ],
  },
  {
    id: 'lesson_beg_22',
    level: 'Beginner',
    sort_order: 22,
    title_ko: '부터 / 까지',
    title_en: 'From / Until',
    explanation:
      '부터 means “from” a starting point, and 까지 means “until/to” an ending point. They are common with time and place expressions.',
    examples: [
      {
        korean: '아홉 시부터 공부해요.',
        translation: 'I study from nine o’clock.',
      },
      {
        korean: '월요일부터 금요일까지 일해요.',
        translation: 'I work from Monday to Friday.',
      },
      { korean: '집까지 걸어가요.', translation: 'I walk to my house.' },
    ],
  },
  {
    id: 'lesson_beg_23',
    level: 'Beginner',
    sort_order: 23,
    title_ko: '전에 / 후에',
    title_en: 'Before / After',
    explanation:
      '전에 means “before,” and 후에 means “after.” With verbs, use verb stem + 기 전에 and verb stem + 은/ㄴ 후에.',
    examples: [
      {
        korean: '밥 먹기 전에 손을 씻어요.',
        translation: 'I wash my hands before eating.',
      },
      { korean: '수업 후에 집에 가요.', translation: 'I go home after class.' },
      {
        korean: '운동한 후에 샤워해요.',
        translation: 'I shower after exercising.',
      },
    ],
  },
  {
    id: 'lesson_beg_24',
    level: 'Beginner',
    sort_order: 24,
    title_ko: '으러 가다',
    title_en: 'Go In Order To',
    explanation:
      'Attach 으러/러 가다 to a verb stem to say you go somewhere in order to do something. Use 으러 after consonants and 러 after vowels.',
    examples: [
      { korean: '밥 먹으러 가요.', translation: 'I am going to eat.' },
      {
        korean: '친구를 만나러 가요.',
        translation: 'I am going to meet a friend.',
      },
      {
        korean: '공부하러 카페에 가요.',
        translation: 'I am going to a café to study.',
      },
    ],
  },
  {
    id: 'lesson_beg_25',
    level: 'Beginner',
    sort_order: 25,
    title_ko: '지 않아요',
    title_en: 'Formal Negation',
    explanation:
      'Attach 지 않아요 to a verb or adjective stem to make a more formal or written negative. It means “do not” or “is not.”',
    examples: [
      { korean: '오늘은 춥지 않아요.', translation: 'It is not cold today.' },
      { korean: '저는 고기를 먹지 않아요.', translation: 'I do not eat meat.' },
      {
        korean: '그 영화는 재미있지 않아요.',
        translation: 'That movie is not interesting.',
      },
    ],
  },
  {
    id: 'lesson_beg_26',
    level: 'Beginner',
    sort_order: 26,
    title_ko: '아/어야 해요',
    title_en: 'Have To / Must',
    explanation:
      'Attach 아/어야 해요 to a verb stem to express obligation or necessity. It means “have to” or “must.”',
    examples: [
      { korean: '지금 가야 해요.', translation: 'I have to go now.' },
      { korean: '숙제를 해야 해요.', translation: 'I have to do homework.' },
      { korean: '약을 먹어야 해요.', translation: 'I have to take medicine.' },
    ],
  },
  {
    id: 'lesson_beg_27',
    level: 'Beginner',
    sort_order: 27,
    title_ko: '지 못해요',
    title_en: 'Cannot (Formal)',
    explanation:
      'Attach 지 못해요 to a verb stem to express inability in a slightly more formal way than 못. It means “cannot do.”',
    examples: [
      { korean: '오늘 가지 못해요.', translation: 'I cannot go today.' },
      {
        korean: '한국어를 잘 말하지 못해요.',
        translation: 'I cannot speak Korean well.',
      },
      {
        korean: '어제 자지 못했어요.',
        translation: 'I could not sleep yesterday.',
      },
    ],
  },
  {
    id: 'lesson_beg_28',
    level: 'Beginner',
    sort_order: 28,
    title_ko: '고 있어요',
    title_en: 'Progressive Tense',
    explanation:
      'Attach 고 있어요 to a verb stem to say an action is currently happening. It means “am/is/are doing.”',
    examples: [
      {
        korean: '지금 공부하고 있어요.',
        translation: 'I am studying right now.',
      },
      {
        korean: '친구를 기다리고 있어요.',
        translation: 'I am waiting for a friend.',
      },
      { korean: '밥을 먹고 있어요.', translation: 'I am eating.' },
    ],
  },
  {
    id: 'lesson_beg_29',
    level: 'Beginner',
    sort_order: 29,
    title_ko: '어때요?',
    title_en: 'How Is It?',
    explanation:
      '어때요? asks for an opinion or condition. It means “how is it?” or “what do you think?”',
    examples: [
      { korean: '이 음식 어때요?', translation: 'How is this food?' },
      { korean: '오늘 날씨 어때요?', translation: 'How is the weather today?' },
      { korean: '한국어 수업 어때요?', translation: 'How is Korean class?' },
    ],
  },
  {
    id: 'lesson_beg_30',
    level: 'Beginner',
    sort_order: 30,
    title_ko: '아직 / 벌써',
    title_en: 'Still / Already',
    explanation:
      '아직 means “still” or “not yet,” while 벌써 means “already.” They are common in daily time-related sentences.',
    examples: [
      { korean: '아직 안 먹었어요.', translation: 'I have not eaten yet.' },
      { korean: '벌써 끝났어요?', translation: 'Is it already over?' },
      { korean: '아직 집에 있어요.', translation: 'I am still at home.' },
    ],
  },
  {
    id: 'lesson_beg_31',
    level: 'Beginner',
    sort_order: 31,
    title_ko: '먼저 / 나중에',
    title_en: 'First / Later',
    explanation:
      '먼저 means “first,” and 나중에 means “later.” Use them to organize actions in time.',
    examples: [
      { korean: '먼저 밥을 먹어요.', translation: 'I eat first.' },
      { korean: '나중에 전화할게요.', translation: 'I will call later.' },
      { korean: '먼저 가세요.', translation: 'Please go first.' },
    ],
  },
  {
    id: 'lesson_beg_32',
    level: 'Beginner',
    sort_order: 32,
    title_ko: '같이 / 함께',
    title_en: 'Together / With',
    explanation:
      '같이 and 함께 mean “together.” 같이 is very common in conversation, while 함께 is a little more formal.',
    examples: [
      { korean: '같이 가요.', translation: 'Let’s go together.' },
      {
        korean: '친구하고 같이 공부해요.',
        translation: 'I study with a friend.',
      },
      { korean: '함께 식사해요.', translation: 'We eat together.' },
    ],
  },
  {
    id: 'lesson_beg_33',
    level: 'Beginner',
    sort_order: 33,
    title_ko: '밖에 + Negative',
    title_en: 'Only / Nothing But',
    explanation:
      '밖에 is used with a negative verb to mean “only” or “nothing but.” The sentence must end negatively, usually with 없어요 or 안.',
    examples: [
      { korean: '천 원밖에 없어요.', translation: 'I only have 1,000 won.' },
      { korean: '하나밖에 안 먹었어요.', translation: 'I only ate one.' },
      {
        korean: '시간이 조금밖에 없어요.',
        translation: 'I only have a little time.',
      },
    ],
  },
  {
    id: 'lesson_beg_34',
    level: 'Beginner',
    sort_order: 34,
    title_ko: '만',
    title_en: 'Only / Just',
    explanation:
      '만 means “only” or “just.” Unlike 밖에, it does not require a negative ending.',
    examples: [
      { korean: '커피만 주세요.', translation: 'Just coffee, please.' },
      { korean: '저만 갔어요.', translation: 'Only I went.' },
      { korean: '오늘만 쉬어요.', translation: 'I am only resting today.' },
    ],
  },
  {
    id: 'lesson_beg_35',
    level: 'Beginner',
    sort_order: 35,
    title_ko: '으로 / 로',
    title_en: 'By / Toward / Using',
    explanation:
      '으로/로 marks direction, method, tool, or change. Use 으로 after consonants, 로 after vowels and ㄹ-ending nouns.',
    examples: [
      { korean: '학교로 가요.', translation: 'I go toward school.' },
      { korean: '버스로 왔어요.', translation: 'I came by bus.' },
      {
        korean: '한국어로 말해 주세요.',
        translation: 'Please speak in Korean.',
      },
    ],
  },
  {
    id: 'lesson_beg_36',
    level: 'Beginner',
    sort_order: 36,
    title_ko: '에게서 / 한테서',
    title_en: 'From A Person',
    explanation:
      '에게서 and 한테서 mean “from” a person. 한테서 is more conversational, while 에게서 is more formal.',
    examples: [
      {
        korean: '친구한테서 선물을 받았어요.',
        translation: 'I received a gift from a friend.',
      },
      {
        korean: '선생님에게서 배웠어요.',
        translation: 'I learned from the teacher.',
      },
      {
        korean: '엄마한테서 전화가 왔어요.',
        translation: 'I got a call from my mom.',
      },
    ],
  },
  {
    id: 'lesson_beg_37',
    level: 'Beginner',
    sort_order: 37,
    title_ko: 'ㄹ까요?',
    title_en: 'Shall We / Should I?',
    explanation:
      'ㄹ까요/을까요 asks for suggestion, intention, or the listener’s opinion. It often means “shall we?” or “should I?”',
    examples: [
      { korean: '같이 갈까요?', translation: 'Shall we go together?' },
      { korean: '뭐 먹을까요?', translation: 'What should we eat?' },
      { korean: '문을 닫을까요?', translation: 'Should I close the door?' },
    ],
  },
  {
    id: 'lesson_beg_38',
    level: 'Beginner',
    sort_order: 38,
    title_ko: '읍시다 / ㅂ시다',
    title_en: 'Let’s (Formal)',
    explanation:
      '읍시다/ㅂ시다 means “let’s” in a formal or group setting. Use 읍시다 after consonants and ㅂ시다 after vowels.',
    examples: [
      { korean: '같이 갑시다.', translation: 'Let’s go together.' },
      { korean: '회의를 시작합시다.', translation: 'Let’s start the meeting.' },
      { korean: '잠깐 쉽시다.', translation: 'Let’s rest for a moment.' },
    ],
  },
  {
    id: 'lesson_beg_39',
    level: 'Beginner',
    sort_order: 39,
    title_ko: '지요 / 죠',
    title_en: 'Right? / Isn’t It?',
    explanation:
      '지요, often shortened to 죠, asks for confirmation or soft agreement. It is like “right?” or “isn’t it?”',
    examples: [
      { korean: '맛있죠?', translation: 'It is delicious, right?' },
      { korean: '오늘 춥지요?', translation: 'It is cold today, right?' },
      { korean: '한국어 어렵죠?', translation: 'Korean is hard, right?' },
    ],
  },
  {
    id: 'lesson_beg_40',
    level: 'Beginner',
    sort_order: 40,
    title_ko: '아/어 보세요',
    title_en: 'Please Try Doing',
    explanation:
      '아/어 보세요 politely suggests that someone try doing something. It is softer than a direct command.',
    examples: [
      {
        korean: '한번 먹어 보세요.',
        translation: 'Please try eating it once.',
      },
      {
        korean: '이 옷 입어 보세요.',
        translation: 'Please try on these clothes.',
      },
      {
        korean: '한국어로 말해 보세요.',
        translation: 'Please try speaking in Korean.',
      },
    ],
  },

  // ── INTERMEDIATE ────────────────────────────────────────────
  {
    id: 'lesson_int_1',
    level: 'Intermediate',
    sort_order: 1,
    title_ko: '고 싶다 vs 고 싶어요',
    title_en: 'Want To (Plain vs Polite)',
    explanation:
      'Both mean "want to do." 고 싶어요 is the polite spoken form. 고 싶다 is the plain/written form used in journals, thoughts, or with close friends. Tense is marked on 싶다/싶어요.',
    examples: [
      {
        korean: '피자가 먹고 싶다.',
        translation: 'I want to eat pizza. (plain)',
      },
      {
        korean: '여행을 가고 싶어요.',
        translation: 'I want to travel. (polite)',
      },
      { korean: '집에 가고 싶었어요.', translation: 'I wanted to go home.' },
    ],
  },
  {
    id: 'lesson_int_2',
    level: 'Intermediate',
    sort_order: 2,
    title_ko: '아/어서',
    title_en: 'Because / And Then',
    explanation:
      'Connects two clauses. As a reason it means "because/so." As sequence it means "and then." The tense is only marked on the final verb — the first clause stays in its stem form.',
    examples: [
      {
        korean: '배가 아파서 못 갔어요.',
        translation: 'I could not go because my stomach hurt.',
      },
      { korean: '씻어서 잤어요.', translation: 'I washed up and then slept.' },
      { korean: '늦어서 미안해요.', translation: 'I am sorry for being late.' },
    ],
  },
  {
    id: 'lesson_int_3',
    level: 'Intermediate',
    sort_order: 3,
    title_ko: '지만',
    title_en: 'But / However',
    explanation:
      'Attaches to a verb or adjective stem to contrast two clauses. The subject of both clauses is usually the same. It softens the contrast compared to the English "but."',
    examples: [
      {
        korean: '비가 오지만 나가야 해요.',
        translation: 'It is raining but I have to go out.',
      },
      {
        korean: '맛있지만 너무 비싸요.',
        translation: 'It is delicious but too expensive.',
      },
      {
        korean: '피곤하지만 공부해요.',
        translation: 'I am tired but I am studying.',
      },
    ],
  },
  {
    id: 'lesson_int_4',
    level: 'Intermediate',
    sort_order: 4,
    title_ko: '으면서',
    title_en: 'While Doing',
    explanation:
      'Expresses two actions happening simultaneously by the same subject. Attach 으면서 after consonant stems and 면서 after vowel stems. The subject cannot differ between clauses.',
    examples: [
      {
        korean: '음악을 들으면서 공부해요.',
        translation: 'I study while listening to music.',
      },
      {
        korean: '걸으면서 전화했어요.',
        translation: 'I talked on the phone while walking.',
      },
      {
        korean: '밥을 먹으면서 TV를 봐요.',
        translation: 'I watch TV while eating.',
      },
    ],
  },
  {
    id: 'lesson_int_5',
    level: 'Intermediate',
    sort_order: 5,
    title_ko: '아/어도 돼요',
    title_en: "May I / It's Okay To",
    explanation:
      'Used to give or ask for permission. Literally "even if you do X, it is fine." Attach 아/어도 돼요 to the verb stem following normal vowel harmony rules.',
    examples: [
      { korean: '여기 앉아도 돼요?', translation: 'May I sit here?' },
      { korean: '사진 찍어도 돼요.', translation: 'You may take photos.' },
      {
        korean: '나중에 해도 돼요.',
        translation: 'It is okay to do it later.',
      },
    ],
  },
  {
    id: 'lesson_int_6',
    level: 'Intermediate',
    sort_order: 6,
    title_ko: '으면 안 돼요',
    title_en: "Must Not / Shouldn't",
    explanation:
      'The negative of 아/어도 돼요. Expresses prohibition or that something is not allowed. Attach 으면 안 돼요 after the verb stem (으면 after consonant, 면 after vowel).',
    examples: [
      {
        korean: '여기서 담배를 피우면 안 돼요.',
        translation: 'You must not smoke here.',
      },
      { korean: '늦으면 안 돼요.', translation: 'You should not be late.' },
      { korean: '거짓말하면 안 돼요.', translation: 'You must not lie.' },
    ],
  },
  {
    id: 'lesson_int_7',
    level: 'Intermediate',
    sort_order: 7,
    title_ko: '으려고 하다',
    title_en: 'Planning To / Intending To',
    explanation:
      'Expresses intention or plan. Attach 으려고 하다 to the verb stem — 으려고 after consonants, 려고 after vowels. Commonly used to describe upcoming plans.',
    examples: [
      {
        korean: '내년에 한국에 가려고 해요.',
        translation: 'I am planning to go to Korea next year.',
      },
      {
        korean: '다이어트를 하려고 해요.',
        translation: 'I am planning to go on a diet.',
      },
      { korean: '지금 자려고 했어요.', translation: 'I was about to sleep.' },
    ],
  },
  {
    id: 'lesson_int_8',
    level: 'Intermediate',
    sort_order: 8,
    title_ko: '아/어 보다',
    title_en: 'Try Doing',
    explanation:
      'Attach 아/어 보다 to a verb stem to express trying something or having experienced it. Commonly used as 봐요 to suggest someone give something a try.',
    examples: [
      {
        korean: '김치를 먹어 봤어요?',
        translation: 'Have you tried eating kimchi?',
      },
      { korean: '한번 해 봐요!', translation: 'Try it once!' },
      {
        korean: '이 영화 봐 봤어요?',
        translation: 'Have you tried watching this movie?',
      },
    ],
  },
  {
    id: 'lesson_int_9',
    level: 'Intermediate',
    sort_order: 9,
    title_ko: '는 것 같다',
    title_en: 'It Seems Like / I Think',
    explanation:
      'Expresses assumption or inference. Present/future: verb stem + 는 것 같다. Past: verb stem + 은/ㄴ 것 같다. Adjectives: adjective stem + 은/ㄴ 것 같다.',
    examples: [
      {
        korean: '비가 올 것 같아요.',
        translation: 'It seems like it will rain.',
      },
      { korean: '맛있는 것 같아요.', translation: 'It seems delicious.' },
      {
        korean: '그 사람이 화난 것 같아요.',
        translation: 'That person seems angry.',
      },
    ],
  },
  {
    id: 'lesson_int_10',
    level: 'Intermediate',
    sort_order: 10,
    title_ko: '은/ㄴ 적이 있다',
    title_en: 'Have Ever Done',
    explanation:
      'Expresses past experience. 은/ㄴ 적이 있어요 = have done before; 은/ㄴ 적이 없어요 = have never done. The time marker goes on 적이, not the verb.',
    examples: [
      {
        korean: '한국에 간 적이 있어요?',
        translation: 'Have you ever been to Korea?',
      },
      {
        korean: '번지 점프를 해 본 적이 없어요.',
        translation: 'I have never tried bungee jumping.',
      },
      {
        korean: '그 식당에 간 적이 있어요.',
        translation: 'I have been to that restaurant.',
      },
    ],
  },
  {
    id: 'lesson_int_11',
    level: 'Intermediate',
    sort_order: 11,
    title_ko: '으니까',
    title_en: 'Because (Strong Reason)',
    explanation:
      'Like 아/어서 but stronger and more subjective. Unlike 아/어서, it can be followed by commands and suggestions. After consonant: 으니까; after vowel: 니까.',
    examples: [
      {
        korean: '비가 오니까 우산 챙기세요.',
        translation: 'Since it is raining, bring an umbrella.',
      },
      {
        korean: '맛있으니까 먹어 봐요.',
        translation: 'Since it is delicious, try it.',
      },
      {
        korean: '늦었으니까 빨리 가요.',
        translation: 'Since we are late, let us hurry.',
      },
    ],
  },
  {
    id: 'lesson_int_12',
    level: 'Intermediate',
    sort_order: 12,
    title_ko: '거든요',
    title_en: 'You See / Actually',
    explanation:
      'Provides background information or explains a reason that the listener does not know. It often softens an explanation or makes it sound more natural in conversation.',
    examples: [
      {
        korean: '저 사실 한국어 공부 중이거든요.',
        translation: 'Actually, I am studying Korean, you see.',
      },
      {
        korean: '그 사람이 제 친구거든요.',
        translation: 'That person is my friend, you see.',
      },
      {
        korean: '저 요즘 많이 바쁘거든요.',
        translation: 'I have been really busy lately, you see.',
      },
    ],
  },
  {
    id: 'lesson_int_13',
    level: 'Intermediate',
    sort_order: 13,
    title_ko: '네요',
    title_en: 'Oh! / I See (Realization)',
    explanation:
      'Attached to verbs or adjectives to express mild surprise or a new realization. It shows the speaker just noticed or learned something.',
    examples: [
      { korean: '정말 맛있네요!', translation: 'This is really delicious!' },
      { korean: '날씨가 좋네요.', translation: 'Oh, the weather is nice.' },
      {
        korean: '한국어를 잘 하시네요.',
        translation: 'Oh, you speak Korean well.',
      },
    ],
  },
  {
    id: 'lesson_int_14',
    level: 'Intermediate',
    sort_order: 14,
    title_ko: '잖아요',
    title_en: 'You Know / As You Know',
    explanation:
      'Refers to something both the speaker and listener already know. Used to remind, emphasize, or mildly assert something that should be obvious.',
    examples: [
      {
        korean: '저 채식주의자잖아요.',
        translation: 'You know I am vegetarian.',
      },
      {
        korean: '내일 시험이잖아요.',
        translation: 'You know the exam is tomorrow.',
      },
      {
        korean: '그 사람이 유명하잖아요.',
        translation: 'That person is famous, you know.',
      },
    ],
  },
  {
    id: 'lesson_int_15',
    level: 'Intermediate',
    sort_order: 15,
    title_ko: '보다',
    title_en: 'Comparative (More Than)',
    explanation:
      'Place 보다 after the thing being compared to mean "more than." Often paired with 더 (more) or 덜 (less) for emphasis.',
    examples: [
      {
        korean: '오늘이 어제보다 더 추워요.',
        translation: 'Today is colder than yesterday.',
      },
      {
        korean: '저는 고기보다 생선을 좋아해요.',
        translation: 'I like fish more than meat.',
      },
      {
        korean: '예상보다 빨랐어요.',
        translation: 'It was faster than expected.',
      },
    ],
  },
  {
    id: 'lesson_int_16',
    level: 'Intermediate',
    sort_order: 16,
    title_ko: '가장 / 제일',
    title_en: 'Superlative (Most/Best)',
    explanation:
      'Place 가장 or 제일 before an adjective or adverb to express "the most" or "the best." They are interchangeable; 제일 is slightly more casual.',
    examples: [
      {
        korean: '이게 가장 맛있어요.',
        translation: 'This is the most delicious.',
      },
      {
        korean: '제일 좋아하는 음식이 뭐예요?',
        translation: 'What is your favorite food?',
      },
      {
        korean: '한국어가 가장 어려워요.',
        translation: 'Korean is the most difficult.',
      },
    ],
  },
  {
    id: 'lesson_int_17',
    level: 'Intermediate',
    sort_order: 17,
    title_ko: '게 되다',
    title_en: 'Come To Be / End Up',
    explanation:
      'Expresses a change of situation or outcome that happened, often naturally or beyond one\'s control. It conveys the sense of "things turned out this way."',
    examples: [
      {
        korean: '한국어를 공부하게 됐어요.',
        translation: 'I came to study Korean.',
      },
      {
        korean: '한국에서 살게 됐어요.',
        translation: 'I ended up living in Korea.',
      },
      {
        korean: '그 소식을 알게 됐어요.',
        translation: 'I came to know that news.',
      },
    ],
  },
  {
    id: 'lesson_int_18',
    level: 'Intermediate',
    sort_order: 18,
    title_ko: '아/어 주다',
    title_en: 'Do For Someone',
    explanation:
      "Attach 아/어 주다 to a verb stem to indicate doing an action for someone else's benefit. 주다 can be conjugated for tense and formality.",
    examples: [
      {
        korean: '도와줘서 감사해요.',
        translation: 'Thank you for helping me.',
      },
      { korean: '가르쳐 줄 수 있어요?', translation: 'Can you teach me?' },
      { korean: '설명해 주세요.', translation: 'Please explain it to me.' },
    ],
  },
  {
    id: 'lesson_int_19',
    level: 'Intermediate',
    sort_order: 19,
    title_ko: '는 중이다',
    title_en: 'In The Middle Of',
    explanation:
      'Expresses an ongoing action at a specific moment. Attach 는 중이에요 to the verb stem. Often translates as "I am in the middle of..."',
    examples: [
      {
        korean: '지금 밥 먹는 중이에요.',
        translation: 'I am in the middle of eating right now.',
      },
      {
        korean: '회의 중이에요.',
        translation: 'I am in the middle of a meeting.',
      },
      {
        korean: '공부하는 중이었어요.',
        translation: 'I was in the middle of studying.',
      },
    ],
  },
  {
    id: 'lesson_int_20',
    level: 'Intermediate',
    sort_order: 20,
    title_ko: '다고 하다',
    title_en: 'Quoted Speech',
    explanation:
      'Reports what someone said. For statements: verb + 다고 하다. For commands: verb + 라고 하다. For questions: verb + 냐고 하다. The tense is marked on the original verb, not 하다.',
    examples: [
      {
        korean: '친구가 내일 온다고 했어요.',
        translation: 'My friend said they are coming tomorrow.',
      },
      {
        korean: '선생님이 공부하라고 했어요.',
        translation: 'The teacher told me to study.',
      },
      {
        korean: '어디 가냐고 물어봤어요.',
        translation: 'I asked where they were going.',
      },
    ],
  },
  {
    id: 'lesson_int_21',
    level: 'Intermediate',
    sort_order: 21,
    title_ko: '기 전에',
    title_en: 'Before Doing',
    explanation:
      'Attach 기 전에 to a verb stem to mean “before doing.” It is common for sequencing daily actions.',
    examples: [
      {
        korean: '자기 전에 이를 닦아요.',
        translation: 'I brush my teeth before sleeping.',
      },
      {
        korean: '먹기 전에 손을 씻어요.',
        translation: 'I wash my hands before eating.',
      },
      {
        korean: '가기 전에 전화하세요.',
        translation: 'Please call before you go.',
      },
    ],
  },
  {
    id: 'lesson_int_22',
    level: 'Intermediate',
    sort_order: 22,
    title_ko: '는 동안',
    title_en: 'While / During',
    explanation:
      'Attach 는 동안 to a verb stem to mean “while doing.” With nouns, use 동안 directly after the noun.',
    examples: [
      {
        korean: '기다리는 동안 음악을 들었어요.',
        translation: 'I listened to music while waiting.',
      },
      {
        korean: '방학 동안 여행했어요.',
        translation: 'I traveled during vacation.',
      },
      {
        korean: '공부하는 동안 전화하지 마세요.',
        translation: 'Please do not call while I study.',
      },
    ],
  },
  {
    id: 'lesson_int_23',
    level: 'Intermediate',
    sort_order: 23,
    title_ko: '자마자',
    title_en: 'As Soon As',
    explanation:
      'Attach 자마자 to a verb stem to mean “as soon as.” The first clause does not carry tense.',
    examples: [
      {
        korean: '집에 오자마자 잤어요.',
        translation: 'I slept as soon as I got home.',
      },
      {
        korean: '보자마자 알았어요.',
        translation: 'I knew as soon as I saw it.',
      },
      {
        korean: '끝나자마자 전화할게요.',
        translation: 'I will call as soon as it ends.',
      },
    ],
  },
  {
    id: 'lesson_int_24',
    level: 'Intermediate',
    sort_order: 24,
    title_ko: '아/어 버리다',
    title_en: 'End Up / Completely',
    explanation:
      '아/어 버리다 shows an action is completed, often with regret, relief, or emotional emphasis.',
    examples: [
      {
        korean: '숙제를 다 해 버렸어요.',
        translation: 'I finished all my homework.',
      },
      { korean: '지갑을 잃어버렸어요.', translation: 'I lost my wallet.' },
      {
        korean: '음식을 다 먹어 버렸어요.',
        translation: 'I ate all the food.',
      },
    ],
  },
  {
    id: 'lesson_int_25',
    level: 'Intermediate',
    sort_order: 25,
    title_ko: '는 편이다',
    title_en: 'Tend To / On The Side',
    explanation:
      '는 편이다 softens a description by saying someone tends to be a certain way or is on the side of that quality.',
    examples: [
      {
        korean: '저는 커피를 많이 마시는 편이에요.',
        translation: 'I tend to drink a lot of coffee.',
      },
      {
        korean: '그 식당은 비싼 편이에요.',
        translation: 'That restaurant is on the expensive side.',
      },
      {
        korean: '저는 조용한 편이에요.',
        translation: 'I am on the quiet side.',
      },
    ],
  },
  {
    id: 'lesson_int_26',
    level: 'Intermediate',
    sort_order: 26,
    title_ko: '을 수도 있다',
    title_en: 'Might / Could',
    explanation:
      '을 수도 있다 expresses possibility. Use ㄹ 수도 있다 after vowel stems and 을 수도 있다 after consonant stems.',
    examples: [
      {
        korean: '내일 비가 올 수도 있어요.',
        translation: 'It might rain tomorrow.',
      },
      { korean: '그럴 수도 있어요.', translation: 'That could be possible.' },
      { korean: '늦을 수도 있어요.', translation: 'I might be late.' },
    ],
  },
  {
    id: 'lesson_int_27',
    level: 'Intermediate',
    sort_order: 27,
    title_ko: '는데 / 은데',
    title_en: 'Background / Contrast',
    explanation:
      '는데 gives background, contrast, or sets up what comes next. It is extremely common in natural Korean conversation.',
    examples: [
      {
        korean: '배고픈데 뭐 먹을까요?',
        translation: 'I am hungry, so what should we eat?',
      },
      {
        korean: '가고 싶은데 시간이 없어요.',
        translation: 'I want to go, but I do not have time.',
      },
      {
        korean: '지금 바쁜데 나중에 전화할게요.',
        translation: 'I am busy now, so I will call later.',
      },
    ],
  },
  {
    id: 'lesson_int_28',
    level: 'Intermediate',
    sort_order: 28,
    title_ko: '다가',
    title_en: 'While Doing Then',
    explanation:
      '다가 shows that one action was interrupted or changed into another action. It often means “while doing, then…”',
    examples: [
      {
        korean: '공부하다가 잠들었어요.',
        translation: 'I fell asleep while studying.',
      },
      {
        korean: '길을 걷다가 친구를 만났어요.',
        translation: 'I met a friend while walking.',
      },
      {
        korean: '요리하다가 손을 데었어요.',
        translation: 'I burned my hand while cooking.',
      },
    ],
  },
  {
    id: 'lesson_int_29',
    level: 'Intermediate',
    sort_order: 29,
    title_ko: '기로 하다',
    title_en: 'Decide To',
    explanation:
      '기로 하다 means “decide to do.” It focuses on a decision or agreement.',
    examples: [
      {
        korean: '내일 만나기로 했어요.',
        translation: 'We decided to meet tomorrow.',
      },
      { korean: '운동하기로 했어요.', translation: 'I decided to exercise.' },
      {
        korean: '한국어를 배우기로 했어요.',
        translation: 'I decided to learn Korean.',
      },
    ],
  },
  {
    id: 'lesson_int_30',
    level: 'Intermediate',
    sort_order: 30,
    title_ko: '아/어지다',
    title_en: 'Become / Get',
    explanation:
      '아/어지다 attaches to adjectives to show a change of state, meaning “become” or “get.”',
    examples: [
      { korean: '날씨가 추워졌어요.', translation: 'The weather got cold.' },
      { korean: '한국어가 쉬워졌어요.', translation: 'Korean became easier.' },
      { korean: '방이 깨끗해졌어요.', translation: 'The room became clean.' },
    ],
  },
  {
    id: 'lesson_int_31',
    level: 'Intermediate',
    sort_order: 31,
    title_ko: '게 하다',
    title_en: 'Make / Let Someone Do',
    explanation:
      '게 하다 means to make or allow someone to do something. The subject causes another person to act.',
    examples: [
      {
        korean: '선생님이 학생들을 공부하게 했어요.',
        translation: 'The teacher made the students study.',
      },
      {
        korean: '엄마가 저를 쉬게 했어요.',
        translation: 'My mom let me rest.',
      },
      {
        korean: '그 말이 저를 웃게 했어요.',
        translation: 'Those words made me laugh.',
      },
    ],
  },
  {
    id: 'lesson_int_32',
    level: 'Intermediate',
    sort_order: 32,
    title_ko: '을 뻔하다',
    title_en: 'Almost Did',
    explanation:
      '을 뻔하다 means something almost happened but did not. It is often used for close calls.',
    examples: [
      { korean: '넘어질 뻔했어요.', translation: 'I almost fell.' },
      {
        korean: '버스를 놓칠 뻔했어요.',
        translation: 'I almost missed the bus.',
      },
      { korean: '울 뻔했어요.', translation: 'I almost cried.' },
    ],
  },
  {
    id: 'lesson_int_33',
    level: 'Intermediate',
    sort_order: 33,
    title_ko: '나 보다',
    title_en: 'I Guess / Seems',
    explanation:
      '나 보다 expresses inference based on evidence. It means “I guess” or “it seems.”',
    examples: [
      { korean: '비가 오나 봐요.', translation: 'I guess it is raining.' },
      { korean: '많이 피곤한가 봐요.', translation: 'They seem very tired.' },
      { korean: '집에 없나 봐요.', translation: 'I guess they are not home.' },
    ],
  },
  {
    id: 'lesson_int_34',
    level: 'Intermediate',
    sort_order: 34,
    title_ko: '다니',
    title_en: 'I Can’t Believe / Since',
    explanation:
      '다니 expresses surprise, disbelief, or reaction to something heard or realized.',
    examples: [
      {
        korean: '벌써 끝났다니 믿을 수 없어요.',
        translation: 'I cannot believe it is already over.',
      },
      {
        korean: '혼자 갔다니 놀랐어요.',
        translation: 'I was surprised that you went alone.',
      },
      { korean: '그렇게 비싸다니요?', translation: 'It is that expensive?' },
    ],
  },
  {
    id: 'lesson_int_35',
    level: 'Intermediate',
    sort_order: 35,
    title_ko: '을 리가 없다',
    title_en: 'No Way / Cannot Be',
    explanation:
      '을 리가 없다 strongly denies a possibility. It means “there is no way that…”',
    examples: [
      {
        korean: '그럴 리가 없어요.',
        translation: 'There is no way that is true.',
      },
      {
        korean: '그 사람이 모를 리가 없어요.',
        translation: 'There is no way that person does not know.',
      },
      {
        korean: '벌써 끝났을 리가 없어요.',
        translation: 'There is no way it already ended.',
      },
    ],
  },
  {
    id: 'lesson_int_36',
    level: 'Intermediate',
    sort_order: 36,
    title_ko: '음 / ㅁ',
    title_en: 'Nominalization',
    explanation:
      'Attach 음/ㅁ to a verb or adjective stem to turn it into a noun-like idea, often used in writing or formal notices.',
    examples: [
      { korean: '도움이 필요해요.', translation: 'Help is needed.' },
      { korean: '그 사실을 알았어요.', translation: 'I knew that fact.' },
      {
        korean: '건강이 중요함을 느꼈어요.',
        translation: 'I felt that health is important.',
      },
    ],
  },
  {
    id: 'lesson_int_37',
    level: 'Intermediate',
    sort_order: 37,
    title_ko: '는 길이다',
    title_en: 'On The Way To',
    explanation:
      '는 길이다 means someone is on the way to doing or going somewhere.',
    examples: [
      { korean: '집에 가는 길이에요.', translation: 'I am on my way home.' },
      {
        korean: '회사에 가는 길이에요.',
        translation: 'I am on my way to work.',
      },
      {
        korean: '친구를 만나러 가는 길이에요.',
        translation: 'I am on my way to meet a friend.',
      },
    ],
  },
  {
    id: 'lesson_int_38',
    level: 'Intermediate',
    sort_order: 38,
    title_ko: '아/어 놓다',
    title_en: 'Do In Advance / Leave Done',
    explanation:
      '아/어 놓다 means to do something and leave the result as is, often in preparation.',
    examples: [
      { korean: '문을 열어 놓았어요.', translation: 'I left the door open.' },
      {
        korean: '예약해 놓았어요.',
        translation: 'I made a reservation in advance.',
      },
      {
        korean: '음식을 만들어 놓았어요.',
        translation: 'I made food in advance.',
      },
    ],
  },
  {
    id: 'lesson_int_39',
    level: 'Intermediate',
    sort_order: 39,
    title_ko: '아/어 두다',
    title_en: 'Do Ahead / Keep Done',
    explanation:
      '아/어 두다 means to do something in advance for later use. It overlaps with 아/어 놓다 but emphasizes preparation.',
    examples: [
      { korean: '미리 사 두었어요.', translation: 'I bought it in advance.' },
      {
        korean: '전화번호를 적어 두세요.',
        translation: 'Write down the phone number for later.',
      },
      {
        korean: '물을 냉장고에 넣어 두었어요.',
        translation: 'I put water in the fridge for later.',
      },
    ],
  },
  {
    id: 'lesson_int_40',
    level: 'Intermediate',
    sort_order: 40,
    title_ko: '듯이',
    title_en: 'As If / Like',
    explanation:
      '듯이 means “as if” or “like.” It compares the manner of one action or state to another.',
    examples: [
      {
        korean: '아시다시피 저는 학생이에요.',
        translation: 'As you know, I am a student.',
      },
      {
        korean: '꿈을 꾸듯이 행복했어요.',
        translation: 'I was happy as if dreaming.',
      },
      {
        korean: '말하듯이 자연스럽게 읽어 보세요.',
        translation: 'Read naturally as if speaking.',
      },
    ],
  },

  // ── ADVANCED ────────────────────────────────────────────────
  {
    id: 'lesson_adv_1',
    level: 'Advanced',
    sort_order: 1,
    title_ko: '는 척하다',
    title_en: 'Pretend To',
    explanation:
      'Attach 는 척하다 to a verb stem to express pretending to do something. For adjectives or past tense use 은/ㄴ 척하다. It implies the action is fake or performed.',
    examples: [
      { korean: '자는 척했어요.', translation: 'I pretended to be sleeping.' },
      {
        korean: '모르는 척하지 마세요.',
        translation: 'Do not pretend you do not know.',
      },
      { korean: '바쁜 척해요.', translation: 'She is pretending to be busy.' },
    ],
  },
  {
    id: 'lesson_adv_2',
    level: 'Advanced',
    sort_order: 2,
    title_ko: '더라고요',
    title_en: 'I Found / I Noticed',
    explanation:
      'Reports something the speaker personally observed or experienced firsthand. It implies a new discovery and cannot be used to report what someone else told you.',
    examples: [
      {
        korean: '그 영화 정말 재미있더라고요.',
        translation: 'I found that movie really interesting.',
      },
      {
        korean: '거기 음식이 맛있더라고요.',
        translation: 'The food there was delicious, I found.',
      },
      {
        korean: '생각보다 어렵더라고요.',
        translation: 'I found it harder than I thought.',
      },
    ],
  },
  {
    id: 'lesson_adv_3',
    level: 'Advanced',
    sort_order: 3,
    title_ko: '다 보니(까)',
    title_en: 'As I Kept Doing',
    explanation:
      'Expresses that a result or realization happened naturally as an action continued over time. Implies gradual change through repeated effort.',
    examples: [
      {
        korean: '매일 연습하다 보니 실력이 늘었어요.',
        translation: 'As I kept practicing every day, my skills improved.',
      },
      {
        korean: '한국어를 공부하다 보니 재미있어요.',
        translation: 'As I kept studying Korean, it became fun.',
      },
      {
        korean: '살다 보니 별일이 다 있네요.',
        translation: 'Living life, all kinds of things happen.',
      },
    ],
  },
  {
    id: 'lesson_adv_4',
    level: 'Advanced',
    sort_order: 4,
    title_ko: '을/ㄹ 뻔했다',
    title_en: 'Almost Did',
    explanation:
      'Expresses that something almost happened but did not. Usually a near-miss, often with a negative or surprising connotation.',
    examples: [
      { korean: '넘어질 뻔했어요.', translation: 'I almost fell.' },
      {
        korean: '버스를 놓칠 뻔했어요.',
        translation: 'I almost missed the bus.',
      },
      {
        korean: '웃음이 나올 뻔했어요.',
        translation: 'I almost burst out laughing.',
      },
    ],
  },
  {
    id: 'lesson_adv_5',
    level: 'Advanced',
    sort_order: 5,
    title_ko: '은/ㄴ 셈이다',
    title_en: "Practically / It's As If",
    explanation:
      'Expresses that something is effectively or practically the case, even if not literally true. Conveys "it amounts to" or "it is as good as."',
    examples: [
      {
        korean: '공짜나 마찬가지인 셈이에요.',
        translation: 'It is practically free.',
      },
      { korean: '다 된 셈이에요.', translation: 'It is practically done.' },
      {
        korean: '혼자 한 셈이에요.',
        translation: 'It is as if I did it alone.',
      },
    ],
  },
  {
    id: 'lesson_adv_6',
    level: 'Advanced',
    sort_order: 6,
    title_ko: '기는 하다',
    title_en: 'Do, But... (Concession)',
    explanation:
      'Acknowledges that something is true while implying a contrast or reservation. Usually followed by a but-clause. Emphasizes the first part more than simply saying 지만.',
    examples: [
      {
        korean: '맛있기는 한데 너무 비싸요.',
        translation: 'It is delicious, but too expensive.',
      },
      {
        korean: '가기는 갔는데 재미없었어요.',
        translation: 'I did go, but it was not fun.',
      },
      { korean: '알기는 알아요.', translation: 'I do know, but...' },
    ],
  },
  {
    id: 'lesson_adv_7',
    level: 'Advanced',
    sort_order: 7,
    title_ko: '을/ㄹ수록',
    title_en: 'The More... The More',
    explanation:
      'Expresses proportional increase — as one thing increases, so does another. Often paired with 더 (more) in the second clause for emphasis.',
    examples: [
      {
        korean: '공부할수록 더 어려워요.',
        translation: 'The more I study, the harder it gets.',
      },
      {
        korean: '먹을수록 맛있어요.',
        translation: 'The more you eat, the more delicious it is.',
      },
      {
        korean: '생각할수록 이상해요.',
        translation: 'The more I think about it, the stranger it is.',
      },
    ],
  },
  {
    id: 'lesson_adv_8',
    level: 'Advanced',
    sort_order: 8,
    title_ko: '은/ㄴ 채로',
    title_en: 'While Still In A State',
    explanation:
      'Expresses that a second action happens while the subject remains in the state created by the first action. The state continues unchanged into the second action.',
    examples: [
      {
        korean: '신발을 신은 채로 들어왔어요.',
        translation: 'They came in with their shoes still on.',
      },
      {
        korean: '불을 켠 채로 잠들었어요.',
        translation: 'I fell asleep with the light still on.',
      },
      {
        korean: '서 있는 채로 먹었어요.',
        translation: 'I ate while still standing.',
      },
    ],
  },
  {
    id: 'lesson_adv_9',
    level: 'Advanced',
    sort_order: 9,
    title_ko: '다가',
    title_en: 'While Doing (Then Shift)',
    explanation:
      'Indicates an action was interrupted and a different action began, or that during one action something unexpected occurred. Unlike 으면서, the two actions do not overlap.',
    examples: [
      {
        korean: '공부하다가 잠들었어요.',
        translation: 'While studying, I fell asleep.',
      },
      {
        korean: '길을 걷다가 친구를 만났어요.',
        translation: 'While walking, I ran into a friend.',
      },
      {
        korean: '웃다가 울었어요.',
        translation: 'While laughing, I started crying.',
      },
    ],
  },
  {
    id: 'lesson_adv_10',
    level: 'Advanced',
    sort_order: 10,
    title_ko: '을/ㄹ 리가 없다',
    title_en: "There's No Way That",
    explanation:
      'Strongly denies a possibility. The speaker is highly confident something cannot be true. The proposition being denied goes before 리가 없다.',
    examples: [
      {
        korean: '그 사람이 거짓말할 리가 없어요.',
        translation: 'There is no way that person would lie.',
      },
      {
        korean: '벌써 끝났을 리가 없어요.',
        translation: 'There is no way it is already finished.',
      },
      {
        korean: '모를 리가 없어요.',
        translation: 'There is no way they do not know.',
      },
    ],
  },
  {
    id: 'lesson_adv_11',
    level: 'Advanced',
    sort_order: 11,
    title_ko: '는 바람에',
    title_en: 'Because Of (Unexpected)',
    explanation:
      'Expresses an unexpected cause that led to a negative result. The cause is usually uncontrollable or sudden. Cannot be used with positive outcomes.',
    examples: [
      {
        korean: '비가 오는 바람에 행사가 취소됐어요.',
        translation: 'The event was cancelled because of unexpected rain.',
      },
      {
        korean: '늦잠을 자는 바람에 지각했어요.',
        translation: 'I was late because I overslept unexpectedly.',
      },
      {
        korean: '전화가 오는 바람에 집중을 못 했어요.',
        translation: 'I could not concentrate because of an unexpected call.',
      },
    ],
  },
  {
    id: 'lesson_adv_12',
    level: 'Advanced',
    sort_order: 12,
    title_ko: '을/ㄹ 겸',
    title_en: 'In Order To Do Both',
    explanation:
      'Expresses doing one thing with a dual purpose — accomplishing two goals with one action. Often translated as "to do both X and Y" or "while also doing."',
    examples: [
      {
        korean: '운동도 할 겸 산책을 해요.',
        translation: 'I walk to exercise and get some air too.',
      },
      {
        korean: '구경도 할 겸 시장에 가요.',
        translation: 'I am going to the market to browse and shop.',
      },
      {
        korean: '공부도 할 겸 카페에 갔어요.',
        translation: 'I went to the café to study and take a break.',
      },
    ],
  },
  {
    id: 'lesson_adv_13',
    level: 'Advanced',
    sort_order: 13,
    title_ko: '는 편이다',
    title_en: 'Tend To / On The Side Of',
    explanation:
      'Expresses a general tendency or characteristic rather than an absolute truth. It softens statements and is used when making approximate comparisons or descriptions.',
    examples: [
      {
        korean: '저는 커피를 많이 마시는 편이에요.',
        translation: 'I tend to drink a lot of coffee.',
      },
      {
        korean: '저는 내성적인 편이에요.',
        translation: 'I am on the introverted side.',
      },
      {
        korean: '이 음식은 매운 편이에요.',
        translation: 'This food tends to be spicy.',
      },
    ],
  },
  {
    id: 'lesson_adv_14',
    level: 'Advanced',
    sort_order: 14,
    title_ko: '기 때문에',
    title_en: 'Because Of (Formal)',
    explanation:
      'A formal and emphatic way to express cause or reason. More common in writing or formal speech than 아/어서. The nominalized verb/adjective + 이기 때문에 is also common.',
    examples: [
      {
        korean: '바쁘기 때문에 못 가요.',
        translation: 'I cannot go because I am busy.',
      },
      {
        korean: '건강이 중요하기 때문에 운동해요.',
        translation: 'I exercise because health is important.',
      },
      {
        korean: '시간이 없기 때문에 빨리 해야 해요.',
        translation: 'I need to hurry because there is no time.',
      },
    ],
  },
  {
    id: 'lesson_adv_15',
    level: 'Advanced',
    sort_order: 15,
    title_ko: '나 보다',
    title_en: 'I Guess / It Seems',
    explanation:
      'Expresses inference based on indirect evidence — the speaker did not see it directly but assumes it from context or clues. More indirect than 는 것 같다.',
    examples: [
      {
        korean: '불이 켜져 있는 걸 보니 집에 있나 봐요.',
        translation: 'The light is on, so I guess they are home.',
      },
      {
        korean: '많이 피곤한가 봐요.',
        translation: 'They seem to be very tired.',
      },
      { korean: '배가 고픈가 봐요.', translation: 'I guess they are hungry.' },
    ],
  },
  {
    id: 'lesson_adv_16',
    level: 'Advanced',
    sort_order: 16,
    title_ko: '게 마련이다',
    title_en: "Bound To / It's Natural",
    explanation:
      'Expresses that something is natural, inevitable, or expected given circumstances. "Things naturally turn out this way" — often used for universal truths.',
    examples: [
      {
        korean: '연습하면 늘게 마련이에요.',
        translation: 'If you practice, you are bound to improve.',
      },
      {
        korean: '인생은 힘들게 마련이에요.',
        translation: 'Life is bound to be difficult.',
      },
      {
        korean: '실수는 하게 마련이에요.',
        translation: 'Mistakes are bound to happen.',
      },
    ],
  },
  {
    id: 'lesson_adv_17',
    level: 'Advanced',
    sort_order: 17,
    title_ko: '기 마련이다',
    title_en: 'Bound To (Noun Form)',
    explanation:
      'Same meaning as 게 마련이다 but attaches differently to the verb stem using the nominalizer 기. Both forms are interchangeable but 기 마련 sounds slightly more formal.',
    examples: [
      {
        korean: '시간이 지나면 좋아지기 마련이에요.',
        translation: 'Things are bound to get better over time.',
      },
      {
        korean: '노력하면 결과가 나오기 마련이에요.',
        translation: 'If you put in effort, results are bound to come.',
      },
      {
        korean: '사람은 실수하기 마련이에요.',
        translation: 'People are bound to make mistakes.',
      },
    ],
  },
  {
    id: 'lesson_adv_18',
    level: 'Advanced',
    sort_order: 18,
    title_ko: '는 김에',
    title_en: "While You're At It",
    explanation:
      'Suggests doing something extra since you are already doing something else anyway. Implies efficiency — taking advantage of an existing opportunity.',
    examples: [
      {
        korean: '마트 가는 김에 우유 사다 줄 수 있어요?',
        translation: 'Since you are going to the mart, can you buy milk?',
      },
      {
        korean: '서울 가는 김에 친구도 만났어요.',
        translation: 'While going to Seoul, I also met a friend.',
      },
      {
        korean: '청소하는 김에 빨래도 했어요.',
        translation: 'While cleaning, I did the laundry too.',
      },
    ],
  },
  {
    id: 'lesson_adv_19',
    level: 'Advanced',
    sort_order: 19,
    title_ko: '을/ㄹ 따름이다',
    title_en: 'Can Only / All One Can Do',
    explanation:
      'Expresses that there is nothing else one can do but what is stated. Carries a sense of resignation, acceptance, or humility.',
    examples: [
      { korean: '기다릴 따름이에요.', translation: 'All I can do is wait.' },
      {
        korean: '최선을 다할 따름이에요.',
        translation: 'All I can do is give my best.',
      },
      { korean: '놀랄 따름이에요.', translation: 'I can only be amazed.' },
    ],
  },
  {
    id: 'lesson_adv_20',
    level: 'Advanced',
    sort_order: 20,
    title_ko: '구어체 축약 / 슬랭',
    title_en: 'Spoken Contractions & Slang',
    explanation:
      "In natural speech Koreans shorten many expressions. Common contractions: 이거/그거 (this/that), 뭐해 (what are you doing), 어떡해 (what do I do), 안 돼 (cannot / no), 됐어 (it's fine / forget it).",
    examples: [
      {
        korean: '뭐해?',
        translation: 'What are you doing? (shortened from 뭐 하고 있어?)',
      },
      {
        korean: '어떡해!',
        translation: 'What do I do! (shortened from 어떻게 해)',
      },
      {
        korean: '됐어.',
        translation: "It's fine. / Forget it. (shortened from 되었어)",
      },
    ],
  },
  {
    id: 'lesson_adv_21',
    level: 'Advanced',
    sort_order: 21,
    title_ko: '더니',
    title_en: 'Observed Cause / Contrast',
    explanation:
      '더니 connects something the speaker observed earlier with a later result or contrast. It often implies “after I noticed X, Y happened.”',
    examples: [
      {
        korean: '아침에는 춥더니 지금은 따뜻해요.',
        translation: 'It was cold in the morning, but now it is warm.',
      },
      {
        korean: '열심히 공부하더니 합격했어요.',
        translation: 'They studied hard and passed.',
      },
      {
        korean: '많이 먹더니 배가 아프대요.',
        translation: 'They ate a lot and now say their stomach hurts.',
      },
    ],
  },
  {
    id: 'lesson_adv_22',
    level: 'Advanced',
    sort_order: 22,
    title_ko: '을 뿐만 아니라',
    title_en: 'Not Only But Also',
    explanation:
      '을 뿐만 아니라 links two facts and means “not only…but also.” It is common in formal speech and writing.',
    examples: [
      {
        korean: '한국어뿐만 아니라 일본어도 배워요.',
        translation: 'I learn not only Korean but also Japanese.',
      },
      {
        korean: '맛있을 뿐만 아니라 건강에도 좋아요.',
        translation: 'It is not only delicious but also good for your health.',
      },
      {
        korean: '친절할 뿐만 아니라 똑똑해요.',
        translation: 'They are not only kind but also smart.',
      },
    ],
  },
  {
    id: 'lesson_adv_23',
    level: 'Advanced',
    sort_order: 23,
    title_ko: '느니 차라리',
    title_en: 'Rather Than, I Would Rather',
    explanation:
      '느니 차라리 expresses preferring one undesirable option over another. It often sounds strong or dramatic.',
    examples: [
      {
        korean: '기다리느니 차라리 걸어가겠어요.',
        translation: 'Rather than wait, I would rather walk.',
      },
      {
        korean: '그걸 먹느니 차라리 굶겠어요.',
        translation: 'Rather than eat that, I would rather starve.',
      },
      {
        korean: '싸우느니 차라리 말 안 할래요.',
        translation: 'Rather than fight, I would rather not talk.',
      },
    ],
  },
  {
    id: 'lesson_adv_24',
    level: 'Advanced',
    sort_order: 24,
    title_ko: '다 보면',
    title_en: 'If You Keep Doing',
    explanation:
      '다 보면 means if you continue doing something, a result will naturally happen over time.',
    examples: [
      {
        korean: '계속 하다 보면 익숙해져요.',
        translation: 'If you keep doing it, you get used to it.',
      },
      {
        korean: '살다 보면 이런 일도 있어요.',
        translation: 'If you live long enough, things like this happen.',
      },
      {
        korean: '듣다 보면 이해돼요.',
        translation: 'If you keep listening, you will understand.',
      },
    ],
  },
  {
    id: 'lesson_adv_25',
    level: 'Advanced',
    sort_order: 25,
    title_ko: '곤 하다',
    title_en: 'Used To / Often Do',
    explanation:
      '곤 하다 describes repeated habits or things that often happened in the past or present.',
    examples: [
      {
        korean: '어릴 때 여기서 놀곤 했어요.',
        translation: 'I used to play here as a child.',
      },
      {
        korean: '주말마다 산책하곤 해요.',
        translation: 'I often take walks on weekends.',
      },
      {
        korean: '힘들 때 음악을 듣곤 해요.',
        translation: 'I often listen to music when things are hard.',
      },
    ],
  },
  {
    id: 'lesson_adv_26',
    level: 'Advanced',
    sort_order: 26,
    title_ko: '기 십상이다',
    title_en: 'Likely To / Prone To',
    explanation:
      '기 십상이다 means something is likely to happen, usually a negative or undesirable result.',
    examples: [
      {
        korean: '서두르면 실수하기 십상이에요.',
        translation: 'If you rush, you are likely to make mistakes.',
      },
      {
        korean: '밤새우면 아프기 십상이에요.',
        translation: 'If you stay up all night, you are likely to get sick.',
      },
      {
        korean: '준비 안 하면 실패하기 십상이에요.',
        translation: 'If you do not prepare, you are likely to fail.',
      },
    ],
  },
  {
    id: 'lesson_adv_27',
    level: 'Advanced',
    sort_order: 27,
    title_ko: '는 한',
    title_en: 'As Long As',
    explanation:
      '는 한 means “as long as” a condition holds. It often sets a firm condition or limitation.',
    examples: [
      {
        korean: '노력하는 한 가능성이 있어요.',
        translation: 'As long as you try, there is a possibility.',
      },
      {
        korean: '제가 아는 한 사실이에요.',
        translation: 'As far as I know, it is true.',
      },
      {
        korean: '살아 있는 한 포기하지 않을 거예요.',
        translation: 'As long as I am alive, I will not give up.',
      },
    ],
  },
  {
    id: 'lesson_adv_28',
    level: 'Advanced',
    sort_order: 28,
    title_ko: '다시피 하다',
    title_en: 'Practically / Almost',
    explanation:
      '다시피 하다 means something is practically or almost the case, though not literally exact.',
    examples: [
      {
        korean: '요즘 회사에서 살다시피 해요.',
        translation: 'These days I practically live at work.',
      },
      {
        korean: '매일 보다시피 해요.',
        translation: 'I see them almost every day.',
      },
      {
        korean: '거의 포기하다시피 했어요.',
        translation: 'I practically gave up.',
      },
    ],
  },
  {
    id: 'lesson_adv_29',
    level: 'Advanced',
    sort_order: 29,
    title_ko: '는 탓에',
    title_en: 'Because Of / Due To Blame',
    explanation:
      '는 탓에 gives a negative cause and often implies blame or fault.',
    examples: [
      {
        korean: '비가 많이 오는 탓에 길이 막혔어요.',
        translation: 'Because of the heavy rain, traffic was bad.',
      },
      {
        korean: '준비를 안 한 탓에 실패했어요.',
        translation: 'I failed because I did not prepare.',
      },
      {
        korean: '잠을 못 잔 탓에 피곤해요.',
        translation: 'I am tired because I could not sleep.',
      },
    ],
  },
  {
    id: 'lesson_adv_30',
    level: 'Advanced',
    sort_order: 30,
    title_ko: '듯하다',
    title_en: 'Seems / Appears',
    explanation:
      '듯하다 is a softer written or formal way to say something seems to be the case.',
    examples: [
      { korean: '비가 올 듯해요.', translation: 'It seems like it will rain.' },
      {
        korean: '그 말이 맞는 듯해요.',
        translation: 'That statement seems correct.',
      },
      {
        korean: '상황이 좋아진 듯해요.',
        translation: 'The situation seems to have improved.',
      },
    ],
  },
  {
    id: 'lesson_adv_31',
    level: 'Advanced',
    sort_order: 31,
    title_ko: '을지라도',
    title_en: 'Even If',
    explanation:
      '을지라도 means “even if.” It is formal and emphasizes that the following result remains true despite the condition.',
    examples: [
      {
        korean: '힘들지라도 포기하지 마세요.',
        translation: 'Even if it is hard, do not give up.',
      },
      {
        korean: '늦을지라도 꼭 갈게요.',
        translation: 'Even if I am late, I will definitely go.',
      },
      {
        korean: '실패할지라도 도전할 거예요.',
        translation: 'Even if I fail, I will try.',
      },
    ],
  },
  {
    id: 'lesson_adv_32',
    level: 'Advanced',
    sort_order: 32,
    title_ko: '다고 해서',
    title_en: 'Just Because',
    explanation:
      '다고 해서 means “just because…” and often denies an assumed conclusion.',
    examples: [
      {
        korean: '비싸다고 해서 좋은 건 아니에요.',
        translation: 'Just because it is expensive does not mean it is good.',
      },
      {
        korean: '어렵다고 해서 포기하면 안 돼요.',
        translation: 'You should not give up just because it is difficult.',
      },
      {
        korean: '친하다고 해서 다 말하면 안 돼요.',
        translation:
          'Just because you are close does not mean you should say everything.',
      },
    ],
  },
  {
    id: 'lesson_adv_33',
    level: 'Advanced',
    sort_order: 33,
    title_ko: '는 법이다',
    title_en: 'It Is Natural / The Way It Is',
    explanation: '는 법이다 states a general truth, rule, or natural tendency.',
    examples: [
      {
        korean: '사람은 누구나 실수하는 법이에요.',
        translation: 'Everyone makes mistakes.',
      },
      {
        korean: '시간이 지나면 잊히는 법이에요.',
        translation: 'Things naturally get forgotten with time.',
      },
      {
        korean: '노력하면 늘어나는 법이에요.',
        translation: 'If you put in effort, you naturally improve.',
      },
    ],
  },
  {
    id: 'lesson_adv_34',
    level: 'Advanced',
    sort_order: 34,
    title_ko: '치고는',
    title_en: 'For / Considering',
    explanation:
      '치고는 means “for” or “considering,” often showing something is different from expectations for that category.',
    examples: [
      {
        korean: '초보자치고는 잘해요.',
        translation: 'They are good for a beginner.',
      },
      {
        korean: '가격치고는 품질이 좋아요.',
        translation: 'The quality is good for the price.',
      },
      { korean: '겨울치고는 따뜻해요.', translation: 'It is warm for winter.' },
    ],
  },
  {
    id: 'lesson_adv_35',
    level: 'Advanced',
    sort_order: 35,
    title_ko: '는 대신에',
    title_en: 'Instead Of / In Exchange For',
    explanation:
      '는 대신에 means “instead of” or “in exchange for.” It can show replacement or compensation.',
    examples: [
      {
        korean: '커피 대신에 차를 마셨어요.',
        translation: 'I drank tea instead of coffee.',
      },
      {
        korean: '제가 도와주는 대신에 밥 사 주세요.',
        translation: 'Buy me food in exchange for helping you.',
      },
      {
        korean: '쉬는 대신에 공부했어요.',
        translation: 'I studied instead of resting.',
      },
    ],
  },
  {
    id: 'lesson_adv_36',
    level: 'Advanced',
    sort_order: 36,
    title_ko: '고자 하다',
    title_en: 'Intend To / For The Purpose Of',
    explanation:
      '고자 하다 is a formal way to express intention or purpose, common in speeches, writing, and applications.',
    examples: [
      {
        korean: '한국어를 배우고자 합니다.',
        translation: 'I intend to learn Korean.',
      },
      {
        korean: '문제를 해결하고자 노력했어요.',
        translation: 'I tried to solve the problem.',
      },
      {
        korean: '경험을 쌓고자 지원했습니다.',
        translation: 'I applied to gain experience.',
      },
    ],
  },
  {
    id: 'lesson_adv_37',
    level: 'Advanced',
    sort_order: 37,
    title_ko: '기에 망정이지',
    title_en: 'It Is A Relief That',
    explanation:
      '기에 망정이지 means it is fortunate that something happened; otherwise a worse result could have occurred.',
    examples: [
      {
        korean: '일찍 왔기에 망정이지 늦을 뻔했어요.',
        translation: 'It is a relief I came early; I almost was late.',
      },
      {
        korean: '네가 도와줬기에 망정이지 큰일 날 뻔했어요.',
        translation: 'It is a relief you helped; things could have gone badly.',
      },
      {
        korean: '비가 그쳤기에 망정이지 못 갈 뻔했어요.',
        translation: 'It is a relief the rain stopped; I almost could not go.',
      },
    ],
  },
  {
    id: 'lesson_adv_38',
    level: 'Advanced',
    sort_order: 38,
    title_ko: '는 둥 마는 둥',
    title_en: 'Barely / Half-heartedly',
    explanation:
      '는 둥 마는 둥 means doing something barely, half-heartedly, or without properly finishing it.',
    examples: [
      { korean: '밥을 먹는 둥 마는 둥 했어요.', translation: 'I barely ate.' },
      {
        korean: '공부를 하는 둥 마는 둥 했어요.',
        translation: 'I studied half-heartedly.',
      },
      {
        korean: '대답을 하는 둥 마는 둥 했어요.',
        translation: 'They barely answered.',
      },
    ],
  },
  {
    id: 'lesson_adv_39',
    level: 'Advanced',
    sort_order: 39,
    title_ko: '을까 봐',
    title_en: 'Worried That / In Case',
    explanation:
      '을까 봐 expresses worry about a possible result or doing something just in case.',
    examples: [
      {
        korean: '늦을까 봐 택시를 탔어요.',
        translation: 'I took a taxi because I was worried I would be late.',
      },
      {
        korean: '비가 올까 봐 우산을 가져왔어요.',
        translation: 'I brought an umbrella in case it rains.',
      },
      {
        korean: '잊어버릴까 봐 적어 두었어요.',
        translation: 'I wrote it down in case I forget.',
      },
    ],
  },
  {
    id: 'lesson_adv_40',
    level: 'Advanced',
    sort_order: 40,
    title_ko: '고 말다',
    title_en: 'End Up Doing',
    explanation:
      '고 말다 expresses that something ended up happening, often with regret or strong emotion.',
    examples: [
      { korean: '결국 울고 말았어요.', translation: 'I ended up crying.' },
      {
        korean: '약속을 잊고 말았어요.',
        translation: 'I ended up forgetting the appointment.',
      },
      {
        korean: '참다가 화를 내고 말았어요.',
        translation: 'I held it in but ended up getting angry.',
      },
    ],
  },
];

module.exports = { grammarLessons };
