require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');
const admin     = require('firebase-admin');
const sa        = require('../serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(sa) });
const db     = admin.firestore();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateIntro(pattern) {
  const prompt = `You are a Korean language teacher writing a brief, clear pattern summary for beginner/intermediate learners.

Pattern: "${pattern.frame}" — ${pattern.frame_translation}
Category: ${pattern.category}
Existing explanation: ${pattern.explanation}

Generate:
1. A "rule" — the specific grammatical rule a learner MUST know to use this pattern correctly. Focus on:
   - Consonant vs vowel stem rules (if applicable)
   - Which form to attach to (verb stem, noun, adjective, etc.)
   - Any important exceptions or notes
   Keep it to 1-2 sentences, very clear and practical.

   IMPORTANT: many Korean patterns require a euphonic connector that changes based on whether the
   preceding stem ends in a consonant or vowel (e.g. -(으)ㄹ, -아/어/해, -았/었/했, -(으)면, -(으)려고).
   Only claim "no consonant/vowel distinction" when that is actually true for THIS specific pattern
   (e.g. -고 싶어요, -지만, -고 나서 genuinely never change). If the pattern's frame text shows one
   worked-example conjugation (like "할" or "해도", which come from 하다 specifically), do not describe
   that conjugated fragment as if it were a fixed, universal suffix — explain the real underlying rule
   instead, with a correct example for both a vowel-ending and a consonant-ending stem where relevant.

2. Four natural example sentences showing the pattern used correctly in everyday situations.
   Each example should use different vocabulary to show variety, correctly conjugated per the real rule
   above (not just the frame's literal text pasted after each verb).

Respond ONLY with valid JSON, no markdown:
{
  "rule": "Attach -(으)면 to the verb/adjective stem: use -면 after vowel-ending stems (가다 -> 가면) and -으면 after consonant-ending stems (먹다 -> 먹으면).",
  "examples": [
    { "korean": "날씨가 좋으면 산책해요", "translation": "If the weather is nice, I go for a walk" },
    { "korean": "시간이 있으면 전화하세요", "translation": "Call me if you have time" },
    { "korean": "한국에 가면 김치를 먹을 거예요", "translation": "If I go to Korea, I'll eat kimchi" },
    { "korean": "일이 끝나면 집에 가요", "translation": "When work is over, I go home" }
  ]
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
  const snap     = await db.collection('patterns').get();
  const patterns = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  console.log(`Generating intros for ${patterns.length} patterns...`);

  let i = 0;
  for (const pattern of patterns) {
    i++;
    try {
      const intro = await generateIntro(pattern);
      await db.collection('patterns').doc(pattern.id).update({
        rule:     intro.rule,
        examples: intro.examples,
      });
      console.log(`[${i}/${patterns.length}] ✓ ${pattern.frame}`);
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.error(`[${i}/${patterns.length}] ✗ ${pattern.frame}: ${err.message}`);
    }
  }
  console.log('\n✅ All pattern intros generated!');
  process.exit(0);
}
main();
