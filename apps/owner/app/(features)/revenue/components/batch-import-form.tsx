'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { importBill } from '../lib/actions';
import type { Client, Service } from '../../billing/lib/types';

interface BatchImportButtonProps {
  clients: Client[];
  services: Service[];
}

export function BatchImportButton({ clients, services }: BatchImportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-sm bg-white px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-cream active:scale-[0.97]"
      >
        + Importa fattura
      </button>

      {isOpen && (
        <ImportModal
          clients={clients}
          services={services}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

interface ImportModalProps {
  clients: Client[];
  services: Service[];
  onClose: () => void;
}

function ImportModal({ clients, services, onClose }: ImportModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    clientId: '',
    date: '',
    type: 'mensile' as const,
    serviceId: '',
    qty: 1,
    paidAmount: 0,
    paidDate: '',
    notes: '',
  });

  const selectedService = services.find((s) => s.id === form.serviceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.clientId || !form.date || !form.serviceId) {
      setError('Compila tutti i campi obbligatori');
      return;
    }

    if (!selectedService) return;

    startTransition(async () => {
      try {
        await importBill({
          type: form.type,
          clientId: form.clientId,
          date: form.date,
          period: null,
          items: [
            {
              art: selectedService.art_code,
              name: selectedService.name,
              desc: '',
              unit: selectedService.unit,
              price: selectedService.price,
              qty: form.qty,
              vat: selectedService.vat_rate,
              subtotal: selectedService.price * form.qty,
            },
          ],
          paidAmount: form.paidAmount > 0 ? form.paidAmount : null,
          paidDate: form.paidDate || null,
          notes: form.notes || null,
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
            Importa fattura storica
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto p-4">
          {error && (
            <div className="mb-4 rounded-sm bg-overdue-bg px-3 py-2 text-sm text-overdue">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Field label="Cliente *">
              <select
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                className="w-full rounded-sm border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Seleziona...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Data fattura *">
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-sm border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </Field>

            <Field label="Servizio *">
              <select
                value={form.serviceId}
                onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
                className="w-full rounded-sm border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Seleziona...</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} - CHF {s.price}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Quantità">
              <input
                type="number"
                min="1"
                value={form.qty}
                onChange={(e) => setForm({ ...form, qty: parseInt(e.target.value) || 1 })}
                className="w-full rounded-sm border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </Field>

            <Field label="Importo pagato (CHF)">
              <input
                type="number"
                step="0.01"
                value={form.paidAmount}
                onChange={(e) => setForm({ ...form, paidAmount: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-sm border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </Field>

            <Field label="Data pagamento">
              <input
                type="date"
                value={form.paidDate}
                onChange={(e) => setForm({ ...form, paidDate: e.target.value })}
                className="w-full rounded-sm border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </Field>
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
              {isPending ? 'Importazione...' : 'Importa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}
