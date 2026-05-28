import React from 'react'
import { SaTopBar, SaDock, SaIcon, SaStat } from './SanctuaryAtoms'
import { SLOTS } from '../data/exercises'

const ALL_GROUPS   = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs']
const COMPOUND     = ['legs', 'chest', 'back', 'shoulders']

const ACHE_AVOIDS = {
  shoulders: ['shoulders'],
  lowback:   ['back'],
  midback:   ['back'],
  knees:     ['legs'],
  hips:      ['legs'],
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1) }

function sessionGroupCounts(sessions, n = 8) {
  const counts = {}
  ALL_GROUPS.forEach(g => { counts[g] = 0 })
  sessions.slice(0, n).forEach(s => {
    (s.groups || []).forEach(g => { counts[g] = (counts[g] || 0) + 1 })
  })
  return counts
}

function buildSuggestions(store) {
  const { sessions, prefs, stats, thisWeekCheckin } = store
  const prefMode = prefs.mode
  const counts   = sessionGroupCounts(sessions)

  // Ache avoidance
  const aches   = thisWeekCheckin?.aches || []
  const cleared = aches.includes('clear')
  const avoid   = cleared ? new Set() : new Set(aches.flatMap(a => ACHE_AVOIDS[a] || []))

  // Energy / sleep adjustment
  const arrived = thisWeekCheckin?.arrived
  const sleep   = thisWeekCheckin?.sleep ?? 2
  const tired   = arrived === 'tired' || arrived === 'wrecked' || sleep <= 1

  // ── Primary ──────────────────────────────────────────────────────────────
  const eligible     = ALL_GROUPS.filter(g => !avoid.has(g))
  const sortedAll    = [...eligible].sort((a, b) => counts[a] - counts[b])
  const primaryGroups = sessions.length === 0
    ? ['chest', 'back'].filter(g => !avoid.has(g))
    : sortedAll.slice(0, 2)

  const baseSlot    = stats.lastSession?.slotIdx ?? 3
  const primarySlot = tired ? Math.max(0, baseSlot - 1) : baseSlot
  const primaryMin  = SLOTS[Math.min(primarySlot, SLOTS.length - 1)]?.v ?? 60
  const primaryEffort = tired ? 'moderate' : prefMode === 'str' ? 'heavy' : 'medium'

  const primary = {
    groups:  primaryGroups,
    mode:    prefMode,
    slotIdx: primarySlot,
    minutes: primaryMin,
    effort:  primaryEffort,
    label:   primaryGroups.map(cap).join(' & '),
    body: tired
      ? 'Taking it easier tonight — your check-in asked for it.'
      : avoid.size > 0
        ? `Skipping ${[...avoid].join(' & ')} based on your check-in. `
          + 'These groups need the most attention.'
        : sessions.length === 0
          ? 'The classic foundations. A solid start.'
          : 'Least-trained groups from your recent history.',
  }

  // ── Short Reset ───────────────────────────────────────────────────────────
  const resetGroup = eligible.length > 0
    ? [...eligible].sort((a, b) => counts[a] - counts[b])[0]
    : 'shoulders'
  const resetSlot  = tired ? 0 : 1
  const shortReset = {
    groups:  [resetGroup],
    mode:    'def',
    slotIdx: resetSlot,
    minutes: SLOTS[resetSlot]?.v ?? 30,
    effort:  'low',
    label:   cap(resetGroup) + ', quick session',
    body:    'One group. Light work. In and out.',
  }

  // ── Strength Evening ──────────────────────────────────────────────────────
  const compoundEligible  = COMPOUND.filter(g => !avoid.has(g))
  const sortedCompound    = [...compoundEligible].sort((a, b) => counts[a] - counts[b])
  const strGroups = sortedCompound.length >= 2
    ? sortedCompound.slice(0, 2)
    : sortedCompound.length === 1
      ? [sortedCompound[0], eligible.find(g => g !== sortedCompound[0])].filter(Boolean)
      : ['chest', 'back']
  const strSlot = 4
  const strengthEvening = {
    groups:  strGroups,
    mode:    'str',
    slotIdx: strSlot,
    minutes: SLOTS[strSlot]?.v ?? 75,
    effort:  'heavy',
    label:   strGroups.map(cap).join(' & ') + ', strength',
    body:    'Compound movement. Full strength focus.',
  }

  return { primary, shortReset, strengthEvening }
}

export default function TonightScreen({ state }) {
  const { mode, setTab, store, goPath, beginWorkout } = state

  const now  = new Date()
  const hour = now.getHours()
  const tod  = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night'
  const ritual = {
    morning:   { greeting: 'Good morning.',   verb: 'wake'       },
    afternoon: { greeting: 'Good afternoon.', verb: 'reset'      },
    evening:   { greeting: 'Good evening.',   verb: 'decompress' },
    night:     { greeting: 'Good night.',     verb: 'unwind'     },
  }[tod]

  const { lastVisitDaysAgo } = store.stats
  const lastVisitText = lastVisitDaysAgo === null
    ? 'No visits yet. Make tonight the first.'
    : lastVisitDaysAgo === 0
    ? "You've already been in today."
    : `Last visit · ${lastVisitDaysAgo} ${lastVisitDaysAgo === 1 ? 'day' : 'days'} ago`

  const { primary, shortReset, strengthEvening } = buildSuggestions(store)

  const alts = [
    { ico: 'leaf',   config: shortReset,       label: shortReset.label,       sub: shortReset.body },
    { ico: 'flower', config: strengthEvening,  label: strengthEvening.label,  sub: strengthEvening.body },
  ]

  return (
    <div className="sa-app" data-sa-mode={mode}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sa-aura" />
      <SaTopBar mode={mode} onMenu={() => setTab('room')} />

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', paddingBottom: 88 }}>

        {/* Greeting */}
        <div style={{ padding: '40px 28px 0' }} className="sa-enter">
          <div className="sa-label" style={{ marginBottom: 14 }}>
            {now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <div className="sa-serif" style={{ fontSize: 38, marginBottom: 4 }}>
            {ritual.greeting}
          </div>
          <div className="sa-serif" style={{ fontSize: 38, color: 'var(--sa-ink-2)' }}>
            Time to <em style={{ fontStyle: 'italic', color: 'var(--sa-accent)' }}>{ritual.verb}.</em>
          </div>
        </div>

        {/* Streak at risk */}
        {store.stats.streak > 0 && store.stats.lastVisitDaysAgo === 1 && (
          <div className="sa-enter" style={{ padding: '20px 20px 0' }}>
            <div style={{
              padding: '14px 18px',
              border: '1px solid var(--sa-accent)',
              borderRadius: 16,
              background: 'var(--sa-accent-aura)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div className="sa-streak-dot" style={{ width: 6, height: 6, borderRadius: 100, background: 'var(--sa-accent)', flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 15, color: 'var(--sa-accent)', marginBottom: 2 }}>
                  {store.stats.streak}-day streak at risk
                </div>
                <div style={{ fontSize: 11, color: 'var(--sa-ink-2)' }}>Step in before midnight to keep it going.</div>
              </div>
            </div>
          </div>
        )}

        {/* Primary suggestion card */}
        <div style={{ padding: '32px 20px 0' }}>
          <div className="sa-panel sa-enter" style={{ animationDelay: '0.1s', padding: '28px 24px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <span className="sa-tag"><span className="dot" /> Tonight's path</span>
              <span className="sa-label" style={{ fontSize: 9 }}>SUGGESTED</span>
            </div>

            <div className="sa-serif-it" style={{ fontSize: 24, color: 'var(--sa-ink-1)', marginBottom: 8, lineHeight: 1.25 }}>
              {primary.minutes} min of {primary.mode === 'str' ? 'strength' : 'definition'}.<br/>
              {primary.label}, core.
            </div>
            <div style={{ fontSize: 13, color: 'var(--sa-ink-2)', lineHeight: 1.6, marginBottom: 22 }}>
              {primary.body}
            </div>

            <div style={{
              display: 'flex', gap: 0, marginBottom: 24,
              borderTop: '1px solid var(--sa-rule)',
              borderBottom: '1px solid var(--sa-rule)',
              padding: '16px 0',
            }}>
              <SaStat k="DURATION" v={String(primary.minutes)} sub="MIN" />
              <div style={{ width: 1, background: 'var(--sa-rule)' }} />
              <SaStat k="EFFORT" v={primary.effort} />
              <div style={{ width: 1, background: 'var(--sa-rule)' }} />
              <SaStat k="FOCUS" v={primary.groups[0]?.toLowerCase() || 'full'} />
            </div>

            <button className="sa-cta" onClick={() => beginWorkout(primary)}>
              Begin
              <span className="arrow"><SaIcon name="arrowSm" size={18} color="#14110e" /></span>
            </button>
          </div>
        </div>

        {/* Alternative paths */}
        <div className="sa-enter" style={{ padding: '24px 28px 0', animationDelay: '0.2s' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span className="sa-label">Or choose a different path</span>
          </div>

          {alts.map((opt, i) => (
            <div key={i} className="sa-tap" onClick={() => beginWorkout(opt.config)} style={{
              display: 'flex', alignItems: 'center',
              padding: '18px 4px',
              borderBottom: '1px solid var(--sa-rule)',
              gap: 16,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 100,
                background: 'var(--sa-bg-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid var(--sa-rule)',
                flexShrink: 0,
              }}>
                <SaIcon name={opt.ico} size={18} color="var(--sa-ink-2)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                  <div style={{ fontFamily: 'Newsreader, serif', fontWeight: 400, fontSize: 17, color: 'var(--sa-ink-1)' }}>
                    {opt.label}
                  </div>
                  <span style={{
                    fontSize: 8, fontFamily: 'var(--sa-mono-font, monospace)', letterSpacing: '0.08em',
                    color: 'var(--sa-accent)', background: 'var(--sa-accent-aura)',
                    padding: '2px 7px', borderRadius: 100,
                  }}>SUGGESTED</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--sa-ink-3)' }}>{opt.sub}</div>
              </div>
              <SaIcon name="chevR" size={14} color="var(--sa-ink-3)" />
            </div>
          ))}

          {/* Start from scratch */}
          <div className="sa-tap" onClick={() => goPath(primary.groups)} style={{
            display: 'flex', alignItems: 'center',
            padding: '18px 4px',
            gap: 16,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 100,
              background: 'var(--sa-bg-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid var(--sa-rule)',
              flexShrink: 0,
            }}>
              <SaIcon name="timer" size={18} color="var(--sa-ink-2)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Newsreader, serif', fontWeight: 400, fontSize: 17, color: 'var(--sa-ink-1)', marginBottom: 2 }}>
                Start from scratch
              </div>
              <div style={{ fontSize: 12, color: 'var(--sa-ink-3)' }}>Build a custom session in the compiler.</div>
            </div>
            <SaIcon name="chevR" size={14} color="var(--sa-ink-3)" />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '32px 28px 16px', textAlign: 'center', opacity: 0.65 }} className="sa-enter">
          <div className="sa-serif-it" style={{ fontSize: 13, color: 'var(--sa-ink-2)' }}>
            {lastVisitText}
          </div>
        </div>
      </div>

      <SaDock tab="tonight" onTab={(t) => setTab(t)} />
    </div>
  )
}
