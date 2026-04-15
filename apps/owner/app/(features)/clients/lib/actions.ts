'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import type { UpdateClientInput, CreateClientInput, Client } from './types';

/**
 * Create a new client
 */
export async function createClient(input: CreateClientInput): Promise<Client> {
  const supabase = await createServerClient();

  const insertData = {
    name: input.name,
    address: input.address ?? null,
    email: input.email ?? null,
    phone: input.phone ?? null,
    notes: input.notes ?? null,
    active: true,
  };

  const { data, error } = await supabase
    .from('clients')
    .insert(insertData as never)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Errore nella creazione del cliente: ${error?.message ?? 'Unknown error'}`);
  }

  revalidatePath('/clients');
  return data as unknown as Client;
}

/**
 * Update an existing client
 */
export async function updateClient(input: UpdateClientInput): Promise<Client> {
  const supabase = await createServerClient();

  const updateData = {
    name: input.name,
    address: input.address,
    email: input.email,
    phone: input.phone,
    notes: input.notes,
    active: input.active,
  };

  const { data, error } = await supabase
    .from('clients')
    .update(updateData as never)
    .eq('id', input.id)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Errore nell'aggiornamento del cliente: ${error?.message ?? 'Unknown error'}`);
  }

  revalidatePath('/clients');
  revalidatePath(`/clients/${input.id}`);
  return data as unknown as Client;
}
