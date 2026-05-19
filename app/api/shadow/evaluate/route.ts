import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const openai  = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const claude  = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio    = formData.get('audio') as Blob;
    const expected = formData.get('expected') as string;

    if (!audio || !expected) {
      return NextResponse.json({ error: 'Missing audio or expected text' }, { status: 400 });
    }

    // ── Step 1: Transcribe with Whisper ─────────────────────
    const mimeType  = audio.type || 'audio/webm';
    const extension = mimeType.includes('mp4') ? 'mp4' : 'webm';
    const audioFile = new File([audio], `recording.${extension}`, { type: mimeType });

    const transcription = await openai.audio.transcriptions.create({
      file:     audioFile,
      model:    'whisper-1',
      language: 'ko',
    });

    const transcript = transcription.text.trim();

    // ── Step 2: Grade with Claude Haiku ─────────────────────
    const message = await claude.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [{
        role: 'user',
        content: `You are a friendly Korean pronunciation coach giving quick feedback to a learner.

Expected Korean: "${expected}"
What they said (transcribed): "${transcript}"

Compare what they said to what was expected. Consider:
- Korean double consonants (쌍자음: ㄲ ㄸ ㅃ ㅆ ㅉ) are hard for learners — be lenient
- Homophones and near-homophones count as correct
- Whisper sometimes mishears Korean slightly — give benefit of the doubt

Respond ONLY with valid JSON, no markdown, no explanation:
{ "score": <0-100>, "feedback": "<one short encouraging sentence, max 12 words>" }

Score guide: 90-100 near perfect · 75-89 good · 60-74 needs work · 0-59 try again`,
      }],
    });

    const raw   = message.content[0].type === 'text' ? message.content[0].text : '{}';
    const clean = raw.replace(/```json|```/g, '').trim();
    const { score, feedback } = JSON.parse(clean);

    return NextResponse.json({ score, feedback, transcript });
  } catch (err) {
    console.error('Shadow evaluate error:', err);
    return NextResponse.json({ error: 'Evaluation failed' }, { status: 500 });
  }
}
