import type { Tables } from '@lafattoria/supabase';

export type Client = Tables<'clients'>;
export type Horse = Tables<'horses'>;

export interface ClientStats {
  totalPaid: number;
  outstanding: number;
  billCount: number;
  lastBillDate: string | null;
}

export interface ClientWithStats extends Client {
  horses: Horse[];
  stats: ClientStats;
}

export interface ClientFilters {
  status?: 'all' | 'active' | 'inactive';
  search?: string;
}

export interface SpendData {
  month: string;
  year: number;
  monthIndex: number;
  invoiced: number;
  paid: number;
}

export interface UpdateClientInput {
  id: string;
  name: string;
  address: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  active: boolean;
}

export interface CreateClientInput {
  name: string;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
}
