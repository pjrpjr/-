import type { PlatformAdapterApi, TaskEvent } from "../types";
import { mockApi } from "./mockBackend";
import { createPlatformClient, PlatformApiError } from "./platformClient";
import type { PlatformClientOptions } from "./platformClient";

let currentAdapter: PlatformAdapterApi = mockApi;

export function setApiAdapter(adapter: PlatformAdapterApi) {
  currentAdapter = adapter;
}

export function usePlatformClient(options?: PlatformClientOptions) {
  currentAdapter = createPlatformClient(options);
  return currentAdapter;
}

export const api = {
  fetchLandingPageContent: () => currentAdapter.fetchLandingPageContent(),
  fetchReviewQueue: () => currentAdapter.fetchReviewQueue(),
  fetchReportTickets: () => currentAdapter.fetchReportTickets(),
  submitReviewDecision: (
    input: Parameters<PlatformAdapterApi["submitReviewDecision"]>[0]
  ) => currentAdapter.submitReviewDecision(input),
  executeReportAction: (
    input: Parameters<PlatformAdapterApi["executeReportAction"]>[0]
  ) => currentAdapter.executeReportAction(input),
  loadInitialTaskEvents: () => currentAdapter.loadInitialTaskEvents(),
  subscribeTaskEvents: (
    listener: Parameters<PlatformAdapterApi["subscribeTaskEvents"]>[0]
  ) => currentAdapter.subscribeTaskEvents(listener),
  pushTaskEvent: (event?: TaskEvent) => currentAdapter.pushTaskEvent(event),
  estimateCredits: (
    input: Parameters<PlatformAdapterApi["estimateCredits"]>[0],
    options?: Parameters<PlatformAdapterApi["estimateCredits"]>[1]
  ) => currentAdapter.estimateCredits(input, options),
  preDeductCredits: (
    input: Parameters<PlatformAdapterApi["preDeductCredits"]>[0],
    options?: Parameters<PlatformAdapterApi["preDeductCredits"]>[1]
  ) => currentAdapter.preDeductCredits(input, options),
  commitPreDeduct: (
    input: Parameters<PlatformAdapterApi["commitPreDeduct"]>[0],
    options?: Parameters<PlatformAdapterApi["commitPreDeduct"]>[1]
  ) => currentAdapter.commitPreDeduct(input, options),
  cancelPreDeduct: (
    input: Parameters<PlatformAdapterApi["cancelPreDeduct"]>[0],
    options?: Parameters<PlatformAdapterApi["cancelPreDeduct"]>[1]
  ) => currentAdapter.cancelPreDeduct(input, options),
  chargeCredits: (
    input: Parameters<PlatformAdapterApi["chargeCredits"]>[0],
    options?: Parameters<PlatformAdapterApi["chargeCredits"]>[1]
  ) => currentAdapter.chargeCredits(input, options),
  fetchCreditsLedger: (
    query: Parameters<PlatformAdapterApi["fetchCreditsLedger"]>[0],
    options?: Parameters<PlatformAdapterApi["fetchCreditsLedger"]>[1]
  ) => currentAdapter.fetchCreditsLedger(query, options),
  fetchCreditsBalance: (
    query: Parameters<PlatformAdapterApi["fetchCreditsBalance"]>[0],
    options?: Parameters<PlatformAdapterApi["fetchCreditsBalance"]>[1]
  ) => currentAdapter.fetchCreditsBalance(query, options),
  checkLicense: (
    input: Parameters<PlatformAdapterApi["checkLicense"]>[0],
    options?: Parameters<PlatformAdapterApi["checkLicense"]>[1]
  ) => currentAdapter.checkLicense(input, options),
  fetchTaskStreamConfig: () => currentAdapter.fetchTaskStreamConfig()
};

export { createPlatformClient, PlatformApiError };
export type { PlatformClientOptions };
export type { PlatformAdapterApi } from "../types";
export type { FrontendApi } from "./types";
