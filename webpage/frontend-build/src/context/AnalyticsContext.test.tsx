import { render, waitFor, cleanup } from "@testing-library/react";
import React, { useEffect } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AnalyticsProvider, useAnalytics } from "./AnalyticsContext";

vi.mock("next/navigation", () => ({
  usePathname: () => "/"
}));

describe("AnalyticsProvider", () => {
  beforeEach(() => {
    cleanup();
    window.__analyticsEvents = [];
    sessionStorage.clear();
    localStorage.clear();
  });

  it("records custom events with defaults", async () => {
    const TestEmitter = () => {
      const { trackEvent } = useAnalytics();
      useEffect(() => {
        trackEvent({
          name: "cta_click",
          id: "unit_test_click",
          data: {
            cta_id: "unit-test",
            detail: "sample"
          }
        });
      }, [trackEvent]);
      return null;
    };

    render(
      <AnalyticsProvider>
        <TestEmitter />
      </AnalyticsProvider>
    );

    await waitFor(() => {
      expect(window.__analyticsEvents?.some((event) => event.id === "unit_test_click")).toBe(true);
    });

    const tracked = window.__analyticsEvents?.find((event) => event.id === "unit_test_click");
    expect(tracked).toBeDefined();
    expect(tracked?.data).toMatchObject({
      cta_id: "unit-test",
      detail: "sample",
      session_id: expect.any(String),
      source_channel: expect.any(String)
    });
  });
});


