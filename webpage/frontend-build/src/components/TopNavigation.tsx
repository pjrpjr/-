'use client';

import React from "react";
void React;

import { useAnalytics } from "../context/AnalyticsContext";
import type { ExperienceRole } from "../context/RoleContext";

type NavLink = {
  label: string;
  href: string;
};

const links: NavLink[] = [
  { label: 'Templates', href: '#templates' },
  { label: 'Task Center', href: '#task-center' },
  { label: 'Creator Console', href: '#creator-onboarding' }
];

type TopNavigationProps = {
  role: ExperienceRole;
  onRoleChange: (next: ExperienceRole) => void;
};

export function TopNavigation({ role, onRoleChange }: TopNavigationProps) {
  const { trackEvent } = useAnalytics();

  function handleNavClick(link: NavLink) {
    trackEvent({
      name: 'cta_click',
      id: `nav_click_${link.href.replace(/[^a-z0-9]/gi, '')}`,
      data: {
        cta_id: `nav-${link.href}`,
        href: link.href,
        label: link.label,
        role
      }
    });
  }

  function handleRoleChange(nextRole: ExperienceRole) {
    if (role === nextRole) {
      return;
    }
    onRoleChange(nextRole);
    trackEvent({
      name: 'role_switch',
      id: 'role_switch',
      data: {
        previous_role: role,
        next_role: nextRole
      }
    });
  }

  function handleTopupClick() {
    trackEvent({
      name: 'cta_click',
      id: 'topup_banner_click',
      data: {
        cta_id: 'nav-topup',
        href: '#topup',
        role
      }
    });
  }

  return (
    <nav className="top-nav" aria-label="Primary navigation">
      <div className="top-nav__brand" aria-label="Model Studio platform">
        <span aria-hidden="true">AI</span>
        <span className="top-nav__logo">Model Forge</span>
      </div>
      <ul className="top-nav__links">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              data-analytics-id={`nav-${link.href}`}
              onClick={() => handleNavClick(link)}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="top-nav__actions">
        <span className="visually-hidden" id="role-toggle-label">
          Switch experience role
        </span>
        <div className="role-toggle" role="radiogroup" aria-labelledby="role-toggle-label">
          <button
            type="button"
            role="radio"
            className={role === 'viewer' ? 'role-toggle__item role-toggle__item--active' : 'role-toggle__item'}
            aria-checked={role === 'viewer'}
            onClick={() => handleRoleChange('viewer')}
            data-analytics-id="role-viewer"
          >
            Viewer
          </button>
          <button
            type="button"
            role="radio"
            className={role === 'creator' ? 'role-toggle__item role-toggle__item--active' : 'role-toggle__item'}
            aria-checked={role === 'creator'}
            onClick={() => handleRoleChange('creator')}
            data-analytics-id="role-creator"
          >
            Creator
          </button>
        </div>
        <a
          className="recharge-chip"
          href="#topup"
          data-analytics-id="nav-topup"
          onClick={handleTopupClick}
        >
          Recharge credits
        </a>
      </div>
    </nav>
  );
}
