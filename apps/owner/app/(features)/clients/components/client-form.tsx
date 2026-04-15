'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, updateClient } from '../lib/actions';
import type { Client } from '../lib/types';

interface ClientFormProps {
  client?: Client;
  onClose: () => void;
}

export function ClientForm({ client, onClose }: ClientFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!client;

  const [formData, setFormData] = useState({
    name: client?.name ?? '',
    address: client?.address ?? '',
    email: client?.email ?? '',
    phone: client?.phone ?? '',
    notes: client?.notes ?? '',
    active: client?.active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Il nome è obbligatorio');
      return;
    }

    startTransition(async () => {
      try {
        if (isEditing && client) {
          await updateClient({
            id: client.id,
            name: formData.name.trim(),
            address: formData.address.trim() || null,
            email: formData.email.trim() || null,
            phone: formData.phone.trim() || null,
            notes: formData.notes.trim() || null,
            active: formData.active,
          });
        } else {
          await createClient({
            name: formData.name.trim(),
            address: formData.address.trim() || null,
            email: formData.email.trim() || null,
            phone: formData.phone.trim() || null,
            notes: formData.notes.trim() || null,
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
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="border-b border-border px-4 py-3">
          <h2 className="font-display text-lg font-bold text-primary">
            {isEditing ? 'Modifica cliente' : 'Nuovo cliente'}
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
                placeholder="Nome completo"
                autoFocus
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-sm border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="email@esempio.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Telefono
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-sm border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="+41 XX XXX XX XX"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Indirizzo
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full rounded-sm border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Via, CAP Città"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Note
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full rounded-sm border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                rows={3}
                placeholder="Note interne..."
              />
            </div>

            {isEditing && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="active" className="text-sm text-foreground">
                  Cliente attivo
                </label>
              </div>
            )}
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
