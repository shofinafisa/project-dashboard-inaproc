"use client";

import React from "react";
import { AuthGuard } from "@/components/guards/auth-guard";
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
import { FEATURE_CONFIGS } from "@/lib/mock-data";
import {
  UserCheck,
  SlidersHorizontal,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";

export default function UserDashboardPage() {
  const { activeCount, totalCount, features, toggleFeature, enableAll } = useFeatures();
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
                DASHBOARD PENGGUNA LKPP (PPK SATKER)
              </Badge>
              <span className="text-xs text-slate-400">
                | Filter Engine Terhubung Real-Time
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-2">
              Dashboard Monitoring Pengadaan Nasional (INAPROC)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Selamat datang, {user?.name || "User"}. Data pengadaan di bawah disaring secara dinamis mengikuti status Switch 12 Metode Pengadaan.
            </p>
          </div>

          {/* Action Tools */}
          <div className="flex flex-wrap items-center gap-2.5">
            <DateFilter />
            <ExportControls />
          </div>
        </div>

        {/* Feature Toggle Status Banner & Active Method Chips */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                  Status Metode Pengadaan: {activeCount} dari {totalCount} Metode Aktif
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">
                  Klik chip di bawah ini untuk menyaring paket pengadaan berdasarkan metode yang diinginkan secara langsung.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Method Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-blue-500/10">
            {FEATURE_CONFIGS.map((cfg) => {
              const isEnabled = Boolean(features[cfg.key]);
              return (
                <button
                  key={cfg.key}
                  type="button"
                  onClick={() => toggleFeature(cfg.key)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
                    isEnabled
                      ? "bg-blue-600 text-white shadow-xs hover:bg-blue-700"
                      : "bg-slate-200/80 text-slate-500 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 opacity-60"
                  }`}
                  title={`Klik untuk ${isEnabled ? "menonaktifkan" : "mengaktifkan"} ${cfg.label}`}
                >
                  {isEnabled ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-200" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty state if all methods are turned off */}
        {activeCount === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center space-y-4 bg-white/50 dark:bg-slate-900/30">
            <div className="inline-flex p-4 rounded-full bg-amber-500/10 text-amber-500">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Semua Metode Pengadaan Sedang Dinonaktifkan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Seluruh 12 metode pengadaan sedang dalam posisi OFF. Tidak ada data paket pengadaan yang dapat ditampilkan pada dashboard saat ini.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                size="sm"
                onClick={enableAll}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Aktifkan Semua Metode Sekarang
              </Button>
            </div>
          </div>
        ) : (
          /* Dynamic Responsive Content Sections */
          <div className="space-y-6">
            {/* KPI Metrics Summary */}
            <section aria-label="Ringkasan Metrik Pengadaan">
              <KPIMetrics />
            </section>

            {/* Dynamic Charts (Line/Area & Donut) */}
            <section aria-label="Visualisasi Tren & Distribusi">
              <DynamicChartGrid />
            </section>

            {/* Transactions Table */}
            <section aria-label="Daftar Paket Transaksi">
              <TransactionsTable />
            </section>
          </div>
        )}
      </DashboardShell>
    </AuthGuard>
  );
}
