import Link from 'next/link';
import { fmtDateShort } from '@lafattoria/utils/formatters';

interface Booking {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  services: { id: string; name: string } | null;
}

interface BookingHistoryProps {
  bookings: Booking[];
}

const STATUS_STYLES = {
  requested: 'bg-pending-bg text-pending',
  confirmed: 'bg-primary/10 text-primary',
  completed: 'bg-paid-bg text-paid',
  cancelled: 'bg-overdue-bg text-overdue',
} as const;

const STATUS_LABELS = {
  requested: 'Richiesta',
  confirmed: 'Confermata',
  completed: 'Completata',
  cancelled: 'Cancellata',
} as const;

export function BookingHistory({ bookings }: BookingHistoryProps) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-white p-8 text-center">
        <p className="text-muted">Nessuna prenotazione per questo cavallo</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-cream">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted">
              Data
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted">
              Servizio
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium uppercase text-muted">
              Stato
            </th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const status = booking.status as keyof typeof STATUS_STYLES;
            return (
              <tr
                key={booking.id}
                className="border-b border-border last:border-b-0 hover:bg-cream/50"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/richieste/${booking.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {fmtDateShort(booking.scheduled_date)}
                  </Link>
                  <p className="text-sm text-muted">
                    {booking.scheduled_time.slice(0, 5)}
                  </p>
                </td>
                <td className="px-4 py-3 text-sm">
                  {booking.services?.name ?? '—'}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? ''}`}
                  >
                    {STATUS_LABELS[status] ?? status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
