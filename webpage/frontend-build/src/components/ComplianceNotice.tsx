"use client";

import type { ComplianceNoticeContent } from "../lib/types";

type ComplianceNoticeProps = {
  content: ComplianceNoticeContent;
};

export function ComplianceNotice({ content }: ComplianceNoticeProps) {
  return (
    <section id="compliance" aria-labelledby="compliance-heading">
      <header>
        <div>
          <h2 id="compliance-heading">{content.title}</h2>
          <p>{content.description}</p>
        </div>
      </header>
      <div className="compliance-grid">
        <ul className="compliance-points">
          {content.highlights.map((item) => (
            <li key={item.label} className={`compliance-points__item compliance-points__item--${item.tone ?? "info"}`}>
              <strong>{item.label}</strong>
              <p>{item.detail}</p>
            </li>
          ))}
        </ul>
        <aside className="compliance-resources" aria-label="帮助文档">
          <h3>相关文档</h3>
          <ul>
            {content.helpLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
