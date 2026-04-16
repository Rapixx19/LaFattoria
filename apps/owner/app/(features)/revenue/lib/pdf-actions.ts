'use server';

import { revalidatePath } from 'next/cache';
import Anthropic from '@anthropic-ai/sdk';
import { PDFParse } from 'pdf-parse';
import { getClients, getServices } from '../../billing/lib/queries';
import { importBill } from './actions';
import type { ExtractedInvoice, ExtractedItem } from './types';
import type { Client, Service } from '../../billing/lib/types';

const anthropic = new Anthropic();

interface ParsedInvoice {
  clientName: string;
  date: string;
  items: ExtractedItem[];
  total: number;
}

async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();
  return result.text;
}

function matchClient(name: string, clients: Client[]): string | null {
  const normalized = name.toLowerCase().trim();
  const match = clients.find((c) => c.name.toLowerCase().includes(normalized) ||
    normalized.includes(c.name.toLowerCase()));
  return match?.id ?? null;
}

function matchService(itemName: string, services: Service[]): string | null {
  const normalized = itemName.toLowerCase().trim();
  const match = services.find((s) => s.name.toLowerCase().includes(normalized) ||
    normalized.includes(s.name.toLowerCase()));
  return match?.id ?? null;
}

async function parseInvoiceWithAI(text: string): Promise<ParsedInvoice> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Estrai i dati da questa fattura. Rispondi SOLO con JSON valido:
{"clientName":"nome cliente","date":"YYYY-MM-DD","items":[{"name":"servizio","qty":1,"price":100,"subtotal":100}],"total":100}

Fattura:
${text.slice(0, 4000)}`
    }]
  });

  const content = response.content[0];
  if (content.type !== 'text') throw new Error('Risposta AI non valida');

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('JSON non trovato nella risposta');

  return JSON.parse(jsonMatch[0]) as ParsedInvoice;
}

export async function parsePdfFiles(formData: FormData): Promise<ExtractedInvoice[]> {
  const files = formData.getAll('files') as File[];
  const [clients, services] = await Promise.all([getClients(), getServices()]);

  const results: ExtractedInvoice[] = [];

  for (const file of files) {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const text = await extractTextFromPdf(buffer);
      const parsed = await parseInvoiceWithAI(text);

      const matchedClientId = matchClient(parsed.clientName, clients);
      const matchedServiceId = parsed.items[0]
        ? matchService(parsed.items[0].name, services)
        : null;

      results.push({
        fileName: file.name,
        clientName: parsed.clientName,
        date: parsed.date,
        items: parsed.items,
        total: parsed.total,
        matchedClientId,
        matchedServiceId,
        status: matchedClientId ? 'ready' : 'needs_review',
      });
    } catch (err) {
      results.push({
        fileName: file.name,
        clientName: '',
        date: new Date().toISOString().split('T')[0],
        items: [],
        total: 0,
        matchedClientId: null,
        matchedServiceId: null,
        status: 'error',
        error: err instanceof Error ? err.message : 'Errore di parsing',
      });
    }
  }

  return results;
}

export async function importParsedInvoices(
  invoices: ExtractedInvoice[]
): Promise<{ imported: number; errors: string[] }> {
  const services = await getServices();
  const errors: string[] = [];
  let imported = 0;

  for (const inv of invoices) {
    if (inv.status === 'error' || !inv.matchedClientId) {
      errors.push(`${inv.fileName}: cliente non trovato`);
      continue;
    }

    try {
      const service = inv.matchedServiceId
        ? services.find((s) => s.id === inv.matchedServiceId)
        : services[0];

      if (!service) {
        errors.push(`${inv.fileName}: servizio non trovato`);
        continue;
      }

      await importBill({
        type: 'mensile',
        clientId: inv.matchedClientId,
        date: inv.date,
        period: null,
        items: [{
          art: service.art_code,
          name: service.name,
          desc: '',
          unit: service.unit,
          price: inv.total,
          qty: 1,
          vat: service.vat_rate,
          subtotal: inv.total,
        }],
        paidAmount: inv.total,
        paidDate: inv.date,
        notes: `Importato da PDF: ${inv.fileName}`,
      });
      imported++;
    } catch (err) {
      errors.push(`${inv.fileName}: ${err instanceof Error ? err.message : 'errore'}`);
    }
  }

  revalidatePath('/revenue');
  return { imported, errors };
}
