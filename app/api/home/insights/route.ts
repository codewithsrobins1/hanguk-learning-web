import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type CategorySignal = {
  label: string;
  doneLastWeek: number;
  target: number;
  daysSinceLastActivity: number | null;
  lifetimeDone: number;
  lifetimeTotal: number;
};

export async function POST(req: NextRequest) {
  try {
    const { level, xp, currentStreak, categories } = await req.json();

    if (!Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json({ error: 'Missing categories' }, { status: 400 });
    }

    const categoryLines = (categories as CategorySignal[]).map((c) => {
      const last = c.daysSinceLastActivity === null
        ? 'never practiced'
        : c.daysSinceLastActivity === 0
          ? 'practiced today'
          : `last practiced ${c.daysSinceLastActivity} day${c.daysSinceLastActivity === 1 ? '' : 's'} ago`;
      return `- ${c.label}: ${c.doneLastWeek}/${c.target} last week, ${c.lifetimeDone}/${c.lifetimeTotal} all-time, ${last}`;
    }).join('\n');

    const prompt = `You are an encouraging Korean-learning coach writing a short personalized weekly progress recap for a student's home screen dashboard. This runs once, every Monday, looking back at the week that just ended.

Student: Level ${level}, ${xp} total XP, ${currentStreak}-day study streak.

Last week's activity by category:
${categoryLines}

Write a warm, specific, honest 2-3 sentence recap of last week. Call out one thing they did well (a real strength based on the numbers) and one thing they neglected (using the actual days-since-practiced number), referencing real category names and numbers — don't be generic. Keep the tone encouraging, never scolding. Phrase it as a look back at the week that just finished, not "today."

Then give exactly 2 short, concrete recommendations for the week ahead (e.g. "3 speaking sessions this week", "a grammar lesson or two"), prioritizing whichever category is most neglected or would help most. Phrase them as things to fit in over the week, not today specifically.

Respond ONLY with valid JSON, no markdown, no code fences:
{ "summary": "2-3 sentence recap here", "recommendations": ["recommendation 1", "recommendation 2"] }`;

    const message = await claude.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '{}';
    const clean = raw.replace(/```json|```/g, '').trim();
    const { summary, recommendations } = JSON.parse(clean);

    if (!summary || !Array.isArray(recommendations)) {
      throw new Error('Malformed insight response');
    }

    return NextResponse.json({ summary, recommendations });
  } catch (err) {
    console.error('Home insight error:', err);
    return NextResponse.json({ error: 'Failed to generate insight' }, { status: 500 });
  }
}
