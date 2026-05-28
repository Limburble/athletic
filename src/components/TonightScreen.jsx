import React from 'react'
import { SaTopBar, SaDock, SaIcon, SaStat } from './SanctuaryAtoms'
import { SLOTS } from '../data/exercises'

const ALL_GROUPS = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs']

function buildSuggestion(store) {
  const { sessions, prefs, stats } = store
  const mode = prefs.mode

  // Find least-recently-trained groups from last 6 sessions
  const groupCounts = {}
  ALL_GROUPS.forEach(g => { groupCounts[g] = 0 })
  sessions.slice(0, 6).forEach(s => {
    (s.groups || []).forEach(g => { groupCounts[g] = (groupCounts[g] || 0) + 1 })
  })
  const sorted = [...ALL_GROUPS].sort((a, b) => groupCounts[a] - groupCounts[b])
  const groups = sessions.length === 0
    ? ['chest', 'back']
    : sorted.slice(0, 2)

  const slotIdx  = stats.lastSession?.slotIdx ?? 3
  const minutes  = SLOTS[Math.min(slotIdx, SLOTS.length - 1)]?.v ?? 60
  const effort   = mode === 'str' ? 'heavy' : 'medium'
  const modeLabel = mode === 'str' ? 'strength' : 'definition'
  const groupLabel = groups.map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(' & ')

  return { groups, slotIdx, minutes, effort, modeLabel, groupLabel, mode }
}

export default function TonightScreen({ state }) {
  const { mode, setTab, store, goPath } = state

  const now  = new Date()
  const hour = now.getHours()
  const tod  = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night'
  const ritual = {
    morning:   { greeting: 'Good morning.',   verb: 'wake',       body: 'The room is bright.' },
    afternoon: { greeting: 'Good afternoon.', verb: 'reset',      body: 'A moment to step out.' },
    evening:   { greeting: 'Good evening.',   verb: 'decompress', body: 'The day is long enough.' },
    night:     { greeting: 'Good night.',     verb: 'unwind',     body: 'The room is warm.' },
  }[tod]

  const { lastVisitDaysAgo } = store.stats
  const lastVisitText = lastVisitDaysAgo === null
    ? 'No visits yet. Make tonight the first.'
    : lastVisitDaysAgo === 0
    ? "You've already been in today."
    : `Last visit · ${lastVisitDaysAgo} ${lastVisitDaysAgo === 1 ? 'day' : 'days'} ago`

  const sug = buildSuggestion(store)

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

        {/* Suggested card */}
        <div style={{ padding: '32px 20px 0' }}>
          <div className="sa-panel sa-enter" style={{ animationDelay: '0.1s', padding: '28px 24px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <span className="sa-tag"><span className="dot" /> Tonight's path</span>
              <span className="sa-label" style={{ fontSize: 9 }}>SUGGESTED</span>
            </div>

            <div className="sa-serif-it" style={{ fontSize: 24, color: 'var(--sa-ink-1)', marginBottom: 8, lineHeight: 1.25 }}>
              {sug.minutes} min of {sug.modeLabel}.<br/>{sug.groupLabel}, core.
            </div>
            <div style={{ fontSize: 13, color: 'var(--sa-ink-2)', lineHeight: 1.6, marginBottom: 22 }}>
              {ritual.body} Based on what you've trained recently.
              {store.sessions.length === 0 ? ' A solid first session.' : ' These groups need the most attention.'}
            </div>

            <div style={{
              display: 'flex', gap: 0, marginBottom: 24,
              borderTop: '1px solid var(--sa-rule)',
              borderBottom: '1px solid var(--sa-rule)',
              padding: '16px 0',
            }}>
              <SaStat k="DURATION" v={String(sug.minutes)} sub="MIN" />
              <div style={{ width: 1, background: 'var(--sa-rule)' }} />
              <SaStat k="EFFORT" v={sug.effort} />
              <div style={{ width: 1, background: 'var(--sa-rule)' }} />
              <SaStat k="FOCUS" v={sug.groupLabel.split(' & ')[0].toLowerCase()} />
            </div>

            <button className="sa-cta" onClick={goPath}>
              Begin
              <span className="arrow"><SaIcon name="arrowSm" size={18} color="#14110e" /></span>
            </button>
          </div>
        </div>

        {/* Alternatives */}
        <div className="sa-enter" style={{ padding: '24px 28px 0', animationDelay: '0.2s' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span className="sa-label">Or compose your own</span>
            <span className="sa-label" style={{ color: 'var(--sa-ink-3)' }}>3 OPTIONS</span>
          </div>

          {[
            { ico: 'leaf',   t: 'A short reset',    s: '20 minutes · low effort · core only',   onClick: goPath },
            { ico: 'flower', t: 'Strength evening',  s: '75 minutes · heavy compound · legs',    onClick: goPath },
            { ico: 'timer',  t: 'Check-in first',    s: 'Rate your body before composing',        onClick: () => setTab('checkin') },
          ].map((opt, i) => (
            <div key={i} className="sa-tap" onClick={opt.onClick} style={{
              display: 'flex', alignItems: 'center',
              padding: '18px 4px',
              borderBottom: i < 2 ? '1px solid var(--sa-rule)' : 'none',
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
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Newsreader, serif', fontWeight: 400, fontSize: 17, color: 'var(--sa-ink-1)', marginBottom: 2 }}>
                  {opt.t}
                </div>
                <div style={{ fontSize: 12, color: 'var(--sa-ink-3)' }}>{opt.s}</div>
              </div>
              <SaIcon name="chevR" size={14} color="var(--sa-ink-3)" />
            </div>
          ))}
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
