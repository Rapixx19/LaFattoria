# La Fattoria — Master Document
**C.H.C. Horses SA · Sementina, Ticino, Switzerland**
*Living document — update this file as features are completed*

---

## Project Overview

A two-sided digital platform for an equestrian stable:

| App | URL | Users |
|---|---|---|
| Owner / Trainer PWA | `app.lafattoria.ch` | Gianluca Agustoni, trainers (GA + others) |
| Client PWA | `mio.lafattoria.ch` | 20 stable clients |

This is **Phase 1** of a larger stable management platform. Every module is built to be extended.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 App Router (TypeScript strict) |
| Styling | Tailwind CSS + design tokens (see DESIGN_SYSTEM.md) |
| Database | Supabase (Postgres + pgvector) |
| Auth | Supabase Auth (email/password + magic link) |
| Realtime | Supabase Realtime |
| File storage | Supabase Storage |
| Push notifications | Web Push API + Supabase Edge Functions |
| PDF generation | @react-pdf/renderer (server component) |
| PWA | next-pwa (service worker + manifest) |
| Deployment | Vercel (two apps, two subdomains) |
| Testing | Vitest + React Testing Library + Playwright (E2E) |
| Monorepo | Turborepo |

---

## Repository Structure

```
lafattoria/
├── apps/
│   ├── owner/          ← Owner + Trainer PWA (Next.js)
│   └── client/         ← Client PWA (Next.js)
├── packages/
│   ├── ui/             ← Shared components + design system
│   ├── supabase/       ← DB types, client, RLS helpers
│   ├── pdf/            ← Invoice PDF renderer
│   └── utils/          ← Shared utilities (formatters, validators)
├── supabase/
│   ├── migrations/     ← SQL migration files
│   ├── functions/      ← Edge functions (push notifications, etc.)
│   └── seed.sql        ← Dev seed data
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DESIGN_SYSTEM.md
│   ├── SUPABASE_SCHEMA.md
│   ├── INTEGRATION_TESTS.md
│   └── ROADMAP.md
├── features/
│   ├── 01_AUTH.md
│   ├── 02_BILLING.md
│   ├── 03_CLIENTS.md
│   ├── 04_SERVICES_EDITOR.md
│   ├── 05_REVENUE_ANALYTICS.md
│   ├── 06_BOOKING_ENGINE.md
│   ├── 07_HORSE_ROSTER.md
│   ├── 08_SCHEDULE.md
│   ├── 09_NOTIFICATIONS.md
│   └── 10_CLIENT_PWA.md
├── MASTER.md           ← this file
└── .cursorrules
```

---

## Build Status

Update checkboxes as each feature is completed. Add date and any notes.

### Phase 1 — Billing & Admin (Owner App)

| # | Feature | Status | Completed | Notes |
|---|---|---|---|---|
| 01 | Auth — owner + trainer login | ✅ Done | Apr 2026 | Supabase Auth + RLS |
| 02 | Billing — invoice creator | ✅ Done | Apr 2026 | Mensile + Extra |
| 02a | Billing — payment status tracking | ✅ Done | Apr 2026 | pending/paid/overdue |
| 03 | Clients — profiles + bill history | ✅ Done | Apr 2026 | With spend chart |
| 04 | Services editor — CRUD price list | ✅ Done | Apr 2026 | With price history |
| 05 | Revenue analytics — year view + chart | ✅ Done | Apr 2026 | Stacked bar chart |
| 05a | Revenue — batch import old bills | ✅ Done | Apr 2026 | IMP-YYYY-NNN format |

### Phase 2 — Owner / Trainer PWA

| # | Feature | Status | Completed | Notes |
|---|---|---|---|---|
| 06 | Booking engine — request + confirm | ⬜ Todo | — | — |
| 07 | Horse roster — profiles + status | ⬜ Todo | — | — |
| 08 | Schedule — day/week view | ⬜ Todo | — | — |
| 09 | Notifications — push + in-app | ⬜ Todo | — | — |

### Phase 3 — Client PWA

| # | Feature | Status | Completed | Notes |
|---|---|---|---|---|
| 10 | Client PWA — all screens | ⬜ Todo | — | — |
| 10a | Client auth — magic link | ⬜ Todo | — | — |
| 10b | Client booking flow | ⬜ Todo | — | — |
| 10c | Client invoice view + PDF download | ⬜ Todo | — | — |

---

## Integration Test Status

| Test suite | Status | Last run |
|---|---|---|
| Auth ↔ RLS (all roles) | ⬜ | — |
| Billing ↔ Clients | ⬜ | — |
| Billing ↔ Services | ⬜ | — |
| Billing ↔ Revenue | ⬜ | — |
| Booking ↔ Schedule | ⬜ | — |
| Booking ↔ Notifications | ⬜ | — |
| Booking ↔ Billing (auto-bill) | ⬜ | — |
| Client PWA ↔ Booking engine | ⬜ | — |
| Client PWA ↔ Billing (view only) | ⬜ | — |

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App URLs
NEXT_PUBLIC_OWNER_APP_URL=https://app.lafattoria.ch
NEXT_PUBLIC_CLIENT_APP_URL=https://mio.lafattoria.ch

# Push notifications
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:info@lafattoria.ch

# PDF
PDF_GENERATION_SECRET=
```

---

## Key Decisions Log

| Date | Decision | Reason |
|---|---|---|
| Apr 2026 | Turborepo monorepo | Share UI, types, Supabase client across both apps |
| Apr 2026 | Supabase RLS for multi-tenancy | Clients can only read their own data at DB level |
| Apr 2026 | Georgia serif + cream palette | Match existing La Fattoria brand identity |
| Apr 2026 | Web Push (not native app) | PWA avoids App Store — faster to deploy |
| Apr 2026 | @react-pdf for invoices | Server-side PDF matches print format exactly |
| Apr 2026 | Batch import as manual form | OCR of old PDFs too fragile; manual entry safer |

---

## Contacts

| Person | Role | Contact |
|---|---|---|
| Gianluca Agustoni | Owner / lead user | — |
| Sabina Cartossi | Owner | — |
| GA | Head trainer | — |

---

*Update this file after every feature merged to main.*
