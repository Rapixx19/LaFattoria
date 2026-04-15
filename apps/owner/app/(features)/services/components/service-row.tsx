'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { chf } from '@lafattoria/utils/formatters';
import type { Service, PriceHistoryEntry } from '../lib/types';
import { VAT_OPTIONS } from '../lib/types';
import { updateService, toggleServiceActive } from '../lib/actions';
import { PriceHistoryModal } from './price-history-modal';

interface ServiceRowProps {
  service: Service;
}

export function ServiceRow({ service }: ServiceRowProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    art_code: service.art_code,
    name: service.name,
    unit: service.unit,
    price: service.price,
    vat_rate: service.vat_rate,
  });

  const priceHistory = (service.price_history ?? []) as unknown as PriceHistoryEntry[];

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      try {
        await updateService({
          id: service.id,
          ...formData,
        });
        setIsEditing(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore imprevisto');
      }
    });
  };

  const handleCancel = () => {
    setFormData({
      art_code: service.art_code,
      name: service.name,
      unit: service.unit,
      price: service.price,
      vat_rate: service.vat_rate,
    });
    setIsEditing(false);
    setError(null);
  };

  const handleToggleActive = () => {
    startTransition(async () => {
      try {
        await toggleServiceActive(service.id, !service.active);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore imprevisto');
      }
    });
  };

  const rowClasses = service.active
    ? 'border-b border-border last:border-b-0 hover:bg-cream/50'
    : 'border-b border-border last:border-b-0 bg-gray-50 opacity-60';

  if (isEditing) {
    return (
      <tr className={rowClasses}>
        <td className="px-3 py-2">
          <input
            type="text"
            value={formData.art_code}
            onChange={(e) => setFormData({ ...formData, art_code: e.target.value })}
            className="w-16 rounded-sm border border-border px-2 py-1 text-sm focus:border-primary focus:outline-none"
          />
        </td>
        <td className="px-3 py-2">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full min-w-[120px] rounded-sm border border-border px-2 py-1 text-sm focus:border-primary focus:outline-none"
          />
        </td>
        <td className="px-3 py-2">
          <input
            type="text"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="w-24 rounded-sm border border-border px-2 py-1 text-sm focus:border-primary focus:outline-none"
          />
        </td>
        <td className="px-3 py-2 text-right">
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            className="w-24 rounded-sm border border-border px-2 py-1 text-right text-sm focus:border-primary focus:outline-none"
          />
        </td>
        <td className="px-3 py-2 text-center">
          <select
            value={formData.vat_rate}
            onChange={(e) => setFormData({ ...formData, vat_rate: parseFloat(e.target.value) })}
            className="rounded-sm border border-border px-2 py-1 text-sm focus:border-primary focus:outline-none"
          >
            {VAT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </td>
        <td className="px-3 py-2 text-center">
          <span className="text-sm text-muted">{service.active ? 'Si' : 'No'}</span>
        </td>
        <td className="px-3 py-2">
          <div className="flex items-center justify-center gap-1">
            {error && (
              <span className="text-xs text-overdue">{error}</span>
            )}
            <button
              onClick={handleSave}
              disabled={isPending}
              className="rounded-sm bg-primary px-2 py-1 text-xs font-medium text-white hover:bg-primary-dark disabled:opacity-50"
            >
              {isPending ? '...' : 'Salva'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isPending}
              className="rounded-sm border border-border px-2 py-1 text-xs font-medium text-muted hover:bg-cream disabled:opacity-50"
            >
              Annulla
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <>
      <tr className={rowClasses}>
        <td className="px-3 py-3 font-mono text-sm">
          {service.art_code}
          {service.is_custom && (
            <span className="ml-1 text-xs text-primary">(C)</span>
          )}
        </td>
        <td className="px-3 py-3 text-sm font-medium">{service.name}</td>
        <td className="px-3 py-3 text-sm text-muted">{service.unit}</td>
        <td className="px-3 py-3 text-right font-mono text-sm">{chf(service.price)}</td>
        <td className="px-3 py-3 text-center text-sm text-muted">{service.vat_rate}%</td>
        <td className="px-3 py-3 text-center">
          <button
            onClick={handleToggleActive}
            disabled={isPending}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 ${
              service.active ? 'bg-primary' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                service.active ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </td>
        <td className="px-3 py-3">
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-sm border border-border px-2 py-1 text-xs font-medium text-muted hover:bg-cream"
            >
              Modifica
            </button>
            {priceHistory.length > 0 && (
              <button
                onClick={() => setShowHistory(true)}
                className="rounded-sm border border-border px-2 py-1 text-xs font-medium text-muted hover:bg-cream"
              >
                Storico
              </button>
            )}
          </div>
        </td>
      </tr>

      {showHistory && (
        <PriceHistoryModal
          serviceName={service.name}
          currentPrice={service.price}
          history={priceHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </>
  );
}
