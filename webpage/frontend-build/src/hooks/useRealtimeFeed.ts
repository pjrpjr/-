"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAnalytics } from "../context/AnalyticsContext";
import { api } from "../lib/api";
import type { TaskEvent } from "../lib/types";

type RealtimeStatus = "idle" | "connecting" | "open" | "error";

type UseRealtimeFeedReturn = {
  events: TaskEvent[];
  status: RealtimeStatus;
  pushEvent: (event?: TaskEvent) => void;
};

function sortEvents(next: TaskEvent[]) {
  return [...next].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export function useRealtimeFeed(): UseRealtimeFeedReturn {
  const { trackEvent } = useAnalytics();
  const [events, setEvents] = useState<TaskEvent[]>([]);
  const [status, setStatus] = useState<RealtimeStatus>("idle");
  const lastEtaByTask = useRef(new Map<string, string | null>());

  const emitEtaUpdate = useCallback(
    (event: TaskEvent) => {
      if (event.nextEta === undefined) {
        return;
      }
      const nextValue = event.nextEta ?? null;
      const key = event.id;
      const previous = lastEtaByTask.current.get(key);
      if (previous === nextValue) {
        return;
      }
      lastEtaByTask.current.set(key, nextValue);
      if (lastEtaByTask.current.size > 80) {
        const firstKey = lastEtaByTask.current.keys().next().value;
        lastEtaByTask.current.delete(firstKey);
      }
      trackEvent({
        name: "queue_eta_update",
        id: "queue_eta_update",
        data: {
          task_event_id: event.id,
          task_type: event.type,
          status: event.status,
          stage: event.stage ?? null,
          next_eta: nextValue,
          queue_position: event.queuePosition ?? null
        }
      });
    },
    [trackEvent]
  );

  useEffect(() => {
    let isMounted = true;
    setStatus("connecting");

    const unsubscribe = api.subscribeTaskEvents((event) => {
      setEvents((prev) => sortEvents([event, ...prev]).slice(0, 40));
      emitEtaUpdate(event);
    });

    api
      .loadInitialTaskEvents()
      .then((seed) => {
        if (!isMounted) {
          return;
        }
        setEvents(sortEvents(seed));
        seed.forEach(emitEtaUpdate);
        setStatus("open");
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }
        setStatus("error");
      });

    return () => {
      isMounted = false;
      unsubscribe();
      setStatus("idle");
      lastEtaByTask.current.clear();
    };
  }, [emitEtaUpdate]);

  const pushEvent = useCallback((event?: TaskEvent) => {
    api.pushTaskEvent(event);
  }, []);

  return useMemo(
    () => ({
      events,
      status,
      pushEvent
    }),
    [events, pushEvent, status]
  );
}
