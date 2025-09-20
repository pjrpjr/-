# Tracking Handshake Status �� 2025-09-21

## Summary
- Added `src/context/AnalyticsContext.tsx` so the landing page uses a shared `AnalyticsProvider`/`useAnalytics`, automatically emitting the baseline `landing_view` event and buffering telemetry in `window.__analyticsEvents` for QA.
- Extended task mocks and types (`src/lib/types.ts`, `src/lib/api/mockBackend.ts`, `src/data/siteContent.ts`) to include `nextEta`, `queuePosition`, `policyTag`, etc., keeping realtime payloads aligned with the handshake schema.
- Instrumented navigation, Hero CTA, QuickStart steps/actions, template filters and replication, monetization CTA, `queue_eta_update`, and task stream status events; template heatmap exposures now emit `heatmap_view`.
- Replaced the mock task-event subscription with an SSE client (automatic fallback to the mock when SSE/EventSource is unavailable) and added focused component tests to guard the analytics hooks.
- Task stream bootstrap now fetches `/api/v1/tasks/<task_id>/events`, feeding the SSE client with real payloads while keeping the mock as an offline fallback.

## Event Coverage
| Handshake event | Telemetry emitted | Location | Notes |
| --- | --- | --- | --- |
| `hero_primary_click` / `hero_secondary_click` | `cta_click` (`cta_id`, `role`, target link) | `src/components/HeroSection.tsx` | Existing data-analytics markers now call `trackEvent`.
| `hero_workflow_link` | `cta_click`, `cta_id=hero_workflow_link` | `src/components/HeroSection.tsx` | Tracks carousel workflow deep-links.
| Navigation CTA / topup | `cta_click` (`cta_id=nav-*`, `role`) | `src/components/TopNavigation.tsx` | Includes `topup_banner_click`; role toggle emits `role_switch`.
| `quickstart_step_view` | `quickstart_step_view` (`step_id`, `status`, `label`) | `src/components/QuickStartSection.tsx` | Uses IntersectionObserver with a no-IO fallback.
| QuickStart CTA | `cta_click`, `cta_id=quickstart_action_*` | `src/components/QuickStartSection.tsx` | Slugified button labels make analytics matching deterministic.
| `demo_replicate_click` | `cta_click` + template metadata | `src/components/TemplateGrid.tsx` | Also emits `template_filter_select` when the filter changes.
| Template heatmap | `heatmap_view` (`filter_id`, `template_count`) | `src/components/TemplateGrid.tsx` | Fires on initial render and filter switches.
| Template workflow | `cta_click`, `cta_id=template_*_workflow` | `src/components/TemplateGrid.tsx` | Captures workflow deep-link clicks.
| Monetization CTA | `cta_click`, `cta_id=monetization-*` | `src/components/MonetizationPath.tsx` | Stage-specific instrumentation for funnel analysis.
| `queue_eta_update` | `queue_eta_update` (`next_eta`, `queue_position`, `stage`) | `src/hooks/useRealtimeFeed.ts` | Emits only when ETA changes to avoid noisy duplicates.
| Task stream status | `task_stream_status` (`status`) | `src/components/TaskCenterPanel.tsx` | Reports `idle`/`connecting`/`open`/`error` transitions.
| Task simulation helper | `cta_click`, `cta_id=task-simulate` | `src/components/TaskCenterPanel.tsx` | Lets QA push mock events while recording usage.

## Outstanding
- **Realtime backend**: once `/sse/v1/tasks/stream` is live, confirm payload parity and retire the `/tasks/stream/mock` endpoint where possible.
- **Topup/acceleration banners**: hook the upcoming modals/banners to the existing `cta_click` wiring when UI ships.
- **Ops workflows**: instrument `report_submit`, `review_timer_overdue`, `risk_alert_banner` after the Ops UI delivers those flows.
- **Experiment buckets**: current `ab_bucket` derivation uses a session hash; swap in the real experiment allocation service when available.

## References
- Code: `src/context/AnalyticsContext.tsx`, `src/hooks/useRealtimeFeed.ts`, `src/components/TopNavigation.tsx`, `src/components/HeroSection.tsx`, `src/components/QuickStartSection.tsx`, `src/components/TemplateGrid.tsx`, `src/components/MonetizationPath.tsx`, `src/components/TaskCenterPanel.tsx`, `src/lib/types.ts`, `src/lib/api/platformClient.ts`, `src/lib/api/mockBackend.ts`, `src/data/siteContent.ts`
- Tests: `src/context/AnalyticsContext.test.tsx`, `src/components/__tests__/TopNavigation.test.tsx`, `TemplateGrid.test.tsx`, `MonetizationPath.test.tsx`, `TaskCenterPanel.test.tsx`
- Config/docs: `vitest.config.ts`, `shared/CHANGELOG.md`, `shared/status-feed.md`

## Next Steps
1. Coordinate with platform-integration to validate SSE behaviour (`next_eta`, `queue_position`, retry cadence).
2. Add Ops-related telemetry (report submit / compliance alerts) once the corresponding UI ships and update the changelog.
3. Before the 9/21 metrics sync, have shared/metrics verify sample payloads via `window.__analyticsEvents` to confirm schema completeness.


