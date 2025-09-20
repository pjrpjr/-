# Context Notes

## Iteration Snapshot (2025-09-24)
- Platform task lifecycle API handoff is in progress; see the open TODO dated 2025-09-24 in `TODO.md`.
- Upcoming deliverables: 2025-09-25 front-end verification report (`docs/frontend-review-2025-09-25.md`) and 2025-09-26 phase2 planning kickoff (`phase2/frontend-outline.md`).

## Recent Progress
- Hero, monetization, template grid, compliance notice, quick start CTA, analytics coverage, SSE push, and moderation UI are complete per TODO checklist.
- `docs/platform-api-integration-plan.md` and `shared/CHANGELOG.md` already capture the 2025-09-23 updates.
- Task lifecycle workflows wired to credits API (`src/lib/workflows/taskLifecycle.ts`) with Vitest coverage for hold/retry/refund paths.

## Pending Blockers
- Await backend confirmation for refund/retry flows before replacing mocks in `src/lib/api/platformClient.ts`.
- Asset refresh: confirm hero/quickstart states draw from `public/gradients`, `public/illustrations`, and `public/icons` per the design hand-off.

## Working Notes
- Reinstall deps after cleanup with `npm install` (or `pnpm install`) before running local builds.
- Commands: `npm run dev` for the Next.js app, `npm run test` for the Vitest suite.
- Task lifecycle helpers (`holdTaskCredits`, `commitTaskCredits`, `retryTaskHoldLifecycle`) orchestrate pre-deduct/commit/cancel; import from `src/lib/workflows/taskLifecycle.ts`.

## Context Hygiene
- Large artifacts (`node_modules`, `.next`, `dist`, `*.tsbuildinfo`, `.pytest_cache`, `__pycache__`) are now ignored and can be regenerated locally when needed.
- Use `scripts/context_snapshot.ps1` to capture a compact status report (notes + open TODOs + directory overview) instead of pasting large blobs.
- When sharing progress, prefer focused outputs: `git status`, `git diff`, `rg "pattern" path`, `Get-Content path | Select-Object -Skip <start> -First <count>`.
