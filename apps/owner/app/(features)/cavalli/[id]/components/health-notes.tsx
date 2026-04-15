import type { HorseWithClient } from '../../lib/types';

interface HealthNotesProps {
  horse: HorseWithClient;
}

function formatFarrierDate(date: string | null): string {
  if (!date) return 'Non impostata';

  const farrierDate = new Date(date);
  const today = new Date();
  const diffTime = farrierDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const formatted = farrierDate.toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (diffDays < 0) {
    return `${formatted} (${Math.abs(diffDays)} giorni fa)`;
  } else if (diffDays === 0) {
    return `${formatted} (oggi)`;
  } else {
    return `${formatted} (tra ${diffDays} giorni)`;
  }
}

export function HealthNotes({ horse }: HealthNotesProps) {
  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-border bg-white p-4">
        <h3 className="mb-2 text-sm font-medium uppercase text-muted">
          Note alimentazione
        </h3>
        <p className="text-sm text-foreground">
          {horse.diet_notes || 'Nessuna nota registrata'}
        </p>
      </section>

      <section className="rounded-lg border border-border bg-white p-4">
        <h3 className="mb-2 text-sm font-medium uppercase text-muted">
          Note veterinario
        </h3>
        <p className="text-sm text-foreground">
          {horse.vet_notes || 'Nessuna nota registrata'}
        </p>
      </section>

      <section className="rounded-lg border border-border bg-white p-4">
        <h3 className="mb-2 text-sm font-medium uppercase text-muted">
          Prossimo maniscalco
        </h3>
        <p className="text-sm text-foreground">
          {formatFarrierDate(horse.farrier_date)}
        </p>
      </section>
    </div>
  );
}
