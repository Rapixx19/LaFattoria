'use client';

import { useState } from 'react';
import { chf } from '@lafattoria/utils/formatters';
import type { ClientRevenue, ServiceRevenue } from '../lib/types';

interface BreakdownTableProps {
  clientData: ClientRevenue[];
  serviceData: ServiceRevenue[];
}

type Tab = 'client' | 'service';

export function BreakdownTable({ clientData, serviceData }: BreakdownTableProps) {
  const [activeTab, setActiveTab] = useState<Tab>('client');

  return (
    <div className="rounded-lg border border-border bg-white">
      {/* Tabs */}
      <div className="flex border-b border-border">
        <TabButton
          active={activeTab === 'client'}
          onClick={() => setActiveTab('client')}
        >
          Per Cliente
        </TabButton>
        <TabButton
          active={activeTab === 'service'}
          onClick={() => setActiveTab('service')}
        >
          Per Servizio
        </TabButton>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'client' ? (
          <ClientTable data={clientData} />
        ) : (
          <ServiceTable data={serviceData} />
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
        active
          ? 'border-b-2 border-primary text-primary'
          : 'text-muted hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}

function ClientTable({ data }: { data: ClientRevenue[] }) {
  if (data.length === 0) {
    return <EmptyState message="Nessun dato clienti" />;
  }

  return (
    <div className="space-y-2">
      {data.map((row, i) => (
        <div
          key={row.client_id}
          className="flex items-center justify-between rounded-sm bg-cream px-3 py-2"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted">#{i + 1}</span>
            <span className="font-medium text-foreground">{row.client_name}</span>
          </div>
          <div className="text-right">
            <p className="font-mono text-sm font-semibold text-foreground">
              {chf(row.total_invoiced)}
            </p>
            <p className="text-xs text-muted">
              {row.bill_count} fattur{row.bill_count === 1 ? 'a' : 'e'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ServiceTable({ data }: { data: ServiceRevenue[] }) {
  if (data.length === 0) {
    return <EmptyState message="Nessun dato servizi" />;
  }

  return (
    <div className="space-y-2">
      {data.map((row, i) => (
        <div
          key={row.service_name}
          className="flex items-center justify-between rounded-sm bg-cream px-3 py-2"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted">#{i + 1}</span>
            <span className="font-medium text-foreground">{row.service_name}</span>
          </div>
          <div className="text-right">
            <p className="font-mono text-sm font-semibold text-foreground">
              {chf(row.total_revenue)}
            </p>
            <p className="text-xs text-muted">{row.usage_count}x utilizzi</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="py-8 text-center text-sm text-muted">{message}</p>
  );
}
