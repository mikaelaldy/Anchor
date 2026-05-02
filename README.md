# Anchor

**Stillness for the restless mind.**

Anchor is a free, open-source meditation PWA built specifically for ADHD brains. No subscriptions, no account, no judgement — just open it and breathe.

---

## Why Anchor?

Most meditation apps assume you can sit still long enough to log in, choose a playlist, and follow a ten-minute guided session. Anchor doesn't. It meets you where you are — scattered, buzzing, or paralyzed — and gives you the shortest possible path to a breath.

---

## Features

- **Mood-first flow** — Start by naming how you feel right now. Three honest options: Scattered, Paralyzed, Buzzing.
- **Flexible session lengths** — 1, 3, or 5 minutes. Even a single minute counts.
- **Kinetic breath player** — An animated blob guides you through 4-4-6 breathing (inhale · hold · exhale). Move your mouse to leave particle trails — the fidget layer is intentional.
- **Dopamine reward screen** — Confetti burst and streak tracking when you complete a session.
- **Streak tracking** — Daily streak stored locally. No account required.
- **Spacebar pause** — Pause and resume the session with the spacebar or the on-screen button.
- **Fully offline** — Installable as a PWA. Works without internet once installed.
- **Responsive** — Adapts to mobile screens with touch particle trails, scaled layouts, and safe-area insets.

---

## Screens

| Screen | Description |
|---|---|
| Mood Selector | Pick your current mental state |
| Session Picker | Choose 1, 3, or 5 minutes |
| Kinetic Player | Breath animation with particle trail and progress ring |
| Dopamine Reward | Confetti burst, stat summary, and streak display |

---

## Tech Stack

- **React + Vite** — Fast dev and production builds
- **TypeScript** — Fully typed throughout
- **CSS custom properties** — Design token–driven styling (no Tailwind components used)
- **Canvas API** — Particle trail and confetti animations
- **localStorage** — Streak persistence, no backend needed
- **PWA** — `manifest.json` + `sw.js` service worker for install and offline support

### Design System

| Token | Value |
|---|---|
| Background | `#F5F4F0` |
| Surface | `#FFFFFF` |
| Text | `#1A1A1A` |
| Muted | `#A89F97` |
| Accent | `#8C7A6B` |
| Success | `#4A7C59` |
| Heading font | Space Grotesk 700 |
| Body font | Outfit 400 / 500 |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+

### Install

```bash
pnpm install
```

### Run (development)

```bash
pnpm --filter @workspace/anchor run dev
```

The app runs at `http://localhost:<PORT>` (port assigned automatically).

### Build

```bash
pnpm --filter @workspace/anchor run build
```

---

## Project Structure

```
artifacts/anchor/
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── sw.js               # Service worker (offline support)
│   └── icons/              # App icons (SVG)
└── src/
    ├── App.tsx              # Root screen router
    ├── index.css            # Global design tokens and keyframes
    ├── hooks/
    │   └── useIsMobile.ts   # Responsive breakpoint hook (768px)
    └── pages/
        ├── SensoryLanding.tsx   # Screen 1 — mood picker
        ├── SessionSelector.tsx  # Screen 2 — duration tiles
        ├── KineticPlayer.tsx    # Screen 3 — breath animation
        └── DopamineReward.tsx   # Screen 4 — reward + streak
```

---

## Breathing Cycle

The kinetic player follows a 14-second loop:

| Phase | Duration |
|---|---|
| Inhale | 4 s |
| Hold | 4 s |
| Exhale | 6 s |

---

## PWA Installation

On mobile, tap the browser's "Add to Home Screen" prompt. On desktop, click the install icon in the address bar. Once installed, Anchor works fully offline.

---

## License

MIT — free to use, modify, and distribute.

---

*No sign-up. No subscriptions. No judgement.*
