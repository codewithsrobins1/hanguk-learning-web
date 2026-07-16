require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');
const admin = require('firebase-admin');
const sa = require('../serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const VERSIONS = ['A', 'B'];

const LEVEL_INFO = {
  1: {
    section: 'TOPIK I',
    vocab: '~800 of the most basic words',
    grammar:
      '이에요/예요, 있어요/없어요, basic particles 은/는/이/가/을/를/에/에서, simple present tense verbs and adjectives',
    topics:
      'greetings, self-introduction, family, numbers, days/dates, basic shopping, food, daily routine',
  },
  2: {
    section: 'TOPIK I',
    vocab: '~1500-2000 words',
    grammar:
      'past and future tense, more particles, basic connectors 고/지만/아서/어서, adjectives, simple honorifics',
    topics:
      'daily life, hobbies, weather, transportation, simple plans, health, simple invitations',
  },
  3: {
    section: 'TOPIK II',
    vocab: '~3000 words',
    grammar:
      'intermediate connectors (으)면서/(으)ㄴ데/기 때문에, indirect speech basics, simple passive/causative forms, natural conversational sentence patterns',
    topics:
      'workplace, social situations, giving opinions, comparing things, simple arguments, making plans with others',
  },
  4: {
    section: 'TOPIK II',
    vocab: '~4000-5000 words',
    grammar:
      'complex connectors, honorifics in formal contexts, reported/indirect speech, nominalization (기/음), passive and causative forms',
    topics:
      'news topics, social issues, abstract topics, work/school life, media, environment',
  },
  5: {
    section: 'TOPIK II',
    vocab: '~6000+ words, some idiomatic expressions',
    grammar:
      'advanced grammar patterns, formal/written register (-다 style), academic sentence structures, nuanced connectors',
    topics:
      'academic topics, professional contexts, cultural analysis, editorials, business communication',
  },
  6: {
    section: 'TOPIK II',
    vocab: 'near-native vocabulary including 사자성어 (4-character idioms) and literary expressions',
    grammar:
      'nuanced literary and formal grammar, complex embedded clauses, sophisticated argumentative structures',
    topics:
      'literature, politics, economics, philosophy, nuanced argumentation, abstract editorial writing',
  },
};

function buildPrompt(level, version) {
  const info = LEVEL_INFO[level];
  return `You are an expert TOPIK (Test of Proficiency in Korean) item writer. Create a full practice test for TOPIK Level ${level} (${info.section}), version ${version}.

Level profile:
- Vocabulary range: ${info.vocab}
- Grammar in scope: ${info.grammar}
- Typical topics: ${info.topics}

Generate exactly 15 reading_questions and exactly 5 listening_questions, calibrated so a real TOPIK Level ${level} candidate would find this test appropriately challenging (not too easy, not above the level).

Reading questions (15 total):
- 5 of type "fill_blank": a Korean sentence with a blank, testing vocabulary or grammar in context (no passage needed)
- 5 of type "grammar": tests correct grammar usage/particle/conjugation choice (no passage needed)
- 5 of type "reading_comprehension": include a short Korean passage (2-5 sentences, appropriate length/complexity for the level) and a question about it

Listening questions (5 total):
- Each has a short Korean dialogue or announcement script (2-4 lines, natural spoken Korean for the level) and a comprehension question about it
- Do NOT include audio_url — that is added in a later step

Rules:
- All Korean text must be natural and level-appropriate — do not use vocabulary or grammar above the stated level
- Every question needs exactly 4 options in Korean (or English only if the question itself is about English translation, which should be rare)
- Wrong options must be plausible, not random or silly
- answer_index is 0-based (0-3)
- Do not include circled numbers (①②③④) in the option text itself — just the plain text

IMPORTANT: reading_questions MUST contain EXACTLY 15 items (5 fill_blank + 5 grammar + 5 reading_comprehension — count them before you finish) and listening_questions MUST contain EXACTLY 5 items. Do not stop early or summarize — write out every question in full.

Respond ONLY with valid JSON, no markdown, no explanation:
{
  "reading_questions": [
    {
      "type": "fill_blank",
      "passage": null,
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "answer_index": 0
    }
  ],
  "listening_questions": [
    {
      "script": "...",
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "answer_index": 0
    }
  ]
}`;
}

async function generateTestOnce(level, version) {
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 8192,
    messages: [{ role: 'user', content: buildPrompt(level, version) }],
  });

  const text = msg.content[0].type === 'text' ? msg.content[0].text : '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON in response');
  const data = JSON.parse(match[0]);

  if (!Array.isArray(data.reading_questions) || data.reading_questions.length !== 15) {
    throw new Error(`Expected 15 reading_questions, got ${data.reading_questions?.length}`);
  }
  if (!Array.isArray(data.listening_questions) || data.listening_questions.length !== 5) {
    throw new Error(`Expected 5 listening_questions, got ${data.listening_questions?.length}`);
  }
  return data;
}

const READING_TYPES = ['fill_blank', 'grammar', 'reading_comprehension'];

function buildTypePrompt(level, version, type) {
  const info = LEVEL_INFO[level];
  const typeInstructions = {
    fill_blank:
      'type "fill_blank": a Korean sentence with a blank, testing vocabulary or grammar in context. Set "passage" to null.',
    grammar:
      'type "grammar": tests correct grammar usage/particle/conjugation choice. Set "passage" to null.',
    reading_comprehension:
      'type "reading_comprehension": include a short Korean passage (2-5 sentences, appropriate length/complexity for the level) in "passage", and a question about it in "question".',
  };

  return `You are an expert TOPIK (Test of Proficiency in Korean) item writer. Create exactly 5 reading questions of ${typeInstructions[type]}

This is for TOPIK Level ${level} (${info.section}), version ${version}.
Vocabulary range: ${info.vocab}
Grammar in scope: ${info.grammar}
Typical topics: ${info.topics}

Rules:
- All Korean text must be natural and level-appropriate
- Every question needs exactly 4 options in Korean
- Wrong options must be plausible, not random or silly
- answer_index is 0-based (0-3)
- No circled numbers (①②③④) in option text

Respond ONLY with valid JSON containing EXACTLY 5 items, no markdown, no explanation:
{
  "questions": [
    { "type": "${type}", "passage": null, "question": "...", "options": ["...", "...", "...", "..."], "answer_index": 0 }
  ]
}`;
}

async function generateFive(prompt) {
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });
  const text = msg.content[0].type === 'text' ? msg.content[0].text : '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON in response');
  const data = JSON.parse(match[0]);
  if (!Array.isArray(data.questions) || data.questions.length !== 5) {
    throw new Error(`Expected 5 items, got ${data.questions?.length}`);
  }
  return data.questions;
}

async function generateTestSplit(level, version) {
  const reading_questions = [];
  for (const type of READING_TYPES) {
    console.log(`    generating ${type}...`);
    reading_questions.push(...(await generateFive(buildTypePrompt(level, version, type))));
    await new Promise((r) => setTimeout(r, 300));
  }
  console.log(`    generating listening...`);
  const listening_questions = await generateFive(buildTypePromptListening(level, version));
  return { reading_questions, listening_questions };
}

function buildTypePromptListening(level, version) {
  const info = LEVEL_INFO[level];
  return `You are an expert TOPIK item writer. Create exactly 5 listening questions for TOPIK Level ${level} (${info.section}), version ${version}.
Vocabulary range: ${info.vocab}
Grammar in scope: ${info.grammar}
Typical topics: ${info.topics}

Each item has a short Korean dialogue or announcement script (2-4 lines, natural spoken Korean for the level) and a comprehension question about it. Do NOT include audio_url.

Rules:
- Every question needs exactly 4 options in Korean
- Wrong options must be plausible, not random
- answer_index is 0-based (0-3)
- No circled numbers in option text

Respond ONLY with valid JSON containing EXACTLY 5 items, no markdown, no explanation:
{
  "questions": [
    { "script": "...", "question": "...", "options": ["...", "...", "...", "..."], "answer_index": 0 }
  ]
}`;
}

async function generateTest(level, version, attempts = 3) {
  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await generateTestOnce(level, version);
    } catch (err) {
      lastErr = err;
      console.error(`  (attempt ${i}/${attempts} failed: ${err.message})`);
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  console.error(`  falling back to split generation (per-type calls)...`);
  return generateTestSplit(level, version);
}

async function isAlreadyValid(id) {
  const snap = await db.collection('topik_tests').doc(id).get();
  if (!snap.exists) return false;
  const data = snap.data();
  return (
    Array.isArray(data.reading_questions) &&
    data.reading_questions.length === 15 &&
    Array.isArray(data.listening_questions) &&
    data.listening_questions.length === 5
  );
}

async function main() {
  const jobs = [];
  for (let level = 1; level <= 6; level++) {
    for (const version of VERSIONS) {
      jobs.push({ level, version });
    }
  }

  console.log(`Generating ${jobs.length} TOPIK tests...`);

  let i = 0;
  for (const { level, version } of jobs) {
    i++;
    const id = `topik_l${level}_${version.toLowerCase()}`;
    const section = LEVEL_INFO[level].section;
    const title = `${section} · Level ${level} · Test ${version}`;
    console.log(`[${i}/${jobs.length}] ${title}`);

    if (await isAlreadyValid(id)) {
      console.log(`  ↷ already valid, skipping`);
      continue;
    }

    try {
      const { reading_questions, listening_questions } = await generateTest(level, version);
      await db.collection('topik_tests').doc(id).set({
        id,
        level,
        version,
        title,
        reading_questions,
        listening_questions,
      });
      console.log(`  ✓ ${reading_questions.length} reading + ${listening_questions.length} listening`);
      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
    }
  }

  console.log('\n✅ All TOPIK tests generated!');
  process.exit(0);
}

main();
