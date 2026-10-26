"use client";

import React, { ReactNode } from "react";
import { AppHeader } from "./app-header";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      <AppHeader />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {children}
      </main>
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 py-4 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Enterprise Data Dashboard &copy; 2026. Unified Login & Dynamic Feature Toggle Engine.
          </span>
          <span className="font-mono text-[11px] text-slate-500">
            Next.js App Router &bull; Tailwind CSS &bull; shadcn/ui &bull; Recharts
          </span>
        </div>
      </footer>
    </div>
  );
}
