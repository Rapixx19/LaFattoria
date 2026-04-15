'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { VAT_OPTIONS } from '../lib/types';
import { createService } from '../lib/actions';

interface AddServiceButtonProps {
  suggestedArtCode: string;
}

export function AddServiceButton({ suggestedArtCode }: AddServiceButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-sm bg-white px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-cream active:scale-[0.97]"
      >
        + Aggiungi
      </button>

      {isOpen && (
        <AddServiceModal
          suggestedArtCode={suggestedArtCode}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

interface AddServiceModalProps {
  suggestedArtCode: string;
  onClose: () => void;
}

function AddServiceModal({ suggestedArtCode, onClose }: AddServiceModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    art_code: suggestedArtCode,
    name: '',
    unit: '',
    price: 0,
    vat_rate: 8.1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Il nome è obbligatorio');
      return;
    }

    if (!formData.unit.trim()) {
      setError("L'unità è obbligatoria");
      return;
    }

    if (formData.price <= 0) {
      setError('Il prezzo deve essere maggiore di 0');
      return;
    }

    startTransition(async () => {
      try {
        await createService({
          art_code: formData.art_code.trim(),
          name: formData.name.trim(),
          unit: formData.unit.trim(),
          price: formData.price,
          vat_rate: formData.vat_rate,
        });
        router.refresh();
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore imprevisto');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="border-b border-border px-4 py-3">
          <h2 className="font-display text-lg font-bold text-primary">
            Nuovo servizio personalizzato
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 rounded-sm bg-overdue-bg px-3 py-2 text-sm text-overdue">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Codice Art. *
              </label>
              <input
                type="text"
                value={formData.art_code}
                onChange={(e) => setFormData({ ...formData, art_code: e.target.value })}
                className="w-full rounded-sm border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder={suggestedArtCode}
              />
              <p className="mt-1 text-xs text-muted">
                Suggerito: {suggestedArtCode}
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Nome *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-sm border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Nome del servizio"
                autoFocus
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Unità *
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full rounded-sm border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="es. al mese, a volta, per gara"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Prezzo CHF *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-sm border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  IVA %
                </label>
                <select
                  value={formData.vat_rate}
                  onChange={(e) => setFormData({ ...formData, vat_rate: parseFloat(e.target.value) })}
                  className="w-full rounded-sm border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {VAT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 rounded-sm border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-cream disabled:opacity-50"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
            >
              {isPending ? 'Creazione...' : 'Crea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
