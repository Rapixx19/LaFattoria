import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { getAllServices, getNextArtCode } from './lib/queries';
import { ServiceRow } from './components/service-row';
import { AddServiceButton } from './components/add-service-form';
import { ResetListinoButton } from './components/reset-listino-button';

export default async function ServicesPage() {
  await requireAuth();

  const [services, nextArtCode] = await Promise.all([
    getAllServices(),
    getNextArtCode(),
  ]);

  return (
    <main className="min-h-screen bg-cream">
      <header className="bg-primary px-4 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-lg font-bold">Servizi</h1>
            <p className="text-sm text-primary-light">
              {services.length} servizi nel listino
            </p>
          </div>
          <div className="flex gap-2">
            <ResetListinoButton />
            <AddServiceButton suggestedArtCode={nextArtCode} />
          </div>
        </div>
      </header>

      <div className="p-4">
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-border bg-cream">
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase text-muted">
                    Art.
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase text-muted">
                    Nome
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium uppercase text-muted">
                    Unità
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium uppercase text-muted">
                    Prezzo CHF
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium uppercase text-muted">
                    IVA
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium uppercase text-muted">
                    Attivo
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium uppercase text-muted">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <ServiceRow key={service.id} service={service} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4">
          <Link
            href="/dashboard"
            className="text-sm text-muted hover:text-primary"
          >
            &larr; Torna al dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
