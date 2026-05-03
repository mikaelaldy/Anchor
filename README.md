# ⚓ Anchor



**Stillness for the restless mind.**



Anchor is a free, open source mindfulness web app meant for real days: scattered attention, overloaded brains, and the five minutes you actually have between everything else.



No single “right” way to meditate. Just a softer place to land.



[**Try it now →**](https://anchor-mikaships.replit.app) · [MIT License](#license) · No account required to breathe



## Why this exists



Lots of mindfulness tools assume you already feel calm. They assume silence is easy and that focusing for twenty minutes is realistic.



Anchor is built for everyone else.



You pick how you feel right now, honestly. You pick how much time you have. One minute still counts as showing up.



A breathing ring carries you through the session. Gentle voice guidance matches your mood. When it ends, you get a tiny celebration: streak, calendar, proof that you were here today.



Stay free forever. Stay open source. Stay human.



## What’s inside



**Mood picker**  

Three states that admit the truth: Scattered, Overwhelmed, or Restless.



**Session picker**  

Sessions are 1, 3, or 5 minutes. Choose what fits the moment without apologizing for it.



**Kinetic player**  

A steady rhythm: inhale four seconds, hold four, exhale six. Particle trails follow your mouse for when sitting still feels hard. Guided voice playback matches your mood, and you can mute the voice anytime.



**Reward screen**  

Confetti, your streak count, and a twenty eight day calendar. Finishing feels like finishing.



**My Journey**  

Streak stats, calendar heatmap habits, totals, and a quiet path back into practice.



## Audio



Voice tracks are exported as plain MP3s and played in the browser. The spoken scripts live in **`audio prompts/`** (paired by mood and length) if you want to tweak wording and regenerate elsewhere.



Five minute sessions intentionally reuse the three minute recording so timing stays manageable.



If a file fails to load, playback stops quietly without breaking the rest of the screen.


**Files**

| Mood | 1 min | 3 min |
|------|-------|-------|
| Scattered | `artifacts/anchor/public/audio/scattered-1m.mp3` | `artifacts/anchor/public/audio/scattered-3m.mp3` |
| Overwhelmed | `artifacts/anchor/public/audio/paralyzed-1m.mp3` | `artifacts/anchor/public/audio/paralyzed-3m.mp3` |
| Restless | `artifacts/anchor/public/audio/buzzing-1m.mp3` | `artifacts/anchor/public/audio/buzzing-3m.mp3` |

## Streak and auth

Completed days are remembered in **`localStorage`** under **`anchor_dates`**. The reward view shows the last twenty eight days in a calm grid.

If you choose to sign in with your **Replit** account, your streak can sync to PostgreSQL and travel with you. Signing in is optional. Local streak behavior works the same whether you attach an account or not.

Auth flows through **Replit OpenID Connect with PKCE**. Server sessions land in Postgres. Login shows up as a small link where it belongs, never in the middle of your breath cycle.

## Design tokens

| Token | Value |
|-------|-------|
| Background | `#fdf8f8` |
| Surface | `#ffffff` |
| Primary | `#000000` |
| Secondary | `#3e674b` |
| Secondary container | `#bfeec9` |
| Font | Manrope 400 to 800 |
| Icons | Material Symbols Outlined |
| Card radius | `40px` |
| Pill radius | `9999px` |
| Max width | `640px` centered |

## Stack



**Frontend:** React 19, Vite 7, TypeScript, Canvas (particles and confetti)



**Backend:** Express 5, PostgreSQL, Drizzle ORM, openid-client v6, pino



**Workspace:** pnpm workspaces, shared libraries under **`lib/`**



## Run locally



From the repo root:



```bash

pnpm install

pnpm --filter @workspace/anchor run dev

```



Opens the **Vite** dev server (by default **`http://localhost:5173`** unless you override **`PORT`**).



To run the **API** (auth and streak sync) you currently need **`PORT`**, **`DATABASE_URL`**, and the Replit related values required by **`artifacts/api-server`** (for example session and OIDC wiring). **`SESSION_SECRET`** is part of typical session setup alongside your environment.



Unix style shells can use **`pnpm --filter @workspace/api-server run dev`** (it bundles build plus start). On **PowerShell**, the same script may not evaluate `export`; instead run **`build`** then **`start`** yourself with **`NODE_ENV`** set to **`development`** and **`PORT`** set.



Push or sync the Drizzle schema when your database is configured:



```bash

pnpm --filter @workspace/db run push

```



## Project structure



```

artifacts/

  anchor/           React + Vite web app

  api-server/       Express API (auth and streak endpoints)



lib/

  db/               Drizzle schema and client

  api-spec/         OpenAPI and Orval codegen config

  api-zod/          Zod schemas

  api-client-react/ Generated React Query hooks

  replit-auth-web/  useAuth for the frontend



artifacts/anchor/public/audio/

  scattered-1m.mp3   scattered-3m.mp3

  paralyzed-1m.mp3   paralyzed-3m.mp3

  buzzing-1m.mp3     buzzing-3m.mp3



audio prompts/      Source text used for narration (paired by mood and length)

```



## Key commands



```bash

pnpm run typecheck                                  # Everything typechecks together

pnpm --filter @workspace/api-spec run codegen      # Refresh hooks from OpenAPI

pnpm --filter @workspace/db run push               # Apply schema in dev workflows

```



## Built with



- [Replit Agent](https://replit.com) for scaffolding and fast iteration

- [Google Stitch](https://stitch.google.com) for visual language and layouts

- [ElevenLabs](https://elevenlabs.io) (or whichever engine you regenerate with) for voice assets



Crafted solo in under twenty four hours for the [Replit 10 Year Buildathon](https://buildathons.replit.app/replit-10-year-buildathon).



## Contributing



Pull requests and issues are welcome.



If accessibility, another language, another mood track, or a kinder onboarding flow speaks to you, open an issue and say hello first. Anchor grows better when more people breathe into it.



## License



**MIT.** Use it, remix it, pass it forward.



*Free forever. Open source. For everyone.*

