const { test } = require('node:test');
const assert = require('node:assert/strict');
const load = require('./load-ts.cjs');

test('XP transaction retries use the latest balance and celebrate only after commit', async () => {
  const notifications = [];
  let updated;
  const { addXp } = load('lib/xp.ts', {
    '@/lib/firebase': { db: {} },
    'firebase/firestore': {
      doc: () => 'profile',
      runTransaction: async (_, callback) => {
        await callback({ get: async () => ({ exists: () => true, data: () => ({ xp: 90 }) }), update: () => {} });
        return callback({ get: async () => ({ exists: () => true, data: () => ({ xp: 95 }) }), update: (_, value) => { updated = value; } });
      },
    },
  });
  global.window = { dispatchEvent: event => notifications.push(event) };
  try {
    await addXp('a', 10);
    assert.equal(updated.xp, 105);
    assert.equal(updated.level, 2);
    assert.equal(notifications.length, 1);
    await assert.rejects(addXp('a', -1), /Invalid XP/);
  } finally { delete global.window; }
});
