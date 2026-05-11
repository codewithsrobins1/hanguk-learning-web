const grammarQuestions = [
  // ── Beginner ────────────────────────────────────────────────
  // lesson_beg_1: 이에요/예요
  { id: 'gq_beg_1_1', lesson_id: 'lesson_beg_1', sort_order: 1, prompt: '저는 학생___. (I am a student.)', options: ['이에요', '예요', '있어요', '아니에요'], answer_index: 0 },
  { id: 'gq_beg_1_2', lesson_id: 'lesson_beg_1', sort_order: 2, prompt: '이것은 사과___. (This is an apple.)', options: ['이에요', '예요', '없어요', '가요'], answer_index: 1 },
  { id: 'gq_beg_1_3', lesson_id: 'lesson_beg_1', sort_order: 3, prompt: '저는 의사___. (I am a doctor.)', options: ['예요', '이에요', '있어요', '해요'], answer_index: 1 },
  { id: 'gq_beg_1_4', lesson_id: 'lesson_beg_1', sort_order: 4, prompt: '이것은 책___. (This is a book.)', options: ['예요', '이에요', '없어요', '가요'], answer_index: 1 },

  // lesson_beg_2: 은/는
  { id: 'gq_beg_2_1', lesson_id: 'lesson_beg_2', sort_order: 1, prompt: '저___ 커피를 좋아해요. (As for me, I like coffee.)', options: ['는', '은', '이', '가'], answer_index: 0 },
  { id: 'gq_beg_2_2', lesson_id: 'lesson_beg_2', sort_order: 2, prompt: '날씨___ 맑아요. (The weather is clear.)', options: ['는', '은', '를', '도'], answer_index: 1 },
  { id: 'gq_beg_2_3', lesson_id: 'lesson_beg_2', sort_order: 3, prompt: '이 책___ 재미있어요. (This book is interesting.)', options: ['은', '는', '이', '가'], answer_index: 0 },
  { id: 'gq_beg_2_4', lesson_id: 'lesson_beg_2', sort_order: 4, prompt: '오빠___ 회사원이에요. (My older brother is an office worker.)', options: ['는', '은', '가', '를'], answer_index: 0 },

  // lesson_beg_3: 이/가
  { id: 'gq_beg_3_1', lesson_id: 'lesson_beg_3', sort_order: 1, prompt: '비___ 와요. (It is raining.)', options: ['가', '이', '는', '를'], answer_index: 0 },
  { id: 'gq_beg_3_2', lesson_id: 'lesson_beg_3', sort_order: 2, prompt: '친구___ 왔어요. (A friend came.)', options: ['가', '이', '는', '도'], answer_index: 0 },
  { id: 'gq_beg_3_3', lesson_id: 'lesson_beg_3', sort_order: 3, prompt: '밥___ 맛있어요. (The food is delicious.)', options: ['이', '가', '를', '은'], answer_index: 0 },
  { id: 'gq_beg_3_4', lesson_id: 'lesson_beg_3', sort_order: 4, prompt: '고양이___ 귀여워요. (The cat is cute.)', options: ['가', '이', '는', '를'], answer_index: 0 },

  // lesson_beg_4: 을/를
  { id: 'gq_beg_4_1', lesson_id: 'lesson_beg_4', sort_order: 1, prompt: '밥___ 먹어요. (I eat rice.)', options: ['을', '를', '이', '가'], answer_index: 0 },
  { id: 'gq_beg_4_2', lesson_id: 'lesson_beg_4', sort_order: 2, prompt: '음악___ 들어요. (I listen to music.)', options: ['을', '를', '은', '는'], answer_index: 1 },
  { id: 'gq_beg_4_3', lesson_id: 'lesson_beg_4', sort_order: 3, prompt: '커피___ 마셔요. (I drink coffee.)', options: ['를', '을', '도', '가'], answer_index: 0 },
  { id: 'gq_beg_4_4', lesson_id: 'lesson_beg_4', sort_order: 4, prompt: '책___ 읽어요. (I read a book.)', options: ['을', '를', '이', '에'], answer_index: 0 },

  // lesson_beg_5: 있어요/없어요
  { id: 'gq_beg_5_1', lesson_id: 'lesson_beg_5', sort_order: 1, prompt: '시간이 ___? (Do you have time?)', options: ['있어요', '없어요', '이에요', '아니에요'], answer_index: 0 },
  { id: 'gq_beg_5_2', lesson_id: 'lesson_beg_5', sort_order: 2, prompt: '돈이 ___. (I have no money.)', options: ['없어요', '있어요', '아니에요', '이에요'], answer_index: 0 },
  { id: 'gq_beg_5_3', lesson_id: 'lesson_beg_5', sort_order: 3, prompt: '오늘 약속이 ___. (I have plans today.)', options: ['있어요', '없어요', '예요', '가요'], answer_index: 0 },
  { id: 'gq_beg_5_4', lesson_id: 'lesson_beg_5', sort_order: 4, prompt: '질문이 ___? (Do you have questions?)', options: ['있어요', '없어요', '이에요', '해요'], answer_index: 0 },

  // lesson_beg_6: 아니에요
  { id: 'gq_beg_6_1', lesson_id: 'lesson_beg_6', sort_order: 1, prompt: '저는 선생님이 ___. (I am not a teacher.)', options: ['아니에요', '없어요', '이에요', '안 해요'], answer_index: 0 },
  { id: 'gq_beg_6_2', lesson_id: 'lesson_beg_6', sort_order: 2, prompt: '이것은 커피가 ___. (This is not coffee.)', options: ['아니에요', '없어요', '예요', '가요'], answer_index: 0 },
  { id: 'gq_beg_6_3', lesson_id: 'lesson_beg_6', sort_order: 3, prompt: '저는 일본 사람이 ___. (I am not Japanese.)', options: ['아니에요', '없어요', '이에요', '안 가요'], answer_index: 0 },
  { id: 'gq_beg_6_4', lesson_id: 'lesson_beg_6', sort_order: 4, prompt: '그것은 제 가방이 ___. (That is not my bag.)', options: ['아니에요', '없어요', '이에요', '예요'], answer_index: 0 },

  // lesson_beg_7: 아/어요
  { id: 'gq_beg_7_1', lesson_id: 'lesson_beg_7', sort_order: 1, prompt: '저는 공부___. (I study.)', options: ['해요', '했어요', '할 거예요', '하고 싶어요'], answer_index: 0 },
  { id: 'gq_beg_7_2', lesson_id: 'lesson_beg_7', sort_order: 2, prompt: '친구를 ___. (I meet a friend.) 만나-', options: ['만나요', '만났어요', '만날 거예요', '만나고 싶어요'], answer_index: 0 },
  { id: 'gq_beg_7_3', lesson_id: 'lesson_beg_7', sort_order: 3, prompt: '커피를 ___. (I drink coffee.) 마시-', options: ['마셔요', '마셨어요', '마실 거예요', '마시고 싶어요'], answer_index: 0 },
  { id: 'gq_beg_7_4', lesson_id: 'lesson_beg_7', sort_order: 4, prompt: '음악을 ___. (I listen to music.) 듣-', options: ['들어요', '들었어요', '들을 거예요', '듣고 싶어요'], answer_index: 0 },

  // lesson_beg_8: 았/었어요
  { id: 'gq_beg_8_1', lesson_id: 'lesson_beg_8', sort_order: 1, prompt: '어제 밥을 ___. (I ate yesterday.) 먹-', options: ['먹었어요', '먹어요', '먹을 거예요', '먹고 싶어요'], answer_index: 0 },
  { id: 'gq_beg_8_2', lesson_id: 'lesson_beg_8', sort_order: 2, prompt: '한국에 ___. (I went to Korea.) 가-', options: ['갔어요', '가요', '갈 거예요', '가고 싶어요'], answer_index: 0 },
  { id: 'gq_beg_8_3', lesson_id: 'lesson_beg_8', sort_order: 3, prompt: '친구를 ___. (I met a friend.) 만나-', options: ['만났어요', '만나요', '만날 거예요', '만나고 싶어요'], answer_index: 0 },
  { id: 'gq_beg_8_4', lesson_id: 'lesson_beg_8', sort_order: 4, prompt: '공부를 ___. (I studied.) 하-', options: ['했어요', '해요', '할 거예요', '하고 싶어요'], answer_index: 0 },

  // lesson_beg_9: ㄹ/을 거예요
  { id: 'gq_beg_9_1', lesson_id: 'lesson_beg_9', sort_order: 1, prompt: '내일 ___. (I will go tomorrow.) 가-', options: ['갈 거예요', '가요', '갔어요', '가고 싶어요'], answer_index: 0 },
  { id: 'gq_beg_9_2', lesson_id: 'lesson_beg_9', sort_order: 2, prompt: '비가 ___. (It will rain.) 오-', options: ['올 거예요', '와요', '왔어요', '오고 싶어요'], answer_index: 0 },
  { id: 'gq_beg_9_3', lesson_id: 'lesson_beg_9', sort_order: 3, prompt: '내일 공부___. (I will study tomorrow.) 하-', options: ['할 거예요', '해요', '했어요', '하고 싶어요'], answer_index: 0 },
  { id: 'gq_beg_9_4', lesson_id: 'lesson_beg_9', sort_order: 4, prompt: '이따가 전화___. (I will call later.) 하-', options: ['할 거예요', '해요', '했어요', '하지만'], answer_index: 0 },

  // lesson_beg_10: 하고/와/과
  { id: 'gq_beg_10_1', lesson_id: 'lesson_beg_10', sort_order: 1, prompt: '커피___ 케이크를 주세요. (Coffee and cake, please.)', options: ['하고', '와', '과', '도'], answer_index: 0 },
  { id: 'gq_beg_10_2', lesson_id: 'lesson_beg_10', sort_order: 2, prompt: '사과___ 바나나가 있어요. (There are apples and bananas.) — formal', options: ['와', '하고', '과', '도'], answer_index: 0 },
  { id: 'gq_beg_10_3', lesson_id: 'lesson_beg_10', sort_order: 3, prompt: '밥___ 국을 먹어요. (I eat rice and soup.)', options: ['하고', '와', '과', '에서'], answer_index: 0 },
  { id: 'gq_beg_10_4', lesson_id: 'lesson_beg_10', sort_order: 4, prompt: '책___ 펜이 있어요. (There is a book and a pen.) — formal', options: ['과', '하고', '와', '도'], answer_index: 0 },

  // lesson_beg_11: 주세요
  { id: 'gq_beg_11_1', lesson_id: 'lesson_beg_11', sort_order: 1, prompt: '물 ___. (Water, please.)', options: ['주세요', '줘요', '있어요', '가세요'], answer_index: 0 },
  { id: 'gq_beg_11_2', lesson_id: 'lesson_beg_11', sort_order: 2, prompt: '천천히 말해 ___. (Please speak slowly.)', options: ['주세요', '줘요', '해요', '봐요'], answer_index: 0 },
  { id: 'gq_beg_11_3', lesson_id: 'lesson_beg_11', sort_order: 3, prompt: '메뉴판 ___. (Please give me the menu.)', options: ['주세요', '주고 싶어요', '있어요', '봐요'], answer_index: 0 },
  { id: 'gq_beg_11_4', lesson_id: 'lesson_beg_11', sort_order: 4, prompt: '창문 열어 ___. (Please open the window.)', options: ['주세요', '줘요', '봐요', '가세요'], answer_index: 0 },

  // lesson_beg_12: 고 싶어요
  { id: 'gq_beg_12_1', lesson_id: 'lesson_beg_12', sort_order: 1, prompt: '한국에 가___ 싶어요. (I want to go to Korea.)', options: ['고', '서', '지만', '면서'], answer_index: 0 },
  { id: 'gq_beg_12_2', lesson_id: 'lesson_beg_12', sort_order: 2, prompt: '라면을 먹___ 싶어요. (I want to eat ramen.)', options: ['고', '어서', '지만', '도'], answer_index: 0 },
  { id: 'gq_beg_12_3', lesson_id: 'lesson_beg_12', sort_order: 3, prompt: '쉬___ 싶어요. (I want to rest.)', options: ['고', '어서', '면서', '지만'], answer_index: 0 },
  { id: 'gq_beg_12_4', lesson_id: 'lesson_beg_12', sort_order: 4, prompt: '자___ 싶어요. (I want to sleep.)', options: ['고', '서', '지만', '도'], answer_index: 0 },

  // lesson_beg_13: 안
  { id: 'gq_beg_13_1', lesson_id: 'lesson_beg_13', sort_order: 1, prompt: '저는 고기를 ___ 먹어요. (I do not eat meat.)', options: ['안', '못', '아직', '잘'], answer_index: 0 },
  { id: 'gq_beg_13_2', lesson_id: 'lesson_beg_13', sort_order: 2, prompt: '오늘은 ___ 바빠요. (I am not busy today.)', options: ['안', '못', '아직', '더'], answer_index: 0 },
  { id: 'gq_beg_13_3', lesson_id: 'lesson_beg_13', sort_order: 3, prompt: '술을 ___ 마셔요. (I do not drink alcohol.)', options: ['안', '못', '잘', '더'], answer_index: 0 },
  { id: 'gq_beg_13_4', lesson_id: 'lesson_beg_13', sort_order: 4, prompt: '저는 공부 ___ 해요. (I do not study.) — 하다 verb', options: ['안', '못', '아직', '잘'], answer_index: 0 },

  // lesson_beg_14: 못
  { id: 'gq_beg_14_1', lesson_id: 'lesson_beg_14', sort_order: 1, prompt: '오늘 ___ 가요. (I cannot go today.)', options: ['못', '안', '잘', '더'], answer_index: 0 },
  { id: 'gq_beg_14_2', lesson_id: 'lesson_beg_14', sort_order: 2, prompt: '매운 음식을 ___ 먹어요. (I cannot eat spicy food.)', options: ['못', '안', '아직', '잘'], answer_index: 0 },
  { id: 'gq_beg_14_3', lesson_id: 'lesson_beg_14', sort_order: 3, prompt: '한국어를 잘 ___ 해요. (I cannot speak Korean well.)', options: ['못', '안', '더', '잘'], answer_index: 0 },
  { id: 'gq_beg_14_4', lesson_id: 'lesson_beg_14', sort_order: 4, prompt: '어제 잠을 ___ 잤어요. (I could not sleep yesterday.)', options: ['못', '안', '아직', '잘'], answer_index: 0 },

  // lesson_beg_15: question words
  { id: 'gq_beg_15_1', lesson_id: 'lesson_beg_15', sort_order: 1, prompt: '지금 ___에 있어요? (Where are you now?)', options: ['어디', '뭐', '누구', '언제'], answer_index: 0 },
  { id: 'gq_beg_15_2', lesson_id: 'lesson_beg_15', sort_order: 2, prompt: '___ 먹고 싶어요? (What do you want to eat?)', options: ['뭐', '어디', '누구', '언제'], answer_index: 0 },
  { id: 'gq_beg_15_3', lesson_id: 'lesson_beg_15', sort_order: 3, prompt: '___ 한국에 가요? (When are you going to Korea?)', options: ['언제', '어디', '뭐', '누구'], answer_index: 0 },
  { id: 'gq_beg_15_4', lesson_id: 'lesson_beg_15', sort_order: 4, prompt: '이거 ___ 거예요? (Whose is this?)', options: ['누구', '어디', '뭐', '언제'], answer_index: 0 },

  // lesson_beg_16: 에/에서
  { id: 'gq_beg_16_1', lesson_id: 'lesson_beg_16', sort_order: 1, prompt: '학교___ 가요. (I go to school.) — destination', options: ['에', '에서', '한테', '으로'], answer_index: 0 },
  { id: 'gq_beg_16_2', lesson_id: 'lesson_beg_16', sort_order: 2, prompt: '도서관___ 공부해요. (I study at the library.) — action location', options: ['에서', '에', '한테', '으로'], answer_index: 0 },
  { id: 'gq_beg_16_3', lesson_id: 'lesson_beg_16', sort_order: 3, prompt: '서울___ 왔어요. (I came from Seoul.)', options: ['에서', '에', '한테', '까지'], answer_index: 0 },
  { id: 'gq_beg_16_4', lesson_id: 'lesson_beg_16', sort_order: 4, prompt: '카페___ 친구를 만났어요. (I met a friend at the café.)', options: ['에서', '에', '한테', '으로'], answer_index: 0 },

  // lesson_beg_17: 한테/에게
  { id: 'gq_beg_17_1', lesson_id: 'lesson_beg_17', sort_order: 1, prompt: '친구___ 선물을 줬어요. (I gave a gift to my friend.) — casual', options: ['한테', '에게', '에서', '에'], answer_index: 0 },
  { id: 'gq_beg_17_2', lesson_id: 'lesson_beg_17', sort_order: 2, prompt: '선생님___ 물어봤어요. (I asked the teacher.) — formal', options: ['에게', '한테', '에서', '에'], answer_index: 0 },
  { id: 'gq_beg_17_3', lesson_id: 'lesson_beg_17', sort_order: 3, prompt: '엄마___ 전화했어요. (I called my mom.) — casual', options: ['한테', '에게', '에서', '에'], answer_index: 0 },
  { id: 'gq_beg_17_4', lesson_id: 'lesson_beg_17', sort_order: 4, prompt: '동생___ 용돈을 줬어요. (I gave my sibling allowance.) — casual', options: ['한테', '에게', '에서', '가'], answer_index: 0 },

  // lesson_beg_18: 도
  { id: 'gq_beg_18_1', lesson_id: 'lesson_beg_18', sort_order: 1, prompt: '저___ 가고 싶어요. (I also want to go.)', options: ['도', '는', '가', '를'], answer_index: 0 },
  { id: 'gq_beg_18_2', lesson_id: 'lesson_beg_18', sort_order: 2, prompt: '커피___ 주세요. (Coffee too, please.)', options: ['도', '를', '가', '는'], answer_index: 0 },
  { id: 'gq_beg_18_3', lesson_id: 'lesson_beg_18', sort_order: 3, prompt: '한국어___ 공부해요. (I also study Korean.)', options: ['도', '를', '이', '가'], answer_index: 0 },
  { id: 'gq_beg_18_4', lesson_id: 'lesson_beg_18', sort_order: 4, prompt: '동생___ 왔어요. (My sibling also came.)', options: ['도', '가', '는', '를'], answer_index: 0 },

  // lesson_beg_19: numbers + counters
  { id: 'gq_beg_19_1', lesson_id: 'lesson_beg_19', sort_order: 1, prompt: '사과 ___ 개 주세요. (Two apples, please.) — native number', options: ['두', '이', '삼', '사'], answer_index: 0 },
  { id: 'gq_beg_19_2', lesson_id: 'lesson_beg_19', sort_order: 2, prompt: '커피 ___ 잔 주세요. (One coffee, please.) — native number', options: ['한', '일', '두', '이'], answer_index: 0 },
  { id: 'gq_beg_19_3', lesson_id: 'lesson_beg_19', sort_order: 3, prompt: '오늘은 ___ 월 십오일이에요. (Today is March 15.) — sino number', options: ['삼', '셋', '세', '서'], answer_index: 0 },
  { id: 'gq_beg_19_4', lesson_id: 'lesson_beg_19', sort_order: 4, prompt: '학생이 ___ 명 있어요. (There are three students.) — native number', options: ['세', '삼', '사', '넷'], answer_index: 0 },

  // lesson_beg_20: polite requests
  { id: 'gq_beg_20_1', lesson_id: 'lesson_beg_20', sort_order: 1, prompt: '창문 닫아 ___. (Please close the window.) — basic polite', options: ['주세요', '줄 수 있어요?', '봐요', '가세요'], answer_index: 0 },
  { id: 'gq_beg_20_2', lesson_id: 'lesson_beg_20', sort_order: 2, prompt: '도와___ 수 있어요? (Can you help me?) — softer request', options: ['줄', '주세요', '봐', '가'], answer_index: 0 },
  { id: 'gq_beg_20_3', lesson_id: 'lesson_beg_20', sort_order: 3, prompt: '좀 더 크게 말해 줄 ___ 있어요? (Can you speak louder?)', options: ['수', '고', '서', '도'], answer_index: 0 },
  { id: 'gq_beg_20_4', lesson_id: 'lesson_beg_20', sort_order: 4, prompt: '설명해 ___. (Please explain it to me.) — basic polite', options: ['주세요', '줄 수 있어요?', '봐요', '봐주세요'], answer_index: 0 },

  // ── Intermediate ────────────────────────────────────────────
  // lesson_int_1: 고 싶다 vs 고 싶어요
  { id: 'gq_int_1_1', lesson_id: 'lesson_int_1', sort_order: 1, prompt: '피자가 먹고 ___. (I want to eat pizza.) — plain/diary form', options: ['싶다', '싶어요', '싶었어요', '싶지만'], answer_index: 0 },
  { id: 'gq_int_1_2', lesson_id: 'lesson_int_1', sort_order: 2, prompt: '여행을 가고 ___. (I want to travel.) — polite spoken', options: ['싶어요', '싶다', '싶었어요', '싶지만'], answer_index: 0 },
  { id: 'gq_int_1_3', lesson_id: 'lesson_int_1', sort_order: 3, prompt: '집에 가고 ___. (I wanted to go home.) — polite past', options: ['싶었어요', '싶어요', '싶다', '싶지만'], answer_index: 0 },
  { id: 'gq_int_1_4', lesson_id: 'lesson_int_1', sort_order: 4, prompt: '쉬고 ___. (I want to rest.) — polite spoken', options: ['싶어요', '싶다', '싶었다', '싶지만'], answer_index: 0 },

  // lesson_int_2: 아/어서
  { id: 'gq_int_2_1', lesson_id: 'lesson_int_2', sort_order: 1, prompt: '배가 아파___ 못 갔어요. (I could not go because my stomach hurt.)', options: ['서', '지만', '면서', '고'], answer_index: 0 },
  { id: 'gq_int_2_2', lesson_id: 'lesson_int_2', sort_order: 2, prompt: '늦어___ 미안해요. (I am sorry for being late.)', options: ['서', '지만', '도', '고'], answer_index: 0 },
  { id: 'gq_int_2_3', lesson_id: 'lesson_int_2', sort_order: 3, prompt: '씻어___ 잤어요. (I washed up and then slept.)', options: ['서', '지만', '면서', '도'], answer_index: 0 },
  { id: 'gq_int_2_4', lesson_id: 'lesson_int_2', sort_order: 4, prompt: '피곤해___ 쉬었어요. (I was tired so I rested.)', options: ['서', '지만', '도', '면서'], answer_index: 0 },

  // lesson_int_3: 지만
  { id: 'gq_int_3_1', lesson_id: 'lesson_int_3', sort_order: 1, prompt: '비가 오___  나가야 해요. (It is raining but I must go out.)', options: ['지만', '어서', '면서', '고'], answer_index: 0 },
  { id: 'gq_int_3_2', lesson_id: 'lesson_int_3', sort_order: 2, prompt: '맛있___ 너무 비싸요. (It is delicious but too expensive.)', options: ['지만', '어서', '면서', '고'], answer_index: 0 },
  { id: 'gq_int_3_3', lesson_id: 'lesson_int_3', sort_order: 3, prompt: '피곤하___ 공부해요. (I am tired but I study.)', options: ['지만', '어서', '면서', '도'], answer_index: 0 },
  { id: 'gq_int_3_4', lesson_id: 'lesson_int_3', sort_order: 4, prompt: '알___ 말하기 어려워요. (I know but it is hard to say.)', options: ['지만', '어서', '면서', '고'], answer_index: 0 },

  // lesson_int_4: 으면서
  { id: 'gq_int_4_1', lesson_id: 'lesson_int_4', sort_order: 1, prompt: '음악을 들으___ 공부해요. (I study while listening to music.)', options: ['면서', '지만', '어서', '고'], answer_index: 0 },
  { id: 'gq_int_4_2', lesson_id: 'lesson_int_4', sort_order: 2, prompt: '걸으___ 전화했어요. (I talked on the phone while walking.)', options: ['면서', '지만', '어서', '도'], answer_index: 0 },
  { id: 'gq_int_4_3', lesson_id: 'lesson_int_4', sort_order: 3, prompt: '밥을 먹으___ TV를 봐요. (I watch TV while eating.)', options: ['면서', '지만', '어서', '고'], answer_index: 0 },
  { id: 'gq_int_4_4', lesson_id: 'lesson_int_4', sort_order: 4, prompt: '노래를 부르___ 춤을 춰요. (I dance while singing.)', options: ['면서', '지만', '어서', '도'], answer_index: 0 },

  // lesson_int_5: 아/어도 돼요
  { id: 'gq_int_5_1', lesson_id: 'lesson_int_5', sort_order: 1, prompt: '여기 앉아___ 돼요? (May I sit here?)', options: ['도', '서', '지만', '면서'], answer_index: 0 },
  { id: 'gq_int_5_2', lesson_id: 'lesson_int_5', sort_order: 2, prompt: '사진 찍어도 ___. (You may take photos.)', options: ['돼요', '안 돼요', '싶어요', '주세요'], answer_index: 0 },
  { id: 'gq_int_5_3', lesson_id: 'lesson_int_5', sort_order: 3, prompt: '나중에 해___ 돼요. (It is okay to do it later.)', options: ['도', '서', '지만', '면서'], answer_index: 0 },
  { id: 'gq_int_5_4', lesson_id: 'lesson_int_5', sort_order: 4, prompt: '한국어로 말해___ 돼요? (Is it okay to speak in Korean?)', options: ['도', '서', '지만', '고'], answer_index: 0 },

  // lesson_int_6: 으면 안 돼요
  { id: 'gq_int_6_1', lesson_id: 'lesson_int_6', sort_order: 1, prompt: '여기서 담배를 피우___ 안 돼요. (You must not smoke here.)', options: ['면', '어서', '지만', '면서'], answer_index: 0 },
  { id: 'gq_int_6_2', lesson_id: 'lesson_int_6', sort_order: 2, prompt: '늦으면 ___. (You should not be late.)', options: ['안 돼요', '돼요', '싶어요', '봐요'], answer_index: 0 },
  { id: 'gq_int_6_3', lesson_id: 'lesson_int_6', sort_order: 3, prompt: '거짓말하___ 안 돼요. (You must not lie.)', options: ['면', '어서', '지만', '고'], answer_index: 0 },
  { id: 'gq_int_6_4', lesson_id: 'lesson_int_6', sort_order: 4, prompt: '여기서 뛰___ 안 돼요. (You must not run here.)', options: ['면', '어서', '지만', '도'], answer_index: 0 },

  // lesson_int_7: 으려고 하다
  { id: 'gq_int_7_1', lesson_id: 'lesson_int_7', sort_order: 1, prompt: '내년에 한국에 가___ 해요. (I am planning to go to Korea next year.)', options: ['려고', '고 싶어', '어서', '지만'], answer_index: 0 },
  { id: 'gq_int_7_2', lesson_id: 'lesson_int_7', sort_order: 2, prompt: '다이어트를 하려고 ___. (I am planning to diet.)', options: ['해요', '싶어요', '봐요', '돼요'], answer_index: 0 },
  { id: 'gq_int_7_3', lesson_id: 'lesson_int_7', sort_order: 3, prompt: '지금 자___ 했어요. (I was about to sleep.)', options: ['려고', '고 싶어', '어서', '면서'], answer_index: 0 },
  { id: 'gq_int_7_4', lesson_id: 'lesson_int_7', sort_order: 4, prompt: '책을 읽으___ 해요. (I am planning to read a book.)', options: ['려고', '고 싶어', '어서', '지만'], answer_index: 0 },

  // lesson_int_8: 아/어 보다
  { id: 'gq_int_8_1', lesson_id: 'lesson_int_8', sort_order: 1, prompt: '김치를 먹어 ___? (Have you tried eating kimchi?)', options: ['봤어요', '싶어요', '봐요', '줘요'], answer_index: 0 },
  { id: 'gq_int_8_2', lesson_id: 'lesson_int_8', sort_order: 2, prompt: '한번 해 ___! (Try it once!)', options: ['봐요', '봤어요', '줘요', '싶어요'], answer_index: 0 },
  { id: 'gq_int_8_3', lesson_id: 'lesson_int_8', sort_order: 3, prompt: '이 옷 입어 ___. (Try wearing these clothes.)', options: ['봐요', '봤어요', '줘요', '싶어요'], answer_index: 0 },
  { id: 'gq_int_8_4', lesson_id: 'lesson_int_8', sort_order: 4, prompt: '이 음식 만들어 ___? (Have you tried making this food?)', options: ['봤어요', '봐요', '줬어요', '싶어요'], answer_index: 0 },

  // lesson_int_9: 는 것 같다
  { id: 'gq_int_9_1', lesson_id: 'lesson_int_9', sort_order: 1, prompt: '비가 올 것 ___. (It seems like it will rain.)', options: ['같아요', '봐요', '싶어요', '돼요'], answer_index: 0 },
  { id: 'gq_int_9_2', lesson_id: 'lesson_int_9', sort_order: 2, prompt: '그 사람이 화난 것 ___. (That person seems angry.)', options: ['같아요', '봐요', '싶어요', '돼요'], answer_index: 0 },
  { id: 'gq_int_9_3', lesson_id: 'lesson_int_9', sort_order: 3, prompt: '맛있는 것 ___. (It seems delicious.)', options: ['같아요', '봐요', '싶어요', '돼요'], answer_index: 0 },
  { id: 'gq_int_9_4', lesson_id: 'lesson_int_9', sort_order: 4, prompt: '힘든 것 ___. (It seems difficult.)', options: ['같아요', '봐요', '싶어요', '해요'], answer_index: 0 },

  // lesson_int_10: 은/ㄴ 적이 있다
  { id: 'gq_int_10_1', lesson_id: 'lesson_int_10', sort_order: 1, prompt: '한국에 간 ___ 있어요? (Have you ever been to Korea?)', options: ['적이', '것이', '중이', '편이'], answer_index: 0 },
  { id: 'gq_int_10_2', lesson_id: 'lesson_int_10', sort_order: 2, prompt: '번지 점프를 해 본 적이 ___. (I have never tried bungee jumping.)', options: ['없어요', '있어요', '싶어요', '봐요'], answer_index: 0 },
  { id: 'gq_int_10_3', lesson_id: 'lesson_int_10', sort_order: 3, prompt: '그 영화를 본 ___ 있어요. (I have seen that movie.)', options: ['적이', '것이', '중이', '편이'], answer_index: 0 },
  { id: 'gq_int_10_4', lesson_id: 'lesson_int_10', sort_order: 4, prompt: '한국 음식을 먹은 ___ 있어요? (Have you ever eaten Korean food?)', options: ['적이', '것이', '중이', '편이'], answer_index: 0 },

  // lesson_int_11: 으니까
  { id: 'gq_int_11_1', lesson_id: 'lesson_int_11', sort_order: 1, prompt: '비가 오___ 우산 챙기세요. (Since it is raining, bring an umbrella.)', options: ['니까', '어서', '지만', '면서'], answer_index: 0 },
  { id: 'gq_int_11_2', lesson_id: 'lesson_int_11', sort_order: 2, prompt: '맛있으___ 먹어 봐요. (Since it is delicious, try it.)', options: ['니까', '어서', '지만', '면서'], answer_index: 0 },
  { id: 'gq_int_11_3', lesson_id: 'lesson_int_11', sort_order: 3, prompt: '늦었으___ 빨리 가요. (Since we are late, let us hurry.)', options: ['니까', '어서', '지만', '면서'], answer_index: 0 },
  { id: 'gq_int_11_4', lesson_id: 'lesson_int_11', sort_order: 4, prompt: '추우___ 따뜻하게 입으세요. (Since it is cold, dress warmly.)', options: ['니까', '어서', '지만', '면서'], answer_index: 0 },

  // lesson_int_12: 거든요
  { id: 'gq_int_12_1', lesson_id: 'lesson_int_12', sort_order: 1, prompt: '저 사실 한국어 공부 중이___. (Actually I am studying Korean, you see.)', options: ['거든요', '잖아요', '네요', '지만'], answer_index: 0 },
  { id: 'gq_int_12_2', lesson_id: 'lesson_int_12', sort_order: 2, prompt: '그 사람이 제 친구___. (That person is my friend, you see.)', options: ['거든요', '잖아요', '네요', '지만'], answer_index: 0 },
  { id: 'gq_int_12_3', lesson_id: 'lesson_int_12', sort_order: 3, prompt: '저 요즘 많이 바쁘___. (I have been really busy lately, you see.)', options: ['거든요', '잖아요', '네요', '지만'], answer_index: 0 },
  { id: 'gq_int_12_4', lesson_id: 'lesson_int_12', sort_order: 4, prompt: '제가 거기 살았___. (I used to live there, you see.)', options: ['거든요', '잖아요', '네요', '지만'], answer_index: 0 },

  // lesson_int_13: 네요
  { id: 'gq_int_13_1', lesson_id: 'lesson_int_13', sort_order: 1, prompt: '정말 맛있___! (This is really delicious — realization!)', options: ['네요', '거든요', '잖아요', '지만'], answer_index: 0 },
  { id: 'gq_int_13_2', lesson_id: 'lesson_int_13', sort_order: 2, prompt: '날씨가 좋___. (Oh, the weather is nice.)', options: ['네요', '거든요', '잖아요', '어서'], answer_index: 0 },
  { id: 'gq_int_13_3', lesson_id: 'lesson_int_13', sort_order: 3, prompt: '한국어를 잘 하시___. (Oh, you speak Korean well.)', options: ['네요', '거든요', '잖아요', '지만'], answer_index: 0 },
  { id: 'gq_int_13_4', lesson_id: 'lesson_int_13', sort_order: 4, prompt: '벌써 왔___. (Oh, you are already here.)', options: ['네요', '거든요', '잖아요', '어서'], answer_index: 0 },

  // lesson_int_14: 잖아요
  { id: 'gq_int_14_1', lesson_id: 'lesson_int_14', sort_order: 1, prompt: '저 채식주의자___. (You know I am vegetarian.)', options: ['잖아요', '거든요', '네요', '지만'], answer_index: 0 },
  { id: 'gq_int_14_2', lesson_id: 'lesson_int_14', sort_order: 2, prompt: '내일 시험이___. (You know the exam is tomorrow.)', options: ['잖아요', '거든요', '네요', '어서'], answer_index: 0 },
  { id: 'gq_int_14_3', lesson_id: 'lesson_int_14', sort_order: 3, prompt: '그 사람이 유명하___. (That person is famous, you know.)', options: ['잖아요', '거든요', '네요', '지만'], answer_index: 0 },
  { id: 'gq_int_14_4', lesson_id: 'lesson_int_14', sort_order: 4, prompt: '우리 친구___. (We are friends, you know.)', options: ['잖아요', '거든요', '네요', '어서'], answer_index: 0 },

  // lesson_int_15: 보다
  { id: 'gq_int_15_1', lesson_id: 'lesson_int_15', sort_order: 1, prompt: '오늘이 어제___ 더 추워요. (Today is colder than yesterday.)', options: ['보다', '가장', '제일', '도'], answer_index: 0 },
  { id: 'gq_int_15_2', lesson_id: 'lesson_int_15', sort_order: 2, prompt: '저는 고기___ 생선을 좋아해요. (I like fish more than meat.)', options: ['보다', '가장', '제일', '도'], answer_index: 0 },
  { id: 'gq_int_15_3', lesson_id: 'lesson_int_15', sort_order: 3, prompt: '예상___ 빨랐어요. (It was faster than expected.)', options: ['보다', '가장', '제일', '에서'], answer_index: 0 },
  { id: 'gq_int_15_4', lesson_id: 'lesson_int_15', sort_order: 4, prompt: '형___ 키가 커요. (I am taller than my older brother.)', options: ['보다', '가장', '제일', '도'], answer_index: 0 },

  // lesson_int_16: 가장/제일
  { id: 'gq_int_16_1', lesson_id: 'lesson_int_16', sort_order: 1, prompt: '이게 ___ 맛있어요. (This is the most delicious.)', options: ['가장', '보다', '더', '덜'], answer_index: 0 },
  { id: 'gq_int_16_2', lesson_id: 'lesson_int_16', sort_order: 2, prompt: '___ 좋아하는 음식이 뭐예요? (What is your favorite food?)', options: ['제일', '보다', '더', '덜'], answer_index: 0 },
  { id: 'gq_int_16_3', lesson_id: 'lesson_int_16', sort_order: 3, prompt: '한국어가 ___ 어려워요. (Korean is the most difficult.)', options: ['가장', '보다', '더', '덜'], answer_index: 0 },
  { id: 'gq_int_16_4', lesson_id: 'lesson_int_16', sort_order: 4, prompt: '그 식당이 ___ 유명해요. (That restaurant is the most famous.)', options: ['제일', '보다', '더', '덜'], answer_index: 0 },

  // lesson_int_17: 게 되다
  { id: 'gq_int_17_1', lesson_id: 'lesson_int_17', sort_order: 1, prompt: '한국어를 공부하___ 됐어요. (I came to study Korean.)', options: ['게', '고', '어서', '지만'], answer_index: 0 },
  { id: 'gq_int_17_2', lesson_id: 'lesson_int_17', sort_order: 2, prompt: '한국에서 살___ 됐어요. (I ended up living in Korea.)', options: ['게', '고', '어서', '면서'], answer_index: 0 },
  { id: 'gq_int_17_3', lesson_id: 'lesson_int_17', sort_order: 3, prompt: '그 소식을 알___ 됐어요. (I came to know that news.)', options: ['게', '고', '어서', '지만'], answer_index: 0 },
  { id: 'gq_int_17_4', lesson_id: 'lesson_int_17', sort_order: 4, prompt: '친구를 만나___ 됐어요. (I ended up meeting a friend.)', options: ['게', '고', '어서', '면서'], answer_index: 0 },

  // lesson_int_18: 아/어 주다
  { id: 'gq_int_18_1', lesson_id: 'lesson_int_18', sort_order: 1, prompt: '도와___ 감사해요. (Thank you for helping me.)', options: ['줘서', '봐서', '가서', '서'], answer_index: 0 },
  { id: 'gq_int_18_2', lesson_id: 'lesson_int_18', sort_order: 2, prompt: '가르쳐 ___ 수 있어요? (Can you teach me?)', options: ['줄', '볼', '갈', '할'], answer_index: 0 },
  { id: 'gq_int_18_3', lesson_id: 'lesson_int_18', sort_order: 3, prompt: '설명해 ___. (Please explain it to me.)', options: ['주세요', '봐요', '가세요', '해요'], answer_index: 0 },
  { id: 'gq_int_18_4', lesson_id: 'lesson_int_18', sort_order: 4, prompt: '사진 찍어 ___. (Please take a photo for me.)', options: ['주세요', '봐요', '가세요', '줄게요'], answer_index: 0 },

  // lesson_int_19: 는 중이다
  { id: 'gq_int_19_1', lesson_id: 'lesson_int_19', sort_order: 1, prompt: '지금 밥 먹는 ___. (I am in the middle of eating.)', options: ['중이에요', '편이에요', '척이에요', '적이에요'], answer_index: 0 },
  { id: 'gq_int_19_2', lesson_id: 'lesson_int_19', sort_order: 2, prompt: '회의 ___. (I am in the middle of a meeting.)', options: ['중이에요', '편이에요', '척이에요', '적이에요'], answer_index: 0 },
  { id: 'gq_int_19_3', lesson_id: 'lesson_int_19', sort_order: 3, prompt: '공부하는 ___. (I am in the middle of studying.)', options: ['중이에요', '편이에요', '척이에요', '적이에요'], answer_index: 0 },
  { id: 'gq_int_19_4', lesson_id: 'lesson_int_19', sort_order: 4, prompt: '지금 운전하는 ___. (I am in the middle of driving.)', options: ['중이에요', '편이에요', '척이에요', '게 됐어요'], answer_index: 0 },

  // lesson_int_20: 다고 하다
  { id: 'gq_int_20_1', lesson_id: 'lesson_int_20', sort_order: 1, prompt: '친구가 내일 온___ 했어요. (My friend said they are coming tomorrow.)', options: ['다고', '라고', '냐고', '자고'], answer_index: 0 },
  { id: 'gq_int_20_2', lesson_id: 'lesson_int_20', sort_order: 2, prompt: '선생님이 공부하___ 했어요. (The teacher told me to study.) — command', options: ['라고', '다고', '냐고', '자고'], answer_index: 0 },
  { id: 'gq_int_20_3', lesson_id: 'lesson_int_20', sort_order: 3, prompt: '어디 가___ 물어봤어요. (I asked where they were going.) — question', options: ['냐고', '다고', '라고', '자고'], answer_index: 0 },
  { id: 'gq_int_20_4', lesson_id: 'lesson_int_20', sort_order: 4, prompt: '같이 가___ 했어요. (They suggested going together.) — suggestion', options: ['자고', '다고', '라고', '냐고'], answer_index: 0 },

  // ── Advanced ────────────────────────────────────────────────
  // lesson_adv_1: 는 척하다
  { id: 'gq_adv_1_1', lesson_id: 'lesson_adv_1', sort_order: 1, prompt: '자는 ___했어요. (I pretended to be sleeping.)', options: ['척', '편', '중', '적'], answer_index: 0 },
  { id: 'gq_adv_1_2', lesson_id: 'lesson_adv_1', sort_order: 2, prompt: '모르는 ___하지 마세요. (Do not pretend you do not know.)', options: ['척', '편', '중', '적'], answer_index: 0 },
  { id: 'gq_adv_1_3', lesson_id: 'lesson_adv_1', sort_order: 3, prompt: '바쁜 ___해요. (She is pretending to be busy.)', options: ['척', '편', '중', '적'], answer_index: 0 },
  { id: 'gq_adv_1_4', lesson_id: 'lesson_adv_1', sort_order: 4, prompt: '잘 아는 ___했어요. (I pretended to know well.)', options: ['척', '편', '중', '리'], answer_index: 0 },

  // lesson_adv_2: 더라고요
  { id: 'gq_adv_2_1', lesson_id: 'lesson_adv_2', sort_order: 1, prompt: '그 영화 정말 재미있___. (I found that movie really interesting.)', options: ['더라고요', '거든요', '잖아요', '네요'], answer_index: 0 },
  { id: 'gq_adv_2_2', lesson_id: 'lesson_adv_2', sort_order: 2, prompt: '거기 음식이 맛있___. (The food there was delicious, I found.)', options: ['더라고요', '거든요', '잖아요', '네요'], answer_index: 0 },
  { id: 'gq_adv_2_3', lesson_id: 'lesson_adv_2', sort_order: 3, prompt: '생각보다 어렵___. (I found it harder than I thought.)', options: ['더라고요', '거든요', '잖아요', '네요'], answer_index: 0 },
  { id: 'gq_adv_2_4', lesson_id: 'lesson_adv_2', sort_order: 4, prompt: '그 사람이 정말 친절하___. (I found that person to be really kind.)', options: ['더라고요', '거든요', '잖아요', '네요'], answer_index: 0 },

  // lesson_adv_3: 다 보니
  { id: 'gq_adv_3_1', lesson_id: 'lesson_adv_3', sort_order: 1, prompt: '매일 연습하___ 실력이 늘었어요. (As I kept practicing, my skills improved.)', options: ['다 보니', '지만', '어서', '면서'], answer_index: 0 },
  { id: 'gq_adv_3_2', lesson_id: 'lesson_adv_3', sort_order: 2, prompt: '한국어를 공부하___ 재미있어요. (As I kept studying Korean, it became fun.)', options: ['다 보니', '지만', '어서', '면서'], answer_index: 0 },
  { id: 'gq_adv_3_3', lesson_id: 'lesson_adv_3', sort_order: 3, prompt: '매일 운동하___ 몸이 좋아졌어요. (As I kept exercising, my body got better.)', options: ['다 보니', '지만', '어서', '면서'], answer_index: 0 },
  { id: 'gq_adv_3_4', lesson_id: 'lesson_adv_3', sort_order: 4, prompt: '살___ 별일이 다 있네요. (As I keep living, all kinds of things happen.)', options: ['다 보니', '지만', '어서', '면서'], answer_index: 0 },

  // lesson_adv_4: 을/ㄹ 뻔했다
  { id: 'gq_adv_4_1', lesson_id: 'lesson_adv_4', sort_order: 1, prompt: '넘어질 ___했어요. (I almost fell.)', options: ['뻔', '수', '리', '편'], answer_index: 0 },
  { id: 'gq_adv_4_2', lesson_id: 'lesson_adv_4', sort_order: 2, prompt: '버스를 놓칠 뻔___. (I almost missed the bus.)', options: ['했어요', '해요', '할 거예요', '싶어요'], answer_index: 0 },
  { id: 'gq_adv_4_3', lesson_id: 'lesson_adv_4', sort_order: 3, prompt: '울 ___ 했어요. (I almost cried.)', options: ['뻔', '수', '리', '편'], answer_index: 0 },
  { id: 'gq_adv_4_4', lesson_id: 'lesson_adv_4', sort_order: 4, prompt: '늦을 뻔___. (I almost was late.)', options: ['했어요', '해요', '할 거예요', '싶어요'], answer_index: 0 },

  // lesson_adv_5: 은/ㄴ 셈이다
  { id: 'gq_adv_5_1', lesson_id: 'lesson_adv_5', sort_order: 1, prompt: '다 된 ___이에요. (It is practically done.)', options: ['셈', '편', '척', '중'], answer_index: 0 },
  { id: 'gq_adv_5_2', lesson_id: 'lesson_adv_5', sort_order: 2, prompt: '혼자 한 ___이에요. (It is as if I did it alone.)', options: ['셈', '편', '척', '적'], answer_index: 0 },
  { id: 'gq_adv_5_3', lesson_id: 'lesson_adv_5', sort_order: 3, prompt: '공짜나 마찬가지인 ___이에요. (It is practically free.)', options: ['셈', '편', '척', '중'], answer_index: 0 },
  { id: 'gq_adv_5_4', lesson_id: 'lesson_adv_5', sort_order: 4, prompt: '다 이해한 ___이에요. (It is as if I understood everything.)', options: ['셈', '편', '척', '리'], answer_index: 0 },

  // lesson_adv_6: 기는 하다
  { id: 'gq_adv_6_1', lesson_id: 'lesson_adv_6', sort_order: 1, prompt: '맛있___ 한데 너무 비싸요. (It is delicious, but too expensive.)', options: ['기는', '지만', '어서', '면서'], answer_index: 0 },
  { id: 'gq_adv_6_2', lesson_id: 'lesson_adv_6', sort_order: 2, prompt: '가기는 갔___ 재미없었어요. (I did go, but it was not fun.)', options: ['는데', '지만', '어서', '면서'], answer_index: 0 },
  { id: 'gq_adv_6_3', lesson_id: 'lesson_adv_6', sort_order: 3, prompt: '알___ 는 알아요. (I do know, but...)', options: ['기', '지만', '어서', '면서'], answer_index: 0 },
  { id: 'gq_adv_6_4', lesson_id: 'lesson_adv_6', sort_order: 4, prompt: '하기는 ___. (I do do it, but...)', options: ['하는데', '했지만', '해서', '하면서'], answer_index: 0 },

  // lesson_adv_7: 을/ㄹ수록
  { id: 'gq_adv_7_1', lesson_id: 'lesson_adv_7', sort_order: 1, prompt: '공부할___ 더 어려워요. (The more I study, the harder it gets.)', options: ['수록', '지만', '어서', '면서'], answer_index: 0 },
  { id: 'gq_adv_7_2', lesson_id: 'lesson_adv_7', sort_order: 2, prompt: '먹을___ 맛있어요. (The more you eat, the more delicious it is.)', options: ['수록', '지만', '어서', '면서'], answer_index: 0 },
  { id: 'gq_adv_7_3', lesson_id: 'lesson_adv_7', sort_order: 3, prompt: '생각할___ 이상해요. (The more I think, the stranger it is.)', options: ['수록', '지만', '어서', '면서'], answer_index: 0 },
  { id: 'gq_adv_7_4', lesson_id: 'lesson_adv_7', sort_order: 4, prompt: '볼___ 좋아요. (The more you look, the better it is.)', options: ['수록', '지만', '어서', '면서'], answer_index: 0 },

  // lesson_adv_8: 은/ㄴ 채로
  { id: 'gq_adv_8_1', lesson_id: 'lesson_adv_8', sort_order: 1, prompt: '신발을 신은 ___ 들어왔어요. (They came in with shoes still on.)', options: ['채로', '척으로', '편으로', '중으로'], answer_index: 0 },
  { id: 'gq_adv_8_2', lesson_id: 'lesson_adv_8', sort_order: 2, prompt: '불을 켠 ___ 잠들었어요. (I fell asleep with the light still on.)', options: ['채로', '척으로', '편으로', '김에'], answer_index: 0 },
  { id: 'gq_adv_8_3', lesson_id: 'lesson_adv_8', sort_order: 3, prompt: '서 있는 ___ 먹었어요. (I ate while still standing.)', options: ['채로', '척으로', '편으로', '중으로'], answer_index: 0 },
  { id: 'gq_adv_8_4', lesson_id: 'lesson_adv_8', sort_order: 4, prompt: '눈을 감은 ___ 있었어요. (I stayed with my eyes closed.)', options: ['채로', '척으로', '편으로', '김에'], answer_index: 0 },

  // lesson_adv_9: 다가
  { id: 'gq_adv_9_1', lesson_id: 'lesson_adv_9', sort_order: 1, prompt: '공부하___ 잠들었어요. (While studying, I fell asleep.)', options: ['다가', '면서', '어서', '지만'], answer_index: 0 },
  { id: 'gq_adv_9_2', lesson_id: 'lesson_adv_9', sort_order: 2, prompt: '길을 걷___ 친구를 만났어요. (While walking, I ran into a friend.)', options: ['다가', '면서', '어서', '지만'], answer_index: 0 },
  { id: 'gq_adv_9_3', lesson_id: 'lesson_adv_9', sort_order: 3, prompt: '웃___ 울었어요. (While laughing, I started crying.)', options: ['다가', '면서', '어서', '지만'], answer_index: 0 },
  { id: 'gq_adv_9_4', lesson_id: 'lesson_adv_9', sort_order: 4, prompt: '요리하___ 손을 다쳤어요. (While cooking, I hurt my hand.)', options: ['다가', '면서', '어서', '지만'], answer_index: 0 },

  // lesson_adv_10: 을/ㄹ 리가 없다
  { id: 'gq_adv_10_1', lesson_id: 'lesson_adv_10', sort_order: 1, prompt: '그 사람이 거짓말할 ___ 없어요. (There is no way that person would lie.)', options: ['리가', '수가', '편이', '척이'], answer_index: 0 },
  { id: 'gq_adv_10_2', lesson_id: 'lesson_adv_10', sort_order: 2, prompt: '벌써 끝났을 리가 ___. (There is no way it is already finished.)', options: ['없어요', '있어요', '돼요', '싶어요'], answer_index: 0 },
  { id: 'gq_adv_10_3', lesson_id: 'lesson_adv_10', sort_order: 3, prompt: '모를 ___ 없어요. (There is no way they do not know.)', options: ['리가', '수가', '편이', '척이'], answer_index: 0 },
  { id: 'gq_adv_10_4', lesson_id: 'lesson_adv_10', sort_order: 4, prompt: '그게 사실일 리가 ___. (There is no way that is true.)', options: ['없어요', '있어요', '돼요', '싶어요'], answer_index: 0 },

  // lesson_adv_11: 는 바람에
  { id: 'gq_adv_11_1', lesson_id: 'lesson_adv_11', sort_order: 1, prompt: '비가 오는 ___ 행사가 취소됐어요. (The event was cancelled because of unexpected rain.)', options: ['바람에', '김에', '채로', '척으로'], answer_index: 0 },
  { id: 'gq_adv_11_2', lesson_id: 'lesson_adv_11', sort_order: 2, prompt: '늦잠을 자는 ___ 지각했어요. (I was late because I overslept.)', options: ['바람에', '김에', '채로', '겸'], answer_index: 0 },
  { id: 'gq_adv_11_3', lesson_id: 'lesson_adv_11', sort_order: 3, prompt: '전화가 오는 ___ 집중을 못 했어요. (I could not concentrate because of an unexpected call.)', options: ['바람에', '김에', '채로', '척으로'], answer_index: 0 },
  { id: 'gq_adv_11_4', lesson_id: 'lesson_adv_11', sort_order: 4, prompt: '핸드폰이 고장나는 ___ 연락을 못 했어요. (I could not contact them because my phone broke.)', options: ['바람에', '김에', '채로', '겸'], answer_index: 0 },

  // lesson_adv_12: 을/ㄹ 겸
  { id: 'gq_adv_12_1', lesson_id: 'lesson_adv_12', sort_order: 1, prompt: '운동도 할 ___ 산책을 해요. (I walk to exercise and get some air too.)', options: ['겸', '바람에', '채로', '수록'], answer_index: 0 },
  { id: 'gq_adv_12_2', lesson_id: 'lesson_adv_12', sort_order: 2, prompt: '구경도 할 ___ 시장에 가요. (I am going to the market to browse and shop.)', options: ['겸', '바람에', '채로', '수록'], answer_index: 0 },
  { id: 'gq_adv_12_3', lesson_id: 'lesson_adv_12', sort_order: 3, prompt: '공부도 할 ___ 카페에 갔어요. (I went to the café to study and take a break.)', options: ['겸', '바람에', '채로', '따름이'], answer_index: 0 },
  { id: 'gq_adv_12_4', lesson_id: 'lesson_adv_12', sort_order: 4, prompt: '인사도 할 ___ 들렀어요. (I stopped by to say hello and check in.)', options: ['겸', '바람에', '채로', '수록'], answer_index: 0 },

  // lesson_adv_13: 는 편이다
  { id: 'gq_adv_13_1', lesson_id: 'lesson_adv_13', sort_order: 1, prompt: '저는 커피를 많이 마시는 ___. (I tend to drink a lot of coffee.)', options: ['편이에요', '중이에요', '척이에요', '적이에요'], answer_index: 0 },
  { id: 'gq_adv_13_2', lesson_id: 'lesson_adv_13', sort_order: 2, prompt: '저는 내성적인 ___. (I am on the introverted side.)', options: ['편이에요', '중이에요', '척이에요', '적이에요'], answer_index: 0 },
  { id: 'gq_adv_13_3', lesson_id: 'lesson_adv_13', sort_order: 3, prompt: '이 음식은 매운 ___. (This food tends to be spicy.)', options: ['편이에요', '중이에요', '척이에요', '리예요'], answer_index: 0 },
  { id: 'gq_adv_13_4', lesson_id: 'lesson_adv_13', sort_order: 4, prompt: '저는 일찍 자는 ___. (I tend to go to bed early.)', options: ['편이에요', '중이에요', '척이에요', '적이에요'], answer_index: 0 },

  // lesson_adv_14: 기 때문에
  { id: 'gq_adv_14_1', lesson_id: 'lesson_adv_14', sort_order: 1, prompt: '바쁘___ 못 가요. (I cannot go because I am busy.)', options: ['기 때문에', '어서', '지만', '면서'], answer_index: 0 },
  { id: 'gq_adv_14_2', lesson_id: 'lesson_adv_14', sort_order: 2, prompt: '건강이 중요하___ 운동해요. (I exercise because health is important.)', options: ['기 때문에', '어서', '지만', '면서'], answer_index: 0 },
  { id: 'gq_adv_14_3', lesson_id: 'lesson_adv_14', sort_order: 3, prompt: '시간이 없___ 빨리 해야 해요. (I need to hurry because there is no time.)', options: ['기 때문에', '어서', '지만', '면서'], answer_index: 0 },
  { id: 'gq_adv_14_4', lesson_id: 'lesson_adv_14', sort_order: 4, prompt: '위험하___ 조심해야 해요. (You must be careful because it is dangerous.)', options: ['기 때문에', '어서', '지만', '면서'], answer_index: 0 },

  // lesson_adv_15: 나 보다
  { id: 'gq_adv_15_1', lesson_id: 'lesson_adv_15', sort_order: 1, prompt: '집에 있___ 봐요. (I guess they are home.)', options: ['나', '는 것 같', '거든', '잖'], answer_index: 0 },
  { id: 'gq_adv_15_2', lesson_id: 'lesson_adv_15', sort_order: 2, prompt: '많이 피곤한___ 봐요. (They seem to be very tired.)', options: ['가', '는 것 같', '거든', '잖'], answer_index: 0 },
  { id: 'gq_adv_15_3', lesson_id: 'lesson_adv_15', sort_order: 3, prompt: '배가 고픈___ 봐요. (I guess they are hungry.)', options: ['가', '는 것 같', '거든', '잖'], answer_index: 0 },
  { id: 'gq_adv_15_4', lesson_id: 'lesson_adv_15', sort_order: 4, prompt: '비가 오___ 봐요. (I guess it is raining.)', options: ['나', '는 것 같', '거든', '잖'], answer_index: 0 },

  // lesson_adv_16: 게 마련이다
  { id: 'gq_adv_16_1', lesson_id: 'lesson_adv_16', sort_order: 1, prompt: '연습하면 늘___ 마련이에요. (If you practice, you are bound to improve.)', options: ['게', '기', '어서', '지만'], answer_index: 0 },
  { id: 'gq_adv_16_2', lesson_id: 'lesson_adv_16', sort_order: 2, prompt: '실수는 하___ 마련이에요. (Mistakes are bound to happen.)', options: ['게', '기', '어서', '지만'], answer_index: 0 },
  { id: 'gq_adv_16_3', lesson_id: 'lesson_adv_16', sort_order: 3, prompt: '인생은 힘들___ 마련이에요. (Life is bound to be difficult.)', options: ['게', '기', '어서', '지만'], answer_index: 0 },
  { id: 'gq_adv_16_4', lesson_id: 'lesson_adv_16', sort_order: 4, prompt: '시간이 지나면 잊혀지___ 마련이에요. (Things are bound to be forgotten over time.)', options: ['게', '기', '어서', '지만'], answer_index: 0 },

  // lesson_adv_17: 기 마련이다
  { id: 'gq_adv_17_1', lesson_id: 'lesson_adv_17', sort_order: 1, prompt: '시간이 지나면 좋아지___ 마련이에요. (Things are bound to get better.)', options: ['기', '게', '어서', '지만'], answer_index: 0 },
  { id: 'gq_adv_17_2', lesson_id: 'lesson_adv_17', sort_order: 2, prompt: '노력하면 결과가 나오___ 마련이에요. (Results are bound to come with effort.)', options: ['기', '게', '어서', '면서'], answer_index: 0 },
  { id: 'gq_adv_17_3', lesson_id: 'lesson_adv_17', sort_order: 3, prompt: '사람은 실수하___ 마련이에요. (People are bound to make mistakes.)', options: ['기', '게', '어서', '지만'], answer_index: 0 },
  { id: 'gq_adv_17_4', lesson_id: 'lesson_adv_17', sort_order: 4, prompt: '열심히 하면 늘___ 마련이에요. (If you work hard, you are bound to improve.)', options: ['기', '게', '어서', '지만'], answer_index: 0 },

  // lesson_adv_18: 는 김에
  { id: 'gq_adv_18_1', lesson_id: 'lesson_adv_18', sort_order: 1, prompt: '마트 가는 ___ 우유 사다 줄 수 있어요? (Since you are going to the mart, can you buy milk?)', options: ['김에', '바람에', '채로', '겸'], answer_index: 0 },
  { id: 'gq_adv_18_2', lesson_id: 'lesson_adv_18', sort_order: 2, prompt: '서울 가는 ___ 친구도 만났어요. (While going to Seoul, I also met a friend.)', options: ['김에', '바람에', '채로', '겸'], answer_index: 0 },
  { id: 'gq_adv_18_3', lesson_id: 'lesson_adv_18', sort_order: 3, prompt: '청소하는 ___ 빨래도 했어요. (While cleaning, I did the laundry too.)', options: ['김에', '바람에', '채로', '수록'], answer_index: 0 },
  { id: 'gq_adv_18_4', lesson_id: 'lesson_adv_18', sort_order: 4, prompt: '여기 온 ___ 구경도 해요. (Since you came here, look around too.)', options: ['김에', '바람에', '채로', '겸'], answer_index: 0 },

  // lesson_adv_19: 을/ㄹ 따름이다
  { id: 'gq_adv_19_1', lesson_id: 'lesson_adv_19', sort_order: 1, prompt: '기다릴 ___이에요. (All I can do is wait.)', options: ['따름', '뻔', '리', '편'], answer_index: 0 },
  { id: 'gq_adv_19_2', lesson_id: 'lesson_adv_19', sort_order: 2, prompt: '최선을 다할 ___이에요. (All I can do is give my best.)', options: ['따름', '뻔', '리', '편'], answer_index: 0 },
  { id: 'gq_adv_19_3', lesson_id: 'lesson_adv_19', sort_order: 3, prompt: '놀랄 ___이에요. (I can only be amazed.)', options: ['따름', '뻔', '리', '편'], answer_index: 0 },
  { id: 'gq_adv_19_4', lesson_id: 'lesson_adv_19', sort_order: 4, prompt: '감사할 ___이에요. (All I can do is be grateful.)', options: ['따름', '뻔', '리', '편'], answer_index: 0 },

  // lesson_adv_20: contractions/slang
  { id: 'gq_adv_20_1', lesson_id: 'lesson_adv_20', sort_order: 1, prompt: '___? (What are you doing? — contracted spoken form)', options: ['뭐해?', '무엇을 하고 있습니까?', '뭘 해요?', '무엇을 해요?'], answer_index: 0 },
  { id: 'gq_adv_20_2', lesson_id: 'lesson_adv_20', sort_order: 2, prompt: '___! (What do I do! — contracted spoken form)', options: ['어떡해!', '어떻게 합니까!', '어떻게 해요!', '어찌해!'], answer_index: 0 },
  { id: 'gq_adv_20_3', lesson_id: 'lesson_adv_20', sort_order: 3, prompt: '안 ___! (No! You cannot! — contracted from 되어)', options: ['돼!', '돼요!', '됩니다!', '되어요!'], answer_index: 0 },
  { id: 'gq_adv_20_4', lesson_id: 'lesson_adv_20', sort_order: 4, prompt: '___. (It is fine. / Forget it. — contracted)', options: ['됐어.', '됩니다.', '되었습니다.', '되어요.'], answer_index: 0 },
];

module.exports = { grammarQuestions };
