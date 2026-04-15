import { createServerClient } from '@/lib/supabase/server';
import { calcBillTotals } from '../../billing/lib/calc';
import type { BillItem } from '../../billing/lib/types';
import type { Client, ClientWithStats, ClientFilters, ClientStats, SpendData, Horse } from './types';
import { MONTHS_SHORT_IT } from '@lafattoria/utils/types';

interface BillRow {
  status: string;
  paid_amount: number | null;
  items: unknown;
  date: string;
}

interface BillRowWithClient extends BillRow {
  client_id: string;
}

/**
 * Get all clients with optional filters and stats
 */
export async function getClientsWithStats(
  filters: ClientFilters = {}
): Promise<ClientWithStats[]> {
  const supabase = await createServerClient();

  let clientQuery = supabase
    .from('clients')
    .select(`
      *,
      horses (*)
    `)
    .order('name');

  if (filters.status === 'active') {
    clientQuery = clientQuery.eq('active', true);
  } else if (filters.status === 'inactive') {
    clientQuery = clientQuery.eq('active', false);
  }

  const { data: clients, error: clientError } = await clientQuery;

  if (clientError) throw clientError;
  if (!clients) return [];

  // Get all bills to compute stats
  const { data: bills, error: billError } = await supabase
    .from('bills')
    .select('client_id, status, paid_amount, items, date');

  if (billError) throw billError;

  const billsByClient = new Map<string, BillRow[]>();
  for (const bill of (bills ?? []) as unknown as BillRowWithClient[]) {
    const clientId = bill.client_id;
    if (!billsByClient.has(clientId)) {
      billsByClient.set(clientId, []);
    }
    billsByClient.get(clientId)!.push(bill);
  }

  return (clients as unknown as (Client & { horses: Horse[] })[]).map((client) => {
    const clientBills = billsByClient.get(client.id) ?? [];
    const stats = computeClientStats(clientBills);
    return {
      ...client,
      stats,
    };
  });
}

/**
 * Get a single client with stats and horses
 */
export async function getClientWithStats(id: string): Promise<ClientWithStats | null> {
  const supabase = await createServerClient();

  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select(`
      *,
      horses (*)
    `)
    .eq('id', id)
    .single();

  if (clientError) {
    if (clientError.code === 'PGRST116') return null;
    throw clientError;
  }

  const { data: bills, error: billError } = await supabase
    .from('bills')
    .select('status, paid_amount, items, date')
    .eq('client_id', id);

  if (billError) throw billError;

  const stats = computeClientStats((bills ?? []) as unknown as BillRow[]);

  return {
    ...(client as unknown as Client),
    horses: (client as unknown as { horses: Horse[] }).horses ?? [],
    stats,
  };
}

/**
 * Get bills for a specific client
 */
export async function getClientBills(clientId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('bills')
    .select('*')
    .eq('client_id', clientId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/**
 * Get spend data for the last 12 months
 */
export async function getClientSpendData(clientId: string): Promise<SpendData[]> {
  const supabase = await createServerClient();

  // Get all bills for this client
  const { data: bills, error } = await supabase
    .from('bills')
    .select('status, paid_amount, items, date')
    .eq('client_id', clientId)
    .order('date', { ascending: false });

  if (error) throw error;

  // Generate last 12 months
  const now = new Date();
  const months: SpendData[] = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      month: MONTHS_SHORT_IT[d.getMonth()],
      year: d.getFullYear(),
      monthIndex: d.getMonth(),
      invoiced: 0,
      paid: 0,
    });
  }

  // Aggregate bills into months
  for (const bill of (bills ?? []) as unknown as BillRow[]) {
    const billDate = new Date(bill.date);
    const billMonth = billDate.getMonth();
    const billYear = billDate.getFullYear();

    const monthData = months.find(
      (m) => m.monthIndex === billMonth && m.year === billYear
    );

    if (monthData) {
      const items = bill.items as BillItem[];
      const totals = calcBillTotals(items);
      monthData.invoiced += totals.total;

      if (bill.status === 'paid' && bill.paid_amount) {
        monthData.paid += bill.paid_amount;
      }
    }
  }

  // Round values
  return months.map((m) => ({
    ...m,
    invoiced: Math.round(m.invoiced * 100) / 100,
    paid: Math.round(m.paid * 100) / 100,
  }));
}

/**
 * Compute stats from bills
 */
function computeClientStats(bills: BillRow[]): ClientStats {
  let totalPaid = 0;
  let outstanding = 0;
  let lastBillDate: string | null = null;

  for (const bill of bills) {
    const items = bill.items as BillItem[];
    const totals = calcBillTotals(items);

    if (bill.status === 'paid') {
      totalPaid += bill.paid_amount ?? totals.total;
    } else {
      outstanding += totals.total - (bill.paid_amount ?? 0);
    }

    if (!lastBillDate || bill.date > lastBillDate) {
      lastBillDate = bill.date;
    }
  }

  return {
    totalPaid: Math.round(totalPaid * 100) / 100,
    outstanding: Math.round(outstanding * 100) / 100,
    billCount: bills.length,
    lastBillDate,
  };
}
