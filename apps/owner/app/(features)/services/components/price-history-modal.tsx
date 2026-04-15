'use client';

import { chf, fmtDateShort } from '@lafattoria/utils/formatters';
import type { PriceHistoryEntry } from '../lib/types';

interface PriceHistoryModalProps {
  serviceName: string;
  currentPrice: number;
  history: PriceHistoryEntry[];
  onClose: () => void;
}

export function PriceHistoryModal({
  serviceName,
  currentPrice,
  history,
  onClose,
}: PriceHistoryModalProps) {
  // Sort history by date descending (most recent first)
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white shadow-xl">
        <div className="border-b border-border px-4 py-3">
          <h2 className="font-display text-lg font-bold text-primary">
            Storico prezzi
          </h2>
          <p className="text-sm text-muted">{serviceName}</p>
        </div>

        <div className="p-4">
          <div className="mb-4 rounded-sm bg-cream p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Prezzo attuale</span>
              <span className="font-mono text-lg font-bold text-primary">{chf(currentPrice)}</span>
            </div>
          </div>

          {sortedHistory.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-xs font-medium uppercase text-muted">Prezzi precedenti</h3>
              <div className="divide-y divide-border rounded-sm border border-border">
                {sortedHistory.map((entry, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-2"
                  >
                    <span className="text-sm text-muted">
                      {fmtDateShort(entry.changedAt)}
                    </span>
                    <span className="font-mono text-sm">{chf(entry.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-sm text-muted">
              Nessuno storico disponibile
            </p>
          )}
        </div>

        <div className="border-t border-border px-4 py-3">
          <button
            onClick={onClose}
            className="w-full rounded-sm border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-cream"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}
