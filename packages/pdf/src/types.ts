export interface InvoiceItem {
  art: string;
  name: string;
  desc: string;
  unit: string;
  price: number;
  qty: number;
  vat: number;
  subtotal: number;
}

export interface ClientSnapshot {
  name: string;
  address: string | null;
  email: string | null;
  phone: string | null;
}

export interface InvoiceData {
  number: string;
  date: string;
  period: string | null;
  type: 'mensile' | 'extra' | 'imported';
  client: ClientSnapshot;
  items: InvoiceItem[];
  net: number;
  vatMap: Record<number, number>;
  vatTotal: number;
  total: number;
  paidAmount: number | null;
  notes: string | null;
}
