-- Invitations
create table invitations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]+$'),
  theme text not null check (theme in ('elegant', 'floral', 'minimalist')),
  status text not null default 'active' check (status in ('active', 'inactive')),

  groom_name text not null,
  groom_father text,
  groom_mother text,
  groom_photo_url text,

  bride_name text not null,
  bride_father text,
  bride_mother text,
  bride_photo_url text,

  akad_date date,
  akad_time time,
  akad_venue text,
  akad_address text,
  akad_maps_link text,

  resepsi_date date,
  resepsi_time time,
  resepsi_venue text,
  resepsi_address text,
  resepsi_maps_link text,

  couple_quote text,
  music_url text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Story items
create table story_items (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references invitations(id) on delete cascade,
  year text not null,
  title text not null,
  description text not null,
  sort_order int not null default 0
);

-- Gallery items
create table gallery_items (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references invitations(id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0
);

-- RSVP responses
create table rsvp_responses (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references invitations(id) on delete cascade,
  guest_name text not null,
  attendance text not null check (attendance in ('hadir', 'tidak_hadir')),
  guest_count int not null default 1,
  message text,
  created_at timestamptz not null default now()
);

-- Guest book
create table guest_book (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references invitations(id) on delete cascade,
  name text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- RLS
alter table invitations enable row level security;
create policy "Public can read active invitations"
  on invitations for select using (status = 'active');
create policy "Authenticated can manage invitations"
  on invitations for all using (auth.role() = 'authenticated');

alter table story_items enable row level security;
create policy "Public can read story items"
  on story_items for select using (true);
create policy "Authenticated can manage story items"
  on story_items for all using (auth.role() = 'authenticated');

alter table gallery_items enable row level security;
create policy "Public can read gallery items"
  on gallery_items for select using (true);
create policy "Authenticated can manage gallery items"
  on gallery_items for all using (auth.role() = 'authenticated');

alter table rsvp_responses enable row level security;
create policy "Anyone can submit RSVP"
  on rsvp_responses for insert with check (true);
create policy "Authenticated can read RSVPs"
  on rsvp_responses for select using (auth.role() = 'authenticated');

alter table guest_book enable row level security;
create policy "Anyone can submit guest book"
  on guest_book for insert with check (true);
create policy "Anyone can read guest book"
  on guest_book for select using (true);
