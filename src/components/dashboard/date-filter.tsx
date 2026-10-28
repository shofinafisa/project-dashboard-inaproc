"use client";

import React, { useState, useRef, useEffect } from "react";
import { useFeatures } from "@/context/feature-context";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarRange, ChevronDown, RotateCcw, Check } from "lucide-react";

export function DateFilter() {
  const { yearRange, setYearRange, minYear, maxYear } = useFeatures();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [localStart, setLocalStart] = useState(yearRange[0]);
  const [localEnd, setLocalEnd] = useState(yearRange[1]);

  // Keep local state in sync with context
  useEffect(() => {
    setLocalStart(yearRange[0]);
    setLocalEnd(yearRange[1]);
  }, [yearRange]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const totalYearsSpan = maxYear - minYear; // 2026 - 2020 = 6

  // Handlers for sliders
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    // Don't let start exceed end
    const newStart = Math.min(val, localEnd);
    setLocalStart(newStart);
    setYearRange([newStart, localEnd]);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    // Don't let end be less than start
    const newEnd = Math.max(val, localStart);
    setLocalEnd(newEnd);
    setYearRange([localStart, newEnd]);
  };

  const applyPreset = (start: number, end: number, label: string) => {
    setLocalStart(start);
    setLocalEnd(end);
    setYearRange([start, end]);
    toast({
      title: `Periode Tahun: ${start === end ? start : `${start} — ${end}`}`,
      description: `Dashboard difilter berdasarkan ${label}`,
      type: "info",
    });
  };

  const handleReset = () => {
    setLocalStart(minYear);
    setLocalEnd(maxYear);
    setYearRange([minYear, maxYear]);
    toast({
      title: "Periode Tahun Direset",
      description: `Menampilkan seluruh tahun pengadaan (${minYear} — ${maxYear})`,
      type: "info",
    });
  };

  // Calculate track progress bar percentage
  const leftPercent = ((localStart - minYear) / totalYearsSpan) * 100;
  const widthPercent = ((localEnd - localStart) / totalYearsSpan) * 100;

  // Years array for tick labels
  const yearsList = [];
  for (let y = minYear; y <= maxYear; y++) {
    yearsList.push(y);
  }

  const durationSpan = localEnd - localStart + 1;

  return (
    <div className="relative inline-flex items-center" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Pilih rentang tahun pengadaan"
        className={`flex items-center gap-2 h-9 px-3 rounded-lg border text-xs font-medium transition-all shadow-xs cursor-pointer select-none ${
          isOpen
            ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50 dark:bg-slate-800 text-blue-700 dark:text-blue-300"
            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
        }`}
      >
        <CalendarRange className="w-3.5 h-3.5 text-blue-500 shrink-0" />
        <span className="text-slate-400 font-normal">Tahun:</span>
        <span className="font-bold text-slate-900 dark:text-slate-100">
          {localStart === localEnd ? localStart : `${localStart} — ${localEnd}`}
        </span>
        <Badge
          variant="secondary"
          className="text-[10px] px-1.5 py-0 font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-0"
        >
          {durationSpan} Thn
        </Badge>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-blue-500" : ""
          }`}
        />
      </button>

      {/* Dual Range Slider Popover Card */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xl animate-fade-in">
          {/* Popover Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Rentang Tahun Pengadaan
              </h4>
              <p className="text-[11px] text-slate-400">
                Geser slider untuk membatasi periode tahun
              </p>
            </div>
            <Badge
              variant="default"
              className="text-xs px-2.5 py-0.5 font-bold bg-blue-600 text-white tracking-wide"
            >
              {localStart === localEnd ? localStart : `${localStart} — ${localEnd}`}
            </Badge>
          </div>

          {/* Dual Range Slider Container */}
          <div className="py-6 px-1">
            <div className="relative w-full h-8 flex items-center">
              {/* Background Grey Track */}
              <div className="absolute left-0 right-0 h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />

              {/* Highlighted Selected Range Gradient Track */}
              <div
                className="absolute h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 rounded-full shadow-xs transition-all duration-75"
                style={{
                  left: `${leftPercent}%`,
                  width: `${widthPercent}%`,
                }}
              />

              {/* Native Range Slider 1: Start Year */}
              <input
                type="range"
                min={minYear}
                max={maxYear}
                step={1}
                value={localStart}
                onChange={handleStartChange}
                aria-label="Tahun Awal"
                className="dual-slider-thumb absolute left-0 w-full h-2 appearance-none bg-transparent pointer-events-none z-30 focus:outline-none"
              />

              {/* Native Range Slider 2: End Year */}
              <input
                type="range"
                min={minYear}
                max={maxYear}
                step={1}
                value={localEnd}
                onChange={handleEndChange}
                aria-label="Tahun Akhir"
                className="dual-slider-thumb absolute left-0 w-full h-2 appearance-none bg-transparent pointer-events-none z-30 focus:outline-none"
              />
            </div>

            {/* Year Tick Marks along the bottom */}
            <div className="relative flex justify-between items-center mt-2 px-1 text-[11px] text-slate-400 select-none">
              {yearsList.map((year) => {
                const isSelected = year >= localStart && year <= localEnd;
                const isEdge = year === localStart || year === localEnd;
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => {
                      if (year < localStart) {
                        setLocalStart(year);
                        setYearRange([year, localEnd]);
                      } else if (year > localEnd) {
                        setLocalEnd(year);
                        setYearRange([localStart, year]);
                      } else {
                        // Clicked inside: set both to single year
                        setLocalStart(year);
                        setLocalEnd(year);
                        setYearRange([year, year]);
                      }
                    }}
                    className={`flex flex-col items-center transition-colors cursor-pointer group ${
                      isEdge
                        ? "font-bold text-blue-600 dark:text-blue-400 scale-110"
                        : isSelected
                        ? "font-medium text-slate-800 dark:text-slate-200"
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    }`}
                  >
                    <span className="w-1 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mb-1 group-hover:bg-blue-500" />
                    <span>{year}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Year Presets */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Pilihan Cepat
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset(minYear, maxYear, "Seluruh Tahun (2020 — 2026)")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  localStart === minYear && localEnd === maxYear
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                Semua (2020 — 2026)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(2024, 2026, "3 Tahun Terakhir (2024 — 2026)")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  localStart === 2024 && localEnd === 2026
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                3 Thn Terakhir (2024 — 2026)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(2026, 2026, "Tahun Berjalan 2026")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  localStart === 2026 && localEnd === 2026
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                Tahun Ini (2026)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(2020, 2023, "Periode Historis 2020 — 2023")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  localStart === 2020 && localEnd === 2023
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                2020 — 2023
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-xs h-8 px-2 text-slate-500 hover:text-slate-900 dark:hover:text-white gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset (Semua)
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsOpen(false);
                toast({
                  title: "Rentang Tahun Diterapkan",
                  description: `Dashboard menampilkan data periode tahun ${localStart} — ${localEnd}`,
                  type: "success",
                });
              }}
              className="text-xs h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Terapkan Filter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
