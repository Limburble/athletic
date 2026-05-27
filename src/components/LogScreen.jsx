import React from 'react'
import { SaTopBar, SaDock, SaIcon, SaStat } from './SanctuaryAtoms'
import { dayKey, weekMonday } from '../data/store'

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
}

export default function LogScreen({ state }) {
  const { mode, setTab, store } = state
  const { sessions, stats } = store

  // ── Six-week dot grid ────────────────────────────────────────────────────
  const gridStart = weekMonday()
  gridStart.setDate(gridStart.getDate() - 35)  // go back 5 more weeks

  // Build a map: day-key → mode (last session wins if multiple in a day)
  const sessionDayMap = {}
  sessions.forEach(s => {
    const k = dayKey(new Date(s.timestamp))
    sessionDayMap[k] = s.mode
  })

  const todayKey = dayKey()

  // Sessions in the last 6 weeks for the frequency label
  const sixWeekStart  = gridStart.getTime()
  const sixWeekCount  = sessions.filter(s => s.timestamp >= sixWeekStart).length
  const perWeekAvg    = (sixWeekCount / 6).toFixed(1).replace(/\.0$/, '')

  return (
    <div className="sa-app" data-sa-mode={mode}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sa-aura" />
      <SaTopBar mode={mode} onMenu={() => setTab('room')} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px 8px' }}>

        {/* Header */}
        <div className="sa-enter">
          <div className="sa-label" style={{ marginBottom: 12 }}>THE LOG</div>
          <div className="sa-serif" style={{ fontSize: 38, lineHeight: 1, marginBottom: 4 }}>What you've</div>
          <div className="sa-serif" style={{ fontSize: 38, lineHeight: 1, color: 'var(--sa-ink-2)' }}>
            <em style={{ fontStyle: 'italic', color: 'var(--sa-accent)' }}>kept up with.</em>
          </div>
        </div>

        <div style={{ height: 32 }} />

        {/* Summary panel */}
        <div className="sa-panel sa-enter" style={{ padding: '24px 18px', marginBottom: 24, animationDelay: '0.1s' }}>
          <div className="sa-label" style={{ fontSize: 9, textAlign: 'center', marginBottom: 16 }}>THE PAST FOUR WEEKS</div>
          <div style={{ display: 'flex', gap: 0 }}>
            <SaStat k="VISITS" v={String(stats.recentVisits)}                                                   light />
            <div style={{ width: 1, background: 'var(--sa-rule)' }} />
            <SaStat k="HOURS"  v={stats.recentHours > 0 ? String(stats.recentHours) : '0'}                     light />
            <div style={{ width: 1, background: 'var(--sa-rule)' }} />
            <SaStat k="AVG MOOD" v={stats.recentAvgMood ? capitalize(stats.recentAvgMood) : '—'}               light />
          </div>
        </div>

        {/* Six-week dot grid */}
        <div className="sa-enter" style={{ marginBottom: 36, animationDelay: '0.15s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <span className="sa-label">SIX-WEEK PATTERN</span>
            <span className="sa-label" style={{ color: 'var(--sa-ink-3)' }}>
              {sixWeekCount > 0 ? `${perWeekAvg} / WEEK` : 'NO SESSIONS YET'}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
            {/* Day headers */}
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <div key={'h' + i} className="sa-label" style={{ fontSize: 9, textAlign: 'center', color: 'var(--sa-ink-4)' }}>{d}</div>
            ))}
            {/* 42 day cells */}
            {Array.from({ length: 42 }).map((_, i) => {
              const cellDate = new Date(gridStart)
              cellDate.setDate(cellDate.getDate() + i)
              cellDate.setHours(0, 0, 0, 0)
              const cellKey  = cellDate.getTime()
              const cellMode = sessionDayMap[cellKey]
              const has      = !!cellMode
              const isToday  = cellKey === todayKey
              const isFuture = cellKey > todayKey
              const accent   = cellMode === 'str' ? 'var(--sa-str)' : 'var(--sa-def)'
              const aura     = cellMode === 'str' ? 'var(--sa-str-glow)' : 'var(--sa-def-glow)'
              return (
                <div key={i} style={{
                  aspectRatio: '1', borderRadius: 100,
                  background: has && isToday ? accent : 'transparent',
                  border: `1px solid ${has ? accent : 'var(--sa-rule)'}`,
                  boxShadow: isToday && has ? `0 0 14px ${aura}` : 'none',
                  opacity: isFuture ? 0.25 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}>
                  {has && !isToday && (
                    <div style={{ width: 4, height: 4, borderRadius: 100, background: accent, opacity: 0.7 }} />
                  )}
                  {isToday && !has && (
                    <div style={{ width: 4, height: 4, borderRadius: 100, background: 'var(--sa-ink-3)', opacity: 0.5 }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent visits */}
        <div className="sa-enter" style={{ animationDelay: '0.2s' }}>
          <div className="sa-label" style={{ marginBottom: 14 }}>RECENT VISITS</div>

          {sessions.length === 0 ? (
            <div style={{
              padding: '48px 0', textAlign: 'center',
              border: '1px solid var(--sa-rule)', borderRadius: 22,
            }}>
              <div className="sa-serif-it" style={{ fontSize: 18, color: 'var(--sa-ink-3)', marginBottom: 10 }}>
                Nothing here yet.
              </div>
              <div style={{ fontSize: 13, color: 'var(--sa-ink-4)', lineHeight: 1.5 }}>
                Complete a session and it'll appear.
              </div>
            </div>
          ) : (
            sessions.slice(0, 12).map((e, i, arr) => {
              const d       = new Date(e.timestamp)
              const dayNum  = d.getDate()
              const dow     = d.toLocaleDateString('en-US', { weekday: 'short' })
              const month   = d.toLocaleDateString('en-US', { month: 'short' })
              const isToday = dayKey(d) === todayKey
              return (
                <div key={e.id || i} className="sa-tap" style={{
                  display: 'flex', gap: 16, padding: '16px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--sa-rule)' : 'none',
                  alignItems: 'flex-start',
                }}>
                  {/* Date column */}
                  <div style={{ textAlign: 'center', width: 52, flexShrink: 0 }}>
                    <div className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-3)', marginBottom: 2 }}>{dow.toUpperCase()}</div>
                    <div style={{ fontFamily: 'Newsreader, serif', fontWeight: 300, fontSize: 32, lineHeight: 1, color: isToday ? 'var(--sa-accent)' : 'var(--sa-ink-1)' }}>
                      {dayNum}
                    </div>
                    <div className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-3)', marginTop: 2 }}>{month.toUpperCase()}</div>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 100, background: e.mode === 'def' ? 'var(--sa-def)' : 'var(--sa-str)', flexShrink: 0 }} />
                      <span className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-2)' }}>
                        {e.mode === 'def' ? 'DEFINITION' : 'STRENGTH'}
                      </span>
                      {isToday && <span className="sa-serif-it" style={{ fontSize: 11, color: 'var(--sa-accent)' }}>· tonight</span>}
                    </div>
                    <div style={{ fontFamily: 'Newsreader, serif', fontWeight: 400, fontSize: 17, color: 'var(--sa-ink-1)', marginBottom: 4, letterSpacing: '-0.005em' }}>
                      {e.label || (e.groups?.length > 0 ? e.groups.map(g => capitalize(g)).join(' & ') : 'Full body')}
                    </div>
                    {e.note && (
                      <div className="sa-serif-it" style={{ fontSize: 13, color: 'var(--sa-ink-2)', lineHeight: 1.4 }}>
                        "{e.note}"
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'Newsreader, serif', fontWeight: 300, fontSize: 16, color: 'var(--sa-ink-1)' }}>
                      {e.duration || '—'}<span style={{ color: 'var(--sa-ink-3)', fontSize: 12 }}>{e.duration ? 'm' : ''}</span>
                    </div>
                    {e.mood && (
                      <div className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-3)', marginTop: 2 }}>{e.mood.toUpperCase()}</div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Archive link — only show if there's more than 12 sessions */}
        {sessions.length > 12 && (
          <div className="sa-enter sa-tap" style={{
            marginTop: 22, padding: '16px 24px', borderRadius: 100,
            border: '1px solid var(--sa-rule-hi)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            animationDelay: '0.3s',
          }}>
            <span className="sa-serif-it" style={{ fontSize: 14, color: 'var(--sa-ink-2)' }}>The full archive</span>
            <SaIcon name="arrowSm" size={14} color="var(--sa-ink-2)" />
          </div>
        )}

        <div style={{ height: 24 }} />
      </div>

      <SaDock tab="log" onTab={(t) => setTab(t)} />
    </div>
  )
}
