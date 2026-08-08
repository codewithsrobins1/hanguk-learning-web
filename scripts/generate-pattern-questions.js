require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');
const admin = require('firebase-admin');
const sa = require('../serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateRounds(pattern) {
  const prompt = `You are a Korean language teacher building slot-fill practice exercises.

Pattern: "${pattern.frame}" — ${pattern.frame_translation}
Explanation: ${pattern.explanation}

Generate 4 rounds of practice. Each round has 5 questions.
Round 1: very common everyday vocabulary (food, places, basic verbs)
Round 2: slightly more varied vocabulary, different situations
Round 3: mix of round 1+2 vocab, requires distinguishing this pattern from similar ones
Round 4: challenging vocabulary, nuanced contexts, tests deeper understanding

For each question provide:
- slot: the Korean word/phrase that fills the blank (in Korean)
- slot_translation: English meaning of the slot word
- context: a short English sentence describing the situation (e.g. "You are at a restaurant and want to eat")
- full_sentence: the complete Korean sentence with slot filled in naturally
- sentence_translation: full English translation
- options: array of exactly 4 Korean slot words (the correct one + 3 plausible wrong ones from similar patterns or common mistakes)
- answer_index: index of the correct answer in options array (0-3)

CRITICAL: the correct option's text must appear verbatim inside full_sentence — it is literally the
text that fills the blank, so it must already be in its correctly conjugated/particled form exactly as
it appears in the sentence. NEVER use the bare dictionary/citation form (ending in unconjugated -다,
e.g. "먹다", "가다") as the correct option unless the pattern's blank genuinely calls for the dictionary
form itself.

CRITICAL — distractor design: at most ONE of the 3 wrong options may share the correct answer's verb.
NEVER make 2 or 3 of the wrong options the same verb as the answer — if a learner can eliminate options
just by noticing which ones "look like" the right verb, the question stops testing whether they
understood the context at all, which defeats the point of a context-based exercise. Build the 3 wrong
options exactly like this:
  - AT MOST one wrong option: the SAME verb as the correct answer, but a different/incorrect ending
    (tests whether the learner recognizes this pattern's correct form). It is fine to have zero of
    these and use a different verb instead — just never more than one.
  - The remaining wrong options (at least two): DIFFERENT verbs than the correct answer — each one a
    distinct verb from each other too, not variants of one alternate verb — correctly conjugated with
    the SAME pattern ending as the correct answer, but semantically wrong for this context. This forces
    the learner to actually read and understand the English context to rule them out, not just spot the
    right-looking suffix.
Before finalizing each question, check: of the 3 wrong options, how many share the answer's verb? If
the count is 2 or more, replace extras with different verbs until at most 1 remains.
Make sure the different-verb distractors are plausible enough to require thinking (not absurd), but
clearly wrong once you understand the context.

Respond ONLY with valid JSON, no markdown:
{
  "rounds": [
    {
      "round": 1,
      "questions": [
        {
          "slot": "이해할 수 없어요",
          "slot_translation": "can't understand",
          "context": "The explanation is confusing and you cannot understand it",
          "full_sentence": "그 설명을 이해할 수 없어요",
          "sentence_translation": "I can't understand that explanation",
          "options": ["이해할 수 없어요", "이해했어요", "먹을 수 없어요", "갈 수 없어요"],
          "answer_index": 0
        }
      ]
    }
  ]
}`;

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = msg.content[0].type === 'text' ? msg.content[0].text : '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON in response');
  return JSON.parse(match[0]).rounds;
}

async function main() {
  const onlyIds = process.argv.slice(2);
  const snap = await db.collection('patterns').get();
  let patterns = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  if (onlyIds.length) {
    patterns = patterns.filter((p) => onlyIds.includes(p.id));
  }
  console.log(`Generating questions for ${patterns.length} patterns...`);

  let i = 0;
  for (const pattern of patterns) {
    i++;
    console.log(`[${i}/${patterns.length}] ${pattern.frame}`);
    try {
      const rounds = await generateRounds(pattern);
      await db.collection('patterns').doc(pattern.id).update({ rounds });
      console.log(`  ✓ ${rounds.length} rounds generated`);
      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
    }
  }
  console.log('\n✅ All pattern questions generated!');
  process.exit(0);
}
main();
