'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import type { Client } from '../lib/types';

interface BillFiltersProps {
  clients: Client[];
  years: number[];
}

export function BillFilters({ clients, years }: BillFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'all' || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`/billing?${params.toString()}`);
    },
    [router, searchParams]
  );

  const status = searchParams.get('status') ?? 'all';
  const year = searchParams.get('year') ?? 'all';
  const clientId = searchParams.get('clientId') ?? 'all';

  return (
    <div className="flex flex-wrap gap-3">
      {/* Status filter */}
      <select
        value={status}
        onChange={(e) => updateFilter('status', e.target.value)}
        className="rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="all">Tutti gli stati</option>
        <option value="pending">In attesa</option>
        <option value="paid">Pagate</option>
        <option value="overdue">Scadute</option>
      </select>

      {/* Year filter */}
      <select
        value={year}
        onChange={(e) => updateFilter('year', e.target.value)}
        className="rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="all">Tutti gli anni</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      {/* Client filter */}
      <select
        value={clientId}
        onChange={(e) => updateFilter('clientId', e.target.value)}
        className="rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="all">Tutti i clienti</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
