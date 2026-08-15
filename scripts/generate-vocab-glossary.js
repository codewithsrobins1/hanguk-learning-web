// Backfills base_form + gloss for every flashcard — the dictionary/citation
// form of the target word (infinitive -다 form for verbs/adjectives,
// unchanged for nouns) and a short English definition. Used by the
// "Preview words" glossary modal on the set detail page, kept deliberately
// separate from the conjugated quiz word (sentence_parts[key_index] /
// cloze_answer) so previewing a set's vocab doesn't hand the learner the
// exact conjugated form they'll be quizzed on.
require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');
const { getDb, cleanupAdc } = require('./lib/firebaseAdmin');
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateGlossEntry(card) {
  const word = card.sentence_parts[card.key_index];
  const prompt = `A Korean vocabulary flashcard drills this target word: "${word}"
Full example sentence it's conjugated from: "${card.sentence_parts.join('')}"
English translation of that sentence: "${card.translation}"

Task: identify the word's dictionary/citation form and give a short English gloss.
- If the target word is an ACTION VERB (conjugated, e.g. ends in -아요/어요/했어요/할게요/
  고 싶어요/지 않아요/etc.), give its dictionary form ending in -다 (e.g. "공부해요" -> "공부하다",
  "만났어요" -> "만나다", "먹었어요" -> "먹다", "들어요" -> "듣다" — watch for irregular
  conjugations). Gloss it as "to ___" (e.g. "to study", "to meet", "to eat", "to listen").
- If the target word is a DESCRIPTIVE ADJECTIVE (a 형용사 — conjugated the same way but describes
  a quality/state, e.g. "뜨거워요", "예뻐요", "피곤해요"), give its -다 dictionary form (e.g.
  "뜨겁다", "예쁘다", "피곤하다") but gloss it as a plain English adjective, NOT "to be ___"
  (e.g. "hot", "pretty", "tired").
- If the target word is a NOUN or already a bare dictionary form (not conjugated), keep it
  exactly as given for base_form. Gloss it as just the noun's meaning, 1-3 words
  (e.g. "apple", "student", "weather").
Keep the gloss short — a dictionary-entry length definition, not a sentence.

Respond ONLY with valid JSON, no markdown:
{ "base_form": "공부하다", "gloss": "to study" }`;

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 200,
    messages: [{ role: 'user', content: prompt }],
  });
  const text = msg.content[0].type === 'text' ? msg.content[0].text : '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON in response');
  return JSON.parse(match[0]);
}

async function main() {
  const db = getDb('prod');
  const onlyIds = process.argv.slice(2);
  const snap = await db.collection('flashcards').get();
  let cards = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  if (onlyIds.length) cards = cards.filter((c) => onlyIds.includes(c.id));

  console.log(`Generating glossary entries for ${cards.length} flashcards...`);

  let i = 0;
  let failed = 0;
  for (const card of cards) {
    i++;
    try {
      const { base_form, gloss } = await generateGlossEntry(card);
      await db.collection('flashcards').doc(card.id).update({ base_form, gloss });
      console.log(`[${i}/${cards.length}] ✓ ${card.id}: ${card.sentence_parts[card.key_index]} -> ${base_form} (${gloss})`);
      await new Promise((r) => setTimeout(r, 200));
    } catch (err) {
      failed++;
      console.error(`[${i}/${cards.length}] ✗ ${card.id}: ${err.message}`);
    }
  }
  console.log(`\n✅ Done — ${cards.length - failed} generated, ${failed} failed.`);
  cleanupAdc();
  process.exit(0);
}

main().catch((err) => {
  console.error('Generation failed:', err);
  process.exit(1);
});
