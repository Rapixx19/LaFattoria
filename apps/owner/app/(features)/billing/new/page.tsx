'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase/client';
import { createBill } from '../lib/actions';
import { calcBillTotals, getPeriodFromDate } from '../lib/calc';
import { TotalsSummary } from '../components/totals-summary';
import { StepType } from '../components/bill-creator/step-type';
import { StepClient } from '../components/bill-creator/step-client';
import { StepDate } from '../components/bill-creator/step-date';
import { StepServices } from '../components/bill-creator/step-services';
import { StepPayment } from '../components/bill-creator/step-payment';
import type { BillType, BillItem, Client, Service } from '../lib/types';

const STEPS = ['Tipo', 'Cliente', 'Data', 'Prestazioni', 'Pagamento'];

export default function NewBillPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  // Form state
  const [type, setType] = useState<BillType>('mensile');
  const [clientId, setClientId] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [period, setPeriod] = useState(getPeriodFromDate(new Date()));
  const [items, setItems] = useState<BillItem[]>([]);
  const [paidAmount, setPaidAmount] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  // Load data
  useEffect(() => {
    const loadData = async () => {
      const supabase = createBrowserClient();

      const [clientsRes, servicesRes] = await Promise.all([
        supabase.from('clients').select('*').eq('active', true).order('name'),
        supabase.from('services').select('*').eq('active', true).order('sort_order'),
      ]);

      if (clientsRes.data) setClients(clientsRes.data);
      if (servicesRes.data) setServices(servicesRes.data);
    };

    loadData();
  }, []);

  const totals = calcBillTotals(items);

  const canProceed = () => {
    switch (step) {
      case 0: return true; // Type always selected
      case 1: return clientId !== null;
      case 2: return date !== '';
      case 3: return items.length > 0;
      case 4: return true; // Payment is optional
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!clientId) return;

    setLoading(true);
    setError(null);

    try {
      const bill = await createBill({
        type,
        clientId,
        date,
        period: type === 'mensile' ? period : null,
        items,
        paidAmount,
        notes: notes || null,
      });

      router.push(`/billing/${bill.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream">
      <header className="bg-primary px-4 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/billing"
              className="text-sm text-primary-light hover:underline"
            >
              &larr; Annulla
            </Link>
            <h1 className="font-display text-lg font-bold">Nuova Fattura</h1>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-border bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          {STEPS.map((s, idx) => (
            <div key={s} className="flex items-center">
              <button
                type="button"
                onClick={() => idx <= step && setStep(idx)}
                disabled={idx > step}
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                  idx === step
                    ? 'bg-primary text-white'
                    : idx < step
                    ? 'bg-status-paid text-white'
                    : 'bg-border text-muted'
                }`}
              >
                {idx < step ? '✓' : idx + 1}
              </button>
              <span
                className={`ml-2 hidden text-sm sm:inline ${
                  idx === step ? 'font-medium text-primary' : 'text-muted'
                }`}
              >
                {s}
              </span>
              {idx < STEPS.length - 1 && (
                <div className="mx-3 h-px w-4 bg-border sm:w-8" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        {error && (
          <div className="mb-4 rounded bg-status-overdue-bg p-3 text-sm text-status-overdue">
            {error}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          {/* Main content */}
          <div className="rounded-lg border border-border bg-white p-6">
            {step === 0 && <StepType value={type} onChange={setType} />}
            {step === 1 && (
              <StepClient
                clients={clients}
                value={clientId}
                onChange={setClientId}
              />
            )}
            {step === 2 && (
              <StepDate
                type={type}
                date={date}
                period={period}
                onDateChange={setDate}
                onPeriodChange={setPeriod}
              />
            )}
            {step === 3 && (
              <StepServices
                services={services}
                items={items}
                onChange={setItems}
              />
            )}
            {step === 4 && (
              <StepPayment
                total={totals.total}
                paidAmount={paidAmount}
                notes={notes}
                onPaidAmountChange={setPaidAmount}
                onNotesChange={setNotes}
              />
            )}

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 0}
                className="rounded px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-primary disabled:invisible"
              >
                &larr; Indietro
              </button>

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="rounded bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 active:scale-[0.97] disabled:opacity-50"
                >
                  Avanti &rarr;
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !canProceed()}
                  className="rounded bg-status-paid px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-status-paid/90 active:scale-[0.97] disabled:opacity-50"
                >
                  {loading ? 'Creazione...' : 'Crea Fattura'}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar - Totals */}
          <div className="space-y-4">
            <TotalsSummary totals={totals} paidAmount={paidAmount} />

            {clientId && (
              <div className="rounded-lg border border-border bg-white p-4">
                <h3 className="mb-2 text-xs font-medium uppercase text-muted">
                  Cliente
                </h3>
                <p className="text-sm font-medium">
                  {clients.find((c) => c.id === clientId)?.name}
                </p>
              </div>
            )}

            <div className="rounded-lg border border-border bg-white p-4">
              <h3 className="mb-2 text-xs font-medium uppercase text-muted">
                Tipo
              </h3>
              <p className="text-sm font-medium capitalize">{type}</p>
              {type === 'mensile' && (
                <p className="text-xs text-muted">{period}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
