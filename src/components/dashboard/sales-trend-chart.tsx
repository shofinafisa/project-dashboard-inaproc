"use client";

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MOCK_SALES_TREND_BASE } from "@/lib/mock-data";
import { useFeatures } from "@/context/feature-context";
import { formatCurrency, formatShortCurrency, formatNumber } from "@/lib/utils";
import { TrendingUp, BarChart3, Layers } from "lucide-react";

interface SalesTrendChartProps {
  bypassFilters?: boolean;
}

export function SalesTrendChart({ bypassFilters = false }: SalesTrendChartProps) {
  const [metric, setMetric] = useState<"revenue" | "orders">("revenue");
  const { activeCount, totalCount, yearRange } = useFeatures();

  // Scale monthly data dynamically based on the ratio of active methods
  const chartData = useMemo(() => {
    const ratio = bypassFilters || totalCount === 0 ? 1 : activeCount / totalCount;
    return MOCK_SALES_TREND_BASE.map((item) => ({
      ...item,
      revenue: Math.round(item.revenue * ratio),
      orders: Math.round(item.orders * ratio),
    }));
  }, [activeCount, totalCount, bypassFilters]);

  const totalRevenue = useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.revenue, 0),
    [chartData]
  );
  const totalOrders = useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.orders, 0),
    [chartData]
  );

  return (
    <Card className="h-full flex flex-col border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader className="p-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Tren Realisasi Nilai Pengadaan Bulanan
              </CardTitle>
            </div>
            <CardDescription className="mt-1">
              {metric === "revenue"
                ? `Akumulasi Realisasi (${activeCount}/${totalCount} Metode | Tahun ${yearRange[0]} — ${yearRange[1]}): ${formatShortCurrency(totalRevenue)}`
                : `Total Volume (${yearRange[0]} — ${yearRange[1]}): ${formatNumber(totalOrders)} paket transaksi`}
            </CardDescription>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setMetric("revenue")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                metric === "revenue"
                  ? "bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Nilai Realisasi (Rp)
            </button>
            <button
              onClick={() => setMetric("orders")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                metric === "orders"
                  ? "bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Jumlah Paket
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-4 flex-1 min-h-[310px]">
        {activeCount === 0 && !bypassFilters ? (
          <div className="h-[280px] flex flex-col items-center justify-center text-center p-6 border border-dashed rounded-xl border-slate-200 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Tidak Ada Data untuk Ditampilkan
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Aktifkan minimal 1 metode pengadaan untuk melihat tren realisasi bulanan.
            </p>
          </div>
        ) : (
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#334155"
                  opacity={0.15}
                />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) =>
                    metric === "revenue"
                      ? `${(val / 1000000000).toFixed(0)} M`
                      : `${val}`
                  }
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-3 shadow-xl backdrop-blur-sm text-xs space-y-1.5 text-slate-100">
                          <p className="font-semibold text-slate-300 border-b border-slate-800 pb-1">
                            Bulan: {label}
                          </p>
                          <p className="flex justify-between gap-4">
                            <span className="text-slate-400">Nilai Realisasi:</span>
                            <span className="font-bold text-blue-400">
                              {formatCurrency(data.revenue)}
                            </span>
                          </p>
                          <p className="flex justify-between gap-4">
                            <span className="text-slate-400">Total Paket:</span>
                            <span className="font-bold text-emerald-400">
                              {formatNumber(data.orders)} paket
                            </span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={metric}
                  stroke={metric === "revenue" ? "#3b82f6" : "#10b981"}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={metric === "revenue" ? "url(#colorRevenue)" : "url(#colorOrders)"}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
