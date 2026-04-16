import { requireAuth } from '@/lib/auth';
import { fmtDate } from '@lafattoria/utils';
import { getScheduleForDate } from './lib/queries';
import { DayStrip } from './components/day-strip';
import { Timeline } from './components/timeline';
import { PrintButton } from './components/print-button';
import { PrintSheet } from './components/print-sheet';

interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export default async function SchedulePage({ searchParams }: PageProps) {
  await requireAuth();

  const params = await searchParams;
  const selectedDate = params.date ?? getTodayISO();
  const bookings = await getScheduleForDate(selectedDate);

  return (
    <main className="min-h-screen bg-cream">
      <header className="bg-primary px-4 py-4 text-white print:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-lg font-bold">Agenda</h1>
            <p className="text-sm text-primary-light">{fmtDate(selectedDate)}</p>
          </div>
          <PrintButton />
        </div>
      </header>

      <div className="print:hidden">
        <DayStrip selectedDate={selectedDate} />
      </div>

      <div className="p-4 print:hidden">
        {bookings.length === 0 ? (
          <div className="rounded-sm border bg-white p-8 text-center">
            <p className="text-muted">Nessuna sessione programmata per questa data</p>
          </div>
        ) : (
          <Timeline bookings={bookings} />
        )}
      </div>

      {/* Print-only sheet */}
      <PrintSheet bookings={bookings} date={selectedDate} />
    </main>
  );
}
