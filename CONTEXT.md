# Athletic — Project Context for Claude Code

## What This Is

Athletic is a premium personal workout builder and HIIT timer app built for one specific user (Brayden). It is not a mass-market fitness app. It is a highly curated personal training instrument designed around one person's workflow, gym equipment, and training philosophy.

Built with: React 18 + Vite + Framer Motion + Tailwind CSS v3 + Lucide React.
Deployed to: https://limburble.github.io/athletic

---

## Design Philosophy

**"The Instrument"** — every element serves a function and that function is immediately legible.

Core principles:
- One primary action per screen. The eye always knows where to go.
- State is obvious, not subtle. Selected means selected.
- Transitions are purposeful — the timer expanding to fullscreen is a spatial metaphor for entering the workout.
- Hierarchy through space, not decoration.
- Two type scales: big (Bebas Neue display) and small (system sans). Nothing competing in between.

**Guided setup stack** — the core UX pattern:
- Three steps always visible as a vertical stack (time → muscles → mode)
- Active step expands fully with controls inside
- Completed steps collapse to a one-line summary, tappable to reopen
- Locked steps are visible but dimmed
- The eye always knows where it is and what's coming

**Timer** — fullscreen takeover when running. No ring/circle indicator (deliberately avoided — feels dated). Whole screen color-floods based on phase. Deep forest green for definition work, dark amber for strength work, muted blue-grey for rest.

---

## Identity

- Name: **Athletic**
- Wordmark: "Athlet" in Bebas Neue + "ic" in Fraunces italic (intentional typographic split)
- Tagline: "Your training, structured."
- No mixed case gimmicks. Clean, confident, no tricks.

---

## Themes — 4 States

| Mode | Dark | Light |
|------|------|-------|
| Definition | Deep forest bg + leafy green accent (#4a8c40) | Light bg + same green |
| Strength | Near-black bg + amber accent (#b8720f) | Light bg + same amber |

CSS variables in `:root` and `:root[data-mode='strength']` and `:root[data-dark='false']`.
Set via `document.documentElement.setAttribute('data-mode', ...)` and `data-dark`.

---

## Project Structure

```
src/
  App.jsx                    # Root — wires everything, AnimatePresence transitions
  main.jsx                   # Entry point
  index.css                  # Full design system — tokens, glass, typography, animations
  hooks/
    useAppState.js            # All app state in one hook
  data/
    exercises.js              # Exercise library, pools, routine engine, ab sessions
  components/
    Ambient.jsx               # Animated mesh gradient background orbs
    Header.jsx                # Wordmark + dark/light toggle
    Nav.jsx                   # Minimal two-pill tab switcher (Build / Timer)
    Picker.jsx                # iOS scroll-snap time picker
    StepCard.jsx              # Core guided setup card (active/done/locked states)
    BuildScreen.jsx           # 3-step guided session builder
    ExerciseRow.jsx           # Expandable exercise card with form info
    WorkoutBlock.jsx          # Glass card wrapping exercise rows
    ResultScreen.jsx          # Compiled workout display
    TimerScreen.jsx           # HIIT timer config + fullscreen overlay
```

---

## Data Layer (src/data/exercises.js)

### Exercise Library (EX)
57 individual exercise modules. Each has:
- `n` — name
- `d` — definition prescription (sets × reps + rest)
- `s` — strength prescription (different sets/reps/rest)
- `i` — full form instruction (science-backed, technique flags)

Groups: chest (11), back (10), triceps (9), biceps (9), shoulders (5), legs (7), abs (11)

### Pools
- `DEF_POOL` — definition exercise order per group (compound → isolation, 8–15 reps, 60–90s rest)
- `STR_POOL` — strength exercise order per group (heaviest compound first, 3–6 reps, 2–3 min rest)
- `DEF_EX_COUNT` — [1,2,3,4,5,6,7,8,9,10] exercises by time slot (15→150 min)
- `STR_EX_COUNT` — [1,1,2,2,3,4,5,6,7,8] exercises by time slot

### Time Slots
10 slots: 15 / 30 / 45 / 60 / 75 / 90 / 105 / 120 / 135 / 150 min

### Routine Builder (buildRoutine)
```js
buildRoutine(groups, mode, slotIdx, absRotation)
```
- Distributes exercises evenly across selected muscle groups
- Caps to pool depth so never requests non-existent exercises
- Returns: { warmup, main, abs, notes }

### Ab Sessions (ABS_SESSIONS)
5 rotating sessions — always 3 exercises in structure: overload → builder → finisher

Personal ab profile:
- 5'10 / 149lb / already lean
- Goal: blocky 6-pack, thick rectus, obliques framing waist
- Equipment: dumbbells, plates (25/35/45lb), weight balls — NO machines
- BANNED: hanging leg raises, hanging knee raises, reverse crunches, cat-cow
- Approved pool: weighted crunch, weighted sit-up, russian twist, straight leg raise,
  toe touch crunch, slow tempo crunch, ab wheel rollout, hollow body hold,
  plank (active tension), side plank, plank shoulder taps

Sessions:
1. Heavy Plate Day — weightedCrunch → russianTwist → abWheelRollout
2. Rectus Builder — weightedSitUp → straightLegRaise → hollowBodyHold
3. Time Under Tension — slowTempoCrunch → toeTouchCrunch → sidePlank
4. Oblique + Core — weightedCrunch → abWheelRollout → plankShoulderTap
5. Full Core Circuit — weightedSitUp → russianTwist → plank

### HIIT Exercises (HIIT_EXERCISES)
8 exercises with per-exercise work/rest timings for the timer queue mode.

---

## App State (useAppState.js)

Key state:
- `tab` — 'build' | 'timer'
- `activeStep` — 0/1/2 (which setup step is open)
- `compiled` — whether workout has been built (shows result vs build screen)
- `mode` — 'def' | 'str'
- `dark` — boolean
- `slotIdx` — 0–9 (which time slot)
- `groups` — array of selected muscle group IDs
- `workout` — compiled workout object { warmup, main, abs, notes }
- Timer state: hiitMode, hiitWork, hiitRest, hiitRounds, hiitExIds, preloaded

Key functions:
- `compile()` — builds routine, sets compiled = true
- `reset()` — clears compiled state, goes back to step 0
- `toggleMode()` — switches def/str, updates CSS attribute
- `preConfigHIIT()` — loads core block exercises into timer, switches to timer tab
- `advanceStep(n)` — moves guided setup to step n

---

## Gym Equipment (Brayden's gym — Club Greenwood)

- Dumbbells (full rack)
- Straight bars and curl bars
- Benches (flat and incline)
- Preacher curl bench
- Cable stations: pulldowns (lat bar, straight bar, rope), cable rows, lateral push attachments
- Machine curl, pec fly, chest press, shoulder press
- Hip abductor machine, hip adductor machine
- Dip bars, pull-up bar
- Smith machine
- Leg press, leg curl, leg extension, calf raise machines
- Cardio machines (warmup framing only)

---

## Timer Architecture

**Config screen** — always separate from the running timer.
User configures work/rest/rounds/exercises first, then hits Start Session.

**Fullscreen overlay** (AnimatePresence) — appears on Start:
- `timer-fs` class + phase class (`work-def`, `rest-def`, `work-str`, `rest-str`, `done`)
- Background color defined in index.css per phase/mode combination
- Progress strip at very top (2px line, not a ring)
- Time in giant Bebas Neue (19–24vw depending on whether exercise name shows)
- Exercise name below time (queue mode only)
- Round counter subtle at bottom
- Three controls: reset (left), play/pause (center, large), skip (right)
- Close button top-left

**Two timer modes:**
- Free Timer — work/rest/rounds with no exercise queue
- Exercise Queue — cycles through selected exercises, work/rest per exercise

**Pre-config HIIT** — button at bottom of Core Block in result screen.
One tap loads: weightedCrunchHIIT, straightLegHIIT, russianTwistHIIT, mtnClimb
Sets work=40s, rest=20s, rounds=4, switches to Timer tab.

---

## Known Issues / Open Tasks

- Merge conflicts were introduced during a bad git pull on Windows — should be resolved
- GitHub Pages deployment uses gh-pages branch via `npm run deploy`
- The `base: './'` in vite.config.js is required for GitHub Pages asset paths to work
- Dark/light toggle uses `document.documentElement.setAttribute('data-dark', ...)` — make sure this fires on initial load too
- No PWA manifest yet — could add for proper iPhone home screen icon
- No persistent storage — workout history not saved between sessions (potential future feature)

---

## Deployment

```bash
npm install
npm run dev        # local dev at localhost:5173
npm run build      # builds to /dist
npm run deploy     # builds + pushes to gh-pages branch
```

GitHub repo: https://github.com/Limburble/athletic
Live URL: https://limburble.github.io/athletic

---

## What Makes This Different From Generic Fitness Apps

1. Completely hardcoded to one person's gym equipment — no equipment selector
2. Ab system based on a personal AI coach profile — specific approved/banned exercise list
3. Science-backed programming (Schoenfeld 2017, ACSM 2026, Rhea 2003) with citations in the data
4. Two completely separate programming philosophies (def vs str) — different exercise order, different pools, different prescriptions, different notes
5. Progressive overload philosophy baked into every ab prescription
6. 5 rotating ab sessions so core work never repeats back-to-back
7. Pre-config HIIT connects the workout builder directly to the timer in one tap
