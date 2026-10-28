"use client";

import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFeatures } from "@/context/feature-context";
import { calculateDynamicStats } from "@/lib/mock-data";
import { formatCurrency, formatShortCurrency, formatNumber } from "@/lib/utils";
import { DollarSign, ShoppingBag, Percent, TrendingUp, TrendingDown } from "lucide-react";

interface KPIMetricsProps {
  bypassFilters?: boolean;
}

export function KPIMetrics({ bypassFilters = false }: KPIMetricsProps) {
  const { activeMethods, totalCount, yearRange } = useFeatures();

  const stats = useMemo(() => {
    // If bypassing filters (admin full view preview), use all 12 methods
    const methodsToUse = bypassFilters
      ? ([
          "penunjukan_langsung",
          "pengadaan_langsung",
          "e_purchasing",
          "swakelola",
          "sayembara",
          "kontes",
          "tender",
          "tender_cepat",
          "tender_internasional",
          "pengadaan_darurat",
          "seleksi",
          "dikecualikan",
        ] as typeof activeMethods)
      : activeMethods;

    return calculateDynamicStats(methodsToUse, bypassFilters ? undefined : yearRange);
  }, [activeMethods, yearRange, bypassFilters]);

  const cards = [
    {
      id: "kpi-revenue",
      title: "Total Realisasi Pengadaan",
      displayValue: formatShortCurrency(stats.totalAmount),
      rawAmount: formatCurrency(stats.totalAmount),
      change: stats.totalPackages > 0 ? 14.8 : 0,
      trend: stats.totalPackages > 0 ? ("up" as const) : ("neutral" as const),
      subtitle: `${activeMethods.length} dari ${totalCount} metode aktif`,
      icon: <DollarSign className="w-5 h-5 text-blue-500" />,
    },
    {
      id: "kpi-orders",
      title: "Total Paket Pengadaan",
      displayValue: `${formatNumber(stats.totalPackages)} Paket`,
      rawAmount: `${stats.totalPackages} paket terverifikasi`,
      change: stats.totalPackages > 0 ? 8.4 : 0,
      trend: stats.totalPackages > 0 ? ("up" as const) : ("neutral" as const),
      subtitle: "Paket aktif SPSE / SiRUP",
      icon: <ShoppingBag className="w-5 h-5 text-emerald-500" />,
    },
    {
      id: "kpi-efficiency",
      title: "Efisiensi Nilai Pengadaan",
      displayValue: `${stats.efficiencyRatio}%`,
      rawAmount: "Penghematan HPS vs Kontrak",
      change: stats.totalPackages > 0 ? 2.1 : 0,
      trend: stats.totalPackages > 0 ? ("up" as const) : ("neutral" as const),
      subtitle: "Rasio optimalisasi APBN/APBD",
      icon: <Percent className="w-5 h-5 text-purple-500" />,
    },
    {
      id: "kpi-aov",
      title: "Rata-rata Nilai Paket",
      displayValue: formatShortCurrency(stats.avgAmount),
      rawAmount: formatCurrency(stats.avgAmount),
      change: stats.totalPackages > 0 ? 5.6 : 0,
      trend: stats.totalPackages > 0 ? ("up" as const) : ("neutral" as const),
      subtitle: "Nilai kontrak rata-rata",
      icon: <TrendingUp className="w-5 h-5 text-amber-500" />,
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((kpi) => {
          const isPositive = kpi.trend === "up";
          return (
            <Card
              key={kpi.id}
              className="relative overflow-hidden hover:shadow-md transition-all duration-200 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {kpi.title}
                  </span>
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                    {kpi.icon}
                  </div>
                </div>

                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 truncate" title={kpi.rawAmount}>
                    {kpi.displayValue}
                  </div>
                  {stats.totalPackages > 0 && (
                    <Badge
                      variant={isPositive ? "success" : "secondary"}
                      className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 shrink-0"
                    >
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>
                        {isPositive ? "+" : ""}
                        {kpi.change}%
                      </span>
                    </Badge>
                  )}
                </div>

                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 truncate">
                  {kpi.subtitle}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
