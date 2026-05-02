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

## Features

- Replit Auth (OpenID Connect + PKCE) — sessions stored in PostgreSQL `sessions` table
- Streak tracking — `streak_days` table (userId + day, composite PK)
- Auth routes: `GET /api/login`, `GET /api/callback`, `GET /api/logout`, `GET /api/auth/user`
- Streak routes: `GET /api/streak` (load history), `POST /api/streak/record` (save today)
- Frontend: `useAuth()` from `@workspace/replit-auth-web`, calendar grid in `DopamineReward`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
