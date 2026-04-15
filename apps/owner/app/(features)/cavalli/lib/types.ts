import type { Tables } from '@lafattoria/supabase';

export type Horse = Tables<'horses'>;

export type HorseStatus = 'active' | 'rest' | 'competition' | 'sold';

export interface HorseWithClient {
  id: string;
  name: string;
  breed: string | null;
  client_id: string;
  stall: string | null;
  status: HorseStatus;
  diet_notes: string | null;
  vet_notes: string | null;
  farrier_date: string | null;
  photo_url: string | null;
  created_at: string;
  clients: { id: string; name: string } | null;
}

export interface HorseFilters {
  status?: 'all' | HorseStatus;
  clientId?: string;
}

export interface CreateHorseInput {
  name: string;
  breed?: string | null;
  client_id: string;
  stall?: string | null;
  status?: HorseStatus;
  diet_notes?: string | null;
  vet_notes?: string | null;
  farrier_date?: string | null;
}

export interface UpdateHorseInput {
  id: string;
  name: string;
  breed: string | null;
  client_id: string;
  stall: string | null;
  status: HorseStatus;
  diet_notes: string | null;
  vet_notes: string | null;
  farrier_date: string | null;
}

export const STATUS_STYLES = {
  active: 'bg-paid-bg text-paid',
  rest: 'bg-pending-bg text-pending',
  competition: 'bg-primary/10 text-primary',
  sold: 'bg-overdue-bg text-overdue',
} as const;

export const STATUS_LABELS = {
  active: 'Attivo',
  rest: 'Riposo',
  competition: 'Gara',
  sold: 'Venduto',
} as const;
