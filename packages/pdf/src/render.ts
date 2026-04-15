import { renderToBuffer } from '@react-pdf/renderer';
import type { ReactElement } from 'react';
import { createElement } from 'react';
import { InvoiceDocument } from './invoice-doc';
import type { InvoiceData } from './types';

export async function renderInvoicePdf(data: InvoiceData): Promise<Buffer> {
  const element = createElement(InvoiceDocument, { data }) as ReactElement;
  const buffer = await renderToBuffer(element);
  return Buffer.from(buffer);
}
