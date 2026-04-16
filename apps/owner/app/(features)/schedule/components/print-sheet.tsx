import type { ScheduleBooking } from '../lib/types';
import { fmtDate, getDayName } from '@lafattoria/utils';

interface PrintSheetProps {
  bookings: ScheduleBooking[];
  date: string;
}

export function PrintSheet({ bookings, date }: PrintSheetProps) {
  const dayName = getDayName(date);
  const formattedDate = fmtDate(date);

  return (
    <div className="hidden print:block print:p-8">
      {/* Header */}
      <div className="mb-6 border-b-2 border-black pb-4 text-center">
        <h1 className="text-xl font-bold">LA FATTORIA — AGENDA</h1>
        <p className="mt-1 text-lg">
          {dayName} {formattedDate}
        </p>
      </div>

      {/* Session List */}
      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">
          Nessuna sessione programmata per questa data
        </p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <PrintSessionRow key={booking.id} booking={booking} />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 border-t-2 border-black pt-4 text-center text-sm text-gray-500">
        Stampato il {fmtDate(new Date())}
      </div>
    </div>
  );
}

function PrintSessionRow({ booking }: { booking: ScheduleBooking }) {
  const time = booking.scheduled_time.slice(0, 5);
  const serviceName = booking.services?.name ?? 'Sessione';
  const clientName = booking.clients?.name ?? '—';
  const horseName = booking.horses?.name;
  const trainerName = booking.profiles?.name;

  return (
    <div className="border-b border-gray-200 pb-3">
      <div className="flex items-baseline gap-4">
        <span className="w-16 font-mono font-bold">{time}</span>
        <span className="font-medium">
          {serviceName} ({booking.duration_minutes} min)
        </span>
      </div>
      <div className="ml-20 space-y-0.5 text-sm text-gray-700">
        <p>Cliente: {clientName}</p>
        {horseName && <p>Cavallo: {horseName}</p>}
        {trainerName && <p>Istruttore: {trainerName}</p>}
      </div>
    </div>
  );
}
