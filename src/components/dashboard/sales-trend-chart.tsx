"use client";

import React, { useState } from "react";
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
import { MOCK_SALES_TREND } from "@/lib/mock-data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { TrendingUp, BarChart3, Layers } from "lucide-react";

export function SalesTrendChart() {
  const [metric, setMetric] = useState<"revenue" | "orders">("revenue");

  const totalRevenue = MOCK_SALES_TREND.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalOrders = MOCK_SALES_TREND.reduce((acc, curr) => acc + curr.orders, 0);

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
                Tren Penjualan & Revenue Tahunan
              </CardTitle>
            </div>
            <CardDescription className="mt-1">
              {metric === "revenue"
                ? `Akumulasi Pendapatan 12 Bulan: ${formatCurrency(totalRevenue)}`
                : `Total Volume Pesanan: ${formatNumber(totalOrders)} transaksi`}
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
              Revenue ($)
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
              Volume Pesanan
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-4 flex-1 min-h-[310px]">
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={MOCK_SALES_TREND}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
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
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) =>
                  metric === "revenue" ? `$${val / 1000}k` : `${val}`
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
                          <span className="text-slate-400">Revenue:</span>
                          <span className="font-bold text-blue-400">
                            {formatCurrency(data.revenue)}
                          </span>
                        </p>
                        <p className="flex justify-between gap-4">
                          <span className="text-slate-400">Total Orders:</span>
                          <span className="font-bold text-emerald-400">
                            {formatNumber(data.orders)}
                          </span>
                        </p>
                        <p className="flex justify-between gap-4 text-[11px]">
                          <span className="text-slate-400">Pertumbuhan:</span>
                          <span
                            className={
                              data.growth >= 0 ? "text-emerald-400" : "text-rose-400"
                            }
                          >
                            {data.growth >= 0 ? "+" : ""}
                            {data.growth}%
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
      </CardContent>
    </Card>
  );
}
