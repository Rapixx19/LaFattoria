'use client';

import { useState } from 'react';
import { chf } from '@lafattoria/utils/formatters';
import type { SpendData } from '../../lib/types';

interface SpendChartProps {
  data: SpendData[];
}

export function SpendChart({ data }: SpendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = Math.max(...data.map((d) => Math.max(d.invoiced, d.paid)), 1);
  const totalInvoiced = data.reduce((sum, d) => sum + d.invoiced, 0);
  const totalPaid = data.reduce((sum, d) => sum + d.paid, 0);

  if (totalInvoiced === 0 && totalPaid === 0) {
    return (
      <div className="rounded-lg border border-border bg-white p-8 text-center text-muted">
        Nessun dato di spesa negli ultimi 12 mesi
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-white p-4">
      {/* Summary */}
      <div className="mb-6 flex gap-6">
        <div>
          <p className="text-xs uppercase text-muted">Totale fatturato</p>
          <p className="font-mono text-lg font-semibold text-foreground">
            {chf(totalInvoiced)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-muted">Totale pagato</p>
          <p className="font-mono text-lg font-semibold text-paid">
            {chf(totalPaid)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-48">
        <div className="flex h-full items-end gap-1">
          {data.map((d, i) => {
            const invoicedHeight = (d.invoiced / maxValue) * 100;
            const paidHeight = (d.paid / maxValue) * 100;
            const isHovered = hoveredIndex === i;

            return (
              <div
                key={`${d.month}-${d.year}`}
                className="relative flex flex-1 flex-col items-center"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip */}
                {isHovered && (d.invoiced > 0 || d.paid > 0) && (
                  <div className="absolute -top-16 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-white shadow-lg">
                    <p>Fatturato: {chf(d.invoiced)}</p>
                    <p>Pagato: {chf(d.paid)}</p>
                    <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-foreground" />
                  </div>
                )}

                {/* Bars container */}
                <div className="flex h-36 w-full items-end justify-center gap-0.5">
                  {/* Invoiced bar */}
                  <div
                    className={`w-2 rounded-t transition-all ${
                      isHovered ? 'bg-primary' : 'bg-primary/60'
                    }`}
                    style={{ height: `${invoicedHeight}%`, minHeight: d.invoiced > 0 ? '2px' : '0' }}
                  />
                  {/* Paid bar */}
                  <div
                    className={`w-2 rounded-t transition-all ${
                      isHovered ? 'bg-paid' : 'bg-paid/60'
                    }`}
                    style={{ height: `${paidHeight}%`, minHeight: d.paid > 0 ? '2px' : '0' }}
                  />
                </div>

                {/* Month label */}
                <span className="mt-2 text-[10px] text-muted">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-primary" />
          <span className="text-muted">Fatturato</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-paid" />
          <span className="text-muted">Pagato</span>
        </div>
      </div>
    </div>
  );
}
