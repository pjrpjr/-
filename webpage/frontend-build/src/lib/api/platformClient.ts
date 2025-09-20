import { mockApi } from "./mockBackend";
import type {
  CreditsBalance,
  CreditsBalanceQuery,
  CreditsCancelInput,
  CreditsCancelResult,
  CreditsChargeInput,
  CreditsChargeResult,
  CreditsCommitInput,
  CreditsEstimate,
  CreditsEstimateInput,
  CreditsLedger,
  CreditsLedgerQuery,
  CreditsPreDeduct,
  CreditsPreDeductInput,
  LicenseCheckInput,
  LicenseCheckResult,
  PlatformAdapterApi,
  ReviewDecisionInput,
  ReviewDecisionResult,
  ReportActionInput,
  ReportActionResult,
  TaskStreamConfig,
  TaskEvent
} from "../types";

export type PlatformClientOptions = {
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  authToken?: string;
  getAuthToken?: () => string | null | undefined | Promise<string | null | undefined>;
  defaultHeaders?:
    | Record<string, string>
    | (() => Record<string, string> | Promise<Record<string, string>>);
};

type HttpRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  searchParams?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  fetchOptions?: Omit<RequestInit, "headers" | "method" | "body" | "signal"> & { signal?: AbortSignal };
  retry?: { attempts: number; delayMs?: number };
  timeout?: number;
};

type HttpClient = <T>(path: string, options?: HttpRequestOptions) => Promise<T>;

export class PlatformApiError extends Error {
  status: number;
  code?: string;
  detail?: unknown;

  constructor(message: string, params: { status: number; code?: string; detail?: unknown }) {
    super(message);
    this.name = "PlatformApiError";
    this.status = params.status;
    this.code = params.code;
    this.detail = params.detail;
  }
}

type EstimateResponsePayload = {
  currency: string;
  template_id: string;
  scene: string;
  resolution: string;
  priority: string;
  current_balance: number;
  selected_cost: number;
  estimated_cost: number;
  min_cost: number;
  max_cost: number;
  calculation_basis: string;
  policy_tag?: string | null;
  audit_id: string;
  suggest_topup: number;
  extras?: Record<string, number>;
  options: Array<{
    priority: string;
    total_cost: number;
    eta_minutes: number;
  }>;
};

type PreDeductResponsePayload = {
  pre_deduct_id: string;
  frozen_amount: number;
  balance_after: number;
  quota_snapshot: {
    template_quota: number;
    user_usage: number;
  };
  expire_at: string;
};

type CancelResponsePayload = {
  pre_deduct_id: string;
  status: string;
  reason: string;
  balance_after: string | number;
};

type ChargeResponsePayload = {
  ledger_id: string;
  tenant_id: string;
  user_id?: string | null;
  task_id?: string | null;
  balance_after: number;
  change: number;
  reason: string;
  policy_tag?: string | null;
  created_at: string;
};

type LedgerResponsePayload = {
  tenant_id: string;
  user_id?: string | null;
  entries: Array<{
    ledger_id: string;
    task_id?: string | null;
    change: number;
    balance_after: number;
    reason: string;
    created_at: string;
  }>;
};

type BalanceResponsePayload = {
  tenant_id: string;
  user_id?: string | null;
  balance: number;
  frozen: number;
  currency: string;
};

type LicenseCheckResponsePayload = {
  is_authorized: boolean;
  reason_code: string;
  remaining_quota: number;
  daily_remaining: number;
  valid_until: string | null;
  policy_tag?: string | null;
  requirements: string[];
};

type ReviewDecisionResponsePayload = {
  submission_id: string;
  status: string;
  processed_at: string;
};

type ReportActionResponsePayload = {
  report_id: string;
  status: string;
  processed_at: string;
};

type TaskStreamResponsePayload = {
  ws_url: string;
  sse_url: string;
  token: string;
  cadence: Array<{
    event: string;
    delay_seconds: number;
    stage: string;
  }>;
  retry_backoff_seconds: number[];
};
const DEFAULT_STREAM_TASK_IDS = ["task_mock_001"];
const KNOWN_STREAM_EVENT_TYPES = [
  "message",
  "task.accepted",
  "task.running",
  "task.checkpoint",
  "task.completed",
  "task.failed",
  "credits.updated",
  "compliance.alert",
  "system.heartbeat",
  "ping"
];
const DEFAULT_RETRY_BACKOFF_SECONDS = [1, 2, 5];
const MAX_RECENT_STREAM_EVENT_IDS = 200;

type TaskEventListItemPayload = Record<string, unknown> & {
  event: string;
  task_id: string;
  status?: string | null;
  message?: string | null;
  credits_delta?: number | null;
  ts: string | number;
  stage?: string | null;
  progress?: number | null;
  next_eta?: string | number | null;
  queue_position?: number | null;
  policy_tag?: string | null;
  action_required?: string | null;
  risk_level?: string | null;
  escalation_level?: string | null;
  credit_balance?: number | null;
  balance_after?: number | null;
  task_type?: string | null;
  cursor?: string | null;
};

function buildAbsoluteUrl(baseUrl: string, pathValue: string): string {
  if (/^https?:\/\//i.test(pathValue)) {
    return pathValue;
  }
  let root = baseUrl;
  if (!/^https?:\/\//i.test(root)) {
    if (typeof window !== "undefined" && typeof window.location !== "undefined") {
      root = new URL(root, window.location.origin).toString();
    } else {
      root = "http://localhost:8080";
    }
  }
  if (root.endsWith("/")) {
    root = root.slice(0, -1);
  }
  const normalizedPath = pathValue.startsWith("/") ? pathValue : `/${pathValue}`;
  return `${root}${normalizedPath}`;
}

function createStreamUrl(baseUrl: string, taskIds: string[], cursor?: string): string {
  const url = new URL(buildAbsoluteUrl(baseUrl, "/api/v1/tasks/stream/sse"));
  url.searchParams.set("task_id", taskIds[0]);
  if (taskIds.length > 1) {
    url.searchParams.set("subscribe", taskIds.slice(1).join(","));
  }
  if (cursor) {
    url.searchParams.set("cursor", cursor);
  }
  return url.toString();
}


function cloneHeaderRecord(input?: Record<string, string> | null): Record<string, string> {
  const result: Record<string, string> = {};
  if (!input) {
    return result;
  }
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null) {
      continue;
    }
    result[key] = String(value);
  }
  return result;
}

function mergeHeaders(base?: Record<string, string> | undefined, override?: Record<string, string> | undefined): Record<string, string> | undefined {
  if (!override) {
    return base;
  }
  const cleaned: Record<string, string> = { ...(base ?? {}) };
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined || value === null) {
      continue;
    }
    cleaned[key] = String(value);
  }
  return cleaned;
}

function normalizeAuthHeader(token: string | null | undefined) {
  if (token === undefined || token === null) {
    return undefined;
  }
  const trimmed = String(token).trim();
  if (!trimmed) {
    return undefined;
  }
  if (trimmed.toLowerCase().startsWith("bearer ")) {
    const withoutPrefix = trimmed.slice(7).trim();
    return withoutPrefix ? `Bearer ${withoutPrefix}` : undefined;
  }
  return `Bearer ${trimmed}`;
}

function createHttpClient(
  baseUrl: string,
  fetchImpl: typeof fetch,
  resolveAuthToken?: () => Promise<string | null | undefined>,
  resolveDefaultHeaders?: () => Promise<Record<string, string> | undefined>
): HttpClient {
  return async function http<T>(path: string, options: HttpRequestOptions = {}) {
    const url = new URL(path, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
    if (options.searchParams) {
      for (const [key, value] of Object.entries(options.searchParams)) {
        if (value === undefined) {
          continue;
        }
        url.searchParams.set(key, String(value));
      }
    }

    let headers = mergeHeaders(undefined, resolveDefaultHeaders ? await resolveDefaultHeaders() : undefined);
    headers = mergeHeaders(headers, options.headers);
    if (!headers || Object.keys(headers).length === 0) {
      headers = { Accept: "application/json" };
    } else if (!("Accept" in headers)) {
      headers = { ...headers, Accept: "application/json" };
    }

    const hasAuthHeader = Object.keys(headers).some((key) => key.toLowerCase() === "authorization");

    if (resolveAuthToken && !hasAuthHeader) {
      const token = await resolveAuthToken();
      const authHeader = normalizeAuthHeader(token);
      if (authHeader) {
        headers = { ...headers, Authorization: authHeader };
      }
    }

    let body: BodyInit | undefined;
    if (options.body !== undefined) {
      if (
        typeof options.body === "string" ||
        options.body instanceof URLSearchParams ||
        options.body instanceof FormData
      ) {
        body = options.body as BodyInit;
      } else {
        if (!headers["Content-Type"]) {
          headers["Content-Type"] = "application/json";
        }
        body = JSON.stringify(options.body);
      }
    }

    const method = options.method ?? "GET";

    const userFetchOptions = options.fetchOptions ?? {};
    const { signal: fetchOptionSignal, ...restFetchOptions } = userFetchOptions;

    const init: RequestInit = {
      method,
      headers,
      body: method === "GET" || method === "HEAD" ? undefined : body,
      ...restFetchOptions
    };

    const controller = new AbortController();
    let abortReason: unknown;
    const abort = (reason?: unknown) => {
      if (!controller.signal.aborted) {
        abortReason = reason;
        controller.abort(reason);
      }
    };

    const linkSignal = (source?: AbortSignal) => {
      if (!source) {
        return;
      }
      if (source.aborted) {
        abort(source.reason);
        return;
      }
      source.addEventListener("abort", () => abort(source.reason), { once: true });
    };

    linkSignal(options.signal);
    linkSignal(fetchOptionSignal);

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (typeof options.timeout === "number" && options.timeout > 0) {
      timeoutId = setTimeout(() => {
        abort(new Error("request_timeout"));
      }, options.timeout);
    }

    init.signal = controller.signal;

    const maxAttempts = Math.max(1, options.retry?.attempts ?? 1);
    const delayMs = options.retry?.delayMs ?? 0;
    let attempt = 0;
    let response: Response | undefined;
    let lastError: unknown;

    while (attempt < maxAttempts) {
      try {
        response = await fetchImpl(url.toString(), init);
        break;
      } catch (error) {
        if (controller.signal.aborted) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          const reason = abortReason ?? (controller.signal as unknown as { reason?: unknown }).reason;
          if (reason instanceof Error) {
            const message = reason.message || "request_aborted";
            const status = message === "request_timeout" ? 408 : 0;
            throw new PlatformApiError(message, { status, code: message, detail: reason });
          }
          throw new PlatformApiError("request_aborted", { status: 0, code: "request_aborted", detail: reason ?? error });
        }
        lastError = error;
        const nextAttempt = attempt + 1;
        if (nextAttempt >= maxAttempts) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          throw new PlatformApiError("Failed to execute request", { status: 0, detail: error });
        }
        options.retry?.onAttempt?.(nextAttempt, error);
        attempt = nextAttempt;
        if (delayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    if (!response) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      throw new PlatformApiError("Failed to execute request", { status: 0, detail: lastError });
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const hasBody = response.status !== 204 && response.status !== 205;
    if (!response.ok) {
      let detail: unknown;
      let message = response.statusText || "Request failed";
      let code: string | undefined;
      if (hasBody) {
        try {
          detail = await response.json();
          if (detail && typeof detail === "object") {
            const payload = detail as Record<string, unknown>;
            if (typeof payload.message === "string") {
              message = payload.message;
            }
            if (typeof payload.code === "string") {
              code = payload.code;
            }
            const inner = payload.detail;
            if (inner && typeof inner === "object") {
              const innerObj = inner as Record<string, unknown>;
              if (typeof innerObj.message === "string") {
                message = innerObj.message;
              }
              if (typeof innerObj.code === "string") {
                code = innerObj.code;
              }
            }
          }
        } catch {
          detail = undefined;
        }
      }
      throw new PlatformApiError(message, { status: response.status, code, detail });
    }

    if (!hasBody) {
      return undefined as T;
    }

    try {
      return (await response.json()) as T;
    } catch (error) {
      throw new PlatformApiError("Failed to parse response", { status: response.status, detail: error });
    }
  };
}

function mapEstimateResponse(payload: EstimateResponsePayload): CreditsEstimate {
  return {
    currency: payload.currency,
    templateId: payload.template_id,
    scene: payload.scene,
    resolution: payload.resolution,
    priority: payload.priority as CreditsEstimate["priority"],
    currentBalance: payload.current_balance,
    selectedCost: payload.selected_cost,
    estimatedCost: payload.estimated_cost,
    minCost: payload.min_cost,
    maxCost: payload.max_cost,
    calculationBasis: payload.calculation_basis,
    policyTag: payload.policy_tag ?? null,
    auditId: payload.audit_id,
    suggestTopup: payload.suggest_topup,
    extras: payload.extras ?? {},
    options: payload.options.map((item) => ({
      priority: item.priority as CreditsEstimate["priority"],
      totalCost: item.total_cost,
      etaMinutes: item.eta_minutes
    }))
  };
}

function mapPreDeductResponse(payload: PreDeductResponsePayload): CreditsPreDeduct {
  return {
    preDeductId: payload.pre_deduct_id,
    frozenAmount: payload.frozen_amount,
    balanceAfter: payload.balance_after,
    quotaSnapshot: {
      templateQuota: payload.quota_snapshot.template_quota,
      userUsage: payload.quota_snapshot.user_usage
    },
    expireAt: payload.expire_at
  };
}

function mapCancelResponse(payload: CancelResponsePayload): CreditsCancelResult {
  return {
    preDeductId: payload.pre_deduct_id,
    status: payload.status,
    reason: payload.reason,
    balanceAfter:
      typeof payload.balance_after === "string"
        ? Number(payload.balance_after)
        : payload.balance_after
  };
}

function mapChargeResponse(payload: ChargeResponsePayload): CreditsChargeResult {
  return {
    ledgerId: payload.ledger_id,
    tenantId: payload.tenant_id,
    userId: payload.user_id ?? null,
    taskId: payload.task_id ?? null,
    balanceAfter: payload.balance_after,
    change: payload.change,
    reason: payload.reason,
    policyTag: payload.policy_tag ?? null,
    createdAt: payload.created_at
  };
}

function mapLedgerResponse(payload: LedgerResponsePayload): CreditsLedger {
  return {
    tenantId: payload.tenant_id,
    userId: payload.user_id ?? null,
    entries: payload.entries.map((entry) => ({
      ledgerId: entry.ledger_id,
      taskId: entry.task_id ?? null,
      change: entry.change,
      balanceAfter: entry.balance_after,
      reason: entry.reason,
      createdAt: entry.created_at
    }))
  };
}

function mapBalanceResponse(payload: BalanceResponsePayload): CreditsBalance {
  return {
    tenantId: payload.tenant_id,
    userId: payload.user_id ?? null,
    balance: payload.balance,
    frozen: payload.frozen,
    currency: payload.currency
  };
}

function mapLicenseResponse(payload: LicenseCheckResponsePayload): LicenseCheckResult {
  return {
    isAuthorized: payload.is_authorized,
    reasonCode: payload.reason_code as LicenseCheckResult["reasonCode"],
    remainingQuota: payload.remaining_quota,
    dailyRemaining: payload.daily_remaining,
    validUntil: payload.valid_until,
    policyTag: payload.policy_tag ?? null,
    requirements: payload.requirements ?? []
  };
}

function mapTaskStreamResponse(payload: TaskStreamResponsePayload): TaskStreamConfig {
  return {
    wsUrl: payload.ws_url,
    sseUrl: payload.sse_url,
    token: payload.token,
    cadence: payload.cadence.map((item) => ({
      event: item.event,
      delaySeconds: item.delay_seconds,
      stage: item.stage
    })),
    retryBackoffSeconds: payload.retry_backoff_seconds
  };
}

function safeParseJson(input: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(input);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // ignore malformed payload
  }
  return null;
}

const STREAM_STATUS_MAP: Record<string, TaskEvent["status"]> = {
  "task.accepted": "queued",
  "task.running": "running",
  "task.checkpoint": "running",
  "task.completed": "success",
  "task.failed": "failed",
  "credits.updated": "success",
  "compliance.alert": "running"
};

function normalizeTimestamp(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value * 1000).toISOString();
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) {
      return new Date(parsed).toISOString();
    }
  }
  return new Date().toISOString();
}

function normalizeQueuePosition(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function mapStreamStatus(status: unknown, eventType: string): TaskEvent["status"] {
  if (typeof status === "string") {
    const normalized = status.toLowerCase();
    if (normalized === "queued" || normalized === "pending" || normalized === "accepted") {
      return "queued";
    }
    if (normalized === "running" || normalized === "in_progress" || normalized === "processing") {
      return "running";
    }
    if (normalized === "success" || normalized === "completed") {
      return "success";
    }
    if (normalized === "failed" || normalized === "error") {
      return "failed";
    }
  }
  return STREAM_STATUS_MAP[eventType] ?? "running";
}

function mapStreamType(eventType: string, rawType?: string | null): TaskEvent["type"] {
  const candidate = (rawType ?? "").toLowerCase();
  if (candidate.includes("train")) {
    return "training";
  }
  if (candidate.includes("license")) {
    return "license";
  }
  if (candidate.includes("refund")) {
    return "refund";
  }
  if (eventType.startsWith("credits.")) {
    return "refund";
  }
  if (eventType === "compliance.alert") {
    return "license";
  }
  return "render";
}

function deriveImpact(payload: Record<string, unknown>, eventType: string): string | undefined {
  const failure = payload["failure_reason"] ?? payload["failureReason"];
  if (typeof failure === "string" && failure) {
    return `Failure: ${failure}`;
  }
  const credits = typeof payload["credits"] === "object" && payload["credits"] !== null
    ? (payload["credits"] as Record<string, unknown>)
    : undefined;
  if (credits) {
    const refund = credits["refund"] ?? credits["refund_amount"];
    if (typeof refund === "number" && refund > 0) {
      return `Refunded ${refund}`;
    }
    const finalCost = credits["final_cost"];
    if (typeof finalCost === "number" && finalCost > 0) {
      return `Final cost ${finalCost}`;
    }
  }
  if (eventType === "compliance.alert") {
    const alertLevel = payload["alert_level"];
    if (typeof alertLevel === "string" && alertLevel) {
      return `Alert level ${alertLevel}`;
    }
  }
  const impact = payload["impact"];
  return typeof impact === "string" && impact ? impact : undefined;
}

function createStreamEventId(
  payload: Record<string, unknown>,
  eventType: string,
  timestamp: string,
  taskId: string
): string {
  const explicit = payload["event_id"] ?? payload["eventId"] ?? payload["id"];
  if (typeof explicit === "string" && explicit) {
    return explicit;
  }
  const seed = `${taskId}:${eventType}:${timestamp}`;
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${seed}:${crypto.randomUUID()}`;
  }
  return `${seed}:${Math.random().toString(36).slice(2, 10)}`;
}

function coerceNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function mapStreamEventPayload(raw: Record<string, unknown>, fallbackEventType?: string): TaskEvent | null {
  const eventTypeValue = typeof raw["event"] === "string" && raw["event"] ? (raw["event"] as string) : fallbackEventType;
  if (!eventTypeValue) {
    return null;
  }
  if (eventTypeValue === "system.heartbeat" || eventTypeValue === "ping") {
    return null;
  }
  if (eventTypeValue === "error") {
    console.warn('[platformClient] task stream error event', raw);
    return null;
  }

  const timestamp = normalizeTimestamp(raw["ts"]);
  const taskIdRaw = raw["task_id"] ?? raw["taskId"] ?? raw["id"] ?? `task-${eventTypeValue}`;
  const taskId = typeof taskIdRaw === "string" && taskIdRaw ? taskIdRaw : `task-${eventTypeValue}`;
  const id = createStreamEventId(raw, eventTypeValue, timestamp, taskId);
  const status = mapStreamStatus(raw["status"], eventTypeValue);
  const type = mapStreamType(eventTypeValue, typeof raw["task_type"] === "string" ? (raw["task_type"] as string) : undefined);
  const stage = typeof raw["stage"] === "string" ? (raw["stage"] as string) : undefined;
  const progress = typeof raw["progress"] === "number" ? Math.min(100, Math.max(0, raw["progress"] as number)) : undefined;
  const nextEtaValue = raw["next_eta"] ?? raw["nextEta"];
  const nextEta = nextEtaValue == null ? null : normalizeTimestamp(nextEtaValue);
  const queuePosition = normalizeQueuePosition(raw["queue_position"] ?? raw["queuePosition"]);
  const policyTag = typeof raw["policy_tag"] === "string" ? (raw["policy_tag"] as string) : null;
  const actionRequired = typeof raw["action_required"] === "string" ? (raw["action_required"] as string) : null;
  const riskCandidate = raw["alert_level"] ?? raw["risk_level"];
  const riskLevel = typeof riskCandidate === "string" && ["high", "medium", "low"].includes(riskCandidate as string)
    ? (riskCandidate as TaskEvent["riskLevel"]) : null;
  const escalationCandidate = raw["escalation_level"];
  const escalationLevel = typeof escalationCandidate === "string" && ["none", "ops_review", "compliance_committee"].includes(escalationCandidate as string)
    ? (escalationCandidate as TaskEvent["escalationLevel"]) : null;
  const credits = typeof raw["credits"] === "object" && raw["credits"] !== null
    ? (raw["credits"] as Record<string, unknown>)
    : undefined;
  const creditBalance = (
    coerceNumber(raw["credit_balance"]) ??
    coerceNumber(raw["balance_after"]) ??
    (credits ? coerceNumber(credits["balance_after"]) : null)
  );
  const personaTag = typeof raw["persona_tag"] === "string" ? (raw["persona_tag"] as string) : null;
  const authorization = typeof raw["authorization"] === "object" && raw["authorization"] !== null
    ? (raw["authorization"] as Record<string, unknown>)
    : undefined;
  const contextCandidate = typeof raw["context"] === "string" ? (raw["context"] as string) : undefined;
  const authorizationTemplate = authorization && typeof authorization["template_id"] === "string"
    ? (authorization["template_id"] as string)
    : undefined;
  const context = contextCandidate && contextCandidate.trim()
    ? contextCandidate
    : authorizationTemplate ?? "";
  const labelCandidate = typeof raw["label"] === "string" ? (raw["label"] as string) : undefined;
  const label = labelCandidate && labelCandidate.trim() ? labelCandidate : `${taskId} • ${eventTypeValue}`;

  return {
    id,
    type,
    status,
    label,
    timestamp,
    progress,
    context,
    impact: deriveImpact(raw, eventTypeValue),
    stage,
    nextEta,
    queuePosition,
    policyTag,
    actionRequired,
    riskLevel,
    escalationLevel,
    creditBalance,
    personaTag
  };
}
export function createPlatformClient(options: PlatformClientOptions = {}): PlatformAdapterApi {
  const fetchImpl = options.fetchImpl ?? (typeof fetch === "function" ? fetch.bind(globalThis) : undefined);
  if (!fetchImpl) {
    throw new Error("A fetch implementation must be provided for PlatformClient");
  }

  const baseUrl = options.baseUrl ?? process.env.NEXT_PUBLIC_PLATFORM_API_BASE ?? "http://localhost:8080";

  let resolveAuthToken: (() => Promise<string | null | undefined>) | undefined;
  if (options.getAuthToken) {
    resolveAuthToken = async () => {
      const token = await options.getAuthToken!();
      return token ?? null;
    };
  } else if (typeof options.authToken === "string") {
    resolveAuthToken = async () => options.authToken ?? null;
  }

  let resolveDefaultHeaders: (() => Promise<Record<string, string> | undefined>) | undefined;
  if (typeof options.defaultHeaders === "function") {
    resolveDefaultHeaders = async () => {
      const result = await options.defaultHeaders!();
      if (!result) {
        return undefined;
      }
      const record = cloneHeaderRecord(result);
      return Object.keys(record).length > 0 ? record : undefined;
    };
  } else if (options.defaultHeaders) {
    const staticHeaders = cloneHeaderRecord(options.defaultHeaders as Record<string, string>);
    resolveDefaultHeaders = async () => ({ ...staticHeaders });
  }

  const http = createHttpClient(baseUrl, fetchImpl, resolveAuthToken, resolveDefaultHeaders);

  let cachedTaskStreamConfig: TaskStreamConfig | null = null;
  let taskStreamConfigPromise: Promise<TaskStreamConfig> | null = null;

  const loadTaskStreamConfig = async (): Promise<TaskStreamConfig> => {
    if (cachedTaskStreamConfig) {
      return cachedTaskStreamConfig;
    }
    if (taskStreamConfigPromise) {
      try {
        return await taskStreamConfigPromise;
      } catch {
        // ignore so we can retry
      }
    }
    taskStreamConfigPromise = (async () => {
      try {
        const response = await http<TaskStreamResponsePayload>("/api/v1/tasks/stream/mock", {
          method: "GET"
        });
        cachedTaskStreamConfig = mapTaskStreamResponse(response);
        return cachedTaskStreamConfig;
      } catch (error) {
        console.warn("[platformClient] failed to fetch task stream config from platform API, using mock config", error);
        const fallback = await mockApi.fetchTaskStreamConfig();
        cachedTaskStreamConfig = fallback;
        return fallback;
      } finally {
        taskStreamConfigPromise = null;
      }
    })();
    return taskStreamConfigPromise;
  };
  return {
    fetchLandingPageContent: mockApi.fetchLandingPageContent,
    fetchReviewQueue: mockApi.fetchReviewQueue,
    fetchReportTickets: mockApi.fetchReportTickets,
    loadInitialTaskEvents: async () => {
      const taskIds = DEFAULT_STREAM_TASK_IDS;
      if (taskIds.length === 0) {
        return mockApi.loadInitialTaskEvents();
      }
      try {
        const responses = await Promise.all(
          taskIds.map((taskId) =>
            http<TaskEventListItemPayload[]>(`/api/v1/tasks/${taskId}/events`, { method: "GET" }).catch(() => null)
          )
        );

        const payloads: TaskEventListItemPayload[] = [];
        let hadFailure = false;
        for (const response of responses) {
          if (!response) {
            hadFailure = true;
            continue;
          }
          payloads.push(...response);
        }

        const events = payloads
          .map((item) =>
            mapStreamEventPayload(
              item as Record<string, unknown>,
              typeof item.event === "string" ? item.event : undefined
            )
          )
          .filter((value): value is TaskEvent => value !== null)
          .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
          .slice(0, 40);

        if (events.length > 0 || !hadFailure) {
          return events;
        }
      } catch (error) {
        console.warn("[platformClient] failed to load task events from platform API, falling back to mock", error);
      }
      return mockApi.loadInitialTaskEvents();
    },
    subscribeTaskEvents: (listener) => {
      const canUseSse = typeof window !== "undefined" && typeof window.EventSource !== "undefined";
      if (!canUseSse) {
        return mockApi.subscribeTaskEvents(listener);
      }

      const taskIds = DEFAULT_STREAM_TASK_IDS;
      if (taskIds.length === 0) {
        return mockApi.subscribeTaskEvents(listener);
      }

      let closed = false;
      let usingMockFallback = false;
      let eventSource: EventSource | null = null;
      let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
      let retryIndex = 0;
      let retryBackoff = DEFAULT_RETRY_BACKOFF_SECONDS;
      let lastCursor: string | null = null;
      const recentIds = new Set<string>();
      const recentQueue: string[] = [];
      let mockUnsubscribe: (() => void) | null = null;

      const recordId = (id: string) => {
        if (recentIds.has(id)) {
          return false;
        }
        recentIds.add(id);
        recentQueue.push(id);
        if (recentQueue.length > MAX_RECENT_STREAM_EVENT_IDS) {
          const removed = recentQueue.shift();
          if (removed) {
            recentIds.delete(removed);
          }
        }
        return true;
      };

      const cleanupEventSource = () => {
        if (eventSource) {
          KNOWN_STREAM_EVENT_TYPES.forEach((type) => {
            eventSource.removeEventListener(type, handleMessage);
          });
          eventSource.removeEventListener("open", handleOpen);
          eventSource.removeEventListener("error", handleError);
          eventSource.close();
          eventSource = null;
        }
      };

      const cleanup = () => {
        if (closed) {
          return;
        }
        closed = true;
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
          reconnectTimer = null;
        }
        cleanupEventSource();
        if (mockUnsubscribe) {
          mockUnsubscribe();
          mockUnsubscribe = null;
        }
      };

      const fallbackToMock = () => {
        if (usingMockFallback) {
          return;
        }
        usingMockFallback = true;
        cleanupEventSource();
        mockUnsubscribe = mockApi.subscribeTaskEvents(listener);
      };

      const handleMessage = (raw: MessageEvent<string>) => {
        if (closed || usingMockFallback) {
          return;
        }
        const data = typeof raw.data === "string" ? raw.data.trim() : "";
        if (!data) {
          return;
        }
        const payload = safeParseJson(data);
        if (!payload) {
          return;
        }
        const eventType =
          (typeof payload.event === "string" && payload.event) || (raw.type !== "message" ? raw.type : undefined);
        const mapped = mapStreamEventPayload(payload, eventType);
        if (!mapped) {
          return;
        }
        if (!recordId(mapped.id)) {
          return;
        }
        const cursorValue =
          (typeof payload.cursor === "string" && payload.cursor) || (raw.lastEventId ? raw.lastEventId : null);
        if (cursorValue) {
          lastCursor = cursorValue;
        }
        listener(mapped);
      };

      const handleOpen = () => {
        retryIndex = 0;
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
          reconnectTimer = null;
        }
      };

      const handleError = () => {
        if (closed || usingMockFallback) {
          return;
        }
        cleanupEventSource();
        if (retryIndex >= retryBackoff.length) {
          fallbackToMock();
          return;
        }
        const delayIndex = Math.min(retryIndex, retryBackoff.length - 1);
        const delaySeconds = retryBackoff[delayIndex] ?? retryBackoff[retryBackoff.length - 1];
        retryIndex += 1;
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
        }
        reconnectTimer = window.setTimeout(() => {
          connect(lastCursor ?? undefined);
        }, delaySeconds * 1000);
      };

      const connect = (cursor?: string) => {
        if (closed || usingMockFallback) {
          return;
        }
        cleanupEventSource();
        const streamUrl = createStreamUrl(baseUrl, taskIds, cursor);
        try {
          eventSource = new EventSource(streamUrl, { withCredentials: true });
        } catch (error) {
          console.warn("[platformClient] failed to start SSE stream, falling back to mock", error);
          fallbackToMock();
          return;
        }
        eventSource.addEventListener("open", handleOpen as EventListener);
        eventSource.addEventListener("error", handleError as EventListener);
        KNOWN_STREAM_EVENT_TYPES.forEach((type) => {
          eventSource.addEventListener(type, handleMessage);
        });
      };

      connect();

      void loadTaskStreamConfig()
        .then((config) => {
          if (!closed && !usingMockFallback && config.retryBackoffSeconds.length > 0) {
            retryBackoff = config.retryBackoffSeconds;
          }
        })
        .catch(() => {
          // already logged inside loadTaskStreamConfig
        });

      return () => {
        cleanup();
      };
    },
    pushTaskEvent: mockApi.pushTaskEvent,
    estimateCredits: async (input: CreditsEstimateInput, options?: RequestOptions) => {
      const { idempotencyKey, ...rest } = input;
      const payload = {
        tenant_id: rest.tenantId,
        user_id: rest.userId,
        template_id: rest.templateId,
        scene: rest.scene,
        resolution: rest.resolution ?? "hd",
        priority: rest.priority ?? "standard",
        extras: rest.extras ?? {}
      };
      const headers = mergeHeaders(idempotencyKey ? { "X-Idempotency-Key": idempotencyKey } : undefined, options?.headers);
      const response = await http<EstimateResponsePayload>("/api/v1/credits/estimate", {
        method: "POST",
        headers,
        body: payload,
        signal: options?.signal,
        fetchOptions: options?.fetchOptions,
        retry: options?.retry,
        timeout: options?.timeout
      });
      return mapEstimateResponse(response);
    },
    preDeductCredits: async (input: CreditsPreDeductInput, options?: RequestOptions) => {
      const payload = {
        task_id: input.taskId,
        template_id: input.templateId,
        tenant_id: input.tenantId,
        user_id: input.userId,
        scene: input.scene,
        estimated_cost: input.estimatedCost,
        currency: input.currency ?? "point",
        expire_in: input.expireIn ?? 600
      };
      const headers = mergeHeaders(undefined, options?.headers);
      const response = await http<PreDeductResponsePayload>("/api/v1/credits/pre-deduct", {
        method: "POST",
        headers,
        body: payload,
        signal: options?.signal,
        fetchOptions: options?.fetchOptions,
        retry: options?.retry,
        timeout: options?.timeout
      });
      return mapPreDeductResponse(response);
    },
    commitPreDeduct: async (input: CreditsCommitInput, options?: RequestOptions) => {
      const payload = {
        pre_deduct_id: input.preDeductId,
        actual_cost: input.actualCost,
        task_id: input.taskId,
        tenant_id: input.tenantId,
        template_id: input.templateId,
        user_id: input.userId
      };
      const headers = mergeHeaders(undefined, options?.headers);
      const response = await http<PreDeductResponsePayload>("/api/v1/credits/commit", {
        method: "POST",
        headers,
        body: payload,
        signal: options?.signal,
        fetchOptions: options?.fetchOptions,
        retry: options?.retry,
        timeout: options?.timeout
      });
      return mapPreDeductResponse(response);
    },
    cancelPreDeduct: async (input: CreditsCancelInput, options?: RequestOptions) => {
      const payload = {
        pre_deduct_id: input.preDeductId,
        tenant_id: input.tenantId,
        user_id: input.userId,
        reason: input.reason
      };
      const headers = mergeHeaders(undefined, options?.headers);
      const response = await http<CancelResponsePayload>("/api/v1/credits/cancel", {
        method: "POST",
        headers,
        body: payload,
        signal: options?.signal,
        fetchOptions: options?.fetchOptions,
        retry: options?.retry,
        timeout: options?.timeout
      });
      return mapCancelResponse(response);
    },
    chargeCredits: async (input: CreditsChargeInput, options?: RequestOptions) => {
      const { idempotencyKey, ...rest } = input;
      const payload = {
        tenant_id: rest.tenantId,
        user_id: rest.userId,
        template_id: rest.templateId,
        task_id: rest.taskId,
        amount: rest.amount,
        priority: rest.priority ?? "standard",
        reason: rest.reason,
        metadata: rest.metadata ?? {}
      };
      const headers = mergeHeaders(idempotencyKey ? { "X-Idempotency-Key": idempotencyKey } : undefined, options?.headers);
      const response = await http<ChargeResponsePayload>("/api/v1/credits/charge", {
        method: "POST",
        headers,
        body: payload,
        signal: options?.signal,
        fetchOptions: options?.fetchOptions,
        retry: options?.retry,
        timeout: options?.timeout
      });
      return mapChargeResponse(response);
    },
    fetchCreditsLedger: async (query: CreditsLedgerQuery, options?: RequestOptions) => {
      const headers = mergeHeaders(undefined, options?.headers);
      const searchParams: Record<string, string | number | boolean | undefined> = {
        tenant_id: query.tenantId,
        user_id: query.userId
      };
      const mergedSearchParams = { ...searchParams, ...(options?.query ?? {}) };
      const response = await http<LedgerResponsePayload>("/api/v1/credits/ledger", {
        method: "GET",
        headers,
        signal: options?.signal,
        searchParams: mergedSearchParams,
        fetchOptions: options?.fetchOptions,
        retry: options?.retry,
        timeout: options?.timeout
      });
      return mapLedgerResponse(response);
    },
    fetchCreditsBalance: async (query: CreditsBalanceQuery, options?: RequestOptions) => {
      const headers = mergeHeaders(undefined, options?.headers);
      const searchParams: Record<string, string | number | boolean | undefined> = {
        tenant_id: query.tenantId,
        user_id: query.userId
      };
      const mergedSearchParams = { ...searchParams, ...(options?.query ?? {}) };
      const response = await http<BalanceResponsePayload>("/api/v1/credits/balance", {
        method: "GET",
        headers,
        signal: options?.signal,
        searchParams: mergedSearchParams,
        fetchOptions: options?.fetchOptions,
        retry: options?.retry,
        timeout: options?.timeout
      });
      return mapBalanceResponse(response);
    },
    checkLicense: async (input: LicenseCheckInput, options?: RequestOptions) => {
      const payload = {
        tenant_id: input.tenantId,
        template_id: input.templateId,
        user_id: input.userId,
        channel: input.channel,
        session_id: input.sessionId
      };
      const headers = mergeHeaders(undefined, options?.headers);
      const response = await http<LicenseCheckResponsePayload>("/api/v1/licenses/check", {
        method: "POST",
        headers,
        body: payload,
        signal: options?.signal,
        fetchOptions: options?.fetchOptions,
        retry: options?.retry,
        timeout: options?.timeout
      });
      return mapLicenseResponse(response);
    },
    fetchTaskStreamConfig: () => loadTaskStreamConfig()
  };
}



