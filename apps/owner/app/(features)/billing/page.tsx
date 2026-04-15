import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { getBills, getClients, getAvailableYears } from './lib/queries';
import { BillFilters } from './components/bill-filters';
import { BillList } from './components/bill-list';
import type { BillFilters as BillFiltersType } from './lib/types';

interface PageProps {
  searchParams: Promise<{
    status?: string;
    year?: string;
    clientId?: string;
  }>;
}

export default async function BillingPage({ searchParams }: PageProps) {
  await requireAuth();

  const params = await searchParams;
  const filters: BillFiltersType = {
    status: (params.status as BillFiltersType['status']) ?? 'all',
    year: params.year ? parseInt(params.year, 10) : undefined,
    clientId: params.clientId,
  };

  const [bills, clients, years] = await Promise.all([
    getBills(filters),
    getClients(),
    getAvailableYears(),
  ]);

  return (
    <main className="min-h-screen bg-cream">
      <header className="bg-primary px-4 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-lg font-bold">Fatturazione</h1>
            <p className="text-sm text-primary-light">Gestione fatture</p>
          </div>
          <Link
            href="/billing/new"
            className="rounded-sm bg-white px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-cream active:scale-[0.97]"
          >
            + Nuova Fattura
          </Link>
        </div>
      </header>

      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <BillFilters clients={clients} years={years} />
          <span className="text-sm text-muted">
            {bills.length} fattur{bills.length === 1 ? 'a' : 'e'}
          </span>
        </div>

        <BillList bills={bills} />
      </div>
    </main>
  );
}
