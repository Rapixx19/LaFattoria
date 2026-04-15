# La Fattoria — Supabase Schema

Run migrations in order. Never modify production schema manually.

---

## Migration 001 — Initial Schema

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── PROFILES (extends Supabase auth.users) ─────────────────────────────────
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null check (role in ('owner', 'trainer', 'client')),
  client_id   uuid,          -- set only for role = 'client'
  name        text not null,
  email       text not null,
  phone       text,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ── CLIENTS ────────────────────────────────────────────────────────────────
create table clients (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  address     text,
  email       text,
  phone       text,
  notes       text,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ── HORSES ─────────────────────────────────────────────────────────────────
create table horses (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  breed        text,
  client_id    uuid not null references clients(id) on delete restrict,
  stall        text,
  status       text not null default 'active'
                 check (status in ('active', 'rest', 'competition', 'sold')),
  diet_notes   text,
  vet_notes    text,
  farrier_date date,
  photo_url    text,
  created_at   timestamptz not null default now()
);

-- ── SERVICES ───────────────────────────────────────────────────────────────
create table services (
  id            uuid primary key default uuid_generate_v4(),
  art_code      text not null,           -- e.g. '3210'
  name          text not null,
  unit          text not null,           -- e.g. 'al mese', '50 min'
  price         numeric(10,2) not null,
  vat_rate      numeric(4,2) not null default 0,
  active        boolean not null default true,
  is_custom     boolean not null default false,
  price_history jsonb not null default '[]'::jsonb,
                -- [{price: 1365.00, changed_at: "2024-01-01", changed_by: "uuid"}]
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

-- ── BILLS ──────────────────────────────────────────────────────────────────
create table bills (
  id               uuid primary key default uuid_generate_v4(),
  number           text not null,        -- e.g. '2026-001'
  year             integer not null,
  type             text not null check (type in ('mensile', 'extra', 'imported')),
  source           text not null default 'created'
                     check (source in ('created', 'imported')),
  client_id        uuid not null references clients(id) on delete restrict,
  client_snapshot  jsonb not null,       -- snapshot at time of creation
  date             date not null,
  period           text,                 -- e.g. 'Gennaio 2026'
  items            jsonb not null,
                   -- [{art, name, desc, unit, price, qty, vat, subtotal}]
  status           text not null default 'pending'
                     check (status in ('pending', 'paid', 'overdue')),
  paid_amount      numeric(10,2),
  paid_date        date,
  notes            text,
  pdf_url          text,                 -- Supabase Storage URL
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger bills_updated_at
  before update on bills
  for each row execute procedure set_updated_at();

-- ── BOOKINGS ───────────────────────────────────────────────────────────────
create table bookings (
  id               uuid primary key default uuid_generate_v4(),
  client_id        uuid not null references clients(id) on delete restrict,
  horse_id         uuid references horses(id) on delete set null,
  service_id       uuid not null references services(id) on delete restrict,
  trainer_id       uuid references profiles(id) on delete set null,
  requested_at     timestamptz not null default now(),
  scheduled_date   date not null,
  scheduled_time   time not null,
  duration_minutes integer not null default 50,
  status           text not null default 'requested'
                     check (status in ('requested','confirmed','completed','cancelled')),
  notes            text,
  cancelled_reason text,
  confirmed_at     timestamptz,
  completed_at     timestamptz,
  bill_id          uuid references bills(id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create trigger bookings_updated_at
  before update on bookings
  for each row execute procedure set_updated_at();

-- ── AVAILABILITY ───────────────────────────────────────────────────────────
create table availability (
  id           uuid primary key default uuid_generate_v4(),
  service_id   uuid references services(id) on delete cascade,
  trainer_id   uuid references profiles(id) on delete cascade,
  day_of_week  integer,    -- 0=Sunday, null = one-off
  date         date,       -- null = recurring
  time_from    time not null,
  time_to      time not null,
  is_blocked   boolean not null default false,
  notes        text,
  created_at   timestamptz not null default now()
);

-- ── PUSH SUBSCRIPTIONS ─────────────────────────────────────────────────────
create table push_subscriptions (
  id           uuid primary key default uuid_generate_v4(),
  profile_id   uuid not null references profiles(id) on delete cascade,
  subscription jsonb not null,  -- Web Push subscription object
  created_at   timestamptz not null default now()
);

-- ── ANNOUNCEMENTS ──────────────────────────────────────────────────────────
create table announcements (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  body        text not null,
  created_by  uuid not null references profiles(id),
  created_at  timestamptz not null default now(),
  expires_at  timestamptz
);
```

---

## Migration 002 — RLS Policies

```sql
-- Enable RLS on all tables
alter table profiles           enable row level security;
alter table clients            enable row level security;
alter table horses             enable row level security;
alter table services           enable row level security;
alter table bills              enable row level security;
alter table bookings           enable row level security;
alter table availability       enable row level security;
alter table push_subscriptions enable row level security;
alter table announcements      enable row level security;

-- Helper: get current user's role
create or replace function current_role()
returns text language sql security definer as $$
  select role from profiles where id = auth.uid()
$$;

-- Helper: get current user's client_id
create or replace function current_client_id()
returns uuid language sql security definer as $$
  select client_id from profiles where id = auth.uid()
$$;

-- ── PROFILES ────────────────────────────────────────────────────────────────
create policy "owners see all profiles"
  on profiles for select using (current_role() = 'owner');

create policy "trainers see own profile"
  on profiles for select using (
    current_role() = 'trainer' and id = auth.uid()
  );

create policy "clients see own profile"
  on profiles for select using (
    current_role() = 'client' and id = auth.uid()
  );

create policy "owners manage profiles"
  on profiles for all using (current_role() = 'owner');

-- ── CLIENTS ─────────────────────────────────────────────────────────────────
create policy "owners and trainers see all clients"
  on clients for select using (
    current_role() in ('owner', 'trainer')
  );

create policy "clients see own record"
  on clients for select using (
    id = current_client_id()
  );

create policy "owners manage clients"
  on clients for all using (current_role() = 'owner');

-- ── HORSES ──────────────────────────────────────────────────────────────────
create policy "owners and trainers see all horses"
  on horses for select using (
    current_role() in ('owner', 'trainer')
  );

create policy "clients see own horse"
  on horses for select using (
    client_id = current_client_id()
  );

create policy "owners manage horses"
  on horses for all using (current_role() = 'owner');

create policy "trainers update horses"
  on horses for update using (current_role() = 'trainer');

-- ── SERVICES ────────────────────────────────────────────────────────────────
create policy "all authenticated users see active services"
  on services for select using (auth.uid() is not null and active = true);

create policy "owners see all services including inactive"
  on services for select using (current_role() = 'owner');

create policy "owners manage services"
  on services for all using (current_role() = 'owner');

-- ── BILLS ───────────────────────────────────────────────────────────────────
create policy "owners see all bills"
  on bills for select using (current_role() = 'owner');

create policy "clients see own bills"
  on bills for select using (
    current_role() = 'client' and client_id = current_client_id()
  );

create policy "owners manage bills"
  on bills for all using (current_role() = 'owner');

-- ── BOOKINGS ────────────────────────────────────────────────────────────────
create policy "owners see all bookings"
  on bookings for select using (current_role() = 'owner');

create policy "trainers see all bookings"
  on bookings for select using (current_role() = 'trainer');

create policy "trainers update bookings"
  on bookings for update using (current_role() in ('owner', 'trainer'));

create policy "clients see own bookings"
  on bookings for select using (
    current_role() = 'client' and client_id = current_client_id()
  );

create policy "clients create bookings"
  on bookings for insert with check (
    current_role() = 'client' and client_id = current_client_id()
  );

create policy "clients cancel own bookings"
  on bookings for update using (
    current_role() = 'client'
    and client_id = current_client_id()
    and status = 'requested'  -- can only cancel before confirmation
  );

-- ── AVAILABILITY ────────────────────────────────────────────────────────────
create policy "all authenticated users read availability"
  on availability for select using (auth.uid() is not null);

create policy "owners manage availability"
  on availability for all using (current_role() = 'owner');

-- ── PUSH SUBSCRIPTIONS ──────────────────────────────────────────────────────
create policy "users manage own subscriptions"
  on push_subscriptions for all using (profile_id = auth.uid());

-- ── ANNOUNCEMENTS ───────────────────────────────────────────────────────────
create policy "all authenticated users read announcements"
  on announcements for select using (
    auth.uid() is not null and (expires_at is null or expires_at > now())
  );

create policy "owners manage announcements"
  on announcements for all using (current_role() = 'owner');
```

---

## Migration 003 — Functions

```sql
-- Calculate overdue bills (called by cron or on-demand)
create or replace function mark_overdue_bills()
returns void language plpgsql security definer as $$
begin
  update bills
  set status = 'overdue'
  where status = 'pending'
    and date < current_date - interval '30 days';
end; $$;

-- Get revenue summary for a year
create or replace function get_revenue_by_month(p_year integer)
returns table (
  month        integer,
  invoiced     numeric,
  paid         numeric,
  pending      numeric,
  overdue      numeric,
  bill_count   integer
) language sql security definer as $$
  select
    extract(month from date)::integer as month,
    sum((select sum((item->>'price')::numeric * (item->>'qty')::numeric *
      (1 + (item->>'vat')::numeric/100)
      from jsonb_array_elements(items) as item)) as invoiced,
    sum(case when status = 'paid' then paid_amount else 0 end) as paid,
    sum(case when status = 'pending' then
      (select sum((item->>'price')::numeric * (item->>'qty')::numeric *
        (1 + (item->>'vat')::numeric/100)
        from jsonb_array_elements(items) as item)) else 0 end) as pending,
    sum(case when status = 'overdue' then
      (select sum((item->>'price')::numeric * (item->>'qty')::numeric *
        (1 + (item->>'vat')::numeric/100)
        from jsonb_array_elements(items) as item)) else 0 end) as overdue,
    count(*)::integer as bill_count
  from bills
  where year = p_year
  group by extract(month from date)
  order by month;
$$;
```

---

## Migration 004 — Seed Services

```sql
insert into services (art_code, name, unit, price, vat_rate, sort_order) values
  ('3210', 'Pensione',                     'al mese',    1365.00, 8.1,  1),
  ('3218', 'Giostra',                      'per mese',    225.00, 8.1,  2),
  ('3218', 'Giostra',                      'al giorno',    25.00, 8.1,  3),
  ('3222', 'Pascoli',                      'per anno',   1900.00, 8.1,  4),
  ('3222', 'Pascoli',                      'al mese',     190.00, 8.1,  5),
  ('3221', 'Pensione al prato',            'al mese',     325.00, 8.1,  6),
  ('3216', 'Preparazione cavallo',         'a volta',      25.00, 2.6,  7),
  ('3212', 'Lezione privata (GA)',         '50 min',       75.00, 0.0,  8),
  ('3213', 'Lavoro alla corda',            '40 min',       43.00, 2.6,  9),
  ('3211', 'Monta montata (GA)',           '50 min',       75.00, 2.6, 10),
  ('3214', 'Trasporto – Lombardia',        'corsa',       380.00, 8.1, 11),
  ('3214', 'Trasporto – Ticino',           'corsa',       160.00, 8.1, 12),
  ('3214', 'Trasporto – Svizzera',         'corsa',       380.00, 8.1, 13),
  ('3215', 'Assistenza concorsi',          'per gara',     30.00, 0.0, 14),
  ('3211', 'Monta a concorso',             'per gara',     75.00, 2.6, 15),
  ('3215', 'Scuderia a concorso',          'al giorno',    35.00, 8.1, 16),
  ('3216', 'Preparazione a concorso',      'a volta',      25.00, 8.1, 17),
  ('3217', 'Tosatura completa',            'a volta',     120.00, 8.1, 18),
  ('3219', 'Lavatrice',                    'utilizzo',     25.00, 8.1, 19),
  ('3220', 'Assistenza vet. / maniscalco', 'a volta',      45.00, 2.6, 20);
```

---

## Indexes

```sql
create index bills_client_id_idx    on bills(client_id);
create index bills_year_status_idx  on bills(year, status);
create index bookings_client_idx    on bookings(client_id);
create index bookings_date_idx      on bookings(scheduled_date);
create index bookings_status_idx    on bookings(status);
create index horses_client_idx      on horses(client_id);
create index profiles_role_idx      on profiles(role);
```

---

## Generated Types

After schema is set up, run:
```bash
npx supabase gen types typescript --project-id <id> > packages/supabase/types.ts
```

Commit the generated file. Re-run after any schema change.
