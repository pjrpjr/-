"use client";

import { useAnalytics } from "../context/AnalyticsContext";
import type { ExperienceRole } from "../context/RoleContext";
import type { HeroContent } from "../lib/types";

function getCtas(content: HeroContent, role: ExperienceRole) {
  if (role === "viewer") {
    return [
      {
        ...content.ctas[0],
        label: "即刻挑选模板",
        href: "#templates"
      },
      content.ctas[1] ?? {
        label: "了解收益路径",
        href: "#monetization"
      }
    ];
  }
  return content.ctas;
}

type HeroSectionProps = {
  content: HeroContent;
  role: ExperienceRole;
};

export function HeroSection({ content, role }: HeroSectionProps) {
  const { trackEvent } = useAnalytics();
  const [primaryCta, secondaryCta] = getCtas(content, role);
  const subline =
    role === "viewer"
      ? "精选热卖模型，了解收益分成与授权流程。"
      : content.subtitle;

  function handleCtaClick(variant: "primary" | "secondary", label: string, href?: string) {
    const ctaId = variant === "primary" ? "hero_primary" : "hero_secondary";
    trackEvent({
      name: "cta_click",
      id: variant === "primary" ? "hero_primary_click" : "hero_secondary_click",
      data: {
        cta_id: ctaId,
        label,
        href: href ?? "#",
        role
      }
    });
  }

  function handleWorkflowClick(templateId: string, href: string) {
    trackEvent({
      name: "cta_click",
      id: "hero_workflow_link_click",
      data: {
        cta_id: "hero_workflow_link",
        template_id: templateId,
        href,
        role
      }
    });
  }

  return (
    <section id="hero" aria-labelledby="hero-heading" className="hero">
      <div className="hero__background" aria-hidden="true" />
      <div className="hero__container">
        <div className="hero__inner">
          <div className="hero__copy">
            <span className="hero__eyebrow">{content.eyebrow}</span>
            <h1 id="hero-heading">{content.title}</h1>
            <p>{subline}</p>
            <ol className="hero__steps" aria-label="核心业务流程">
              {content.steps.map((step, index) => (
                <li key={step.id}>
                  <span className="hero__step-index" aria-hidden="true">
                    {index + 1}
                  </span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="hero__actions">
              <a
                className="button button--primary"
                href={primaryCta.href ?? "#"}
                data-analytics="hero-primary"
                data-analytics-id="hero-primary"
                onClick={() => handleCtaClick("primary", primaryCta.label, primaryCta.href)}
              >
                {primaryCta.label}
              </a>
              {secondaryCta && (
                <a
                  className="button button--ghost"
                  href={secondaryCta.href ?? "#"}
                  data-analytics="hero-secondary"
                  data-analytics-id="hero-secondary"
                  onClick={() => handleCtaClick("secondary", secondaryCta.label, secondaryCta.href)}
                >
                  {secondaryCta.label}
                </a>
              )}
            </div>
          </div>
          <div className="hero__side">
            <div className="hero__metrics" role="list" aria-label="平台关键指标">
              {content.metrics.map((metric) => (
                <div role="listitem" key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
            <div className="hero__carousel" aria-live="polite">
              <h3>创作者最新收益</h3>
              <ul>
                {content.carousel.map((item) => (
                  <li key={item.id}>
                    <div className="hero__carousel-header">
                      <img
                        src={item.avatarUrl}
                        alt={`${item.account} 头像`}
                        width={48}
                        height={48}
                        loading="lazy"
                      />
                      <div>
                        <strong>{item.account}</strong>
                        <span>{item.earning}</span>
                      </div>
                    </div>
                    <dl>
                      <div>
                        <dt>复刻量</dt>
                        <dd>{item.replicas}</dd>
                      </div>
                      <div>
                        <dt>授权数</dt>
                        <dd>{item.authorizations}</dd>
                      </div>
                    </dl>
                    <img
                      className="hero__carousel-preview"
                      src={item.templatePreview}
                      alt="模板预览"
                      width={280}
                      height={160}
                      loading="lazy"
                    />
                    <a
                      href={item.workflowLink}
                      data-analytics="hero-workflow-link"
                      data-analytics-id="hero-workflow-link"
                      onClick={() => handleWorkflowClick(item.id, item.workflowLink)}
                    >
                      查看流程详情
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
