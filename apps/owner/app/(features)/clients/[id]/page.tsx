import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { getClientWithStats, getClientBills, getClientSpendData } from '../lib/queries';
import { ProfileCard } from './components/profile-card';
import { BillHistory } from './components/bill-history';
import { SpendChart } from './components/spend-chart';
import { EditButton } from './components/edit-button';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function ClientProfilePage({ params, searchParams }: PageProps) {
  await requireAuth();

  const { id } = await params;
  const { tab = 'fatture' } = await searchParams;

  const client = await getClientWithStats(id);

  if (!client) {
    notFound();
  }

  const [bills, spendData] = await Promise.all([
    getClientBills(id),
    getClientSpendData(id),
  ]);

  return (
    <main className="min-h-screen bg-cream">
      <header className="bg-primary px-4 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/clients"
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
              <h1 className="font-display text-lg font-bold">{client.name}</h1>
              <p className="text-sm text-primary-light">Profilo cliente</p>
            </div>
          </div>
          <EditButton client={client} />
        </div>
      </header>

      <div className="p-4">
        <ProfileCard client={client} />

        {/* Tabs */}
        <div className="mt-4 flex gap-2 border-b border-border">
          <Link
            href={`/clients/${id}?tab=fatture`}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'fatture'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-foreground'
            }`}
          >
            Fatture
          </Link>
          <Link
            href={`/clients/${id}?tab=analisi`}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'analisi'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-foreground'
            }`}
          >
            Analisi
          </Link>
        </div>

        {/* Tab content */}
        <div className="mt-4">
          {tab === 'fatture' && (
            <BillHistory bills={bills} clientId={id} />
          )}
          {tab === 'analisi' && (
            <SpendChart data={spendData} />
          )}
        </div>
      </div>
    </main>
  );
}
