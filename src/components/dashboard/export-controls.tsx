"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { exportTransactionsToCSV, exportSummaryReportPDF } from "@/lib/export-utils";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { FileSpreadsheet, FileText, Check } from "lucide-react";

export function ExportControls() {
  const { toast } = useToast();
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleCSV = () => {
    setIsExportingCSV(true);
    try {
      exportTransactionsToCSV(MOCK_TRANSACTIONS, `financial_report_${new Date().toISOString().slice(0, 10)}.csv`);
      toast({
        title: "Ekspor CSV Berhasil",
        description: `${MOCK_TRANSACTIONS.length} baris data transaksi telah diunduh.`,
        type: "success",
      });
    } catch {
      toast({
        title: "Gagal Mengunduh CSV",
        description: "Terjadi kesalahan saat memproses data CSV.",
        type: "error",
      });
    } finally {
      setTimeout(() => setIsExportingCSV(false), 1200);
    }
  };

  const handlePDF = () => {
    setIsExportingPDF(true);
    toast({
      title: "Mempersiapkan Dokumen PDF",
      description: "Membuka dialog pencetakan dan ekspor PDF resmi dashboard...",
      type: "info",
    });
    setTimeout(() => {
      exportSummaryReportPDF();
      setIsExportingPDF(false);
    }, 600);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCSV}
        disabled={isExportingCSV}
        className="h-9 px-3 gap-1.5 text-xs font-medium border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs"
      >
        {isExportingCSV ? (
          <Check className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        )}
        <span>Ekspor CSV</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handlePDF}
        disabled={isExportingPDF}
        className="h-9 px-3 gap-1.5 text-xs font-medium border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs"
      >
        <FileText className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
        <span>Cetak / PDF</span>
      </Button>
    </div>
  );
}
