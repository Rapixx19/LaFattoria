'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { calcBillTotals } from '../../billing/lib/calc';
import type { ImportBillInput } from './types';
import type { Bill, ClientSnapshot } from '../../billing/lib/types';

interface ClientData {
  name: string;
  address: string | null;
  email: string | null;
  phone: string | null;
}

/**
 * Get the next import bill number for a given year
 */
async function getNextImportNumber(year: number): Promise<string> {
  const supabase = await createServerClient();

  const { count, error } = await supabase
    .from('bills')
    .select('*', { count: 'exact', head: true })
    .eq('year', year)
    .eq('source', 'imported');

  if (error) throw error;

  const sequence = (count ?? 0) + 1;
  return `IMP-${year}-${String(sequence).padStart(3, '0')}`;
}

/**
 * Import a historical bill
 */
export async function importBill(input: ImportBillInput): Promise<Bill> {
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

  // Generate import bill number
  const billNumber = await getNextImportNumber(year);

  // Determine status
  let status: 'paid' | 'pending' | 'overdue' = 'pending';
  if (input.paidAmount && input.paidAmount >= totals.total) {
    status = 'paid';
  } else if (billDate < new Date()) {
    status = 'overdue';
  }

  const insertData = {
    number: billNumber,
    year,
    type: input.type,
    source: 'imported',
    client_id: input.clientId,
    client_snapshot: clientSnapshot,
    date: input.date,
    period: input.period,
    items: input.items,
    status,
    paid_amount: input.paidAmount,
    paid_date: input.paidDate,
    notes: input.notes,
  };

  const { data: bill, error } = await supabase
    .from('bills')
    .insert(insertData as never)
    .select()
    .single();

  if (error || !bill) {
    throw new Error(`Errore nell'importazione: ${error?.message ?? 'Unknown'}`);
  }

  revalidatePath('/revenue');
  revalidatePath('/billing');
  return bill as unknown as Bill;
}
