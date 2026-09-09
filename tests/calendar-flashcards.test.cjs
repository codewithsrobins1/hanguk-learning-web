const { test } = require('node:test');
const assert = require('node:assert/strict');
const load = require('./load-ts.cjs');
const { CALENDAR_QUESTIONS, applyCalendarQuestion } = load('data/calendar-flashcards.ts');
const { flashcards } = require('../firebase-seed/flashcards');

test('every calendar card has one blank, four distinct options, and matching filled text', () => {
  const cards = flashcards.filter(card => card.set_id === 'set_calendar');
  assert.equal(cards.length, 20);
  assert.deepEqual(new Set(cards.map(card => card.id)), new Set(Object.keys(CALENDAR_QUESTIONS)));
  for (const original of cards) {
    const card = applyCalendarQuestion(original);
    assert.equal(card.cloze_sentence.split('___').length, 2);
    assert.equal(card.cloze_distractors.length, 3);
    assert.equal(new Set([card.cloze_answer, ...card.cloze_distractors]).size, 4);
    assert.equal(card.sentence_parts.join(''), card.cloze_sentence.replace('___', card.cloze_answer));
    assert.equal(card.id, original.id);
    assert.equal(card.sort_order, original.sort_order);
  }
});

test('Friday has an explicit Thursday clue and unrelated sets stay untouched', () => {
  const card = CALENDAR_QUESTIONS.card_cal5;
  assert.equal(card.cloze_answer, '금요일');
  assert.match(card.cloze_sentence, /목요일 다음 날/);
  const other = { id: 'card_cal5', set_id: 'another_set' };
  assert.equal(applyCalendarQuestion(other), other);
});

test('stale audio is discarded; matching audio and learner progress identifiers survive', () => {
  const original = flashcards.find(card => card.id === 'card_cal5');
  const card = applyCalendarQuestion({ ...original, cloze_sentence: '나는 ___을 기다리고 있어요.', cloze_answer: '금요일', audio_url: 'old.mp3' });
  assert.equal(card.audio_url, undefined);
  const current = applyCalendarQuestion({ ...card, audio_url: 'corrected.mp3' });
  assert.equal(current.audio_url, 'corrected.mp3');
});
