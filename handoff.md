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

Nothing is blocking. Potential future improvements:

- **Push notifications** — native reminder when streak is at risk (requires PWA manifest + service worker)
- **Weight progression tracking** — log actual weight lifted per set in DeepScreen, surface trends in LogScreen
- **Rest timer customization** — allow per-exercise rest overrides in RoomScreen
- **Workout history replay** — tap any past session in LogScreen to view its full itinerary
- **Export** — CSV or PDF of session history
