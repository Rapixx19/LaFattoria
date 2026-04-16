/**
 * Schedule types for La Fattoria
 */

export interface ScheduleBooking {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  status: 'confirmed' | 'completed';
  clients: { id: string; name: string } | null;
  services: { id: string; name: string } | null;
  horses: { id: string; name: string } | null;
  profiles: { id: string; name: string } | null;
}

export interface TimeSlot {
  time: string;
  label: string;
}

/**
 * Session colors by service type
 */
export const SESSION_COLORS: Record<string, string> = {
  lezione: '#4A90D9',     // blue
  monta: '#2D4A22',       // green (primary)
  corda: '#8B6914',       // amber
  trasporto: '#5C4A8B',   // purple
  concorso: '#1A3A5C',    // dark blue
  default: '#75706A',     // muted
};

export function getSessionColor(serviceName: string): string {
  const key = serviceName.toLowerCase().split(' ')[0];
  return SESSION_COLORS[key] ?? SESSION_COLORS.default;
}

/**
 * Timeline constants
 */
export const TIMELINE_START = 6;  // 06:00
export const TIMELINE_END = 20;   // 20:00
export const HOUR_HEIGHT = 60;    // px per hour

/**
 * Calculate block position on timeline
 */
export function getBlockPosition(time: string, durationMin: number) {
  const [hours, minutes] = time.split(':').map(Number);
  const startOffset = (hours - TIMELINE_START) * HOUR_HEIGHT + (minutes / 60) * HOUR_HEIGHT;
  const height = (durationMin / 60) * HOUR_HEIGHT;
  return { top: startOffset, height };
}
