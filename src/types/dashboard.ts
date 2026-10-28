import { FeatureKey } from "./features";

export interface KPICardData {
  id: string;
  title: string;
  value: string;
  numericValue: number;
  change: number;
  trend: "up" | "down" | "neutral";
  subtitle: string;
  iconName: "dollar" | "shopping-bag" | "percent" | "trending-up";
}

export interface SalesMonthlyData {
  month: string;
  revenue: number;
  orders: number;
  growth: number;
  methodBreakdown?: Partial<Record<FeatureKey, number>>;
}

export interface CategoryData {
  key: FeatureKey;
  name: string;
  value: number;
  orders: number;
  color: string;
  percentage: number;
}

export type TransactionStatus = "completed" | "pending" | "processing" | "failed";

export interface Transaction {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerAvatar: string;
  product: string;
  category: string;
  procurementMethod: FeatureKey;
  methodLabel: string;
  amount: number;
  status: TransactionStatus;
  date: string;
  paymentMethod: string;
}

export type DateRangeOption = "today" | "7d" | "30d" | "90d" | "ytd" | "all";
