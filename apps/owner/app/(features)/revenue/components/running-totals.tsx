import { chf } from '@lafattoria/utils/formatters';
import type { MonthRevenue } from '../lib/types';

interface RunningTotalsProps {
  data: MonthRevenue[];
}

export function RunningTotals({ data }: RunningTotalsProps) {
  const totals = data.reduce(
    (acc, d) => ({
      invoiced: acc.invoiced + d.invoiced,
      paid: acc.paid + d.paid,
      outstanding: acc.outstanding + d.pending + d.overdue,
    }),
    { invoiced: 0, paid: 0, outstanding: 0 }
  );

  return (
    <div className="grid grid-cols-3 gap-3">
      <Card label="Fatturato" value={totals.invoiced} variant="default" />
      <Card label="Incassato" value={totals.paid} variant="paid" />
      <Card label="Da incassare" value={totals.outstanding} variant="warning" />
    </div>
  );
}

interface CardProps {
  label: string;
  value: number;
  variant: 'default' | 'paid' | 'warning';
}

function Card({ label, value, variant }: CardProps) {
  const valueColorClass = {
    default: 'text-foreground',
    paid: 'text-paid',
    warning: 'text-pending',
  }[variant];

  return (
    <div className="rounded-lg border border-border bg-white p-3">
      <p className="text-xs uppercase text-muted">{label}</p>
      <p className={`font-mono text-lg font-semibold ${valueColorClass}`}>
        {chf(value)}
      </p>
    </div>
  );
}
