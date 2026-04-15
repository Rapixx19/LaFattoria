import { createServerClient } from '@/lib/supabase/server';
import type { Service } from './types';

/**
 * Get all services (including inactive) ordered by sort_order
 */
export async function getAllServices(): Promise<Service[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('sort_order');

  if (error) throw error;
  return (data ?? []) as unknown as Service[];
}

/**
 * Get a single service by ID
 */
export async function getServiceById(id: string): Promise<Service | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as unknown as Service;
}

/**
 * Get the next custom art code (C001, C002, etc.)
 */
export async function getNextArtCode(): Promise<string> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('services')
    .select('art_code')
    .like('art_code', 'C%')
    .order('art_code', { ascending: false })
    .limit(1);

  if (error) throw error;

  if (!data || data.length === 0) {
    return 'C001';
  }

  const lastCode = (data[0] as unknown as { art_code: string }).art_code;
  const lastNum = parseInt(lastCode.substring(1), 10);
  const nextNum = lastNum + 1;
  return `C${String(nextNum).padStart(3, '0')}`;
}
