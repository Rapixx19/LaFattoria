# Feature 02 — Billing & Invoices

**App:** Owner (app.lafattoria.ch)
**Depends on:** Feature 01 (Auth), Feature 03 (Clients), Feature 04 (Services)
**Integrates with:** Feature 05 (Revenue), Feature 10 (Client PDF view)

---

## Overview

Create, view and manage invoices. Two bill types:
- **Mensile** — monthly boarding/services bill
- **Extra** — ad-hoc sessions with dates in descriptions

Invoice format matches real La Fattoria documents exactly.

---

## Files to Create

```
apps/owner/app/(features)/billing/
├── page.tsx                      ← Bill list (all bills)
├── new/
│   └── page.tsx                  ← 5-step bill creator
├── [id]/
│   ├── page.tsx                  ← Bill view + print
│   └── components/
│       ├── bill-doc.tsx          ← Invoice HTML document
│       └── mark-paid-form.tsx    ← 'use client' inline pay form
├── components/
│   ├── bill-list.tsx             ← Table of all bills
│   ├── bill-filters.tsx          ← Status / year / client filter
│   ├── bill-creator/
│   │   ├── step-type.tsx         ← Step 1: Mensile/Extra
│   │   ├── step-client.tsx       ← Step 2: Select client
│   │   ├── step-date.tsx         ← Step 3: Date + period
│   │   ├── step-services.tsx     ← Step 4: Add line items
│   │   └── step-payment.tsx      ← Step 5: Versamento + notes
│   └── totals-summary.tsx        ← Live totals panel
└── lib/
    ├── queries.ts                ← getBills, getBill, createBill, etc.
    ├── actions.ts                ← Server Actions
    └── calc.ts                   ← calcTotals(), nextBillNumber()

apps/owner/app/api/bills/[id]/pdf/
└── route.ts                      ← GET → stream PDF

packages/pdf/
├── invoice-doc.tsx               ← @react-pdf/renderer component
├── render.ts                     ← renderToBuffer()
└── index.ts
```

---

## Data Shape

```ts
// From packages/supabase/types.ts
type BillItem = {
  art:      string   // '3210'
  name:     string   // 'Pensione'
  desc:     string   // 'Pensione Gennaio 2026' or 'Monta Lulu, GA 23.01'
  unit:     string   // 'al mese'
  price:    number   // 1365.00
  qty:      number   // 1
  vat:      number   // 8.1
}

type Bill = {
  id:              string
  number:          string   // '2026-001'
  year:            number
  type:            'mensile' | 'extra' | 'imported'
  source:          'created' | 'imported'
  client_id:       string
  client_snapshot: ClientSnapshot
  date:            string   // ISO date
  period:          string   // 'Gennaio 2026'
  items:           BillItem[]
  status:          'pending' | 'paid' | 'overdue'
  paid_amount:     number | null
  paid_date:       string | null
  notes:           string | null
  pdf_url:         string | null
  created_at:      string
}
```

---

## Bill Numbering

```ts
// packages/utils/formatters.ts
export async function getNextBillNumber(year: number): Promise<string> {
  // Count only 'created' bills for that year (not 'imported')
  const count = await countCreatedBillsForYear(year)
  return `${year}-${String(count + 1).padStart(3, '0')}`
}
```

---

## Totals Calculation

```ts
// packages/utils/formatters.ts
export function calcTotals(items: BillItem[]) {
  const vatMap: Record<number, number> = {}
  let net = 0

  for (const item of items) {
    const sub = item.price * item.qty
    net += sub
    if (item.vat > 0) {
      vatMap[item.vat] = (vatMap[item.vat] ?? 0) + sub * item.vat / 100
    }
  }

  const vatTotal = Object.values(vatMap).reduce((a, b) => a + b, 0)
  return { net, vatMap, vatTotal, total: net + vatTotal }
}

export function chf(n: number): string {
  return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "'")
}

export function fmtDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y.slice(2)}`
}
```

---

## Invoice Document (PDF + HTML)

The `bill-doc.tsx` renders the invoice both as HTML (for screen) and via `packages/pdf` as PDF.

Format must match exactly:

```
Logo (SVG)                          Sementina, DD.MM.YY
                                    CHE -115.295.448

Table:
  [EXTRA GENNAIO 2026] or [Gennaio 2026]
  Art. | Description | Qnt. | Prezzo | Totale | IVA% | IVA | TOTALE
  ──────────────────────────────────────────────────────────────────
  3210 | Pensione     |  1  | 1'365  | 1'365  | 8.10 | 110.57 | 1'475.57
  ...
  ──────────────────────────────────────────────────────────────────
                                             TOTALE | CHF 1'475.57
  [if paid:]                       Vs.Versamento DD.MM.YY | CHF -1'475.57
  [if paid:]                                    A SALDO | CHF 0.00

[if mensile:] "Ringraziamo per la fiducia accordata e porgiamo cordiali saluti."

C.H.C. Horses SA                         C.P. 69-470789-7
Via Ressiga 7                            Iban CH40 0900 0000 6947 0789 7
6514 Sementina                           Tel. +41 76 339 38 65
Gianluca Agustoni
```

---

## Payment Status Engine

```ts
// Overdue auto-flag: run on dashboard load and via cron
// Supabase cron: pg_cron extension, runs daily at 08:00

SELECT cron.schedule('mark-overdue-bills', '0 8 * * *', 'SELECT mark_overdue_bills()');
```

Status transitions:
- Save bill (no paid_amount) → `pending`
- Save bill (paid_amount = total) → `paid`
- `pending` + date > 30 days ago → `overdue` (auto, via function)
- Mark as paid from bill view → `paid`

---

## Server Actions

```ts
// apps/owner/app/(features)/billing/lib/actions.ts
'use server'

export async function createBill(formData: CreateBillInput) { ... }
export async function markBillPaid(billId: string, amount: number, date: string) { ... }
export async function importBill(formData: ImportBillInput) { ... }
```

---

## PDF Route Handler

```ts
// apps/owner/app/api/bills/[id]/pdf/route.ts
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const bill = await getBillById(params.id) // server, service role
  const pdfBuffer = await renderInvoicePDF(bill)
  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="fattura-${bill.number}.pdf"`,
    },
  })
}
```

---

## Acceptance Criteria

- [ ] Owner can create a Mensile bill: select client, add services, save
- [ ] Owner can create an Extra bill with custom descriptions per line (e.g. "Monta Lulu, GA 23.01")
- [ ] Owner can override price per line item
- [ ] Bill number auto-increments per year (2026-001, 2026-002…)
- [ ] Imported bills do not affect numbering
- [ ] Invoice renders exactly matching La Fattoria format (logo, IBAN, CHE number, Gianluca Agustoni)
- [ ] PDF download generates correct document
- [ ] Mark as Paid updates status, shows Vs.Versamento + A Saldo on invoice
- [ ] Bills pending > 30 days are automatically marked overdue
- [ ] Bill list filters by: All / Pending / Paid / Overdue / Year / Client
- [ ] Changing client data after bill is created does not affect bill snapshot
