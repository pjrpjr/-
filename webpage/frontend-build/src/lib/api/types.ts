import type {
  LandingPageContent,
  ReportTicket,
  ReviewSubmission,
  ReviewDecisionInput,
  ReviewDecisionResult,
  ReportActionInput,
  ReportActionResult,
  TaskEvent
} from "../types";

export type TaskEventListener = (event: TaskEvent) => void;

export type FrontendApi = {
  fetchLandingPageContent: () => Promise<LandingPageContent>;
  fetchReviewQueue: () => Promise<ReviewSubmission[]>;
  fetchReportTickets: () => Promise<ReportTicket[]>;
  loadInitialTaskEvents: () => Promise<TaskEvent[]>;
  subscribeTaskEvents: (listener: TaskEventListener) => () => void;
  pushTaskEvent: (event?: TaskEvent) => void;
  submitReviewDecision: (input: ReviewDecisionInput) => Promise<ReviewDecisionResult>;
  executeReportAction: (input: ReportActionInput) => Promise<ReportActionResult>;
};
