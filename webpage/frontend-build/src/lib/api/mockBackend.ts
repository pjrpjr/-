import { landingPageContent } from "../../data/siteContent";
import { reviewQueueMock } from "../../data/reviewQueue";
import { reportTicketsMock } from "../../data/reportTickets";
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
  CreditsLedgerEntry,
  CreditsLedgerQuery,
  CreditsPreDeduct,
  CreditsPreDeductInput,
  LandingPageContent,
  LicenseCheckInput,
  LicenseCheckResult,
  PlatformAdapterApi,
  ReportTicket,
  ReviewSubmission,
  ReviewDecisionInput,
  ReviewDecisionResult,
  ReportActionInput,
  ReportActionResult,
  TaskEvent,
  TaskStreamConfig,
  RequestOptions
} from "../types";

const NETWORK_DELAY = 160;
const DEFAULT_BALANCE = 980;
const POLICY_TAGS = ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2", "D3"];
const ACTION_REQUIRED_CHOICES = ["resubmit_material", "update_copy", "remove_asset", "appeal_only", "escalate_review"];
const PERSONA_TAGS = ["creator_studio", "operator_contractor"];
class MockApiError extends Error {
  status: number;
  code: string;
  detail?: unknown;

  constructor(status: number, code: string, message?: string, detail?: unknown) {
    super(message ?? code);
    this.name = "MockApiError";
    this.status = status;
    this.code = code;
    this.detail = detail;
  }
}

function createError(status: number, code: string, message?: string, detail?: unknown) {
  return new MockApiError(status, code, message, detail);
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function delay(ms = NETWORK_DELAY) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchLandingPageContent(): Promise<LandingPageContent> {
  await delay();
  return clone(landingPageContent);
}

export async function fetchReviewQueue(): Promise<ReviewSubmission[]> {
  await delay();
  return clone(reviewQueueMock);
}

export async function fetchReportTickets(): Promise<ReportTicket[]> {
  await delay();
  return clone(reportTicketsMock);
}

export async function submitReviewDecision(input: ReviewDecisionInput): Promise<ReviewDecisionResult> {
  await delay(120);
  const submission = reviewQueueMock.find((item) => item.id === input.submissionId);
  if (!submission) {
    throw createError(404, "40444", "review_submission_not_found");
  }
  const statusMap: Record<string, ReviewSubmission["status"]> = {
    approve: "approved",
    reject: "blocked",
    hold: "paused",
    escalate: "recheck"
  };
  const processedAt = new Date().toISOString();
  const nextStatus = statusMap[input.action];
  if (nextStatus) {
    submission.status = nextStatus;
  }
  submission.history = [
    {
      actor: input.operatorId,
      action: input.action,
      timestamp: processedAt,
      note: input.note ?? undefined
    },
    ...submission.history
  ];
  if (input.action === "reject") {
    submission.violations.push({
      code: input.reasonCode,
      label: input.reasonCode.replace(/_/g, " "),
      resolved: false,
      note: input.note ?? undefined
    });
  }
  reviewDecisionLog.push({
    submissionId: input.submissionId,
    action: input.action,
    reasonCode: input.reasonCode,
    processedAt,
    note: input.note ?? undefined
  });
  return {
    submissionId: input.submissionId,
    status: "recorded",
    processedAt
  };
}

export async function executeReportAction(input: ReportActionInput): Promise<ReportActionResult> {
  await delay(150);
  const ticket = reportTicketsMock.find((item) => item.id === input.reportId);
  if (!ticket) {
    throw createError(404, "40445", "report_ticket_not_found");
  }
  const processedAt = new Date().toISOString();
  ticket.handlers.push({
    actor: input.operatorId,
    action: input.action,
    timestamp: processedAt,
    note: input.note ?? undefined
  });
  switch (input.action) {
    case "takedown":
      ticket.status = "suspended";
      break;
    case "notify_creator":
      ticket.status = ticket.status === "open" ? "investigating" : ticket.status;
      break;
    case "refund_credit": {
      const amount = input.refundAmount ?? Math.max(8, ticket.creditImpact.frozen || 0);
      ticket.creditImpact.refunded += amount;
      ticket.creditImpact.frozen = Math.max(0, ticket.creditImpact.frozen - amount);
      const refundId = "mock-refund-" + Math.random().toString(16).slice(2, 8);
      ticket.refundLedger.push({
        transactionId: "mock-txn-" + Math.random().toString(16).slice(2, 8),
        refundId,
        reasonCode: amount >= 12 ? "report_penalty" : "manual_adjust",
        operatorId: input.operatorId,
        operatorRole: "compliance",
        amount,
        occurredAt: processedAt,
        memo: input.note ?? undefined
      });
      ticket.status = "resolved";
      break;
    }
    case "escalate":
      ticket.status = "investigating";
      break;
    case "penalize":
      ticket.status = "resolved";
      break;
    default:
      break;
  }
  reportActionLog.push({
    reportId: input.reportId,
    action: input.action,
    processedAt,
    note: input.note ?? undefined
  });
  return {
    reportId: input.reportId,
    status: "acknowledged",
    processedAt
  };
}

const initialTaskEvents: TaskEvent[] = clone(landingPageContent.initialEvents ?? []);

const taskEventListeners = new Set<(event: TaskEvent) => void>();
let streamTimer: ReturnType<typeof setInterval> | null = null;
let syntheticCounter = initialTaskEvents.length + 1;

const accountStore = new Map<string, AccountState>();
const preDeductStore = new Map<string, PreDeductRecord>();
let preDeductSequence = 1;
let ledgerSequence = 1;

type AccountState = {
  balance: number;
  frozen: number;
  ledger: CreditsLedgerEntry[];
};

type PreDeductRecord = {
  id: string;
  tenantId: string;
  userId: string;
  templateId: string;
  taskId: string;
  amount: number;
  status: "pending" | "committed" | "cancelled";
  expireAt: Date;
};

function accountKey(tenantId: string, userId?: string) {
  return `${tenantId}::${userId ?? "default"}`;
}

function ensureAccount(tenantId: string, userId?: string): AccountState {
  const key = accountKey(tenantId, userId);
  if (!accountStore.has(key)) {
    accountStore.set(key, {
      balance: DEFAULT_BALANCE,
      frozen: 0,
      ledger: []
    });
  }
  return accountStore.get(key)!;
}

function recordLedger(
  tenantId: string,
  userId: string | undefined,
  change: number,
  reason: string,
  taskId?: string | null,
  applyToBalance = true
) {
  const account = ensureAccount(tenantId, userId);
  if (applyToBalance) {
    account.balance += change;
  }
  const entry: CreditsLedgerEntry = {
    ledgerId: `mock-ledger-${ledgerSequence++}`,
    taskId: taskId ?? null,
    change,
    balanceAfter: account.balance,
    reason,
    createdAt: new Date().toISOString()
  };
  account.ledger.unshift(entry);
  return entry;
}

function emitTaskEvent(event: TaskEvent) {
  for (const listener of taskEventListeners) {
    listener(clone(event));
  }
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function generateTaskEvent(): TaskEvent {
  const templates = landingPageContent.templates;
  const template = pickRandom(templates);
  const statuses: TaskEvent["status"][] = ["queued", "running", "success", "failed"];
  const types: TaskEvent["type"][] = ["render", "training", "license", "refund"];
  const status = pickRandom(statuses);
  const type = pickRandom(types);
  const timestamp = new Date().toISOString();
  const base: TaskEvent = {
    id: `evt-${syntheticCounter++}`,
    type,
    status,
    label: `${template.title} - ${
      type === "render"
        ? "出图"
        : type === "training"
        ? "训练"
        : type === "license"
        ? "授权"
        : "积分调整"
    }`,
    timestamp,
    context: `${template.creator} · ${template.category}`
  };

  if (status === "running") {
    base.progress = Math.min(95, 20 + Math.round(Math.random() * 70));
    base.impact = type === "render" ? `预计扣除 ${template.price} 积分` : undefined;
  } else if (status === "success") {
    base.progress = 100;
    base.impact = type === "refund" ? "已回滚 12 积分" : `已扣除 ${template.price} 积分`;
  } else if (status === "failed") {
    base.impact = "请检查合规日志或重试";
  }

  base.stage =
    status === "queued"
      ? "ingest"
      : status === "running"
      ? "processing"
      : status === "success"
      ? "delivery"
      : "exception";
  const etaMinutes =
    status === "queued"
      ? 12 + Math.floor(Math.random() * 18)
      : status === "running"
      ? 4 + Math.floor(Math.random() * 10)
      : null;
  base.nextEta = etaMinutes ? new Date(Date.now() + etaMinutes * 60_000).toISOString() : null;
  base.queuePosition = status === "queued" ? Math.ceil(Math.random() * 5) : null;
  base.personaTag = pickRandom(PERSONA_TAGS);
  if (status === "failed") {
    base.policyTag = pickRandom(POLICY_TAGS);
    base.actionRequired = pickRandom(ACTION_REQUIRED_CHOICES);
    base.escalationLevel =
      base.actionRequired === "escalate_review"
        ? pickRandom(["ops_review", "compliance_committee"])
        : "ops_review";
    base.riskLevel = "high";
  } else {
    base.policyTag = null;
    base.actionRequired = null;
    base.escalationLevel = "none";
    base.riskLevel = status === "running" ? "medium" : "low";
  }
  base.creditBalance = Math.max(0, DEFAULT_BALANCE - Math.floor(Math.random() * 320));

  return base;
}

function ensureAutoStream() {
  if (streamTimer) {
    return;
  }
  streamTimer = setInterval(() => {
    emitTaskEvent(generateTaskEvent());
  }, 25000);
}

export async function loadInitialTaskEvents(): Promise<TaskEvent[]> {
  await delay(80);
  return clone(initialTaskEvents);
}

export function subscribeTaskEvents(listener: (event: TaskEvent) => void) {
  taskEventListeners.add(listener);
  ensureAutoStream();
  return () => {
    taskEventListeners.delete(listener);
    if (taskEventListeners.size === 0 && streamTimer) {
      clearInterval(streamTimer);
      streamTimer = null;
    }
  };
}

export function pushMockTaskEvent(event?: TaskEvent) {
  const payload = event ?? generateTaskEvent();
  emitTaskEvent(payload);
}

function templateBaseCost(templateId: string) {
  const template = landingPageContent.templates.find((item) => item.id === templateId);
  return template?.price ?? 32;
}

export async function estimateCredits(input: CreditsEstimateInput): Promise<CreditsEstimate> {
  await delay();
  const account = ensureAccount(input.tenantId, input.userId);
  const base = templateBaseCost(input.templateId);
  const extrasTotal = Object.values(input.extras ?? {}).reduce((acc, value) => acc + value, 0);
  const isAccelerated = input.priority === "accelerated";
  const acceleratedCost = Math.max(1, Math.round((base + extrasTotal) * 1.4));
  const standardCost = Math.max(1, Math.round(base + extrasTotal));
  const estimatedCost = isAccelerated ? acceleratedCost : standardCost;
  const options = [
    {
      priority: "standard" as const,
      totalCost: standardCost,
      etaMinutes: 8
    },
    {
      priority: "accelerated" as const,
      totalCost: acceleratedCost,
      etaMinutes: 3
    }
  ];
  return {
    currency: "point",
    templateId: input.templateId,
    scene: input.scene,
    resolution: input.resolution ?? "hd",
    priority: input.priority ?? "standard",
    currentBalance: account.balance,
    selectedCost: estimatedCost,
    estimatedCost,
    minCost: Math.min(...options.map((item) => item.totalCost)),
    maxCost: Math.max(...options.map((item) => item.totalCost)),
    calculationBasis: "pricing_mock_v20250919",
    policyTag: null,
    auditId: `mock-audit-${Date.now()}`,
    suggestTopup: Math.max(0, estimatedCost - account.balance),
    extras: input.extras ?? {},
    options
  };
}

export async function preDeductCredits(input: CreditsPreDeductInput): Promise<CreditsPreDeduct> {
  await delay();
  const account = ensureAccount(input.tenantId, input.userId);
  const amount = Math.max(0, Math.round(input.estimatedCost));
  if (account.balance < amount) {
    throw createError(403, "40302", "insufficient_balance");
  }
  account.balance -= amount;
  account.frozen += amount;
  const id = `mock-pd-${preDeductSequence++}`;
  const expireSeconds = input.expireIn ?? 600;
  const expireAt = new Date(Date.now() + expireSeconds * 1000);
  preDeductStore.set(id, {
    id,
    tenantId: input.tenantId,
    userId: input.userId,
    templateId: input.templateId,
    taskId: input.taskId,
    amount,
    status: "pending",
    expireAt
  });
  return {
    preDeductId: id,
    frozenAmount: amount,
    balanceAfter: account.balance,
    quotaSnapshot: {
      templateQuota: 200,
      userUsage: Math.max(0, 30 - Math.floor(account.balance / 40))
    },
    expireAt: expireAt.toISOString()
  };
}

export async function commitPreDeduct(input: CreditsCommitInput): Promise<CreditsPreDeduct> {
  await delay();
  const record = preDeductStore.get(input.preDeductId);
  if (!record) {
    throw createError(404, "40401", "pre_deduct_not_found");
  }
  if (record.status !== "pending") {
    throw createError(409, "40901", "pre_deduct_already_processed");
  }
  record.status = "committed";
  const account = ensureAccount(input.tenantId, input.userId);
  const finalCost = Math.max(0, Math.round(input.actualCost));
  const release = Math.max(0, record.amount - finalCost);
  account.frozen -= record.amount;
  if (release > 0) {
    account.balance += release;
  }
  recordLedger(input.tenantId, input.userId, -finalCost, "task_commit", input.taskId, false);
  return {
    preDeductId: record.id,
    frozenAmount: finalCost,
    balanceAfter: account.balance,
    quotaSnapshot: {
      templateQuota: 200,
      userUsage: Math.max(0, 30 - Math.floor(account.balance / 40))
    },
    expireAt: record.expireAt.toISOString()
  };
}

export async function cancelPreDeduct(input: CreditsCancelInput): Promise<CreditsCancelResult> {
  await delay();
  const record = preDeductStore.get(input.preDeductId);
  if (!record) {
    throw createError(404, "40401", "pre_deduct_not_found");
  }
  if (record.status !== "pending") {
    throw createError(409, "40901", "pre_deduct_already_processed");
  }
  record.status = "cancelled";
  const account = ensureAccount(record.tenantId, record.userId);
  account.frozen -= record.amount;
  account.balance += record.amount;
  recordLedger(record.tenantId, record.userId, 0, "pre_deduct_cancelled", record.taskId, false);
  return {
    preDeductId: record.id,
    status: record.status,
    reason: input.reason,
    balanceAfter: account.balance
  };
}

export async function chargeCredits(input: CreditsChargeInput): Promise<CreditsChargeResult> {
  await delay();
  const account = ensureAccount(input.tenantId, input.userId);
  const amount = Math.max(0, Math.round(input.amount));
  if (account.balance < amount) {
    throw createError(402, "40201", "insufficient_balance");
  }
  const entry = recordLedger(input.tenantId, input.userId, -amount, input.reason, input.taskId);
  return {
    ledgerId: entry.ledgerId,
    tenantId: input.tenantId,
    userId: input.userId,
    taskId: input.taskId ?? null,
    balanceAfter: entry.balanceAfter,
    change: entry.change,
    reason: input.reason,
    policyTag: null,
    createdAt: entry.createdAt
  };
}

export async function fetchCreditsLedger(query: CreditsLedgerQuery, _options?: RequestOptions): Promise<CreditsLedger> {
  await delay();
  const account = ensureAccount(query.tenantId, query.userId);
  return {
    tenantId: query.tenantId,
    userId: query.userId ?? null,
    entries: clone(account.ledger.slice(0, 20))
  };
}

export async function fetchCreditsBalance(query: CreditsBalanceQuery, _options?: RequestOptions): Promise<CreditsBalance> {
  await delay();
  const account = ensureAccount(query.tenantId, query.userId);
  return {
    tenantId: query.tenantId,
    userId: query.userId ?? null,
    balance: account.balance,
    frozen: account.frozen,
    currency: "point"
  };
}

export async function checkLicense(input: LicenseCheckInput, _options?: RequestOptions): Promise<LicenseCheckResult> {
  await delay();
  const blocked = input.userId.endsWith("-blocked");
  const externalChannel = input.channel === "external";
  const isAuthorized = !blocked && !externalChannel;
  return {
    isAuthorized,
    reasonCode: isAuthorized ? "valid" : blocked ? "revoked" : "missing_documents",
    remainingQuota: isAuthorized ? 240 : 0,
    dailyRemaining: isAuthorized ? (input.channel === "creator" ? 24 : 12) : 0,
    validUntil: isAuthorized ? new Date(Date.now() + 5 * 86400000).toISOString() : null,
    policyTag: isAuthorized ? null : blocked ? "B2" : "A1",
    requirements: isAuthorized ? [] : ["upload_authorization_contract"]
  };
}

const streamConfig: TaskStreamConfig = {
  wsUrl: "wss://mock.platform-integration/ws/v1/tasks/stream",
  sseUrl: "https://mock.platform-integration/sse/v1/tasks/stream",
  token: "mock-jwt-token",
  cadence: [
    { event: "task.accepted", delaySeconds: 0, stage: "ingest" },
    { event: "task.running", delaySeconds: 180, stage: "processing" },
    { event: "task.completed", delaySeconds: 360, stage: "delivery" }
  ],
  retryBackoffSeconds: [1, 2, 5]
};

export async function fetchTaskStreamConfig(): Promise<TaskStreamConfig> {
  await delay(40);
  return clone(streamConfig);
}

export const mockApi: PlatformAdapterApi = {
  fetchLandingPageContent,
  fetchReviewQueue,
  fetchReportTickets,
  submitReviewDecision,
  executeReportAction,
  loadInitialTaskEvents,
  subscribeTaskEvents,
  pushTaskEvent: pushMockTaskEvent,
  estimateCredits,
  preDeductCredits,
  commitPreDeduct,
  cancelPreDeduct,
  chargeCredits,
  fetchCreditsLedger,
  fetchCreditsBalance,
  checkLicense,
  fetchTaskStreamConfig
};





