"use client";

import React, { ReactNode } from "react";
import { FeatureKey } from "@/types/features";
import { useFeatures } from "@/context/feature-context";

interface FeatureGuardProps {
  featureKey: FeatureKey;
  children: ReactNode;
  fallback?: ReactNode;
  /**
   * If true, ignores the feature toggle and renders children (useful for admin full-access views)
   */
  bypass?: boolean;
}

/**
 * Reusable FeatureGuard component that conditionally renders its children
 * based on whether the given featureKey is enabled in the Feature Toggle Engine.
 */
export function FeatureGuard({
  featureKey,
  children,
  fallback = null,
  bypass = false,
}: FeatureGuardProps) {
  const { isFeatureEnabled } = useFeatures();

  if (bypass) {
    return <>{children}</>;
  }

  const enabled = isFeatureEnabled(featureKey);

  if (!enabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
