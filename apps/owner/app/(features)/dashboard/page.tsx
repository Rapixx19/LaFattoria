import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { Logo } from '@/components/ui/logo';

const ROLE_LABELS: Record<string, string> = {
  owner: 'Proprietario',
  trainer: 'Istruttore',
  client: 'Cliente',
};

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <main className="min-h-screen bg-cream">
      <header className="bg-primary px-4 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-lg font-bold">La Fattoria</h1>
            <p className="text-sm text-primary-light">Gestione Stalla</p>
          </div>
          <Link
            href="/logout"
            className="rounded-sm bg-white/10 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/20"
          >
            Esci
          </Link>
        </div>
      </header>

      <div className="p-4">
        <div className="rounded-lg border border-border bg-white p-6 shadow-md">
          <div className="mb-4 flex justify-center">
            <Logo width={120} />
          </div>
          <h2 className="font-display text-xl font-bold text-primary">
            Benvenuto, {user.name}
          </h2>
          <p className="mt-2 text-muted">
            Ruolo: {ROLE_LABELS[user.role] || user.role}
          </p>
          <p className="mt-1 text-sm text-muted">
            {user.email}
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-4 grid gap-3">
          <Link
            href="/billing"
            className="flex items-center justify-between rounded-lg border border-border bg-white p-4 shadow-sm transition-all hover:border-primary hover:shadow-md"
          >
            <div>
              <h3 className="font-display font-bold text-primary">Fatturazione</h3>
              <p className="text-sm text-muted">Gestisci fatture e pagamenti</p>
            </div>
            <span className="text-2xl">📄</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
