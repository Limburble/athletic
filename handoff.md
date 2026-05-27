# goal

Build Athletic Sanctuary — a warm, Newsreader-typeset, mobile-first workout app (430px max-width) that feels like a private room rather than a fitness tracker. The design language is editorial minimalism: near-black `#14110e`, parchment accents, breathing aura orbs, film grain, and a full CSS token system that switches between Definition (gold) and Strength (amber) modes. The app should accumulate real data over time — check-ins, session logs, streaks — so it genuinely knows the user.

---

# current state

**Build:** clean. 399 modules, zero warnings. `npm run dev` runs on `http://localhost:5173`.

**Design system:** fully implemented from the Athletic Sanctuary Claude Design handoff. All tokens, typography (Newsreader + Geist), animations, and theme switching are live.

**Screens (8):**
| Screen | Status | Notes |
|---|---|---|
| TonightScreen | working | Last-visit text is live from store |
| CheckinScreen | working | Seeds from prior week entry + profile; saves on "Saved · step in" |
| PathScreen | working | Time dial, muscle pills, mode cards |
| ComposeScreen | working | Groups workout by muscle pool; SLOTS-correct finish time |
| DeepScreen | working | HIIT timer auto-starts; advances through exercises; calls `goCool()` on finish |
| CoolScreen | working | Arrive → Reflect (real elapsed time + sets) → Close (real week dots, saves session) |
| LogScreen | working | Real sessions, real six-week dot grid, real 4-week stats, empty state |
| RoomScreen | working | Live profile stats, prefs persist immediately |

**Persistence (`src/data/store.js`):**
- `localStorage` under key `sa-store-v1`
- Stores: `profile`, `prefs`, `checkins` (one per ISO week), `sessions`
- Derives on every load/save: `streak`, `daysIn`, `visits`, `lastVisitDaysAgo`, `recentHours`, `recentAvgMood`, `thisWeekCheckin`
- `sessionStart` timestamp recorded when `goDeep()` is called; elapsed time computed in CoolReflect

**Data flow for a full session:**
1. TonightScreen → Begin → PathScreen
2. PathScreen → `compile({ groups, mode, slotIdx })` → ComposeScreen
3. ComposeScreen → `goDeep()` (stamps `sessionStart`) → DeepScreen
4. DeepScreen → `goCool()` → CoolScreen (arrive → reflect → close)
5. CoolClose → `store.saveSession(...)` → `reset()` → TonightScreen

---

# files in flight

## changed

```
src/index.css                        — complete Sanctuary token system; replaces old dark glass theme
src/App.jsx                          — tab router with AnimatePresence fade
src/hooks/useAppState.js             — integrates useSanctuaryStore; adds goDeep(), sessionStart
src/data/store.js                    — NEW: full localStorage persistence layer
src/components/SanctuaryAtoms.jsx    — NEW: all shared atoms (SaIcon, SaMark, SaTopBar, SaDock, SaStat, SaSwitch, SaFloatingDock, SaModeTag)
src/components/TonightScreen.jsx     — live last-visit text
src/components/PathScreen.jsx        — NEW: time dial + muscle pills + mode cards
src/components/ComposeScreen.jsx     — NEW: phased itinerary; uses SLOTS[slotIdx].v for correct durations
src/components/DeepScreen.jsx        — NEW: full-screen immersive HIIT timer
src/components/CoolScreen.jsx        — Arrive/Reflect/Close flow; real stats; saves session on step-out
src/components/CheckinScreen.jsx     — seeds from store; dynamic "N days in" heading; separate save vs skip
src/components/RoomScreen.jsx        — live profile/stats; prefs persist on toggle
src/components/LogScreen.jsx         — real sessions; live six-week dot grid; empty state
```

## failed attempt

**ComposeScreen duration formulas** — originally used `state.slotIdx * 15` as a minutes proxy. This gave 45 min for slotIdx=3 instead of 60. Fixed by importing `SLOTS` from `../data/exercises` and using `SLOTS[state.slotIdx].v`.

**Preview server port** — during development, `autoPort: true` in `launch.json` assigned a random port (56798) while Vite was actually on 5173. The preview iframe silently failed. Fixed by navigating directly to `http://localhost:5173`.

## next step

**Onboarding** — the app has no first-run flow. On first open `store.sessions.length === 0` and profile is seeded with Brayden's defaults. A dedicated OnboardingScreen (or a modal on TonightScreen) should collect: name, gym, default mode preference. Trigger: `store.stats.visits === 0 && !store.profile.onboarded`.

**Automatic check-in prompt** — CheckinScreen exists but is never automatically surfaced. Logic: if today is Monday and `store.thisWeekCheckin === null`, route to CheckinScreen before PathScreen on the first session of the week.

**TonightScreen suggested workout** — the invitation card shows a hardcoded "Chest, back, core · 60 min". It should be personalised: look at the last 3 sessions' groups, recommend what hasn't been trained in the longest time, and surface the user's preferred mode and duration.

**DeepScreen exercise tracking** — the timer cycles through exercise names but doesn't record which sets were actually completed. Add a `completedSets` counter per exercise and pass it into `saveSession` so the log can show "8 of 9 sets".

**Boundaries (RoomScreen)** — "What you won't do" row is a chevron stub. Needs a sheet/modal listing exercises from `DEF_POOL`/`STR_POOL` that the user can ban from rotation. Banned keys should live in `store.profile.banned = []` and be filtered out in `buildRoutine`.

**Profile editing** — name, gym, and height in RoomScreen are read-only. Tapping the athlete card should open an editable state (inline, not a modal) with a save button that calls `store.updateProfile(...)`.

**Dead legacy components** — six old v1 files were missed in the Sanctuary cleanup and still exist as unreferenced dead code:
```
src/components/Dock.jsx
src/components/ExerciseRow.jsx
src/components/ExerciseCard.jsx
src/components/MeshBackground.jsx
src/components/ModeToggle.jsx
src/components/WorkoutBlock.jsx
```
Safe to delete. None are imported anywhere.
