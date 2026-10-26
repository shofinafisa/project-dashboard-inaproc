"use client";

import React from "react";
import { useFeatures } from "@/context/feature-context";
import { FeatureGuard } from "@/components/guards/feature-guard";
import { SalesTrendChart } from "./sales-trend-chart";
import { CategoryPieChart } from "./category-pie-chart";
import { cn } from "@/lib/utils";

interface DynamicChartGridProps {
  bypassGuards?: boolean;
}

export function DynamicChartGrid({ bypassGuards = false }: DynamicChartGridProps) {
  const { isFeatureEnabled } = useFeatures();

  const salesEnabled = bypassGuards || isFeatureEnabled("sales_chart");
  const categoryEnabled = bypassGuards || isFeatureEnabled("category_distribution");

  // If neither chart is enabled, return nothing
  if (!salesEnabled && !categoryEnabled) {
    return null;
  }

  // Dynamic layout calculation:
  // If both enabled: sales gets 8 cols (2/3), category gets 4 cols (1/3)
  // If only one enabled: that single widget expands to fill 12 cols (100% full width)!
  const salesColSpan = categoryEnabled ? "lg:col-span-7 xl:col-span-8" : "col-span-12";
  const categoryColSpan = salesEnabled ? "lg:col-span-5 xl:col-span-4" : "col-span-12";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch">
      {salesEnabled && (
        <div className={cn("transition-all duration-300", salesColSpan)}>
          <FeatureGuard featureKey="sales_chart" bypass={bypassGuards}>
            <SalesTrendChart />
          </FeatureGuard>
        </div>
      )}

      {categoryEnabled && (
        <div className={cn("transition-all duration-300", categoryColSpan)}>
          <FeatureGuard featureKey="category_distribution" bypass={bypassGuards}>
            <CategoryPieChart />
          </FeatureGuard>
        </div>
      )}
    </div>
  );
}
