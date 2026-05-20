import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { titleKo, titleEn, explanation, interest } = await req.json();

    if (!titleKo || !interest) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const prompt = `You are a Korean language teacher creating personalized lesson content.

Grammar point: ${titleKo} (${titleEn})
Explanation: ${explanation}
Student's interest: ${interest}

Output each item on its own line as a JSON object. Nothing else — no markdown, no code blocks, no extra text.

Output exactly 5 example sentences first (one JSON object per line):
{"type":"example","korean":"Korean sentence here","translation":"English translation here"}

Then output the dialogue context (one line):
{"type":"context","text":"One-line scene description"}

Then output exactly 4 dialogue lines alternating A and B (one per line):
{"type":"line","speaker":"A","korean":"Korean line here","translation":"English translation here"}

Rules:
- Every example must use ${titleKo} naturally and clearly
- All examples and dialogue must reference ${interest} topics or scenarios
- Dialogue must use ${titleKo} at least twice across 4 lines
- Keep Korean natural and conversational
- Each JSON object on its own line — nothing else`;

    const stream = client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.error('Grammar generate error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to generate content' }),
      { status: 500 }
    );
  }
}
