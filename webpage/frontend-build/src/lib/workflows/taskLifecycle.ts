import { api } from "../api";
import { PlatformApiError } from "../api/platformClient";
import type {
  CreditsCancelInput,
  CreditsCancelResult,
  CreditsCommitInput,
  CreditsPreDeduct,
  CreditsPreDeductInput,
  RequestOptions
} from "../types";

type WithRequestOptions = {
  requestOptions?: RequestOptions;
};

export type TaskLifecycleContext = {
  tenantId: string;
  templateId: string;
  userId: string;
  taskId: string;
  scene: string;
};

export type HoldRequest = TaskLifecycleContext &
  WithRequestOptions & {
    estimatedCost: number;
    currency?: string;
    expireInSeconds?: number;
  };

export type HoldSnapshot = CreditsPreDeduct & {
  requestedCost: number;
  scene: string;
};

export async function holdTaskCredits(request: HoldRequest): Promise<HoldSnapshot> {
  const payload: CreditsPreDeductInput = {
    taskId: request.taskId,
    templateId: request.templateId,
    tenantId: request.tenantId,
    userId: request.userId,
    scene: request.scene,
    estimatedCost: request.estimatedCost,
    currency: request.currency,
    expireIn: request.expireInSeconds
  };
  const response = await api.preDeductCredits(payload, request.requestOptions);
  return {
    ...response,
    requestedCost: request.estimatedCost,
    scene: request.scene
  };
}

export type CommitRequest = TaskLifecycleContext &
  WithRequestOptions & {
    preDeductId: string;
    actualCost: number;
    holdSnapshot?: HoldSnapshot;
  };

export type CommitResult = {
  receipt: CreditsPreDeduct;
  refundAmount: number;
};

export async function commitTaskCredits(request: CommitRequest): Promise<CommitResult> {
  const payload: CreditsCommitInput = {
    preDeductId: request.preDeductId,
    actualCost: request.actualCost,
    taskId: request.taskId,
    tenantId: request.tenantId,
    templateId: request.templateId,
    userId: request.userId
  };

  const receipt = await api.commitPreDeduct(payload, request.requestOptions);
  const baselineHold = request.holdSnapshot?.frozenAmount ?? request.actualCost;
  const refundAmount = Math.max(0, baselineHold - request.actualCost);

  return {
    receipt,
    refundAmount
  };
}

export type CancelRequest = WithRequestOptions & {
  preDeductId: string;
  tenantId: string;
  userId?: string;
  reason?: string;
};

export async function cancelTaskHold(request: CancelRequest): Promise<CreditsCancelResult> {
  const payload: CreditsCancelInput = {
    preDeductId: request.preDeductId,
    tenantId: request.tenantId,
    userId: request.userId,
    reason: request.reason ?? "user_cancelled"
  };
  return api.cancelPreDeduct(payload, request.requestOptions);
}

export type RetryRequest = HoldRequest & {
  previousHold?: {
    preDeductId: string;
    tenantId: string;
    userId?: string;
    reason?: string;
  };
  cancelReason?: string;
};

export type RetryResult = {
  cancellation?: CreditsCancelResult | null;
  hold: HoldSnapshot;
  cancelError?: PlatformApiError | null;
};

export async function retryTaskHoldLifecycle(request: RetryRequest): Promise<RetryResult> {
  let cancellation: CreditsCancelResult | null = null;
  let cancelError: PlatformApiError | null = null;

  if (request.previousHold) {
    try {
      cancellation = await cancelTaskHold({
        preDeductId: request.previousHold.preDeductId,
        tenantId: request.previousHold.tenantId,
        userId: request.previousHold.userId,
        reason: request.cancelReason ?? request.previousHold.reason ?? "retry_requested",
        requestOptions: request.requestOptions
      });
    } catch (error) {
      if (error instanceof PlatformApiError) {
        cancelError = error;
        if (error.status !== 404 && error.status !== 409) {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }

  const hold = await holdTaskCredits(request);
  return {
    cancellation,
    hold,
    cancelError
  };
}
