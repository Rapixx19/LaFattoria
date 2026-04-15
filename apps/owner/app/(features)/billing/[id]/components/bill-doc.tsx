import { chf, fmtDate } from '@lafattoria/utils/formatters';
import { calcBillTotals } from '../../lib/calc';
import type { BillItem, ClientSnapshot } from '../../lib/types';

const COMPANY = {
  name: 'C.H.C. Horses SA',
  address: 'Via Ressiga 7',
  city: '6514 Sementina',
  phone: '+41 76 339 38 65',
  iban: 'CH40 0900 0000 6947 0789 7',
  che: 'CHE-115.295.448',
  owner: 'Gianluca Agustoni',
};

interface BillDocProps {
  number: string;
  date: string;
  period: string | null;
  client: ClientSnapshot;
  items: BillItem[];
  paidAmount: number | null;
  notes: string | null;
}

export function BillDoc({
  number,
  date,
  period,
  client,
  items,
  paidAmount,
  notes,
}: BillDocProps) {
  const totals = calcBillTotals(items);
  const balance = totals.total - (paidAmount ?? 0);

  return (
    <div className="mx-auto max-w-3xl rounded-lg border border-border bg-white p-8 shadow-md print:border-none print:shadow-none">
      {/* Header */}
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">
            FATTURA
          </h1>
          <p className="mt-1 font-mono text-lg">N. {number}</p>
          <p className="text-sm text-muted">Data: {fmtDate(date)}</p>
          {period && <p className="text-sm text-muted">Periodo: {period}</p>}
        </div>
        <div className="text-right text-sm text-muted">
          <p className="font-bold text-neutral-900">{COMPANY.name}</p>
          <p>{COMPANY.address}</p>
          <p>{COMPANY.city}</p>
          <p>Tel: {COMPANY.phone}</p>
          <p className="mt-1">{COMPANY.che}</p>
        </div>
      </div>

      {/* Client */}
      <div className="mb-6 rounded border border-border bg-cream p-4">
        <p className="font-bold">{client.name}</p>
        {client.address && <p className="text-sm">{client.address}</p>}
      </div>

      {/* Items Table */}
      <table className="mb-6 w-full text-sm">
        <thead>
          <tr className="border-b-2 border-primary">
            <th className="py-2 text-left">Art.</th>
            <th className="py-2 text-left">Prestazione</th>
            <th className="py-2 text-left">Descrizione</th>
            <th className="py-2 text-left">Unità</th>
            <th className="py-2 text-right">Prezzo</th>
            <th className="py-2 text-center">Qtà</th>
            <th className="py-2 text-right">IVA</th>
            <th className="py-2 text-right">Totale</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} className="border-b border-border">
              <td className="py-2 font-mono text-xs">{item.art}</td>
              <td className="py-2">{item.name}</td>
              <td className="py-2 text-muted">{item.desc}</td>
              <td className="py-2">{item.unit}</td>
              <td className="py-2 text-right font-mono">{chf(item.price)}</td>
              <td className="py-2 text-center">{item.qty}</td>
              <td className="py-2 text-right">
                {item.vat > 0 ? `${item.vat}%` : '-'}
              </td>
              <td className="py-2 text-right font-mono">{chf(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mb-6 flex justify-end">
        <div className="w-64 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Netto:</span>
            <span className="font-mono">{chf(totals.net)}</span>
          </div>
          {Object.entries(totals.vatMap).map(([rate, amount]) => (
            <div key={rate} className="flex justify-between">
              <span className="text-muted">IVA {rate}%:</span>
              <span className="font-mono">{chf(amount)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-primary pt-2 text-base font-bold">
            <span>TOTALE:</span>
            <span className="font-mono">{chf(totals.total)}</span>
          </div>
          {paidAmount !== null && paidAmount > 0 && (
            <>
              <div className="flex justify-between text-paid">
                <span>Vs. Versamento:</span>
                <span className="font-mono">{chf(paidAmount)}</span>
              </div>
              <div className="flex justify-between border-t border-primary pt-2 font-bold">
                <span>A SALDO:</span>
                <span className="font-mono">{chf(balance)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div className="mb-6 rounded border border-border bg-cream p-4 text-sm italic">
          {notes}
        </div>
      )}

      {/* Payment Info */}
      <div className="rounded border border-border bg-neutral-100 p-4 text-sm">
        <p className="mb-2 font-bold">Coordinate di pagamento</p>
        <p>IBAN: {COMPANY.iban}</p>
        <p>Intestato a: {COMPANY.name}</p>
        <p>Riferimento: Fattura N. {number}</p>
      </div>

      {/* Footer */}
      <div className="mt-8 border-t border-border pt-4 text-center text-xs text-muted">
        {COMPANY.name} • {COMPANY.address}, {COMPANY.city} • {COMPANY.che}
      </div>
    </div>
  );
}
