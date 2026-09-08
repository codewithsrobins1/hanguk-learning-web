const { test } = require('node:test');
const assert = require('node:assert/strict');
const load = require('./load-ts.cjs');
const { countInRange } = load('lib/weekly.ts');

test('weekly counts include the start boundary and exclude the next week', () => {
  const start = Date.parse('2026-09-07');
  const end = Date.parse('2026-09-14');
  const rows = ['2026-09-06', '2026-09-07', '2026-09-13', '2026-09-14'].map(completed_at => ({ data: () => ({ completed_at }) }));
  assert.equal(countInRange(rows, 'completed_at', start, end), 2);
});

function endpoint() {
  const prompts = [];
  const { POST } = load('app/api/home/insights/route.ts', {
    '@anthropic-ai/sdk': { default: class {
      messages = { create: async request => {
        prompts.push(request.messages[0].content);
        return { content: [{ type: 'text', text: JSON.stringify({ summary: 'Recorded three grammar lessons.', recommendations: ['Practice reading.', 'Review grammar.'] }) }] };
      } };
    } },
    'next/server': { NextResponse: { json: (body, options = {}) => ({ body, status: options.status ?? 200 }) } },
  });
  return { POST, prompts };
}

test('recap passes real lifetime counts and describes the existing history limitation', async () => {
  const { POST, prompts } = endpoint();
  const response = await POST({ json: async () => ({
    level: 2, xp: 150, currentStreak: 3,
    categories: [{ label: 'Grammar', doneLastWeek: 3, target: 3, lifetimeDone: 5, lifetimeTotal: 20, daysSinceLastActivity: 1 }],
  }) });
  assert.equal(response.status, 200);
  assert.match(prompts[0], /5\/20 distinct items all-time/);
  assert.match(prompts[0], /never as total sessions/);
  assert.doesNotMatch(prompts[0], /undefined/);
});

test('old mismatched fields are rejected before an AI call', async () => {
  const { POST, prompts } = endpoint();
  const response = await POST({ json: async () => ({
    level: 2, xp: 150, currentStreak: 3,
    categories: [{ label: 'Grammar', doneLastWeek: 3, target: 3, done: 5, total: 20, daysSinceLastActivity: 1 }],
  }) });
  assert.equal(response.status, 400);
  assert.equal(prompts.length, 0);
});
