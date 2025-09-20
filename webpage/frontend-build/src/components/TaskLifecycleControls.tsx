'use client';

import React from "react";
void React;

import { useEffect, useMemo, useState } from "react";
import { useTaskLifecycle } from "../hooks/useTaskLifecycle";
import type { TaskLifecycleContext } from "../lib/workflows/taskLifecycle";

const DEFAULT_CONTEXT: TaskLifecycleContext = {
  tenantId: "creator_001",
  templateId: "tmpl_mock_001",
  userId: "user_001",
  taskId: "task_mock_001",
  scene: "image.generate"
};

type StatusBadgeProps = {
  status: string;
};

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`task-lifecycle__badge task-lifecycle__badge--${status}`}>
      {status}
    </span>
  );
}

export function TaskLifecycleControls() {
  const lifecycle = useTaskLifecycle(DEFAULT_CONTEXT);
  const { state } = lifecycle;
  const [actualCost, setActualCost] = useState<number>(120);

  useEffect(() => {
    if (state.currentHold) {
      setActualCost(state.currentHold.frozenAmount);
    }
  }, [state.currentHold]);

  const canCommit = useMemo(() => Boolean(state.currentHold), [state.currentHold]);
  const canCancel = useMemo(() => Boolean(state.currentHold), [state.currentHold]);

  const loadingText = useMemo(() => {
    switch (state.status) {
      case "holding":
        return "Holding credits...";
      case "committing":
        return "Committing hold...";
      case "canceling":
        return "Canceling hold...";
      case "retrying":
        return "Retrying hold lifecycle...";
      default:
        return null;
    }
  }, [state.status]);

  return (
    <section className="task-lifecycle" aria-labelledby="task-lifecycle-heading">
      <header className="task-lifecycle__header">
        <h3 id="task-lifecycle-heading">Task credits lifecycle</h3>
        <p>
          Run the pre-deduct &amp; commit flow against the mock platform API to validate credits handling.
        </p>
      </header>

      <div className="task-lifecycle__actions">
        <button
          type="button"
          onClick={() => lifecycle.hold({ estimatedCost: actualCost })}
          disabled={state.status !== "idle"}
        >
          Hold credits
        </button>
        <button
          type="button"
          onClick={() => lifecycle.commit({ actualCost })}
          disabled={!canCommit || state.status !== "idle"}
        >
          Commit hold
        </button>
        <button
          type="button"
          onClick={() => lifecycle.cancel()}
          disabled={!canCancel || state.status !== "idle"}
        >
          Cancel hold
        </button>
        <button
          type="button"
          onClick={() => lifecycle.retry({ estimatedCost: actualCost })}
          disabled={state.status !== "idle"}
        >
          Retry hold
        </button>
      </div>

      <div className="task-lifecycle__input">
        <label htmlFor="task-lifecycle-cost">Actual cost</label>
        <input
          id="task-lifecycle-cost"
          type="number"
          min={0}
          value={actualCost}
          onChange={(event) => {
            const numeric = Number(event.target.value);
            setActualCost(Number.isFinite(numeric) ? Math.max(0, numeric) : 0);
          }}
        />
      </div>

      <dl className="task-lifecycle__summary">
        <div>
          <dt>Status</dt>
          <dd>
            <StatusBadge status={state.status} />
          </dd>
        </div>
        <div>
          <dt>Current hold</dt>
          <dd>
            {state.currentHold
              ? `ID ${state.currentHold.preDeductId} • ${state.currentHold.frozenAmount}`
              : "None"}
          </dd>
        </div>
        <div>
          <dt>Last commit</dt>
          <dd>{state.lastCommit ? `Refund Δ ${state.lastCommit.refundAmount}` : "None"}</dd>
        </div>
        <div>
          <dt>Last cancel</dt>
          <dd>{state.lastCancel ? state.lastCancel.status ?? "cancelled" : "None"}</dd>
        </div>
        <div>
          <dt>Retry outcome</dt>
          <dd>{state.lastRetry ? `Hold ${state.lastRetry.hold.preDeductId}` : "None"}</dd>
        </div>
      </dl>

      {loadingText && <p className="task-lifecycle__log">{loadingText}</p>}
      {state.error && <p className="task-lifecycle__log task-lifecycle__log--error">{state.error.message}</p>}
    </section>
  );
}
