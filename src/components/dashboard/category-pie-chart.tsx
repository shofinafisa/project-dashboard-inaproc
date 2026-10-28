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
  const { filteredTransactions } = useFeatures();

  // Aggregate method percentages dynamically from the active filtered transactions
  const filteredCategories = useMemo(() => {
    if (bypassFilters) return MOCK_CATEGORIES_BASE;

    if (filteredTransactions.length === 0) return [];

    const methodMap: Record<string, { value: number; orders: number }> = {};
    filteredTransactions.forEach((tx) => {
      if (!methodMap[tx.procurementMethod]) {
        methodMap[tx.procurementMethod] = { value: 0, orders: 0 };
      }
      methodMap[tx.procurementMethod].value += tx.amount;
      methodMap[tx.procurementMethod].orders += 1;
    });

    const totalVal = Object.values(methodMap).reduce((acc, curr) => acc + curr.value, 0);

    return MOCK_CATEGORIES_BASE.filter((cat) => methodMap[cat.key]).map((cat) => ({
      ...cat,
      value: methodMap[cat.key].value,
      orders: methodMap[cat.key].orders,
      percentage: totalVal > 0 ? Math.round((methodMap[cat.key].value / totalVal) * 100) : 0,
    }));
  }, [filteredTransactions, bypassFilters]);

  const totalMarketValue = useMemo(
    () => filteredCategories.reduce((acc, curr) => acc + curr.value, 0),
    [filteredCategories]
  );

  return (
    <Card className="h-full flex flex-col border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
      <CardHeader className="p-6 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Distribusi Metode Pengadaan Aktif
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs text-slate-500">
              {filteredCategories.length > 0
                ? `Total Realisasi: ${formatShortCurrency(totalMarketValue)} (${filteredCategories.length} metode)`
                : "Tidak ada data pada filter ini"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-2 flex-1 flex flex-col justify-between">
        <div className="h-[220px] w-full relative">
          {filteredCategories.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredCategories}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={88}
                  paddingAngle={3}
                >
                  {filteredCategories.map((entry) => (
                    <Cell key={`cell-${entry.key}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: unknown) => [
                    formatCurrency(Number(val) || 0),
                    "Nilai Realisasi",
                  ]}
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    borderColor: "rgba(51, 65, 85, 0.6)",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              Tidak ada data distribusi metode
            </div>
          )}
        </div>

        {/* Legend pills */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          {filteredCategories.slice(0, 4).map((cat) => (
            <div key={cat.key} className="flex items-center gap-1.5 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="truncate text-slate-600 dark:text-slate-300">
                {cat.name}
              </span>
              <span className="ml-auto font-semibold text-slate-800 dark:text-slate-100">
                {cat.percentage}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
