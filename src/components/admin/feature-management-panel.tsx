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
  LayoutGrid,
  TrendingUp,
  PieChart,
  TableProperties,
  DownloadCloud,
  CalendarRange,
  Zap,
} from "lucide-react";

export function FeatureManagementPanel() {
  const { features, toggleFeature, enableAll, disableAll, resetToDefaults, activeCount, totalCount } =
    useFeatures();
  const { switchRole } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case "LayoutGrid":
        return <LayoutGrid className="w-5 h-5 text-blue-500" />;
      case "TrendingUp":
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case "PieChart":
        return <PieChart className="w-5 h-5 text-purple-500" />;
      case "TableProperties":
        return <TableProperties className="w-5 h-5 text-indigo-500" />;
      case "DownloadCloud":
        return <DownloadCloud className="w-5 h-5 text-amber-500" />;
      case "CalendarRange":
        return <CalendarRange className="w-5 h-5 text-cyan-500" />;
      default:
        return <Sliders className="w-5 h-5 text-blue-500" />;
    }
  };

  const handleToggle = (key: FeatureKey, currentStatus: boolean, label: string) => {
    toggleFeature(key);
    toast({
      title: !currentStatus ? `Modul "${label}" Diaktifkan` : `Modul "${label}" Dinonaktifkan`,
      description: !currentStatus
        ? "Widget ini sekarang akan tampil pada dashboard User."
        : "Widget ini disembunyikan dari tampilan dashboard User.",
      type: !currentStatus ? "success" : "info",
    });
  };

  const handleSimulateUser = () => {
    switchRole("user");
    toast({
      title: "Mode Simulasi User Aktif",
      description: "Beralih ke akun Sarah Jenkins (User). Membuka dashboard sesuai konfigurasi saat ini...",
      type: "info",
    });
    router.push("/dashboard");
  };

  return (
    <Card className="border-blue-500/30 bg-gradient-to-b from-white to-blue-50/20 dark:from-slate-900 dark:to-blue-950/20 shadow-md">
      <CardHeader className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-600 text-white shadow-sm">
                <Sliders className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Pengaturan Tampilan & Feature Management
              </CardTitle>
              <Badge variant="default" className="ml-2 font-mono text-xs">
                {activeCount} / {totalCount} Aktif
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Kendali visibilitas terpusat untuk mengaktifkan atau menyembunyikan modul pada akun User secara real-time.
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
              title="Kembalikan ke konfigurasi default"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURE_CONFIGS.map((cfg) => {
            const isEnabled = features[cfg.key];
            return (
              <div
                key={cfg.key}
                className={`relative flex flex-col justify-between p-4 rounded-xl border transition-all duration-200 ${
                  isEnabled
                    ? "bg-white dark:bg-slate-900 border-blue-500/40 shadow-sm"
                    : "bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80 opacity-75"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                        {getModuleIcon(cfg.iconName)}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                          {cfg.label}
                        </h4>
                        <span className="font-mono text-[10px] text-slate-400">
                          ID: {cfg.key}
                        </span>
                      </div>
                    </div>

                    <Switch
                      id={`switch-${cfg.key}`}
                      checked={isEnabled}
                      onCheckedChange={() => handleToggle(cfg.key, isEnabled, cfg.label)}
                    />
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {cfg.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    Status User
                  </span>
                  <Badge
                    variant={isEnabled ? "success" : "secondary"}
                    className="font-medium text-[11px] px-2 py-0.5"
                  >
                    {isEnabled ? "Ditampilkan (Aktif)" : "Disembunyikan (Off)"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
          <Zap className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <span>
            <strong>Sinkronisasi Instan:</strong> Setiap perubahan tombol Switch otomatis tersimpan di storage global. Modul akan seketika hilang atau muncul di dashboard User tanpa perlu merestart server.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
