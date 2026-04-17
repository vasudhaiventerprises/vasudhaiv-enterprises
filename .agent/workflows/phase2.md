---
description: Graphify Phase 2 authentication and role routing modules
---

# Phase 2 — Authentication Mode

When this workflow runs:

Load only login system and access-control logic.

Scan folders:

- app/login
- lib
- middleware.ts

Ignore:

- admin dashboard
- CRM modules
- analytics modules
- notification modules

Focus reasoning on:

- Supabase authentication
- session handling
- role detection
- role-based redirects
- protected routes middleware

Run:

/graphify app/login lib middleware.ts