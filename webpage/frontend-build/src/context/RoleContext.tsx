"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction
} from "react";

export type ExperienceRole = "viewer" | "creator";

type RoleContextValue = {
  role: ExperienceRole;
  setRole: Dispatch<SetStateAction<ExperienceRole>>;
};

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<ExperienceRole>("viewer");
  const value = useMemo(() => ({ role, setRole }), [role]);

  return (
    <RoleContext.Provider value={value}>
      <div data-role={role}>{children}</div>
    </RoleContext.Provider>
  );
}

export function useExperienceRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    throw new Error("useExperienceRole must be used inside RoleProvider");
  }
  return ctx;
}
