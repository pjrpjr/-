"use client";

import { createContext, useContext } from "react";
import { useRealtimeFeed } from "../hooks/useRealtimeFeed";
import type { TaskEvent } from "../lib/types";

type RealtimeContextValue = {
  events: TaskEvent[];
  status: "idle" | "connecting" | "open" | "error";
  pushEvent: (event: TaskEvent) => void;
};

const RealtimeContext = createContext<RealtimeContextValue | undefined>(undefined);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const realtime = useRealtimeFeed();

  return (
    <RealtimeContext.Provider value={realtime}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtimeContext() {
  const ctx = useContext(RealtimeContext);
  if (!ctx) {
    throw new Error("useRealtimeContext must be used inside RealtimeProvider");
  }
  return ctx;
}
