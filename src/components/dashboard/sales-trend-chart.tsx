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
import { TrendingUp } from "lucide-react";

interface SalesTrendChartProps {
  bypassFilters?: boolean;
}

export function SalesTrendChart({ bypassFilters = false }: SalesTrendChartProps) {
  const [metric, setMetric] = useState<"revenue" | "orders">("revenue");
  const { yearRange, filteredStats, filteredTransactions } = useFeatures();

  // Scale monthly data dynamically based on filtered transactions
  const chartData = useMemo(() => {
    if (bypassFilters) return MOCK_SALES_TREND_BASE;

    if (filteredTransactions.length === 0) {
      return MOCK_SALES_TREND_BASE.map((m) => ({ ...m, revenue: 0, orders: 0 }));
    }

    const baseTotal = MOCK_SALES_TREND_BASE.reduce((acc, curr) => acc + curr.revenue, 0);
    const ratio = filteredStats.totalAmount / (baseTotal || 1);

    return MOCK_SALES_TREND_BASE.map((item) => ({
      ...item,
      revenue: Math.round(item.revenue * ratio),
      orders: Math.max(1, Math.round((item.orders * filteredStats.totalPackages) / 1428)),
    }));
  }, [filteredTransactions, filteredStats, bypassFilters]);

  const totalRevenue = useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.revenue, 0),
    [chartData]
  );
  const totalOrders = useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.orders, 0),
    [chartData]
  );

  return (
    <Card className="h-full flex flex-col border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
      <CardHeader className="p-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Tren Realisasi Nilai Pengadaan Bulanan
              </CardTitle>
            </div>
            <CardDescription className="mt-1 text-xs text-slate-500">
              {metric === "revenue"
                ? `Akumulasi Realisasi Tahun ${yearRange[0]}—${yearRange[1]}: ${formatShortCurrency(totalRevenue)}`
                : `Total Volume Tahun ${yearRange[0]}—${yearRange[1]}: ${formatNumber(totalOrders)} paket`}
            </CardDescription>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto text-xs">
            <button
              type="button"
              onClick={() => setMetric("revenue")}
              className={`px-3 py-1 font-medium rounded-lg transition-all cursor-pointer ${
                metric === "revenue"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Nilai Realisasi (Rp)
            </button>
            <button
              type="button"
              onClick={() => setMetric("orders")}
              className={`px-3 py-1 font-medium rounded-lg transition-all cursor-pointer ${
                metric === "orders"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Jumlah Paket
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-4 flex-1">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => (metric === "revenue" ? formatShortCurrency(v) : formatNumber(v))}
                tick={{ fontSize: 10 }}
              />
              <Tooltip
                formatter={(val: unknown) => [
                  metric === "revenue" ? formatCurrency(Number(val) || 0) : `${formatNumber(Number(val) || 0)} paket`,
                  metric === "revenue" ? "Realisasi" : "Paket",
                ]}
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  borderColor: "rgba(51, 65, 85, 0.6)",
                  borderRadius: "12px",
                  color: "#f8fafc",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey={metric}
                stroke="#2563eb"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorMetric)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
