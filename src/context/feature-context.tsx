"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { FeatureKey, FeatureFlags, FeatureContextType } from "@/types/features";
import { FEATURE_CONFIGS } from "@/lib/mock-data";

const FEATURE_STORAGE_KEY = "enterprise_dashboard_features_v1";
const SYNC_EVENT_NAME = "enterprise_feature_flags_sync";

const DEFAULT_FLAGS: FeatureFlags = FEATURE_CONFIGS.reduce((acc, curr) => {
  acc[curr.key] = curr.defaultEnabled;
  return acc;
}, {} as FeatureFlags);

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export function FeatureProvider({ children }: { children: ReactNode }) {
  const [features, setFeatures] = useState<FeatureFlags>(DEFAULT_FLAGS);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FEATURE_STORAGE_KEY);
      if (stored) {
        const parsed: FeatureFlags = JSON.parse(stored);
        // Merge with defaults in case new keys were added
        setFeatures({
          ...DEFAULT_FLAGS,
          ...parsed,
        });
      }
    } catch (e) {
      console.error("Failed to load feature flags from localStorage", e);
    }
  }, []);

  // Listen for storage events (cross-tab sync) and custom in-window sync events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === FEATURE_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setFeatures(parsed);
        } catch (err) {
          console.error("Failed to sync storage change", err);
        }
      }
    };

    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent<FeatureFlags>;
      if (customEvent.detail) {
        setFeatures(customEvent.detail);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(SYNC_EVENT_NAME, handleCustomSync);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(SYNC_EVENT_NAME, handleCustomSync);
    };
  }, []);

  const persistAndBroadcast = useCallback((newFlags: FeatureFlags) => {
    setFeatures(newFlags);
    try {
      localStorage.setItem(FEATURE_STORAGE_KEY, JSON.stringify(newFlags));
      window.dispatchEvent(
        new CustomEvent(SYNC_EVENT_NAME, { detail: newFlags })
      );
    } catch (e) {
      console.error("Failed to persist feature flags", e);
    }
  }, []);

  const isFeatureEnabled = useCallback(
    (key: FeatureKey): boolean => {
      return !!features[key];
    },
    [features]
  );

  const toggleFeature = useCallback(
    (key: FeatureKey) => {
      setFeatures((current) => {
        const updated = {
          ...current,
          [key]: !current[key],
        };
        persistAndBroadcast(updated);
        return updated;
      });
    },
    [persistAndBroadcast]
  );

  const setFeature = useCallback(
    (key: FeatureKey, enabled: boolean) => {
      setFeatures((current) => {
        const updated = {
          ...current,
          [key]: enabled,
        };
        persistAndBroadcast(updated);
        return updated;
      });
    },
    [persistAndBroadcast]
  );

  const enableAll = useCallback(() => {
    const updated: FeatureFlags = {} as FeatureFlags;
    Object.keys(DEFAULT_FLAGS).forEach((k) => {
      updated[k as FeatureKey] = true;
    });
    persistAndBroadcast(updated);
  }, [persistAndBroadcast]);

  const disableAll = useCallback(() => {
    const updated: FeatureFlags = {} as FeatureFlags;
    Object.keys(DEFAULT_FLAGS).forEach((k) => {
      updated[k as FeatureKey] = false;
    });
    persistAndBroadcast(updated);
  }, [persistAndBroadcast]);

  const resetToDefaults = useCallback(() => {
    persistAndBroadcast(DEFAULT_FLAGS);
  }, [persistAndBroadcast]);

  const activeCount = Object.values(features).filter(Boolean).length;
  const totalCount = Object.keys(DEFAULT_FLAGS).length;

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
