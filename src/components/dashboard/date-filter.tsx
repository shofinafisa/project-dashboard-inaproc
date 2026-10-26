"use client";

import React, { useState } from "react";
import { DateRangeOption } from "@/types/dashboard";
import { useToast } from "@/components/ui/toast";
import { CalendarRange } from "lucide-react";

export function DateFilter() {
  const [selectedRange, setSelectedRange] = useState<DateRangeOption>("30d");
  const { toast } = useToast();

  const handleRangeChange = (value: DateRangeOption) => {
    setSelectedRange(value);
    const labels: Record<DateRangeOption, string> = {
      today: "Hari Ini",
      "7d": "7 Hari Terakhir",
      "30d": "30 Hari Terakhir",
      "90d": "Kuartal Berjalan (Q4)",
      ytd: "Tahun Berjalan (YTD 2026)",
      all: "Seluruh Riwayat",
    };
    toast({
      title: "Rentang Tanggal Diperbarui",
      description: `Dashboard difilter berdasarkan periode: ${labels[value]}`,
      type: "info",
    });
  };

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 shadow-xs">
        <CalendarRange className="w-3.5 h-3.5 text-blue-500 shrink-0" />
        <span className="text-slate-400 hidden sm:inline">Periode:</span>
        <select
          value={selectedRange}
          onChange={(e) => handleRangeChange(e.target.value as DateRangeOption)}
          className="bg-transparent font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
        >
          <option value="today" className="dark:bg-slate-900">Hari Ini</option>
          <option value="7d" className="dark:bg-slate-900">7 Hari Terakhir</option>
          <option value="30d" className="dark:bg-slate-900">30 Hari Terakhir</option>
          <option value="90d" className="dark:bg-slate-900">Kuartal Berjalan (Q4)</option>
          <option value="ytd" className="dark:bg-slate-900">Tahun Berjalan (YTD)</option>
          <option value="all" className="dark:bg-slate-900">Seluruh Periode</option>
        </select>
      </div>
    </div>
  );
}
