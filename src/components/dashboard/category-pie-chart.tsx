"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MOCK_CATEGORIES } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { PieChart as PieIcon } from "lucide-react";

export function CategoryPieChart() {
  const totalMarketValue = MOCK_CATEGORIES.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="h-full flex flex-col border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader className="p-6 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Distribusi Kategori Produk
            </CardTitle>
            <CardDescription className="mt-0.5">
              Pangsa pasar & diversifikasi portofolio
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-2 flex-1 flex flex-col justify-between">
        <div className="w-full h-[180px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={MOCK_CATEGORIES}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={4}
                dataKey="value"
              >
                {MOCK_CATEGORIES.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as (typeof MOCK_CATEGORIES)[0];
                    return (
                      <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-2.5 shadow-xl text-xs space-y-1 text-slate-100">
                        <div className="flex items-center gap-2 font-semibold">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: data.color }}
                          />
                          <span>{data.name}</span>
                        </div>
                        <p className="text-slate-300">
                          Nilai: <strong className="text-white">{formatCurrency(data.value)}</strong>
                        </p>
                        <p className="text-slate-400">
                          Pangsa: {data.percentage}% ({data.orders.toLocaleString()} orders)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Total
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
              ${(totalMarketValue / 1000000).toFixed(2)}M
            </span>
          </div>
        </div>

        {/* Categories breakdown legend */}
        <div className="mt-3 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
          {MOCK_CATEGORIES.map((category) => (
            <div
              key={category.name}
              className="flex items-center justify-between text-xs py-0.5"
            >
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <span className="truncate text-slate-600 dark:text-slate-400 font-medium">
                  {category.name}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {category.percentage}%
                </span>
                <span className="text-slate-400 text-[11px]">
                  ({formatCurrency(category.value)})
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
