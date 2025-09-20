import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TaskLifecycleControls } from "../TaskLifecycleControls";

const hold = vi.fn();
const commit = vi.fn();
const cancel = vi.fn();
const retry = vi.fn();
const trackEvent = vi.hoisted(() => vi.fn());

vi.mock("../../hooks/useTaskLifecycle", () => ({
  useTaskLifecycle: vi.fn()
}));

vi.mock("../../context/AnalyticsContext", () => ({
  useAnalytics: () => ({ trackEvent })
}));

const { useTaskLifecycle } = await import("../../hooks/useTaskLifecycle");
const mockedUseTaskLifecycle = vi.mocked(useTaskLifecycle);

describe("TaskLifecycleControls", () => {
  beforeEach(() => {
    const holdSnapshot = {
      preDeductId: "pd_hold",
      frozenAmount: 120,
      balanceAfter: 880,
      quotaSnapshot: { templateQuota: 10, userUsage: 2 },
      expireAt: new Date().toISOString(),
      requestedCost: 120,
      scene: "image.generate"
    };

    hold.mockReset();
    hold.mockResolvedValue(holdSnapshot);

    commit.mockReset();
    commit.mockResolvedValue({
      receipt: {
        preDeductId: holdSnapshot.preDeductId,
        frozenAmount: holdSnapshot.frozenAmount,
        balanceAfter: 860,
        quotaSnapshot: holdSnapshot.quotaSnapshot,
        expireAt: holdSnapshot.expireAt
      },
      refundAmount: 20
    });

    cancel.mockReset();
    cancel.mockResolvedValue({
      preDeductId: holdSnapshot.preDeductId,
      status: "cancelled",
      reason: "user_cancelled",
      balanceAfter: "900"
    });

    retry.mockReset();
    retry.mockResolvedValue({
      cancellation: null,
      hold: holdSnapshot,
      cancelError: null
    });

    trackEvent.mockClear();

    mockedUseTaskLifecycle.mockReset();
    mockedUseTaskLifecycle.mockImplementation(() => ({
      state: {
        status: "idle",
        currentHold: null,
        lastCommit: null,
        lastCancel: null,
        lastRetry: null,
        error: null
      },
      hold,
      commit,
      cancel,
      retry
    }));
  });

  it("triggers hold when clicking hold button", async () => {
    render(<TaskLifecycleControls />);

    fireEvent.click(screen.getByText("Hold credits"));

    await waitFor(() => expect(hold).toHaveBeenCalledTimes(1));

    const invokeEvent = trackEvent.mock.calls[0]?.[0];
    const successEvent = trackEvent.mock.calls[1]?.[0];

    expect(invokeEvent).toMatchObject({
      id: "task_lifecycle_hold_invoke",
      data: expect.objectContaining({ action: "hold", cost: 120 })
    });
    expect(successEvent).toMatchObject({
      id: "task_lifecycle_hold_success",
      data: expect.objectContaining({ pre_deduct_id: "pd_hold" })
    });
  });

  it("commits using current hold amount", async () => {
    const holdState = {
      status: "idle" as const,
      currentHold: {
        preDeductId: "pd_001",
        frozenAmount: 150,
        balanceAfter: 900,
        quotaSnapshot: { templateQuota: 10, userUsage: 2 },
        expireAt: new Date().toISOString(),
        requestedCost: 150,
        scene: "image.generate"
      },
      lastCommit: null,
      lastCancel: null,
      lastRetry: null,
      error: null
    };

    mockedUseTaskLifecycle.mockImplementation(() => ({
      state: holdState,
      hold,
      commit,
      cancel,
      retry
    }));

    render(<TaskLifecycleControls />);

    fireEvent.change(screen.getByLabelText("Actual cost"), { target: { value: "150" } });
    fireEvent.click(screen.getByText("Commit hold"));

    await waitFor(() => expect(commit).toHaveBeenCalledTimes(1));

    const invokeEvent = trackEvent.mock.calls[0]?.[0];
    const successEvent = trackEvent.mock.calls[1]?.[0];

    expect(invokeEvent).toMatchObject({
      id: "task_lifecycle_commit_invoke",
      data: expect.objectContaining({ action: "commit", pre_deduct_id: "pd_001" })
    });
    expect(successEvent).toMatchObject({
      id: "task_lifecycle_commit_success",
      data: expect.objectContaining({ refund_amount: 20 })
    });
  });
});
