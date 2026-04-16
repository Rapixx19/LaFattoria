import { requireAuth } from '@/lib/auth';
import { getRevenueByMonth, getRevenueByClient, getRevenueByService, getAvailableYears } from './lib/queries';
import { YearSelector } from './components/year-selector';
import { MonthChart } from './components/month-chart';
import { RunningTotals } from './components/running-totals';
import { BreakdownTable } from './components/breakdown-table';
import { BatchImportButton } from './components/batch-import-form';

interface PageProps {
  searchParams: Promise<{ year?: string }>;
}

export default async function RevenuePage({ searchParams }: PageProps) {
  await requireAuth();

  const params = await searchParams;
  const years = await getAvailableYears();
  const currentYear = params.year ? parseInt(params.year, 10) : years[0] ?? new Date().getFullYear();

  const [monthData, clientData, serviceData] = await Promise.all([
    getRevenueByMonth(currentYear),
    getRevenueByClient(currentYear),
    getRevenueByService(currentYear),
  ]);

  return (
    <main className="min-h-screen bg-cream">
      <header className="bg-primary px-4 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-lg font-bold">Ricavi</h1>
            <p className="text-sm text-primary-light">Analisi entrate</p>
          </div>
          <div className="flex items-center gap-3">
            <YearSelector years={years} currentYear={currentYear} />
            <BatchImportButton />
          </div>
        </div>
      </header>

      <div className="space-y-4 p-4">
        {/* Running Totals */}
        <RunningTotals data={monthData} />

        {/* Month Chart */}
        <MonthChart data={monthData} currentYear={currentYear} />

        {/* Breakdown Tables */}
        <BreakdownTable clientData={clientData} serviceData={serviceData} />
      </div>
    </main>
  );
}
