# Anchor

A calm, visual breathing app for whenever you need a moment. Free forever, no account required.

## What it does

Pick how you feel right now — Scattered, Overwhelmed, or Restless. Choose how long you have (1, 3, or 5 minutes). Follow an animated breathing guide with an optional guided voiceover and ambient sound. When the session ends you get a confetti burst and a 28-day streak calendar.

No subscriptions. No email. No account required to use it.

## Screens

**Landing** — hero, feature overview, and a single "Start" CTA. Links to the full flow and your journey dashboard.

**Mood picker** — three honest states. Pick the one that fits right now.

**Session picker** — 1, 3, or 5 minutes. Choose an ambient sound (rain, fire, ocean, forest, or silence).

**Kinetic player** — concentric ring breathes through a 4s inhale / 4s hold / 6s exhale cycle. Move the mouse and particles trail. A guided voiceover plays in the background matched to your mood and duration. Separate mute controls for the voiceover (top-left) and ambient sound (top-right).

**Reward** — confetti, your streak count, and a 28-day calendar grid. Optional account sync to persist your streak across devices.

**My Journey (Dashboard)** — full streak history, heatmap calendar, total sessions, and a prompt to start another session.

## Audio

Voiceover files were generated with ElevenLabs (River voice, stability 0.72, similarity 0.55, speed 0.82) and are served as static MP3s:

| Mood | 1 min | 3 min |
|---|---|---|
| Scattered | `scattered-1m.mp3` | `scattered-3m.mp3` |
| Overwhelmed | `paralyzed-1m.mp3` | `paralyzed-3m.mp3` |
| Restless | `buzzing-1m.mp3` | `buzzing-3m.mp3` |

5-minute sessions fall back to the 3-minute audio file. Playback is silent on load failure.

Ambient sounds are synthesised via the Web Audio API (no external files).

## Streak tracking

Completed sessions are stored in `localStorage` under `anchor_dates`. The reward screen and dashboard show the last 28 days as a grid: dark squares for days you showed up, a green highlight for today.

Log in to sync your streak to a PostgreSQL database so it follows you across devices. Logging in is optional — the local streak works identically without it.

## Auth

Replit OpenID Connect with PKCE. Sessions are stored in PostgreSQL. The login prompt on the reward screen is a single small link and never interrupts the session flow.

After a successful OAuth redirect, `sessionStorage` keys (`anchor_pending_sync`, `anchor_pending_duration`) restore the reward screen so the confetti moment is never lost.

## Design

| Token | Value |
|---|---|
| Background | `#fdf8f8` |
| Surface | `#ffffff` |
| Primary | `#000000` |
| Secondary | `#3e674b` |
| Secondary container | `#bfeec9` |
| Heading / body font | Manrope 400 – 800 |
| Icons | Material Symbols Outlined |
| Card radius | `40px` |
| Pill radius | `9999px` |
| Max layout width | `640px` centered |

## Tech

**Frontend:** React 19, Vite 7, TypeScript, Canvas API (particles + confetti), Web Audio API (ambient sounds), CSS custom properties.

**Backend:** Express 5, PostgreSQL, Drizzle ORM, openid-client v6, pino logging.

**Monorepo:** pnpm workspaces, shared libs under `lib/`.

## Running locally

```bash
pnpm install
pnpm --filter @workspace/anchor run dev
pnpm --filter @workspace/api-server run dev
```

Set `DATABASE_URL` and `SESSION_SECRET` environment variables, then push the schema:

```bash
pnpm --filter @workspace/db run push
```

## Project layout

```
artifacts/
  anchor/          React + Vite web app
  api-server/      Express API — auth, streak endpoints

lib/
  db/              Drizzle schema and client
  api-spec/        OpenAPI spec + Orval codegen config
  api-zod/         Zod schemas (AuthUser, streak types)
  api-client-react/ Generated React Query hooks
  replit-auth-web/ useAuth hook consumed by the web app

artifacts/anchor/public/audio/
  scattered-1m.mp3 / scattered-3m.mp3
  paralyzed-1m.mp3 / paralyzed-3m.mp3
  buzzing-1m.mp3   / buzzing-3m.mp3
```

## Key commands

```bash
pnpm run typecheck                          # full typecheck across all packages
pnpm --filter @workspace/api-spec run codegen  # regenerate API hooks from OpenAPI spec
pnpm --filter @workspace/db run push       # push DB schema changes (dev only)
```

## License

MIT.
