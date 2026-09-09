const { test } = require('node:test');
const assert = require('node:assert/strict');
const load = require('./load-ts.cjs');
const model = load('lib/weekly-goals.ts');
const weekly = load('lib/weekly.ts');

test('defaults are ten cards and three lessons with independent tracking enabled', () => {
  const goals = model.weeklyGoals();
  for (const { key } of model.WEEKLY_CATEGORIES) {
    assert.equal(goals[key].target, key === 'cards' ? 10 : 3);
    assert.equal(goals[key].enabled, true);
  }
  assert.deepEqual(model.weeklyGoals({ grammar: { target: 7, enabled: false } }).grammar, { target: 7, enabled: false });
});

function fixture() {
  let profile = {};
  const records = new Map();
  const api = load('lib/save-weekly-progress.ts', {
    './firebase': { db: {} }, './weekly': weekly, './weekly-goals': model,
    'firebase/firestore': {
      collection: (_, name) => name, where: () => {}, query: value => value,
      doc: (_, name, id) => ({ path: `${name}/${id}` }),
      getDocs: async () => ({ docs: [...records.values()].map(data => ({ data: () => data })) }),
      runTransaction: async (_, callback) => {
        const writes = [];
        await callback({ get: async () => ({ data: () => structuredClone(profile) }),
          set: (ref, data) => writes.push(() => records.set(ref.path, data)),
          update: (_, data) => writes.push(() => { profile = { ...profile, ...data }; }),
        });
        writes.forEach(write => write());
      },
    },
  });
  const complete = () => api.saveWeeklyCompletion({ path: 'user_grammar_progress/u_lesson' }, {
    user_id: 'u', lesson_id: 'lesson', completed_at: new Date().toISOString(),
  }, 'grammar');
  return { api, complete, profile: () => profile };
}

test('repeated completions count; overlapping duplicate submissions count once', async () => {
  const f = fixture();
  await Promise.all([f.complete(), f.complete()]);
  await f.complete();
  assert.equal(f.profile().weekly_history[weekly.getWeekStartISO()].counts.grammar, 2);
});

test('reset preserves recap totals and the next repetition advances the display by one', async () => {
  const f = fixture();
  await f.complete(); await f.complete();
  await f.api.resetWeeklyProgress('u');
  await f.complete();
  const record = f.profile().weekly_history[weekly.getWeekStartISO()];
  assert.equal(record.counts.grammar, 3);
  assert.equal(record.counts.grammar - record.baseline.grammar, 1);
});

test('changing goals preserves counts, past goals, and disabled targets', async () => {
  const f = fixture();
  await f.complete();
  const goals = model.weeklyGoals();
  goals.grammar = { enabled: false, target: 8 };
  await f.api.configureWeeklyGoals('u', goals);
  const profile = f.profile();
  assert.equal(profile.weekly_history[weekly.getWeekStartISO()].counts.grammar, 1);
  assert.deepEqual(profile.weekly_goals.grammar, goals.grammar);
  const previous = new Date(weekly.getWeekStartISO()); previous.setDate(previous.getDate() - 7);
  assert.equal(profile.weekly_history[previous.toISOString()].goals.grammar.target, 3);
  goals.grammar.target = 0;
  await assert.rejects(f.api.configureWeeklyGoals('u', goals), /whole-number/);
});

test('history stays bounded and newest weeks survive', () => {
  const history = Object.fromEntries(Array.from({ length: 20 }, (_, i) => [String(i).padStart(2, '0'), {}]));
  assert.equal(Object.keys(model.retainWeeks(history)).length, 8);
  assert.ok(model.retainWeeks(history)['19']);
});
