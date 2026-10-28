"use client";

import React, { useState } from "react";
import { AuthGuard } from "@/components/guards/auth-guard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { KPIMetrics } from "@/components/dashboard/kpi-metrics";
import { DynamicChartGrid } from "@/components/dashboard/dynamic-chart-grid";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { ExportControls } from "@/components/dashboard/export-controls";
import { CascadingFilterBar } from "@/components/dashboard/cascading-filter-bar";
import { AIInfographicModal } from "@/components/dashboard/ai-infographic-modal";
import { useFeatures } from "@/context/feature-context";
import { useAuth } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FEATURE_CONFIGS } from "@/lib/mock-data";
import {
  UserCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";

export default function UserDashboardPage() {
  const {
    activeCount,
    totalCount,
    features,
    toggleFeature,
    enableAll,
    cascadingFilter,
    setCascadingFilter,
    resetCascadingFilter,
  } = useFeatures();

  const { user } = useAuth();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  return (
    <AuthGuard allowedRoles={["user", "admin"]}>
      <DashboardShell>
        <div className="space-y-5">
          {/* Header & Export / AI Action Group */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 transition-all">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="secondary"
                  className="gap-1.5 py-0.5 px-2.5 bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-300 border border-emerald-500/30 font-semibold text-[11px]"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  PPK SATKER &bull; INAPROC
                </Badge>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Dashboard Monitoring Pengadaan Nasional
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Selamat datang, <strong className="text-slate-700 dark:text-slate-200">{user?.name || "PPK Satker"}</strong>. Pantau realisasi anggaran dan analisis paket pengadaan secara real-time.
              </p>
            </div>

            {/* Action Tools: 3 Format Ekspor & Tombol Generate Infografis AI */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <ExportControls onGenerateAI={() => setIsAIModalOpen(true)} />
            </div>
          </div>

          {/* Cascading Filter Bar: Rentang Tahun + Multiple Choice (Jenis, Instansi, Eselon, Satker) */}
          {activeCount > 0 && (
            <CascadingFilterBar
              filterState={cascadingFilter}
              onChange={setCascadingFilter}
              onReset={resetCascadingFilter}
            />
          )}

          {/* Modal Preview Infografis AI */}
          <AIInfographicModal
            isOpen={isAIModalOpen}
            onClose={() => setIsAIModalOpen(false)}
            filterState={cascadingFilter}
          />

          {/* Compact Method Toggle Chips Bar */}
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800 dark:text-slate-200 shrink-0">
                Metode Pengadaan ({activeCount}/{totalCount}):
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {FEATURE_CONFIGS.map((cfg) => {
                const isEnabled = Boolean(features[cfg.key]);
                return (
                  <button
                    key={cfg.key}
                    type="button"
                    onClick={() => toggleFeature(cfg.key)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                      isEnabled
                        ? "bg-blue-600 text-white shadow-xs hover:bg-blue-700"
                        : "bg-slate-200/80 text-slate-500 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-400 opacity-60"
                    }`}
                    title={`Klik untuk toggle ${cfg.label}`}
                  >
                    {isEnabled ? (
                      <CheckCircle2 className="w-3 h-3 text-blue-200" />
                    ) : (
                      <XCircle className="w-3 h-3 text-slate-400" />
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
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Semua Metode Pengadaan Sedang Dinonaktifkan
                </h3>
                <p className="text-xs text-slate-500">
                  Aktifkan minimal satu metode pengadaan untuk melihat analitik dan paket data.
                </p>
              </div>
              <div className="pt-2">
                <Button
                  size="sm"
                  onClick={enableAll}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Aktifkan Semua Metode
                </Button>
              </div>
            </div>
          ) : (
            /* Visualisasi & Data Table (Terkorelasi Real-Time dengan Filter) */
            <div className="space-y-5">
              {/* Kartu Metrik KPI */}
              <section aria-label="Metrik Utama">
                <KPIMetrics />
              </section>

              {/* Grafik Tren & Donut Chart */}
              <section aria-label="Visualisasi Grafik">
                <DynamicChartGrid />
              </section>

              {/* Tabel Dataset Paket Pengadaan */}
              <section aria-label="Tabel Dataset">
                <TransactionsTable />
              </section>
            </div>
          )}
        </div>
      </DashboardShell>
    </AuthGuard>
  );
}
