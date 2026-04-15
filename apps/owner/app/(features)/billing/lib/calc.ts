import type { BillItem, BillTotals } from './types';

/**
 * Calculate bill totals from line items
 * Returns net, VAT breakdown by rate, total VAT, and grand total
 */
export function calcBillTotals(items: BillItem[]): BillTotals {
  const vatMap: Record<number, number> = {};
  let net = 0;

  for (const item of items) {
    const subtotal = item.price * item.qty;
    net += subtotal;

    if (item.vat > 0) {
      const vatAmount = subtotal * item.vat / 100;
      vatMap[item.vat] = (vatMap[item.vat] ?? 0) + vatAmount;
    }
  }

  const vatTotal = Object.values(vatMap).reduce((a, b) => a + b, 0);

  return {
    net: Math.round(net * 100) / 100,
    vatMap: Object.fromEntries(
      Object.entries(vatMap).map(([k, v]) => [k, Math.round(v * 100) / 100])
    ),
    vatTotal: Math.round(vatTotal * 100) / 100,
    total: Math.round((net + vatTotal) * 100) / 100,
  };
}

/**
 * Calculate subtotal for a single line item
 */
export function calcItemSubtotal(price: number, qty: number): number {
  return Math.round(price * qty * 100) / 100;
}

/**
 * Generate bill number in format YYYY-NNN
 * Only counts bills with source='created' (excludes imports)
 */
export function formatBillNumber(year: number, sequence: number): string {
  return `${year}-${String(sequence).padStart(3, '0')}`;
}

/**
 * Get Italian month names for period display
 */
const MONTHS_IT = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

/**
 * Generate period string from date
 * e.g., "Gennaio 2026"
 */
export function getPeriodFromDate(date: Date): string {
  return `${MONTHS_IT[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Get balance (remaining amount due)
 */
export function getBalance(total: number, paidAmount: number | null): number {
  return Math.round((total - (paidAmount ?? 0)) * 100) / 100;
}
