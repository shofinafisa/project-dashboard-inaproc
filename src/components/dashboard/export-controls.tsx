"use client";

import React, { useState } from "react";
import {
  exportTransactionsToCSV,
  exportTransactionsToExcel,
  exportSummaryReportPDF,
} from "@/lib/export-utils";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";
import { useFeatures } from "@/context/feature-context";
import {
  FileSpreadsheet,
  FileText,
  FileType,
  Sparkles,
  Check,
} from "lucide-react";

interface ExportControlsProps {
  onGenerateAI?: () => void;
}

export function ExportControls({ onGenerateAI }: ExportControlsProps) {
  const { toast } = useToast();
  const { activeCount } = useFeatures();
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // Jika semua metode dimatikan Admin (activeCount === 0), tombol ekspor disembunyikan
  if (activeCount === 0) {
    return null;
  }

  const handleExcel = () => {
    setIsExportingExcel(true);
    try {
      exportTransactionsToExcel(
        MOCK_TRANSACTIONS,
        `laporan_pengadaan_inaproc_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      toast({
        title: "Ekspor Excel Berhasil (.xlsx)",
        description: `${MOCK_TRANSACTIONS.length} baris paket pengadaan berhasil diekspor.`,
        type: "success",
      });
    } catch {
      toast({
        title: "Gagal Mengunduh Excel",
        description: "Terjadi kesalahan saat memproses data Excel.",
        type: "error",
      });
    } finally {
      setTimeout(() => setIsExportingExcel(false), 1000);
    }
  };

  const handleCSV = () => {
    setIsExportingCSV(true);
    try {
      exportTransactionsToCSV(
        MOCK_TRANSACTIONS,
        `laporan_pengadaan_inaproc_${new Date().toISOString().slice(0, 10)}.csv`
      );
      toast({
        title: "Ekspor CSV Berhasil (.csv)",
        description: `${MOCK_TRANSACTIONS.length} baris data CSV berhasil diunduh.`,
        type: "success",
      });
    } catch {
      toast({
        title: "Gagal Mengunduh CSV",
        description: "Terjadi kesalahan saat memproses data CSV.",
        type: "error",
      });
    } finally {
      setTimeout(() => setIsExportingCSV(false), 1000);
    }
  };

  const handlePDF = () => {
    setIsExportingPDF(true);
    toast({
      title: "Mempersiapkan Dokumen PDF (.pdf)",
      description: "Membuka dialog pencetakan dan ekspor PDF resmi dashboard...",
      type: "info",
    });
    setTimeout(() => {
      exportSummaryReportPDF();
      setIsExportingPDF(false);
    }, 600);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 3 Format Export Buttons Group */}
      <div className="inline-flex items-center p-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 gap-1">
        {/* Excel Button */}
        <button
          type="button"
          onClick={handleExcel}
          disabled={isExportingExcel}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 border border-emerald-500/20 shadow-xs transition-all cursor-pointer disabled:opacity-50"
          title="Unduh format Microsoft Excel Spreadsheet (.xlsx)"
        >
          {isExportingExcel ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          )}
          <span>Excel (.xlsx)</span>
        </button>

        {/* CSV Button */}
        <button
          type="button"
          onClick={handleCSV}
          disabled={isExportingCSV}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 shadow-xs transition-all cursor-pointer disabled:opacity-50"
          title="Unduh format Comma-Separated Values (.csv)"
        >
          {isExportingCSV ? (
            <Check className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <FileText className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
          )}
          <span>CSV (.csv)</span>
        </button>

        {/* PDF Button */}
        <button
          type="button"
          onClick={handlePDF}
          disabled={isExportingPDF}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 border border-rose-500/20 shadow-xs transition-all cursor-pointer disabled:opacity-50"
          title="Cetak atau Unduh Dokumen PDF (.pdf)"
        >
          <FileType className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          <span>PDF (.pdf)</span>
        </button>
      </div>

      {/* Primary Action Button: Generate Infografis AI */}
      {onGenerateAI && (
        <button
          type="button"
          onClick={onGenerateAI}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
          <span>Generate Infografis AI</span>
        </button>
      )}
    </div>
  );
}
