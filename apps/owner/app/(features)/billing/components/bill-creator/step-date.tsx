'use client';

import { getPeriodFromDate } from '../../lib/calc';
import type { BillType } from '../../lib/types';

interface StepDateProps {
  type: BillType;
  date: string;
  period: string;
  onDateChange: (date: string) => void;
  onPeriodChange: (period: string) => void;
}

const MONTHS = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

export function StepDate({
  type,
  date,
  period,
  onDateChange,
  onPeriodChange,
}: StepDateProps) {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  // Extract month/year from period
  const periodParts = period.split(' ');
  const periodMonth = MONTHS.indexOf(periodParts[0]) + 1 || new Date().getMonth() + 1;
  const periodYear = parseInt(periodParts[1], 10) || currentYear;

  const handleMonthChange = (month: number) => {
    const newPeriod = `${MONTHS[month - 1]} ${periodYear}`;
    onPeriodChange(newPeriod);
  };

  const handleYearChange = (year: number) => {
    const newPeriod = `${MONTHS[periodMonth - 1]} ${year}`;
    onPeriodChange(newPeriod);
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold text-primary">
        Data e Periodo
      </h2>

      {/* Invoice Date */}
      <div>
        <label className="mb-1 block text-sm text-muted">
          Data fattura
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full rounded border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Period (for Mensile only) */}
      {type === 'mensile' && (
        <div>
          <label className="mb-1 block text-sm text-muted">
            Periodo di riferimento
          </label>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={periodMonth}
              onChange={(e) => handleMonthChange(parseInt(e.target.value, 10))}
              className="rounded border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {MONTHS.map((month, idx) => (
                <option key={month} value={idx + 1}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={periodYear}
              onChange={(e) => handleYearChange(parseInt(e.target.value, 10))}
              className="rounded border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-2 text-xs text-muted">
            Periodo selezionato: <strong>{period}</strong>
          </p>
        </div>
      )}

      {type === 'extra' && (
        <p className="text-sm text-muted">
          Le fatture extra non hanno un periodo di riferimento fisso.
        </p>
      )}
    </div>
  );
}
