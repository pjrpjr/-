import { useCallback, useMemo, useRef, useState } from "react";
import type { CreditsCancelResult, RequestOptions } from "../lib/types";
import {
  cancelTaskHold,
  commitTaskCredits,
  holdTaskCredits,
  retryTaskHoldLifecycle,
  type CommitResult,
  type HoldSnapshot,
  type RetryResult,
  type TaskLifecycleContext
} from "../lib/workflows/taskLifecycle";

export type TaskLifecycleStatus = "idle" | "holding" | "committing" | "canceling" | "retrying";

type LifecycleState = {
  status: TaskLifecycleStatus;
  currentHold: HoldSnapshot | null;
  lastCommit: CommitResult | null;
  lastCancel: CreditsCancelResult | null;
  lastRetry: RetryResult | null;
  error: Error | null;
};

export type HoldOptions = {
  estimatedCost?: number;
  currency?: string;
  expireInSeconds?: number;
  requestOptions?: RequestOptions;
};

export type CommitOptions = {
  preDeductId?: string;
  actualCost?: number;
  requestOptions?: RequestOptions;
};

export type CancelOptions = {
  preDeductId?: string;
  reason?: string;
  tenantId?: string;
  userId?: string;
  requestOptions?: RequestOptions;
};

export type RetryOptions = {
  estimatedCost?: number;
  currency?: string;
  expireInSeconds?: number;
  cancelReason?: string;
  taskId?: string;
  scene?: string;
  requestOptions?: RequestOptions;
};

const FALLBACK_ESTIMATE = 120;

export function useTaskLifecycle(context: TaskLifecycleContext) {
  const contextRef = useRef(context);
  contextRef.current = context;

  const [state, setState] = useState<LifecycleState>({
    status: "idle",
    currentHold: null,
    lastCommit: null,
    lastCancel: null,
    lastRetry: null,
    error: null
  });

  const updateState = useCallback((partial: Partial<LifecycleState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const hold = useCallback(
    async (options: HoldOptions = {}) => {
      const base = contextRef.current;
      updateState({ status: "holding", error: null });
      try {
        const snapshot = await holdTaskCredits({
          tenantId: base.tenantId,
          templateId: base.templateId,
          userId: base.userId,
          taskId: base.taskId,
          scene: base.scene,
          estimatedCost: options.estimatedCost ?? state.currentHold?.frozenAmount ?? FALLBACK_ESTIMATE,
          currency: options.currency,
          expireInSeconds: options.expireInSeconds,
          requestOptions: options.requestOptions
        });
        updateState({ status: "idle", currentHold: snapshot, lastCommit: null, error: null });
        return snapshot;
      } catch (error) {
        updateState({ status: "idle", error: error as Error });
        throw error;
      }
    },
    [state.currentHold, updateState]
  );

  const commit = useCallback(
    async (options: CommitOptions = {}) => {
      const base = contextRef.current;
      const preDeductId = options.preDeductId ?? state.currentHold?.preDeductId;
      if (!preDeductId) {
        throw new Error("No preDeductId available for commit");
      }
      const actualCost = options.actualCost ?? state.currentHold?.frozenAmount ?? FALLBACK_ESTIMATE;
      updateState({ status: "committing", error: null });
      try {
        const result = await commitTaskCredits({
          tenantId: base.tenantId,
          templateId: base.templateId,
          userId: base.userId,
          taskId: base.taskId,
          scene: base.scene,
          preDeductId,
          actualCost,
          holdSnapshot: state.currentHold ?? undefined,
          requestOptions: options.requestOptions
        });
        updateState({ status: "idle", lastCommit: result, error: null });
        return result;
      } catch (error) {
        updateState({ status: "idle", error: error as Error });
        throw error;
      }
    },
    [state.currentHold, updateState]
  );

  const cancel = useCallback(
    async (options: CancelOptions = {}) => {
      const base = contextRef.current;
      const preDeductId = options.preDeductId ?? state.currentHold?.preDeductId;
      if (!preDeductId) {
        throw new Error("No preDeductId available for cancel");
      }
      updateState({ status: "canceling", error: null });
      try {
        const result = await cancelTaskHold({
          preDeductId,
          tenantId: options.tenantId ?? base.tenantId,
          userId: options.userId ?? base.userId,
          reason: options.reason,
          requestOptions: options.requestOptions
        });
        updateState({
          status: "idle",
          lastCancel: result,
          currentHold: state.currentHold && state.currentHold.preDeductId === preDeductId ? null : state.currentHold,
          error: null
        });
        return result;
      } catch (error) {
        updateState({ status: "idle", error: error as Error });
        throw error;
      }
    },
    [state.currentHold, updateState]
  );

  const retry = useCallback(
    async (options: RetryOptions = {}) => {
      const base = contextRef.current;
      updateState({ status: "retrying", error: null });
      try {
        const result = await retryTaskHoldLifecycle({
          tenantId: base.tenantId,
          templateId: base.templateId,
          userId: base.userId,
          taskId: options.taskId ?? base.taskId,
          scene: options.scene ?? base.scene,
          estimatedCost: options.estimatedCost ?? state.currentHold?.frozenAmount ?? FALLBACK_ESTIMATE,
          currency: options.currency,
          expireInSeconds: options.expireInSeconds,
          cancelReason: options.cancelReason,
          requestOptions: options.requestOptions,
          previousHold: state.currentHold
            ? {
                preDeductId: state.currentHold.preDeductId,
                tenantId: base.tenantId,
                userId: base.userId
              }
            : undefined
        });
        updateState({
          status: "idle",
          currentHold: result.hold,
          lastRetry: result,
          error: result.cancelError ?? null
        });
        return result;
      } catch (error) {
        updateState({ status: "idle", error: error as Error });
        throw error;
      }
    },
    [state.currentHold, updateState]
  );

  return useMemo(
    () => ({
      state,
      hold,
      commit,
      cancel,
      retry
    }),
    [state, hold, commit, cancel, retry]
  );
}
