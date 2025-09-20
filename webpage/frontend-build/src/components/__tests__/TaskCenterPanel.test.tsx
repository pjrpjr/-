import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

type MockStatus = "idle" | "connecting" | "open" | "error";

const trackEvent = vi.hoisted(() => vi.fn());
const pushTaskEvent = vi.hoisted(() => vi.fn());
const mockRealtime = {
  events: [],
  status: "open" as MockStatus,
  pushEvent: vi.fn()
};

vi.mock("../../context/AnalyticsContext", () => ({
  useAnalytics: () => ({
    trackEvent,
    sessionId: "session",
    userId: "user",
    abBucket: "control",
    sourceChannel: "direct"
  })
}));

vi.mock("../../context/RealtimeContext", () => ({
  useRealtimeContext: () => mockRealtime
}));

vi.mock("../../lib/api", () => ({
  api: {
    pushTaskEvent
  }
}));

vi.mock("../TaskLifecycleControls", () => ({
  __esModule: true,
  TaskLifecycleControls: () => <div data-testid="task-lifecycle-controls" />
}));

const { TaskCenterPanel } = await import("../TaskCenterPanel");

describe("TaskCenterPanel", () => {
  beforeEach(() => {
    trackEvent.mockClear();
    pushTaskEvent.mockClear();
  });

  it("reports stream status on mount", () => {
    render(<TaskCenterPanel />);

    expect(trackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "task_stream_status",
        data: { status: "open" }
      })
    );
  });

  it("tracks simulate button click", () => {
    const { container } = render(<TaskCenterPanel />);
    trackEvent.mockClear();

    const simulateButton = container.querySelector('[data-analytics-id="task-simulate"]') as HTMLButtonElement;
    fireEvent.click(simulateButton);

    expect(pushTaskEvent).toHaveBeenCalled();
    expect(trackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "queue_simulate_click",
        data: expect.objectContaining({ cta_id: "task-simulate" })
      })
    );
  });
});
