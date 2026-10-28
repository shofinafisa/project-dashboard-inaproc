"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { FeatureKey, FeatureFlags, FeatureContextType, YearRange } from "@/types/features";
import { FEATURE_CONFIGS } from "@/lib/mock-data";

const FEATURE_STORAGE_KEY = "inaproc_procurement_methods_v2";
const YEAR_STORAGE_KEY = "inaproc_year_range_v1";

const MIN_YEAR = 2020;
const MAX_YEAR = 2026;
const DEFAULT_YEAR_RANGE: YearRange = [MIN_YEAR, MAX_YEAR];

const DEFAULT_FLAGS: FeatureFlags = FEATURE_CONFIGS.reduce((acc, curr) => {
  acc[curr.key] = curr.defaultEnabled;
  return acc;
}, {} as FeatureFlags);

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export function FeatureProvider({ children }: { children: ReactNode }) {
  const [features, setFeatures] = useState<FeatureFlags>(DEFAULT_FLAGS);
  const [yearRange, setYearRangeState] = useState<YearRange>(DEFAULT_YEAR_RANGE);

  // Load from localStorage on mount & safely validate
  useEffect(() => {
    try {
      // Load feature flags
      const stored = localStorage.getItem(FEATURE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged: FeatureFlags = { ...DEFAULT_FLAGS };
        (Object.keys(DEFAULT_FLAGS) as FeatureKey[]).forEach((key) => {
          if (typeof parsed[key] === "boolean") {
            merged[key] = parsed[key];
          }
        });
        setFeatures(merged);
      } else {
        localStorage.setItem(FEATURE_STORAGE_KEY, JSON.stringify(DEFAULT_FLAGS));
      }

      // Load year range
      const storedYears = localStorage.getItem(YEAR_STORAGE_KEY);
      if (storedYears) {
        const parsedYears = JSON.parse(storedYears);
        if (
          Array.isArray(parsedYears) &&
          parsedYears.length === 2 &&
          typeof parsedYears[0] === "number" &&
          typeof parsedYears[1] === "number" &&
          parsedYears[0] <= parsedYears[1]
        ) {
          setYearRangeState([
            Math.max(MIN_YEAR, parsedYears[0]),
            Math.min(MAX_YEAR, parsedYears[1]),
          ]);
        }
      }
    } catch (e) {
      console.error("Failed to load settings from localStorage", e);
    }
  }, []);

  // Listen for storage events (cross-tab sync only)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === FEATURE_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setFeatures((prev) => ({
            ...prev,
            ...parsed,
          }));
        } catch (err) {
          console.error("Failed to sync feature storage change", err);
        }
      } else if (e.key === YEAR_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length === 2) {
            setYearRangeState([parsed[0], parsed[1]]);
          }
        } catch (err) {
          console.error("Failed to sync year storage change", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const setYearRange = useCallback((newRange: YearRange) => {
    const validStart = Math.max(MIN_YEAR, Math.min(newRange[0], newRange[1]));
    const validEnd = Math.min(MAX_YEAR, Math.max(newRange[0], newRange[1]));
    const clamped: YearRange = [validStart, validEnd];
    setYearRangeState(clamped);
    try {
      localStorage.setItem(YEAR_STORAGE_KEY, JSON.stringify(clamped));
    } catch (e) {
      console.error("Failed to persist year range", e);
    }
  }, []);

  const toggleFeature = useCallback((key: FeatureKey) => {
    setFeatures((prev) => {
      const nextVal = !prev[key];
      const updated: FeatureFlags = {
        ...prev,
        [key]: nextVal,
      };
      try {
        localStorage.setItem(FEATURE_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to persist feature flags", e);
      }
      return updated;
    });
  }, []);

  const setFeature = useCallback((key: FeatureKey, enabled: boolean) => {
    setFeatures((prev) => {
      const updated: FeatureFlags = {
        ...prev,
        [key]: enabled,
      };
      try {
        localStorage.setItem(FEATURE_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to persist feature flags", e);
      }
      return updated;
    });
  }, []);

  const enableAll = useCallback(() => {
    const updated: FeatureFlags = {} as FeatureFlags;
    (Object.keys(DEFAULT_FLAGS) as FeatureKey[]).forEach((k) => {
      updated[k] = true;
    });
    setFeatures(updated);
    try {
      localStorage.setItem(FEATURE_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to persist feature flags", e);
    }
  }, []);

  const disableAll = useCallback(() => {
    const updated: FeatureFlags = {} as FeatureFlags;
    (Object.keys(DEFAULT_FLAGS) as FeatureKey[]).forEach((k) => {
      updated[k] = false;
    });
    setFeatures(updated);
    try {
      localStorage.setItem(FEATURE_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to persist feature flags", e);
    }
  }, []);

  const resetToDefaults = useCallback(() => {
    setFeatures(DEFAULT_FLAGS);
    setYearRangeState(DEFAULT_YEAR_RANGE);
    try {
      localStorage.setItem(FEATURE_STORAGE_KEY, JSON.stringify(DEFAULT_FLAGS));
      localStorage.setItem(YEAR_STORAGE_KEY, JSON.stringify(DEFAULT_YEAR_RANGE));
    } catch (e) {
      console.error("Failed to save defaults to storage", e);
    }
  }, []);

  const activeMethods = (Object.keys(features) as FeatureKey[]).filter(
    (k) => Boolean(features[k])
  );
  const activeCount = activeMethods.length;
  const totalCount = Object.keys(DEFAULT_FLAGS).length;

  const isFeatureEnabled = useCallback(
    (key: FeatureKey): boolean => {
      return Boolean(features[key]);
    },
    [features]
  );

  return (
    <FeatureContext.Provider
      value={{
        features,
        isFeatureEnabled,
        toggleFeature,
        setFeature,
        enableAll,
        disableAll,
        resetToDefaults,
        activeCount,
        totalCount,
        activeMethods,
        yearRange,
        setYearRange,
        minYear: MIN_YEAR,
        maxYear: MAX_YEAR,
      }}
    >
      {children}
    </FeatureContext.Provider>
  );
}

export function useFeatures() {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error("useFeatures must be used within a FeatureProvider");
  }
  return context;
}
