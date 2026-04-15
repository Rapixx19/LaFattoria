'use client';

import { useState } from 'react';
import { chf } from '@lafattoria/utils/formatters';
import { calcItemSubtotal } from '../../lib/calc';
import type { BillItem, Service } from '../../lib/types';

interface StepServicesProps {
  services: Service[];
  items: BillItem[];
  onChange: (items: BillItem[]) => void;
}

export function StepServices({ services, items, onChange }: StepServicesProps) {
  const [showServicePicker, setShowServicePicker] = useState(false);

  const addItem = (service: Service) => {
    const newItem: BillItem = {
      art: service.art_code,
      name: service.name,
      desc: '',
      unit: service.unit,
      price: service.price,
      qty: 1,
      vat: service.vat_rate,
      subtotal: service.price,
    };
    onChange([...items, newItem]);
    setShowServicePicker(false);
  };

  const addCustomItem = () => {
    const newItem: BillItem = {
      art: '',
      name: '',
      desc: '',
      unit: '',
      price: 0,
      qty: 1,
      vat: 0,
      subtotal: 0,
    };
    onChange([...items, newItem]);
    setShowServicePicker(false);
  };

  const updateItem = (index: number, field: keyof BillItem, value: string | number) => {
    const updated = [...items];
    const item = { ...updated[index] };

    if (field === 'price' || field === 'qty' || field === 'vat' || field === 'subtotal') {
      const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      if (field === 'price') item.price = numValue;
      else if (field === 'qty') item.qty = numValue;
      else if (field === 'vat') item.vat = numValue;
      item.subtotal = calcItemSubtotal(item.price, item.qty);
    } else {
      const strValue = String(value);
      if (field === 'art') item.art = strValue;
      else if (field === 'name') item.name = strValue;
      else if (field === 'desc') item.desc = strValue;
      else if (field === 'unit') item.unit = strValue;
    }

    updated[index] = item;
    onChange(updated);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold text-primary">
        Prestazioni
      </h2>
      <p className="text-sm text-muted">
        Aggiungi le prestazioni da fatturare
      </p>

      {/* Items list */}
      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-border bg-white p-4"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  {/* Art code + Name */}
                  <div className="mb-2 grid grid-cols-[80px_1fr] gap-2">
                    <input
                      type="text"
                      placeholder="Art."
                      value={item.art}
                      onChange={(e) => updateItem(idx, 'art', e.target.value)}
                      className="rounded border border-border px-2 py-1 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="Prestazione"
                      value={item.name}
                      onChange={(e) => updateItem(idx, 'name', e.target.value)}
                      className="rounded border border-border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  {/* Description */}
                  <input
                    type="text"
                    placeholder="Descrizione (opzionale)"
                    value={item.desc}
                    onChange={(e) => updateItem(idx, 'desc', e.target.value)}
                    className="mb-2 w-full rounded border border-border px-2 py-1 text-sm text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {/* Price, Qty, Unit, VAT */}
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div>
                      <label className="text-xs text-muted">Prezzo</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.price}
                        onChange={(e) => updateItem(idx, 'price', e.target.value)}
                        className="w-full rounded border border-border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted">Qtà</label>
                      <input
                        type="number"
                        step="1"
                        min="1"
                        value={item.qty}
                        onChange={(e) => updateItem(idx, 'qty', e.target.value)}
                        className="w-full rounded border border-border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted">Unità</label>
                      <input
                        type="text"
                        placeholder="es. al mese"
                        value={item.unit}
                        onChange={(e) => updateItem(idx, 'unit', e.target.value)}
                        className="w-full rounded border border-border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted">IVA %</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={item.vat}
                        onChange={(e) => updateItem(idx, 'vat', e.target.value)}
                        className="w-full rounded border border-border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="mb-2 text-xs text-status-overdue hover:underline"
                  >
                    Rimuovi
                  </button>
                  <div className="font-mono font-bold">{chf(item.subtotal)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add item */}
      {showServicePicker ? (
        <div className="rounded-lg border border-border bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium">Seleziona servizio</span>
            <button
              type="button"
              onClick={() => setShowServicePicker(false)}
              className="text-sm text-muted hover:text-primary"
            >
              Annulla
            </button>
          </div>
          <div className="max-h-48 space-y-1 overflow-y-auto">
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => addItem(service)}
                className="w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-cream"
              >
                <span className="mr-2 font-mono text-xs text-muted">
                  {service.art_code}
                </span>
                <span>{service.name}</span>
                <span className="float-right font-mono">{chf(service.price)}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={addCustomItem}
            className="mt-2 w-full rounded border border-dashed border-border py-2 text-sm text-muted transition-colors hover:border-primary hover:text-primary"
          >
            + Aggiungi voce personalizzata
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowServicePicker(true)}
          className="w-full rounded-lg border-2 border-dashed border-border py-4 text-sm text-muted transition-all hover:border-primary hover:text-primary"
        >
          + Aggiungi prestazione
        </button>
      )}
    </div>
  );
}
