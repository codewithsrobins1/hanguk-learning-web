require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');
const admin     = require('firebase-admin');
const sa        = require('../serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(sa) });
const db     = admin.firestore();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateCloze(card) {
  // Extract the key word from sentence_parts
  const keyWord = card.sentence_parts[card.key_index];

  const prompt = `You are a Korean language teacher creating fill-in-the-blank vocabulary exercises.

Target word: "${keyWord}" (translation: "${card.translation}")

Generate a natural, conversational Korean sentence that uses this exact word form ("${keyWord}").
Then provide 3 distractor words — similar in grammar form or meaning but clearly wrong in context.

Rules:
- The sentence must feel natural, like something a real Korean speaker would say
- The sentence should make the meaning of the target word clear from context
- Distractors should be the same part of speech and similar grammatical form
- Distractors should be plausible but obviously wrong once you understand the sentence
- Keep sentences short — 6-12 words max

Respond ONLY with valid JSON, no markdown:
{
  "cloze_sentence": "저는 한국어를 ___ 싶어요.",
  "cloze_answer": "${keyWord}",
  "cloze_distractors": ["word1", "word2", "word3"],
  "cloze_translation": "I want to learn Korean."
}`;

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  });

  const text  = msg.content[0].type === 'text' ? msg.content[0].text : '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON in response');
  return JSON.parse(match[0]);
}

async function main() {
  const snap = await db.collection('flashcards').get();
  const cards = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  console.log(`Generating cloze data for ${cards.length} cards...`);

  let i = 0;
  for (const card of cards) {
    i++;
    try {
      const cloze = await generateCloze(card);
      await db.collection('flashcards').doc(card.id).update({
        cloze_sentence:    cloze.cloze_sentence,
        cloze_answer:      cloze.cloze_answer,
        cloze_distractors: cloze.cloze_distractors,
        cloze_translation: cloze.cloze_translation,
      });
      console.log(`[${i}/${cards.length}] ✓ ${card.id}`);
      await new Promise(r => setTimeout(r, 250));
    } catch (err) {
      console.error(`[${i}/${cards.length}] ✗ ${card.id}: ${err.message}`);
    }
  }
  console.log('\n✅ All cloze data generated!');
  process.exit(0);
}
main();
