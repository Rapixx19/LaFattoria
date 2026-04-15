'use client';

import { chf } from '@lafattoria/utils/formatters';

interface StepPaymentProps {
  total: number;
  paidAmount: number | null;
  notes: string;
  onPaidAmountChange: (amount: number | null) => void;
  onNotesChange: (notes: string) => void;
}

export function StepPayment({
  total,
  paidAmount,
  notes,
  onPaidAmountChange,
  onNotesChange,
}: StepPaymentProps) {
  const hasPayment = paidAmount !== null && paidAmount > 0;
  const balance = total - (paidAmount ?? 0);

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold text-primary">
        Pagamento e Note
      </h2>

      {/* Payment received */}
      <div className="rounded-lg border border-border bg-white p-4">
        <h3 className="mb-3 text-sm font-medium">Vs. Versamento</h3>
        <p className="mb-3 text-xs text-muted">
          Inserisci se il cliente ha già effettuato un versamento
        </p>

        <div className="mb-3 flex items-center gap-3">
          <input
            type="checkbox"
            id="hasPayment"
            checked={hasPayment}
            onChange={(e) =>
              onPaidAmountChange(e.target.checked ? total : null)
            }
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <label htmlFor="hasPayment" className="text-sm">
            Il cliente ha già pagato
          </label>
        </div>

        {hasPayment && (
          <div>
            <label className="mb-1 block text-xs text-muted">
              Importo ricevuto (CHF)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={paidAmount ?? ''}
              onChange={(e) =>
                onPaidAmountChange(
                  e.target.value ? parseFloat(e.target.value) : null
                )
              }
              className="w-full rounded border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="rounded-lg border border-border bg-cream p-4">
        <div className="flex justify-between text-sm">
          <span>Totale fattura:</span>
          <span className="font-mono font-bold">{chf(total)}</span>
        </div>
        {hasPayment && (
          <>
            <div className="mt-2 flex justify-between text-sm text-status-paid">
              <span>Vs. Versamento:</span>
              <span className="font-mono">{chf(paidAmount ?? 0)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-border pt-2 text-sm font-bold">
              <span>A Saldo:</span>
              <span className="font-mono">{chf(balance)}</span>
            </div>
          </>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="mb-1 block text-sm text-muted">
          Note (opzionale)
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={3}
          placeholder="Note aggiuntive per la fattura..."
          className="w-full rounded border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
  );
}
