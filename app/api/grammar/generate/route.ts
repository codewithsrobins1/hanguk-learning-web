import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { titleKo, titleEn, explanation, interest } = await req.json();

    if (!titleKo || !interest) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = `You are a Korean language teacher creating personalized lesson content.

Grammar point: ${titleKo} (${titleEn})
Explanation: ${explanation}
Student's interest: ${interest}

Create 5 example sentences and a short 4-line dialogue, all tailored to someone interested in "${interest}". Every example and dialogue line must naturally use the grammar point "${titleKo}".

Return ONLY valid JSON — no markdown, no explanation, no backticks — with exactly this structure:
{
  "examples": [
    { "korean": "Korean sentence", "translation": "English translation" },
    { "korean": "Korean sentence", "translation": "English translation" },
    { "korean": "Korean sentence", "translation": "English translation" },
    { "korean": "Korean sentence", "translation": "English translation" },
    { "korean": "Korean sentence", "translation": "English translation" }
  ],
  "dialogue": {
    "context": "One-line scene description (e.g. 'Two friends discussing a new game release')",
    "lines": [
      { "speaker": "A", "korean": "Korean line", "translation": "English translation" },
      { "speaker": "B", "korean": "Korean line", "translation": "English translation" },
      { "speaker": "A", "korean": "Korean line", "translation": "English translation" },
      { "speaker": "B", "korean": "Korean line", "translation": "English translation" }
    ]
  }
}

Rules:
- Every one of the 5 examples must use ${titleKo} clearly and naturally
- Examples must reference ${interest} topics, vocabulary, or scenarios
- Dialogue must be exactly 4 lines, alternating A and B speakers
- Dialogue must also use ${titleKo} at least twice across the 4 lines
- Keep Korean natural and conversational — not textbook-stiff
- Return ONLY the JSON object`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const text =
      message.content[0].type === 'text' ? message.content[0].text : '';
    const clean = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(clean);

    return NextResponse.json(data);
  } catch (err) {
    console.error('Grammar generate error:', err);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
