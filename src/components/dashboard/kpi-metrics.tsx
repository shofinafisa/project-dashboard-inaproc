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
  customStats?: {
    totalAmount: number;
    totalPackages: number;
    avgAmount: number;
    efficiencyRatio: string;
  };
  subtitleMethod?: string;
  yearRange?: [number, number];
}

export function KPIMetrics({
  bypassFilters = false,
  customStats,
  subtitleMethod,
  yearRange: propYearRange,
}: KPIMetricsProps) {
  const { filteredStats, activeMethods, totalCount, yearRange: ctxYearRange } = useFeatures();

  const yearRange = propYearRange ?? ctxYearRange;

  const stats = useMemo(() => {
    if (customStats) return customStats;
    if (bypassFilters) {
      return calculateDynamicStats([
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
      ]);
    }
    return filteredStats;
  }, [customStats, bypassFilters, filteredStats]);

  const cards = [
    {
      id: "kpi-revenue",
      title: "Total Realisasi Pengadaan",
      displayValue: formatShortCurrency(stats.totalAmount),
      rawAmount: formatCurrency(stats.totalAmount),
      change: stats.totalPackages > 0 ? 14.8 : 0,
      trend: stats.totalPackages > 0 ? ("up" as const) : ("neutral" as const),
      subtitle: `Tahun ${yearRange[0]}—${yearRange[1]}`,
      icon: <DollarSign className="w-5 h-5 text-blue-500" />,
    },
    {
      id: "kpi-orders",
      title: "Total Paket Pengadaan",
      displayValue: `${formatNumber(stats.totalPackages)} Paket`,
      rawAmount: `${stats.totalPackages} paket terverifikasi`,
      change: stats.totalPackages > 0 ? 8.4 : 0,
      trend: stats.totalPackages > 0 ? ("up" as const) : ("neutral" as const),
      subtitle: subtitleMethod
        ? `Khusus Metode ${subtitleMethod}`
        : `${activeMethods.length}/${totalCount} metode aktif`,
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
      change: stats.totalPackages > 0 ? -1.8 : 0,
      trend: stats.totalPackages > 0 ? ("down" as const) : ("neutral" as const),
      subtitle: "Rata-rata per paket",
      icon: <TrendingUp className="w-5 h-5 text-indigo-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card) => {
        return (
          <Card
            key={card.id}
            className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md transition-all rounded-2xl"
          >
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {card.title}
                </span>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
                  {card.icon}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {card.displayValue}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge
                    variant={
                      card.trend === "up"
                        ? "success"
                        : card.trend === "down"
                        ? "destructive"
                        : "secondary"
                    }
                    className="text-[10px] px-1.5 py-0.5 font-semibold gap-0.5"
                  >
                    {card.trend === "up" && <TrendingUp className="w-2.5 h-2.5" />}
                    {card.trend === "down" && <TrendingDown className="w-2.5 h-2.5" />}
                    {card.change > 0 ? `+${card.change}%` : `${card.change}%`}
                  </Badge>
                  <span className="text-[11px] text-slate-400 truncate">
                    {card.subtitle}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
