---
description: Graphify Phase 4 push notifications and automation modules
---

# Phase 4 — Notification System Mode

When this workflow runs:

Load only push notification and automation modules.

Scan folders:

- app/api/send-notification
- app/api/cron
- lib/firebase
- public/firebase-messaging-sw.js

Ignore:

- homepage modules
- CRM modules
- analytics modules

Focus reasoning on:

- Firebase Cloud Messaging
- token registration
- cron reminder automation
- service completion notifications
- AMC reminder system
- payment reminder system

Run:

/graphify app/api/send-notification app/api/cron lib/firebase public/firebase-messaging-sw.js