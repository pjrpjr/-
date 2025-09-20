import type { FrontendApi } from "./api/types";
export type RequestOptions = {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  query?: Record<string, string | number | boolean | undefined>;
  fetchOptions?: Omit<RequestInit, "headers" | "method" | "body" | "signal"> & { signal?: AbortSignal };
  retry?: { attempts: number; delayMs?: number };
  timeout?: number;
};

export type CtaAction = {
  label: string;
  href?: string;
  target?: "_blank" | "_self";
  tone?: "primary" | "secondary" | "ghost";
};

export type HeroMetric = {
  label: string;
  value: string;
  tooltip?: string;
};

export type HeroStep = {
  id: string;
  title: string;
  description: string;
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  steps: HeroStep[];
  ctas: [CtaAction, CtaAction?];
  metrics: HeroMetric[];
  carousel: Array<{
    id: string;
    account: string;
    avatarUrl: string;
    earning: string;
    replicas: number;
    authorizations: number;
    trend: "up" | "steady" | "down";
    templatePreview: string;
    workflowLink: string;
  }>;
};

export type MonetizationStage = {
  id: string;
  title: string;
  description: string;
  highlight: string;
  nextAction: string;
};

export type MonetizationPathContent = {
  title: string;
  description: string;
  stages: MonetizationStage[];
};

export type CaseStudy = {
  id: string;
  name: string;
  avatarUrl: string;
  coverUrl: string;
  industry: string;
  summary: string;
  metrics: Array<{ label: string; value: string; trend?: string }>;
  testimonial: {
    author: string;
    role: string;
    quote: string;
  };
};

export type TemplateCard = {
  id: string;
  title: string;
  category: string;
  coverUrl: string;
  creator: string;
  score: number;
  price: number;
  favorite?: boolean;
  status: "available" | "cooldown" | "pending" | "locked";
  tags: string[];
  parameters: {
    requirement: string;
    assets: string;
    duration: string;
  };
};

export type ComplianceNoticeContent = {
  title: string;
  description: string;
  highlights: Array<{
    label: string;
    detail: string;
    tone?: "info" | "warning" | "danger";
  }>;
  helpLinks: Array<{ label: string; href: string }>;
};

export type QuickStartContent = {
  title: string;
  subtitle: string;
  checklist: Array<{
    id: string;
    label: string;
    status: "done" | "pending" | "locked";
    illustration?: string;
  }>;
  actions: CtaAction[];
};

export type TaskEvent = {
  id: string;
  type: "render" | "training" | "license" | "refund";
  status: "queued" | "running" | "success" | "failed";
  label: string;
  timestamp: string;
  progress?: number;
  context: string;
  impact?: string;
  stage?: string;
  nextEta?: string | null;
  queuePosition?: number | null;
  policyTag?: string | null;
  actionRequired?: string | null;
  riskLevel?: "high" | "medium" | "low" | null;
  escalationLevel?: "none" | "ops_review" | "compliance_committee" | null;
  creditBalance?: number | null;
  personaTag?: string | null;
};

export type RolePersonaContent = {
  role: "viewer" | "creator";
  title: string;
  description: string;
  icon?: string;
  shortcuts: Array<{ label: string; href: string }>;
};

export type LandingPageContent = {
  hero: HeroContent;
  monetization: MonetizationPathContent;
  caseStudies: CaseStudy[];
  templates: TemplateCard[];
  compliance: ComplianceNoticeContent;
  quickStart: QuickStartContent;
  personas: RolePersonaContent[];
  initialEvents: TaskEvent[];
};

export type ReviewPriority = "high" | "medium" | "low";
export type ReviewStatus = "pending" | "recheck" | "blocked" | "approved" | "paused";

export type ReviewSubmission = {
  id: string;
  templateId: string;
  templateName: string;
  creatorId: string;
  creatorHandle: string;
  submittedAt: string;
  status: ReviewStatus;
  priority: ReviewPriority;
  riskScore: number;
  assets: Array<{
    id: string;
    type: "image" | "video" | "zip";
    label: string;
    thumbnailUrl: string;
    downloadUrl: string;
  }>;
  licenses: Array<{
    id: string;
    holder: string;
    expiresAt: string;
    scope: string;
  }>;
  aiFindings: Array<{
    label: string;
    confidence: number;
    previewUrl?: string;
  }>;
  history: Array<{
    actor: string;
    action: string;
    timestamp: string;
    note?: string;
  }>;
  violations: Array<{
    code: string;
    label: string;
    resolved: boolean;
    note?: string;
  }>;
  actions: Array<ReviewActionOption>;
};

export type ReviewActionOption = {
  action: "approve" | "reject" | "hold" | "escalate";
  label: string;
  slaMinutes?: number;
  confirmation?: boolean;
};

export type ReviewRejectionReasonCode =
  | "missing_materials"
  | "metadata_invalid"
  | "compliance_violation"
  | "inconsistent_style"
  | "monetization_unverified"
  | "duplicate_template";

export type ReviewRejectionReason = {
  code: ReviewRejectionReasonCode;
  label: string;
  description: string;
  requiresFollowUp: boolean;
};

export type ReportActionCode =
  | "takedown"
  | "notify_creator"
  | "refund_credit"
  | "escalate"
  | "penalize";

export type ReportActionDefinition = {
  action: ReportActionCode;
  label: string;
  description: string;
};

export type RefundReasonCode = "task_failed" | "manual_adjust" | "report_penalty";

export type RefundLedgerField = {
  field: string;
  label: string;
  description: string;
};

export type RefundLedgerEntry = {
  transactionId: string;
  refundId: string;
  reasonCode: RefundReasonCode;
  operatorId: string;
  operatorRole: "reviewer" | "compliance" | "admin";
  amount: number;
  occurredAt: string;
  memo?: string;
};
export type ReviewDecisionInput = {
  submissionId: string;
  templateId: string;
  tenantId: string;
  operatorId: string;
  action: ReviewActionOption["action"];
  reasonCode: ReviewRejectionReasonCode;
  note?: string;
};

export type ReviewDecisionResult = {
  submissionId: string;
  status: "received" | "recorded";
  processedAt: string;
};

export type ReportActionInput = {
  reportId: string;
  action: ReportActionCode;
  operatorId: string;
  note?: string;
  refundAmount?: number;
};

export type ReportActionResult = {
  reportId: string;
  status: "acknowledged" | "queued" | "completed";
  processedAt: string;
};

export type ReportChannel = "in-app" | "email" | "manual";
export type ReportSeverity = "low" | "medium" | "high";
export type ReportStatus = "open" | "investigating" | "resolved" | "suspended";

export type ReportTicket = {
  id: string;
  templateId: string;
  templateName: string;
  reporterId: string;
  channel: ReportChannel;
  reportedAt: string;
  status: ReportStatus;
  severity: ReportSeverity;
  description: string;
  evidence: Array<{
    id: string;
    type: "image" | "video" | "pdf" | "link";
    label: string;
    url: string;
    thumbnailUrl?: string;
  }>;
  relatedTasks: Array<{
    taskId: string;
    type: TaskEvent["type"];
    status: TaskEvent["status"];
    creditImpact: number;
  }>;
  creditImpact: {
    currency: string;
    frozen: number;
    refunded: number;
  };
  handlers: Array<{
    actor: string;
    action: string;
    timestamp: string;
    note?: string;
  }>;
  actions: Array<{
    action: ReportActionCode;
    label: string;
    description?: string;
  }>;
  refundLedger: RefundLedgerEntry[];
};
export type CreditsPriority = "standard" | "accelerated";

export type CreditsEstimateInput = {
  tenantId: string;
  userId: string;
  templateId: string;
  scene: string;
  resolution?: "sd" | "hd" | "4k";
  priority?: CreditsPriority;
  extras?: Record<string, number>;
  idempotencyKey?: string;
};

export type CreditsEstimateOption = {
  priority: CreditsPriority;
  totalCost: number;
  etaMinutes: number;
};

export type CreditsEstimate = {
  currency: string;
  templateId: string;
  scene: string;
  resolution: string;
  priority: CreditsPriority;
  currentBalance: number;
  selectedCost: number;
  estimatedCost: number;
  minCost: number;
  maxCost: number;
  calculationBasis: string;
  policyTag?: string | null;
  auditId: string;
  suggestTopup: number;
  extras: Record<string, number>;
  options: CreditsEstimateOption[];
};

export type CreditsPreDeductInput = {
  taskId: string;
  templateId: string;
  tenantId: string;
  userId: string;
  scene: string;
  estimatedCost: number;
  currency?: string;
  expireIn?: number;
};

export type CreditsPreDeduct = {
  preDeductId: string;
  frozenAmount: number;
  balanceAfter: number;
  quotaSnapshot: {
    templateQuota: number;
    userUsage: number;
  };
  expireAt: string;
};

export type CreditsCommitInput = {
  preDeductId: string;
  actualCost: number;
  taskId: string;
  tenantId: string;
  templateId: string;
  userId: string;
};

export type CreditsCancelInput = {
  preDeductId: string;
  tenantId: string;
  userId?: string;
  reason: string;
};

export type CreditsCancelResult = {
  preDeductId: string;
  status: string;
  reason: string;
  balanceAfter: number;
};

export type CreditsChargeReason = "task_commit" | "acceleration" | "manual_adjust" | "charge";

export type CreditsChargeInput = {
  tenantId: string;
  userId: string;
  templateId?: string;
  taskId?: string;
  amount: number;
  priority?: CreditsPriority;
  reason: CreditsChargeReason;
  metadata?: Record<string, unknown>;
  idempotencyKey?: string;
};

export type CreditsChargeResult = {
  ledgerId: string;
  tenantId: string;
  userId?: string | null;
  taskId?: string | null;
  balanceAfter: number;
  change: number;
  reason: string;
  policyTag?: string | null;
  createdAt: string;
};

export type CreditsLedgerQuery = {
  tenantId: string;
  userId?: string;
};

export type CreditsLedgerEntry = {
  ledgerId: string;
  taskId?: string | null;
  change: number;
  balanceAfter: number;
  reason: string;
  createdAt: string;
};

export type CreditsLedger = {
  tenantId: string;
  userId?: string | null;
  entries: CreditsLedgerEntry[];
};

export type CreditsBalanceQuery = {
  tenantId: string;
  userId?: string;
};

export type CreditsBalance = {
  tenantId: string;
  userId?: string | null;
  balance: number;
  frozen: number;
  currency: string;
};

export type LicenseChannel = "viewer" | "creator" | "external";

export type LicenseCheckInput = {
  tenantId: string;
  templateId: string;
  userId: string;
  channel: LicenseChannel;
  sessionId?: string;
};

export type LicenseReasonCode =
  | "valid"
  | "expired"
  | "revoked"
  | "missing_documents"
  | "daily_quota_exceeded";

export type LicenseCheckResult = {
  isAuthorized: boolean;
  reasonCode: LicenseReasonCode;
  remainingQuota: number;
  dailyRemaining: number;
  validUntil: string | null;
  policyTag?: string | null;
  requirements: string[];
};

export type TaskStreamCadenceStep = {
  event: string;
  delaySeconds: number;
  stage: string;
};

export type TaskStreamConfig = {
  wsUrl: string;
  sseUrl: string;
  token: string;
  cadence: TaskStreamCadenceStep[];
  retryBackoffSeconds: number[];
};

export type PlatformAdapterApi = FrontendApi & {
  estimateCredits: (input: CreditsEstimateInput, options?: RequestOptions) => Promise<CreditsEstimate>;
  preDeductCredits: (input: CreditsPreDeductInput, options?: RequestOptions) => Promise<CreditsPreDeduct>;
  commitPreDeduct: (input: CreditsCommitInput, options?: RequestOptions) => Promise<CreditsPreDeduct>;
  cancelPreDeduct: (input: CreditsCancelInput, options?: RequestOptions) => Promise<CreditsCancelResult>;
  chargeCredits: (input: CreditsChargeInput, options?: RequestOptions) => Promise<CreditsChargeResult>;
  fetchCreditsLedger: (query: CreditsLedgerQuery, options?: RequestOptions) => Promise<CreditsLedger>;
  fetchCreditsBalance: (query: CreditsBalanceQuery, options?: RequestOptions) => Promise<CreditsBalance>;
  checkLicense: (input: LicenseCheckInput, options?: RequestOptions) => Promise<LicenseCheckResult>;
  fetchTaskStreamConfig: () => Promise<TaskStreamConfig>;
  submitReviewDecision: (input: ReviewDecisionInput, options?: RequestOptions) => Promise<ReviewDecisionResult>;
  executeReportAction: (input: ReportActionInput, options?: RequestOptions) => Promise<ReportActionResult>;
};


