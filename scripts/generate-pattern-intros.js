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

2. Four natural example sentences showing the pattern used correctly in everyday situations.
   Each example should use different vocabulary to show variety.

Respond ONLY with valid JSON, no markdown:
{
  "rule": "Attach 고 싶어요 directly to the verb stem. No consonant/vowel distinction needed.",
  "examples": [
    { "korean": "커피를 마시고 싶어요", "translation": "I want to drink coffee" },
    { "korean": "한국에 가고 싶어요", "translation": "I want to go to Korea" },
    { "korean": "친구를 만나고 싶어요", "translation": "I want to meet a friend" },
    { "korean": "영화를 보고 싶어요", "translation": "I want to watch a movie" }
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
