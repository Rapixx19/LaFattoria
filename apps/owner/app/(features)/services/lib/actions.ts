'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import type { Service, PriceHistoryEntry, UpdateServiceInput, CreateServiceInput, ListinoDefault } from './types';
import { getServiceById } from './queries';

/**
 * Update an existing service
 * Tracks price history if price changes
 */
export async function updateService(input: UpdateServiceInput): Promise<Service> {
  const supabase = await createServerClient();

  // Get current service to check price change
  const current = await getServiceById(input.id);
  if (!current) {
    throw new Error('Servizio non trovato');
  }

  let priceHistory = (current.price_history ?? []) as unknown as PriceHistoryEntry[];

  // If price changed, add to history
  if (current.price !== input.price) {
    const entry: PriceHistoryEntry = {
      price: current.price,
      changedAt: new Date().toISOString(),
    };
    priceHistory = [...priceHistory, entry];
  }

  const updateData = {
    art_code: input.art_code,
    name: input.name,
    unit: input.unit,
    price: input.price,
    vat_rate: input.vat_rate,
    price_history: priceHistory,
  };

  const { data, error } = await supabase
    .from('services')
    .update(updateData as never)
    .eq('id', input.id)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Errore nell'aggiornamento del servizio: ${error?.message ?? 'Unknown error'}`);
  }

  revalidatePath('/services');
  revalidatePath('/billing');
  revalidatePath('/billing/new');
  return data as unknown as Service;
}

/**
 * Toggle service active status
 */
export async function toggleServiceActive(id: string, active: boolean): Promise<Service> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('services')
    .update({ active } as never)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Errore nel cambio stato servizio: ${error?.message ?? 'Unknown error'}`);
  }

  revalidatePath('/services');
  revalidatePath('/billing');
  revalidatePath('/billing/new');
  return data as unknown as Service;
}

/**
 * Create a new custom service
 */
export async function createService(input: CreateServiceInput): Promise<Service> {
  const supabase = await createServerClient();

  // Get max sort_order
  const { data: sortOrderData } = await supabase
    .from('services')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1);

  const maxSortOrder = (sortOrderData?.[0] as unknown as { sort_order: number } | undefined)?.sort_order ?? 0;

  const insertData = {
    art_code: input.art_code,
    name: input.name,
    unit: input.unit,
    price: input.price,
    vat_rate: input.vat_rate,
    is_custom: true,
    active: true,
    price_history: [],
    sort_order: maxSortOrder + 1,
  };

  const { data, error } = await supabase
    .from('services')
    .insert(insertData as never)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Errore nella creazione del servizio: ${error?.message ?? 'Unknown error'}`);
  }

  revalidatePath('/services');
  revalidatePath('/billing');
  revalidatePath('/billing/new');
  return data as unknown as Service;
}

/**
 * Reset non-custom services to listino defaults
 */
export async function resetToListino(): Promise<void> {
  const supabase = await createServerClient();

  // Import defaults dynamically to avoid circular dependency
  const { LISTINO_DEFAULTS } = await import('./types');

  // Get all non-custom services
  const { data: services, error: fetchError } = await supabase
    .from('services')
    .select('*')
    .eq('is_custom', false);

  if (fetchError) throw fetchError;

  // Update each service to match its default
  for (const service of (services ?? []) as unknown as Service[]) {
    const defaultMatch = LISTINO_DEFAULTS.find(
      (d: ListinoDefault) => d.art_code === service.art_code && d.name === service.name && d.unit === service.unit
    );

    if (defaultMatch) {
      // Track price change if different
      let priceHistory = (service.price_history ?? []) as unknown as PriceHistoryEntry[];
      if (service.price !== defaultMatch.price) {
        const entry: PriceHistoryEntry = {
          price: service.price,
          changedAt: new Date().toISOString(),
        };
        priceHistory = [...priceHistory, entry];
      }

      const { error } = await supabase
        .from('services')
        .update({
          price: defaultMatch.price,
          vat_rate: defaultMatch.vat_rate,
          price_history: priceHistory,
          active: true,
        } as never)
        .eq('id', service.id);

      if (error) throw error;
    }
  }

  revalidatePath('/services');
  revalidatePath('/billing');
  revalidatePath('/billing/new');
}
