"use client";

import React, { useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MOCK_CATEGORIES_BASE } from "@/lib/mock-data";
import { useFeatures } from "@/context/feature-context";
import { formatCurrency, formatShortCurrency } from "@/lib/utils";
import { PieChart as PieIcon } from "lucide-react";

interface CategoryPieChartProps {
  bypassFilters?: boolean;
}

export function CategoryPieChart({ bypassFilters = false }: CategoryPieChartProps) {
  const { isFeatureEnabled, activeCount } = useFeatures();

  // Filter categories by active procurement methods and recalculate percentages
  const filteredCategories = useMemo(() => {
    const raw = bypassFilters
      ? MOCK_CATEGORIES_BASE
      : MOCK_CATEGORIES_BASE.filter((cat) => isFeatureEnabled(cat.key));

    const totalVal = raw.reduce((acc, curr) => acc + curr.value, 0);

    return raw.map((cat) => ({
      ...cat,
      percentage: totalVal > 0 ? Math.round((cat.value / totalVal) * 100) : 0,
    }));
  }, [isFeatureEnabled, bypassFilters]);

  const totalMarketValue = useMemo(
    () => filteredCategories.reduce((acc, curr) => acc + curr.value, 0),
    [filteredCategories]
  );

  return (
    <Card className="h-full flex flex-col border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader className="p-6 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Distribusi Metode Pengadaan Aktif
            </CardTitle>
            <CardDescription className="mt-0.5">
              Pangsa realisasi anggaran per metode pengadaan ({filteredCategories.length} metode)
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-2 flex-1 flex flex-col justify-between">
        {filteredCategories.length === 0 ? (
          <div className="h-[220px] flex flex-col items-center justify-center text-center p-6 border border-dashed rounded-xl border-slate-200 dark:border-slate-800 my-auto">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Semua Metode Dinonaktifkan
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Aktifkan metode pengadaan di Admin Console untuk melihat porsi distribusi anggaran.
            </p>
          </div>
        ) : (
          <>
            <div className="w-full h-[180px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {filteredCategories.map((entry, index) => (
                      <Cell key={`cell-${entry.key}-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as (typeof filteredCategories)[0];
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
                              Porsi: {data.percentage}% ({data.orders.toLocaleString()} paket)
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
                  {formatShortCurrency(totalMarketValue)}
                </span>
              </div>
            </div>

            {/* Categories breakdown legend */}
            <div className="mt-3 space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3 max-h-[160px] overflow-y-auto pr-1">
              {filteredCategories.map((category) => (
                <div
                  key={category.key}
                  className="flex items-center justify-between text-xs py-0.5"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
                      {category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {category.percentage}%
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      ({formatShortCurrency(category.value)})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
