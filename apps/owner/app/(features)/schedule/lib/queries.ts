import { createServerClient } from '@/lib/supabase/server';
import type { ScheduleBooking } from './types';

/**
 * Get confirmed/completed bookings for a specific date
 */
export async function getScheduleForDate(date: string): Promise<ScheduleBooking[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id, scheduled_date, scheduled_time, duration_minutes, status,
      clients (id, name),
      services (id, name),
      horses (id, name),
      profiles (id, name)
    `)
    .eq('scheduled_date', date)
    .in('status', ['confirmed', 'completed'])
    .order('scheduled_time', { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as ScheduleBooking[];
}

interface AvailabilitySlot {
  id: string;
  day_of_week: number;
  time_from: string;
  time_to: string;
  is_blocked: boolean;
}

/**
 * Get availability slots for a specific day of week (0-6)
 */
export async function getAvailabilityForDay(dayOfWeek: number): Promise<AvailabilitySlot[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('availability')
    .select('id, day_of_week, time_from, time_to, is_blocked')
    .eq('day_of_week', dayOfWeek)
    .order('time_from', { ascending: true });

  if (error) throw error;
  return (data ?? []) as AvailabilitySlot[];
}
