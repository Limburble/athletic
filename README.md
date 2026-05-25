# Athletic

A premium liquid glass workout builder and HIIT timer app built with React + Framer Motion + Tailwind CSS.

## Stack

- **React 18** + Vite
- **Framer Motion** — spring physics, layout animations
- **Tailwind CSS v3** — utility classes
- **Lucide React** — icon system
- Custom glassmorphism CSS — backdrop blur, layered translucency

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

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
