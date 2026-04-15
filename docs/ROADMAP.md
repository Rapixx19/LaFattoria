# La Fattoria — Roadmap

---

## Phase 1 — Billing & Admin (Owner Web App)
**Goal:** Replace the current Excel billing process. Owner can create, track and analyse invoices.

| Sprint | Features | Est. |
|---|---|---|
| 1 | Monorepo scaffold + Supabase setup + Auth (F01) | 3 days |
| 2 | Billing — invoice creator + PDF (F02) | 4 days |
| 3 | Billing — payment tracking + overdue (F02a) | 2 days |
| 4 | Clients — profiles + bill history (F03) | 2 days |
| 5 | Services editor (F04) | 2 days |
| 6 | Revenue analytics + batch import (F05) | 3 days |

**Phase 1 total: ~16 days**

---

## Phase 2 — Owner / Trainer PWA
**Goal:** Manage the stable digitally. Day schedule, horse roster, booking confirmation.

| Sprint | Features | Est. |
|---|---|---|
| 7 | Booking engine — requests + confirm (F06) | 4 days |
| 8 | Horse roster (F07) | 2 days |
| 9 | Schedule — day/week view (F08) | 3 days |
| 10 | Push notifications (F09) | 2 days |
| 11 | PWA manifest, install, offline (owner) | 1 day |

**Phase 2 total: ~12 days**

---

## Phase 3 — Client PWA
**Goal:** Clients can book, see their horse, and view invoices from their phone.

| Sprint | Features | Est. |
|---|---|---|
| 12 | Client app scaffold + magic link auth | 2 days |
| 13 | Home + horse screen | 2 days |
| 14 | Booking flow (service picker + calendar) | 3 days |
| 15 | Invoice view + PDF download | 2 days |
| 16 | Push notifications (client) | 1 day |
| 17 | PWA manifest, install, offline (client) | 1 day |

**Phase 3 total: ~11 days**

---

## Future Phases (not in scope now)

### Phase 4 — Communication
- In-app messaging between client and trainer
- Trainer session notes visible to client
- Stable announcements (push to all clients)
- Automatic invoice email on creation

### Phase 5 — Payments
- Stripe integration for online payment
- Client pays invoice directly in PWA
- Automatic "Pagata" status on payment
- Payment receipts

### Phase 6 — Analytics Expansion
- Trainer performance metrics
- Horse training progress logs
- Year-on-year comparison
- Export to CSV / accounting software (Banana)

### Phase 7 — Multi-stable
- Multi-tenant architecture for other stables
- White-label branding per stable
- SaaS pricing model
- Admin panel for platform owner (VecterAI)
