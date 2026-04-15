'use client';

import { useState, useMemo } from 'react';
import type { Client } from '../../lib/types';

interface StepClientProps {
  clients: Client[];
  value: string | null;
  onChange: (clientId: string) => void;
}

export function StepClient({ clients, value, onChange }: StepClientProps) {
  const [search, setSearch] = useState('');

  const filteredClients = useMemo(() => {
    if (!search.trim()) return clients;
    const q = search.toLowerCase();
    return clients.filter((c) => c.name.toLowerCase().includes(q));
  }, [clients, search]);

  const selectedClient = clients.find((c) => c.id === value);

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold text-primary">Cliente</h2>
      <p className="text-sm text-muted">
        Seleziona il cliente per questa fattura
      </p>

      {/* Search */}
      <input
        type="text"
        placeholder="Cerca cliente..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Selected client display */}
      {selectedClient && (
        <div className="rounded-lg border-2 border-primary bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold">{selectedClient.name}</div>
              {selectedClient.address && (
                <div className="text-sm text-muted">{selectedClient.address}</div>
              )}
            </div>
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-sm text-muted hover:text-primary"
            >
              Cambia
            </button>
          </div>
        </div>
      )}

      {/* Client list */}
      {!value && (
        <div className="max-h-64 space-y-2 overflow-y-auto">
          {filteredClients.length === 0 ? (
            <div className="py-4 text-center text-sm text-muted">
              Nessun cliente trovato
            </div>
          ) : (
            filteredClients.map((client) => (
              <button
                key={client.id}
                type="button"
                onClick={() => onChange(client.id)}
                className="w-full rounded-lg border border-border p-3 text-left transition-all hover:border-primary hover:bg-cream"
              >
                <div className="font-medium">{client.name}</div>
                {client.address && (
                  <div className="text-xs text-muted">{client.address}</div>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
