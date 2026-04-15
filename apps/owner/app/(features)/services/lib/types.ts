import type { Tables } from '@lafattoria/supabase';

export type Service = Tables<'services'>;

export interface PriceHistoryEntry {
  price: number;
  changedAt: string;
}

export interface UpdateServiceInput {
  id: string;
  art_code: string;
  name: string;
  unit: string;
  price: number;
  vat_rate: number;
}

export interface CreateServiceInput {
  art_code: string;
  name: string;
  unit: string;
  price: number;
  vat_rate: number;
}

export const VAT_OPTIONS = [
  { value: 0, label: '0%' },
  { value: 2.6, label: '2.6%' },
  { value: 8.1, label: '8.1%' },
] as const;

export interface ListinoDefault {
  art_code: string;
  name: string;
  unit: string;
  price: number;
  vat_rate: number;
}

export const LISTINO_DEFAULTS: ListinoDefault[] = [
  { art_code: '3210', name: 'Pensione', unit: 'al mese', price: 1365, vat_rate: 8.1 },
  { art_code: '3218', name: 'Giostra', unit: 'per mese', price: 225, vat_rate: 8.1 },
  { art_code: '3218', name: 'Giostra', unit: 'al giorno', price: 25, vat_rate: 8.1 },
  { art_code: '3222', name: 'Pascoli', unit: 'per anno', price: 1900, vat_rate: 8.1 },
  { art_code: '3222', name: 'Pascoli', unit: 'al mese', price: 190, vat_rate: 8.1 },
  { art_code: '3221', name: 'Pensione al prato', unit: 'al mese', price: 325, vat_rate: 8.1 },
  { art_code: '3216', name: 'Preparazione cavallo', unit: 'a volta', price: 25, vat_rate: 2.6 },
  { art_code: '3212', name: 'Lezione privata (GA)', unit: '50 min', price: 75, vat_rate: 0 },
  { art_code: '3213', name: 'Lavoro alla corda', unit: '40 min', price: 43, vat_rate: 2.6 },
  { art_code: '3211', name: 'Monta montata (GA)', unit: '50 min', price: 75, vat_rate: 2.6 },
  { art_code: '3214', name: 'Trasporto – Lombardia', unit: 'corsa', price: 380, vat_rate: 8.1 },
  { art_code: '3214', name: 'Trasporto – Ticino', unit: 'corsa', price: 160, vat_rate: 8.1 },
  { art_code: '3214', name: 'Trasporto – Svizzera', unit: 'corsa', price: 380, vat_rate: 8.1 },
  { art_code: '3215', name: 'Assistenza concorsi', unit: 'per gara', price: 30, vat_rate: 0 },
  { art_code: '3211', name: 'Monta a concorso', unit: 'per gara', price: 75, vat_rate: 2.6 },
  { art_code: '3215', name: 'Scuderia a concorso', unit: 'al giorno', price: 35, vat_rate: 8.1 },
  { art_code: '3216', name: 'Preparazione a concorso', unit: 'a volta', price: 25, vat_rate: 8.1 },
  { art_code: '3217', name: 'Tosatura completa', unit: 'a volta', price: 120, vat_rate: 8.1 },
  { art_code: '3219', name: 'Lavatrice', unit: 'utilizzo', price: 25, vat_rate: 8.1 },
  { art_code: '3220', name: 'Assistenza vet./maniscalco', unit: 'a volta', price: 45, vat_rate: 2.6 },
];
