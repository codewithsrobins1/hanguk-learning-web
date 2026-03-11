const passages = [
  // ── Daily Life ─────────────────────────────────────────────
  {
    id: 'passage_cafe', title: '카페에서', title_en: 'At the Café',
    category: 'Daily Life', read_time: '3 min read', sort_order: 1,
    lines: [
      { korean: '저는 매일 아침 카페에 가요.', translation: 'I go to the café every morning.' },
      { korean: '아이스 아메리카노 한 잔 주세요.', translation: 'One iced Americano, please.' },
      { korean: '카페가 정말 예뻐요.', translation: 'The café is really pretty.' },
      { korean: '친구를 기다려요.', translation: 'I am waiting for a friend.' },
      { korean: '친구가 조금 늦었어요.', translation: 'My friend is a little late.' },
      { korean: '괜찮아요, 커피가 맛있으니까요.', translation: "It's okay, because the coffee is delicious." },
    ],
  },
  {
    id: 'passage_family', title: '우리 가족', title_en: 'My Family',
    category: 'Daily Life', read_time: '4 min read', sort_order: 2,
    lines: [
      { korean: '우리 가족은 다섯 명이에요.', translation: 'Our family has five members.' },
      { korean: '아버지는 선생님이에요.', translation: 'My father is a teacher.' },
      { korean: '어머니는 요리를 잘해요.', translation: 'My mother cooks well.' },
      { korean: '동생은 대학생이에요.', translation: 'My younger sibling is a university student.' },
      { korean: '저는 한국어를 공부해요.', translation: 'I study Korean.' },
    ],
  },
  {
    id: 'passage_morning', title: '아침 루틴', title_en: 'Morning Routine',
    category: 'Daily Life', read_time: '3 min read', sort_order: 3,
    lines: [
      { korean: '저는 매일 아침 일곱 시에 일어나요.', translation: 'I wake up every morning at 7 AM.' },
      { korean: '먼저 세수를 하고 이를 닦아요.', translation: 'First I wash my face and brush my teeth.' },
      { korean: '아침 식사로 토스트와 계란을 먹어요.', translation: 'I eat toast and eggs for breakfast.' },
      { korean: '그리고 커피를 한 잔 마셔요.', translation: 'Then I drink a cup of coffee.' },
      { korean: '여덟 시에 집을 나가요.', translation: 'I leave the house at 8 AM.' },
      { korean: '지하철을 타고 학교에 가요.', translation: 'I take the subway to school.' },
    ],
  },
  {
    id: 'passage_weekend', title: '주말 계획', title_en: 'Weekend Plans',
    category: 'Daily Life', read_time: '3 min read', sort_order: 4,
    lines: [
      { korean: '이번 주말에 친구들을 만날 거예요.', translation: 'I will meet friends this weekend.' },
      { korean: '같이 한강에 갈 계획이에요.', translation: 'We plan to go to the Han River together.' },
      { korean: '편의점에서 음식을 사서 먹을 거예요.', translation: 'We will buy food from a convenience store and eat.' },
      { korean: '날씨가 좋으면 자전거도 탈 거예요.', translation: 'If the weather is nice, we will also ride bikes.' },
      { korean: '저녁에는 삼겹살을 먹으러 갈 거예요.', translation: 'In the evening we will go eat samgyeopsal.' },
    ],
  },
  {
    id: 'passage_apartment', title: '새 집', title_en: 'New Apartment',
    category: 'Daily Life', read_time: '4 min read', sort_order: 5,
    lines: [
      { korean: '저는 지난달에 새 집으로 이사했어요.', translation: 'I moved to a new house last month.' },
      { korean: '작은 원룸이지만 깨끗하고 편해요.', translation: 'It is a small studio but clean and comfortable.' },
      { korean: '학교에서 걸어서 십 분 거리예요.', translation: 'It is a ten-minute walk from school.' },
      { korean: '편의점과 카페가 바로 옆에 있어요.', translation: 'There is a convenience store and café right next door.' },
      { korean: '정말 마음에 들어요!', translation: 'I really love it!' },
    ],
  },
  {
    id: 'passage_hobby', title: '취미 생활', title_en: 'My Hobbies',
    category: 'Daily Life', read_time: '3 min read', sort_order: 6,
    lines: [
      { korean: '저의 취미는 사진 찍기예요.', translation: 'My hobby is taking photos.' },
      { korean: '주말마다 서울 곳곳을 다니며 사진을 찍어요.', translation: 'Every weekend I go around Seoul taking photos.' },
      { korean: '경복궁이나 북촌 한옥마을에 자주 가요.', translation: 'I often go to Gyeongbokgung or Bukchon Hanok Village.' },
      { korean: '사진을 SNS에 올리면 반응이 좋아요.', translation: 'When I post photos on social media, the response is good.' },
      { korean: '나중에 사진 전시회를 열고 싶어요.', translation: 'I want to hold a photo exhibition in the future.' },
    ],
  },

  // ── Food ───────────────────────────────────────────────────
  {
    id: 'passage_bbq', title: '한국 고기집', title_en: 'Korean BBQ',
    category: 'Food', read_time: '3 min read', sort_order: 7,
    lines: [
      { korean: '오늘 친구들과 고기집에 갔어요.', translation: 'Today I went to a BBQ restaurant with friends.' },
      { korean: '삼겹살을 세 인분 주문했어요.', translation: 'We ordered three servings of samgyeopsal.' },
      { korean: '상추에 고기를 싸 먹었어요.', translation: 'We wrapped the meat in lettuce and ate it.' },
      { korean: '정말 맛있었어요!', translation: 'It was really delicious!' },
    ],
  },
  {
    id: 'passage_market', title: '시장 나들이', title_en: 'Trip to the Market',
    category: 'Food', read_time: '3 min read', sort_order: 8,
    lines: [
      { korean: '어머니와 함께 재래시장에 갔어요.', translation: 'I went to the traditional market with my mother.' },
      { korean: '신선한 채소와 과일을 샀어요.', translation: 'We bought fresh vegetables and fruit.' },
      { korean: '시장 떡볶이가 정말 맛있었어요.', translation: 'The tteokbokki at the market was really delicious.' },
      { korean: '순대도 한 그릇 먹었어요.', translation: 'We also ate a bowl of sundae.' },
      { korean: '다음에 또 오고 싶어요.', translation: 'I want to come again next time.' },
    ],
  },
  {
    id: 'passage_cooking', title: '한국 요리 배우기', title_en: 'Learning to Cook Korean Food',
    category: 'Food', read_time: '4 min read', sort_order: 9,
    lines: [
      { korean: '요즘 한국 요리를 배우고 있어요.', translation: 'I am learning to cook Korean food these days.' },
      { korean: '먼저 김치찌개를 만들어 봤어요.', translation: 'First I tried making kimchi jjigae.' },
      { korean: '돼지고기, 김치, 두부를 넣고 끓였어요.', translation: 'I put in pork, kimchi, and tofu and boiled it.' },
      { korean: '간이 조금 셌지만 맛있었어요.', translation: 'The seasoning was a little strong but it was delicious.' },
      { korean: '다음엔 된장찌개에 도전할 거예요.', translation: 'Next I will try doenjang jjigae.' },
    ],
  },
  {
    id: 'passage_ramyeon', title: '라면 먹을래요?', title_en: 'Want to Eat Ramen?',
    category: 'Food', read_time: '3 min read', sort_order: 10,
    lines: [
      { korean: '한국 사람들은 라면을 정말 좋아해요.', translation: 'Korean people really love ramen.' },
      { korean: '편의점에서 라면을 먹는 게 유행이에요.', translation: 'Eating ramen at convenience stores is popular.' },
      { korean: '뜨거운 물을 붓고 삼 분을 기다려요.', translation: 'Pour hot water and wait three minutes.' },
      { korean: '계란을 넣으면 더 맛있어요.', translation: 'It is even more delicious if you add an egg.' },
      { korean: '한국에 오면 꼭 드셔 보세요!', translation: 'If you come to Korea, make sure to try it!' },
    ],
  },
  {
    id: 'passage_restaurant', title: '식당에서', title_en: 'At the Restaurant',
    category: 'Food', read_time: '3 min read', sort_order: 11,
    lines: [
      { korean: '저희는 한식당을 찾았어요.', translation: 'We found a Korean restaurant.' },
      { korean: '메뉴판을 보니 비빔밥과 갈비탕이 있었어요.', translation: 'Looking at the menu, there was bibimbap and galbitang.' },
      { korean: '저는 비빔밥을 주문하고 친구는 갈비탕을 주문했어요.', translation: 'I ordered bibimbap and my friend ordered galbitang.' },
      { korean: '반찬이 다섯 가지나 나왔어요.', translation: 'Five side dishes came out.' },
      { korean: '밥을 다 먹고 수정과를 마셨어요.', translation: 'After finishing the meal, we drank sikhye.' },
    ],
  },

  // ── Travel ─────────────────────────────────────────────────
  {
    id: 'passage_subway', title: '서울 지하철', title_en: 'Seoul Subway',
    category: 'Travel', read_time: '3 min read', sort_order: 12,
    lines: [
      { korean: '서울 지하철은 정말 편리해요.', translation: 'The Seoul subway is really convenient.' },
      { korean: '노선이 많아서 어디든지 갈 수 있어요.', translation: 'There are many lines so you can go anywhere.' },
      { korean: '교통카드로 버스와 지하철을 모두 탈 수 있어요.', translation: 'You can take both buses and subways with a transit card.' },
      { korean: '환승 할인도 돼요.', translation: 'Transfer discounts are also available.' },
      { korean: '외국 관광객들에게도 쉬워요.', translation: 'It is easy for foreign tourists too.' },
    ],
  },
  {
    id: 'passage_gyeongbokgung', title: '경복궁 방문', title_en: 'Visiting Gyeongbokgung',
    category: 'Travel', read_time: '4 min read', sort_order: 13,
    lines: [
      { korean: '오늘 경복궁에 방문했어요.', translation: 'I visited Gyeongbokgung today.' },
      { korean: '한복을 입고 가면 입장이 무료예요.', translation: 'If you go wearing hanbok, entry is free.' },
      { korean: '궁 안에서 사진을 많이 찍었어요.', translation: 'I took many photos inside the palace.' },
      { korean: '수문장 교대식도 볼 수 있었어요.', translation: 'I was also able to see the royal guard changing ceremony.' },
      { korean: '경복궁은 조선시대에 지어졌어요.', translation: 'Gyeongbokgung was built during the Joseon dynasty.' },
      { korean: '꼭 한번 방문해 보세요!', translation: 'Make sure to visit at least once!' },
    ],
  },
  {
    id: 'passage_jeju', title: '제주도 여행', title_en: 'Jeju Island Trip',
    category: 'Travel', read_time: '4 min read', sort_order: 14,
    lines: [
      { korean: '가족과 함께 제주도에 갔어요.', translation: 'I went to Jeju Island with my family.' },
      { korean: '비행기로 한 시간 정도 걸려요.', translation: 'It takes about an hour by plane.' },
      { korean: '한라산을 등산했어요.', translation: 'We hiked Mount Hallasan.' },
      { korean: '성산일출봉도 구경했어요.', translation: 'We also saw Seongsan Ilchulbong.' },
      { korean: '제주 흑돼지 구이가 정말 맛있었어요.', translation: 'Grilled Jeju black pork was really delicious.' },
      { korean: '다음에는 더 오래 있고 싶어요.', translation: 'Next time I want to stay longer.' },
    ],
  },
  {
    id: 'passage_busan', title: '부산 여행', title_en: 'Trip to Busan',
    category: 'Travel', read_time: '4 min read', sort_order: 15,
    lines: [
      { korean: '부산은 한국에서 두 번째로 큰 도시예요.', translation: 'Busan is the second largest city in Korea.' },
      { korean: '해운대 해수욕장이 유명해요.', translation: 'Haeundae Beach is famous.' },
      { korean: '자갈치 시장에서 신선한 해산물을 먹었어요.', translation: 'I ate fresh seafood at Jagalchi Market.' },
      { korean: '감천문화마을도 구경했어요.', translation: 'I also visited Gamcheon Culture Village.' },
      { korean: '부산 사람들이 정말 친절했어요.', translation: 'The people of Busan were really kind.' },
    ],
  },
  {
    id: 'passage_incheon', title: '인천공항 도착', title_en: 'Arriving at Incheon Airport',
    category: 'Travel', read_time: '3 min read', sort_order: 16,
    lines: [
      { korean: '드디어 인천공항에 도착했어요!', translation: 'I finally arrived at Incheon Airport!' },
      { korean: '입국 심사를 받고 짐을 찾았어요.', translation: 'I went through immigration and picked up my luggage.' },
      { korean: '공항 안에 편의점과 식당이 많아요.', translation: 'There are many convenience stores and restaurants inside the airport.' },
      { korean: '공항 철도를 타고 서울역까지 갔어요.', translation: 'I took the Airport Railroad to Seoul Station.' },
      { korean: '한국에 왔다는 게 실감이 나요!', translation: "It feels real that I'm in Korea!" },
    ],
  },

  // ── Music ──────────────────────────────────────────────────
  {
    id: 'passage_concert', title: '콘서트', title_en: 'K-Pop Concert',
    category: 'Music', read_time: '3 min read', sort_order: 17,
    lines: [
      { korean: '어제 콘서트에 갔어요.', translation: 'I went to a concert yesterday.' },
      { korean: '가수가 노래를 정말 잘했어요.', translation: 'The singer sang really well.' },
      { korean: '팬들이 많이 왔어요.', translation: 'Many fans came.' },
      { korean: '다음 콘서트도 가고 싶어요.', translation: 'I want to go to the next concert too.' },
    ],
  },
  {
    id: 'passage_kpop_history', title: 'K-Pop의 역사', title_en: 'History of K-Pop',
    category: 'Music', read_time: '5 min read', sort_order: 18,
    lines: [
      { korean: 'K-Pop은 1990년대부터 시작되었어요.', translation: 'K-Pop started in the 1990s.' },
      { korean: '처음에는 한국에서만 인기가 있었어요.', translation: 'At first it was only popular in Korea.' },
      { korean: '2000년대에 아시아 전역으로 퍼졌어요.', translation: 'In the 2000s it spread throughout Asia.' },
      { korean: '지금은 전 세계에 팬들이 있어요.', translation: 'Now there are fans all over the world.' },
      { korean: 'BTS와 블랙핑크가 세계적으로 유명해요.', translation: 'BTS and BLACKPINK are famous worldwide.' },
      { korean: 'K-Pop 덕분에 한국어를 배우는 사람이 많아졌어요.', translation: 'Many people have started learning Korean thanks to K-Pop.' },
    ],
  },
  {
    id: 'passage_norebang', title: '노래방에서', title_en: 'At the Norebang',
    category: 'Music', read_time: '3 min read', sort_order: 19,
    lines: [
      { korean: '친구들과 노래방에 갔어요.', translation: 'I went to a norebang with friends.' },
      { korean: '노래방은 한국에서 정말 인기 있는 문화예요.', translation: 'Norebang is a very popular culture in Korea.' },
      { korean: '우리는 두 시간 동안 노래를 불렀어요.', translation: 'We sang songs for two hours.' },
      { korean: '탬버린을 치면서 춤도 췄어요.', translation: 'We also danced while hitting tambourines.' },
      { korean: '목이 아팠지만 정말 재미있었어요.', translation: 'My throat hurt but it was really fun.' },
    ],
  },
  {
    id: 'passage_music_lesson', title: '가야금 배우기', title_en: 'Learning the Gayageum',
    category: 'Music', read_time: '4 min read', sort_order: 20,
    lines: [
      { korean: '저는 요즘 가야금을 배우고 있어요.', translation: 'I am learning the gayageum these days.' },
      { korean: '가야금은 한국 전통 악기예요.', translation: 'The gayageum is a traditional Korean instrument.' },
      { korean: '줄이 열두 개 있어요.', translation: 'It has twelve strings.' },
      { korean: '처음에는 어려웠지만 이제 익숙해졌어요.', translation: 'It was difficult at first but I have gotten used to it now.' },
      { korean: '한국 전통 음악이 정말 아름다워요.', translation: 'Traditional Korean music is really beautiful.' },
    ],
  },

  // ── School & Study ─────────────────────────────────────────
  {
    id: 'passage_topik', title: 'TOPIK 시험 준비', title_en: 'Preparing for TOPIK',
    category: 'Study', read_time: '4 min read', sort_order: 21,
    lines: [
      { korean: '저는 TOPIK 시험을 준비하고 있어요.', translation: 'I am preparing for the TOPIK exam.' },
      { korean: 'TOPIK은 한국어 능력 시험이에요.', translation: 'TOPIK is the Korean Language Proficiency Test.' },
      { korean: '매일 두 시간씩 공부해요.', translation: 'I study two hours every day.' },
      { korean: '단어와 문법을 열심히 외워요.', translation: 'I diligently memorize vocabulary and grammar.' },
      { korean: '이번 시험에서 3급을 받고 싶어요.', translation: 'I want to get level 3 on this exam.' },
      { korean: '한국어 실력이 조금씩 늘고 있어요.', translation: 'My Korean skills are improving little by little.' },
    ],
  },
  {
    id: 'passage_library', title: '도서관에서', title_en: 'At the Library',
    category: 'Study', read_time: '3 min read', sort_order: 22,
    lines: [
      { korean: '저는 학교 도서관에서 자주 공부해요.', translation: 'I often study at the school library.' },
      { korean: '도서관은 조용하고 집중하기 좋아요.', translation: 'The library is quiet and good for concentrating.' },
      { korean: '오늘은 한국어 문법책을 읽었어요.', translation: 'Today I read a Korean grammar book.' },
      { korean: '모르는 단어는 사전을 찾아봤어요.', translation: 'I looked up words I did not know in the dictionary.' },
      { korean: '공부를 마치고 친구를 만났어요.', translation: 'After finishing studying I met a friend.' },
    ],
  },
  {
    id: 'passage_exchange_student', title: '교환학생', title_en: 'Exchange Student',
    category: 'Study', read_time: '4 min read', sort_order: 23,
    lines: [
      { korean: '저는 교환학생으로 한국에 왔어요.', translation: 'I came to Korea as an exchange student.' },
      { korean: '서울에 있는 대학교에 다니고 있어요.', translation: 'I am attending a university in Seoul.' },
      { korean: '한국 친구들이 많이 생겼어요.', translation: 'I have made many Korean friends.' },
      { korean: '수업이 끝나면 같이 밥을 먹어요.', translation: 'After class we eat together.' },
      { korean: '이 경험이 정말 소중해요.', translation: 'This experience is really precious.' },
      { korean: '한국에서 더 오래 살고 싶어요.', translation: 'I want to live in Korea longer.' },
    ],
  },

  // ── Culture & Society ──────────────────────────────────────
  {
    id: 'passage_chuseok', title: '추석', title_en: 'Chuseok',
    category: 'Culture', read_time: '4 min read', sort_order: 24,
    lines: [
      { korean: '추석은 한국의 대표적인 명절이에요.', translation: 'Chuseok is a major Korean holiday.' },
      { korean: '음력 팔월 보름에 지내요.', translation: 'It is observed on the 15th day of the 8th lunar month.' },
      { korean: '가족들이 한자리에 모여요.', translation: 'Families gather together.' },
      { korean: '차례를 지내고 성묘를 해요.', translation: 'We perform ancestral rites and visit graves.' },
      { korean: '송편을 만들어서 먹어요.', translation: 'We make and eat songpyeon.' },
      { korean: '한복을 입고 사진을 찍기도 해요.', translation: 'We also wear hanbok and take photos.' },
    ],
  },
  {
    id: 'passage_hanbok', title: '한복', title_en: 'Hanbok',
    category: 'Culture', read_time: '3 min read', sort_order: 25,
    lines: [
      { korean: '한복은 한국의 전통 의상이에요.', translation: 'Hanbok is the traditional Korean clothing.' },
      { korean: '명절이나 특별한 날에 입어요.', translation: 'It is worn on holidays or special occasions.' },
      { korean: '색깔이 다양하고 아름다워요.', translation: 'The colors are varied and beautiful.' },
      { korean: '외국인들에게도 인기가 많아요.', translation: 'It is also popular with foreigners.' },
      { korean: '경복궁 근처에서 빌릴 수 있어요.', translation: 'You can rent it near Gyeongbokgung.' },
    ],
  },
  {
    id: 'passage_seollal', title: '설날', title_en: 'Lunar New Year',
    category: 'Culture', read_time: '4 min read', sort_order: 26,
    lines: [
      { korean: '설날은 음력 일월 일일이에요.', translation: 'Seollal is the first day of the lunar year.' },
      { korean: '한국에서 가장 큰 명절 중 하나예요.', translation: 'It is one of the biggest holidays in Korea.' },
      { korean: '어른들에게 세배를 드려요.', translation: 'We bow to elders.' },
      { korean: '세뱃돈을 받는 게 즐거워요.', translation: 'Receiving New Year money is fun.' },
      { korean: '온 가족이 모여 떡국을 먹어요.', translation: 'The whole family gathers to eat tteokguk.' },
      { korean: '떡국을 먹어야 나이를 한 살 더 먹는대요.', translation: 'They say you must eat tteokguk to become a year older.' },
    ],
  },
  {
    id: 'passage_bballi', title: '빨리빨리 문화', title_en: 'Bballi-Bballi Culture',
    category: 'Culture', read_time: '4 min read', sort_order: 27,
    lines: [
      { korean: '한국 사람들은 빨리빨리 하는 것을 좋아해요.', translation: 'Korean people like doing things quickly.' },
      { korean: '이것을 "빨리빨리 문화"라고 불러요.', translation: 'This is called "bballi-bballi culture".' },
      { korean: '음식 배달도 매우 빠르게 와요.', translation: 'Food delivery also comes very fast.' },
      { korean: '엘리베이터에서 닫힘 버튼을 자주 눌러요.', translation: 'People often press the close button in elevators.' },
      { korean: '이 문화 덕분에 한국이 빠르게 발전했어요.', translation: 'Thanks to this culture, Korea has developed rapidly.' },
    ],
  },
  {
    id: 'passage_jjimjilbang', title: '찜질방', title_en: 'Jjimjilbang',
    category: 'Culture', read_time: '4 min read', sort_order: 28,
    lines: [
      { korean: '찜질방은 한국의 전통 목욕 문화예요.', translation: 'Jjimjilbang is a traditional Korean bathing culture.' },
      { korean: '뜨거운 사우나 방에서 땀을 흘려요.', translation: 'You sweat in a hot sauna room.' },
      { korean: '식혜와 계란을 먹는 게 유명해요.', translation: 'Eating sikhye and eggs is famous there.' },
      { korean: '온 가족이 함께 오기도 해요.', translation: 'The whole family sometimes comes together.' },
      { korean: '밤새 있을 수도 있어요.', translation: 'You can stay overnight too.' },
    ],
  },

  // ── Technology & Modern Life ───────────────────────────────
  {
    id: 'passage_delivery', title: '배달 문화', title_en: 'Delivery Culture',
    category: 'Daily Life', read_time: '3 min read', sort_order: 29,
    lines: [
      { korean: '한국의 배달 문화는 정말 발달해 있어요.', translation: "Korea's delivery culture is really advanced." },
      { korean: '앱으로 음식을 주문하면 삼십 분 안에 와요.', translation: 'If you order food through an app, it comes within 30 minutes.' },
      { korean: '치킨, 피자, 한식 등 모든 음식을 배달시킬 수 있어요.', translation: 'You can order delivery for all kinds of food like chicken, pizza, and Korean food.' },
      { korean: '심지어 편의점 상품도 배달이 돼요.', translation: 'Even convenience store items can be delivered.' },
      { korean: '저는 요즘 배달 앱을 자주 이용해요.', translation: 'I often use delivery apps these days.' },
    ],
  },
  {
    id: 'passage_pc_bang', title: 'PC방', title_en: 'PC Bang',
    category: 'Daily Life', read_time: '3 min read', sort_order: 30,
    lines: [
      { korean: 'PC방은 한국의 독특한 문화예요.', translation: 'PC bang is a unique Korean culture.' },
      { korean: '한 시간에 보통 천 원에서 이천 원 정도예요.', translation: 'It usually costs about 1,000 to 2,000 won per hour.' },
      { korean: '빠른 인터넷으로 게임을 즐길 수 있어요.', translation: 'You can enjoy games with fast internet.' },
      { korean: '음식도 주문해서 먹을 수 있어요.', translation: 'You can also order and eat food.' },
      { korean: '밤새 있는 사람들도 많아요.', translation: 'Many people stay all night.' },
    ],
  },
];

module.exports = { passages };
