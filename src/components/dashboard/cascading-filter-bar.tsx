"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  CascadingFilterState,
  JENIS_INSTANSI_LIST,
  getInstansiOptions,
  getEselonOptions,
  getSatkerOptions,
} from "@/lib/cascading-filter-data";
import { DateFilter } from "@/components/dashboard/date-filter";
import { RotateCcw, ChevronDown, Calendar, Layers, X } from "lucide-react";

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
  disabled = false,
  placeholder = "Semua",
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const toggleOption = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((item) => item !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  const handleSelectAll = () => {
    onChange([...options]);
  };

  const handleClear = () => {
    onChange([]);
  };

  return (
    <div className="relative flex-1 min-w-[150px]" ref={containerRef}>
      <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
        {label}
      </label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full h-9 px-3 rounded-xl border text-xs text-left flex items-center justify-between gap-1.5 transition-all cursor-pointer ${
          disabled
            ? "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-50 cursor-not-allowed text-slate-400"
            : selected.length > 0
            ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-400/60 dark:border-blue-500/50 text-blue-700 dark:text-blue-300 font-medium"
            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-300"
        }`}
      >
        <span className="truncate">
          {selected.length === 0
            ? placeholder
            : selected.length === 1
            ? selected[0]
            : `${selected.length} Terpilih`}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Popover Checklist Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute left-0 top-full mt-1.5 z-40 w-64 max-h-64 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden flex flex-col text-xs animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/50">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
            >
              Pilih Semua
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
            >
              Reset
            </button>
          </div>

          <div className="overflow-y-auto p-1.5 space-y-0.5 flex-1 max-h-48">
            {options.map((opt) => {
              const isChecked = selected.includes(opt);
              return (
                <label
                  key={opt}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleOption(opt)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span
                    className={`truncate text-xs ${
                      isChecked
                        ? "font-semibold text-slate-900 dark:text-slate-100"
                        : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {opt}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface CascadingFilterBarProps {
  filterState: CascadingFilterState;
  onChange: (next: CascadingFilterState) => void;
  onReset: () => void;
}

export function CascadingFilterBar({
  filterState,
  onChange,
  onReset,
}: CascadingFilterBarProps) {
  const instansiOptions = getInstansiOptions(filterState.jenisInstansi);
  const eselonOptions = getEselonOptions(filterState.instansi);
  const satkerOptions = getSatkerOptions(filterState.eselon);

  const isYearFiltered =
    filterState.yearRange[0] !== 2020 || filterState.yearRange[1] !== 2026;

  const hasActiveFilters =
    filterState.jenisInstansi.length > 0 ||
    filterState.instansi.length > 0 ||
    filterState.eselon.length > 0 ||
    filterState.satker.length > 0 ||
    isYearFiltered;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3 transition-all">
      {/* Filter Row */}
      <div className="flex flex-wrap lg:flex-nowrap items-end gap-2.5">
        {/* Dual Range Slider: Rentang Tahun */}
        <div className="relative flex-1 min-w-[170px] sm:min-w-[190px]">
          <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-blue-500" />
            Rentang Tahun
          </label>
          <DateFilter
            value={filterState.yearRange}
            onChange={(newRange) =>
              onChange({
                ...filterState,
                yearRange: newRange,
              })
            }
            align="left"
            buttonClassName="w-full justify-between"
          />
        </div>

        {/* Multiple Choice: Jenis Instansi */}
        <MultiSelectDropdown
          label="Jenis Instansi"
          options={JENIS_INSTANSI_LIST}
          selected={filterState.jenisInstansi}
          onChange={(jenis) =>
            onChange({
              ...filterState,
              jenisInstansi: jenis,
              instansi: [],
              eselon: [],
              satker: [],
            })
          }
          placeholder="Semua Jenis"
        />

        {/* Multiple Choice: Instansi */}
        <MultiSelectDropdown
          label="Instansi"
          options={instansiOptions}
          selected={filterState.instansi}
          onChange={(ins) =>
            onChange({
              ...filterState,
              instansi: ins,
              eselon: [],
              satker: [],
            })
          }
          placeholder="Semua Instansi"
        />

        {/* Multiple Choice: Eselon */}
        <MultiSelectDropdown
          label="Eselon I / II"
          options={eselonOptions}
          selected={filterState.eselon}
          onChange={(es) =>
            onChange({
              ...filterState,
              eselon: es,
              satker: [],
            })
          }
          placeholder="Semua Eselon"
        />

        {/* Multiple Choice: Satker */}
        <MultiSelectDropdown
          label="Satker"
          options={satkerOptions}
          selected={filterState.satker}
          onChange={(stk) =>
            onChange({
              ...filterState,
              satker: stk,
            })
          }
          placeholder="Semua Satker"
        />

        {/* Reset Filter Button */}
        <button
          type="button"
          onClick={onReset}
          disabled={!hasActiveFilters}
          className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1.5 text-xs font-medium transition-all shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed mb-0"
          title="Reset semua filter"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset</span>
        </button>
      </div>

      {/* Active filter summary tag bar (Clean & minimal) */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Layers className="w-3 h-3 text-blue-500" />
            Filter Aktif:
          </span>
          {isYearFiltered && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium">
              Tahun{" "}
              {filterState.yearRange[0] === filterState.yearRange[1]
                ? filterState.yearRange[0]
                : `${filterState.yearRange[0]}—${filterState.yearRange[1]}`}
              <X
                className="w-2.5 h-2.5 text-blue-500 hover:text-rose-500 cursor-pointer"
                onClick={() =>
                  onChange({
                    ...filterState,
                    yearRange: [2020, 2026],
                  })
                }
              />
            </span>
          )}
          {filterState.jenisInstansi.map((j) => (
            <span
              key={j}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              {j}
              <X
                className="w-2.5 h-2.5 text-slate-400 hover:text-rose-500 cursor-pointer"
                onClick={() =>
                  onChange({
                    ...filterState,
                    jenisInstansi: filterState.jenisInstansi.filter((item) => item !== j),
                  })
                }
              />
            </span>
          ))}
          {filterState.instansi.map((i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              {i}
              <X
                className="w-2.5 h-2.5 text-slate-400 hover:text-rose-500 cursor-pointer"
                onClick={() =>
                  onChange({
                    ...filterState,
                    instansi: filterState.instansi.filter((item) => item !== i),
                  })
                }
              />
            </span>
          ))}
          {filterState.eselon.map((e) => (
            <span
              key={e}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              {e}
              <X
                className="w-2.5 h-2.5 text-slate-400 hover:text-rose-500 cursor-pointer"
                onClick={() =>
                  onChange({
                    ...filterState,
                    eselon: filterState.eselon.filter((item) => item !== e),
                  })
                }
              />
            </span>
          ))}
          {filterState.satker.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              {s}
              <X
                className="w-2.5 h-2.5 text-slate-400 hover:text-rose-500 cursor-pointer"
                onClick={() =>
                  onChange({
                    ...filterState,
                    satker: filterState.satker.filter((item) => item !== s),
                  })
                }
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
