'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { STATUS_LABELS, type HorseStatus } from '../lib/types';

interface HorseFiltersProps {
  clients: { id: string; name: string }[];
  currentStatus: 'all' | HorseStatus;
  currentClientId?: string;
}

export function HorseFilters({
  clients,
  currentStatus,
  currentClientId,
}: HorseFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/cavalli?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={currentStatus}
        onChange={(e) => updateFilter('status', e.target.value)}
        className="rounded-sm border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="all">Tutti gli stati</option>
        {(Object.entries(STATUS_LABELS) as [HorseStatus, string][]).map(
          ([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          )
        )}
      </select>

      <select
        value={currentClientId ?? ''}
        onChange={(e) => updateFilter('clientId', e.target.value)}
        className="rounded-sm border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="">Tutti i clienti</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>
    </div>
  );
}
