"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_KPIS } from "@/lib/mock-data";
import { DollarSign, ShoppingBag, Percent, TrendingUp, TrendingDown } from "lucide-react";

export function KPIMetrics() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "dollar":
        return <DollarSign className="w-5 h-5 text-blue-500" />;
      case "shopping-bag":
        return <ShoppingBag className="w-5 h-5 text-emerald-500" />;
      case "percent":
        return <Percent className="w-5 h-5 text-purple-500" />;
      case "trending-up":
        return <TrendingUp className="w-5 h-5 text-amber-500" />;
      default:
        return <DollarSign className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_KPIS.map((kpi) => {
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
                    {getIcon(kpi.iconName)}
                  </div>
                </div>

                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    {kpi.value}
                  </div>
                  <Badge
                    variant={isPositive ? "success" : "destructive"}
                    className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5"
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
                </div>

                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
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
