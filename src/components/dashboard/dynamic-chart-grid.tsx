"use client";

import React from "react";
import { SalesTrendChart } from "./sales-trend-chart";
import { CategoryPieChart } from "./category-pie-chart";
import { Transaction } from "@/types/dashboard";

interface DynamicChartGridProps {
  bypassGuards?: boolean;
  customTransactions?: Transaction[];
  customStats?: {
    totalAmount: number;
    totalPackages: number;
    avgAmount: number;
    efficiencyRatio: string;
  };
  yearRange?: [number, number];
  isSingleMethod?: boolean;
  targetMethodLabel?: string;
}

export function DynamicChartGrid({
  bypassGuards = false,
  customTransactions,
  customStats,
  yearRange,
  isSingleMethod = false,
  targetMethodLabel,
}: DynamicChartGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch">
      <div className="lg:col-span-7 xl:col-span-8 transition-all duration-300">
        <SalesTrendChart
          bypassFilters={bypassGuards}
          customTransactions={customTransactions}
          customStats={customStats}
          yearRange={yearRange}
          targetMethodLabel={targetMethodLabel}
        />
      </div>

      <div className="lg:col-span-5 xl:col-span-4 transition-all duration-300">
        <CategoryPieChart
          bypassFilters={bypassGuards}
          customTransactions={customTransactions}
          isSingleMethod={isSingleMethod}
          targetMethodLabel={targetMethodLabel}
        />
      </div>
    </div>
  );
}
