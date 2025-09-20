import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TemplateGrid } from "../TemplateGrid";
import type { TemplateCard } from "../../lib/types";

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

describe("TemplateGrid", () => {
  const templates: TemplateCard[] = [
    {
      id: "tpl-a",
      title: "模板A",
      category: "行业",
      coverUrl: "https://example.com/a.png",
      creator: "@creatorA",
      score: 4.6,
      price: 3,
      status: "available",
      tags: ["高转化"],
      parameters: {
        requirement: "要求",
        assets: "素材",
        duration: "30分钟"
      }
    }
  ];

  beforeEach(() => {
    trackEvent.mockClear();
  });

  it("fires heatmap_view on initial render", async () => {
    render(<TemplateGrid templates={templates} />);

    await waitFor(() => {
      expect(trackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "heatmap_view",
          data: expect.objectContaining({ filter_id: "trending" })
        })
      );
    });
  });

  it("tracks filter select and replicate CTA", () => {
    const { container } = render(<TemplateGrid templates={templates} />);
    trackEvent.mockClear();

    const filterButton = container.querySelector('[data-analytics-id="filter-earning"]') as HTMLButtonElement;
    fireEvent.click(filterButton);

    expect(trackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "template_filter_select",
        data: expect.objectContaining({ filter_id: "earning" })
      })
    );

    const replicateButton = container.querySelector('[data-analytics-id="template-tpl-a-cta"]') as HTMLButtonElement;
    fireEvent.click(replicateButton);

    expect(trackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "demo_replicate_click",
        data: expect.objectContaining({ template_id: "tpl-a" })
      })
    );
  });
});