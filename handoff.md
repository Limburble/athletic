# goal

Build Athletic Sanctuary — a warm, Newsreader-typeset, mobile-first workout app (430px max-width) that feels like a private room rather than a fitness tracker. The design language is editorial minimalism: near-black `#14110e`, parchment accents, breathing aura orbs, film grain, and a full CSS token system that switches between Definition (gold) and Strength (amber) modes. The app should accumulate real data over time — check-ins, session logs, streaks — so it genuinely knows the user.

---

# current state (v2 — fully functional)

**Build:** clean. Zero console errors. `npm run dev` → `http://localhost:5173`.

**Every screen is live and data-connected.** Sessions persist to `localStorage`, banned exercises are respected by the workout generator, stats update in real time, and the suggestion engine learns from history.

---

## screens

| Screen | Status | Notes |
|---|---|---|
| OnboardingScreen | ✅ working | 3-step: welcome → name+gym → mode. Sets `profile.onboarded = true` and navigates. Only shown to brand-new users (`!onboarded && visits === 0`). |
| TonightScreen | ✅ working | Personalized suggestion (least-trained groups from last 6 sessions). "Begin" → `goPath()` (Monday gate). Footer shows last-visit text. |
| CheckinScreen | ✅ working | Seeds from prior week + profile. Saves on "Saved · step in". Monday + no checkin → auto-prompted via `goPath()`. |
| PathScreen | ✅ working | Time dial, muscle pills, mode cards. Passes banned list to `buildRoutine`. |
| ComposeScreen | ✅ working | Phased itinerary (warmup / main / core); SLOTS-correct finish time; coaching note. |
| DeepScreen | ✅ working | All timer state in a single `useRef` (zero stale closure issues). Per-exercise set pips. Exit double-tap confirm. Passes `completedSets` to `goCool()`. |
| CoolScreen | ✅ working | Arrive (breathing rings, centered labels) → Reflect (per-exercise sets breakdown, elapsed time) → Close (week dots, mood picker, note). Saves full session on step-out. |
| LogScreen | ✅ working | Real sessions, expandable accordion rows, inline mood+note editor, Save + Delete (double-tap confirm). 6-week dot grid, 4-week stats panel. Show all / show recent toggle. |
| RoomScreen | ✅ working | Inline profile editing (name, lastName, gym). Boundaries sheet: full exercise list, name-deduplicated, alias-aware banning. SaDock navigation. Live stats (visits, streak, days in). All prefs persist on toggle. |

---

## data flow

```
Onboarding → TonightScreen → [goPath()] → PathScreen
PathScreen → compile({ groups, mode, slotIdx, banned }) → ComposeScreen
ComposeScreen → goDeep() (stamps sessionStart) → DeepScreen
DeepScreen → goCool(completedSets) → CoolScreen (arrive → reflect → close)
CoolClose → store.saveSession({ groups, mode, slotIdx, label, duration, mood, note, completedSets }) → reset() → TonightScreen
```

---

## persistence (`src/data/store.js`)

- `localStorage` key: `sa-store-v1`
- Stored: `profile`, `prefs`, `checkins` (one per ISO week), `sessions`
- `profile.onboarded` — onboarding gate
- `profile.banned` — array of exercise keys excluded from all generated routines
- Derived on every load/save: `streak`, `daysIn`, `visits`, `lastVisitDaysAgo`, `recentHours`, `recentAvgMood`, `thisWeekCheckin`

---

## key architecture decisions

**DeepScreen timer** — all state (`idx`, `timeLeft`, `running`, `completed`) lives in a single `useRef`. One `setInterval` in a `useEffect([intervals])` reads only from the ref. Zero stale closure risk. Re-renders via a counter `useState(0)` incremented by `tick()`.

**Banned exercises** — `buildRoutine` in `exercises.js` accepts a `banned` array. It continues iterating through the pool until the per-group exercise target is met, skipping banned keys. `toggleBan` in RoomScreen uses `NAME_TO_KEYS` to also ban key aliases (e.g. `facePull` + `facePullSh` are the same movement; banning one bans both).

**Dock overlay** — `SaDock` and `SaFloatingDock` use `position: absolute; bottom: 0; background: var(--sa-bg-0)` (solid, not gradient). Content scrolls behind them. All scrollable containers have `paddingBottom: 88–100px`.

---

## files changed (this session)

```
src/App.jsx                         — OnboardingScreen gate; showOnboarding condition
src/hooks/useAppState.js            — completedSets state; goCool(csData); goPath(); goDeep(); banned→compile
src/data/store.js                   — DEFAULT_PROFILE: onboarded, banned; deleteSession(); updateSession()
src/data/exercises.js               — buildRoutine: banned filter; abs exercises carry .key
src/components/SanctuaryAtoms.jsx   — SaDock/SaFloatingDock: solid bg, absolute positioning
src/components/OnboardingScreen.jsx — NEW: 3-step onboarding flow
src/components/TonightScreen.jsx    — buildSuggestion(); goPath() on Begin
src/components/DeepScreen.jsx       — full rewrite: parseSets/parseRestSec/buildIntervals; useRef timer; completedSets
src/components/CoolScreen.jsx       — centered breathe labels; completedSets breakdown; handleClose passes data
src/components/LogScreen.jsx        — full rewrite: accordion expand; edit/delete; show all toggle
src/components/RoomScreen.jsx       — profile editing; Boundaries sheet; NAME_TO_KEYS alias banning; SaDock added
src/index.css                       — removed dead .sa-floating-dock class
```

**Deleted (dead legacy components):**
```
src/components/Dock.jsx
src/components/ExerciseRow.jsx
src/components/ExerciseCard.jsx
src/components/MeshBackground.jsx
src/components/ModeToggle.jsx
src/components/WorkoutBlock.jsx
```

---

## known issues / next steps

Nothing is blocking. Minor items for a future session:

- **Height/weight in onboarding** — step 1 only collects name and gym. Height and weight still default to the `DEFAULT_PROFILE` values (`5'10", 149 lb`). Could be added as optional fields in step 1.
- **Notification quiet row** — "9pm — 7am. Always." in RoomScreen Boundaries has a chevron but no sheet. Placeholder — wire to real notifications or remove.
- **CheckinScreen deeper integration** — checkin data (energy, soreness, etc.) is saved but not yet used by the suggestion engine or reflected in DeepScreen rest recommendations.
- **DeepScreen natural set completion** — sets are only counted when the timer naturally expires (not on skip). Tapping "done early" during a work interval doesn't credit the set. Could add a tap-to-complete gesture.

---

## deployment

GitHub → Actions → GitHub Pages. Push to `main` triggers build + deploy automatically.

```
git push origin main
```
