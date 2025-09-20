import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MonetizationPath } from "../MonetizationPath";
import type { MonetizationPathContent } from "../../lib/types";

const trackEvent = vi.hoisted(() => vi.fn());

vi.mock("../../context/AnalyticsContext", () => ({
  useAnalytics: () => ({
    trackEvent,
    sessionId: "session",
    userId: "user",
    abBucket: "control",
    sourceChannel: "direct"
  })
}));

describe("MonetizationPath", () => {
  beforeEach(() => {
    trackEvent.mockClear();
  });

  const content: MonetizationPathContent = {
    title: "流程",
    description: "摘要",
    stages: [
      {
        id: "replica",
        title: "阶段",
        description: "介绍",
        highlight: "亮点",
        nextAction: "查看说明"
      }
    ]
  };

  it("tracks monetization CTA click", () => {
    const { container } = render(<MonetizationPath content={content} />);
    const cta = container.querySelector('[data-analytics-id="monetization-replica"]') as HTMLAnchorElement;
    fireEvent.click(cta);

    expect(trackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "monetization_replica_click",
        data: expect.objectContaining({ cta_id: "monetization-replica" })
      })
    );
  });
});