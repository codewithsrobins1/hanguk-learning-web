# Deferred Firebase work

The current changes use the existing QA and production Firebase setup. No new service-account secret, Firestore rules deployment, or collection is required. Deploy the app using the existing workflow.

The recap fixes retained here correct the lifetime field names, use the preceding calendar week independently of manual dashboard resets, and stop automatic retry loops. Counts still come from each item's most recent progress record. Repeats are not separate sessions, and earlier dates overwritten by repeats cannot be recovered.

Deferred until a separate rollout:

- An append-only completion history for accurate repeat-session and historical weekly counts.
- Firestore ownership-rule hardening.
- Server-side AI authentication and request quotas, including environment-specific server credentials if using the Firebase Admin implementation.

Firebase projects remain `hanguk-learning-qa` and `hanguk-learning-app`. The branch-to-Vercel environment mapping has not been confirmed. No remote deployments were performed.
