'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import type { CreateHorseInput, UpdateHorseInput, HorseStatus, Horse } from './types';

export async function createHorse(input: CreateHorseInput): Promise<Horse> {
  const supabase = await createServerClient();

  const insertData = {
    name: input.name,
    breed: input.breed ?? null,
    client_id: input.client_id,
    stall: input.stall ?? null,
    status: input.status ?? 'active',
    diet_notes: input.diet_notes ?? null,
    vet_notes: input.vet_notes ?? null,
    farrier_date: input.farrier_date ?? null,
  };

  const { data, error } = await supabase
    .from('horses')
    .insert(insertData as never)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Errore nella creazione del cavallo: ${error?.message ?? 'Unknown error'}`);
  }

  revalidatePath('/cavalli');
  return data as unknown as Horse;
}

export async function updateHorse(input: UpdateHorseInput): Promise<Horse> {
  const supabase = await createServerClient();

  const updateData = {
    name: input.name,
    breed: input.breed,
    client_id: input.client_id,
    stall: input.stall,
    status: input.status,
    diet_notes: input.diet_notes,
    vet_notes: input.vet_notes,
    farrier_date: input.farrier_date,
  };

  const { data, error } = await supabase
    .from('horses')
    .update(updateData as never)
    .eq('id', input.id)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Errore nell'aggiornamento del cavallo: ${error?.message ?? 'Unknown error'}`);
  }

  revalidatePath('/cavalli');
  revalidatePath(`/cavalli/${input.id}`);
  return data as unknown as Horse;
}

export async function updateHorseStatus(
  id: string,
  status: HorseStatus
): Promise<Horse> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('horses')
    .update({ status } as never)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Errore nel cambio stato: ${error?.message ?? 'Unknown error'}`);
  }

  revalidatePath('/cavalli');
  revalidatePath(`/cavalli/${id}`);
  return data as unknown as Horse;
}
