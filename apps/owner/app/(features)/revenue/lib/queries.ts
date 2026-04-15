import { createServerClient } from '@/lib/supabase/server';
import type { MonthRevenue, ClientRevenue, ServiceRevenue } from './types';

interface BillItem {
  name: string;
  subtotal: number;
}

interface BillRow {
  client_id: string;
  items: BillItem[];
  clients: { name: string } | null;
}

interface RpcResult {
  month: number;
  bill_count: number;
  invoiced: number;
  paid: number;
  pending: number;
  overdue: number;
}

/**
 * Get revenue by month for a given year (calls DB function)
 */
export async function getRevenueByMonth(year: number): Promise<MonthRevenue[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase.rpc('get_revenue_by_month', {
    p_year: year,
  } as never);

  if (error) throw error;

  const rpcData = data as RpcResult[] | null;

  // Ensure all 12 months are represented
  const result: MonthRevenue[] = [];
  for (let month = 1; month <= 12; month++) {
    const found = rpcData?.find((d) => d.month === month);
    result.push(
      found ?? {
        month,
        bill_count: 0,
        invoiced: 0,
        paid: 0,
        pending: 0,
        overdue: 0,
      }
    );
  }

  return result;
}

/**
 * Get revenue breakdown by client for a year
 */
export async function getRevenueByClient(year: number): Promise<ClientRevenue[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('bills')
    .select('client_id, items, paid_amount, clients(name)')
    .eq('year', year);

  if (error) throw error;

  const bills = (data ?? []) as unknown as (BillRow & { paid_amount: number | null })[];

  // Aggregate by client
  const clientMap = new Map<string, ClientRevenue>();

  for (const bill of bills) {
    const clientId = bill.client_id;
    const clientName = bill.clients?.name ?? 'Sconosciuto';
    const items = (bill.items ?? []) as BillItem[];
    const invoiced = items.reduce((sum, item) => sum + (item.subtotal ?? 0), 0);
    const paid = bill.paid_amount ?? 0;

    const existing = clientMap.get(clientId);
    if (existing) {
      existing.total_invoiced += invoiced;
      existing.total_paid += paid;
      existing.bill_count += 1;
    } else {
      clientMap.set(clientId, {
        client_id: clientId,
        client_name: clientName,
        total_invoiced: invoiced,
        total_paid: paid,
        bill_count: 1,
      });
    }
  }

  return Array.from(clientMap.values())
    .sort((a, b) => b.total_invoiced - a.total_invoiced)
    .slice(0, 10);
}

/**
 * Get revenue breakdown by service for a year
 */
export async function getRevenueByService(year: number): Promise<ServiceRevenue[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('bills')
    .select('items')
    .eq('year', year);

  if (error) throw error;

  const bills = (data ?? []) as unknown as { items: BillItem[] }[];

  // Aggregate by service name
  const serviceMap = new Map<string, ServiceRevenue>();

  for (const bill of bills) {
    const items = (bill.items ?? []) as BillItem[];
    for (const item of items) {
      const name = item.name ?? 'Sconosciuto';
      const revenue = item.subtotal ?? 0;

      const existing = serviceMap.get(name);
      if (existing) {
        existing.total_revenue += revenue;
        existing.usage_count += 1;
      } else {
        serviceMap.set(name, {
          service_name: name,
          total_revenue: revenue,
          usage_count: 1,
        });
      }
    }
  }

  return Array.from(serviceMap.values())
    .sort((a, b) => b.total_revenue - a.total_revenue)
    .slice(0, 10);
}

/**
 * Get available years for revenue filtering
 */
export async function getAvailableYears(): Promise<number[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase.from('bills').select('year');

  if (error) throw error;

  if (!data || data.length === 0) return [new Date().getFullYear()];
  const years = [...new Set(data.map((b: { year: number }) => b.year))].sort(
    (a, b) => b - a
  );
  return years;
}
