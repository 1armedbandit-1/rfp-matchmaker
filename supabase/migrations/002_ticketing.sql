-- ─────────────────────────────────────────────
-- RFP Ticketing Schema
-- Migration 002 — events, venues, seats, orders
-- ─────────────────────────────────────────────

-- Enums
create type ticket_status as enum ('available', 'reserved', 'sold', 'cancelled', 'refunded');
create type order_status  as enum ('pending', 'paid', 'cancelled', 'refunded');
create type section_type  as enum ('general', 'ringside', 'vip', 'table', 'standing', 'other');

-- ── venues ───────────────────────────────────
create table public.venues (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  address      text,
  city         text,
  state        text,
  capacity     int,
  created_by   uuid references public.users(id) on delete set null,
  created_at   timestamptz default now()
);

-- ── events ───────────────────────────────────
create table public.events (
  id              uuid primary key default uuid_generate_v4(),
  venue_id        uuid references public.venues(id) on delete set null,
  promoter_id     uuid references public.users(id) on delete set null,
  title           text not null,
  slug            text unique not null,
  description     text,
  event_date      timestamptz not null,
  doors_open      timestamptz,
  poster_url      text,
  is_published    boolean default false,
  seating_chart   jsonb,           -- AI-generated layout JSON
  seating_image_url text,          -- original uploaded image
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ── venue_sections ────────────────────────────
-- Each section in the seating chart (VIP, Ringside, Table A, GA, etc.)
create table public.venue_sections (
  id            uuid primary key default uuid_generate_v4(),
  event_id      uuid not null references public.events(id) on delete cascade,
  name          text not null,          -- e.g. "VIP Ringside", "Table A"
  section_type  section_type default 'general',
  color         text default '#4A90D9', -- hex color shown on chart
  price_cents   int not null default 0,
  capacity      int not null default 0,
  sort_order    int default 0,
  svg_path      text,                   -- SVG path/shape for this section
  svg_x         numeric,               -- position on chart
  svg_y         numeric,
  svg_width     numeric,
  svg_height    numeric,
  created_at    timestamptz default now()
);

-- ── seats ─────────────────────────────────────
-- Individual seats within a section
create table public.seats (
  id           uuid primary key default uuid_generate_v4(),
  section_id   uuid not null references public.venue_sections(id) on delete cascade,
  event_id     uuid not null references public.events(id) on delete cascade,
  row_label    text,            -- "A", "B", "1", "2", etc.
  seat_number  text not null,
  status       ticket_status default 'available',
  reserved_at  timestamptz,    -- for 10-min hold during checkout
  reserved_by  uuid references public.users(id) on delete set null,
  svg_x        numeric,
  svg_y        numeric,
  created_at   timestamptz default now()
);

-- ── orders ────────────────────────────────────
create table public.orders (
  id                  uuid primary key default uuid_generate_v4(),
  event_id            uuid not null references public.events(id) on delete restrict,
  buyer_id            uuid references public.users(id) on delete set null,
  buyer_email         text not null,
  buyer_name          text not null,
  buyer_phone         text,
  status              order_status default 'pending',
  total_cents         int not null default 0,
  stripe_session_id   text unique,
  stripe_payment_intent text,
  promo_code          text,
  discount_cents      int default 0,
  notes               text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- ── tickets ───────────────────────────────────
create table public.tickets (
  id           uuid primary key default uuid_generate_v4(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  event_id     uuid not null references public.events(id) on delete restrict,
  seat_id      uuid references public.seats(id) on delete set null,
  section_id   uuid references public.venue_sections(id) on delete set null,
  holder_name  text,
  price_cents  int not null default 0,
  status       ticket_status default 'sold',
  qr_code      text unique not null default uuid_generate_v4()::text,
  checked_in   boolean default false,
  checked_in_at timestamptz,
  emailed_at   timestamptz,
  created_at   timestamptz default now()
);

-- ── promo_codes ───────────────────────────────
create table public.promo_codes (
  id            uuid primary key default uuid_generate_v4(),
  event_id      uuid references public.events(id) on delete cascade,
  code          text not null,
  discount_type text not null check (discount_type in ('percent','flat')),
  discount_value int not null,  -- percent (10 = 10%) or cents (500 = $5.00)
  max_uses      int,
  uses_count    int default 0,
  expires_at    timestamptz,
  is_active     boolean default true,
  created_at    timestamptz default now(),
  unique(event_id, code)
);

-- ── Indexes ───────────────────────────────────
create index events_event_date_idx      on public.events(event_date);
create index events_slug_idx            on public.events(slug);
create index events_promoter_idx        on public.events(promoter_id);
create index seats_section_idx          on public.seats(section_id);
create index seats_event_status_idx     on public.seats(event_id, status);
create index tickets_order_idx          on public.tickets(order_id);
create index tickets_qr_idx             on public.tickets(qr_code);
create index tickets_event_idx          on public.tickets(event_id);
create index orders_event_idx           on public.orders(event_id);
create index orders_stripe_idx          on public.orders(stripe_session_id);

-- ── updated_at triggers ───────────────────────
create trigger events_updated_at before update on public.events
  for each row execute function public.handle_updated_at();
create trigger orders_updated_at before update on public.orders
  for each row execute function public.handle_updated_at();

-- ── RLS ───────────────────────────────────────
alter table public.venues          enable row level security;
alter table public.events          enable row level security;
alter table public.venue_sections  enable row level security;
alter table public.seats           enable row level security;
alter table public.orders          enable row level security;
alter table public.tickets         enable row level security;
alter table public.promo_codes     enable row level security;

-- venues
create policy "venues_read_all"   on public.venues for select using (true);
create policy "venues_write_auth" on public.venues for all using (auth.role() = 'authenticated');

-- events — public can read published events
create policy "events_read_published" on public.events for select using (is_published = true or auth.uid() = promoter_id);
create policy "events_write_promoter" on public.events for all using (auth.uid() = promoter_id);

-- sections — public readable for published events
create policy "sections_read_all" on public.venue_sections for select using (true);
create policy "sections_write_auth" on public.venue_sections for all using (auth.role() = 'authenticated');

-- seats — public readable
create policy "seats_read_all"    on public.seats for select using (true);
create policy "seats_write_auth"  on public.seats for all using (auth.role() = 'authenticated');

-- orders — buyers see their own; service role handles creation
create policy "orders_read_own"   on public.orders for select using (auth.uid() = buyer_id);
create policy "orders_insert_own" on public.orders for insert with check (auth.uid() = buyer_id or auth.uid() is not null);

-- tickets — buyers see their own
create policy "tickets_read_own"  on public.tickets for select using (
  exists (select 1 from public.orders o where o.id = order_id and o.buyer_id = auth.uid())
);

-- promo codes — auth users can read active codes
create policy "promo_read_auth"   on public.promo_codes for select using (auth.role() = 'authenticated');
create policy "promo_write_auth"  on public.promo_codes for all using (auth.role() = 'authenticated');

-- ── helper: release expired seat reservations ──
create or replace function public.release_expired_reservations()
returns void language plpgsql security definer as $$
begin
  update public.seats
  set status = 'available', reserved_at = null, reserved_by = null
  where status = 'reserved'
    and reserved_at < now() - interval '10 minutes';
end; $$;
