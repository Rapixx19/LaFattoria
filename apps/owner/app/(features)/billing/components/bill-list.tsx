import Link from 'next/link';
import { chf, fmtDateShort } from '@lafattoria/utils/formatters';
import { calcBillTotals } from '../lib/calc';
import type { BillItem } from '../lib/types';

interface BillRow {
  id: string;
  number: string;
  date: string;
  type: string;
  status: string;
  items: unknown;
  paid_amount: number | null;
  clients: {
    id: string;
    name: string;
  } | null;
}

interface BillListProps {
  bills: BillRow[];
}

const STATUS_STYLES = {
  pending: 'bg-pending-bg text-pending',
  paid: 'bg-paid-bg text-paid',
  overdue: 'bg-overdue-bg text-overdue',
} as const;

const STATUS_LABELS = {
  pending: 'In attesa',
  paid: 'Pagata',
  overdue: 'Scaduta',
} as const;

const TYPE_LABELS = {
  mensile: 'Mensile',
  extra: 'Extra',
  imported: 'Importata',
} as const;

export function BillList({ bills }: BillListProps) {
  if (bills.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-white p-8 text-center text-muted">
        Nessuna fattura trovata
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-cream">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted">
              Numero
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted">
              Data
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted">
              Cliente
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted">
              Tipo
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase text-muted">
              Totale
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium uppercase text-muted">
              Stato
            </th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => {
            const items = bill.items as BillItem[];
            const totals = calcBillTotals(items);
            const status = bill.status as keyof typeof STATUS_STYLES;
            const type = bill.type as keyof typeof TYPE_LABELS;

            return (
              <tr
                key={bill.id}
                className="border-b border-border last:border-b-0 hover:bg-cream/50"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/billing/${bill.id}`}
                    className="font-mono text-sm font-medium text-primary hover:underline"
                  >
                    {bill.number}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-muted">
                  {fmtDateShort(bill.date)}
                </td>
                <td className="px-4 py-3 text-sm">
                  {bill.clients?.name ?? '—'}
                </td>
                <td className="px-4 py-3 text-sm text-muted">
                  {TYPE_LABELS[type] ?? type}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  {chf(totals.total)}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
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
