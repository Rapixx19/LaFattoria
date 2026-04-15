'use client';

import { useState } from 'react';
import { chf } from '@lafattoria/utils/formatters';
import type { MonthRevenue } from '../lib/types';
import { MONTHS_SHORT_IT } from '../lib/types';

interface MonthChartProps {
  data: MonthRevenue[];
  currentYear: number;
}

export function MonthChart({ data, currentYear }: MonthChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const currentMonth = new Date().getMonth() + 1;
  const isCurrentYear = currentYear === new Date().getFullYear();

  const maxInvoiced = Math.max(...data.map((d) => d.invoiced), 1);

  return (
    <div className="rounded-lg border border-border bg-white p-4">
      {/* Chart */}
      <div className="relative h-48">
        <div className="flex h-full items-end gap-1">
          {data.map((d, i) => {
            const isFuture = isCurrentYear && d.month > currentMonth;
            const isHovered = hoveredIndex === i;
            const total = d.paid + d.pending + d.overdue;
            const heightPct = (d.invoiced / maxInvoiced) * 100;

            // Calculate stacked heights
            const paidPct = total > 0 ? (d.paid / d.invoiced) * 100 : 0;
            const pendingPct = total > 0 ? (d.pending / d.invoiced) * 100 : 0;
            const overduePct = total > 0 ? (d.overdue / d.invoiced) * 100 : 0;

            return (
              <div
                key={d.month}
                className="relative flex flex-1 flex-col items-center"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip */}
                {isHovered && d.invoiced > 0 && (
                  <Tooltip data={d} />
                )}

                {/* Stacked bar */}
                <div
                  className="relative w-full max-w-[24px] overflow-hidden rounded-t"
                  style={{
                    height: `${heightPct}%`,
                    minHeight: d.invoiced > 0 ? '4px' : '0',
                  }}
                >
                  {isFuture ? (
                    <div className="h-full w-full border-2 border-dashed border-muted" />
                  ) : (
                    <div className="flex h-full w-full flex-col-reverse">
                      <div
                        className="bg-paid transition-all"
                        style={{ height: `${paidPct}%` }}
                      />
                      <div
                        className="bg-pending transition-all"
                        style={{ height: `${pendingPct}%` }}
                      />
                      <div
                        className="bg-overdue transition-all"
                        style={{ height: `${overduePct}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Month label */}
                <span className="mt-2 text-[10px] text-muted">
                  {MONTHS_SHORT_IT[d.month - 1]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-paid" />
          <span className="text-muted">Pagato</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-pending" />
          <span className="text-muted">In attesa</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm bg-overdue" />
          <span className="text-muted">Scaduto</span>
        </div>
      </div>
    </div>
  );
}

function Tooltip({ data }: { data: MonthRevenue }) {
  return (
    <div className="absolute -top-24 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-3 py-2 text-xs text-white shadow-lg">
      <p className="font-semibold">{MONTHS_SHORT_IT[data.month - 1]}</p>
      <p>Fatturato: {chf(data.invoiced)}</p>
      <p className="text-paid-light">Pagato: {chf(data.paid)}</p>
      <p className="text-pending-light">In attesa: {chf(data.pending)}</p>
      <p className="text-overdue-light">Scaduto: {chf(data.overdue)}</p>
      <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-foreground" />
    </div>
  );
}
