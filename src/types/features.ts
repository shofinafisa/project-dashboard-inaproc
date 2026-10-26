export type FeatureKey =
  | "kpi_cards"
  | "sales_chart"
  | "category_distribution"
  | "recent_transactions"
  | "export_buttons"
  | "date_range_filter";

export interface FeatureMetadata {
  key: FeatureKey;
  label: string;
  description: string;
  category: "analytics" | "visualization" | "data" | "controls";
  iconName: string;
  defaultEnabled: boolean;
}

export type FeatureFlags = Record<FeatureKey, boolean>;

export interface FeatureContextType {
  features: FeatureFlags;
  isFeatureEnabled: (key: FeatureKey) => boolean;
  toggleFeature: (key: FeatureKey) => void;
  setFeature: (key: FeatureKey, enabled: boolean) => void;
  enableAll: () => void;
  disableAll: () => void;
  resetToDefaults: () => void;
  activeCount: number;
  totalCount: number;
}
