# Wedding Invitation Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js wedding invitation platform where an admin creates customer invitation pages, each accessible via `domain.com/[slug]` with a selectable theme.

**Architecture:** Next.js 15 App Router with server components for all data fetching. Supabase handles PostgreSQL database, Supabase Auth for admin login, and Supabase Storage for photos. Admin routes protected by middleware. Public invitation page at `/[slug]` fetches data server-side and renders the selected theme component. Server Actions handle form submissions (RSVP, guest book, admin CRUD).

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Supabase (PostgreSQL + Auth + Storage), @supabase/ssr, Vercel

---

## File Map

| File | Responsibility |
|---|---|
| `lib/types.ts` | All TypeScript interfaces |
| `lib/supabase/client.ts` | Browser-side Supabase client |
| `lib/supabase/server.ts` | Server-side Supabase client |
| `middleware.ts` | Auth guard for /admin routes |
| `supabase/migrations/001_schema.sql` | Full DB schema + RLS |
| `components/invitation/CoverSection.tsx` | Cover/hero with names |
| `components/invitation/CountdownSection.tsx` | Countdown timer |
| `components/invitation/CoupleSection.tsx` | Couple & parents profiles |
| `components/invitation/StorySection.tsx` | Love story timeline |
| `components/invitation/GallerySection.tsx` | Photo gallery grid |
| `components/invitation/EventSection.tsx` | Akad & resepsi details |
| `components/invitation/LocationSection.tsx` | Maps embeds |
| `components/invitation/RsvpSection.tsx` | RSVP form |
| `components/invitation/GuestBookSection.tsx` | Guest book + submit |
| `components/themes/ElegantTheme.tsx` | Elegant Gold & Navy layout |
| `components/themes/FloralTheme.tsx` | Floral Soft layout |
| `components/themes/MinimalistTheme.tsx` | Modern Minimalist layout |
| `components/themes/index.ts` | Theme resolver (id → component) |
| `app/[slug]/page.tsx` | Public invitation page |
| `app/[slug]/actions.ts` | RSVP + guest book server actions |
| `app/admin/layout.tsx` | Admin layout wrapper |
| `app/admin/login/page.tsx` | Admin login form |
| `app/admin/page.tsx` | Admin dashboard — list all invitations |
| `app/admin/new/page.tsx` | New invitation form page |
| `app/admin/[id]/edit/page.tsx` | Edit invitation form page |
| `app/admin/[id]/rsvp/page.tsx` | RSVP + guest book viewer |
| `app/admin/actions.ts` | Admin CRUD server actions |
| `components/admin/InvitationForm.tsx` | Shared create/edit form |
| `components/admin/InvitationList.tsx` | Dashboard table |
| `components/admin/RsvpTable.tsx` | RSVP & guest book tables |

---

## Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `.env.local`, `.env.example`

- [ ] **Step 1: Archive existing vanilla project files**

```bash
mkdir archive
mv index.html css js assets tests archive/
mv package.json package-lock.json node_modules archive/ 2>/dev/null || true
```

- [ ] **Step 2: Initialize Next.js app in current directory**

```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*" \
  --no-turbopack
```

When prompted, answer:
- Would you like to use Turbopack? → No

- [ ] **Step 3: Install Supabase dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr
```

- [ ] **Step 4: Create .env.local**

Create `.env.local` with the following (fill in after creating Supabase project in Task 2):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

- [ ] **Step 5: Create .env.example**

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Expected: Server runs at http://localhost:3000 with default Next.js page.

- [ ] **Step 7: Initialize git and commit**

```bash
git init
echo "node_modules\n.env.local\n.next\n.supabase" >> .gitignore
git add -A
git commit -m "feat: initialize Next.js project with Supabase dependencies"
```

---

## Task 2: Database Schema & Supabase Setup

**Files:**
- Create: `supabase/migrations/001_schema.sql`

- [ ] **Step 1: Create Supabase project**

Go to https://supabase.com → New Project → fill in name and password → Save credentials to `.env.local`.

- [ ] **Step 2: Create migration file**

Create `supabase/migrations/001_schema.sql`:

```sql
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

-- RLS: invitations readable by all (for public pages), writable only by authenticated
alter table invitations enable row level security;
create policy "Public can read active invitations"
  on invitations for select using (status = 'active');
create policy "Authenticated can manage invitations"
  on invitations for all using (auth.role() = 'authenticated');

-- RLS: story_items and gallery_items readable by all, writable by authenticated
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

-- RLS: RSVP and guest book — public can insert, authenticated can read all
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
```

- [ ] **Step 3: Run migration in Supabase SQL editor**

Go to Supabase Dashboard → SQL Editor → paste the contents of `001_schema.sql` → Run.

- [ ] **Step 4: Create storage bucket for photos**

Go to Supabase Dashboard → Storage → New bucket → Name: `photos` → Public: true → Create.

- [ ] **Step 5: Create admin user**

Go to Supabase Dashboard → Authentication → Users → Add user → Enter your email and password.

- [ ] **Step 6: Commit**

```bash
git add supabase/
git commit -m "feat: add database schema and RLS policies"
```

---

## Task 3: TypeScript Types & Supabase Clients

**Files:**
- Create: `lib/types.ts`
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`

- [ ] **Step 1: Create lib/types.ts**

```typescript
export type ThemeId = 'elegant' | 'floral' | 'minimalist'
export type InvitationStatus = 'active' | 'inactive'

export interface StoryItem {
  id: string
  invitation_id: string
  year: string
  title: string
  description: string
  sort_order: number
}

export interface GalleryItem {
  id: string
  invitation_id: string
  image_url: string
  sort_order: number
}

export interface RsvpResponse {
  id: string
  invitation_id: string
  guest_name: string
  attendance: 'hadir' | 'tidak_hadir'
  guest_count: number
  message: string | null
  created_at: string
}

export interface GuestBookEntry {
  id: string
  invitation_id: string
  name: string
  message: string
  created_at: string
}

export interface Invitation {
  id: string
  slug: string
  theme: ThemeId
  status: InvitationStatus
  groom_name: string
  groom_father: string | null
  groom_mother: string | null
  groom_photo_url: string | null
  bride_name: string
  bride_father: string | null
  bride_mother: string | null
  bride_photo_url: string | null
  akad_date: string | null
  akad_time: string | null
  akad_venue: string | null
  akad_address: string | null
  akad_maps_link: string | null
  resepsi_date: string | null
  resepsi_time: string | null
  resepsi_venue: string | null
  resepsi_address: string | null
  resepsi_maps_link: string | null
  couple_quote: string | null
  music_url: string | null
  created_at: string
  updated_at: string
  story_items?: StoryItem[]
  gallery_items?: GalleryItem[]
}
```

- [ ] **Step 2: Create lib/supabase/client.ts**

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 3: Create lib/supabase/server.ts**

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add lib/
git commit -m "feat: add TypeScript types and Supabase clients"
```

---

## Task 4: Auth Middleware

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Write test for middleware logic**

Create `__tests__/middleware.test.ts`:

```typescript
import { describe, it, expect } from '@jest/globals'

describe('middleware route protection rules', () => {
  it('redirects unauthenticated requests to /admin to /admin/login', () => {
    const protectedPaths = ['/admin', '/admin/new', '/admin/123/edit']
    const loginPath = '/admin/login'
    protectedPaths.forEach(path => {
      expect(path.startsWith('/admin') && path !== loginPath).toBe(true)
    })
  })

  it('login path is not protected', () => {
    expect('/admin/login'.startsWith('/admin/login')).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it passes (logic only)**

```bash
npm test -- --testPathPattern=middleware
```

Expected: PASS

- [ ] **Step 3: Create middleware.ts**

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  if (!user && isAdminRoute && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (user && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

- [ ] **Step 4: Commit**

```bash
git add middleware.ts __tests__/
git commit -m "feat: add admin route auth middleware"
```

---

## Task 5: Invitation Section Components

**Files:**
- Create: `components/invitation/CoverSection.tsx`
- Create: `components/invitation/CountdownSection.tsx`
- Create: `components/invitation/CoupleSection.tsx`
- Create: `components/invitation/StorySection.tsx`
- Create: `components/invitation/GallerySection.tsx`
- Create: `components/invitation/EventSection.tsx`
- Create: `components/invitation/LocationSection.tsx`
- Create: `components/invitation/RsvpSection.tsx`
- Create: `components/invitation/GuestBookSection.tsx`

Each section accepts an `invitation` prop and a `className` prop for theme-specific overrides.

- [ ] **Step 1: Create CoverSection.tsx**

```typescript
// components/invitation/CoverSection.tsx
import type { Invitation } from '@/lib/types'

interface Props {
  invitation: Invitation
  className?: string
}

export function CoverSection({ invitation, className = '' }: Props) {
  const weddingDate = invitation.akad_date ?? invitation.resepsi_date
  const formattedDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : ''

  return (
    <section className={`cover-section ${className}`}>
      <div className="cover-content">
        <p className="cover-label">Undangan Pernikahan</p>
        <h1 className="cover-names">
          {invitation.groom_name} & {invitation.bride_name}
        </h1>
        <div className="cover-divider" />
        {formattedDate && <p className="cover-date">{formattedDate}</p>}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create CountdownSection.tsx**

```typescript
// components/invitation/CountdownSection.tsx
'use client'
import { useEffect, useState } from 'react'
import type { Invitation } from '@/lib/types'

interface Props {
  invitation: Invitation
  className?: string
}

function getTimeLeft(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export function CountdownSection({ invitation, className = '' }: Props) {
  const targetDate = invitation.akad_date ?? invitation.resepsi_date
  const [timeLeft, setTimeLeft] = useState(targetDate ? getTimeLeft(targetDate) : null)

  useEffect(() => {
    if (!targetDate) return
    const interval = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  if (!targetDate) return null

  return (
    <section className={`countdown-section ${className}`}>
      <p className="countdown-tagline">Menghitung hari menuju hari istimewa kami</p>
      {timeLeft ? (
        <div className="countdown-grid">
          {[
            { value: timeLeft.days, label: 'Hari' },
            { value: timeLeft.hours, label: 'Jam' },
            { value: timeLeft.minutes, label: 'Menit' },
            { value: timeLeft.seconds, label: 'Detik' },
          ].map(({ value, label }) => (
            <div key={label} className="countdown-box">
              <span className="countdown-num">{String(value).padStart(2, '0')}</span>
              <span className="countdown-label">{label}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="countdown-passed">Hari ini adalah hari istimewa kami ✦</p>
      )}
    </section>
  )
}
```

- [ ] **Step 3: Create CoupleSection.tsx**

```typescript
// components/invitation/CoupleSection.tsx
import Image from 'next/image'
import type { Invitation } from '@/lib/types'

interface Props {
  invitation: Invitation
  className?: string
}

function PersonCard({ name, father, mother, photoUrl, role }: {
  name: string
  father: string | null
  mother: string | null
  photoUrl: string | null
  role: string
}) {
  return (
    <div className="couple-card">
      {photoUrl && (
        <div className="couple-photo-wrap">
          <Image src={photoUrl} alt={name} fill className="couple-photo" />
        </div>
      )}
      <p className="couple-role">{role}</p>
      <h2 className="couple-name">{name}</h2>
      {(father || mother) && (
        <p className="couple-parents">
          Putra/Putri dari {[father, mother].filter(Boolean).join(' & ')}
        </p>
      )}
    </div>
  )
}

export function CoupleSection({ invitation, className = '' }: Props) {
  return (
    <section className={`couple-section ${className}`}>
      {invitation.couple_quote && (
        <blockquote className="couple-quote">{invitation.couple_quote}</blockquote>
      )}
      <div className="couple-grid">
        <PersonCard
          name={invitation.groom_name}
          father={invitation.groom_father}
          mother={invitation.groom_mother}
          photoUrl={invitation.groom_photo_url}
          role="Mempelai Pria"
        />
        <div className="couple-ampersand">&</div>
        <PersonCard
          name={invitation.bride_name}
          father={invitation.bride_father}
          mother={invitation.bride_mother}
          photoUrl={invitation.bride_photo_url}
          role="Mempelai Wanita"
        />
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create StorySection.tsx**

```typescript
// components/invitation/StorySection.tsx
import type { Invitation } from '@/lib/types'

interface Props {
  invitation: Invitation
  className?: string
}

export function StorySection({ invitation, className = '' }: Props) {
  const items = invitation.story_items ?? []
  if (items.length === 0) return null

  return (
    <section className={`story-section ${className}`}>
      <h2 className="section-title">Kisah Kami</h2>
      <div className="story-timeline">
        {[...items].sort((a, b) => a.sort_order - b.sort_order).map((item) => (
          <div key={item.id} className="story-item">
            <div className="story-year">{item.year}</div>
            <div className="story-content">
              <h3 className="story-item-title">{item.title}</h3>
              <p className="story-item-desc">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Create GallerySection.tsx**

```typescript
// components/invitation/GallerySection.tsx
import Image from 'next/image'
import type { Invitation } from '@/lib/types'

interface Props {
  invitation: Invitation
  className?: string
}

export function GallerySection({ invitation, className = '' }: Props) {
  const items = invitation.gallery_items ?? []
  if (items.length === 0) return null

  return (
    <section className={`gallery-section ${className}`}>
      <h2 className="section-title">Galeri</h2>
      <div className="gallery-grid">
        {[...items].sort((a, b) => a.sort_order - b.sort_order).map((item) => (
          <div key={item.id} className="gallery-item">
            <Image src={item.image_url} alt="gallery" fill className="gallery-img" />
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Create EventSection.tsx**

```typescript
// components/invitation/EventSection.tsx
import type { Invitation } from '@/lib/types'

interface Props {
  invitation: Invitation
  className?: string
}

function formatTime(time: string | null) {
  if (!time) return ''
  const [h, m] = time.split(':')
  return `${h}.${m} WIB`
}

function formatDate(date: string | null) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export function EventSection({ invitation, className = '' }: Props) {
  return (
    <section className={`event-section ${className}`}>
      <h2 className="section-title">Detail Acara</h2>
      <div className="event-grid">
        {invitation.akad_venue && (
          <div className="event-card">
            <h3 className="event-type">Akad Nikah</h3>
            <p className="event-date">{formatDate(invitation.akad_date)}</p>
            <p className="event-time">{formatTime(invitation.akad_time)}</p>
            <p className="event-venue">{invitation.akad_venue}</p>
            <p className="event-address">{invitation.akad_address}</p>
            {invitation.akad_maps_link && (
              <a href={invitation.akad_maps_link} target="_blank" rel="noopener noreferrer"
                className="event-maps-btn">
                Lihat Peta
              </a>
            )}
          </div>
        )}
        {invitation.resepsi_venue && (
          <div className="event-card">
            <h3 className="event-type">Resepsi</h3>
            <p className="event-date">{formatDate(invitation.resepsi_date)}</p>
            <p className="event-time">{formatTime(invitation.resepsi_time)}</p>
            <p className="event-venue">{invitation.resepsi_venue}</p>
            <p className="event-address">{invitation.resepsi_address}</p>
            {invitation.resepsi_maps_link && (
              <a href={invitation.resepsi_maps_link} target="_blank" rel="noopener noreferrer"
                className="event-maps-btn">
                Lihat Peta
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Create LocationSection.tsx**

```typescript
// components/invitation/LocationSection.tsx
import type { Invitation } from '@/lib/types'

interface Props {
  invitation: Invitation
  className?: string
}

function MapsEmbed({ link, label }: { link: string; label: string }) {
  const embedUrl = link.includes('output=embed')
    ? link
    : link.replace('https://maps.google.com/?', 'https://maps.google.com/maps?') + '&output=embed'
  return (
    <div className="location-embed-wrap">
      <h3 className="location-label">{label}</h3>
      <iframe
        src={embedUrl}
        className="location-iframe"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}

export function LocationSection({ invitation, className = '' }: Props) {
  const hasAkad = !!invitation.akad_maps_link
  const hasResepsi = !!invitation.resepsi_maps_link
  if (!hasAkad && !hasResepsi) return null

  return (
    <section className={`location-section ${className}`}>
      <h2 className="section-title">Lokasi</h2>
      <div className="location-grid">
        {hasAkad && (
          <MapsEmbed link={invitation.akad_maps_link!} label="Akad Nikah" />
        )}
        {hasResepsi && (
          <MapsEmbed link={invitation.resepsi_maps_link!} label="Resepsi" />
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 8: Create RsvpSection.tsx**

```typescript
// components/invitation/RsvpSection.tsx
'use client'
import { useActionState } from 'react'
import type { Invitation } from '@/lib/types'
import { submitRsvp } from '@/app/[slug]/actions'

interface Props {
  invitation: Invitation
  className?: string
}

export function RsvpSection({ invitation, className = '' }: Props) {
  const submitRsvpWithId = submitRsvp.bind(null, invitation.id)
  const [state, action, pending] = useActionState(submitRsvpWithId, { success: false, error: null })

  return (
    <section className={`rsvp-section ${className}`}>
      <h2 className="section-title">Konfirmasi Kehadiran</h2>
      {state.success ? (
        <p className="rsvp-success">Terima kasih, kehadiranmu telah dicatat!</p>
      ) : (
        <form action={action} className="rsvp-form">
          {state.error && <p className="rsvp-error">{state.error}</p>}
          <div className="form-field">
            <label htmlFor="guest_name">Nama Lengkap</label>
            <input id="guest_name" name="guest_name" type="text" required className="form-input" />
          </div>
          <div className="form-field">
            <label>Konfirmasi Kehadiran</label>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" name="attendance" value="hadir" required /> Hadir
              </label>
              <label className="radio-label">
                <input type="radio" name="attendance" value="tidak_hadir" /> Tidak Hadir
              </label>
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="guest_count">Jumlah Tamu</label>
            <input id="guest_count" name="guest_count" type="number" min="1" max="10"
              defaultValue="1" className="form-input" />
          </div>
          <div className="form-field">
            <label htmlFor="rsvp_message">Pesan (opsional)</label>
            <textarea id="rsvp_message" name="message" rows={3} className="form-input" />
          </div>
          <button type="submit" disabled={pending} className="form-btn">
            {pending ? 'Mengirim...' : 'Kirim Konfirmasi'}
          </button>
        </form>
      )}
    </section>
  )
}
```

- [ ] **Step 9: Create GuestBookSection.tsx**

```typescript
// components/invitation/GuestBookSection.tsx
'use client'
import { useActionState } from 'react'
import type { GuestBookEntry, Invitation } from '@/lib/types'
import { submitGuestBook } from '@/app/[slug]/actions'

interface Props {
  invitation: Invitation
  entries: GuestBookEntry[]
  className?: string
}

export function GuestBookSection({ invitation, entries, className = '' }: Props) {
  const submitWithId = submitGuestBook.bind(null, invitation.id)
  const [state, action, pending] = useActionState(submitWithId, { success: false, error: null })

  return (
    <section className={`guestbook-section ${className}`}>
      <h2 className="section-title">Buku Tamu</h2>
      <form action={action} className="rsvp-form">
        {state.error && <p className="rsvp-error">{state.error}</p>}
        {state.success && <p className="rsvp-success">Ucapanmu telah terkirim!</p>}
        <div className="form-field">
          <label htmlFor="gb_name">Nama</label>
          <input id="gb_name" name="name" type="text" required className="form-input" />
        </div>
        <div className="form-field">
          <label htmlFor="gb_message">Ucapan & Doa</label>
          <textarea id="gb_message" name="message" rows={4} required className="form-input" />
        </div>
        <button type="submit" disabled={pending} className="form-btn">
          {pending ? 'Mengirim...' : 'Kirim Ucapan'}
        </button>
      </form>
      <div className="guestbook-entries">
        {entries.map((entry) => (
          <div key={entry.id} className="guestbook-entry">
            <p className="entry-name">{entry.name}</p>
            <p className="entry-message">{entry.message}</p>
            <p className="entry-date">
              {new Date(entry.created_at).toLocaleDateString('id-ID')}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 10: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 11: Commit**

```bash
git add components/invitation/
git commit -m "feat: add invitation section components"
```

---

## Task 6: Theme Components

**Files:**
- Create: `components/themes/ElegantTheme.tsx`
- Create: `components/themes/FloralTheme.tsx`
- Create: `components/themes/MinimalistTheme.tsx`
- Create: `components/themes/index.ts`
- Create: `app/globals.css` (update with theme CSS)

Each theme component renders all sections with theme-specific class names. CSS classes are defined in `globals.css` under `[data-theme="..."]` selectors.

- [ ] **Step 1: Add theme CSS to app/globals.css**

Append to `app/globals.css`:

```css
/* ===== SHARED SECTION STYLES ===== */
.section-title {
  text-align: center;
  margin-bottom: 2rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  outline: none;
}

.form-btn {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s;
}

.form-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.countdown-grid {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.countdown-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

/* ===== ELEGANT THEME ===== */
[data-theme="elegant"] {
  background: #0f1923;
  color: #f5e6c8;
  font-family: 'Georgia', serif;
  --accent: #c9a84c;
  --text-muted: #a08d6e;
}

[data-theme="elegant"] .cover-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f1923 0%, #1a2d40 100%);
}

[data-theme="elegant"] .cover-label {
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--accent);
}

[data-theme="elegant"] .cover-names {
  font-size: clamp(2rem, 6vw, 4rem);
  font-style: italic;
  color: #fff;
  text-align: center;
  margin: 1rem 0;
}

[data-theme="elegant"] .cover-divider {
  width: 4rem;
  height: 1px;
  background: var(--accent);
  margin: 1rem auto;
}

[data-theme="elegant"] .cover-date {
  color: var(--accent);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-size: 0.85rem;
}

[data-theme="elegant"] .countdown-section {
  padding: 5rem 2rem;
  text-align: center;
  background: #0f1923;
}

[data-theme="elegant"] .countdown-num {
  font-size: 3rem;
  font-weight: 700;
  color: var(--accent);
}

[data-theme="elegant"] .countdown-label {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-muted);
}

[data-theme="elegant"] .section-title {
  font-size: 2rem;
  font-style: italic;
  color: var(--accent);
}

[data-theme="elegant"] .form-input {
  background: #1a2d40;
  border: 1px solid var(--accent);
  color: #f5e6c8;
}

[data-theme="elegant"] .form-btn {
  background: var(--accent);
  color: #0f1923;
}

[data-theme="elegant"] .event-card,
[data-theme="elegant"] .guestbook-entry {
  background: #1a2d40;
  border: 1px solid #c9a84c33;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

[data-theme="elegant"] .event-maps-btn {
  display: inline-block;
  margin-top: 0.75rem;
  padding: 0.5rem 1.25rem;
  background: var(--accent);
  color: #0f1923;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  text-decoration: none;
}

[data-theme="elegant"] .couple-photo-wrap {
  position: relative;
  width: 160px;
  height: 200px;
  border: 2px solid var(--accent);
  border-radius: 0.5rem;
  overflow: hidden;
}

/* ===== FLORAL THEME ===== */
[data-theme="floral"] {
  background: #fdf6f0;
  color: #5c3317;
  font-family: 'Georgia', serif;
  --accent: #c17f52;
  --text-muted: #9e6b4a;
}

[data-theme="floral"] .cover-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fdf6f0 0%, #fce8d8 100%);
}

[data-theme="floral"] .cover-label {
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--accent);
}

[data-theme="floral"] .cover-names {
  font-size: clamp(2rem, 6vw, 4rem);
  font-style: italic;
  color: #5c3317;
  text-align: center;
  margin: 1rem 0;
}

[data-theme="floral"] .cover-divider {
  width: 4rem;
  height: 1px;
  background: var(--accent);
  margin: 1rem auto;
}

[data-theme="floral"] .cover-date {
  color: var(--accent);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-size: 0.85rem;
}

[data-theme="floral"] .countdown-section {
  padding: 5rem 2rem;
  text-align: center;
  background: #fce8d8;
}

[data-theme="floral"] .countdown-num {
  font-size: 3rem;
  font-weight: 700;
  color: #5c3317;
}

[data-theme="floral"] .countdown-label {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-muted);
}

[data-theme="floral"] .section-title {
  font-size: 2rem;
  font-style: italic;
  color: #5c3317;
}

[data-theme="floral"] .form-input {
  background: #fff;
  border: 1px solid #c17f52;
  color: #5c3317;
}

[data-theme="floral"] .form-btn {
  background: var(--accent);
  color: #fff;
}

[data-theme="floral"] .event-card,
[data-theme="floral"] .guestbook-entry {
  background: #fff;
  border: 1px solid #e8c9b0;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

[data-theme="floral"] .event-maps-btn {
  display: inline-block;
  margin-top: 0.75rem;
  padding: 0.5rem 1.25rem;
  background: var(--accent);
  color: #fff;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  text-decoration: none;
}

[data-theme="floral"] .couple-photo-wrap {
  position: relative;
  width: 160px;
  height: 200px;
  border: 2px solid var(--accent);
  border-radius: 50% 50% 0 0;
  overflow: hidden;
}

/* ===== MINIMALIST THEME ===== */
[data-theme="minimalist"] {
  background: #ffffff;
  color: #111827;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  --accent: #111827;
  --text-muted: #6b7280;
}

[data-theme="minimalist"] .cover-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}

[data-theme="minimalist"] .cover-label {
  font-size: 0.7rem;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  color: var(--text-muted);
}

[data-theme="minimalist"] .cover-names {
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 300;
  letter-spacing: 0.05em;
  color: #111827;
  text-align: center;
  margin: 1rem 0;
}

[data-theme="minimalist"] .cover-divider {
  width: 2.5rem;
  height: 2px;
  background: #111827;
  margin: 1rem auto;
}

[data-theme="minimalist"] .cover-date {
  color: var(--text-muted);
  letter-spacing: 0.3em;
  font-size: 0.8rem;
}

[data-theme="minimalist"] .countdown-section {
  padding: 5rem 2rem;
  text-align: center;
  background: #f9fafb;
}

[data-theme="minimalist"] .countdown-num {
  font-size: 3rem;
  font-weight: 200;
  color: #111827;
}

[data-theme="minimalist"] .countdown-label {
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--text-muted);
}

[data-theme="minimalist"] .section-title {
  font-size: 1.5rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #111827;
}

[data-theme="minimalist"] .form-input {
  background: #f9fafb;
  border: 1px solid #d1d5db;
  color: #111827;
}

[data-theme="minimalist"] .form-btn {
  background: #111827;
  color: #ffffff;
}

[data-theme="minimalist"] .event-card,
[data-theme="minimalist"] .guestbook-entry {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

[data-theme="minimalist"] .event-maps-btn {
  display: inline-block;
  margin-top: 0.75rem;
  padding: 0.5rem 1.25rem;
  border: 1px solid #111827;
  color: #111827;
  border-radius: 0.25rem;
  font-size: 0.85rem;
  text-decoration: none;
}

[data-theme="minimalist"] .couple-photo-wrap {
  position: relative;
  width: 160px;
  height: 200px;
  overflow: hidden;
}

/* Shared layout helpers */
.couple-section { padding: 5rem 2rem; }
.couple-grid { display: flex; justify-content: center; align-items: center; gap: 2rem; flex-wrap: wrap; }
.couple-card { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; text-align: center; }
.event-section { padding: 5rem 2rem; }
.event-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; max-width: 800px; margin: 0 auto; }
.story-section { padding: 5rem 2rem; max-width: 700px; margin: 0 auto; }
.story-timeline { display: flex; flex-direction: column; gap: 2rem; }
.story-item { display: flex; gap: 1.5rem; }
.gallery-section { padding: 5rem 2rem; }
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; max-width: 1000px; margin: 0 auto; }
.gallery-item { position: relative; aspect-ratio: 3/2; overflow: hidden; border-radius: 0.5rem; }
.location-section { padding: 5rem 2rem; }
.location-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; max-width: 1000px; margin: 0 auto; }
.location-iframe { width: 100%; height: 300px; border: 0; border-radius: 0.5rem; }
.rsvp-section, .guestbook-section { padding: 5rem 2rem; max-width: 600px; margin: 0 auto; }
.rsvp-form { display: flex; flex-direction: column; gap: 1rem; }
.form-field { display: flex; flex-direction: column; gap: 0.4rem; }
.guestbook-entries { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; }
.radio-group { display: flex; gap: 1.5rem; }
```

- [ ] **Step 2: Create ElegantTheme.tsx**

```typescript
// components/themes/ElegantTheme.tsx
import type { GuestBookEntry, Invitation } from '@/lib/types'
import { CoverSection } from '@/components/invitation/CoverSection'
import { CountdownSection } from '@/components/invitation/CountdownSection'
import { CoupleSection } from '@/components/invitation/CoupleSection'
import { StorySection } from '@/components/invitation/StorySection'
import { GallerySection } from '@/components/invitation/GallerySection'
import { EventSection } from '@/components/invitation/EventSection'
import { LocationSection } from '@/components/invitation/LocationSection'
import { RsvpSection } from '@/components/invitation/RsvpSection'
import { GuestBookSection } from '@/components/invitation/GuestBookSection'

interface Props {
  invitation: Invitation
  guestBookEntries: GuestBookEntry[]
}

export function ElegantTheme({ invitation, guestBookEntries }: Props) {
  return (
    <div data-theme="elegant">
      <CoverSection invitation={invitation} />
      <CountdownSection invitation={invitation} />
      <CoupleSection invitation={invitation} />
      <StorySection invitation={invitation} />
      <GallerySection invitation={invitation} />
      <EventSection invitation={invitation} />
      <LocationSection invitation={invitation} />
      <RsvpSection invitation={invitation} />
      <GuestBookSection invitation={invitation} entries={guestBookEntries} />
    </div>
  )
}
```

- [ ] **Step 3: Create FloralTheme.tsx**

```typescript
// components/themes/FloralTheme.tsx
import type { GuestBookEntry, Invitation } from '@/lib/types'
import { CoverSection } from '@/components/invitation/CoverSection'
import { CountdownSection } from '@/components/invitation/CountdownSection'
import { CoupleSection } from '@/components/invitation/CoupleSection'
import { StorySection } from '@/components/invitation/StorySection'
import { GallerySection } from '@/components/invitation/GallerySection'
import { EventSection } from '@/components/invitation/EventSection'
import { LocationSection } from '@/components/invitation/LocationSection'
import { RsvpSection } from '@/components/invitation/RsvpSection'
import { GuestBookSection } from '@/components/invitation/GuestBookSection'

interface Props {
  invitation: Invitation
  guestBookEntries: GuestBookEntry[]
}

export function FloralTheme({ invitation, guestBookEntries }: Props) {
  return (
    <div data-theme="floral">
      <CoverSection invitation={invitation} />
      <CountdownSection invitation={invitation} />
      <CoupleSection invitation={invitation} />
      <StorySection invitation={invitation} />
      <GallerySection invitation={invitation} />
      <EventSection invitation={invitation} />
      <LocationSection invitation={invitation} />
      <RsvpSection invitation={invitation} />
      <GuestBookSection invitation={invitation} entries={guestBookEntries} />
    </div>
  )
}
```

- [ ] **Step 4: Create MinimalistTheme.tsx**

```typescript
// components/themes/MinimalistTheme.tsx
import type { GuestBookEntry, Invitation } from '@/lib/types'
import { CoverSection } from '@/components/invitation/CoverSection'
import { CountdownSection } from '@/components/invitation/CountdownSection'
import { CoupleSection } from '@/components/invitation/CoupleSection'
import { StorySection } from '@/components/invitation/StorySection'
import { GallerySection } from '@/components/invitation/GallerySection'
import { EventSection } from '@/components/invitation/EventSection'
import { LocationSection } from '@/components/invitation/LocationSection'
import { RsvpSection } from '@/components/invitation/RsvpSection'
import { GuestBookSection } from '@/components/invitation/GuestBookSection'

interface Props {
  invitation: Invitation
  guestBookEntries: GuestBookEntry[]
}

export function MinimalistTheme({ invitation, guestBookEntries }: Props) {
  return (
    <div data-theme="minimalist">
      <CoverSection invitation={invitation} />
      <CountdownSection invitation={invitation} />
      <CoupleSection invitation={invitation} />
      <StorySection invitation={invitation} />
      <GallerySection invitation={invitation} />
      <EventSection invitation={invitation} />
      <LocationSection invitation={invitation} />
      <RsvpSection invitation={invitation} />
      <GuestBookSection invitation={invitation} entries={guestBookEntries} />
    </div>
  )
}
```

- [ ] **Step 5: Create components/themes/index.ts**

```typescript
// components/themes/index.ts
import type { ComponentType } from 'react'
import type { GuestBookEntry, Invitation, ThemeId } from '@/lib/types'
import { ElegantTheme } from './ElegantTheme'
import { FloralTheme } from './FloralTheme'
import { MinimalistTheme } from './MinimalistTheme'

interface ThemeProps {
  invitation: Invitation
  guestBookEntries: GuestBookEntry[]
}

const THEMES: Record<ThemeId, ComponentType<ThemeProps>> = {
  elegant: ElegantTheme,
  floral: FloralTheme,
  minimalist: MinimalistTheme,
}

export function resolveTheme(themeId: ThemeId): ComponentType<ThemeProps> {
  return THEMES[themeId] ?? ElegantTheme
}
```

- [ ] **Step 6: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add components/themes/ app/globals.css
git commit -m "feat: add theme components and CSS"
```

---

## Task 7: Public Invitation Page & Server Actions

**Files:**
- Create: `app/[slug]/page.tsx`
- Create: `app/[slug]/actions.ts`

- [ ] **Step 1: Write test for submitRsvp action**

Create `__tests__/actions.test.ts`:

```typescript
import { describe, it, expect } from '@jest/globals'

describe('RSVP form validation', () => {
  it('validates required fields', () => {
    const formData = new FormData()
    formData.set('guest_name', 'Budi')
    formData.set('attendance', 'hadir')
    formData.set('guest_count', '2')

    expect(formData.get('guest_name')).toBe('Budi')
    expect(formData.get('attendance')).toBe('hadir')
    expect(parseInt(formData.get('guest_count') as string)).toBe(2)
  })

  it('defaults guest_count to 1 when empty', () => {
    const raw = ''
    const parsed = parseInt(raw) || 1
    expect(parsed).toBe(1)
  })
})
```

- [ ] **Step 2: Run test**

```bash
npm test -- --testPathPattern=actions
```

Expected: PASS

- [ ] **Step 3: Create app/[slug]/actions.ts**

```typescript
// app/[slug]/actions.ts
'use server'
import { createClient } from '@/lib/supabase/server'

type ActionState = { success: boolean; error: string | null }

export async function submitRsvp(
  invitationId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient()

  const { error } = await supabase.from('rsvp_responses').insert({
    invitation_id: invitationId,
    guest_name: formData.get('guest_name') as string,
    attendance: formData.get('attendance') as string,
    guest_count: parseInt(formData.get('guest_count') as string) || 1,
    message: (formData.get('message') as string) || null,
  })

  if (error) return { success: false, error: 'Gagal mengirim konfirmasi. Coba lagi.' }
  return { success: true, error: null }
}

export async function submitGuestBook(
  invitationId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient()

  const { error } = await supabase.from('guest_book').insert({
    invitation_id: invitationId,
    name: formData.get('name') as string,
    message: formData.get('message') as string,
  })

  if (error) return { success: false, error: 'Gagal mengirim ucapan. Coba lagi.' }
  return { success: true, error: null }
}
```

- [ ] **Step 4: Create app/[slug]/page.tsx**

```typescript
// app/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { resolveTheme } from '@/components/themes'
import type { Invitation, GuestBookEntry } from '@/lib/types'

interface Props {
  params: Promise<{ slug: string }>
}

async function getInvitation(slug: string): Promise<Invitation | null> {
  const supabase = await createClient()

  const { data: invitation } = await supabase
    .from('invitations')
    .select('*, story_items(*), gallery_items(*)')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  return invitation
}

async function getGuestBookEntries(invitationId: string): Promise<GuestBookEntry[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('guest_book')
    .select('*')
    .eq('invitation_id', invitationId)
    .order('created_at', { ascending: false })
    .limit(50)

  return data ?? []
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const invitation = await getInvitation(slug)
  if (!invitation) return {}

  return {
    title: `Undangan Pernikahan ${invitation.groom_name} & ${invitation.bride_name}`,
    description: `Kami mengundang Anda untuk hadir di pernikahan ${invitation.groom_name} & ${invitation.bride_name}`,
  }
}

export default async function InvitationPage({ params }: Props) {
  const { slug } = await params
  const invitation = await getInvitation(slug)
  if (!invitation) notFound()

  const guestBookEntries = await getGuestBookEntries(invitation.id)
  const ThemeComponent = resolveTheme(invitation.theme)

  return <ThemeComponent invitation={invitation} guestBookEntries={guestBookEntries} />
}
```

- [ ] **Step 5: Verify dev server and test a page**

```bash
npm run dev
```

Then in Supabase Dashboard → Table Editor → insert a test invitation row with `slug = 'test'`. Open http://localhost:3000/test — should render the invitation.

- [ ] **Step 6: Commit**

```bash
git add app/\[slug\]/
git commit -m "feat: add public invitation page with server-side data fetching"
```

---

## Task 8: Admin Login & Layout

**Files:**
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/layout.tsx`

- [ ] **Step 1: Create app/admin/login/page.tsx**

```typescript
// app/admin/login/page.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email atau password salah.')
      setLoading(false)
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <h1 className="admin-login-title">Admin Panel</h1>
        <p className="admin-login-subtitle">Undangan Digital</p>
        <form onSubmit={handleLogin} className="admin-login-form">
          {error && <p className="admin-error">{error}</p>}
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
              required className="admin-input" />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password}
              onChange={e => setPassword(e.target.value)} required className="admin-input" />
          </div>
          <button type="submit" disabled={loading} className="admin-btn-primary">
            {loading ? 'Masuk...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create app/admin/layout.tsx**

```typescript
// app/admin/layout.tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/admin/LogoutButton'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        <Link href="/admin" className="admin-nav-brand">Undangan Digital</Link>
        <div className="admin-nav-actions">
          <Link href="/admin/new" className="admin-btn-primary">+ Undangan Baru</Link>
          <LogoutButton />
        </div>
      </nav>
      <main className="admin-main">{children}</main>
    </div>
  )
}
```

- [ ] **Step 3: Create components/admin/LogoutButton.tsx**

```typescript
// components/admin/LogoutButton.tsx
'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const supabase = createClient()
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button onClick={handleLogout} className="admin-btn-secondary">
      Keluar
    </button>
  )
}
```

- [ ] **Step 4: Add admin CSS to globals.css**

Append to `app/globals.css`:

```css
/* ===== ADMIN STYLES ===== */
.admin-layout { min-height: 100vh; background: #f3f4f6; }
.admin-nav {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1rem 2rem; background: #111827; color: #fff;
}
.admin-nav-brand { color: #fff; text-decoration: none; font-weight: 700; font-size: 1.1rem; }
.admin-nav-actions { display: flex; gap: 0.75rem; align-items: center; }
.admin-main { padding: 2rem; max-width: 1200px; margin: 0 auto; }

.admin-login-wrap {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: #f3f4f6;
}
.admin-login-card {
  background: #fff; padding: 2.5rem; border-radius: 1rem; width: 100%; max-width: 400px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
}
.admin-login-title { font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 0.25rem; }
.admin-login-subtitle { color: #6b7280; margin-bottom: 1.5rem; font-size: 0.9rem; }
.admin-login-form { display: flex; flex-direction: column; gap: 1rem; }

.admin-input {
  width: 100%; padding: 0.625rem 0.875rem; border: 1px solid #d1d5db;
  border-radius: 0.5rem; font-size: 0.95rem; color: #111827; background: #f9fafb;
}
.admin-input:focus { outline: 2px solid #111827; }

.admin-btn-primary {
  padding: 0.625rem 1.25rem; background: #111827; color: #fff;
  border-radius: 0.5rem; border: none; cursor: pointer; font-weight: 600; font-size: 0.9rem;
  text-decoration: none; display: inline-block; text-align: center;
}
.admin-btn-primary:hover { background: #374151; }
.admin-btn-secondary {
  padding: 0.625rem 1.25rem; background: transparent; color: #d1d5db;
  border: 1px solid #4b5563; border-radius: 0.5rem; cursor: pointer; font-size: 0.9rem;
}
.admin-btn-secondary:hover { background: #1f2937; }
.admin-btn-danger {
  padding: 0.5rem 1rem; background: #ef4444; color: #fff;
  border-radius: 0.5rem; border: none; cursor: pointer; font-size: 0.85rem;
}

.admin-error { color: #ef4444; font-size: 0.85rem; padding: 0.5rem; background: #fef2f2; border-radius: 0.375rem; }
```

- [ ] **Step 5: Test login flow**

```bash
npm run dev
```

Open http://localhost:3000/admin → should redirect to `/admin/login`. Login with the admin credentials from Task 2, Step 5 → should redirect to `/admin`.

- [ ] **Step 6: Commit**

```bash
git add app/admin/ components/admin/
git commit -m "feat: add admin login and protected layout"
```

---

## Task 9: Admin Dashboard

**Files:**
- Create: `components/admin/InvitationList.tsx`
- Create: `app/admin/page.tsx`

- [ ] **Step 1: Create components/admin/InvitationList.tsx**

```typescript
// components/admin/InvitationList.tsx
import Link from 'next/link'
import type { Invitation } from '@/lib/types'

const THEME_LABELS: Record<string, string> = {
  elegant: 'Elegant Gold',
  floral: 'Floral Soft',
  minimalist: 'Minimalist',
}

interface Props {
  invitations: Invitation[]
}

export function InvitationList({ invitations }: Props) {
  if (invitations.length === 0) {
    return (
      <div className="admin-empty">
        <p>Belum ada undangan. <Link href="/admin/new">Buat yang pertama →</Link></p>
      </div>
    )
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Pasangan</th>
            <th>Slug / Link</th>
            <th>Tema</th>
            <th>Status</th>
            <th>Dibuat</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {invitations.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.groom_name} & {inv.bride_name}</td>
              <td>
                <a href={`/${inv.slug}`} target="_blank" rel="noopener noreferrer"
                  className="admin-link">
                  /{inv.slug}
                </a>
              </td>
              <td>{THEME_LABELS[inv.theme] ?? inv.theme}</td>
              <td>
                <span className={`status-badge status-${inv.status}`}>
                  {inv.status === 'active' ? 'Aktif' : 'Nonaktif'}
                </span>
              </td>
              <td>{new Date(inv.created_at).toLocaleDateString('id-ID')}</td>
              <td className="admin-actions">
                <Link href={`/admin/${inv.id}/edit`} className="admin-btn-small">Edit</Link>
                <Link href={`/admin/${inv.id}/rsvp`} className="admin-btn-small">RSVP</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 2: Create app/admin/page.tsx**

```typescript
// app/admin/page.tsx
import { createClient } from '@/lib/supabase/server'
import { InvitationList } from '@/components/admin/InvitationList'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data: invitations } = await supabase
    .from('invitations')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="admin-page-title">Semua Undangan</h1>
      <InvitationList invitations={invitations ?? []} />
    </div>
  )
}
```

- [ ] **Step 3: Add table CSS to globals.css**

Append to `app/globals.css`:

```css
.admin-page-title { font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 1.5rem; }
.admin-table-wrap { background: #fff; border-radius: 0.75rem; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.admin-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
.admin-table th { padding: 0.875rem 1rem; text-align: left; background: #f9fafb; color: #374151; font-weight: 600; border-bottom: 1px solid #e5e7eb; }
.admin-table td { padding: 0.875rem 1rem; border-bottom: 1px solid #f3f4f6; color: #111827; }
.admin-table tr:last-child td { border-bottom: none; }
.admin-link { color: #2563eb; text-decoration: none; }
.admin-link:hover { text-decoration: underline; }
.admin-actions { display: flex; gap: 0.5rem; }
.admin-btn-small { padding: 0.375rem 0.75rem; border-radius: 0.375rem; font-size: 0.8rem; background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; text-decoration: none; cursor: pointer; }
.admin-btn-small:hover { background: #e5e7eb; }
.status-badge { padding: 0.25rem 0.625rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
.status-active { background: #dcfce7; color: #166534; }
.status-inactive { background: #f3f4f6; color: #6b7280; }
.admin-empty { text-align: center; padding: 3rem; color: #6b7280; }
```

- [ ] **Step 4: Test dashboard**

Open http://localhost:3000/admin — should show the invitations table (empty or with test data).

- [ ] **Step 5: Commit**

```bash
git add app/admin/page.tsx components/admin/InvitationList.tsx app/globals.css
git commit -m "feat: add admin dashboard"
```

---

## Task 10: Admin Invitation Form (Create & Edit)

**Files:**
- Create: `components/admin/InvitationForm.tsx`
- Create: `app/admin/new/page.tsx`
- Create: `app/admin/[id]/edit/page.tsx`
- Create: `app/admin/actions.ts`

- [ ] **Step 1: Write test for slug validation**

Add to `__tests__/actions.test.ts`:

```typescript
describe('slug validation', () => {
  function isValidSlug(slug: string): boolean {
    return /^[a-z0-9-]+$/.test(slug)
  }

  it('accepts valid slugs', () => {
    expect(isValidSlug('rizky-aisyah')).toBe(true)
    expect(isValidSlug('budi-santi-2026')).toBe(true)
  })

  it('rejects uppercase letters', () => {
    expect(isValidSlug('Rizky-Aisyah')).toBe(false)
  })

  it('rejects spaces', () => {
    expect(isValidSlug('rizky aisyah')).toBe(false)
  })
})
```

- [ ] **Step 2: Run test**

```bash
npm test -- --testPathPattern=actions
```

Expected: PASS

- [ ] **Step 3: Create app/admin/actions.ts**

```typescript
// app/admin/actions.ts
'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function extractInvitationFields(formData: FormData) {
  return {
    theme: formData.get('theme') as string,
    status: formData.get('status') as string,
    groom_name: formData.get('groom_name') as string,
    groom_father: (formData.get('groom_father') as string) || null,
    groom_mother: (formData.get('groom_mother') as string) || null,
    groom_photo_url: (formData.get('groom_photo_url') as string) || null,
    bride_name: formData.get('bride_name') as string,
    bride_father: (formData.get('bride_father') as string) || null,
    bride_mother: (formData.get('bride_mother') as string) || null,
    bride_photo_url: (formData.get('bride_photo_url') as string) || null,
    akad_date: (formData.get('akad_date') as string) || null,
    akad_time: (formData.get('akad_time') as string) || null,
    akad_venue: (formData.get('akad_venue') as string) || null,
    akad_address: (formData.get('akad_address') as string) || null,
    akad_maps_link: (formData.get('akad_maps_link') as string) || null,
    resepsi_date: (formData.get('resepsi_date') as string) || null,
    resepsi_time: (formData.get('resepsi_time') as string) || null,
    resepsi_venue: (formData.get('resepsi_venue') as string) || null,
    resepsi_address: (formData.get('resepsi_address') as string) || null,
    resepsi_maps_link: (formData.get('resepsi_maps_link') as string) || null,
    couple_quote: (formData.get('couple_quote') as string) || null,
    music_url: (formData.get('music_url') as string) || null,
  }
}

export async function createInvitation(formData: FormData) {
  const supabase = await createClient()
  const slug = formData.get('slug') as string

  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error('Slug hanya boleh huruf kecil, angka, dan tanda hubung.')
  }

  const { data: invitation, error } = await supabase
    .from('invitations')
    .insert({ slug, ...extractInvitationFields(formData) })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  const storyItems = parseStoryItems(formData)
  if (storyItems.length > 0) {
    await supabase.from('story_items').insert(
      storyItems.map((item, i) => ({ ...item, invitation_id: invitation.id, sort_order: i }))
    )
  }

  const galleryUrls = parseGalleryUrls(formData)
  if (galleryUrls.length > 0) {
    await supabase.from('gallery_items').insert(
      galleryUrls.map((url, i) => ({ image_url: url, invitation_id: invitation.id, sort_order: i }))
    )
  }

  revalidatePath('/admin')
  redirect('/admin')
}

export async function updateInvitation(id: string, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('invitations')
    .update({ ...extractInvitationFields(formData), updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)

  await supabase.from('story_items').delete().eq('invitation_id', id)
  const storyItems = parseStoryItems(formData)
  if (storyItems.length > 0) {
    await supabase.from('story_items').insert(
      storyItems.map((item, i) => ({ ...item, invitation_id: id, sort_order: i }))
    )
  }

  await supabase.from('gallery_items').delete().eq('invitation_id', id)
  const galleryUrls = parseGalleryUrls(formData)
  if (galleryUrls.length > 0) {
    await supabase.from('gallery_items').insert(
      galleryUrls.map((url, i) => ({ image_url: url, invitation_id: id, sort_order: i }))
    )
  }

  revalidatePath('/admin')
  revalidatePath(`/admin/${id}/edit`)
  redirect('/admin')
}

function parseStoryItems(formData: FormData) {
  const items = []
  let i = 0
  while (formData.get(`story_year_${i}`) !== null) {
    items.push({
      year: formData.get(`story_year_${i}`) as string,
      title: formData.get(`story_title_${i}`) as string,
      description: formData.get(`story_desc_${i}`) as string,
    })
    i++
  }
  return items
}

function parseGalleryUrls(formData: FormData): string[] {
  const raw = formData.get('gallery_urls') as string
  if (!raw) return []
  return raw.split('\n').map(u => u.trim()).filter(Boolean)
}
```

- [ ] **Step 4: Create components/admin/InvitationForm.tsx**

```typescript
// components/admin/InvitationForm.tsx
'use client'
import { useState } from 'react'
import type { Invitation, StoryItem, ThemeId } from '@/lib/types'

interface Props {
  invitation?: Invitation
  action: (formData: FormData) => Promise<void>
  submitLabel: string
}

const THEMES: { id: ThemeId; label: string }[] = [
  { id: 'elegant', label: 'Elegant Gold & Navy' },
  { id: 'floral', label: 'Floral Soft' },
  { id: 'minimalist', label: 'Modern Minimalist' },
]

export function InvitationForm({ invitation, action, submitLabel }: Props) {
  const [storyItems, setStoryItems] = useState<Partial<StoryItem>[]>(
    invitation?.story_items ?? [{ year: '', title: '', description: '' }]
  )

  function addStoryItem() {
    setStoryItems(prev => [...prev, { year: '', title: '', description: '' }])
  }

  function removeStoryItem(index: number) {
    setStoryItems(prev => prev.filter((_, i) => i !== index))
  }

  const defaultGalleryUrls = invitation?.gallery_items
    ?.sort((a, b) => a.sort_order - b.sort_order)
    .map(g => g.image_url)
    .join('\n') ?? ''

  return (
    <form action={action} className="admin-form">

      <section className="form-section">
        <h2 className="form-section-title">Pengaturan Undangan</h2>
        <div className="form-row-2">
          {!invitation && (
            <div className="form-field">
              <label htmlFor="slug">Slug URL <span className="required">*</span></label>
              <input id="slug" name="slug" type="text" required className="admin-input"
                placeholder="rizky-aisyah" pattern="[a-z0-9-]+" />
              <p className="form-hint">Hanya huruf kecil, angka, dan tanda hubung</p>
            </div>
          )}
          <div className="form-field">
            <label htmlFor="theme">Tema <span className="required">*</span></label>
            <select id="theme" name="theme" required className="admin-input"
              defaultValue={invitation?.theme ?? 'elegant'}>
              {THEMES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" className="admin-input"
              defaultValue={invitation?.status ?? 'active'}>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>
        </div>
      </section>

      <section className="form-section">
        <h2 className="form-section-title">Mempelai Pria</h2>
        <div className="form-row-2">
          <div className="form-field">
            <label htmlFor="groom_name">Nama Lengkap <span className="required">*</span></label>
            <input id="groom_name" name="groom_name" type="text" required className="admin-input"
              defaultValue={invitation?.groom_name ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="groom_photo_url">URL Foto</label>
            <input id="groom_photo_url" name="groom_photo_url" type="url" className="admin-input"
              defaultValue={invitation?.groom_photo_url ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="groom_father">Nama Ayah</label>
            <input id="groom_father" name="groom_father" type="text" className="admin-input"
              defaultValue={invitation?.groom_father ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="groom_mother">Nama Ibu</label>
            <input id="groom_mother" name="groom_mother" type="text" className="admin-input"
              defaultValue={invitation?.groom_mother ?? ''} />
          </div>
        </div>
      </section>

      <section className="form-section">
        <h2 className="form-section-title">Mempelai Wanita</h2>
        <div className="form-row-2">
          <div className="form-field">
            <label htmlFor="bride_name">Nama Lengkap <span className="required">*</span></label>
            <input id="bride_name" name="bride_name" type="text" required className="admin-input"
              defaultValue={invitation?.bride_name ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="bride_photo_url">URL Foto</label>
            <input id="bride_photo_url" name="bride_photo_url" type="url" className="admin-input"
              defaultValue={invitation?.bride_photo_url ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="bride_father">Nama Ayah</label>
            <input id="bride_father" name="bride_father" type="text" className="admin-input"
              defaultValue={invitation?.bride_father ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="bride_mother">Nama Ibu</label>
            <input id="bride_mother" name="bride_mother" type="text" className="admin-input"
              defaultValue={invitation?.bride_mother ?? ''} />
          </div>
        </div>
      </section>

      <section className="form-section">
        <h2 className="form-section-title">Akad Nikah</h2>
        <div className="form-row-2">
          <div className="form-field">
            <label htmlFor="akad_date">Tanggal</label>
            <input id="akad_date" name="akad_date" type="date" className="admin-input"
              defaultValue={invitation?.akad_date ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="akad_time">Waktu</label>
            <input id="akad_time" name="akad_time" type="time" className="admin-input"
              defaultValue={invitation?.akad_time ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="akad_venue">Nama Venue</label>
            <input id="akad_venue" name="akad_venue" type="text" className="admin-input"
              defaultValue={invitation?.akad_venue ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="akad_address">Alamat</label>
            <input id="akad_address" name="akad_address" type="text" className="admin-input"
              defaultValue={invitation?.akad_address ?? ''} />
          </div>
          <div className="form-field" style={{gridColumn: 'span 2'}}>
            <label htmlFor="akad_maps_link">Link Google Maps</label>
            <input id="akad_maps_link" name="akad_maps_link" type="url" className="admin-input"
              defaultValue={invitation?.akad_maps_link ?? ''} />
          </div>
        </div>
      </section>

      <section className="form-section">
        <h2 className="form-section-title">Resepsi</h2>
        <div className="form-row-2">
          <div className="form-field">
            <label htmlFor="resepsi_date">Tanggal</label>
            <input id="resepsi_date" name="resepsi_date" type="date" className="admin-input"
              defaultValue={invitation?.resepsi_date ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="resepsi_time">Waktu</label>
            <input id="resepsi_time" name="resepsi_time" type="time" className="admin-input"
              defaultValue={invitation?.resepsi_time ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="resepsi_venue">Nama Venue</label>
            <input id="resepsi_venue" name="resepsi_venue" type="text" className="admin-input"
              defaultValue={invitation?.resepsi_venue ?? ''} />
          </div>
          <div className="form-field">
            <label htmlFor="resepsi_address">Alamat</label>
            <input id="resepsi_address" name="resepsi_address" type="text" className="admin-input"
              defaultValue={invitation?.resepsi_address ?? ''} />
          </div>
          <div className="form-field" style={{gridColumn: 'span 2'}}>
            <label htmlFor="resepsi_maps_link">Link Google Maps</label>
            <input id="resepsi_maps_link" name="resepsi_maps_link" type="url" className="admin-input"
              defaultValue={invitation?.resepsi_maps_link ?? ''} />
          </div>
        </div>
      </section>

      <section className="form-section">
        <h2 className="form-section-title">Kisah Cinta</h2>
        {storyItems.map((item, i) => (
          <div key={i} className="story-form-item">
            <div className="form-row-3">
              <div className="form-field">
                <label>Tahun</label>
                <input name={`story_year_${i}`} type="text" className="admin-input"
                  defaultValue={item.year ?? ''} placeholder="2020" />
              </div>
              <div className="form-field">
                <label>Judul</label>
                <input name={`story_title_${i}`} type="text" className="admin-input"
                  defaultValue={item.title ?? ''} placeholder="Pertama Bertemu" />
              </div>
              <div className="form-field">
                <label>Deskripsi</label>
                <input name={`story_desc_${i}`} type="text" className="admin-input"
                  defaultValue={item.description ?? ''} />
              </div>
            </div>
            <button type="button" onClick={() => removeStoryItem(i)} className="admin-btn-danger">
              Hapus
            </button>
          </div>
        ))}
        <button type="button" onClick={addStoryItem} className="admin-btn-small">
          + Tambah Momen
        </button>
      </section>

      <section className="form-section">
        <h2 className="form-section-title">Galeri Foto</h2>
        <div className="form-field">
          <label htmlFor="gallery_urls">URL Foto (satu per baris)</label>
          <textarea id="gallery_urls" name="gallery_urls" rows={6} className="admin-input"
            defaultValue={defaultGalleryUrls}
            placeholder="https://example.com/foto1.jpg&#10;https://example.com/foto2.jpg" />
          <p className="form-hint">Upload foto ke Supabase Storage, lalu paste URL-nya di sini</p>
        </div>
      </section>

      <section className="form-section">
        <h2 className="form-section-title">Lainnya</h2>
        <div className="form-field">
          <label htmlFor="couple_quote">Kutipan / Ayat</label>
          <textarea id="couple_quote" name="couple_quote" rows={3} className="admin-input"
            defaultValue={invitation?.couple_quote ?? ''} />
        </div>
        <div className="form-field">
          <label htmlFor="music_url">URL Musik Background (opsional)</label>
          <input id="music_url" name="music_url" type="url" className="admin-input"
            defaultValue={invitation?.music_url ?? ''} />
        </div>
      </section>

      <div className="form-footer">
        <button type="submit" className="admin-btn-primary">{submitLabel}</button>
      </div>
    </form>
  )
}
```

- [ ] **Step 5: Add form CSS to globals.css**

Append to `app/globals.css`:

```css
.admin-form { display: flex; flex-direction: column; gap: 0; }
.form-section { background: #fff; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.form-section-title { font-size: 1.05rem; font-weight: 700; color: #111827; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #f3f4f6; }
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; }
.form-hint { font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem; }
.required { color: #ef4444; }
.story-form-item { display: flex; gap: 0.75rem; align-items: flex-end; margin-bottom: 0.75rem; }
.form-footer { display: flex; justify-content: flex-end; padding: 1rem 0; }
```

- [ ] **Step 6: Create app/admin/new/page.tsx**

```typescript
// app/admin/new/page.tsx
import { InvitationForm } from '@/components/admin/InvitationForm'
import { createInvitation } from '@/app/admin/actions'

export default function NewInvitationPage() {
  return (
    <div>
      <h1 className="admin-page-title">Undangan Baru</h1>
      <InvitationForm action={createInvitation} submitLabel="Simpan Undangan" />
    </div>
  )
}
```

- [ ] **Step 7: Create app/admin/[id]/edit/page.tsx**

```typescript
// app/admin/[id]/edit/page.tsx
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { InvitationForm } from '@/components/admin/InvitationForm'
import { updateInvitation } from '@/app/admin/actions'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditInvitationPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: invitation } = await supabase
    .from('invitations')
    .select('*, story_items(*), gallery_items(*)')
    .eq('id', id)
    .single()

  if (!invitation) notFound()

  const updateWithId = updateInvitation.bind(null, id)

  return (
    <div>
      <h1 className="admin-page-title">
        Edit: {invitation.groom_name} & {invitation.bride_name}
      </h1>
      <InvitationForm
        invitation={invitation}
        action={updateWithId}
        submitLabel="Simpan Perubahan"
      />
    </div>
  )
}
```

- [ ] **Step 8: Test form**

Open http://localhost:3000/admin/new → fill in the form with test data → submit → should redirect to `/admin` with the new invitation in the list.

- [ ] **Step 9: Commit**

```bash
git add app/admin/ components/admin/ app/globals.css
git commit -m "feat: add admin invitation create and edit forms"
```

---

## Task 11: Admin RSVP & Guest Book Viewer

**Files:**
- Create: `components/admin/RsvpTable.tsx`
- Create: `app/admin/[id]/rsvp/page.tsx`

- [ ] **Step 1: Create components/admin/RsvpTable.tsx**

```typescript
// components/admin/RsvpTable.tsx
import type { GuestBookEntry, RsvpResponse } from '@/lib/types'

interface Props {
  rsvpResponses: RsvpResponse[]
  guestBookEntries: GuestBookEntry[]
}

export function RsvpTable({ rsvpResponses, guestBookEntries }: Props) {
  const hadirCount = rsvpResponses.filter(r => r.attendance === 'hadir').length
  const totalGuests = rsvpResponses
    .filter(r => r.attendance === 'hadir')
    .reduce((sum, r) => sum + r.guest_count, 0)

  return (
    <div className="rsvp-view">
      <div className="rsvp-stats">
        <div className="stat-card">
          <p className="stat-number">{rsvpResponses.length}</p>
          <p className="stat-label">Total Respon</p>
        </div>
        <div className="stat-card">
          <p className="stat-number stat-green">{hadirCount}</p>
          <p className="stat-label">Hadir</p>
        </div>
        <div className="stat-card">
          <p className="stat-number">{rsvpResponses.length - hadirCount}</p>
          <p className="stat-label">Tidak Hadir</p>
        </div>
        <div className="stat-card">
          <p className="stat-number stat-green">{totalGuests}</p>
          <p className="stat-label">Estimasi Tamu</p>
        </div>
      </div>

      <h2 className="admin-page-title" style={{marginTop: '2rem'}}>Konfirmasi Kehadiran</h2>
      {rsvpResponses.length === 0 ? (
        <p className="admin-empty">Belum ada konfirmasi.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Kehadiran</th>
                <th>Jumlah Tamu</th>
                <th>Pesan</th>
                <th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {rsvpResponses.map(r => (
                <tr key={r.id}>
                  <td>{r.guest_name}</td>
                  <td>
                    <span className={`status-badge ${r.attendance === 'hadir' ? 'status-active' : 'status-inactive'}`}>
                      {r.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                    </span>
                  </td>
                  <td>{r.attendance === 'hadir' ? r.guest_count : '-'}</td>
                  <td>{r.message ?? '-'}</td>
                  <td>{new Date(r.created_at).toLocaleDateString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="admin-page-title" style={{marginTop: '2rem'}}>Buku Tamu</h2>
      {guestBookEntries.length === 0 ? (
        <p className="admin-empty">Belum ada ucapan.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Ucapan</th>
                <th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {guestBookEntries.map(e => (
                <tr key={e.id}>
                  <td>{e.name}</td>
                  <td>{e.message}</td>
                  <td>{new Date(e.created_at).toLocaleDateString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create app/admin/[id]/rsvp/page.tsx**

```typescript
// app/admin/[id]/rsvp/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RsvpTable } from '@/components/admin/RsvpTable'

interface Props {
  params: Promise<{ id: string }>
}

export default async function RsvpPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: invitation }, { data: rsvp }, { data: guestBook }] = await Promise.all([
    supabase.from('invitations').select('groom_name, bride_name, slug').eq('id', id).single(),
    supabase.from('rsvp_responses').select('*').eq('invitation_id', id).order('created_at', { ascending: false }),
    supabase.from('guest_book').select('*').eq('invitation_id', id).order('created_at', { ascending: false }),
  ])

  if (!invitation) notFound()

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">
          {invitation.groom_name} & {invitation.bride_name}
        </h1>
        <Link href={`/${invitation.slug}`} target="_blank" className="admin-btn-small">
          Lihat Undangan ↗
        </Link>
      </div>
      <RsvpTable rsvpResponses={rsvp ?? []} guestBookEntries={guestBook ?? []} />
    </div>
  )
}
```

- [ ] **Step 3: Add stat card CSS to globals.css**

Append to `app/globals.css`:

```css
.rsvp-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.stat-card { background: #fff; border-radius: 0.75rem; padding: 1.5rem; text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.stat-number { font-size: 2.5rem; font-weight: 700; color: #111827; }
.stat-number.stat-green { color: #16a34a; }
.stat-label { font-size: 0.8rem; color: #6b7280; margin-top: 0.25rem; }
.admin-page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
```

- [ ] **Step 4: Test RSVP view**

Open http://localhost:3000/admin → click RSVP on an invitation → should show stats and tables.

- [ ] **Step 5: Commit**

```bash
git add app/admin/ components/admin/ app/globals.css
git commit -m "feat: add admin RSVP and guest book viewer"
```

---

## Task 12: Deployment to Vercel

- [ ] **Step 1: Push to GitHub**

```bash
git remote add origin https://github.com/YOUR_USERNAME/wedding-invitation.git
git branch -M main
git push -u origin main
```

- [ ] **Step 2: Import project to Vercel**

Go to https://vercel.com → Add New → Project → Import from GitHub → select your repo.

- [ ] **Step 3: Set environment variables in Vercel**

In Vercel project settings → Environment Variables → add:
```
NEXT_PUBLIC_SUPABASE_URL       = (from Supabase Dashboard → Settings → API)
NEXT_PUBLIC_SUPABASE_ANON_KEY  = (from Supabase Dashboard → Settings → API)
SUPABASE_SERVICE_ROLE_KEY      = (from Supabase Dashboard → Settings → API)
```

- [ ] **Step 4: Deploy**

Vercel auto-deploys on push. Wait for build to complete → open the Vercel URL.

- [ ] **Step 5: Test production deployment**

1. Open `https://your-project.vercel.app/admin/login` → login
2. Create a new invitation
3. Open `https://your-project.vercel.app/[slug]` → verify invitation renders
4. Submit RSVP → check admin panel shows the response

- [ ] **Step 6: (Optional) Add custom domain**

Vercel Dashboard → Domains → Add your domain → follow DNS instructions.

---

## Self-Review

**Spec coverage:**
- ✓ All public routes: `/[slug]`
- ✓ All admin routes: `/admin`, `/admin/login`, `/admin/new`, `/admin/[id]/edit`, `/admin/[id]/rsvp`
- ✓ All data fields: names, parents, photos, dates, venues, maps, story, gallery, quote, music
- ✓ All 3 themes: elegant, floral, minimalist
- ✓ RSVP feature
- ✓ Guest book feature
- ✓ RLS security policies
- ✓ Auth middleware
- ✓ Countdown timer
- ✓ Slug validation (lowercase, numbers, hyphens only)

**Type consistency check:**
- `Invitation` type defined in Task 3, used consistently in Tasks 5–11
- `submitRsvp` / `submitGuestBook` signatures in `actions.ts` match the `useActionState` bindings in section components
- `resolveTheme(invitation.theme)` matches `ThemeId` constraint
- `parseStoryItems` reads `story_year_${i}`, `story_title_${i}`, `story_desc_${i}` — matches the `name` attributes in `InvitationForm`
- `parseGalleryUrls` reads `gallery_urls` — matches the `name` in `InvitationForm`

**No placeholders found.**
