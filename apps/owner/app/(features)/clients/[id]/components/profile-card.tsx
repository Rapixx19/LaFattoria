import { chf, fmtDate } from '@lafattoria/utils/formatters';
import type { ClientWithStats } from '../../lib/types';

interface ProfileCardProps {
  client: ClientWithStats;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function ProfileCard({ client }: ProfileCardProps) {
  const horseName = client.horses.length > 0 ? client.horses[0].name : null;
  const clientSince = fmtDate(client.created_at);

  return (
    <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
          {getInitials(client.name)}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h2 className="font-display text-xl font-bold text-primary">
            {client.name}
          </h2>
          {horseName && (
            <p className="mt-0.5 text-sm text-muted">
              Cavallo: <span className="font-medium text-foreground">{horseName}</span>
            </p>
          )}
          <p className="mt-1 text-xs text-muted">
            Cliente dal {clientSince}
          </p>
        </div>

        {/* Status badge */}
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            client.active
              ? 'bg-paid-bg text-paid'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {client.active ? 'Attivo' : 'Inattivo'}
        </span>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-4">
        <div>
          <p className="text-xs uppercase text-muted">Totale pagato</p>
          <p className="mt-1 font-mono text-lg font-semibold text-paid">
            {chf(client.stats.totalPaid)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-muted">Da pagare</p>
          <p
            className={`mt-1 font-mono text-lg font-semibold ${
              client.stats.outstanding > 0 ? 'text-overdue' : 'text-muted'
            }`}
          >
            {chf(client.stats.outstanding)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-muted">Fatture</p>
          <p className="mt-1 font-mono text-lg font-semibold text-foreground">
            {client.stats.billCount}
          </p>
        </div>
      </div>

      {/* Contact info */}
      {(client.email || client.phone || client.address) && (
        <div className="mt-4 border-t border-border pt-4 text-sm">
          {client.email && (
            <p className="text-muted">
              <span className="mr-2">Email:</span>
              <a href={`mailto:${client.email}`} className="text-primary hover:underline">
                {client.email}
              </a>
            </p>
          )}
          {client.phone && (
            <p className="mt-1 text-muted">
              <span className="mr-2">Tel:</span>
              <a href={`tel:${client.phone}`} className="text-primary hover:underline">
                {client.phone}
              </a>
            </p>
          )}
          {client.address && (
            <p className="mt-1 text-muted">
              <span className="mr-2">Indirizzo:</span>
              <span className="text-foreground">{client.address}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
