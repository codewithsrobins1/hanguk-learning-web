# Deferred Firebase work

The current changes use the existing QA and production Firebase setup. No new service-account secret, Firestore rules deployment, or collection is required. Deploy the app using the existing workflow.

Weekly Progress now has a Configure modal with independent tracking switches and whole-number targets from 1 to 999. Defaults are 10 Vocab Cards and 3 lessons for each other category, all enabled. Settings persist on the existing profile as `weekly_goals`.

Completed reading, grammar, speaking, listening, and full pattern lessons increment `weekly_history` counters on the profile in the same transaction as their existing progress write. Repeated completions count; partial pattern rounds do not. Vocab retains distinct-card counting. Disabling tracking preserves progress and targets; activity continues to be recorded for re-enabling.

History retains eight calendar weeks with goal snapshots. Manual resets change a display baseline, preserving weekly totals for recaps. Goal changes affect the current week and future weeks without changing previous weeks' goals. No new collections, credentials, rules, or indexes are required.

On first use, current and previous week counts are initialized from available legacy progress. Earlier overwritten repeats cannot be recovered. The recap uses saved counters where available and describes legacy-only counts as distinct items. These are client-recorded study statistics, not tamper-proof scores.

Deferred until a separate rollout:

- A full append-only activity history if individual session records or reporting beyond eight weeks are needed.
- Firestore ownership-rule hardening.
- Server-side AI authentication and request quotas, including environment-specific server credentials if using the Firebase Admin implementation.

Firebase projects remain `hanguk-learning-qa` and `hanguk-learning-app`. The branch-to-Vercel environment mapping has not been confirmed. No remote deployments were performed.
