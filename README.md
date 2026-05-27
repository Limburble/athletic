# Athletic

Premium liquid glass workout builder and HIIT timer.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to GitHub Pages

```bash
npm install
npm run build
npm run deploy
```

Then go to your repo → Settings → Pages → set source to `gh-pages` branch.

## Design Philosophy

Three-step guided setup — time, muscles, mode — always visible as a stack.
Active step is fully open. Completed steps collapse to a summary line and are
tappable to reopen. Locked steps are visible but dimmed. The eye always knows
where it is in the flow.

Timer is a full-screen takeover the moment you hit Start. No rings.
Whole screen color-shifts between work (deep green/amber) and rest phases.
Close button always accessible. Config stays separate from the running timer.

## Stack

- React 18 + Vite
- Framer Motion (spring physics, layout animations, AnimatePresence)
- Tailwind CSS v3
- Lucide React
