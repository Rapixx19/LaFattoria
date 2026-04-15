import type { Tables } from '@lafattoria/supabase';

export type BillType = 'mensile' | 'extra';
export type BillSource = 'created' | 'imported';
export type BillStatus = 'pending' | 'paid' | 'overdue';

export interface BillItem {
  art: string;
  name: string;
  desc: string;
  unit: string;
  price: number;
  qty: number;
  vat: number;
  subtotal: number;
}

export interface ClientSnapshot {
  name: string;
  address: string | null;
  email: string | null;
  phone: string | null;
}

export interface CreateBillInput {
  type: BillType;
  clientId: string;
  date: string;
  period: string | null;
  items: BillItem[];
  paidAmount: number | null;
  notes: string | null;
}

export interface BillFilters {
  status?: BillStatus | 'all';
  year?: number;
  clientId?: string;
}

export interface BillTotals {
  net: number;
  vatMap: Record<number, number>;
  vatTotal: number;
  total: number;
}

export type Bill = Tables<'bills'>;
export type Client = Tables<'clients'>;
export type Service = Tables<'services'>;

export interface BillWithClient extends Bill {
  clients: Client;
}
