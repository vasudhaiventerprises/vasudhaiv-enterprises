---
description: Graphify Phase 3 CRM admin + staff + referral modules
---

# Phase 3 — CRM Architecture Mode

When this workflow runs:

Load only CRM and database logic modules.

Scan folders:

- app/admin
- app/co-admin
- app/staff
- supabase

Ignore:

- homepage modules
- login modules
- analytics modules
- notification modules

Focus reasoning on:

- profiles table
- leads table
- service_requests table
- referrals table
- installations table
- RLS policies
- staff assignment flow
- admin dashboards
- referral tracking logic

Run:

/graphify app/admin app/co-admin app/staff supabase