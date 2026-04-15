'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { resetToListino } from '../lib/actions';

export function ResetListinoButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    setError(null);
    startTransition(async () => {
      try {
        await resetToListino();
        router.refresh();
        setShowConfirm(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore imprevisto');
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="rounded-sm border border-white/30 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
      >
        Reset Listino
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white shadow-xl">
            <div className="border-b border-border px-4 py-3">
              <h2 className="font-display text-lg font-bold text-primary">
                Reset listino
              </h2>
            </div>

            <div className="p-4">
              {error && (
                <div className="mb-4 rounded-sm bg-overdue-bg px-3 py-2 text-sm text-overdue">
                  {error}
                </div>
              )}

              <p className="text-sm text-foreground">
                Questa azione ripristinerà i prezzi e le aliquote IVA di tutti i servizi
                standard ai valori predefiniti del listino.
              </p>
              <p className="mt-2 text-sm text-muted">
                I servizi personalizzati (codice C###) non verranno modificati.
              </p>
            </div>

            <div className="border-t border-border px-4 py-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isPending}
                  className="flex-1 rounded-sm border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-cream disabled:opacity-50"
                >
                  Annulla
                </button>
                <button
                  onClick={handleReset}
                  disabled={isPending}
                  className="flex-1 rounded-sm bg-overdue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                >
                  {isPending ? 'Ripristino...' : 'Ripristina'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
