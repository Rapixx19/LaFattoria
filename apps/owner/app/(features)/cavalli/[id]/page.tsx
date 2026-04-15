import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { getHorseById, getHorseBookings, getClientsForSelect } from '../lib/queries';
import { HorseCard } from './components/horse-card';
import { HealthNotes } from './components/health-notes';
import { BookingHistory } from './components/booking-history';
import { EditButton } from './components/edit-button';
import { StatusSelect } from './components/status-select';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function HorseDetailPage({ params, searchParams }: PageProps) {
  await requireAuth();

  const { id } = await params;
  const { tab = 'salute' } = await searchParams;

  const horse = await getHorseById(id);

  if (!horse) {
    notFound();
  }

  const [bookings, clients] = await Promise.all([
    getHorseBookings(id),
    getClientsForSelect(),
  ]);

  return (
    <main className="min-h-screen bg-cream">
      <header className="bg-primary px-4 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/cavalli"
              className="rounded-sm p-1 transition-colors hover:bg-white/10"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <div>
              <h1 className="font-display text-lg font-bold">{horse.name}</h1>
              <p className="text-sm text-primary-light">Profilo cavallo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusSelect horse={horse} />
            <EditButton horse={horse} clients={clients} />
          </div>
        </div>
      </header>

      <div className="p-4">
        <HorseCard horse={horse} />

        {/* Tabs */}
        <div className="mt-4 flex gap-2 border-b border-border">
          <Link
            href={`/cavalli/${id}?tab=salute`}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'salute'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-foreground'
            }`}
          >
            Salute
          </Link>
          <Link
            href={`/cavalli/${id}?tab=prenotazioni`}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'prenotazioni'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-foreground'
            }`}
          >
            Prenotazioni
          </Link>
        </div>

        {/* Tab content */}
        <div className="mt-4">
          {tab === 'salute' && <HealthNotes horse={horse} />}
          {tab === 'prenotazioni' && <BookingHistory bookings={bookings} />}
        </div>
      </div>
    </main>
  );
}
