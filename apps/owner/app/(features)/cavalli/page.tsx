import { requireAuth } from '@/lib/auth';
import { getHorses, getClientsForSelect } from './lib/queries';
import { HorseList } from './components/horse-list';
import { HorseFilters } from './components/horse-filters';
import { AddHorseButton } from './components/add-horse-button';
import type { HorseStatus } from './lib/types';

interface PageProps {
  searchParams: Promise<{ status?: string; clientId?: string }>;
}

export default async function CavalliPage({ searchParams }: PageProps) {
  await requireAuth();

  const { status, clientId } = await searchParams;

  const filters = {
    status: (status as HorseStatus | 'all') || 'all',
    clientId: clientId || undefined,
  };

  const [horses, clients] = await Promise.all([
    getHorses(filters),
    getClientsForSelect(),
  ]);

  return (
    <main className="min-h-screen bg-cream">
      <header className="bg-primary px-4 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-lg font-bold">Cavalli</h1>
            <p className="text-sm text-primary-light">
              {horses.length} cavall{horses.length === 1 ? 'o' : 'i'} registrat{horses.length === 1 ? 'o' : 'i'}
            </p>
          </div>
          <AddHorseButton clients={clients} />
        </div>
      </header>

      <div className="p-4">
        <HorseFilters
          clients={clients}
          currentStatus={filters.status}
          currentClientId={filters.clientId}
        />

        <div className="mt-4">
          <HorseList horses={horses} />
        </div>
      </div>
    </main>
  );
}
