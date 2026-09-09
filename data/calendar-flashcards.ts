import type { Flashcard, FlashcardWithCloze } from '@/types';

// Reviewed replacements for the generated calendar questions. The Korean clue
// must identify one answer without requiring the hidden English translation.
const questions: [string, string, string[], string, string][] = [
  ['일요일 다음 날은 ___이에요.', '월요일', ['화요일', '목요일', '토요일'], 'The day after Sunday is Monday.', 'Monday'],
  ['월요일 다음 날은 ___이에요.', '화요일', ['수요일', '금요일', '일요일'], 'The day after Monday is Tuesday.', 'Tuesday'],
  ['화요일과 목요일 사이에 있는 날은 ___이에요.', '수요일', ['월요일', '금요일', '토요일'], 'The day between Tuesday and Thursday is Wednesday.', 'Wednesday'],
  ['금요일 바로 전날은 ___이에요.', '목요일', ['화요일', '토요일', '일요일'], 'The day immediately before Friday is Thursday.', 'Thursday'],
  ['목요일 다음 날은 ___이에요.', '금요일', ['월요일', '수요일', '일요일'], 'The day after Thursday is Friday.', 'Friday'],
  ['금요일과 일요일 사이에 있는 날은 ___이에요.', '토요일', ['월요일', '화요일', '목요일'], 'The day between Friday and Sunday is Saturday.', 'Saturday'],
  ['토요일 다음 날은 ___이에요.', '일요일', ['월요일', '수요일', '금요일'], 'The day after Saturday is Sunday.', 'Sunday'],
  ['일 년의 첫 번째 달은 ___이에요.', '일월', ['삼월', '오월', '팔월'], 'The first month of the year is January.', 'January'],
  ['이월 다음 달은 ___이에요.', '삼월', ['일월', '오월', '팔월'], 'The month after February is March.', 'March'],
  ['사월과 유월 사이에 있는 달은 ___이에요.', '오월', ['일월', '삼월', '십이월'], 'The month between April and June is May.', 'May'],
  ['칠월 다음 달은 ___이에요.', '팔월', ['삼월', '오월', '십이월'], 'The month after July is August.', 'August'],
  ['일 년의 마지막 달은 ___이에요.', '십이월', ['일월', '삼월', '팔월'], 'The last month of the year is December.', 'December'],
  ['오늘이 포함된 주는 ___예요.', '이번 주', ['지난주', '다음 주', '다다음 주'], 'The week that includes today is this week.', 'this week'],
  ['이번 주 바로 전 주는 ___예요.', '지난주', ['이번 주', '다음 주', '다다음 주'], 'The week immediately before this week is last week.', 'last week'],
  ['이번 주에서 한 주 뒤는 ___예요.', '다음 주', ['지난주', '이번 주', '다다음 주'], 'One week after this week is next week.', 'next week'],
  ['오늘이 포함된 달은 ___이에요.', '이번 달', ['지난달', '다음 달', '다다음 달'], 'The month that includes today is this month.', 'this month'],
  ['이번 달 바로 전 달은 ___이에요.', '지난달', ['이번 달', '다음 달', '다다음 달'], 'The month immediately before this month is last month.', 'last month'],
  ['작년과 내년 사이의 해는 ___예요.', '올해', ['작년', '내년', '재작년'], 'The year between last year and next year is this year.', 'this year'],
  ['올해가 2026년이면, ___은 2027년이에요.', '내년', ['작년', '올해', '재작년'], 'If this year is 2026, next year is 2027.', 'next year'],
  ['“오늘은 ___이에요?” “월요일이에요.”', '무슨 요일', ['몇 월', '몇 시', '며칠'], '“What day of the week is today?” “It is Monday.”', 'what day of the week'],
];

export const CALENDAR_QUESTIONS: Record<string, Omit<FlashcardWithCloze, 'id' | 'set_id' | 'sort_order'>> =
  Object.fromEntries(questions.map(([sentence, answer, distractors, translation, gloss], index) => {
    const [before, after] = sentence.split('___');
    return [`card_cal${index + 1}`, {
      sentence_parts: [before, answer, after], key_index: 1, translation,
      base_form: answer, gloss,
      cloze_sentence: sentence, cloze_answer: answer,
      cloze_distractors: distractors, cloze_translation: translation,
    }];
  }));

export function applyCalendarQuestion<T extends Flashcard>(card: T): T {
  const replacement = card.set_id === 'set_calendar' ? CALENDAR_QUESTIONS[card.id] : undefined;
  if (!replacement) return card;
  // Preserve a recording only when it already matches the reviewed sentence.
  const existing: Flashcard & Partial<FlashcardWithCloze> = card;
  const audioMatches = existing.cloze_sentence === replacement.cloze_sentence
    && existing.cloze_answer === replacement.cloze_answer;
  return { ...card, ...replacement, audio_url: audioMatches ? existing.audio_url : undefined };
}
