import { chf } from '@lafattoria/utils/formatters';
import type { BillTotals } from '../lib/types';

interface TotalsSummaryProps {
  totals: BillTotals;
  paidAmount?: number | null;
}

export function TotalsSummary({ totals, paidAmount }: TotalsSummaryProps) {
  const balance = totals.total - (paidAmount ?? 0);

  return (
    <div className="rounded-lg border border-border bg-white p-4">
      <h3 className="mb-3 font-display text-sm font-bold text-primary">
        Riepilogo
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Netto:</span>
          <span className="font-mono">{chf(totals.net)}</span>
        </div>

        {Object.entries(totals.vatMap).map(([rate, amount]) => (
          <div key={rate} className="flex justify-between">
            <span className="text-muted">IVA {rate}%:</span>
            <span className="font-mono">{chf(amount)}</span>
          </div>
        ))}

        <div className="flex justify-between border-t border-border pt-2 font-bold">
          <span>Totale:</span>
          <span className="font-mono">{chf(totals.total)}</span>
        </div>

        {paidAmount !== undefined && paidAmount !== null && paidAmount > 0 && (
          <>
            <div className="flex justify-between text-paid">
              <span>Vs. Versamento:</span>
              <span className="font-mono">{chf(paidAmount)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-bold">
              <span>A Saldo:</span>
              <span className="font-mono">{chf(balance)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
