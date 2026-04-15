import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { getClientsWithStats } from './lib/queries';
import { ClientRow } from './components/client-row';

const MAX_SLOTS = 20;

export default async function ClientsPage() {
  await requireAuth();

  const clients = await getClientsWithStats({ status: 'all' });
  const emptySlots = Math.max(0, MAX_SLOTS - clients.length);

  return (
    <main className="min-h-screen bg-cream">
      <header className="bg-primary px-4 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-lg font-bold">Clienti</h1>
            <p className="text-sm text-primary-light">
              {clients.length}/{MAX_SLOTS} posti occupati
            </p>
          </div>
          {clients.length < MAX_SLOTS && (
            <Link
              href="/clients/new"
              className="rounded-sm bg-white px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-cream active:scale-[0.97]"
            >
              + Aggiungi
            </Link>
          )}
        </div>
      </header>

      <div className="p-4">
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-cream">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted">
                  Cavallo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted">
                  Da pagare
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted">
                  Ultima fattura
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-muted">
                  Stato
                </th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <ClientRow key={client.id} client={client} />
              ))}
              {Array.from({ length: emptySlots }).map((_, i) => (
                <tr
                  key={`empty-${i}`}
                  className="border-b border-border last:border-b-0"
                >
                  <td
                    colSpan={5}
                    className="px-4 py-3 text-center text-sm italic text-muted"
                  >
                    — vuoto —
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
