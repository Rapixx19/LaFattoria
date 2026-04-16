'use client';

import type { ExtractedInvoice } from '../lib/types';

interface ImportPreviewRowProps {
  invoice: ExtractedInvoice;
  selected: boolean;
  onToggle: () => void;
}

export function ImportPreviewRow({ invoice, selected, onToggle }: ImportPreviewRowProps) {
  const statusIcon = {
    ready: '✓',
    needs_review: '⚠',
    error: '✕',
  }[invoice.status];

  const statusColor = {
    ready: 'text-paid',
    needs_review: 'text-pending',
    error: 'text-overdue',
  }[invoice.status];

  const formatDate = (date: string) => {
    try {
      const d = new Date(date);
      return d.toLocaleDateString('it-CH', { month: 'short', year: 'numeric' });
    } catch {
      return date;
    }
  };

  return (
    <div className="flex items-center gap-3 rounded border border-border bg-white px-3 py-2">
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        disabled={invoice.status === 'error'}
        className="h-4 w-4 rounded border-border text-primary focus:ring-primary disabled:opacity-50"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={`text-sm ${statusColor}`}>{statusIcon}</span>
          <span className="truncate text-sm font-medium text-foreground">
            {invoice.clientName || 'Cliente sconosciuto'}
          </span>
        </div>
        {invoice.error && (
          <p className="truncate text-xs text-overdue">{invoice.error}</p>
        )}
      </div>

      <div className="text-right text-sm">
        <p className="font-medium text-foreground">CHF {invoice.total.toFixed(2)}</p>
        <p className="text-xs text-muted">{formatDate(invoice.date)}</p>
      </div>
    </div>
  );
}
