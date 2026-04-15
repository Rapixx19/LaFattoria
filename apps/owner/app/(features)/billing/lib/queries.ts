import { createServerClient } from '@/lib/supabase/server';
import type { Bill, BillFilters, Client, Service } from './types';

interface BillWithClient extends Bill {
  clients: { id: string; name: string } | null;
}

/**
 * Get all bills with optional filters
 */
export async function getBills(filters: BillFilters = {}): Promise<BillWithClient[]> {
  const supabase = await createServerClient();

  let query = supabase
    .from('bills')
    .select(`
      *,
      clients (
        id,
        name
      )
    `)
    .order('date', { ascending: false });

  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters.year) {
    query = query.eq('year', filters.year);
  }

  if (filters.clientId) {
    query = query.eq('client_id', filters.clientId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data ?? []) as unknown as BillWithClient[];
}

/**
 * Get a single bill by ID
 */
export async function getBillById(id: string): Promise<Bill | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('bills')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as unknown as Bill;
}

/**
 * Get all active clients for dropdown
 */
export async function getClients(): Promise<Client[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('active', true)
    .order('name');

  if (error) throw error;
  return (data ?? []) as unknown as Client[];
}

/**
 * Get all active services for line item selection
 */
export async function getServices(): Promise<Service[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('sort_order');

  if (error) throw error;
  return (data ?? []) as unknown as Service[];
}

/**
 * Get the next bill number for a given year
 * Only counts bills with source='created' (excludes imports)
 */
export async function getNextBillNumber(year: number): Promise<string> {
  const supabase = await createServerClient();

  const { count, error } = await supabase
    .from('bills')
    .select('*', { count: 'exact', head: true })
    .eq('year', year)
    .eq('source', 'created');

  if (error) throw error;

  const sequence = (count ?? 0) + 1;
  return `${year}-${String(sequence).padStart(3, '0')}`;
}

/**
 * Get available years for filtering
 */
export async function getAvailableYears(): Promise<number[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('bills')
    .select('year');

  if (error) throw error;

  if (!data || data.length === 0) return [new Date().getFullYear()];
  const bills = data as unknown as { year: number }[];
  const years = [...new Set(bills.map((b) => b.year))].sort((a, b) => b - a);
  return years;
}
