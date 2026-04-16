import Link from 'next/link';
import type { ScheduleBooking } from '../lib/types';
import { getBlockPosition, getSessionColor } from '../lib/types';

interface SessionBlockProps {
  booking: ScheduleBooking;
}

export function SessionBlock({ booking }: SessionBlockProps) {
  const { top, height } = getBlockPosition(
    booking.scheduled_time,
    booking.duration_minutes
  );

  const serviceName = booking.services?.name ?? 'Sessione';
  const color = getSessionColor(serviceName);
  const clientName = booking.clients?.name ?? '—';
  const horseName = booking.horses?.name;

  const label = horseName
    ? `${serviceName} - ${clientName} - ${horseName}`
    : `${serviceName} - ${clientName}`;

  return (
    <Link
      href={`/richieste/${booking.id}`}
      className="absolute left-1 right-1 overflow-hidden rounded-sm px-2 py-1 text-white transition-opacity hover:opacity-90"
      style={{
        top,
        height: Math.max(height, 24),
        backgroundColor: color,
      }}
    >
      <div className="truncate text-sm font-medium">{label}</div>
      {height >= 40 && (
        <div className="truncate text-xs opacity-80">
          {booking.scheduled_time.slice(0, 5)} ({booking.duration_minutes} min)
        </div>
      )}
    </Link>
  );
}
