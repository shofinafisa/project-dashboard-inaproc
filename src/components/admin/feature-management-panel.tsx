"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useFeatures } from "@/context/feature-context";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";
import { FEATURE_CONFIGS } from "@/lib/mock-data";
import { FeatureKey } from "@/types/features";
import {
  Sliders,
  RotateCcw,
  CheckCheck,
  Ban,
  Eye,
  UserCheck,
  FileCheck2,
  ShoppingCart,
  Building2,
  Award,
  Trophy,
  Gavel,
  Zap,
  Globe,
  AlertTriangle,
  SearchCode,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

export function FeatureManagementPanel() {
  const {
    features,
    toggleFeature,
    enableAll,
    disableAll,
    resetToDefaults,
    activeCount,
    totalCount,
  } = useFeatures();
  const { switchRole } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const getMethodIcon = (iconName: string) => {
    switch (iconName) {
      case "UserCheck":
        return <UserCheck className="w-5 h-5 text-blue-500" />;
      case "FileCheck2":
        return <FileCheck2 className="w-5 h-5 text-indigo-500" />;
      case "ShoppingCart":
        return <ShoppingCart className="w-5 h-5 text-emerald-500" />;
      case "Building2":
        return <Building2 className="w-5 h-5 text-teal-500" />;
      case "Award":
        return <Award className="w-5 h-5 text-amber-500" />;
      case "Trophy":
        return <Trophy className="w-5 h-5 text-orange-500" />;
      case "Gavel":
        return <Gavel className="w-5 h-5 text-violet-500" />;
      case "Zap":
        return <Zap className="w-5 h-5 text-cyan-500" />;
      case "Globe":
        return <Globe className="w-5 h-5 text-sky-500" />;
      case "AlertTriangle":
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      case "SearchCode":
        return <SearchCode className="w-5 h-5 text-purple-500" />;
      case "ShieldAlert":
        return <ShieldAlert className="w-5 h-5 text-slate-500" />;
      default:
        return <Sliders className="w-5 h-5 text-blue-500" />;
    }
  };

  const handleToggle = (key: FeatureKey, currentStatus: boolean, label: string) => {
    toggleFeature(key);
    const nextStatus = !currentStatus;
    toast({
      title: nextStatus ? `Metode "${label}" Diaktifkan (ON)` : `Metode "${label}" Dinonaktifkan (OFF)`,
      description: nextStatus
        ? "Paket & analitik metode ini sekarang ditampilkan pada dashboard User."
        : "Paket & analitik metode ini disembunyikan dari dashboard User.",
      type: nextStatus ? "success" : "info",
    });
  };

  const handleSimulateUser = () => {
    switchRole("user");
    toast({
      title: "Mode Simulasi User Aktif",
      description: "Beralih ke akun PPK Satker (User). Membuka dashboard sesuai konfigurasi metode yang aktif...",
      type: "info",
    });
    router.push("/dashboard");
  };

  return (
    <Card className="border-blue-500/30 bg-gradient-to-b from-white to-blue-50/20 dark:from-slate-900 dark:to-blue-950/20 shadow-md">
      <CardHeader className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="p-2 rounded-lg bg-blue-600 text-white shadow-sm">
                <Sliders className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Pengaturan Visibilitas Metode Pengadaan INAPROC
              </CardTitle>
              <Badge
                variant={activeCount > 0 ? "default" : "destructive"}
                className="ml-1 font-mono text-xs px-2.5 py-0.5"
              >
                {activeCount} / {totalCount} Metode Aktif
              </Badge>
            </div>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Klik kartu metode pengadaan atau tombol switch untuk mengaktifkan / menonaktifkan data paket, metrik KPI, dan visualisasi secara instan.
            </CardDescription>
          </div>

          {/* Quick action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={enableAll}
              className="text-xs h-8 gap-1.5 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
              Aktifkan Semua
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={disableAll}
              className="text-xs h-8 gap-1.5 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100"
            >
              <Ban className="w-3.5 h-3.5 text-rose-500" />
              Nonaktifkan Semua
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToDefaults}
              className="text-xs h-8 gap-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              title="Kembalikan ke konfigurasi default (Semua Aktif)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSimulateUser}
              className="text-xs h-8 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-semibold"
            >
              <Eye className="w-3.5 h-3.5" />
              Simulasikan Tampilan User
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {FEATURE_CONFIGS.map((cfg) => {
            const isEnabled = Boolean(features[cfg.key]);
            return (
              <div
                key={cfg.key}
                onClick={() => handleToggle(cfg.key, isEnabled, cfg.label)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleToggle(cfg.key, isEnabled, cfg.label);
                  }
                }}
                className={`group relative flex flex-col justify-between p-4 rounded-xl border cursor-pointer select-none transition-all duration-200 hover:shadow-md ${
                  isEnabled
                    ? "bg-white dark:bg-slate-900 border-blue-500/50 shadow-xs ring-1 ring-blue-500/10"
                    : "bg-slate-100/80 dark:bg-slate-900/40 border-slate-200/90 dark:border-slate-800/80 opacity-60 hover:opacity-80"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-2 rounded-lg transition-colors ${
                          isEnabled
                            ? "bg-blue-50 dark:bg-blue-950/60"
                            : "bg-slate-200/70 dark:bg-slate-800"
                        }`}
                      >
                        {getMethodIcon(cfg.iconName)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {cfg.label}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {cfg.category}
                        </span>
                      </div>
                    </div>

                    {/* Visual Switch Indicator (pointer-events-none ensures only one click fires reliably) */}
                    <div className="pointer-events-none">
                      <Switch
                        id={`switch-${cfg.key}`}
                        checked={isEnabled}
                        tabIndex={-1}
                        aria-label={`Aktifkan atau nonaktifkan metode ${cfg.label}`}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {cfg.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Status Dashboard
                  </span>
                  <Badge
                    variant={isEnabled ? "success" : "secondary"}
                    className="font-medium text-[11px] px-2 py-0.5"
                  >
                    {isEnabled ? "Aktif (ON)" : "Nonaktif (OFF)"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 p-3.5 rounded-xl bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/50 flex items-center gap-3 text-xs text-blue-800 dark:text-blue-200">
          <Sparkles className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <span>
            <strong>Sinkronisasi Real-Time INAPROC:</strong> Setiap perubahan tombol Switch otomatis mengupdate filter data paket, kartu metrik KPI, grafik tren bulanan, dan tabel transaksi di seluruh dashboard user secara seketika.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
