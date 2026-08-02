import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { word, sentence } = await req.json();

    if (!word || !sentence) {
      return NextResponse.json({ error: 'Missing word or sentence' }, { status: 400 });
    }

    const prompt = `A Korean learner is reading a passage and tapped on a word or phrase they didn't understand.

Full sentence: "${sentence}"
Word/phrase tapped: "${word}"

Give the meaning of that word/phrase AS USED in this specific sentence — if it's a conjugated verb or has a particle attached, give the core meaning in context rather than a dictionary headword. This is displayed inline as "word — definition" in a compact list, so keep it VERY short: 1-4 words, not a full sentence. No Korean in the response, no trailing period.

Examples of the target length: "I" · "friend" · "went (past tense)" · "at, in (location)" · "really, very".

Respond ONLY with valid JSON, no markdown:
{ "definition": "short definition here" }`;

    const message = await claude.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '{}';
    const clean = raw.replace(/```json|```/g, '').trim();
    const { definition } = JSON.parse(clean);

    if (!definition) throw new Error('Malformed definition response');

    return NextResponse.json({ definition });
  } catch (err) {
    console.error('Word definition error:', err);
    return NextResponse.json({ error: 'Failed to get definition' }, { status: 500 });
  }
}
