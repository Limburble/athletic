# Design System — Athletic Sanctuary

## Tokens

### Color
- `--sa-bg-0` #14110e — deepest background
- `--sa-bg-1` #1c1814 — surface
- `--sa-bg-2` #25201a — elevated panel
- `--sa-bg-3` #2e2820 — highest elevation
- `--sa-bg-elev` #1a1612 — inset/recessed
- `--sa-ink-1` #ece4d0 — primary text (parchment)
- `--sa-ink-2` #b4ab94 — secondary text
- `--sa-ink-3` #756d5d — tertiary / labels
- `--sa-ink-4` #4b443a — disabled / very dim
- `--sa-rule` rgba(236,228,208,0.07) — hairline dividers
- `--sa-rule-hi` rgba(236,228,208,0.16) — prominent borders

### Accents (mode-switched)
- Definition (def): `--sa-def` #9eb287 — sage green
- Strength (str): `--sa-str` #e0b67c — amber
- Cool down: `--sa-cool` #8aa9c4 — slate blue
- `--sa-accent` maps to active mode

### Easing
- `--sa-settle` cubic-bezier(0.16, 1, 0.3, 1) — ease-out-expo: confident, decisive
- `--sa-breathe` cubic-bezier(0.45, 0, 0.55, 1) — sinusoidal for ambient loops

## Typography

### Families
- `Newsreader` (serif, 200–700, italic) — all headings, large numerals, display copy, CTAs, editorial voice
- `Geist` (sans, 200–600) — labels, body copy, UI chrome
- `Geist Mono` (mono, 300–400) — timers, reps, stats

### Voices
- `.sa-serif` — weight 300, letter-spacing -0.02em, opsz 72
- `.sa-serif-it` — italic weight 300, letter-spacing -0.01em
- `.sa-label` — Geist 10px, weight 400, tracking 0.24em, uppercase
- `.sa-mono` — Geist Mono, letter-spacing 0

## Components

### Panels (`.sa-panel`)
- 28px border-radius, gradient inner top, deep box-shadow
- Transition: all 0.8s settle

### Pills (`.sa-pill`)
- 100px border-radius, 12px 18px padding
- On state: accent background, accent border
- Active: scale(0.985)

### CTA (`.sa-cta`)
- Full-width, 20px Newsreader italic, 100px border-radius
- Background: accent, text: #14110e
- Active: scale(0.985), arrow slides right on hover

### Tag (`.sa-tag`)
- Geist 11px, tracking 0.18em, uppercase
- Dot: 6px circle, accent color, glow shadow

### `.sa-tap`
- Cursor pointer, opacity transition, active: opacity 0.6

## Motion

### Keyframes
- `sa-breathe-a/b` — ambient aura orbs (14s/18s alternate)
- `sa-fade-up` — entrance: opacity 0→1 + translateY 8→0
- `sa-breath` — subtle opacity pulse
- `sa-breath-cycle` — breathing ring scale animation (CoolScreen)

### Classes
- `.sa-enter` — triggers sa-fade-up on mount
- `.sa-breathing` — continuous breath pulse

### Easing target
- ease-out-expo (--sa-settle) for all intentional UI transitions
- Durations: 150ms (feedback) → 300ms (state change) → 600ms (entrance)

## Film Grain
Applied via `.sa-app::after` — SVG turbulence noise, `mix-blend-mode: screen`

## Aura Orbs
`.sa-aura::before/after` — blurred circles at top-left / bottom-right, breathing on alternate cycles, color matches mode accent
