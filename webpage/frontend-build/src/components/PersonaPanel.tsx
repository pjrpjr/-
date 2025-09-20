"use client";

import type { RolePersonaContent } from "../lib/types";

const PERSONA_ICON_MAP: Record<RolePersonaContent["role"], string> = {
  viewer: "/icons/persona-viewer.svg",
  creator: "/icons/persona-creator.svg"
};

type PersonaPanelProps = {
  persona: RolePersonaContent;
};

export function PersonaPanel({ persona }: PersonaPanelProps) {
  const icon = persona.icon ?? PERSONA_ICON_MAP[persona.role] ?? "/icons/persona-visitor.svg";

  return (
    <section
      className="persona-panel"
      aria-label={`${persona.title} 快捷入口`}
    >
      <div className="persona-panel__badge">
        <img src={icon} alt={`${persona.title} 徽标`} loading="lazy" />
      </div>
      <div className="persona-panel__content">
        <h2>{persona.title}</h2>
        <p>{persona.description}</p>
        <div className="persona-panel__shortcuts">
          {persona.shortcuts.map((item) => (
            <a key={item.href} href={item.href} className="chip">
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
