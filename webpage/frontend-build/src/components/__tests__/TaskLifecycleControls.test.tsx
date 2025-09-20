import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TaskLifecycleControls } from "../TaskLifecycleControls";

const hold = vi.fn();
const commit = vi.fn();
const cancel = vi.fn();
const retry = vi.fn();

vi.mock("../../hooks/useTaskLifecycle", () => ({
  useTaskLifecycle: vi.fn()
}));

const { useTaskLifecycle } = await import("../../hooks/useTaskLifecycle");
const mockedUseTaskLifecycle = vi.mocked(useTaskLifecycle);

describe("TaskLifecycleControls", () => {
  beforeEach(() => {
    hold.mockClear();
    commit.mockClear();
    cancel.mockClear();
    retry.mockClear();
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

  it("triggers hold when clicking hold button", () => {
    render(<TaskLifecycleControls />);

    fireEvent.click(screen.getByText("Hold credits"));

    expect(hold).toHaveBeenCalledWith({ estimatedCost: 120 });
  });

  it("commits using current hold amount", () => {
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

    expect(commit).toHaveBeenCalledWith({ actualCost: 150 });
  });
});
