# Vasudhaiv Enterprises — Security Audit + Legal Pages
## Ready to implement before going live

---

# PART 1: SECURITY AUDIT

---

## Critical Issues — Fix Before Going Live

### Issue 1: Lead Form Has Zero Rate Limiting (Current Site)
Your lead form at vasudhaiventerprises.netlify.app accepts unlimited
submissions. A bot can spam 10,000 fake leads in minutes, flooding your
Supabase free tier and your admin dashboard with junk.

**Fix — Add this to your LeadForm.tsx:**

```typescript
// Simple in-memory rate limit (per browser session)
// Add to LeadForm.tsx state
const [lastSubmitTime, setLastSubmitTime] = useState<number>(0)
const COOLDOWN_MS = 60000 // 1 minute between submissions

const handleSubmit = async () => {
  const now = Date.now()
  if (now - lastSubmitTime < COOLDOWN_MS) {
    setError("Please wait a minute before submitting again.")
    return
  }
  setLastSubmitTime(now)
  // ... rest of submit logic
}
```

**Also add server-side rate limiting — create /app/api/leads/route.ts:**

```typescript
import { NextRequest, NextResponse } from 'next/server'

const rateLimitMap = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour
  const maxRequests = 5 // 5 lead submissions per IP per hour

  const timestamps = rateLimitMap.get(ip) || []
  const recent = timestamps.filter(t => now - t < windowMs)

  if (recent.length >= maxRequests) return true

  recent.push(now)
  rateLimitMap.set(ip, recent)
  return false
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429 }
    )
  }

  // Insert to Supabase here using service_role_key (server side)
  // ...
  return NextResponse.json({ success: true })
}
```

---

### Issue 2: Supabase Anon Key Exposed (As Expected, But Needs Guards)
Your NEXT_PUBLIC_SUPABASE_ANON_KEY is visible to the browser — this is
normal and expected with Supabase. But it means anyone can call your
Supabase directly if RLS is not configured properly.

**Non-negotiable: Run these checks in Supabase dashboard:**

```
Authentication > Policies
→ Verify "profiles" table has RLS enabled
→ Verify "leads" table has RLS enabled
→ Verify "service_requests" table has RLS enabled

If you see "RLS disabled" on ANY table — that table is 100% public.
Anyone with your anon key can read/write all rows.
```

**Additional Supabase hardening:**

```sql
-- Prevent public read of leads (only admin/service role should read)
-- The anon key should only be able to INSERT leads, never SELECT
create policy "anon_insert_leads_only" on public.leads
  for insert to anon
  with check (true);

-- Explicitly block anon from reading leads
create policy "no_anon_read_leads" on public.leads
  for select to anon
  using (false);

-- Block anon from reading profiles entirely
create policy "no_anon_profiles" on public.profiles
  for select to anon
  using (false);
```

---

### Issue 3: No Input Sanitization on Forms
If you insert raw form input directly to Supabase, an attacker can
inject malicious data. Supabase parameterizes queries so SQL injection
is not possible, but stored XSS in your admin dashboard is.

**Add this utility to /lib/utils.ts:**

```typescript
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .slice(0, 500) // max length guard
    .replace(/[<>\"'`]/g, '') // strip HTML/script chars
}

export function sanitizePhone(phone: string): string {
  // Only allow digits, +, spaces, hyphens
  return phone.replace(/[^0-9+\-\s]/g, '').slice(0, 15)
}
```

**Use in every form before inserting to Supabase:**

```typescript
const sanitizedLead = {
  full_name: sanitizeInput(formData.full_name),
  phone: sanitizePhone(formData.phone),
  city: sanitizeInput(formData.city),
  message: sanitizeInput(formData.message),
}
```

---

### Issue 4: No Security Headers (Netlify / Vercel)
Your current Netlify site has no security headers. This allows
clickjacking, MIME sniffing attacks, and cross-origin data leaks.

**For Netlify — create /public/_headers:**

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
```

**For Vercel (Next.js) — add to next.config.js:**

```javascript
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://images.unsplash.com",
      "connect-src 'self' https://*.supabase.co https://fcm.googleapis.com",
      "frame-src https://maps.google.com",
    ].join('; ')
  }
]

module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  }
}
```

---

### Issue 5: Admin/Staff Routes Need Server-Side Role Verification
Client-side role checks (reading from Supabase on the browser) can be
bypassed. Anyone can modify localStorage or intercept responses.

**Add server-side protection to every admin route:**

```typescript
// /app/admin/page.tsx — do this at the TOP before rendering anything
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // service role, not anon
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Server-side role check — cannot be bypassed from browser
  if (profile?.role !== 'admin') redirect('/dashboard')

  // Only renders if role is genuinely 'admin' in database
  return <AdminDashboard />
}
```

Apply this pattern to /staff, /co-admin, /admin pages.

---

### Issue 6: Cron API Route Must Be Locked
Your daily reminder cron at /api/cron/daily-reminders is an open HTTP
endpoint. Without protection, anyone can hit it and trigger mass
notifications to all your clients.

**Lock it — add to the route handler:**

```typescript
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  // ... rest of cron logic
}
```

In /vercel.json Vercel automatically sends this header when invoking
cron routes — set CRON_SECRET in Vercel environment variables.

---

### Issue 7: File Upload Validation (Phase 3 — Staff Photo Upload)
When staff upload completion photos to Supabase Storage, never trust
the file type header. Validate on the server.

```typescript
// /app/api/upload-photo/route.ts
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json({ error: 'Only JPG, PNG, WebP allowed' }, { status: 400 })
  }

  if (file.size > MAX_SIZE_BYTES) {
    return Response.json({ error: 'File too large. Max 5MB.' }, { status: 400 })
  }

  // Upload to Supabase Storage
  const supabase = createSupabaseServerClient()
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
  const { data, error } = await supabase.storage
    .from('job-photos')
    .upload(filename, file)

  // ...
}
```

---

### Issue 8: Environment Variable Leaks
Never put secrets in NEXT_PUBLIC_ variables. Only config values that
the browser genuinely needs should be public.

```bash
# SAFE — browser needs these
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_SITE_URL=...

# NEVER EXPOSE — server only
SUPABASE_SERVICE_ROLE_KEY=...       # full DB access
FIREBASE_SERVICE_ACCOUNT=...        # FCM admin
WATI_API_KEY=...                    # WhatsApp billing
CRON_SECRET=...                     # cron protection
```

If you accidentally commit .env.local to GitHub:
1. Rotate ALL secrets immediately (Supabase, Firebase, WATI)
2. Add .env.local to .gitignore before first commit
3. Check git log — if already committed, the secret is compromised

---

### Issue 9: Supabase Storage Bucket Must Not Be Fully Public
When you create the "job-photos" bucket, do not set it to fully public.
Photos of completed solar jobs reveal client addresses.

```sql
-- In Supabase Storage policies:
-- Allow staff to upload to job-photos
create policy "staff_upload_photos" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'job-photos'
    AND exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('staff', 'admin')
    )
  );

-- Allow admin/co_admin to view job photos
create policy "admin_view_photos" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'job-photos'
    AND exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'co_admin', 'staff')
    )
  );
```

---

### Issue 10: WhatsApp Link Exposes Phone Number in HTML Source
Your current site has `wa.me/918840315311` hardcoded. This is fine for
a business contact number. But when you add client WhatsApp automation
via WATI, never put client phone numbers in frontend code — always go
through your server API.

---

## Security Checklist Before Going Live

```
SUPABASE
[ ] RLS enabled on ALL tables (check each table in dashboard)
[ ] Anon key can only INSERT leads, never SELECT
[ ] Service role key only used server-side (never in client code)
[ ] Storage bucket policies restrict access by role
[ ] Auth email confirmations enabled

NEXT.JS / VERCEL
[ ] Security headers added to next.config.js
[ ] All /admin, /staff, /co-admin routes have server-side role check
[ ] Cron route protected with CRON_SECRET
[ ] .env.local in .gitignore (verify: git status shows it ignored)
[ ] No secrets in NEXT_PUBLIC_ variables

FORMS
[ ] Rate limiting on lead form (client + server side)
[ ] Input sanitization on all text fields
[ ] Phone number format validation

FILE UPLOADS
[ ] File type validation (whitelist only)
[ ] File size limit (5MB max)
[ ] Randomized filenames (no user-controlled filenames)

GENERAL
[ ] HTTPS enforced (Vercel/Netlify does this automatically)
[ ] Custom domain configured (not netlify.app subdomain)
[ ] Google Search Console verified (to monitor for SEO attacks)
```

---

# PART 2: TERMS & CONDITIONS

> Copy this exactly into your /app/terms/page.tsx as static content.
> Update [date], [email], and phone as needed.

---

## Terms and Conditions — Vasudhaiv Enterprises

**Effective Date:** June 2025
**Business:** Vasudhaiv Enterprises
**Location:** Prayagraj, Uttar Pradesh, India
**Phone:** +91 88403 15311 | +91 81819 38584
**WhatsApp:** +91 88403 15311
**Email:** [your-email@domain.com]

---

### 1. Acceptance of Terms

By visiting our website, submitting a lead form, contacting us via
WhatsApp or phone, or using our client portal, you agree to these
Terms and Conditions in full. If you do not agree, please do not use
our website or services.

---

### 2. About Vasudhaiv Enterprises

Vasudhaiv Enterprises provides solar energy installation, annual
maintenance contracts (AMC), rooftop surveys, grid-tied system setup,
CCTV systems, and water purification solutions across residential,
commercial, and institutional sectors in Prayagraj, Allahabad, and
surrounding areas of Uttar Pradesh.

---

### 3. Website Use

You agree to use this website only for lawful purposes. You must not:

- Submit false, misleading, or spam information through our forms
- Attempt to access restricted areas such as admin or staff dashboards
  without authorization
- Use automated tools, bots, or scripts to scrape or interact with this
  website
- Copy, reproduce, or redistribute website content, design, or code
  without written permission
- Interfere with website security or attempt to compromise our systems

Violations may result in IP blocking, legal action, or reporting to
cybercrime authorities under the Information Technology Act, 2000.

---

### 4. Service Information and Pricing Disclaimer

All information on this website regarding:

- Solar system pricing and packages
- ROI calculations and savings estimates
- Government subsidy availability
- Payback period projections
- Net metering benefits

...is indicative only and subject to change. Final quotations are
provided only after a physical or virtual site survey by our engineers.
Vasudhaiv Enterprises makes no guarantee that published pricing or
savings estimates will apply to your specific installation.

---

### 5. Government Subsidy Disclaimer

Eligibility for MNRE rooftop solar subsidies and UP DISCOM net metering
depends on:

- Government policy in effect at time of application
- DISCOM approval and technical evaluation
- Customer eligibility criteria set by authorities
- Timely submission of documentation by the customer

Vasudhaiv Enterprises assists clients in subsidy documentation but does
not guarantee subsidy approval, timelines, or amounts. Subsidy policies
may change without notice. The company is not liable for subsidy
rejection, delay, or reduction due to government policy changes.

---

### 6. Lead Form and Communication Consent

By submitting your name, phone number, or email through any form on
this website, or by contacting us via WhatsApp, you explicitly consent
to receive:

- A callback from our team within business hours
- WhatsApp messages regarding your solar inquiry
- Follow-up communication about quotations and installation
- Service reminders and AMC renewal notifications (if you become a client)
- Periodic promotional offers from Vasudhaiv Enterprises (you may
  opt out at any time by replying "STOP" or contacting us)

We do not use your contact information for any purpose unrelated to
solar and energy services without your explicit consent.

---

### 7. Client Portal and Account Security

The client portal (login section) allows registered customers and
authorized staff to access service requests, installation details, and
account information.

You are responsible for:

- Maintaining the confidentiality of your login credentials
- Not sharing your account access with unauthorized persons
- Immediately reporting suspected unauthorized access to us

Vasudhaiv Enterprises reserves the right to suspend accounts that
show signs of misuse or unauthorized access.

Different access levels exist within our portal (user, staff, co-admin,
admin). Attempting to access a privilege level not assigned to your
account is a violation of these terms and may constitute an offense
under the IT Act, 2000.

---

### 8. Referral Program

The referral program, when active, is subject to the following:

- Referral rewards are paid only upon successful installation and
  full payment by the referred customer
- One referral code per registered user
- Vasudhaiv Enterprises reserves the right to modify, pause, or
  discontinue the referral program at any time
- Fraudulent referrals (self-referral, fake leads) will result in
  account termination and forfeiture of all rewards

---

### 9. Installation and Service Terms

- Installation timelines depend on material availability, DISCOM
  approval, weather, and site readiness
- Delays due to government approvals or force majeure are not the
  liability of Vasudhaiv Enterprises
- Equipment warranty follows manufacturer terms (typically 25 years
  for panels, 5 years for inverters)
- Our installation workmanship warranty is 5 years from installation date
- AMC contracts are annual and must be renewed; lapsed AMC coverage
  voids priority service response

---

### 10. Limitation of Liability

Vasudhaiv Enterprises shall not be held liable for:

- Loss of subsidy due to government policy changes
- DISCOM delays or rejection of net metering applications
- Equipment performance issues covered under manufacturer warranty
- Electricity generation variance due to weather or environmental factors
- Losses arising from misuse of the client portal or account

Our maximum liability in any case is limited to the service amount paid
for that specific service or installation.

---

### 11. Intellectual Property

All content on this website including text, design, logo, calculators,
graphics, and code is the property of Vasudhaiv Enterprises. No part
may be copied, reproduced, or distributed without prior written consent.

---

### 12. Governing Law and Disputes

These Terms are governed by the laws of India. Any disputes arising
from these terms or our services shall first be attempted to be
resolved through mutual discussion. If unresolved, disputes shall be
subject to the jurisdiction of courts in Prayagraj, Uttar Pradesh.

---

### 13. Changes to These Terms

We reserve the right to update these Terms at any time. Continued use
of this website after changes are posted constitutes your acceptance
of the updated Terms. We recommend checking this page periodically.

---

### 14. Contact for Legal Queries

**Vasudhaiv Enterprises**
615/395 Shri, Sitapur Road, Gayatri Nagar
Prayagraj, Uttar Pradesh, India
Phone: +91 88403 15311
WhatsApp: +91 88403 15311
Email: [your-email@domain.com]

---

# PART 3: PRIVACY POLICY

> Copy into /app/privacy-policy/page.tsx

---

## Privacy Policy — Vasudhaiv Enterprises

**Effective Date:** June 2025
**Last Updated:** June 2025

Vasudhaiv Enterprises is committed to protecting your personal data
in accordance with the **Digital Personal Data Protection Act, 2023
(DPDPA)** of India and applicable IT regulations.

---

### 1. Data We Collect

**Through lead/contact forms:**
- Full name
- Mobile number
- Email address (if provided)
- City or area
- Roof type and electricity bill range (to assess solar suitability)
- Referral code used (if any)
- Message or inquiry text

**Through the client portal (registered users):**
- Installation details (system size, install date, AMC dates)
- Service request history
- Electricity usage data (only if you choose to enter it)
- Notifications opt-in status

**Automatically collected:**
- Browser type and device type
- Pages visited and time spent (via Google Analytics)
- IP address (used for security and fraud prevention only)

We do not collect payment card information directly. Any payment
processing is handled by third-party payment platforms.

---

### 2. How We Use Your Data

Your data is used exclusively for:

- Responding to solar inquiries and providing quotations
- Scheduling site surveys and installations
- Processing service requests and AMC renewals
- Sending service updates, reminders, and notifications
- Preventing spam and abuse on our platforms
- Improving our website and services via analytics
- Legal compliance where required

**We do not sell, rent, or trade your personal information.**

---

### 3. Communication Channels

If you contact us or submit a form, you consent to receive responses via:

- Phone call (during business hours: Mon–Sat, 9am–6pm IST)
- WhatsApp message
- Email
- Push notifications (only if you grant permission in the client portal)

To stop receiving promotional messages, reply "STOP" on WhatsApp or
contact us directly. Service-related messages (e.g., your installation
update, AMC reminder) may still be sent as these are operational.

---

### 4. Data Sharing

Your data is shared only in these specific circumstances:

| Recipient | Purpose | Data Shared |
|---|---|---|
| Installation partners | Job assignment in your area | Name, address, phone |
| MNRE/DISCOM authorities | Subsidy or net metering application | As required by law |
| Supabase (our database) | Secure data storage | Encrypted at rest |
| Firebase (Google) | Push notification delivery | Device token only |
| Google Analytics | Website traffic analysis | Anonymized usage data |
| WATI.io | WhatsApp message delivery | Phone number |
| Legal authorities | If required by law or court order | As ordered |

No other sharing occurs. We do not share data with advertisers.

---

### 5. Data Storage and Security

Your data is stored on Supabase (PostgreSQL database), hosted on secure
cloud infrastructure. We implement the following security measures:

- Row-Level Security (RLS): each user can only access their own data
- Multi-role access control: staff, admin, and client data is separated
- Encrypted connections (HTTPS/TLS) on all pages
- Authentication tokens with session expiry
- Access logs for admin-level actions

Despite these measures, no system is 100% secure. In the event of a
data breach affecting your information, we will notify you within a
reasonable timeframe as required by law.

---

### 6. Cookies and Analytics

We use:

- **Session cookies** for login functionality (essential, cannot be
  disabled without breaking the portal)
- **Google Analytics 4** for anonymous website traffic analysis
  (you can opt out via browser settings or Google's opt-out tool)
- **Firebase** for push notification tokens (only if you opt in)

We do not use advertising cookies or tracking pixels for ad retargeting.

---

### 7. Data Retention

| Data Type | Retention Period |
|---|---|
| Lead form submissions | 3 years or until you request deletion |
| Client installation records | Duration of warranty/AMC + 2 years |
| Service request history | 3 years |
| Electricity usage logs | Until you delete your account |
| Notification logs | 1 year |
| Analytics data | As per Google Analytics settings (default 14 months) |

---

### 8. Your Rights Under DPDPA 2023

Under India's Digital Personal Data Protection Act, you have the right to:

- **Access** — request a copy of your personal data we hold
- **Correction** — request correction of inaccurate data
- **Erasure** — request deletion of your data (where legally permitted)
- **Grievance redressal** — raise a complaint with us about data handling
- **Nomination** — nominate someone to exercise rights on your behalf

To exercise any right, contact us at [your-email@domain.com]. We will
respond within 30 days.

---

### 9. Children's Privacy

Our services are intended for adults (18+). We do not knowingly collect
data from individuals under 18. If you believe a minor has submitted
information through our platform, contact us for immediate deletion.

---

### 10. Links to Third-Party Sites

Our website may contain links to third-party sites (Google Maps,
government subsidy portals, etc.). We are not responsible for the
privacy practices of those sites.

---

### 11. Changes to This Policy

We may update this Privacy Policy periodically. The "Last Updated"
date at the top will reflect changes. Continued use of our website
or services after changes constitutes acceptance of the updated policy.

---

### 12. Contact and Grievance Officer

For privacy concerns, data requests, or complaints:

**Vasudhaiv Enterprises**
Attn: Data Privacy
615/395 Shri, Sitapur Road, Gayatri Nagar
Prayagraj, Uttar Pradesh, India
Phone: +91 88403 15311
Email: [your-email@domain.com]

We aim to resolve all privacy concerns within 30 days.

---

# PART 4: SOLAR SUBSIDY DISCLAIMER PAGE
## Strongly Recommended — Most solar disputes in India are subsidy-related

> Create /app/solar-subsidy-disclaimer/page.tsx

---

## Solar Subsidy Disclaimer — Vasudhaiv Enterprises

**Important Notice for Customers Seeking Government Solar Subsidies**

---

### Current Subsidy Scheme (PM Surya Ghar Muft Bijli Yojana)

The Government of India's PM Surya Ghar scheme offers subsidies for
residential rooftop solar under the following structure (subject to change):

| System Size | Central Subsidy (approx) |
|---|---|
| Up to 2 kW | ₹30,000 per kW |
| 2 kW to 3 kW | ₹18,000 per kW (for the additional kW) |
| Above 3 kW | Fixed at ₹78,000 total |

**These figures are indicative. Actual subsidy depends on government
notifications at time of your application.**

---

### Conditions for Subsidy Eligibility (UP State)

To qualify for subsidy in Uttar Pradesh, your installation must:

- Be a grid-connected (net metering) rooftop system
- Be installed by an MNRE-empaneled vendor
- Use ALMM-listed solar panels and approved inverters
- Have DISCOM (UPPCL) approval before installation
- Be registered on the National Portal for Rooftop Solar

**Vasudhaiv Enterprises is working toward MNRE empanelment. Customers
requiring empaneled vendor certification for subsidy should confirm
current empanelment status before proceeding.**

---

### Subsidy Application Timeline (Typical UP Process)

1. Customer applies on National Portal
2. DISCOM conducts technical feasibility check (7–30 days)
3. DISCOM issues approval letter
4. Installation completed by vendor
5. Commissioning report submitted to DISCOM
6. Net meter installed by DISCOM (30–90 days)
7. Subsidy credited to customer bank account (30–120 days after commissioning)

**Total typical timeline: 3–6 months from application to subsidy receipt.**

---

### What Vasudhaiv Enterprises Does and Does Not Guarantee

**We will:**
- Assist with National Portal registration
- Prepare and submit required documentation
- Coordinate with local DISCOM offices on your behalf
- Install ALMM-listed panels and approved equipment

**We cannot guarantee:**
- Subsidy approval by MNRE or DISCOM
- Specific subsidy amounts (policy may change after application)
- Net meter installation timelines (DISCOM-controlled)
- Processing timelines for subsidy disbursement

---

### Disclaimer

Subsidy information on this website is provided for general guidance
only. Vasudhaiv Enterprises is not a government body and has no
authority over subsidy decisions. Customers should independently verify
current subsidy rates and eligibility on:

- **National Portal for Rooftop Solar:** www.pmsuryaghar.gov.in
- **UPPCL (UP DISCOM):** www.uppcl.org
- **MNRE:** www.mnre.gov.in

By proceeding with a solar installation through Vasudhaiv Enterprises,
you acknowledge that subsidy receipt is contingent on government
processes outside our control.

---

*For questions about subsidy eligibility for your specific property,
contact us at +91 88403 15311 or WhatsApp us for a free consultation.*

---

## Quick Fix: Add These to Your Footer Right Now

Replace the broken `#` links in your current footer with:

```jsx
// In your Footer component
<a href="/terms">Terms & Conditions</a>
<a href="/privacy-policy">Privacy Policy</a>
<a href="/solar-subsidy-disclaimer">Subsidy Disclaimer</a>
```

And fix the address — your footer currently shows Lucknow.
Change to: Prayagraj, Uttar Pradesh, India
(or your actual registered address if different)
```

---

*Document prepared: June 2025*
*Business: Vasudhaiv Enterprises, Prayagraj UP*
*Legal framework: IT Act 2000, DPDPA 2023, Consumer Protection Act 2019*
