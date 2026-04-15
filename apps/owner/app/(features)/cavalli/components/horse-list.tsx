import { HorseRow } from './horse-row';
import type { HorseWithClient } from '../lib/types';

interface HorseListProps {
  horses: HorseWithClient[];
}

export function HorseList({ horses }: HorseListProps) {
  if (horses.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-white p-8 text-center">
        <p className="text-muted">Nessun cavallo registrato</p>
        <p className="mt-2 text-sm text-muted">
          Clicca &quot;+ Aggiungi&quot; per registrare un nuovo cavallo
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-cream">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted">
              Nome
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted">
              Proprietario
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted">
              Box
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium uppercase text-muted">
              Stato
            </th>
          </tr>
        </thead>
        <tbody>
          {horses.map((horse) => (
            <HorseRow key={horse.id} horse={horse} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
