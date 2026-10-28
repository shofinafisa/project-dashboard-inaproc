"use client";

import React from "react";
import { SalesTrendChart } from "./sales-trend-chart";
import { CategoryPieChart } from "./category-pie-chart";

interface DynamicChartGridProps {
  bypassGuards?: boolean;
}

export function DynamicChartGrid({ bypassGuards = false }: DynamicChartGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch">
      <div className="lg:col-span-7 xl:col-span-8 transition-all duration-300">
        <SalesTrendChart bypassFilters={bypassGuards} />
      </div>

      <div className="lg:col-span-5 xl:col-span-4 transition-all duration-300">
        <CategoryPieChart bypassFilters={bypassGuards} />
      </div>
    </div>
  );
}
