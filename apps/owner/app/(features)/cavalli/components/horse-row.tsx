import Link from 'next/link';
import type { HorseWithClient, HorseStatus } from '../lib/types';
import { STATUS_STYLES, STATUS_LABELS } from '../lib/types';

interface HorseRowProps {
  horse: HorseWithClient;
}

export function HorseRow({ horse }: HorseRowProps) {
  const status = horse.status as HorseStatus;

  return (
    <tr className="border-b border-border last:border-b-0 hover:bg-cream/50">
      <td className="px-4 py-3">
        <Link
          href={`/cavalli/${horse.id}`}
          className="font-medium text-primary hover:underline"
        >
          {horse.name}
        </Link>
        {horse.breed && (
          <p className="text-sm text-muted">{horse.breed}</p>
        )}
      </td>
      <td className="px-4 py-3 text-sm">
        {horse.clients?.name ?? '—'}
      </td>
      <td className="px-4 py-3 text-sm text-muted">
        {horse.stall ?? '—'}
      </td>
      <td className="px-4 py-3 text-center">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
        >
          {STATUS_LABELS[status]}
        </span>
      </td>
    </tr>
  );
}
