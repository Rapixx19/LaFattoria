'use client';

import type { BillType } from '../../lib/types';

interface StepTypeProps {
  value: BillType;
  onChange: (type: BillType) => void;
}

export function StepType({ value, onChange }: StepTypeProps) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold text-primary">
        Tipo di Fattura
      </h2>
      <p className="text-sm text-muted">
        Seleziona il tipo di fattura da creare
      </p>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange('mensile')}
          className={`rounded-lg border-2 p-6 text-center transition-all ${
            value === 'mensile'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <div className="mb-2 text-2xl">📅</div>
          <div className="font-bold">Mensile</div>
          <div className="mt-1 text-xs text-muted">
            Fattura ricorrente mensile
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChange('extra')}
          className={`rounded-lg border-2 p-6 text-center transition-all ${
            value === 'extra'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <div className="mb-2 text-2xl">⭐</div>
          <div className="font-bold">Extra</div>
          <div className="mt-1 text-xs text-muted">
            Servizi aggiuntivi o una tantum
          </div>
        </button>
      </div>
    </div>
  );
}
