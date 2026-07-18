require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');
const admin     = require('firebase-admin');
const sa        = require('../serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(sa) });
const db     = admin.firestore();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateStemExamples(pattern) {
  const prompt = `You are a Korean grammar teacher building a "stem breakdown" table for a pattern practice app.

Pattern: "${pattern.frame}" — ${pattern.frame_translation}
Explanation: ${pattern.explanation}
Rule: ${pattern.rule || 'N/A'}

Some patterns attach to a verb/adjective STEM (the dictionary form minus 다), e.g. "~고 싶어요" attaches to a verb stem: 먹다 → 먹 + 고 싶어요. Others are fixed expressions, particle patterns, or otherwise don't involve stem+suffix attachment at all (e.g. "얼마예요?", "대박이에요!", topic/subject particle patterns).

Task: Decide if this pattern is genuinely a STEM + SUFFIX attachment where showing 2 example verbs/adjectives broken into stem + the pattern's fixed suffix would help a learner conjugate it correctly. If yes, provide exactly 2 example pairs using different, common verbs or adjectives appropriate to the pattern's register. If no, return an empty array — do not force a table onto a pattern that doesn't decompose this way.

Respond ONLY with valid JSON, no markdown:
{
  "stem_examples": [
    { "base": "먹다", "stem": "먹" },
    { "base": "가다", "stem": "가" }
  ]
}`;

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  });

  const text  = msg.content[0].type === 'text' ? msg.content[0].text : '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON in response');
  const data = JSON.parse(match[0]);
  if (!Array.isArray(data.stem_examples)) throw new Error('stem_examples missing/not an array');
  return data.stem_examples;
}

async function main() {
  const snap     = await db.collection('patterns').get();
  const patterns = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  console.log(`Generating stem breakdowns for ${patterns.length} patterns...`);

  let withTable = 0;
  let i = 0;
  for (const pattern of patterns) {
    i++;
    try {
      const stem_examples = await generateStemExamples(pattern);
      await db.collection('patterns').doc(pattern.id).update({ stem_examples });
      if (stem_examples.length > 0) withTable++;
      console.log(`[${i}/${patterns.length}] ${stem_examples.length > 0 ? '✓' : '·'} ${pattern.frame} (${stem_examples.length} pairs)`);
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.error(`[${i}/${patterns.length}] ✗ ${pattern.frame}: ${err.message}`);
    }
  }
  console.log(`\n✅ Done! ${withTable}/${patterns.length} patterns got a stem breakdown table.`);
  process.exit(0);
}
main();
