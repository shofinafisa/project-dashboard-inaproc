"use client";

import React, { useState, useEffect } from "react";
import { CascadingFilterState } from "@/lib/cascading-filter-data";
import { formatShortCurrency, formatNumber } from "@/lib/utils";
import { useFeatures } from "@/context/feature-context";
import { useToast } from "@/components/ui/toast";
import {
  Sparkles,
  Download,
  Printer,
  X,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";

interface AIInfographicModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterState: CascadingFilterState;
  targetMethodLabel?: string;
  customStats?: {
    totalAmount: number;
    totalPackages: number;
    efficiencyRatio: string;
  };
}

interface InfographicResponse {
  success: boolean;
  prompt: string;
  imageUrl: string;
  metadata: {
    tahun: string;
    jenisInstansi: string;
    instansi: string;
    eselon: string;
    satker: string;
    generatedAt: string;
    metrics: {
      totalRealisasi: string;
      totalPaket: string;
      efisiensi: string;
    };
  };
}

export function AIInfographicModal({
  isOpen,
  onClose,
  filterState,
  targetMethodLabel,
  customStats,
}: AIInfographicModalProps) {
  const { toast } = useToast();
  const { filteredStats: ctxStats } = useFeatures();
  const stats = customStats ?? ctxStats;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<InfographicResponse | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      setData(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setLoadingStep(1);

    const stepTimer1 = setTimeout(() => {
      if (isMounted) setLoadingStep(2);
    }, 600);

    const stepTimer2 = setTimeout(() => {
      if (isMounted) setLoadingStep(3);
    }, 1200);

    const generate = async () => {
      try {
        const payload = {
          yearRange: filterState.yearRange,
          jenisInstansi: filterState.jenisInstansi,
          instansi: filterState.instansi,
          eselon: filterState.eselon,
          satker: filterState.satker,
          targetMethod: targetMethodLabel,
          metrics: {
            totalRealisasi: formatShortCurrency(stats.totalAmount),
            totalPaket: `${formatNumber(stats.totalPackages)} Paket`,
            efisiensi: `Hemat ${stats.efficiencyRatio}%`,
          },
        };

        const res = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Gagal generate infografis");

        const json = await res.json();
        if (isMounted) {
          setData(json);
          toast({
            title: "Infografis AI Siap",
            description: `Poster visual pengadaan ${
              targetMethodLabel ? `(${targetMethodLabel}) ` : ""
            }telah berhasil dirender.`,
            type: "success",
          });
        }
      } catch {
        if (isMounted) {
          toast({
            title: "Gagal Membuat Infografis",
            description: "Terjadi kesalahan saat memproses generator gambar AI.",
            type: "error",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    generate();

    return () => {
      isMounted = false;
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
    };
  }, [isOpen, filterState, stats, targetMethodLabel, toast]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!data?.imageUrl) return;
    const link = document.createElement("a");
    link.href = data.imageUrl;
    const cleanInstansi = (
      filterState.instansi.length > 0 ? filterState.instansi[0] : "Nasional"
    )
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_");
    const cleanMethod = targetMethodLabel
      ? `_${targetMethodLabel.toLowerCase().replace(/[^a-z0-9]/g, "_")}`
      : "";
    link.download = `Infografis_INAPROC${cleanMethod}_${cleanInstansi}_${filterState.yearRange[0]}_${filterState.yearRange[1]}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "File Infografis Diunduh",
      description: "Poster infografis resolusi tinggi telah disimpan.",
      type: "success",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl overflow-hidden">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Infografis Pengadaan AI (INAPROC)
                {targetMethodLabel && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                    {targetMethodLabel}
                  </span>
                )}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Active Filter Badges Bar */}
          <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Parameter:
            </span>
            {targetMethodLabel && (
              <span className="px-2 py-0.5 rounded-md bg-blue-900/40 text-blue-300 border border-blue-700/60 font-semibold">
                Metode: {targetMethodLabel}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700/60 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-blue-400" />
              Tahun: <strong>{filterState.yearRange[0]}—{filterState.yearRange[1]}</strong>
            </span>
            {filterState.jenisInstansi.length > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700/60">
                {filterState.jenisInstansi.join(", ")}
              </span>
            )}
            {filterState.instansi.length > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-blue-950/60 text-blue-300 border border-blue-800/60">
                {filterState.instansi.join(", ")}
              </span>
            )}
          </div>

          {/* Loading State Animation */}
          {isLoading ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center space-y-5 rounded-xl border border-slate-800 bg-slate-950/40">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/25 animate-pulse">
                <Sparkles className="w-7 h-7 text-white animate-spin" />
              </div>

              <div className="space-y-1 max-w-sm">
                <h3 className="text-sm font-semibold text-white">
                  Merancang Poster Infografis...
                </h3>
              </div>

              {/* Progress Steps */}
              <div className="space-y-2 w-full max-w-xs text-left text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      loadingStep >= 1 ? "text-emerald-400" : "text-slate-600"
                    }`}
                  />
                  <span className={loadingStep >= 1 ? "text-slate-200" : ""}>
                    Memetakan filter aktif
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {loadingStep >= 2 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                  )}
                  <span className={loadingStep >= 2 ? "text-slate-200" : ""}>
                    Mengagregasi metrik KPI pengadaan
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {loadingStep >= 3 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />
                  )}
                  <span className={loadingStep >= 3 ? "text-slate-200" : ""}>
                    Merender visual vektor poster
                  </span>
                </div>
              </div>
            </div>
          ) : data?.imageUrl ? (
            /* Rendered Infographic Poster */
            <div className="space-y-3">
              <div className="rounded-xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.imageUrl}
                  alt="Poster Infografis Pengadaan Barang dan Jasa Pemerintah"
                  className="w-full h-auto max-h-[60vh] object-contain select-none"
                />
              </div>

              {/* Collapsible Master Prompt Inspector */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setShowPrompt((p) => !p)}
                  className="w-full flex items-center justify-between p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-colors text-left cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
                    Master Prompt Template
                  </span>
                  {showPrompt ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {showPrompt && (
                  <div className="p-3 text-[11px] font-mono text-slate-300 bg-slate-950/80 border-t border-slate-800/80 leading-relaxed whitespace-pre-wrap">
                    {data.prompt}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-3 border-t border-slate-800/80 bg-slate-950/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Tutup
          </button>

          <button
            type="button"
            onClick={handlePrint}
            disabled={isLoading || !data}
            className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-rose-400" />
            <span>Cetak / PDF</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isLoading || !data}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Infografis</span>
          </button>
        </div>
      </div>
    </div>
  );
}
