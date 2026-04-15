import Link from 'next/link';
import { chf, fmtDateShort } from '@lafattoria/utils/formatters';
import type { ClientWithStats } from '../lib/types';

interface ClientRowProps {
  client: ClientWithStats;
}

export function ClientRow({ client }: ClientRowProps) {
  const horseName = client.horses.length > 0 ? client.horses[0].name : null;
  const hasOutstanding = client.stats.outstanding > 0;

  return (
    <tr className="border-b border-border last:border-b-0 hover:bg-cream/50">
      <td className="px-4 py-3">
        <Link
          href={`/clients/${client.id}`}
          className="font-medium text-primary hover:underline"
        >
          {client.name}
        </Link>
      </td>
      <td className="px-4 py-3 text-sm text-muted">
        {horseName ?? '—'}
      </td>
      <td className="px-4 py-3">
        {hasOutstanding ? (
          <span className="inline-block rounded-full bg-overdue-bg px-2.5 py-0.5 font-mono text-xs font-medium text-overdue">
            {chf(client.stats.outstanding)}
          </span>
        ) : (
          <span className="text-sm text-muted">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-muted">
        {client.stats.lastBillDate ? fmtDateShort(client.stats.lastBillDate) : '—'}
      </td>
      <td className="px-4 py-3 text-center">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
            client.active
              ? 'bg-paid-bg text-paid'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {client.active ? 'Attivo' : 'Inattivo'}
        </span>
      </td>
    </tr>
  );
}
