'use client';

import React from "react";
void React;

import { useEffect, useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import { useAnalytics } from "../context/AnalyticsContext";
import { useRealtimeContext } from "../context/RealtimeContext";
import { api } from "../lib/api";
import type { TaskEvent } from "../lib/types";

function getStatusCopy(status: "idle" | "connecting" | "open" | "error") {
  switch (status) {
    case "connecting":
      return "Connecting";
    case "open":
      return "Live";
    case "error":
      return "Stream error";
    default:
      return "Idle";
  }
}

function getEventTone(event: TaskEvent): "success" | "warning" | "error" {
  switch (event.status) {
    case "success":
      return "success";
    case "failed":
      return "error";
    default:
      return "warning";
  }
}

const TASK_STATUS_ICON = {
  success: "/icons/task-status-success.svg",
  warning: "/icons/task-status-warning.svg",
  error: "/icons/task-status-error.svg"
} satisfies Record<ReturnType<typeof getEventTone>, string>;

const TONE_ACCENT = {
  success: "#16a34a",
  warning: "#f59e0b",
  error: "#dc2626"
} satisfies Record<ReturnType<typeof getEventTone>, string>;

export function TaskCenterPanel() {
  const { events, status } = useRealtimeContext();
  const { trackEvent } = useAnalytics();
  const statusRef = useRef<typeof status>();
  const streamStatus = getStatusCopy(status);

  useEffect(() => {
    if (statusRef.current === status) {
      return;
    }
    statusRef.current = status;
    trackEvent({
      name: "task_stream_status",
      id: "task_stream_status",
      data: { status }
    });
  }, [status, trackEvent]);

  const sortedEvents = useMemo(() => events, [events]);

  function handleSimulateClick() {
    trackEvent({
      name: "cta_click",
      id: "queue_simulate_click",
      data: { cta_id: "task-simulate" }
    });
    api.pushTaskEvent();
  }

  return (
    <section id="task-center" aria-labelledby="task-center-heading">
      <header>
        <div>
          <h2 id="task-center-heading">Task center live feed</h2>
          <p>
            WebSocket / SSE keeps render, license, and training jobs in sync; highlight recharge or acceleration
            tips when anomalies surface.
          </p>
        </div>
        <div className={`task-center__status task-center__status--${status}`}>
          <span className="dot" aria-hidden="true" />
          <span>{streamStatus}</span>
          <button
            type="button"
            onClick={handleSimulateClick}
            data-analytics-id="task-simulate"
          >
            Simulate event
          </button>
        </div>
      </header>
      {sortedEvents.length === 0 ? (
        <div className="empty-state">
          <h3>No live data</h3>
          <p>Once real render, training, or license tasks connect, their updates appear here.</p>
        </div>
      ) : (
        <ul className="task-center__list">
          {sortedEvents.map((event) => {
            const tone = getEventTone(event);
            const accent = TONE_ACCENT[tone];
            const icon = TASK_STATUS_ICON[tone];
            const style: CSSProperties = { ["--task-accent" as const]: accent };
            return (
              <li className={`task-center__item task-center__item--${tone}`} style={style}>
                <div className="task-center__overview">
                  <img className="task-center__icon" src={icon} alt="" aria-hidden="true" loading="lazy" />
                  <div className="task-center__details">
                    <div className="task-center__item-head">
                      <span className="task-center__type">{event.type}</span>
                      <time dateTime={event.timestamp}>
                        {new Date(event.timestamp).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </time>
                    </div>
                    <strong>{event.label}</strong>
                  </div>
                </div>
                <p>{event.context}</p>
                {typeof event.progress === "number" && (
                  <div className="progress" role="progressbar" aria-valuenow={event.progress} aria-valuemin={0} aria-valuemax={100}>
                    <span style={{ width: `${Math.min(event.progress, 100)}%` }} />
                  </div>
                )}
                {event.impact && <span className="task-center__impact">{event.impact}</span>}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
