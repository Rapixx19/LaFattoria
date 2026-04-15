import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { renderInvoicePdf } from '@lafattoria/pdf';
import type { InvoiceData, InvoiceItem, ClientSnapshot } from '@lafattoria/pdf';

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface BillData {
  id: string;
  number: string;
  date: string;
  period: string | null;
  type: string;
  items: InvoiceItem[];
  client_snapshot: ClientSnapshot;
  paid_amount: number | null;
  notes: string | null;
}

function calcBillTotals(items: InvoiceItem[]) {
  const vatMap: Record<number, number> = {};
  let net = 0;

  for (const item of items) {
    const subtotal = item.price * item.qty;
    net += subtotal;
    if (item.vat > 0) {
      vatMap[item.vat] = (vatMap[item.vat] ?? 0) + subtotal * item.vat / 100;
    }
  }

  const vatTotal = Object.values(vatMap).reduce((a, b) => a + b, 0);
  return {
    net: Math.round(net * 100) / 100,
    vatMap,
    vatTotal: Math.round(vatTotal * 100) / 100,
    total: Math.round((net + vatTotal) * 100) / 100,
  };
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createServerClient();

  // Fetch bill
  const { data: billData, error } = await supabase
    .from('bills')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !billData) {
    return NextResponse.json(
      { error: 'Fattura non trovata' },
      { status: 404 }
    );
  }

  const bill = billData as unknown as BillData;
  const items = bill.items;
  const client = bill.client_snapshot;
  const totals = calcBillTotals(items);

  const invoiceData: InvoiceData = {
    number: bill.number,
    date: bill.date,
    period: bill.period,
    type: bill.type as 'mensile' | 'extra' | 'imported',
    client,
    items,
    net: totals.net,
    vatMap: totals.vatMap,
    vatTotal: totals.vatTotal,
    total: totals.total,
    paidAmount: bill.paid_amount,
    notes: bill.notes,
  };

  try {
    const pdfBuffer = await renderInvoicePdf(invoiceData);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Fattura-${bill.number}.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('PDF generation error:', err);
    return NextResponse.json(
      { error: 'Errore nella generazione del PDF' },
      { status: 500 }
    );
  }
}
