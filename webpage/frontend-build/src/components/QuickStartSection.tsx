"use client";

import { useEffect, useRef } from "react";
import { useAnalytics } from "../context/AnalyticsContext";
import type { QuickStartContent } from "../lib/types";

const FALLBACK_ILLUSTRATIONS = [
  "/illustrations/quickstart-step1.svg",
  "/illustrations/quickstart-step2.svg",
  "/illustrations/quickstart-step3.svg"
];

function getStatusLabel(status: QuickStartContent["checklist"][number]["status"]) {
  switch (status) {
    case "done":
      return "已完成";
    case "pending":
      return "进行中";
    case "locked":
      return "待解锁";
  }
}

type QuickStartSectionProps = {
  content: QuickStartContent;
};

function toActionId(label: string, index: number) {
  const normalized = label
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return normalized || `step-${index + 1}`;
}

export function QuickStartSection({ content }: QuickStartSectionProps) {
  const { trackEvent } = useAnalytics();
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);
  const observedStepIds = useRef(new Set<string>());

  useEffect(() => {
    const steps = content.checklist;
    const seen = observedStepIds.current;

    seen.forEach((id) => {
      if (!steps.some((step) => step.id === id)) {
        seen.delete(id);
      }
    });

    const triggerView = (index: number) => {
      const step = steps[index];
      if (!step || seen.has(step.id)) {
        return;
      }
      seen.add(step.id);
      trackEvent({
        name: "quickstart_step_view",
        id: "quickstart_step_view",
        data: {
          step_id: step.id,
          step_index: index,
          status: step.status,
          label: step.label
        }
      });
    };

    if (typeof IntersectionObserver === "function") {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }
            const target = entry.target as HTMLLIElement;
            const indexAttr = target.getAttribute("data-step-index");
            if (!indexAttr) {
              return;
            }
            const index = Number(indexAttr);
            if (Number.isNaN(index)) {
              return;
            }
            triggerView(index);
          });
        },
        { threshold: 0.6 }
      );

      stepRefs.current.forEach((element) => {
        if (element) {
          observer.observe(element);
        }
      });

      return () => observer.disconnect();
    }

    steps.forEach((_, index) => triggerView(index));
    return () => {};
  }, [content.checklist, trackEvent]);

  return (
    <section id="quickstart" aria-labelledby="quickstart-heading">
      <header>
        <div>
          <h2 id="quickstart-heading">{content.title}</h2>
          <p>{content.subtitle}</p>
        </div>
        <div className="quickstart-actions">
          {content.actions.map((action, index) => {
            const actionId = toActionId(action.label, index);
            const analyticsId = `quickstart_action_${actionId}`;
            return (
              <a
                key={action.label}
                href={action.href ?? "#"}
                className={
                  action.tone === "secondary" ? "button button--ghost" : "button button--primary"
                }
                data-analytics={analyticsId}
                data-analytics-id={analyticsId}
                onClick={() =>
                  trackEvent({
                    name: "cta_click",
                    id: "quickstart_action_click",
                    data: {
                      cta_id: analyticsId,
                      label: action.label,
                      href: action.href ?? "#"
                    }
                  })
                }
              >
                {action.label}
              </a>
            );
          })}
        </div>
      </header>
      <ol className="quickstart-steps">
        {content.checklist.map((item, index) => {
          const illustration = item.illustration ?? FALLBACK_ILLUSTRATIONS[index % FALLBACK_ILLUSTRATIONS.length];
          return (
            <li
              key={item.id}
              data-step={item.id}
              data-step-index={index}
              ref={(element) => {
                stepRefs.current[index] = element;
              }}
            >
              <div className="quickstart-steps__media" aria-hidden="true">
                <img src={illustration} alt="" loading="lazy" />
              </div>
              <div className="quickstart-steps__body">
                <span className={`quickstart-steps__status quickstart-steps__status--${item.status}`}>
                  {getStatusLabel(item.status)}
                </span>
                <p>{item.label}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
