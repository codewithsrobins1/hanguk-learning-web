export type FlashcardSet = {
  id: string;
  title: string;
  icon: string;
  category: string;
  card_count: number;
  sort_order: number;
  mastery_count?: number; // computed client-side
};

export type Flashcard = {
  id: string;
  set_id: string;
  sentence_parts: string[];
  key_index: number;
  translation: string;
  sort_order: number;
};

export type Passage = {
  id: string;
  title: string;
  title_en: string;
  category: string;
  read_time: string;
  lines: { korean: string; translation: string }[];
  sort_order: number;
};

export type ComprehensionQuestion = {
  id: string;
  passage_id: string;
  question: string;
  question_translated: string;
  options: string[];
  options_translated: string[];
  answer_index: number;
  sort_order: number;
};

export type UserCardProgress = {
  id: string;
  user_id: string;
  card_id: string;
  known: boolean;
  review_count: number;
  last_reviewed: string;
};

export type UserPassageProgress = {
  id: string;
  user_id: string;
  passage_id: string;
  score: number;
  total_questions: number;
  completed_at: string;
};

export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
};

export type HangulCharacter = {
  char: string;
  romanization: string;
  sound: string;
};
