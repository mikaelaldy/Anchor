# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

- **anchor** — Meditation PWA (React + Vite, path `/`)
- **api-server** — Express API (path `/api`)

## Design System (Material Design 3 / Manrope)

- **Font**: Manrope 400/500/600/700/800 (Google Fonts) + Material Symbols Outlined (icon font)
- **Palette**: bg `#fdf8f8`, surface `#fff`, primary `#000`, secondary `#3e674b`, secondary-container `#bfeec9`
- **CSS vars**: `--color-bg/surface/surface-low/surface-mid/surface-high/surface-highest/text/muted/muted-mid/primary/on-primary/secondary/on-secondary/secondary-container/on-secondary-container/on-secondary-fv/outline/outline-variant`
- **Radius**: `--radius-card: 40px`, `--radius-card-sm: 24px`, `--radius-pill: 9999px`
- **Shadows**: `--shadow-card`, `--shadow-card-sm`, `--shadow-pill`, `--shadow-nav`, `--shadow-cta`
- **Animations**: `.breath-node` (14s breathe), `.ring-pulse` (8s ring glow), `.fade-in-up/1/2/3`
- **Icon usage**: `<span className="material-symbols-outlined">icon_name</span>` (outlined) or `className="material-symbols-filled"` (filled variant via CSS override)
- **Layout**: max-width 640px centered, mobile-first, full-width pill CTAs

## Screens

1. **MarketingLanding** — single-column landing; hero + breath node + CTAs + process + bento features + dark CTA + footer
2. **SensoryLanding** — mood picker; pill buttons with Material icon + label + arrow; moods: Scattered/Overwhelmed/Restless
3. **SessionSelector** — duration cards (40px radius, large type); 1 / 3 / 5 min
4. **KineticPlayer** — concentric circle breath node; wall-clock timer; canvas particle trail; INHALE/HOLD/EXHALE phase indicators
5. **DopamineReward** — confetti canvas; success icon; session card; streak badge; 28-day CalendarStreak grid; auth sync

## Features

- Replit Auth (OpenID Connect + PKCE) — sessions stored in PostgreSQL `sessions` table
- Streak tracking — `streak_days` table (userId + day, composite PK)
- Auth routes: `GET /api/login`, `GET /api/callback`, `GET /api/logout`, `GET /api/auth/user`
- Streak routes: `GET /api/streak` (load history), `POST /api/streak/record` (save today)
- Frontend: `useAuth()` from `@workspace/replit-auth-web`, `CalendarStreak` component in `src/components/`
- Post-OAuth redirect: `sessionStorage` keys `anchor_pending_sync` + `anchor_pending_duration` restore reward screen after login
- Background-tab timer: wall-clock via `accumulatedRef + performance.now() - segmentStartRef` (not tick-based)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
