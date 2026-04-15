'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createHorse, updateHorse } from '../lib/actions';
import { STATUS_LABELS, type HorseWithClient, type HorseStatus } from '../lib/types';

interface HorseFormProps {
  horse?: HorseWithClient;
  clients: { id: string; name: string }[];
  onClose: () => void;
}

export function HorseForm({ horse, clients, onClose }: HorseFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!horse;

  const [formData, setFormData] = useState({
    name: horse?.name ?? '',
    breed: horse?.breed ?? '',
    client_id: horse?.client_id ?? '',
    stall: horse?.stall ?? '',
    status: (horse?.status ?? 'active') as HorseStatus,
    diet_notes: horse?.diet_notes ?? '',
    vet_notes: horse?.vet_notes ?? '',
    farrier_date: horse?.farrier_date ?? '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Il nome è obbligatorio');
      return;
    }

    if (!formData.client_id) {
      setError('Il proprietario è obbligatorio');
      return;
    }

    startTransition(async () => {
      try {
        if (isEditing && horse) {
          await updateHorse({
            id: horse.id,
            name: formData.name.trim(),
            breed: formData.breed.trim() || null,
            client_id: formData.client_id,
            stall: formData.stall.trim() || null,
            status: formData.status,
            diet_notes: formData.diet_notes.trim() || null,
            vet_notes: formData.vet_notes.trim() || null,
            farrier_date: formData.farrier_date || null,
          });
        } else {
          await createHorse({
            name: formData.name.trim(),
            breed: formData.breed.trim() || null,
            client_id: formData.client_id,
            stall: formData.stall.trim() || null,
            status: formData.status,
            diet_notes: formData.diet_notes.trim() || null,
            vet_notes: formData.vet_notes.trim() || null,
            farrier_date: formData.farrier_date || null,
          });
        }
        router.refresh();
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore imprevisto');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="border-b border-border px-4 py-3">
          <h2 className="font-display text-lg font-bold text-primary">
            {isEditing ? 'Modifica cavallo' : 'Nuovo cavallo'}
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
                Nome *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-sm border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Nome del cavallo"
                autoFocus
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Proprietario *
              </label>
              <select
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                className="w-full rounded-sm border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Seleziona...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Razza
                </label>
                <input
                  type="text"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  className="w-full rounded-sm border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Es. Frisone"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Box
                </label>
                <input
                  type="text"
                  value={formData.stall}
                  onChange={(e) => setFormData({ ...formData, stall: e.target.value })}
                  className="w-full rounded-sm border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Es. A1"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Stato
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as HorseStatus })
                }
                className="w-full rounded-sm border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {(Object.entries(STATUS_LABELS) as [HorseStatus, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
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
              {isPending ? 'Salvataggio...' : isEditing ? 'Salva' : 'Crea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
