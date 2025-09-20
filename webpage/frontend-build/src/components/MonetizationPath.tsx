'use client';

import React from "react";
void React;

import { useAnalytics } from "../context/AnalyticsContext";
import type { MonetizationPathContent } from "../lib/types";

type MonetizationPathProps = {
  content: MonetizationPathContent;
};

export function MonetizationPath({ content }: MonetizationPathProps) {
  const { trackEvent } = useAnalytics();

  function handleStageClick(stageId: string, nextAction: string) {
    trackEvent({
      name: "cta_click",
      id: `monetization_${stageId}_click`,
      data: {
        cta_id: `monetization-${stageId}`,
        label: nextAction,
        section: "monetization_path"
      }
    });
  }

  return (
    <section id="monetization" aria-labelledby="monetization-heading">
      <header>
        <div>
          <h2 id="monetization-heading">{content.title}</h2>
          <p>{content.description}</p>
        </div>
      </header>
      <ol className="monetization-stages">
        {content.stages.map((stage, index) => (
          <li key={stage.id}>
            <span className="monetization-stages__index" aria-hidden="true">
              {index + 1}
            </span>
            <div>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
              <div className="monetization-stages__meta">
                <span>{stage.highlight}</span>
                <a
                  href="#"
                  data-analytics-id={`monetization-${stage.id}`}
                  onClick={() => handleStageClick(stage.id, stage.nextAction)}
                >
                  {stage.nextAction}
                </a>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}