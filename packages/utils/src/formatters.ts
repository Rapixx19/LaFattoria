import type { InvoiceLineItem, InvoiceTotals } from './types';
import { MONTHS_IT, DAYS_IT, DAYS_SHORT_IT } from './types';

/**
 * Format a number as Swiss Francs (CHF)
 * @example chf(1234.5) => "CHF 1'234.50"
 */
export function chf(amount: number): string {
  const formatted = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  return `CHF ${formatted}`;
}

/**
 * Format a number as CHF without the prefix
 * @example chfValue(1234.5) => "1'234.50"
 */
export function chfValue(amount: number): string {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

/**
 * Format a date in Italian format
 * @example fmtDate(new Date('2026-04-15')) => "15 Aprile 2026"
 */
export function fmtDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getDate();
  const month = MONTHS_IT[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Format a date in short format
 * @example fmtDateShort(new Date('2026-04-15')) => "15/04/2026"
 */
export function fmtDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format a date as month + year
 * @example fmtMonthYear(new Date('2026-04-15')) => "Aprile 2026"
 */
export function fmtMonthYear(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${MONTHS_IT[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Get day name in Italian
 * @example getDayName(new Date('2026-04-15')) => "Mercoledì"
 */
export function getDayName(date: Date | string, short = false): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return short ? DAYS_SHORT_IT[d.getDay()] : DAYS_IT[d.getDay()];
}

/**
 * Format time (HH:MM)
 * @example fmtTime(new Date()) => "14:30"
 */
export function fmtTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Calculate invoice totals from line items
 */
export function calcTotals(
  lineItems: InvoiceLineItem[],
  previousBalance = 0,
  payments = 0
): InvoiceTotals {
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal + previousBalance - payments;

  return {
    subtotal,
    previousBalance,
    payments,
    total,
  };
}

/**
 * Calculate line item total (quantity * unitPrice)
 */
export function calcLineTotal(quantity: number, unitPrice: number): number {
  return Math.round(quantity * unitPrice * 100) / 100;
}

/**
 * Generate an invoice number
 * Format: YYYY-MM-NNN (e.g., 2026-04-001)
 */
export function generateInvoiceNumber(
  date: Date,
  sequenceNumber: number
): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const seq = String(sequenceNumber).padStart(3, '0');
  return `${year}-${month}-${seq}`;
}

/**
 * Parse an invoice number
 */
export function parseInvoiceNumber(invoiceNumber: string): {
  year: number;
  month: number;
  sequence: number;
} | null {
  const match = invoiceNumber.match(/^(\d{4})-(\d{2})-(\d{3})$/);
  if (!match) return null;

  return {
    year: parseInt(match[1], 10),
    month: parseInt(match[2], 10),
    sequence: parseInt(match[3], 10),
  };
}
