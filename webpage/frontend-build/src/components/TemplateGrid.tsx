'use client';

import React from "react";
void React;

import { useEffect, useMemo, useState } from "react";
import { useAnalytics } from "../context/AnalyticsContext";
import type { TemplateCard } from "../lib/types";

const filters = [
  { id: 'trending', label: 'Trending' },
  { id: 'new', label: 'New arrivals' },
  { id: 'earning', label: 'Top earnings' }
];

function getStatusLabel(status: TemplateCard['status']) {
  switch (status) {
    case 'available':
      return 'Ready to replicate';
    case 'cooldown':
      return 'Cooling down';
    case 'pending':
      return 'Under review';
    case 'locked':
      return 'Requires license';
    default:
      return '';
  }
}

type TemplateGridProps = {
  templates: TemplateCard[];
};

export function TemplateGrid({ templates }: TemplateGridProps) {
  const { trackEvent } = useAnalytics();
  const [activeFilter, setActiveFilter] = useState('trending');

  const sortedTemplates = useMemo(() => {
    if (activeFilter === 'earning') {
      return [...templates].sort((a, b) => b.price - a.price);
    }
    if (activeFilter === 'new') {
      return [...templates].reverse();
    }
    return templates;
  }, [activeFilter, templates]);

  useEffect(() => {
    trackEvent({
      name: 'heatmap_view',
      id: 'template_heatmap_view',
      data: {
        filter_id: activeFilter,
        template_count: sortedTemplates.length
      }
    });
  }, [activeFilter, sortedTemplates.length, trackEvent]);

  function handleFilterChange(filterId: string) {
    if (filterId === activeFilter) {
      return;
    }
    setActiveFilter(filterId);
    trackEvent({
      name: 'template_filter_select',
      id: 'template_filter_select',
      data: { filter_id: filterId }
    });
  }

  function handleReplicateClick(template: TemplateCard) {
    trackEvent({
      name: 'cta_click',
      id: 'demo_replicate_click',
      data: {
        cta_id: `template_${template.id}_cta`,
        template_id: template.id,
        status: template.status,
        price: template.price,
        category: template.category
      }
    });
  }

  function handleWorkflowClick(template: TemplateCard) {
    trackEvent({
      name: 'cta_click',
      id: 'template_workflow_click',
      data: {
        cta_id: `template_${template.id}_workflow`,
        template_id: template.id,
        category: template.category
      }
    });
  }

  return (
    <section id="templates" aria-labelledby="templates-heading">
      <header>
        <div>
          <h2 id="templates-heading">Template highlights & status</h2>
          <p>Explore templates by popularity, freshness, and compliance readiness to understand pricing expectations.</p>
        </div>
        <div className="filter-pills" role="radiogroup" aria-label="Filter templates">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              role="radio"
              aria-checked={activeFilter === filter.id}
              className={
                activeFilter === filter.id
                  ? 'filter-pills__item filter-pills__item--active'
                  : 'filter-pills__item'
              }
              onClick={() => handleFilterChange(filter.id)}
              data-analytics-id={`filter-${filter.id}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </header>
      <div className="template-grid">
        {sortedTemplates.map((tpl) => (
          <article key={tpl.id} className="template-card">
            <img
              src={tpl.coverUrl}
              alt="Template preview"
              width={320}
              height={200}
              loading="lazy"
            />
            <div className="template-card__body">
              <div className="template-card__head">
                <h3>{tpl.title}</h3>
                <span className={`template-card__status template-card__status--${tpl.status}`}>
                  {getStatusLabel(tpl.status)}
                </span>
              </div>
              <p className="template-card__meta">
                {tpl.category} · {tpl.creator}
              </p>
              <div className="template-card__score">
                <strong>{tpl.score.toFixed(1)}</strong>
                <span>Score</span>
                <span>{tpl.price} credits/run</span>
              </div>
              <ul className="template-card__tags">
                {tpl.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <details>
                <summary>Parameter details</summary>
                <ul>
                  <li>{tpl.parameters.requirement}</li>
                  <li>{tpl.parameters.assets}</li>
                  <li>{tpl.parameters.duration}</li>
                </ul>
              </details>
              <div className="template-card__actions">
                <button
                  type="button"
                  data-analytics-id={`template-${tpl.id}-cta`}
                  data-template-id={tpl.id}
                  onClick={() => handleReplicateClick(tpl)}
                >
                  {tpl.status === 'available'
                    ? 'Replicate now'
                    : tpl.status === 'cooldown'
                    ? 'Cooling'
                    : tpl.status === 'pending'
                    ? 'Pending review'
                    : 'Request license'}
                </button>
                <a
                  href="#"
                  data-analytics-id={`template-${tpl.id}-workflow`}
                  onClick={() => handleWorkflowClick(tpl)}
                >
                  View workflow
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
