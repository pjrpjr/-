import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TopNavigation } from "../TopNavigation";

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

describe("TopNavigation", () => {
  beforeEach(() => {
    trackEvent.mockClear();
  });

  it("emits analytics when nav link is clicked", () => {
    const onRoleChange = vi.fn();
    const { container } = render(<TopNavigation role="viewer" onRoleChange={onRoleChange} />);

    const navLink = container.querySelector('[data-analytics-id="nav-#templates"]') as HTMLAnchorElement;
    fireEvent.click(navLink);

    expect(trackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "cta_click",
        data: expect.objectContaining({ cta_id: "nav-#templates" })
      })
    );
  });

  it("tracks role switch with previous and next role", () => {
    const onRoleChange = vi.fn();
    const { container } = render(<TopNavigation role="viewer" onRoleChange={onRoleChange} />);

    const creatorButton = container.querySelector('[data-analytics-id="role-creator"]') as HTMLButtonElement;
    fireEvent.click(creatorButton);

    expect(onRoleChange).toHaveBeenCalledWith("creator");
    expect(trackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "role_switch",
        data: { previous_role: "viewer", next_role: "creator" }
      })
    );
  });

  it("tracks topup shortcut click", () => {
    const onRoleChange = vi.fn();
    const { container } = render(<TopNavigation role="creator" onRoleChange={onRoleChange} />);

    const topupLink = container.querySelector('[data-analytics-id="nav-topup"]') as HTMLAnchorElement;
    fireEvent.click(topupLink);

    expect(trackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "topup_banner_click",
        data: expect.objectContaining({ cta_id: "nav-topup" })
      })
    );
  });
});