'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { calcBillTotals } from './calc';
import { getNextBillNumber } from './queries';
import type { CreateBillInput, ClientSnapshot, BillItem, Bill } from './types';

interface ClientData {
  name: string;
  address: string | null;
  email: string | null;
  phone: string | null;
}

/**
 * Create a new bill
 */
export async function createBill(input: CreateBillInput): Promise<Bill> {
  const supabase = await createServerClient();

  // Get client data for snapshot
  const { data: clientData, error: clientError } = await supabase
    .from('clients')
    .select('name, address, email, phone')
    .eq('id', input.clientId)
    .single();

  if (clientError || !clientData) {
    throw new Error('Cliente non trovato');
  }

  const client = clientData as unknown as ClientData;

  const clientSnapshot: ClientSnapshot = {
    name: client.name,
    address: client.address ?? null,
    email: client.email ?? null,
    phone: client.phone ?? null,
  };

  // Calculate totals
  const totals = calcBillTotals(input.items);

  // Get date info
  const billDate = new Date(input.date);
  const year = billDate.getFullYear();

  // Generate bill number
  const billNumber = await getNextBillNumber(year);

  // Determine status
  const status = input.paidAmount && input.paidAmount >= totals.total
    ? 'paid'
    : 'pending';

  // Create bill - use raw SQL through rpc or type assertion
  const insertData = {
    number: billNumber,
    year,
    type: input.type,
    source: 'created',
    client_id: input.clientId,
    client_snapshot: clientSnapshot,
    date: input.date,
    period: input.period,
    items: input.items,
    status,
    paid_amount: input.paidAmount,
    paid_date: input.paidAmount ? input.date : null,
    notes: input.notes,
  };

  const { data: bill, error } = await supabase
    .from('bills')
    .insert(insertData as never)
    .select()
    .single();

  if (error || !bill) {
    throw new Error(`Errore nella creazione della fattura: ${error?.message ?? 'Unknown error'}`);
  }

  revalidatePath('/billing');
  return bill as unknown as Bill;
}

/**
 * Mark a bill as paid
 */
export async function markBillPaid(
  billId: string,
  paidAmount: number,
  paidDate: string,
  notes?: string
): Promise<void> {
  const supabase = await createServerClient();

  // Get current bill to calculate if fully paid
  const { data: currentBill, error: fetchError } = await supabase
    .from('bills')
    .select('items')
    .eq('id', billId)
    .single();

  if (fetchError || !currentBill) {
    throw new Error('Fattura non trovata');
  }

  const billData = currentBill as unknown as { items: BillItem[] };
  const items = billData.items;
  const totals = calcBillTotals(items);
  const status = paidAmount >= totals.total ? 'paid' : 'pending';

  const updateData = {
    status,
    paid_amount: paidAmount,
    paid_date: paidDate,
    notes: notes || null,
  };

  const { error } = await supabase
    .from('bills')
    .update(updateData as never)
    .eq('id', billId);

  if (error) {
    throw new Error(`Errore nell'aggiornamento: ${error.message}`);
  }

  revalidatePath('/billing');
  revalidatePath(`/billing/${billId}`);
}
