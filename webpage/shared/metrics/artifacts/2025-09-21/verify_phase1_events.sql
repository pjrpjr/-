-- Phase1 landing event verification (2025-09-21)
-- 校验关键事件是否包含 policy_tag/action_required/escalation_level 等字段

WITH latest_day AS (
    SELECT MAX(event_date) AS event_date
    FROM landing_phase1.events
)
SELECT
    e.event_name,
    SUM(CASE WHEN e.payload->>'policy_tag' IS NULL THEN 1 ELSE 0 END) AS missing_policy_tag,
    SUM(CASE WHEN e.payload->>'action_required' IS NULL THEN 1 ELSE 0 END) AS missing_action_required,
    SUM(CASE WHEN e.payload->>'escalation_level' IS NULL THEN 1 ELSE 0 END) AS missing_escalation_level,
    COUNT(*) AS total
FROM landing_phase1.events e
JOIN latest_day d ON e.event_date = d.event_date
WHERE e.event_name IN (
    'license_rejected',
    'task_failed',
    'risk_alert'
)
GROUP BY e.event_name
ORDER BY e.event_name;

-- 监控 policy_tag 枚举是否超出 A1~D3 范围
SELECT DISTINCT e.payload->>'policy_tag' AS policy_tag
FROM landing_phase1.events e
JOIN latest_day d ON e.event_date = d.event_date
WHERE e.payload ? 'policy_tag'
  AND e.payload->>'policy_tag' NOT IN ('A1','A2','B1','B2','C1','C2','D1','D2','D3');
