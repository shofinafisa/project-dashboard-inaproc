"use client";

import React from "react";
import { AuthGuard } from "@/components/guards/auth-guard";
import { FeatureGuard } from "@/components/guards/feature-guard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { KPIMetrics } from "@/components/dashboard/kpi-metrics";
import { DynamicChartGrid } from "@/components/dashboard/dynamic-chart-grid";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { ExportControls } from "@/components/dashboard/export-controls";
import { DateFilter } from "@/components/dashboard/date-filter";
import { useFeatures } from "@/context/feature-context";
import { useAuth } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  UserCheck,
  SlidersHorizontal,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

export default function UserDashboardPage() {
  const { activeCount, totalCount } = useFeatures();
  const { user } = useAuth();

  return (
    <AuthGuard allowedRoles={["user", "admin"]}>
      <DashboardShell>
        {/* Dynamic User Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="gap-1.5 py-1 px-3 bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-300 border border-emerald-500/30 font-semibold text-xs tracking-wider"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                STANDARD USER DASHBOARD
              </Badge>
              <span className="text-xs text-slate-400">
                | Feature Flags Engine Active
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-2">
              Operational Insights & Performance
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Selamat datang, {user?.name || "User"}. Modul yang tampil di bawah ini diatur secara dinamis oleh Feature Toggle Engine.
            </p>
          </div>

          {/* Action Tools guarded by feature flags */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Feature Guard for Date Range Filter */}
            <FeatureGuard featureKey="date_range_filter">
              <DateFilter />
            </FeatureGuard>

            {/* Feature Guard for Export CSV / PDF Buttons */}
            <FeatureGuard featureKey="export_buttons">
              <ExportControls />
            </FeatureGuard>
          </div>
        </div>

        {/* Feature Toggle Information Banner */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Status Visibilitas Fitur: {activeCount} dari {totalCount} Modul Sedang Aktif
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Layout CSS Grid di bawah beradaptasi secara otomatis mengisi ruang kosong tanpa celah jika ada modul yang dinonaktifkan.
              </p>
            </div>
          </div>

          <Link href="/admin">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 whitespace-nowrap bg-white dark:bg-slate-900 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 shadow-xs"
            >
              Ubah Toggle di Admin &rarr;
            </Button>
          </Link>
        </div>

        {/* Empty state if admin turned off all features */}
        {activeCount === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center space-y-4 bg-white/50 dark:bg-slate-900/30">
            <div className="inline-flex p-4 rounded-full bg-amber-500/10 text-amber-500">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Semua Modul Sedang Dinonaktifkan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Administrator telah menonaktifkan seluruh fitur (`kpi_cards`, `sales_chart`, `category_distribution`, `recent_transactions`, `export_buttons`, `date_range_filter`).
              </p>
            </div>
            <Link href="/admin">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-xs">
                Kembali ke Halaman Admin untuk Mengaktifkan Fitur
              </Button>
            </Link>
          </div>
        )}

        {/* Dynamic Responsive Content Sections with FeatureGuards */}
        <div className="space-y-6">
          {/* Module 1: kpi_cards */}
          <FeatureGuard featureKey="kpi_cards">
            <section aria-label="KPI Metrics Summary">
              <KPIMetrics />
            </section>
          </FeatureGuard>

          {/* Module 2 & 3: sales_chart & category_distribution in Responsive Dynamic Grid */}
          <DynamicChartGrid />

          {/* Module 4: recent_transactions */}
          <FeatureGuard featureKey="recent_transactions">
            <section aria-label="Recent Transactions Table">
              <TransactionsTable />
            </section>
          </FeatureGuard>
        </div>
      </DashboardShell>
    </AuthGuard>
  );
}
