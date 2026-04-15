# Feature 03 — Clients & Profiles

**App:** Owner (app.lafattoria.ch)
**Depends on:** Feature 01 (Auth)
**Integrates with:** Feature 02 (Billing), Feature 07 (Horses), Feature 06 (Bookings)

---

## Overview

20 client slots. Each client has a full profile page showing their horse, all bills, bookings, and spend analytics.

---

## Files to Create

```
apps/owner/app/(features)/clients/
├── page.tsx                      ← Client list
├── [id]/
│   ├── page.tsx                  ← Client profile
│   └── components/
│       ├── profile-card.tsx      ← Name, horse, contact, stats
│       ├── bill-history.tsx      ← All bills for this client
│       ├── booking-history.tsx   ← Past + upcoming bookings
│       └── spend-chart.tsx       ← Monthly spend bar chart
├── components/
│   └── client-row.tsx            ← Row in client list table
└── lib/
    ├── queries.ts
    └── actions.ts
```

## Client Profile Page Layout

```
[Profile Card]
  Avatar (initials) | Name (bold) | Horse name
  Client since · Total paid · Outstanding

[Tabs: Bills | Bookings | Analytics]

Bills tab:
  Same as billing list filtered to this client
  + Quick "Crea fattura" button

Bookings tab:
  Past and upcoming sessions

Analytics tab:
  Monthly spend chart (12 months)
  Top 3 services used
  Average bill amount
```

## Acceptance Criteria

- [ ] Client list shows all 20 slots (empty slots shown as "— vuoto —")
- [ ] Edit client: name, address, email, horse link
- [ ] Client profile shows total paid + outstanding balance (computed from bills)
- [ ] Bill history shows all bills with status dots
- [ ] Spend chart loads correctly with imported + created bills
- [ ] "Crea fattura" from profile pre-fills client in bill creator

---

# Feature 04 — Services Editor

**App:** Owner (app.lafattoria.ch)
**Depends on:** Feature 01 (Auth)
**Integrates with:** Feature 02 (Billing), Feature 06 (Booking — available services)

---

## Overview

Owner can edit the price list: change prices, toggle services active/inactive, add custom services. Changes are forward-only — existing bills are unaffected.

---

## Files to Create

```
apps/owner/app/(features)/services/
├── page.tsx                      ← Service list (editable table)
├── components/
│   ├── service-row.tsx           ← 'use client' inline editable row
│   ├── add-service-form.tsx      ← Add new service
│   └── price-history-modal.tsx   ← Show price change history
└── lib/
    ├── queries.ts
    └── actions.ts                ← updateService, toggleActive, addService
```

## Editable Row Fields
| Field | Type | Editable |
|---|---|---|
| Art. code | text | ✅ |
| Name | text | ✅ |
| Unit | text | ✅ |
| Price (CHF) | number | ✅ |
| VAT % | select (0 / 2.6 / 8.1) | ✅ |
| Active | toggle | ✅ |
| History | button | view only |

## Acceptance Criteria

- [ ] All 20 services shown with inline edit
- [ ] Saving a price change stores old price in `price_history`
- [ ] Inactive services hidden from bill creator and client booking
- [ ] Add new service with auto-suggested art. code
- [ ] Reset to listino default (restores seed data prices)
- [ ] Price history modal shows all changes with dates

---

# Feature 05 — Revenue Analytics

**App:** Owner (app.lafattoria.ch)
**Depends on:** Feature 01 (Auth), Feature 02 (Billing)
**Integrates with:** Feature 03 (Clients)

---

## Overview

Year view, monthly bar chart, running totals, batch import of old bills, revenue breakdown by client and service.

---

## Files to Create

```
apps/owner/app/(features)/revenue/
├── page.tsx                      ← Revenue main page
├── components/
│   ├── year-selector.tsx         ← ← 2024 · 2025 · 2026 →
│   ├── month-chart.tsx           ← Bar chart (12 months)
│   ├── running-totals.tsx        ← Paid / pending / overdue cards
│   ├── breakdown-table.tsx       ← By client + by service
│   └── batch-import-form.tsx     ← Import old bills
└── lib/
    ├── queries.ts                ← getRevenueByMonth(), getRevenueByClient()
    └── actions.ts                ← importBill()
```

## Month Chart Data Shape

```ts
type MonthRevenue = {
  month:      number     // 1–12
  invoiced:   number     // total CHF invoiced
  paid:       number     // total CHF received
  pending:    number     // total CHF pending
  overdue:    number     // total CHF overdue
  bill_count: number
}
```

Bar chart: stacked or colour-coded. Green = paid, Yellow = pending, Red = overdue.
Dashed outline for future months (no bills yet).

## Batch Import Form Fields

```
Client (select from list)
Bill type: Mensile / Extra
Date
Period (text)
Items (same service picker as bill creator)
Amount paid (optional)
```

Imported bills: `source = 'imported'`, `number = 'IMP-YYYY-NNN'`

## Acceptance Criteria

- [ ] Year selector shows all years with bills
- [ ] Monthly bar chart updates when bills are created/paid
- [ ] Running total: total invoiced, total paid, total outstanding this year
- [ ] Breakdown by client shows top clients by revenue
- [ ] Breakdown by service shows most-billed services
- [ ] Batch import adds old bills to charts immediately
- [ ] Imported bills excluded from invoice auto-numbering
- [ ] Revenue function uses Supabase `get_revenue_by_month()` DB function

---

# Feature 06 — Booking Engine

**App:** Owner (app.lafattoria.ch) + feeds Client PWA
**Depends on:** Feature 01 (Auth), Feature 03 (Clients), Feature 04 (Services), Feature 07 (Horses)
**Integrates with:** Feature 08 (Schedule), Feature 09 (Notifications), Feature 10 (Client PWA)

---

## Overview

Owner manages available slots. Clients request bookings. Owner/trainer confirms or declines. Realtime updates.

---

## Files to Create

```
apps/owner/app/(features)/booking/
├── page.tsx                      ← Pending requests list (Richieste)
├── availability/
│   └── page.tsx                  ← Set available slots
├── [id]/
│   └── page.tsx                  ← Booking detail
├── components/
│   ├── request-card.tsx          ← Booking request with confirm/decline
│   ├── availability-grid.tsx     ← Weekly slot editor
│   └── reschedule-form.tsx       ← Suggest new time
└── lib/
    ├── queries.ts
    ├── actions.ts                ← confirmBooking, declineBooking, etc.
    └── conflicts.ts              ← checkConflict()
```

## Booking Status Flow

```
requested → confirmed → completed
         ↘ cancelled
```

## Availability System

Owner sets recurring slots per service + trainer:
- Day of week + time range (recurring)
- Specific dates (one-off)
- Blocked dates (holidays, competitions)

Client app fetches available slots filtered by: service type + date.

## Realtime Subscription (Owner App)

```ts
// Richieste page subscribes to new booking requests
const channel = supabase
  .channel('booking-requests')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'bookings',
    filter: 'status=eq.requested',
  }, handleNewRequest)
  .subscribe()
```

## Acceptance Criteria

- [ ] Owner sees all pending requests in Richieste page
- [ ] Confirm button updates status to `confirmed` + triggers push notification
- [ [ Decline with optional reason → status `cancelled` + push notification
- [ ] Reschedule suggests new time → client notified
- [ ] Confirmed bookings appear on Schedule page
- [ ] Conflict detection: same trainer, same time → blocked
- [ ] Owner can manually add a booking (for offline/phone requests)
- [ ] Availability grid: set recurring weekly slots
- [ ] Booking linked to bill when completed (optional)

---

# Feature 07 — Horse Roster

**App:** Owner (app.lafattoria.ch)
**Depends on:** Feature 01 (Auth), Feature 03 (Clients)
**Integrates with:** Feature 06 (Booking), Feature 08 (Schedule)

---

## Files to Create

```
apps/owner/app/(features)/horses/
├── page.tsx                      ← Horse list (card grid)
├── [id]/
│   └── page.tsx                  ← Horse profile
├── components/
│   ├── horse-card.tsx            ← Card with status badge
│   ├── horse-form.tsx            ← Add/edit form
│   └── horse-status-badge.tsx    ← Active/Rest/Competition/Sold
└── lib/
    ├── queries.ts
    └── actions.ts
```

## Horse Profile Layout

```
Photo (upload) | Name + Breed
Status badge | Box number
Owner → link to client profile

Tabs: Info | Health | Sessions

Info: diet notes, vet notes
Health: farrier date (with alert if overdue), vet appointments
Sessions: upcoming bookings for this horse
```

## Acceptance Criteria

- [ ] Horse list as card grid with status badges
- [ ] Add horse: name, breed, client link, stall, photo upload
- [ ] Edit all fields inline
- [ ] Status: Active / Rest / Competition / Sold
- [ ] Farrier date shown, highlighted amber if within 7 days
- [ ] Horse profile links to client profile
- [ ] Horse appears in booking form when that client books

---

# Feature 08 — Schedule

**App:** Owner (app.lafattoria.ch)
**Depends on:** Feature 06 (Booking), Feature 07 (Horses)

---

## Files to Create

```
apps/owner/app/(features)/schedule/
├── page.tsx                      ← Schedule main (defaults to today)
├── components/
│   ├── day-strip.tsx             ← Week day selector
│   ├── timeline.tsx              ← Hourly timeline (06:00–20:00)
│   ├── session-block.tsx         ← Session card on timeline
│   └── print-sheet.tsx           ← Printable day sheet
└── lib/
    └── queries.ts                ← getScheduleForDate()
```

## Timeline Colour Coding

```ts
const SESSION_COLORS = {
  lezione:    '#4A90D9',  // blue
  monta:      '#2D4A22',  // green
  corda:      '#8B6914',  // amber
  trasporto:  '#5C4A8B',  // purple
  concorso:   '#1A3A5C',  // dark blue
  default:    '#75706A',  // muted
}
```

## Acceptance Criteria

- [ ] Day view: timeline from 06:00 to 20:00
- [ ] Sessions shown as coloured blocks with client + horse + duration
- [ ] Click session → booking detail
- [ ] Week strip for quick day switching
- [ ] Print day sheet (A4 PDF, list format)
- [ ] Empty slots visible based on availability settings

---

# Feature 09 — Notifications

**App:** Both apps
**Depends on:** Feature 01 (Auth), Feature 06 (Booking)

---

## Files to Create

```
apps/owner/app/api/push/
├── subscribe/route.ts            ← POST: store subscription
└── unsubscribe/route.ts          ← DELETE: remove subscription

supabase/functions/send-push/
└── index.ts                      ← Edge function

apps/owner/components/
└── notification-permission.tsx   ← 'use client' push opt-in
```

## Push Events

| Event | Triggered by | Recipient |
|---|---|---|
| New booking request | Client creates booking | Owner + matching trainer |
| Booking confirmed | Owner confirms | Client |
| Booking declined | Owner declines | Client |
| Session reminder | Cron: 24h before | Client + trainer |
| Invoice issued | Bill created | Client |
| Overdue invoice | Cron: daily | Owner only |

## Edge Function

```ts
// supabase/functions/send-push/index.ts
import webpush from 'npm:web-push'

Deno.serve(async (req) => {
  const { profileId, title, body, url } = await req.json()
  const subs = await getSubscriptionsForProfile(profileId)
  for (const sub of subs) {
    await webpush.sendNotification(sub.subscription, JSON.stringify({ title, body, url }))
  }
  return new Response('ok')
})
```

## Acceptance Criteria

- [ ] PWA prompts for notification permission on first load
- [ ] Subscription stored in `push_subscriptions` table
- [ ] New booking request triggers push to owner within 5 seconds
- [ ] Booking confirmed triggers push to client
- [ ] 24h reminder sent day before session
- [ ] Notifications link to relevant page when tapped
- [ ] User can opt out in profile settings

---

# Feature 10 — Client PWA

**App:** Client (mio.lafattoria.ch)
**Depends on:** All previous features (reads data from same Supabase project)

---

## Overview

5 screens. Mobile-first. Magic link or email/password auth. Clients see only their own data (RLS enforced).

---

## Files to Create

```
apps/client/app/
├── (auth)/
│   ├── login/page.tsx            ← Email input + magic link sent
│   └── callback/route.ts
├── (features)/
│   ├── home/page.tsx             ← Next session, horse card, balance
│   ├── book/
│   │   ├── page.tsx              ← Service picker
│   │   └── [serviceId]/
│   │       └── page.tsx          ← Date picker + confirm
│   ├── horse/page.tsx            ← My horse profile
│   ├── invoices/
│   │   ├── page.tsx              ← Bill list
│   │   └── [id]/page.tsx         ← Bill detail + PDF download
│   └── profile/page.tsx          ← Settings, notifications
└── layout.tsx                    ← Bottom nav, PWA shell
```

## Screen Designs (see LaFattoria_PWA_Mockups.jsx)

### Home Screen
```
Header (green.900):
  "C.H.C. Horses" (gold, 9px, letterSpacing 2)
  "Ciao, [Name] 👋" (white, 15px bold)
  Avatar circle (gold background, initials)

Overlapping horse card (white, shadow.md):
  🐴 icon | Horse name (bold green) | Box / Status
  Right: "Prossima sessione" label + date + service

Quick actions grid (2 cols):
  📅 Prenota sessione (green tint)
  🧾 Le mie fatture (amber tint)

Outstanding balance card (red tint, if >0):
  "Saldo in attesa" | CHF amount | "Vedi →" pill

Upcoming sessions list (white cards, status dots)
```

### Book Screen
```
Back arrow | "Prenota servizio" title

Service list (cards):
  Art. code (muted) + Service name (bold) + Price + Unit
  Selected: green border + green tint background

Mini calendar (cream background):
  Month nav | Day grid
  Available: dark text
  Unavailable (full/blocked): grey
  Selected: green circle

"Richiedi sessione →" button (full width, green.900)
```

### Invoices Screen
```
Header summary card (green.900):
  Left: "Da pagare" + CHF amount
  Right: "Pagato 2026" + CHF amount

Filter pills: Tutte | In attesa | Pagate

Bill rows (cream cards):
  Status dot + Period + Number + Date + Amount + Status label
  Tap → bill detail page (read-only invoice view + PDF download)
```

## Client Auth (Magic Link)

```ts
// apps/client/app/(auth)/login/page.tsx
// User enters email → supabase.auth.signInWithOtp({ email })
// Email contains magic link → callback route sets session
// Profile checked: if role !== 'client', redirect to error
```

## Acceptance Criteria

- [ ] Client can log in via magic link
- [ ] Home shows next session, horse, outstanding balance
- [ ] Book screen shows only active services
- [ ] Calendar shows only available (non-blocked, non-full) slots
- [ ] Booking request submitted → status "Richiesta" shown immediately
- [ ] Invoice list shows all bills for this client only
- [ ] PDF download works (signed URL from Supabase Storage)
- [ ] Push notifications opt-in on first visit
- [ ] PWA installable on iOS and Android
- [ ] Offline: shows cached home screen with "offline" banner
- [ ] All text in Italian
