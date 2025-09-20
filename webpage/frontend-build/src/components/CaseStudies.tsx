"use client";

import type { CaseStudy } from "../lib/types";

type CaseStudiesProps = {
  items: CaseStudy[];
};

export function CaseStudies({ items }: CaseStudiesProps) {
  return (
    <section id="case-studies" aria-labelledby="case-studies-heading">
      <header>
        <div>
          <h2 id="case-studies-heading">创作者成功案例</h2>
          <p>精选不同规模团队的收益拆解，帮助你快速对齐经营重点。</p>
        </div>
      </header>
      <div className="case-grid">
        {items.map((item) => (
          <article key={item.id} className="case-card">
            <img
              className="case-card__cover"
              src={item.coverUrl}
              alt={`${item.name} 模板作品封面`}
              width={560}
              height={320}
              loading="lazy"
            />
            <div className="case-card__header">
              <img
                src={item.avatarUrl}
                alt={`${item.name} 标识`}
                width={48}
                height={48}
                loading="lazy"
              />
              <div>
                <h3>{item.name}</h3>
                <span>{item.industry}</span>
              </div>
            </div>
            <p>{item.summary}</p>
            <dl className="case-card__metrics">
              {item.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                  {metric.trend && <span>{metric.trend}</span>}
                </div>
              ))}
            </dl>
            <blockquote>
              <p>“{item.testimonial.quote}”</p>
              <cite>{item.testimonial.author}</cite>
            </blockquote>
          </article>
        ))}
      </div>
    </section>
  );
}
