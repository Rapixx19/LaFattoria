/**
 * Shared type definitions for La Fattoria
 */

// Bill/Invoice status
export type BillStatus = 'pending' | 'paid' | 'overdue';

// Booking status
export type BookingStatus =
  | 'requested'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

// User roles
export type UserRole = 'owner' | 'trainer' | 'client';

// Service categories (article numbers from Swiss accounting)
export type ServiceCategory =
  | '3210' // Pensione
  | '3211' // Monta
  | '3212' // Lezione
  | '3214' // Trasporti
  | '3218'; // Giostra

// Invoice line item
export interface InvoiceLineItem {
  id: string;
  articleCode: ServiceCategory;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Invoice totals
export interface InvoiceTotals {
  subtotal: number;
  previousBalance: number;
  payments: number;
  total: number;
}

// Horse status
export type HorseStatus = 'active' | 'inactive' | 'retired';

// Booking type
export type BookingType =
  | 'lesson' // Lezione
  | 'training' // Allenamento
  | 'competition' // Gara
  | 'grooming' // Giostra
  | 'transport'; // Trasporto

// Month names in Italian
export const MONTHS_IT = [
  'Gennaio',
  'Febbraio',
  'Marzo',
  'Aprile',
  'Maggio',
  'Giugno',
  'Luglio',
  'Agosto',
  'Settembre',
  'Ottobre',
  'Novembre',
  'Dicembre',
] as const;

// Day names in Italian
export const DAYS_IT = [
  'Domenica',
  'Lunedì',
  'Martedì',
  'Mercoledì',
  'Giovedì',
  'Venerdì',
  'Sabato',
] as const;

export const DAYS_SHORT_IT = ['Do', 'Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa'] as const;
