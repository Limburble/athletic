# Athletic

<<<<<<< HEAD
Premium liquid glass workout builder and HIIT timer.
=======
A premium liquid glass workout builder and HIIT timer app built with React + Framer Motion + Tailwind CSS.

## Stack

- **React 18** + Vite
- **Framer Motion** — spring physics, layout animations
- **Tailwind CSS v3** — utility classes
- **Lucide React** — icon system
- Custom glassmorphism CSS — backdrop blur, layered translucency
>>>>>>> f70bf3ebf97c6e10827c63b28d6e9c392955b2d9

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

<<<<<<< HEAD
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
=======
## Build for production

```bash
npm run build
```

Output goes to `/dist` — deploy to GitHub Pages, Netlify, or Vercel.

## Deploy to GitHub Pages

```bash
npm run build
# then push /dist contents to gh-pages branch
```

Or use the Vite GitHub Pages plugin:

```bash
npm install --save-dev vite-plugin-gh-pages
npm run build && npm run deploy
```

## Features

- **Build tab** — session builder with iOS scroll picker, muscle group selector, mode toggle
- **Definition mode** — hypertrophy programming (8–15 reps, 60–90s rest)
- **Strength mode** — neural adaptation programming (3–6 reps, 2–3 min rest)
- **57 exercise modules** — full form breakdowns, science-backed prescriptions
- **5 rotating ab sessions** — overload → builder → finisher structure
- **Timer tab** — free timer + exercise queue HIIT timer
- **Pre-config HIIT** — one tap loads core block into timer
- **4 theme states** — definition/strength × dark/light, all transitions smooth
- **Animated mesh background** — ambient gradient orbs per mode
- **Full glassmorphism** — backdrop blur, specular highlights, layered depth

## Project Structure

```
src/
  components/
    MeshBackground.jsx   # Animated ambient gradient
    Header.jsx           # Logo + dark/light toggle
    Dock.jsx             # Floating bottom nav
    Picker.jsx           # iOS scroll picker
    ModeToggle.jsx       # Definition/Strength pill toggle
    ExerciseCard.jsx     # Expandable exercise row
    WorkoutBlock.jsx     # Glass card wrapping exercises
    ConfigScreen.jsx     # Session builder UI
    ResultScreen.jsx     # Compiled workout display
    TimerScreen.jsx      # HIIT timer with liquid ring
  data/
    exercises.js         # Full exercise library + routine engine
  hooks/
    useAppState.js       # Central app state
  App.jsx
  main.jsx
  index.css
```
>>>>>>> f70bf3ebf97c6e10827c63b28d6e9c392955b2d9
