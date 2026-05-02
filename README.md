# Anchor

A meditation app for whenever you need a moment. Free forever, open source, for everyone.

## What it does

Anchor skips the onboarding. You pick how you feel right now (Scattered, Overwhelmed, or Restless), choose how many minutes you have (1, 3, or 5), and follow an animated breathing guide. When the session ends you get a confetti burst, a streak count, and a 28-day calendar showing every day you showed up.

No subscriptions. No email. No account required.

## Screens

**Marketing landing** — explains the app, links to the flow, works as a standalone page.

**Mood picker** — three honest states. Pick the one that fits.

**Session picker** — 1, 3, or 5 minutes. Each mood has its own tone.

**Kinetic player** — an animated blob breathes with you through 4s inhale, 4s hold, 6s exhale cycles. Move the mouse and particles trail behind it. That part is intentional.

**Dopamine reward** — confetti, streak count, a 28-day calendar grid, and an optional account sync prompt.

## Streak tracking

Completed sessions are stored as an array of dates in `localStorage` under the key `anchor_dates`. The reward screen shows the last 28 days as a grid: dark squares for completed days, green for today, faint gray for missed ones.

If you log in, the streak syncs to a PostgreSQL database tied to your account and stays consistent across devices. Logging in is optional and the local streak works exactly the same without it.

## Account sync

The API server handles authentication through Replit's OpenID Connect provider. Sessions are stored in PostgreSQL. Signing in gives you cross-device streak history. Signing out clears the session cookie and ends the OIDC session.

The login prompt on the reward screen is a single small link. It does not interrupt the app if you ignore it.

## Tech

**Frontend:** React, Vite, TypeScript, Canvas API, CSS custom properties, localStorage, PWA manifest and service worker.

**Backend:** Express 5, PostgreSQL, Drizzle ORM, openid-client v6, pino for logging.

**Auth:** Replit OIDC with PKCE. Sessions in a `sessions` table. Users in a `users` table. Streak days in a `streak_days` table (userId + date, composite primary key, deduplication handled server-side).

## Design tokens

| | |
|---|---|
| Background | `#F5F4F0` |
| Surface | `#FFFFFF` |
| Text | `#1A1A1A` |
| Muted | `#A89F97` |
| Accent (clay) | `#8C7A6B` |
| Success (green) | `#4A7C59` |
| Heading font | Space Grotesk 700 |
| Body font | Outfit 400 / 500 |

## Running locally

```bash
pnpm install
pnpm --filter @workspace/anchor run dev
pnpm --filter @workspace/api-server run dev
```

The database needs a `DATABASE_URL` environment variable. Push the schema with:

```bash
pnpm --filter @workspace/db run push
```

## Project layout

```
artifacts/
  anchor/          React + Vite PWA
  api-server/      Express API, auth, streak endpoints

lib/
  db/              Drizzle schema and client
  api-zod/         Zod schemas including auth types
  replit-auth-web/ useAuth hook for the web app
```

## License

MIT.
