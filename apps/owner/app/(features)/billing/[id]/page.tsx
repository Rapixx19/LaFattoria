import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { getBillById } from '../lib/queries';
import { calcBillTotals } from '../lib/calc';
import { BillDoc } from './components/bill-doc';
import { MarkPaidForm } from './components/mark-paid-form';
import { PrintButton } from './components/print-button';
import type { BillItem, ClientSnapshot } from '../lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

const STATUS_STYLES = {
  pending: 'bg-status-pending-bg text-status-pending',
  paid: 'bg-status-paid-bg text-status-paid',
  overdue: 'bg-status-overdue-bg text-status-overdue',
} as const;

const STATUS_LABELS = {
  pending: 'In attesa',
  paid: 'Pagata',
  overdue: 'Scaduta',
} as const;

export default async function BillViewPage({ params }: PageProps) {
  await requireAuth();

  const { id } = await params;
  const bill = await getBillById(id);

  if (!bill) {
    notFound();
  }

  const items = bill.items as unknown as BillItem[];
  const client = bill.client_snapshot as unknown as ClientSnapshot;
  const totals = calcBillTotals(items);
  const status = bill.status as keyof typeof STATUS_STYLES;

  return (
    <main className="min-h-screen bg-cream">
      <header className="bg-primary px-4 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/billing"
              className="text-sm text-primary-light hover:underline"
            >
              &larr; Torna alle fatture
            </Link>
            <h1 className="font-display text-lg font-bold">
              Fattura {bill.number}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
            >
              {STATUS_LABELS[status]}
            </span>
            <a
              href={`/api/bills/${bill.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-white px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-cream active:scale-[0.97]"
            >
              Scarica PDF
            </a>
          </div>
        </div>
      </header>

      <div className="p-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
          {/* Invoice Document */}
          <BillDoc
            number={bill.number}
            date={bill.date}
            period={bill.period}
            client={client}
            items={items}
            paidAmount={bill.paid_amount}
            notes={bill.notes}
          />

          {/* Sidebar */}
          <div className="space-y-4">
            {bill.status !== 'paid' && (
              <MarkPaidForm
                billId={bill.id}
                currentPaidAmount={bill.paid_amount}
                total={totals.total}
              />
            )}

            <div className="rounded-lg border border-border bg-white p-4">
              <h3 className="mb-3 font-display text-sm font-bold text-primary">
                Dettagli
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Tipo:</dt>
                  <dd className="capitalize">{bill.type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Anno:</dt>
                  <dd>{bill.year}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Origine:</dt>
                  <dd className="capitalize">{bill.source}</dd>
                </div>
              </dl>
            </div>

            <PrintButton />
          </div>
        </div>
      </div>
    </main>
  );
}
