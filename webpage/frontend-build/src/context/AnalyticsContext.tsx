'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
void React;
import { usePathname } from "next/navigation";

export type AnalyticsEventPayload = {
  name: string;
  id?: string;
  data?: Record<string, unknown>;
};

export type AnalyticsEvent = {
  name: string;
  id?: string;
  data: Record<string, unknown>;
  timestamp: string;
  sessionId: string;
  userId: string;
  abBucket: string;
  sourceChannel: string;
  route: string;
};

type AnalyticsContextValue = {
  sessionId: string;
  userId: string;
  abBucket: string;
  sourceChannel: string;
  trackEvent: (payload: AnalyticsEventPayload) => void;
};

const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(undefined);

function createRandomId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function ensureSessionId(): string {
  if (typeof window === "undefined") {
    return `session-${createRandomId()}`;
  }
  try {
    const storage = window.sessionStorage;
    const existing = storage.getItem("analytics:sessionId");
    if (existing) {
      return existing;
    }
    const created = `session-${createRandomId()}`;
    storage.setItem("analytics:sessionId", created);
    return created;
  } catch {
    return `session-${createRandomId()}`;
  }
}

function ensureUserId(sessionId: string): string {
  const fallback = sessionId.replace(/[^a-z0-9]/gi, "").slice(0, 12) || createRandomId().replace(/[^a-z0-9]/gi, "").slice(0, 12);
  if (typeof window === "undefined") {
    return `anon-${fallback}`;
  }
  try {
    const storage = window.localStorage;
    const existing = storage.getItem("analytics:userId");
    if (existing) {
      return existing;
    }
    const created = `anon-${createRandomId().replace(/[^a-z0-9]/gi, "").slice(0, 12)}`;
    storage.setItem("analytics:userId", created);
    return created;
  } catch {
    return `anon-${fallback}`;
  }
}

function deriveAbBucket(sessionId: string): string {
  const sanitized = sessionId.replace(/[^a-f0-9]/gi, "");
  const last = sanitized.charCodeAt(sanitized.length - 1) || 0;
  return last % 2 === 0 ? "control" : "variant";
}

function detectSourceChannel(): string {
  if (typeof window === "undefined") {
    return "direct";
  }
  try {
    const params = new URLSearchParams(window.location.search);
    const channel =
      params.get("channel") ??
      params.get("utm_source") ??
      params.get("ref") ??
      params.get("source");
    if (channel && channel.trim()) {
      return channel.trim();
    }
  } catch {
    // ignore search param parsing failures
  }
  try {
    if (document.referrer) {
      const refUrl = new URL(document.referrer);
      return refUrl.hostname;
    }
  } catch {
    // ignore referrer parsing issues
  }
  return "direct";
}

function emitEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") {
    return;
  }
  const globalWindow = window as AnalyticsWindow;
  if (!Array.isArray(globalWindow.__analyticsEvents)) {
    globalWindow.__analyticsEvents = [];
  }
  globalWindow.__analyticsEvents.push(event);
  window.dispatchEvent(new CustomEvent("analytics:event", { detail: event }));
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event);
  }
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sessionId] = useState(() => ensureSessionId());
  const [userId] = useState(() => ensureUserId(sessionId));
  const [abBucket] = useState(() => deriveAbBucket(sessionId));
  const [sourceChannel, setSourceChannel] = useState<string>("direct");
  const trackedRoutesRef = useRef(new Set<string>());
  const routeRef = useRef(pathname);

  useEffect(() => {
    routeRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    setSourceChannel(detectSourceChannel());
  }, []);

  const trackEvent = useCallback(
    (payload: AnalyticsEventPayload) => {
      if (!payload.name) {
        return;
      }
      const data = {
        session_id: sessionId,
        user_id: userId,
        source_channel: sourceChannel,
        ab_bucket: abBucket,
        ...payload.data
      };
      const event: AnalyticsEvent = {
        name: payload.name,
        id: payload.id,
        data,
        timestamp: new Date().toISOString(),
        sessionId,
        userId,
        abBucket,
        sourceChannel,
        route: routeRef.current
      };
      emitEvent(event);
    },
    [abBucket, sessionId, sourceChannel, userId]
  );

  useEffect(() => {
    const route = routeRef.current;
    if (route === "/" && !trackedRoutesRef.current.has(route)) {
      trackedRoutesRef.current.add(route);
      trackEvent({
        name: "landing_view",
        id: "landing_view",
        data: {
          route,
          source_channel: detectSourceChannel()
        }
      });
    }
  }, [trackEvent]);

  const value = useMemo(
    () => ({
      sessionId,
      userId,
      abBucket,
      sourceChannel,
      trackEvent
    }),
    [sessionId, userId, abBucket, sourceChannel, trackEvent]
  );

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics() {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) {
    throw new Error("useAnalytics must be used inside AnalyticsProvider");
  }
  return ctx;
}

type AnalyticsWindow = Window & {
  __analyticsEvents?: AnalyticsEvent[];
};

declare global {
  interface Window {
    __analyticsEvents?: AnalyticsEvent[];
  }
}


