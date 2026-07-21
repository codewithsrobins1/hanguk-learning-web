// Lists (or resolves) content issue reports filed via the in-app "Report
// issue" button. Reads directly from Firestore — no in-app viewer exists
// since the security rules only let users create reports, not read them.
//
// Usage:
//   npm run error_report                  — open reports on prod
//   npm run error_report -- --qa           — open reports on QA
//   npm run error_report -- --all          — include already-resolved reports
//   npm run error_report -- --resolve=abc123   — mark report abc123 resolved
const { getDb, cleanupAdc } = require('./lib/firebaseAdmin');

const args = process.argv.slice(2);
const projectKey = args.includes('--qa') ? 'qa' : 'prod';
const showAll = args.includes('--all');
const resolveId = args.find((a) => a.startsWith('--resolve='))?.split('=')[1];

function printReport(id, r) {
  const when = r.created_at?.toDate ? r.created_at.toDate().toLocaleString() : 'unknown time';
  const status = r.status === 'resolved' ? '✓ resolved' : '● open';
  console.log(`\n[${status}] ${id}`);
  console.log(`  ${r.module} / ${r.content_id}${r.item_id ? ' / ' + r.item_id : ''}${r.item_index != null ? ` (item #${r.item_index})` : ''}${r.section ? ` [${r.section}]` : ''}`);
  console.log(`  Reason: ${r.reason}`);
  if (r.details) console.log(`  Details: ${r.details}`);
  if (r.snapshot) {
    for (const [k, v] of Object.entries(r.snapshot)) {
      if (v === undefined || v === null) continue;
      console.log(`  ${k}: ${Array.isArray(v) ? v.join(' / ') : v}`);
    }
  }
  console.log(`  Reported: ${when}`);
}

async function main() {
  const db = getDb(projectKey);

  if (resolveId) {
    await db.collection('issue_reports').doc(resolveId).update({ status: 'resolved' });
    console.log(`Marked ${resolveId} as resolved on ${projectKey}.`);
    cleanupAdc();
    process.exit(0);
  }

  let query = db.collection('issue_reports').orderBy('created_at', 'desc');
  if (!showAll) query = query.where('status', '==', 'open');
  const snap = await query.get();

  console.log(`${showAll ? 'All' : 'Open'} issue reports on ${projectKey} (${snap.size}):`);
  if (snap.empty) console.log('  Nothing here.');
  snap.forEach((doc) => printReport(doc.id, doc.data()));

  console.log(`\nTo resolve one: npm run error_report -- --resolve=<id>${projectKey === 'qa' ? ' --qa' : ''}`);
  cleanupAdc();
  process.exit(0);
}

main().catch((err) => {
  console.error('Failed to list issue reports:', err);
  process.exit(1);
});
