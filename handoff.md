# goal

Build Athletic Sanctuary — a warm, Newsreader-typeset, mobile-first workout app (430px max-width) that feels like a private room rather than a fitness tracker. The design language is editorial minimalism: near-black `#14110e`, parchment accents, breathing aura orbs, film grain, and a full CSS token system that switches between Definition (gold) and Strength (amber) modes. The app accumulates real data over time — check-ins, session logs, streaks — so it genuinely knows the user.

---

# current state (v4 — production-ready)

**Build:** clean. Zero console errors. `npm run dev` → `http://localhost:5173`.

**Every screen is live and data-connected.** Sessions persist to `localStorage`, banned exercises are respected by the workout generator, stats update in real time, and the suggestion engine learns from history.

---

## screens

| Screen | Status | Notes |
|---|---|---|
| OnboardingScreen | ✅ working | 3-step: welcome → name+gym+body stats → mode. Sets `profile.onboarded = true`. |
| TonightScreen | ✅ working | 3 smart suggestions + streak-at-risk banner. "Start from scratch" seeds PathScreen with suggested groups. |
| CheckinScreen | ✅ working | Mandatory before every workout. Saves once per ISO week. On save → ConfirmScreen. |
| ConfirmScreen | ✅ working | Pre-workout summary: groups, duration, effort, mode. "Let's go" → ComposeScreen. |
| PathScreen | ✅ working | Custom compiler — time dial, muscle pills, mode cards. Pre-seeded when coming from "Start from scratch". |
| ComposeScreen | ✅ working | Phased itinerary (warmup / main / core). All exercise rows have expandable (i) info panels with science-backed form cues. |
| DeepScreen | ✅ working | Left-aligned editorial layout. Set tracker (no countdown during work). Bare "i form cue" link expands inline. Square set markers (no ovals). Rest timer between sets. |
| CoolScreen | ✅ working | Arrive → Reflect → Close. Saves full session. |
| LogScreen | ✅ working | Real sessions, expandable rows, repeat-session button, checkin trends panel (sleep/energy bars). |
| RoomScreen | ✅ working | Inline profile editing, exercise banning, live stats. |

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

TonightScreen → "Start from scratch" → PathScreen (seeded with suggested groups) → ComposeScreen
LogScreen → "Repeat this session" → beginWorkout(session config) → same flow
```

---

## suggestion algorithm (`TonightScreen.jsx`)

Three suggestions from `buildSuggestions(store)` on every render:

**Primary** — Reads last 8 sessions for least-trained muscle pairs. Adjusts for checkin:
- Aches (`shoulders/lowback/midback/knees/hips`) → skips those groups
- `arrived: tired/wrecked` or `sleep ≤ 1` → reduces slot by 1, effort drops to 'moderate'
- `sessions.length === 0` → defaults to chest + back

**Short Reset** — Single least-trained group, 15–30 min, def mode, low effort.

**Strength Evening** — Two least-trained compound groups (legs/chest/back/shoulders), 75 min, str mode, heavy.

---

## DeepScreen layout (`src/components/DeepScreen.jsx`)

Editorial work view — left-aligned, no pill chrome, no centered stack:

- **EXERCISE N OF M** — small mono label, top left
- **exercise name.** — large italic serif, left-aligned (34px)
- **i form cue** — bare italic text link (no pill, no border). Tap to expand inline form instructions between top/bottom rules. Color transitions to accent when open.
- **Sa-rule separator**
- **Set N of M** — serif text left; square set markers (8×8, borderRadius: 2) right. Active marker glows, completed markers dim. No scaleX stretching.
- **N reps · Xs rest** — bare mono text, no background pill
- **Checkmark button** — 88px circle, centered in remaining flex space. Fires `sa-set-pop` animation on tap.
- **skip set** — bare italic below checkmark

**Rest phase**: full-screen countdown in 180px serif, italic "set X of Y up next" or "next · exercise", Pause + Skip rest.

**Done phase**: oversized ✓, "you can let go.", "Cool down →".

Rest time = `parseRestSec(spec) × restFactor` where `restFactor = 0.7` for single-group, `1.0` for multi-group.

---

## form cues (`src/data/exercises.js`)

Every exercise and warmup item has an `i` field with science-backed form instructions. Exposed via expandable (i) panels in:

- **ComposeScreen** — circular `i` button on each itinerary row. Turns gold when open. AnimatePresence slide-in panel.
- **DeepScreen** — bare "i form cue" link below exercise name. Expands inline with editorial rule borders.

---

## polish/animation system (`src/index.css`)

Key additions over baseline:

```css
/* Easing */
--sa-settle: cubic-bezier(0.16, 1, 0.3, 1)   /* expo ease-out, all transitions */
--sa-breathe: cubic-bezier(0.45, 0, 0.55, 1)  /* breathing animations */

/* Keyframes */
sa-fade-up      — entrance (0.65s, was 1.2s)
sa-set-pop      — checkmark tap: scale dip → spring back with glow
sa-glow-pulse   — box-shadow pulse
sa-streak-pulse — dot breathing for streak-at-risk banner

/* Classes */
.sa-streak-dot  — 2.4s pulse animation on streak danger dot
.sa-enter       — 0.65s fade-up entrance (faster than original)

/* Hover/focus */
.sa-tap:hover         opacity 0.82
.sa-cta:hover         glow box-shadow
:focus-visible        1.5px accent outline

/* Accessibility */
@media (prefers-reduced-motion) — disables all animations/transitions
```

Progress bars and set pips all use `transform: scaleX()` + `transformOrigin: left` instead of animating `width`, avoiding layout thrash.

---

## persistence (`src/data/store.js`)

- `localStorage` key: `sa-store-v1`
- Stored: `profile`, `prefs`, `checkins` (one per ISO week), `sessions`
- `profile.onboarded` — onboarding gate
- `profile.banned` — exercise keys excluded from all generated routines
- Derived: `streak`, `daysIn`, `visits`, `lastVisitDaysAgo`, `recentHours`, `recentAvgMood`, `thisWeekCheckin`

---

## key architecture decisions

**Workout flow state** — `useAppState` holds `pendingConfig`, `workoutSource` ('path' | 'confirm'), and `pathSeedGroups`. `beginWorkout(config)` always routes through checkin. `goPath(seedGroups)` seeds PathScreen groups before switching tab.

**DeepScreen state** — All timer state in a single `useRef`. `setInterval` only ticks during rest phase. Re-renders via `useState(0)` counter. `showInfo` resets to `false` on exercise advance.

**Banned exercises** — `buildRoutine` accepts `banned` array. `toggleBan` uses `NAME_TO_KEYS` for alias awareness.

**Dock overlays** — `SaDock` / `SaFloatingDock` use `linear-gradient(transparent → var(--sa-bg-0))` so content scrolls underneath.

---

## files changed (v4 session)

```
src/hooks/useAppState.js            — pathSeedGroups state, goPath(seedGroups), reset cleanup
src/components/TonightScreen.jsx    — streak-at-risk banner, goPath(primary.groups) for scratch
src/components/PathScreen.jsx       — reads pathSeedGroups as initial groups state
src/components/ComposeScreen.jsx    — SaItineraryRow with (i) expand via AnimatePresence
src/components/DeepScreen.jsx       — full layout redesign: left-aligned, no ovals, square markers, bare form cue
src/components/LogScreen.jsx        — repeat session button, checkin trends panel with scaleX sleep bars
src/index.css                       — sa-set-pop, sa-streak-pulse, sa-glow-pulse, hover states, focus-visible, reduced-motion
PRODUCT.md                          — created: brand/product context for design system
DESIGN.md                           — created: full token, typography, and motion documentation
```

---

## deployment

GitHub → Vercel. Push to `main` triggers build + deploy automatically.

```
git push origin main
```

---

## known issues / next steps

---

### 🔜 Next: Gym hours + home/gym state

Allow the user to set custom gym open/close times. When the gym is closed the app switches to a **home mode** — bodyweight/no-equipment workouts only — and returns to the normal gym state when it reopens. A live open/closed indicator on TonightScreen replaces the current "sauna is still open" copy.

---

#### Data

Add to `profile` in `src/data/store.js`:

```js
gymOpen:  '05:30',   // 24h HH:MM strings
gymClose: '22:00',
gymDays:  [1,2,3,4,5,6,0],  // JS getDay() — default every day
```

Add a derived bool to `buildStore` / `computeStats`:

```js
gymIsOpen: isGymOpen(profile)   // recomputed on every render
```

```js
function isGymOpen({ gymOpen, gymClose, gymDays }) {
  const now = new Date()
  if (!gymDays.includes(now.getDay())) return false
  const [oh, om] = gymOpen.split(':').map(Number)
  const [ch, cm] = gymClose.split(':').map(Number)
  const mins = now.getHours() * 60 + now.getMinutes()
  return mins >= oh * 60 + om && mins < ch * 60 + cm
}
```

---

#### Home mode workout pool

Add a `HOME_POOL` to `src/data/exercises.js` — bodyweight-only exercises keyed by muscle group. Mirror the shape of `DEF_POOL` / `STR_POOL`. Examples:

```js
export const HOME_POOL = {
  chest:     [['pushUp', 3, '12–15'], ['widePushUp', 3, '10–12'], ['dipsChair', 3, '10']],
  back:      [['invRow', 3, '10–12'], ['superhero', 3, '12']],
  legs:      [['squat', 3, '15–20'], ['lunge', 3, '12ea'], ['wallSit', 3, '45s']],
  shoulders: [['pikePushUp', 3, '10–12'], ['lateralRaise', 3, '15']],  // bands ok
  abs:       [['plank', 3, '45s'], ['mountainClimber', 3, '20'], ['sidePlank', 3, '30s']],
  ...
}
```

Add form cues + `EX_MUSCLES` entries for each new key.

---

#### Workout generation

In `buildRoutine` (`src/data/exercises.js` or wherever it lives), thread through a `useHome` flag:

```js
buildRoutine({ groups, slots, useHome: !gymIsOpen })
// → picks from HOME_POOL instead of DEF_POOL / STR_POOL when true
```

`buildSuggestions` in `TonightScreen.jsx` already reads `store` — pass `gymIsOpen` down and swap the pool source there too.

---

#### TonightScreen — open/closed indicator

Replace the "sauna is still open" / ambient copy block with a dynamic gym status chip:

```jsx
// Gym status chip — top of TonightScreen below the top bar
<div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 24px', marginBottom: 4 }}>
  <span style={{
    width: 7, height: 7, borderRadius: '50%',
    background: gymIsOpen ? 'var(--sa-def)' : 'var(--sa-ink-4)',
    boxShadow: gymIsOpen ? '0 0 8px var(--sa-def-glow)' : 'none',
  }} />
  <span style={{ fontSize: 12, color: 'var(--sa-ink-3)', fontFamily: 'Geist, sans-serif' }}>
    {gymIsOpen ? `${profile.gym} is open` : `${profile.gym} is closed · home session`}
  </span>
</div>
```

When `!gymIsOpen`, the suggestion cards should label themselves "Home" instead of the mode name, and the effort/duration defaults can shift to bodyweight-appropriate ranges.

---

#### RoomScreen — gym hours settings

Add a new **"Your gym"** `RoomSection` with:

- Gym name (already editable in the athlete card — can cross-link or duplicate)
- Open time picker — `<input type="time">` styled to match `sa-textarea`
- Close time picker — same
- Days of week toggles — 7 pill buttons (M T W T F S S), multi-select, active = `on` style

Save on blur/change via `store.updateProfile({ gymOpen, gymClose, gymDays })`.

---

#### Suggested implementation order

1. `store.js` — add fields + `isGymOpen` helper + `gymIsOpen` in derived stats
2. `exercises.js` — add `HOME_POOL` + exercise entries + `EX_MUSCLES` for new keys
3. `buildRoutine` — accept + use `useHome` flag
4. `TonightScreen` — swap suggestions source + add open/closed chip
5. `RoomScreen` — gym hours section
6. Test: set close time to now → confirm home pool loads → advance time → confirm gym pool returns

---

### Other potential improvements

- **Push notifications** — native reminder when streak is at risk (requires PWA manifest + service worker)
- **Weight progression tracking** — log actual weight lifted per set in DeepScreen, surface trends in LogScreen
- **Rest timer customization** — allow per-exercise rest overrides in RoomScreen
- **Workout history replay** — tap any past session in LogScreen to view its full itinerary
- **Export** — CSV or PDF of session history
