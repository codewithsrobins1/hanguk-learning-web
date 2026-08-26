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

CRITICAL — vocabulary level: this app is for BEGINNER learners, roughly a 1st-3rd grade reading
level in their own language. ALL FOUR ROUNDS must use simple, everyday, concrete vocabulary — do
NOT escalate difficulty across rounds. Every question across every round should be drawn from the
same basic pool: food, drinks, family, common objects, places (school, home, store, park), daily
routine actions (eat, drink, go, sleep, meet, watch, read, buy, study, play), simple feelings (happy,
tired, hungry). Contexts should be simple, concrete, one-sentence situations a child could picture —
"you are hungry and want to eat," "you are meeting a friend at school" — never abstract or conceptual
topics (e.g. nothing about adapting to a new culture, workplace/business scenarios, policy, academic
or professional contexts, negotiations, or nuanced emotional/social situations). Vary the vocabulary
and context between the 5 questions within each round so they don't feel repetitive, but keep every
single one at this same easy level — rounds exist for repetition/practice, not to get harder.

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

CRITICAL — stay on pattern: full_sentence must actually contain and correctly apply THIS pattern's own
distinctive grammar marker, not drift into a generic fallback that happens to be simpler. For example,
if the pattern is "...랑 비슷한 것 같아요" (seems similar to X), every sentence must include an actual
comparison target with 랑/이랑 + 비슷한 — a sentence that's just "...는 것 같아요" with no comparison
at all is WRONG, even though it's shorter/simpler, because it no longer tests this pattern. The same
applies to any pattern with its own required piece (은/는 좀 아닌, 같은 느낌, 에 동의해요, 을/를 잘해요,
처럼, etc.) — keeping vocabulary simple must never mean dropping the pattern's actual grammar structure.
Before finalizing, re-read the pattern's frame and confirm every single question genuinely uses it.

CRITICAL — sentence formation: full_sentence must be either ONE grammatically complete clause, or (if
you genuinely need two) two full sentences properly separated by a period — NEVER two sentence-final
endings glued together with just a space (e.g. "엄마가 물을 샀어요 몰랐어요." is WRONG; it must be
"엄마가 물을 샀다는 걸 몰랐어요." as one clause, or "엄마가 물을 샀어요. 몰랐어요." as two). Also
double-check spacing: a noun/object is a separate word from the verb that follows it and needs a space
(e.g. "물 주세요" is correct, "물주세요" is NOT — same for "밥 주세요", "이름이 뭐예요", etc.). Watch
irregular conjugations carefully (르-irregular: 부르다 → 부를 수 있어요, not 부르 수 있어요; ㄷ-irregular:
듣다 → 들어요; ㅂ-irregular: 어렵다 → 어려워요) — get these exactly right.

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
