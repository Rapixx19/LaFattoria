import type { ScheduleBooking } from '../lib/types';
import { TIMELINE_START, TIMELINE_END, HOUR_HEIGHT } from '../lib/types';
import { SessionBlock } from './session-block';

interface TimelineProps {
  bookings: ScheduleBooking[];
}

function generateHours(): string[] {
  const hours: string[] = [];
  for (let h = TIMELINE_START; h <= TIMELINE_END; h++) {
    hours.push(`${String(h).padStart(2, '0')}:00`);
  }
  return hours;
}

export function Timeline({ bookings }: TimelineProps) {
  const hours = generateHours();
  const totalHeight = (TIMELINE_END - TIMELINE_START + 1) * HOUR_HEIGHT;

  return (
    <div className="rounded-sm border bg-white">
      <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
        <div className="relative" style={{ height: totalHeight }}>
          {/* Hour lines */}
          {hours.map((hour, i) => (
            <div
              key={hour}
              className="absolute left-0 right-0 flex border-b border-border/50"
              style={{ top: i * HOUR_HEIGHT, height: HOUR_HEIGHT }}
            >
              <div className="w-14 shrink-0 border-r bg-cream px-2 py-1 text-xs text-muted">
                {hour}
              </div>
              <div className="flex-1" />
            </div>
          ))}

          {/* Session blocks */}
          <div className="absolute inset-0 left-14">
            {bookings.map((booking) => (
              <SessionBlock key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
