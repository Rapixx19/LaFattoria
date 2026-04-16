import type { BillItem, BillType } from '../../billing/lib/types';

/**
 * Revenue data for a single month (from get_revenue_by_month RPC)
 */
export interface MonthRevenue {
  month: number;       // 1-12
  bill_count: number;
  invoiced: number;    // total CHF invoiced
  paid: number;        // total CHF received
  pending: number;     // total CHF pending
  overdue: number;     // total CHF overdue
}

/**
 * Revenue breakdown by client
 */
export interface ClientRevenue {
  client_id: string;
  client_name: string;
  total_invoiced: number;
  total_paid: number;
  bill_count: number;
}

/**
 * Revenue breakdown by service
 */
export interface ServiceRevenue {
  service_name: string;
  total_revenue: number;
  usage_count: number;
}

/**
 * Input for importing historical bills
 */
export interface ImportBillInput {
  type: BillType;
  clientId: string;
  date: string;
  period: string | null;
  items: BillItem[];
  paidAmount: number | null;
  paidDate: string | null;
  notes: string | null;
}

/**
 * Italian month abbreviations for chart x-axis
 */
export const MONTHS_SHORT_IT = [
  'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',
  'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'
] as const;

/**
 * Chart color tokens (design system)
 */
export const CHART_COLORS = {
  paid: 'var(--color-paid)',
  pending: 'var(--color-pending)',
  overdue: 'var(--color-overdue)',
} as const;

/**
 * Extracted invoice item from PDF parsing
 */
export interface ExtractedItem {
  name: string;
  qty: number;
  price: number;
  subtotal: number;
}

/**
 * Invoice data extracted from PDF via AI parsing
 */
export interface ExtractedInvoice {
  fileName: string;
  clientName: string;
  date: string;
  items: ExtractedItem[];
  total: number;
  matchedClientId: string | null;
  matchedServiceId: string | null;
  status: 'ready' | 'needs_review' | 'error';
  error?: string;
}
