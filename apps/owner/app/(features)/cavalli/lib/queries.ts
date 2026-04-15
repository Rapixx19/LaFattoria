import { createServerClient } from '@/lib/supabase/server';
import type { HorseWithClient, HorseFilters } from './types';

const HORSE_SELECT = `
  *,
  clients (id, name)
`;

export async function getHorses(
  filters: HorseFilters = {}
): Promise<HorseWithClient[]> {
  const supabase = await createServerClient();

  let query = supabase
    .from('horses')
    .select(HORSE_SELECT)
    .order('name');

  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters.clientId) {
    query = query.eq('client_id', filters.clientId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data ?? []) as unknown as HorseWithClient[];
}

export async function getHorseById(id: string): Promise<HorseWithClient | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('horses')
    .select(HORSE_SELECT)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as unknown as HorseWithClient;
}

export async function getHorseBookings(horseId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      scheduled_date,
      scheduled_time,
      status,
      services (id, name)
    `)
    .eq('horse_id', horseId)
    .order('scheduled_date', { ascending: false })
    .order('scheduled_time', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getClientsForSelect(): Promise<{ id: string; name: string }[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('clients')
    .select('id, name')
    .eq('active', true)
    .order('name');

  if (error) throw error;
  return (data ?? []) as { id: string; name: string }[];
}

export async function getHorseCount(): Promise<number> {
  const supabase = await createServerClient();

  const { count, error } = await supabase
    .from('horses')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count ?? 0;
}
