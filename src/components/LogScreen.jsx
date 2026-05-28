import React, { useState } from 'react'
import { SaTopBar, SaDock, SaIcon, SaStat } from './SanctuaryAtoms'
import { dayKey, weekMonday } from '../data/store'

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : '' }

export default function LogScreen({ state }) {
  const { mode, setTab, store, beginWorkout } = state
  const { sessions, stats } = store

  const [expandedId,   setExpandedId]   = useState(null)
  const [editMood,     setEditMood]     = useState({})
  const [editNote,     setEditNote]     = useState({})
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [showAll,      setShowAll]      = useState(false)

  // Six-week dot grid
  const gridStart = weekMonday()
  gridStart.setDate(gridStart.getDate() - 35)

  const sessionDayMap = {}
  sessions.forEach(s => {
    const k = dayKey(new Date(s.timestamp))
    sessionDayMap[k] = s.mode
  })

  const todayKey      = dayKey()
  const sixWeekStart  = gridStart.getTime()
  const sixWeekCount  = sessions.filter(s => s.timestamp >= sixWeekStart).length
  const perWeekAvg    = (sixWeekCount / 6).toFixed(1).replace(/\.0$/, '')

  function toggleExpand(session) {
    if (expandedId === session.id) {
      setExpandedId(null)
    } else {
      setExpandedId(session.id)
      setEditMood(prev => ({ ...prev, [session.id]: session.mood || null }))
      setEditNote(prev => ({ ...prev, [session.id]: session.note || '' }))
    }
  }

  function saveEdit(id) {
    store.updateSession(id, { mood: editMood[id], note: editNote[id] })
    setExpandedId(null)
  }

  function handleDelete(id) {
    if (deleteConfirm === id) {
      store.deleteSession(id)
      setExpandedId(null)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(dc => dc === id ? null : dc), 3000)
    }
  }

  const moods = ['heavy', 'steady', 'light', 'clear']
  const displayed = showAll ? sessions : sessions.slice(0, 12)

  return (
    <div className="sa-app" data-sa-mode={mode}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sa-aura" />
      <SaTopBar mode={mode} onMenu={() => setTab('room')} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px 96px' }}>

        {/* Header */}
        <div className="sa-enter">
          <div className="sa-label" style={{ marginBottom: 12 }}>THE LOG</div>
          <div className="sa-serif" style={{ fontSize: 38, lineHeight: 1, marginBottom: 4 }}>What you've</div>
          <div className="sa-serif" style={{ fontSize: 38, lineHeight: 1, color: 'var(--sa-ink-2)' }}>
            <em style={{ fontStyle: 'italic', color: 'var(--sa-accent)' }}>kept up with.</em>
          </div>
        </div>

        <div style={{ height: 32 }} />

        {/* 4-week summary */}
        <div className="sa-panel sa-enter" style={{ padding: '24px 18px', marginBottom: 24, animationDelay: '0.1s' }}>
          <div className="sa-label" style={{ fontSize: 9, textAlign: 'center', marginBottom: 16 }}>THE PAST FOUR WEEKS</div>
          <div style={{ display: 'flex', gap: 0 }}>
            <SaStat k="VISITS"   v={String(stats.recentVisits)} light />
            <div style={{ width: 1, background: 'var(--sa-rule)' }} />
            <SaStat k="HOURS"    v={stats.recentHours > 0 ? String(stats.recentHours) : '0'} light />
            <div style={{ width: 1, background: 'var(--sa-rule)' }} />
            <SaStat k="AVG MOOD" v={stats.recentAvgMood ? capitalize(stats.recentAvgMood) : '—'} light />
          </div>
        </div>

        {/* Checkin trends */}
        {store.checkins.length > 0 && (() => {
          const sleepLabels = ['Rough', 'Restless', 'Okay', 'Solid', 'Deep']
          const arrivedColor = { rested: 'var(--sa-cool)', even: 'var(--sa-ink-2)', tired: 'var(--sa-str)', wrecked: 'var(--sa-str)' }
          const sorted = [...store.checkins].sort((a, b) => b.weekKey.localeCompare(a.weekKey)).slice(0, 6)
          return (
            <div className="sa-panel sa-enter" style={{ padding: '24px 18px', marginBottom: 24, animationDelay: '0.15s' }}>
              <div className="sa-label" style={{ fontSize: 9, textAlign: 'center', marginBottom: 16 }}>CHECK-IN TRENDS</div>
              {sorted.map((c, i) => {
                const d = new Date(c.date)
                const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()
                const sleepVal = c.sleep ?? 2
                return (
                  <div key={c.weekKey} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 0',
                    borderBottom: i < sorted.length - 1 ? '1px solid var(--sa-rule)' : 'none',
                  }}>
                    <div className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-3)', width: 52, flexShrink: 0 }}>
                      {dateStr}
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 3, background: 'var(--sa-bg-2)', borderRadius: 100, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: '100%',
                          background: 'var(--sa-accent)', borderRadius: 100,
                          transform: `scaleX(${sleepVal / 4})`,
                          transformOrigin: 'left',
                          transition: 'transform 0.9s var(--sa-settle)',
                        }} />
                      </div>
                      <span className="sa-label" style={{ fontSize: 8, color: 'var(--sa-ink-3)', width: 44, flexShrink: 0 }}>
                        {sleepLabels[sleepVal].toUpperCase()}
                      </span>
                    </div>
                    {c.arrived && (
                      <span style={{
                        fontSize: 8, fontFamily: 'var(--sa-mono-font, monospace)', letterSpacing: '0.05em',
                        color: arrivedColor[c.arrived] || 'var(--sa-ink-3)',
                        width: 46, textAlign: 'right', flexShrink: 0,
                      }}>
                        {c.arrived.toUpperCase()}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })()}

        {/* Six-week dot grid */}
        <div className="sa-enter" style={{ marginBottom: 36, animationDelay: '0.15s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <span className="sa-label">SIX-WEEK PATTERN</span>
            <span className="sa-label" style={{ color: 'var(--sa-ink-3)' }}>
              {sixWeekCount > 0 ? `${perWeekAvg} / WEEK` : 'NO SESSIONS YET'}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <div key={'h'+i} className="sa-label" style={{ fontSize: 9, textAlign: 'center', color: 'var(--sa-ink-4)' }}>{d}</div>
            ))}
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
                  {has && !isToday && <div style={{ width: 4, height: 4, borderRadius: 100, background: accent, opacity: 0.7 }} />}
                  {isToday && !has && <div style={{ width: 4, height: 4, borderRadius: 100, background: 'var(--sa-ink-3)', opacity: 0.5 }} />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Session list */}
        <div className="sa-enter" style={{ animationDelay: '0.2s' }}>
          <div className="sa-label" style={{ marginBottom: 14 }}>RECENT VISITS</div>

          {sessions.length === 0 ? (
            <div style={{ padding: '48px 0', textAlign: 'center', border: '1px solid var(--sa-rule)', borderRadius: 22 }}>
              <div className="sa-serif-it" style={{ fontSize: 18, color: 'var(--sa-ink-3)', marginBottom: 10 }}>Nothing here yet.</div>
              <div style={{ fontSize: 13, color: 'var(--sa-ink-4)', lineHeight: 1.5 }}>Complete a session and it'll appear.</div>
            </div>
          ) : (
            displayed.map((e, i, arr) => {
              const d       = new Date(e.timestamp)
              const dayNum  = d.getDate()
              const dow     = d.toLocaleDateString('en-US', { weekday: 'short' })
              const month   = d.toLocaleDateString('en-US', { month: 'short' })
              const isToday = dayKey(d) === todayKey
              const isOpen  = expandedId === e.id

              return (
                <div key={e.id || i} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--sa-rule)' : 'none' }}>
                  {/* Session row */}
                  <div className="sa-tap" onClick={() => toggleExpand(e)} style={{
                    display: 'flex', gap: 16, padding: '16px 0',
                    alignItems: 'flex-start',
                  }}>
                    {/* Date */}
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
                      {e.note && !isOpen && (
                        <div className="sa-serif-it" style={{ fontSize: 13, color: 'var(--sa-ink-2)', lineHeight: 1.4 }}>
                          "{e.note}"
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, gap: 4 }}>
                      <div style={{ fontFamily: 'Newsreader, serif', fontWeight: 300, fontSize: 16, color: 'var(--sa-ink-1)' }}>
                        {e.duration || '—'}<span style={{ color: 'var(--sa-ink-3)', fontSize: 12 }}>{e.duration ? 'm' : ''}</span>
                      </div>
                      {e.mood && <div className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-3)' }}>{e.mood.toUpperCase()}</div>}
                      <SaIcon name={isOpen ? 'chevD' : 'chevR'} size={12} color="var(--sa-ink-4)" />
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div className="sa-enter" style={{ padding: '0 0 20px 68px' }}>
                      {/* Completed sets breakdown */}
                      {e.completedSets && e.completedSets.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                          <div className="sa-label" style={{ fontSize: 9, marginBottom: 8, color: 'var(--sa-ink-4)' }}>SETS COMPLETED</div>
                          {e.completedSets.map(ex => (
                            <div key={ex.key} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--sa-rule)' }}>
                              <span style={{ fontSize: 12, color: 'var(--sa-ink-2)', fontFamily: 'Newsreader, serif', fontStyle: 'italic' }}>{ex.name}</span>
                              <span className="sa-mono" style={{ fontSize: 11, color: ex.completed >= ex.total ? 'var(--sa-accent)' : 'var(--sa-ink-3)' }}>
                                {ex.completed}/{ex.total}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Mood editor */}
                      <div style={{ marginBottom: 12 }}>
                        <div className="sa-label" style={{ fontSize: 9, marginBottom: 8, color: 'var(--sa-ink-4)' }}>MOOD</div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {moods.map(m => {
                            const on = editMood[e.id] === m
                            return (
                              <span key={m} className="sa-pill" onClick={() => setEditMood(prev => ({ ...prev, [e.id]: on ? null : m }))} style={{
                                padding: '7px 12px', fontSize: 12,
                                background: on ? 'var(--sa-cool)' : 'transparent',
                                color: on ? '#14110e' : 'var(--sa-ink-2)',
                                borderColor: on ? 'var(--sa-cool)' : 'var(--sa-rule)',
                              }}>
                                {capitalize(m)}
                              </span>
                            )
                          })}
                        </div>
                      </div>

                      {/* Note editor */}
                      <div style={{ marginBottom: 14 }}>
                        <div className="sa-label" style={{ fontSize: 9, marginBottom: 8, color: 'var(--sa-ink-4)' }}>NOTE</div>
                        <textarea
                          className="sa-textarea"
                          value={editNote[e.id] || ''}
                          onChange={ev => setEditNote(prev => ({ ...prev, [e.id]: ev.target.value }))}
                          placeholder="Add a note..."
                          style={{ minHeight: 64, fontSize: 13, padding: '10px 14px' }}
                        />
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <button onClick={() => saveEdit(e.id)} style={{
                          flex: 1, padding: '10px 0', borderRadius: 100,
                          background: 'var(--sa-accent)', border: 'none',
                          fontFamily: 'Newsreader, serif', fontStyle: 'italic',
                          fontSize: 14, color: '#14110e', cursor: 'pointer',
                        }}>
                          Save
                        </button>
                        <button onClick={() => handleDelete(e.id)} style={{
                          padding: '10px 16px', borderRadius: 100,
                          background: 'transparent',
                          border: `1px solid ${deleteConfirm === e.id ? 'var(--sa-str)' : 'var(--sa-rule-hi)'}`,
                          fontFamily: 'Newsreader, serif', fontStyle: 'italic',
                          fontSize: 13, color: deleteConfirm === e.id ? 'var(--sa-str)' : 'var(--sa-ink-3)',
                          cursor: 'pointer', whiteSpace: 'nowrap',
                        }}>
                          {deleteConfirm === e.id ? 'Confirm delete' : 'Delete'}
                        </button>
                      </div>
                      {e.groups?.length > 0 && (
                        <button onClick={() => beginWorkout({
                          groups:  e.groups,
                          mode:    e.mode || 'def',
                          slotIdx: e.slotIdx ?? 3,
                          minutes: e.duration ?? 60,
                          effort:  'medium',
                          label:   e.label || e.groups.map(capitalize).join(' & '),
                        })} style={{
                          width: '100%', padding: '10px 0', borderRadius: 100,
                          background: 'transparent',
                          border: '1px solid var(--sa-rule-hi)',
                          fontFamily: 'Newsreader, serif', fontStyle: 'italic',
                          fontSize: 13, color: 'var(--sa-ink-2)', cursor: 'pointer',
                        }}>
                          Repeat this session
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}

          {/* Show all / show less toggle */}
          {sessions.length > 12 && (
            <div className="sa-tap" onClick={() => setShowAll(v => !v)} style={{
              marginTop: 22, padding: '16px 24px', borderRadius: 100,
              border: '1px solid var(--sa-rule-hi)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <span className="sa-serif-it" style={{ fontSize: 14, color: 'var(--sa-ink-2)' }}>
                {showAll ? 'Show recent only' : `Show all ${sessions.length} sessions`}
              </span>
              <SaIcon name={showAll ? 'chevD' : 'arrowSm'} size={14} color="var(--sa-ink-2)" />
            </div>
          )}
        </div>
      </div>

      <SaDock tab="log" onTab={(t) => setTab(t)} />
    </div>
  )
}
