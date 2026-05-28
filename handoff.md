# goal

Build Athletic Sanctuary — a warm, Newsreader-typeset, mobile-first workout app (430px max-width) that feels like a private room rather than a fitness tracker. The design language is editorial minimalism: near-black `#14110e`, parchment accents, breathing aura orbs, film grain, and a full CSS token system that switches between Definition (gold) and Strength (amber) modes. The app should accumulate real data over time — check-ins, session logs, streaks — so it genuinely knows the user.

---

# current state (v3 — production-ready)

**Build:** clean. Zero console errors. `npm run dev` → `http://localhost:5173`.

**Every screen is live and data-connected.** Sessions persist to `localStorage`, banned exercises are respected by the workout generator, stats update in real time, and the suggestion engine learns from history.

---

## screens

| Screen | Status | Notes |
|---|---|---|
| OnboardingScreen | ✅ working | 3-step: welcome → name+gym+body stats → mode. Height and weight collected in step 1 as optional fields. Sets `profile.onboarded = true`. |
| TonightScreen | ✅ working | 3 smart suggestions: primary (least-trained groups, checkin-adjusted), short reset (single group, low effort), strength evening (compound groups, 75 min, str mode). Each tagged SUGGESTED. "Start from scratch" → PathScreen. |
| CheckinScreen | ✅ working | Mandatory before every workout (no skip). On save → ConfirmScreen. Back → TonightScreen. |
| ConfirmScreen | ✅ working | Brief pre-workout summary: groups, duration, effort, mode. "Let's go" compiles routine and enters ComposeScreen. Back → TonightScreen. |
| PathScreen | ✅ working | Custom compiler — time dial, muscle pills, mode cards. Reached via "Start from scratch". |
| ComposeScreen | ✅ working | Phased itinerary (warmup / main / core); SLOTS-correct finish time; coaching note. Back goes to PathScreen (from scratch) or TonightScreen (from suggestion). |
| DeepScreen | ✅ working | Set ticker (no countdown during work). Per-set checkmark button, rest timer between sets, "set X of Y up next" / "next · exercise" labels. Rest time 30% shorter for single-muscle workouts. Exercise-level progress dots. |
| CoolScreen | ✅ working | Arrive (breathing rings) → Reflect (per-exercise sets breakdown) → Close (week dots, mood picker, note). Saves full session on step-out. |
| LogScreen | ✅ working | Real sessions, expandable accordion rows, inline mood+note editor, Save + Delete (double-tap confirm). 6-week dot grid, 4-week stats panel. |
| RoomScreen | ✅ working | Inline profile editing (name, lastName, gym). Boundaries: full exercise list, alias-aware banning. Live stats. All prefs persist. |

---

## data flow

```
TonightScreen → beginWorkout(config) → CheckinScreen (always mandatory)
CheckinScreen → save → ConfirmScreen (config pre-loaded)
ConfirmScreen → confirmWorkout() → compile(config) → ComposeScreen
ComposeScreen → goDeep() (stamps sessionStart) → DeepScreen
DeepScreen → markSetDone() → rest timer → next set/exercise
DeepScreen → goCool(completedSets) → CoolScreen (arrive → reflect → close)
CoolClose → store.saveSession(...) → reset() → TonightScreen

TonightScreen → "Start from scratch" → PathScreen → ComposeScreen (same from there)
```

---

## suggestion algorithm (`TonightScreen.jsx`)

Three suggestions generated on every render from `buildSuggestions(store)`:

**Primary** — Reads last 8 sessions for least-trained muscle group pairs. Adjusts for checkin:
- Aches (`shoulders/lowback/midback/knees/hips`) → skips those groups
- `arrived: tired/wrecked` or `sleep ≤ 1` → reduces slot by 1, effort drops to 'moderate'

**Short Reset** — Single least-trained group, 30 min (15 if tired), def mode, low effort.

**Strength Evening** — Two least-trained compound groups (legs/chest/back/shoulders), 75 min, str mode, heavy. Also avoids aching groups.

---

## DeepScreen set ticker (`src/components/DeepScreen.jsx`)

Replaced timer-based work intervals with a tap-to-complete set tracker:

- **Work phase**: exercise name, set pips, SET X OF Y, reps + rest time pill, checkmark button
- **Rest phase**: countdown timer, "set X of Y up next" or "next · exercise name", Pause + Skip rest
- **Done phase**: ✓ symbol, "Cool down →" button
- Rest time = `parseRestSec(spec) × restFactor` where `restFactor = 0.7` for single-group, `1.0` for multi-group
- All state in a single `useRef`; rest interval only active during rest phase; renders via `useState(0)` tick

---

## persistence (`src/data/store.js`)

- `localStorage` key: `sa-store-v1`
- Stored: `profile`, `prefs`, `checkins` (one per ISO week, overwritten on each checkin), `sessions`
- `profile.onboarded` — onboarding gate
- `profile.banned` — exercise keys excluded from all generated routines
- `profile.weight/heightFt/heightIn` — set in onboarding, updated via checkin
- Derived: `streak`, `daysIn`, `visits`, `lastVisitDaysAgo`, `recentHours`, `recentAvgMood`, `thisWeekCheckin`

---

## key architecture decisions

**Workout flow state** — `useAppState` holds `pendingConfig` (groups, mode, slotIdx, minutes, effort, body) and `workoutSource` ('path' | 'confirm'). `beginWorkout(config)` always routes to checkin. `confirmWorkout()` calls `compile(pendingConfig)` and enters compose.

**DeepScreen set tracker** — All timer state in a single `useRef`. `setInterval` only ticks during rest phase. Re-renders via `useState(0)` counter.

**Banned exercises** — `buildRoutine` accepts a `banned` array. `toggleBan` uses `NAME_TO_KEYS` for alias awareness.

**Dock overlays** — `SaDock` and `SaFloatingDock` use `linear-gradient(transparent → var(--sa-bg-0))` with extra top padding so content scrolls infinitely underneath.

---

## files changed (v3 session)

```
src/hooks/useAppState.js            — pendingConfig, workoutSource, beginWorkout(), confirmWorkout()
src/components/TonightScreen.jsx    — full redesign: 3 smart suggestions, "Start from scratch"
src/components/CheckinScreen.jsx    — mandatory; save → 'confirm'; back → tonight
src/components/ConfirmScreen.jsx    — NEW: pre-workout summary screen
src/components/DeepScreen.jsx       — full rewrite: set ticker + rest timer
src/components/ComposeScreen.jsx    — back button respects workoutSource
src/components/OnboardingScreen.jsx — height + weight fields in step 1
src/components/RoomScreen.jsx       — removed placeholder notification quiet row
src/components/SanctuaryAtoms.jsx   — gradient backgrounds on SaDock + SaFloatingDock
src/App.jsx                         — added 'confirm' tab route
```

---

## deployment

GitHub → Vercel. Push to `main` triggers build + deploy automatically.

```
git push origin main
```

---

## known issues / next steps

Nothing is blocking. Potential future improvements:

- **Repeat session** — tapping a past log entry could pre-load its exercises for a repeat
- **Streak notifications** — push reminder when streak is at risk
- **Checkin trends** — sleep/energy over time in LogScreen stats panel
- **Pre-populate compiler** — "Start from scratch" could seed PathScreen with the suggested groups
