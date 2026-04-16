# Vasudhaiv Enterprises — Solar Business App
## Complete Build Guide: Antigravity Prompts + Folder Structure + Tech Stack
### Status: Ready to Execute

---

## Stack Decision (Final — Hybrid)

| Layer | Tool | Why | Cost |
|---|---|---|---|
| Framework | Next.js 14 + TypeScript + Tailwind | SEO-grade, App Router, PWA-ready | Free |
| Database + Auth + Storage | Supabase (PostgreSQL) | Relational CRM, SQL analytics, RLS security | Free tier |
| Push Notifications | Firebase Cloud Messaging (FCM) | Best free push engine, never pauses | Free |
| Hosting | Vercel | Fastest Next.js deploy, free SSL | Free |
| Chat | Crisp.chat | Free live chat widget | Free |
| WhatsApp automation | WATI.io (Phase 4 only) | WhatsApp Business API | ~₹1500/mo |
| Analytics | GA4 + Google Search Console | SEO + traffic tracking | Free |
| Domain | .in domain (Namecheap) | Local SEO trust signal | ~₹800/yr |

> **Why not pure Firebase?** Your CRM data is relational — staff assignments, AMC lifecycle, referral chains, service tickets all need SQL JOINs. Firestore (NoSQL) makes analytics dashboards painful. Supabase PostgreSQL handles this perfectly.
>
> **Why not pure Supabase for notifications?** Supabase has no push notification engine. Firebase Cloud Messaging is the best free option and stays in the stack for FCM only.

---

## Folder Structure (Complete)

```
vasudhaiv-solar/
├── .env.local                        # All secrets (never commit)
├── .env.example                      # Template to share
├── .gitignore
├── next.config.js                    # PWA config via next-pwa
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json
├── public/
│   ├── manifest.json                 # PWA manifest
│   ├── firebase-messaging-sw.js      # FCM service worker
│   ├── robots.txt
│   ├── sitemap.xml
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
├── lib/
│   ├── supabase.ts                   # Supabase client (browser)
│   ├── supabase-server.ts            # Supabase client (server/SSR)
│   ├── firebase.ts                   # Firebase FCM init only
│   └── utils.ts                      # Shared helpers
├── types/
│   └── index.ts                      # All TypeScript types
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   └── StatusStepper.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx               # Admin/Staff sidebar
│   │   └── StickyContact.tsx         # Fixed WhatsApp + Call buttons
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── WhyUsSection.tsx
│   │   ├── LeadForm.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── CTASection.tsx
│   ├── dashboard/
│   │   ├── ServiceRequestCard.tsx
│   │   ├── ReferralWidget.tsx
│   │   ├── ElectricityChart.tsx
│   │   └── NotificationBanner.tsx
│   ├── admin/
│   │   ├── LeadsTable.tsx
│   │   ├── ClientsTable.tsx
│   │   ├── StaffTable.tsx
│   │   ├── ServiceRequestsTable.tsx
│   │   ├── AnalyticsCharts.tsx
│   │   └── PushNotificationForm.tsx
│   └── staff/
│       ├── JobCard.tsx
│       └── JobUpdateModal.tsx
├── app/
│   ├── layout.tsx                    # Root layout + StickyContact
│   ├── page.tsx                      # Homepage (public, SEO)
│   ├── login/
│   │   └── page.tsx
│   ├── services/
│   │   └── page.tsx                  # SEO service detail page
│   ├── contact/
│   │   └── page.tsx
│   ├── dashboard/                    # Protected: role = user
│   │   ├── page.tsx
│   │   └── electricity/
│   │       └── page.tsx
│   ├── staff/                        # Protected: role = staff
│   │   └── page.tsx
│   ├── co-admin/                     # Protected: role = co_admin
│   │   └── page.tsx
│   ├── admin/                        # Protected: role = admin
│   │   ├── page.tsx
│   │   ├── clients/
│   │   │   └── [clientId]/
│   │   │       └── page.tsx          # Individual CRM page
│   │   └── analytics/
│   │       └── page.tsx
│   └── api/
│       ├── send-notification/
│       │   └── route.ts              # FCM push via API route
│       └── referral/
│           └── route.ts
└── supabase/
    ├── schema.sql                    # Full DB schema (run once)
    └── rls-policies.sql              # Row-level security rules
```

---

## Supabase Database Schema

> Run this in Supabase SQL Editor before starting any prompt.

```sql
-- Users (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  city text,
  role text default 'user' check (role in ('user','staff','co_admin','admin')),
  referral_code text unique,
  fcm_token text,
  created_at timestamptz default now()
);

-- Leads (from public form, no login required)
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  phone text not null,
  city text,
  roof_type text,
  bill_range text,
  message text,
  referral_code_used text,
  referred_by uuid references public.profiles(id),
  status text default 'new' check (status in ('new','contacted','quoted','converted','lost')),
  created_at timestamptz default now()
);

-- Installations
create table public.installations (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id),
  system_size_kw numeric,
  install_date date,
  warranty_expiry date,
  amc_expiry date,
  amc_amount numeric,
  address text,
  payment_status text default 'pending',
  payment_due_date date,
  created_at timestamptz default now()
);

-- Service Requests
create table public.service_requests (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id),
  installation_id uuid references public.installations(id),
  issue_type text,
  description text,
  preferred_date date,
  status text default 'pending' check (status in ('pending','assigned','in_progress','completed','cancelled')),
  assigned_staff uuid references public.profiles(id),
  completion_note text,
  completion_photo_url text,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- Referrals
create table public.referrals (
  id uuid default gen_random_uuid() primary key,
  referrer_id uuid references public.profiles(id),
  lead_id uuid references public.leads(id),
  status text default 'pending' check (status in ('pending','converted','rewarded')),
  reward_amount numeric default 500,
  reward_paid boolean default false,
  created_at timestamptz default now()
);

-- Electricity Logs
create table public.electricity_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  month text not null,
  solar_units numeric,
  grid_units numeric,
  bill_amount numeric,
  savings_amount numeric generated always as (solar_units * (bill_amount / nullif(grid_units,0))) stored,
  co2_offset_kg numeric generated always as (solar_units * 0.82) stored,
  created_at timestamptz default now()
);

-- Notification Logs
create table public.notification_logs (
  id uuid default gen_random_uuid() primary key,
  type text,
  target_user uuid references public.profiles(id),
  title text,
  body text,
  delivered boolean default false,
  created_at timestamptz default now()
);

-- CRM Notes
create table public.client_notes (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id),
  admin_id uuid references public.profiles(id),
  note text,
  follow_up_date date,
  created_at timestamptz default now()
);
```

---

## Row-Level Security (RLS Policies)

```sql
-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.service_requests enable row level security;
alter table public.installations enable row level security;
alter table public.electricity_logs enable row level security;
alter table public.referrals enable row level security;
alter table public.client_notes enable row level security;

-- Profiles: users see only own profile; admin sees all
create policy "user_own_profile" on public.profiles
  for all using (auth.uid() = id);

create policy "admin_all_profiles" on public.profiles
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Service requests: user sees own; staff sees assigned; admin/co_admin sees all
create policy "user_own_requests" on public.service_requests
  for select using (auth.uid() = client_id);

create policy "user_create_request" on public.service_requests
  for insert with check (auth.uid() = client_id);

create policy "staff_assigned_requests" on public.service_requests
  for all using (auth.uid() = assigned_staff);

create policy "admin_coadmin_all_requests" on public.service_requests
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','co_admin'))
  );

-- Electricity logs: user sees only own
create policy "user_own_electricity" on public.electricity_logs
  for all using (auth.uid() = user_id);

-- Notes: admin/co_admin only
create policy "admin_notes" on public.client_notes
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','co_admin'))
  );
```

---

## Environment Variables (.env.example)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Firebase (FCM push notifications only)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=

# WhatsApp (Phase 4)
WATI_API_KEY=
WATI_ENDPOINT=https://live-server.wati.io

# App
NEXT_PUBLIC_SITE_URL=https://yourdomain.in
NEXT_PUBLIC_BUSINESS_PHONE=+91XXXXXXXXXX
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX
```

---

## PHASE 1 — Foundation: Website + SEO + Lead Capture
### Week 1–2 | Priority: LIVE AS FAST AS POSSIBLE

---

### Prompt 1.1 — Project Initialization

```
Create a Next.js 14 project with TypeScript, Tailwind CSS, and App Router 
for a solar energy business called "Vasudhaiv Enterprises" in Allahabad, UP, India.

Install these packages:
- @supabase/supabase-js
- @supabase/ssr
- next-pwa
- firebase
- chart.js react-chartjs-2

Create this exact folder structure:
/app /components/ui /components/layout /components/home
/lib /types /public/icons /supabase

Create /lib/supabase.ts — Supabase browser client using env vars:
NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

Create /lib/supabase-server.ts — Supabase server client using @supabase/ssr
createServerClient for use in Server Components and API routes.

Create /types/index.ts with TypeScript interfaces for:
Profile, Lead, Installation, ServiceRequest, Referral, ElectricityLog

Create /app/layout.tsx with:
- Inter font from next/font/google
- Global Tailwind base styles
- Import StickyContact component (create placeholder)
- Metadata: viewport, themeColor: #f59e0b

Create .env.example with all required variables documented.
Create .gitignore including .env.local and .next
```

---

### Prompt 1.2 — Homepage + SEO

```
Build the full homepage at /app/page.tsx for Vasudhaiv Enterprises.

This is a public SEO page — use Next.js Server Component (no "use client").

Add this metadata export at the top:
- title: "Solar Panel Installation in Allahabad | Vasudhaiv Enterprises"
- description: "Best solar panel installation in Allahabad and Prayagraj. 
  Free rooftop survey. 5-year warranty. Call +91XXXXXXXXXX"
- keywords: solar panel allahabad, solar installation prayagraj, 
  rooftop solar uttar pradesh, solar company allahabad
- canonical: https://yourdomain.in
- openGraph: title, description, url, type: website, 
  images: [{url: "/og-image.jpg"}]
- robots: index, follow

Build these sections as separate components inside /components/home/:

HeroSection.tsx:
- Full-width background (dark green/amber gradient using Tailwind)
- H1: "Switch to Solar — Save on Every Electricity Bill"
- Subheading: "Trusted solar installation in Allahabad & Prayagraj | 
  Free site survey | 5-year warranty"
- Two CTA buttons: "Get Free Quote" (anchor to #lead-form) 
  and "📞 Call Now" (tel:+91XXXXXXXXXX) — make Call Now amber colored
- Trust badges below: 200+ Installations | 5-Year Warranty | Local Team | 
  Licensed Installer

ServicesSection.tsx:
- H2: "Our Solar Services"
- 4 cards: Solar Panel Installation / AMC & Maintenance / 
  Rooftop Survey (Free) / Grid-Tied Systems
- Each card: icon (use emoji), title, 2-line description, price starting from

WhyUsSection.tsx:
- H2: "Why Choose Vasudhaiv Enterprises?"  
- 6 points with icons: 6+ Years Experience, 200+ Happy Customers,
  5-Year Panel Warranty, Free Site Survey, Local Allahabad Team, 
  After-Sales Support

LeadForm.tsx (id="lead-form"):
- "use client" component
- Fields: Full Name, Phone, City/Area (text), 
  Roof Type (select: RCC Flat/Tin Sheet/Other),
  Monthly Electricity Bill (select: ₹500–1000/₹1000–3000/₹3000+),
  How did you hear about us (select: Google/WhatsApp/Friend/Other),
  Referral Code (optional text input),
  Message (textarea, optional)
- On submit: insert to Supabase "leads" table using browser client
  Include: full_name, phone, city, roof_type, bill_range, 
  referral_code_used, message, status: "new"
  If referral_code_used is filled: fetch profiles table where 
  referral_code = value, set referred_by = that user's id
- Show green success message after submit
- Show loading state on button during submit

TestimonialsSection.tsx:
- 3 dummy cards with name, city, star rating, quote about solar savings

FooterSection.tsx:
- Company name, tagline
- Address: Allahabad, Uttar Pradesh
- Phone, Email, WhatsApp link
- Links: Home, Services, Contact, Privacy Policy
- "© 2024 Vasudhaiv Enterprises"
```

---

### Prompt 1.3 — Sticky Contact + Navigation

```
Create /components/layout/StickyContact.tsx ("use client"):

Mobile (bottom fixed bar, full width, z-50):
- Left half: green button "💬 WhatsApp Us"
  href="https://wa.me/91XXXXXXXXXX?text=Hi%2C%20I%20want%20a%20free%20solar%20quote"
  target="_blank"
- Right half: blue button "📞 Call Now"  
  href="tel:+91XXXXXXXXXX"
- Height 56px, text-sm font-semibold

Desktop (right side fixed vertical stack, z-50):
- Same two buttons stacked vertically, rounded-l-xl, shadow-lg
- Position: right-0, top-1/2, transform -translate-y-1/2

Add to /app/layout.tsx so it appears on every page.

Create /components/layout/Navbar.tsx:
- Logo: "☀️ Vasudhaiv Enterprises" (text logo)
- Desktop nav links: Home, Services, Contact, Login
- Mobile: hamburger menu with slide-down links
- Login button: outlined, links to /login
- Sticky top-0, white bg, shadow on scroll (use useEffect + scroll listener)
- "use client" for scroll and mobile menu state
```

---

### Prompt 1.4 — SEO Pages + Sitemap

```
Create two SEO pages:

1. /app/services/page.tsx (Server Component):
metadata:
- title: "Solar Panel Services in Allahabad | Vasudhaiv Enterprises"
- description: "Solar installation, AMC, rooftop survey services in 
  Allahabad. Affordable packages. Call for free quote."
- canonical: https://yourdomain.in/services

Page content:
- H1: "Solar Services in Allahabad"
- Detailed section for each service (Installation, AMC, Survey, Grid-Tied)
  each with: description, process steps (numbered), pricing range, FAQs
- 5 FAQ items with schema markup (JSON-LD FAQPage)
- JSON-LD LocalBusiness schema with:
  name, address (Allahabad UP), phone, url, geo coordinates

2. /app/contact/page.tsx (Server Component):
metadata title: "Contact Vasudhaiv Enterprises | Solar Allahabad"

Content:
- H1: "Contact Us"
- Contact details: phone, whatsapp link, email
- Business hours: Mon–Sat 9am–6pm
- Google Maps iframe embed for Allahabad (use placeholder coordinates)
- Contact form (client component) — same fields as lead form, 
  saves to Supabase leads table

3. /public/sitemap.xml:
Generate with these URLs and today's date as lastmod:
https://yourdomain.in/
https://yourdomain.in/services
https://yourdomain.in/contact

4. /public/robots.txt:
User-agent: *
Allow: /
Sitemap: https://yourdomain.in/sitemap.xml
```

---

## PHASE 2 — Auth System: 4 Role Logins
### Week 3–5

---

### Prompt 2.1 — Login Page + Auth Flow

```
Create /app/login/page.tsx ("use client"):

Single login page for all roles (user, staff, co_admin, admin).

UI:
- Centered card, max-w-md
- Logo + "Sign in to your account"
- Email input, Password input
- "Sign In" button with loading state
- "New customer? Request access" link (links to #lead-form on homepage)
- Forgot password link (calls supabase.auth.resetPasswordForEmail)

Auth logic (use Supabase Auth):
1. Call supabase.auth.signInWithPassword({email, password})
2. On success: fetch profiles table where id = user.id
3. Read role field
4. Redirect based on role:
   - user → /dashboard
   - staff → /staff  
   - co_admin → /co-admin
   - admin → /admin
5. On error: show red error message "Invalid credentials. Contact admin if 
   you don't have an account."

Create /lib/auth.ts with helper functions:
- getCurrentUser() — gets session + profile in one call
- getUserRole(userId) — returns role string
- signOut() — supabase.auth.signOut() then redirect to /

Create middleware.ts at root:
- Protect /dashboard, /staff, /co-admin, /admin routes
- If no session: redirect to /login
- Use @supabase/ssr createMiddlewareClient
```

---

### Prompt 2.2 — User Dashboard

```
Create /app/dashboard/page.tsx ("use client"), protected (role: user).

On mount:
1. Get current user session
2. Fetch their profile from Supabase profiles table
3. Fetch their service_requests ordered by created_at desc
4. Set up Supabase real-time subscription on service_requests 
   where client_id = user.id using supabase.channel().on('postgres_changes')
   so status updates appear live without refresh

Layout: clean white card-based layout, mobile-first.

Sections:

1. Header: "Welcome, [name] 👋" + Sign Out button

2. Quick stats row (3 small cards):
   - Total requests raised
   - Open requests count  
   - Completed requests count

3. "Raise New Service Request" button → opens modal with form:
   Fields: Issue Type (select: Routine Maintenance/Panel Cleaning/
   Inverter Issue/Wiring Problem/Other), Description (textarea),
   Preferred Date (date picker)
   On submit: insert to Supabase service_requests with 
   client_id, issue_type, description, preferred_date, status: "pending"
   Close modal and refresh list.

4. "My Requests" list — for each request show:
   - Issue type + created date
   - Status stepper component (Pending → Assigned → In Progress → Completed)
     highlight current step in amber
   - Assigned staff name if assigned (join with profiles)
   - Completion note if completed

5. Referral section (card at bottom):
   - "Your Referral Code: [VASU42]" with Copy button
   - WhatsApp share button: pre-filled message 
     "I've been using Vasudhaiv Enterprises for solar — use my code [CODE] 
     for ₹500 off! vasudhaiventerprises.in"
   - "Referred: X people | Rewards earned: ₹X"

6. Electricity tracker teaser card: "Track your solar savings →" 
   button links to /dashboard/electricity

Note: Generate referral code on first login if not exists:
Random 6-char alphanumeric, check uniqueness in profiles table, 
save via supabase update.
```

---

### Prompt 2.3 — Admin Dashboard

```
Create /app/admin/page.tsx ("use client"), protected (role: admin).

Layout: sidebar navigation + main content area.

Sidebar links:
- Dashboard (overview)
- Leads
- Clients
- Service Requests
- Staff
- Referrals
- Notifications
- Analytics

Overview page (default):
4 summary cards fetched from Supabase:
- Total Leads (count from leads table)
- Active Clients (count from profiles where role = 'user')
- Open Requests (count from service_requests where status != 'completed')
- Staff Count (count from profiles where role = 'staff')

Leads section (/admin page with tab or separate route):
Table from Supabase leads table with columns:
Name, Phone, City, Bill Range, Source, Referral Code, Date, Status
Status column: dropdown (new/contacted/quoted/converted/lost)
On change: update leads table status in Supabase
Add filter: by status, by date range

Clients section:
Table from profiles where role = 'user'
Columns: Name, Phone, Install Date, AMC Expiry, Status
AMC Expiry: highlight red if < 30 days away
Click row → goes to /admin/clients/[clientId]

Service Requests section:
Table from service_requests with client name (join profiles)
Columns: Client, Issue, Date, Status, Assigned Staff
Assign Staff: dropdown of staff members, on select update 
assigned_staff field in Supabase

Staff Management:
Table of profiles where role = 'staff'
"Add Staff" button → modal with email + name form
On submit: call Supabase admin API to create user + set role = 'staff' 
in profiles (use server-side API route for this with service_role_key)

Push Notification section (build UI now, wire in Phase 4):
Title input, Body input, 
Target: radio (All Users / Single User — dropdown of clients)
"Send Notification" button (disabled placeholder for now, will wire to FCM)
```

---

### Prompt 2.4 — Staff Dashboard

```
Create /app/staff/page.tsx ("use client"), protected (role: staff).

Mobile-first design — staff will use this on-site on phone.

Sections:

1. Header: "Staff Portal — [name]" + today's date + Sign Out

2. "My Jobs Today" — service_requests where:
   assigned_staff = current user id
   AND preferred_date = today
   Each card: client name, address, issue type, phone (tap to call)
   Status button: "Start Job" (sets in_progress) / "Complete Job" (sets completed)

3. "My All Jobs" tab — all assigned jobs, paginated, sorted by date

4. "Available Jobs" tab — service_requests where 
   status = 'pending' AND assigned_staff is null
   "Take This Job" button — sets assigned_staff = current user id, 
   status = 'assigned'

5. "Complete Job" modal (opens on Complete Job button):
   - Completion note textarea
   - Photo upload (upload to Supabase Storage bucket "job-photos", 
     save public URL to completion_photo_url)
   - Submit button: updates status to 'completed', 
     sets completed_at = now(), saves note and photo URL

Real-time: subscribe to service_requests changes for assigned_staff = user id
so new assignments appear without refresh.
```

---

## PHASE 3 — CRM + Referral System
### Week 6–9

---

### Prompt 3.1 — Client CRM Page

```
Create /app/admin/clients/[clientId]/page.tsx ("use client"), 
protected (role: admin or co_admin).

Fetch on load:
- Profile: profiles where id = clientId
- Installation: installations where client_id = clientId
- Service history: service_requests where client_id = clientId
- Notes: client_notes where client_id = clientId
- Referrals made: referrals where referrer_id = clientId

Layout: tabs — Overview | Service History | Notes | Referrals

Overview tab:
Client info card: Name, Phone, City, Email
Installation card: System size (kW), Install date, Warranty expiry, 
AMC expiry (red badge if < 30 days), Address
Action buttons: "Edit Details", "Call Client" (tel: link), 
"WhatsApp" (wa.me link)

Service History tab:
Timeline of all service_requests with status, staff name, 
completion note, completion photo (if exists, show thumbnail)

Notes tab:
List of admin notes sorted by date
Add Note form: textarea + optional follow_up_date date picker
On submit: insert to client_notes with client_id, admin_id, note, follow_up_date
Follow-up notes with a date show as reminder cards on admin dashboard overview

Referrals tab:
List of people this client referred (from referrals table)
Show: referred lead name, date, status (pending/converted/rewarded)
"Mark Rewarded" button: updates referrals status to 'rewarded', 
reward_paid to true

Create /app/co-admin/page.tsx (role: co_admin):
Simplified version of admin — read-only access to Clients table, 
Service Requests table, and basic analytics.
No staff management, no push notifications.
```

---

### Prompt 3.2 — Referral Engine

```
Finalize the referral system end-to-end.

1. /app/api/referral/route.ts (POST — server-side):
Accept: { referral_code, lead_id }
Logic:
- Query profiles where referral_code = input code
- If found: insert to referrals table: 
  { referrer_id: profile.id, lead_id, status: 'pending' }
- Update lead's referred_by field
- Return { success: true, referrer_name }
If not found: return { success: false, message: "Invalid code" }

Wire this into the LeadForm.tsx:
After lead is inserted, if referral_code_used is not empty,
call this API route with the new lead id and code.

2. Admin referrals view in /app/admin/page.tsx (new tab: Referrals):
Table from referrals JOIN profiles (referrer) JOIN leads (referred lead):
Columns: Referrer Name, Referred Lead Name, Date, Status, Reward Paid
Filter by status
"Mark Converted" button (updates to 'converted')
"Mark Rewarded" button (updates to 'rewarded', reward_paid: true)
Summary at top: Total Referrals | Converted | Total Rewards Paid

3. /app/dashboard/page.tsx referral section update:
Show real data from Supabase:
- Count of referrals WHERE referrer_id = user.id
- Count converted
- Total rewards earned (count rewarded * reward_amount)
```

---

## PHASE 4 — Push Notifications + WhatsApp
### Week 10–12

---

### Prompt 4.1 — Firebase FCM Setup

```
Set up Firebase Cloud Messaging for push notifications.
(Firebase is used ONLY for FCM — auth and DB remain in Supabase)

1. Create /lib/firebase.ts:
Initialize Firebase app with env vars (API_KEY, AUTH_DOMAIN, 
PROJECT_ID, MESSAGING_SENDER_ID, APP_ID).
Export getMessaging and getToken functions.
Export async function requestNotificationPermission(userId):
  - Call getToken(messaging, { vapidKey: NEXT_PUBLIC_FIREBASE_VAPID_KEY })
  - On success: update Supabase profiles table set fcm_token = token 
    for current user
  - Return token

2. Create /public/firebase-messaging-sw.js:
importScripts firebase app and messaging compat CDN scripts.
Initialize Firebase with same config.
Call firebase.messaging().onBackgroundMessage() to handle 
background notifications:
Show notification with event.data.notification.title and .body

3. Update /app/dashboard/page.tsx:
On mount, if Notification.permission !== 'granted':
Show a dismissible banner: "Enable notifications to get service 
updates and AMC reminders" with "Enable" button.
On click Enable: call requestNotificationPermission(userId).
If already granted: call silently on mount to refresh token.

4. Create /app/api/send-notification/route.ts (POST, server-side):
Use Firebase Admin SDK (firebase-admin package).
Initialize with service account from FIREBASE_SERVICE_ACCOUNT env var.
Accept body: { target: "all"|"single", uid?: string, title, body }
If "all": fetch all fcm_token values from Supabase profiles 
  where fcm_token is not null.
  Send via admin.messaging().sendEachForMulticast({ tokens, notification })
If "single": fetch fcm_token for specific uid.
  Send via admin.messaging().send({ token, notification })
Log result to Supabase notification_logs table.
Return { sent: count, failed: count }

5. Wire admin dashboard "Send Notification" form:
On submit: POST to /api/send-notification with form values.
Show "Sent to X devices" success message.
```

---

### Prompt 4.2 — Automated Scheduled Reminders

```
Create automated reminder system using Next.js API routes 
triggered by a Vercel Cron Job.

1. Create /app/api/cron/daily-reminders/route.ts:
Protect with: check Authorization header == "Bearer " + CRON_SECRET env var
Run these checks daily:

AMC Reminders:
- Query Supabase: installations where amc_expiry = today + 30 days
- For each: fetch client's fcm_token from profiles
- POST to /api/send-notification with:
  title: "AMC Renewal Reminder ⚠️"
  body: "Your solar AMC expires in 30 days. Book renewal to keep 
  warranty valid. Call: +91XXXXXXXXXX"

Service Follow-up:
- Query: service_requests where status = 'completed' 
  AND completed_at = 7 days ago
- Send: title: "How's your solar system? ☀️"
  body: "It's been a week since your service. Everything working fine? 
  Contact us if you need help."

Payment Reminders:
- Query: installations where payment_due_date = today
  AND payment_status != 'paid'
- Send: title: "Payment Due Today 💳"
  body: "Your solar EMI is due today. Pay via UPI: XXXXXXXX@upi"

2. Create /vercel.json:
{
  "crons": [
    {
      "path": "/api/cron/daily-reminders",
      "schedule": "30 3 * * *"
    }
  ]
}
(3:30 UTC = 9:00 AM IST)

3. Add CRON_SECRET to .env.example with instructions.

4. Update WhatsApp integration:
In service_requests update handler (when staff marks complete):
POST to WATI.io API to send WhatsApp template message to client:
"Your solar service request is complete ✅ 
Our team has finished the work. If you have any concerns, 
reply here or call +91XXXXXXXXXX"
Use WATI_API_KEY and WATI_ENDPOINT from env vars.
```

---

## PHASE 5 — Electricity Tracker + Analytics + PWA
### Month 4+

---

### Prompt 5.1 — Electricity Savings Tracker

```
Create /app/dashboard/electricity/page.tsx ("use client"),
protected (role: user).

Fetch on load:
- All electricity_logs for current user ordered by month
- User's installation details (system size, install date)

Page sections:

1. Monthly Entry Form (card at top):
Fields:
- Month picker (month/year)
- Solar units generated this month (kWh) — number input
- Grid units consumed (kWh) — number input  
- Actual electricity bill this month (₹) — number input
Submit: insert to Supabase electricity_logs table with all values.
Supabase will auto-calculate savings_amount and co2_offset_kg 
(generated columns from schema).
Show success toast. Refresh chart.

2. This Month Summary (3 stat cards):
- "Saved this month: ₹[savings_amount]" (green)
- "Solar generated: [solar_units] kWh" (amber)
- "CO₂ offset: [co2_offset_kg] kg" (teal)

3. Charts (use Chart.js via react-chartjs-2):
Line chart — last 12 months:
- Blue line: grid_units consumed
- Amber line: solar_units generated
- Labels: month names

Bar chart — last 6 months:
- Red bar: actual bill paid
- Green bar: estimated bill without solar 
  (calculated as: grid_units + solar_units * avg_rate_per_unit)

4. All-time totals (bottom card):
- Total saved since installation: sum of all savings_amount
- Total solar generated: sum of all solar_units kWh
- Total CO₂ offset: sum of co2_offset_kg in kg
- "Equivalent to planting X trees" (co2_total / 21.77, round down)
```

---

### Prompt 5.2 — Admin Analytics

```
Create /app/admin/analytics/page.tsx ("use client"), protected (role: admin).

Fetch all data from Supabase on load.

Section 1 — Lead Funnel (horizontal bar chart):
Query leads table, count by status.
Show: New → Contacted → Quoted → Converted → Lost
Conversion rate: (converted / total) * 100 shown below chart.

Section 2 — Monthly Performance (line chart):
X-axis: last 12 months
Y-axis: count of leads created, count of installations completed
Two lines: Leads vs Installs

Section 3 — Geographic Breakdown (table):
Group leads by city column.
Columns: City | Total Leads | Converted | Conversion Rate %
Sort by total leads desc.
Highlight top 3 cities in amber.

Section 4 — Staff Performance (table):
service_requests grouped by assigned_staff.
Join with profiles to get staff name.
Columns: Staff Name | Jobs This Month | Avg Completion Days | Completed
"Completion Days" = avg(completed_at - created_at) in days.

Section 5 — Referral ROI (3 stat cards):
- Total referrals generated
- Referrals converted to customers
- Total rewards paid out (sum of reward_amount where reward_paid = true)
- Referral conversion rate %

Add date range filter at top (This Week / This Month / This Year / Custom).
All queries filter by created_at within selected range.
```

---

### Prompt 5.3 — PWA Configuration + Final Deploy

```
Convert the app to a Progressive Web App and prepare for production deploy.

1. Install and configure next-pwa:
In next.config.js:
const withPWA = require('next-pwa')({ dest: 'public', disable: process.env.NODE_ENV === 'development' })
module.exports = withPWA({ ... your existing config ... })

2. Create /public/manifest.json:
{
  "name": "Vasudhaiv Solar",
  "short_name": "Vasudhaiv",
  "description": "Solar installation services by Vasudhaiv Enterprises",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#f59e0b",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}

Add to /app/layout.tsx metadata:
manifest: "/manifest.json"
themeColor: "#f59e0b"
appleWebApp: { capable: true, statusBarStyle: "default" }

3. Add "Install App" prompt in /app/dashboard/page.tsx:
Use beforeinstallprompt browser event.
Show dismissible card: "Install the Vasudhaiv Solar app on your phone 
for instant access" with "Install" button.
On click: call deferredPrompt.prompt()
Hide banner after install or dismiss.

4. Create /vercel.json (final):
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "crons": [
    { "path": "/api/cron/daily-reminders", "schedule": "30 3 * * *" }
  ]
}

5. Create README.md with:
Step-by-step setup: clone → npm install → .env.local setup → 
Supabase project creation → run schema.sql → run rls-policies.sql →
Firebase project setup → npm run dev → deploy to Vercel

6. Create /supabase/schema.sql with the full schema from this guide.
Create /supabase/rls-policies.sql with the full RLS policies from this guide.
```

---

## Execution Checklist (Before Running Any Prompt)

```
PRE-SETUP (do once before starting):

[ ] 1. Create Supabase project at supabase.com
[ ] 2. Run schema.sql in Supabase SQL Editor
[ ] 3. Run rls-policies.sql in Supabase SQL Editor
[ ] 4. Enable Supabase Auth (Email provider) in dashboard
[ ] 5. Create Supabase Storage bucket named "job-photos" (public)
[ ] 6. Create Firebase project at console.firebase.google.com
[ ] 7. Enable Firebase Cloud Messaging, get VAPID key
[ ] 8. Create Vercel account, link GitHub repo
[ ] 9. Buy .in domain on Namecheap
[ ] 10. Create .env.local from .env.example and fill all values

PHASE GATE RULES:
- Phase 1 must be LIVE on Vercel before starting Phase 2
- Phase 2 auth must be working for all 4 roles before Phase 3
- Phase 3 CRM must have real client data before Phase 4 notifications
- Phase 5 only after 20+ active users (otherwise nobody to track)
```

---

## Estimated Timeline

| Phase | Duration | Goal |
|---|---|---|
| Phase 1 | 1–2 weeks | Live website, getting leads |
| Phase 2 | 2–3 weeks | All logins working, admin can manage |
| Phase 3 | 3–4 weeks | Staff using app on field, CRM live |
| Phase 4 | 2 weeks | Automated reminders running |
| Phase 5 | 2 weeks | Electricity tracker + full analytics |
| **Total** | **~3 months** | **Full production app** |

---

*Last updated: 2024 | Stack: Next.js 14 + Supabase + Firebase FCM + Vercel*
*Business: Vasudhaiv Enterprises, Allahabad, Uttar Pradesh*
