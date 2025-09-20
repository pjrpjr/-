"use client";

import { useMemo } from "react";
import { useExperienceRole } from "../context/RoleContext";
import type { LandingPageContent } from "../lib/types";
import { CaseStudies } from "./CaseStudies";
import { ComplianceNotice } from "./ComplianceNotice";
import { HeroSection } from "./HeroSection";
import { MonetizationPath } from "./MonetizationPath";
import { PersonaPanel } from "./PersonaPanel";
import { QuickStartSection } from "./QuickStartSection";
import { TaskCenterPanel } from "./TaskCenterPanel";
import { TemplateGrid } from "./TemplateGrid";
import { TopNavigation } from "./TopNavigation";

type LandingPageProps = {
  content: LandingPageContent;
};

export function LandingPage({ content }: LandingPageProps) {
  const { role, setRole } = useExperienceRole();

  const persona = useMemo(
    () => content.personas.find((item) => item.role === role) ?? content.personas[0],
    [content.personas, role]
  );

  return (
    <div className="landing-shell">
      <TopNavigation role={role} onRoleChange={setRole} />
      <main>
        <HeroSection content={content.hero} role={role} />
        {persona && <PersonaPanel persona={persona} />}
        <MonetizationPath content={content.monetization} />
        <CaseStudies items={content.caseStudies} />
        <TemplateGrid templates={content.templates} />
        <TaskCenterPanel />
        <ComplianceNotice content={content.compliance} />
        <QuickStartSection content={content.quickStart} />
      </main>
    </div>
  );
}
