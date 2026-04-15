import Link from 'next/link';
import { fmtDate } from '@lafattoria/utils/formatters';
import type { HorseWithClient } from '../../lib/types';

interface HorseCardProps {
  horse: HorseWithClient;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function HorseCard({ horse }: HorseCardProps) {
  const createdAt = fmtDate(horse.created_at);

  return (
    <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
          {getInitials(horse.name)}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h2 className="font-display text-xl font-bold text-primary">
            {horse.name}
          </h2>
          {horse.breed && (
            <p className="mt-0.5 text-sm text-muted">
              Razza: <span className="font-medium text-foreground">{horse.breed}</span>
            </p>
          )}
          <p className="mt-1 text-xs text-muted">
            Registrato il {createdAt}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-4">
        <div>
          <p className="text-xs uppercase text-muted">Proprietario</p>
          {horse.clients ? (
            <Link
              href={`/clients/${horse.clients.id}`}
              className="mt-1 font-medium text-primary hover:underline"
            >
              {horse.clients.name}
            </Link>
          ) : (
            <p className="mt-1 text-muted">—</p>
          )}
        </div>
        <div>
          <p className="text-xs uppercase text-muted">Box</p>
          <p className="mt-1 font-medium text-foreground">
            {horse.stall ?? '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
