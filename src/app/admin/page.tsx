"use client";

import React from "react";
import { AuthGuard } from "@/components/guards/auth-guard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { FeatureManagementPanel } from "@/components/admin/feature-management-panel";
import { KPIMetrics } from "@/components/dashboard/kpi-metrics";
import { DynamicChartGrid } from "@/components/dashboard/dynamic-chart-grid";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { ExportControls } from "@/components/dashboard/export-controls";
import { DateFilter } from "@/components/dashboard/date-filter";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Activity } from "lucide-react";

export default function AdminPage() {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <DashboardShell>
        {/* Admin Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="gap-1.5 py-1 px-3 bg-blue-600 text-white border-0 font-semibold text-xs tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                ADMINISTRATOR CONSOLE
              </Badge>
              <span className="text-xs text-slate-400">| Mode Otorisasi Penuh</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-2">
              Enterprise Dashboard & Feature Control Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Sebagai Administrator, Anda memiliki akses penuh ke seluruh analitik dan kendali langsung atas modul yang aktif pada akun User.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <DateFilter />
            <ExportControls />
          </div>
        </div>

        {/* Feature Toggle Management Control Panel */}
        <section aria-label="Feature Management Controls">
          <FeatureManagementPanel />
        </section>

        {/* Live Admin Analytics Preview (Admin bypasses feature guard to always see full data) */}
        <div className="pt-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Pratinjau Data Lengkap Perusahaan
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              *Tampilan Admin menampilkan seluruh visualisasi secara komprehensif.
            </span>
          </div>

          {/* KPI Cards */}
          <KPIMetrics />

          {/* Dynamic Charts (Line/Bar and Donut) */}
          <DynamicChartGrid bypassGuards={true} />

          {/* Full Transactions Table */}
          <TransactionsTable />
        </div>
      </DashboardShell>
    </AuthGuard>
  );
}
