'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { markBillPaid } from '../../lib/actions';

interface MarkPaidFormProps {
  billId: string;
  currentPaidAmount: number | null;
  total: number;
}

export function MarkPaidForm({
  billId,
  currentPaidAmount,
  total,
}: MarkPaidFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paidAmount, setPaidAmount] = useState(
    currentPaidAmount?.toString() ?? total.toString()
  );
  const [paidDate, setPaidDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await markBillPaid(
        billId,
        parseFloat(paidAmount),
        paidDate,
        notes || undefined
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-white p-4"
    >
      <h3 className="mb-4 font-display text-sm font-bold text-primary">
        Registra Pagamento
      </h3>

      {error && (
        <div className="mb-4 rounded bg-overdue-bg p-3 text-sm text-overdue">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="mb-1 block text-sm text-muted">
          Importo ricevuto (CHF)
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={paidAmount}
          onChange={(e) => setPaidAmount(e.target.value)}
          className="w-full rounded border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm text-muted">
          Data pagamento
        </label>
        <input
          type="date"
          value={paidDate}
          onChange={(e) => setPaidDate(e.target.value)}
          className="w-full rounded border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm text-muted">
          Note (opzionale)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full rounded border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-paid px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-paid/90 active:scale-[0.97] disabled:opacity-50"
      >
        {loading ? 'Salvataggio...' : 'Segna come Pagata'}
      </button>
    </form>
  );
}
