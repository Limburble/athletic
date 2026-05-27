import React, { useState } from 'react'
import { SaIcon, SaStat, SaSwitch, SaFloatingDock } from './SanctuaryAtoms'
import { dayKey, weekMonday } from '../data/store'

const SLOT_VALUES = [15, 30, 45, 60, 75, 90, 105, 120]

export default function CoolScreen({ state }) {
  const { coolStep, setCoolStep, reset, groups, mode, slotIdx, workout, sessionStart, store } = state

  function handleClose(data) {
    // Compute duration from the wall clock
    const duration = sessionStart
      ? Math.round((Date.now() - sessionStart) / 60000)
      : (slotIdx !== undefined ? (SLOT_VALUES[slotIdx] || 60) : 60)

    const label = groups.length > 0
      ? groups.map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(' & ')
      : 'Full body'

    store.saveSession({ groups, mode, slotIdx, label, duration, mood: data.mood, note: data.note })
    reset()
  }

  if (coolStep === 'arrive') return (
    <CoolArrive onNext={() => setCoolStep('reflect')} />
  )
  if (coolStep === 'reflect') return (
    <CoolReflect
      onNext={() => setCoolStep('close')}
      mode={mode}
      slotIdx={slotIdx}
      workout={workout}
      sessionStart={sessionStart}
    />
  )
  return (
    <CoolClose
      onDone={handleClose}
      sessions={store.sessions}
    />
  )
}

/* ── Arrive ── The first breath after the bell. */
function CoolArrive({ onNext }) {
  return (
    <div className="sa-app" data-sa-mode="cool"
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sa-aura" style={{ opacity: 0.8 }} />

      <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 24px 0' }}>
        <div className="sa-label" style={{ fontSize: 9 }}>
          COMPLETED · {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase()}
        </div>
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 32px', textAlign: 'center', position: 'relative',
      }}>
        {/* Breathing rings */}
        <div className="sa-enter" style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{
              position: 'absolute', width: 320, height: 320, borderRadius: '50%',
              border: '1px solid var(--sa-cool)',
              animation: 'sa-breath-cycle 8s var(--sa-breathe) infinite',
            }} />
            <div style={{
              position: 'absolute', width: 240, height: 240, borderRadius: '50%',
              border: '1px solid var(--sa-cool)', opacity: 0.7,
              animation: 'sa-breath-cycle 8s var(--sa-breathe) infinite',
            }} />
            <div style={{
              position: 'absolute', width: 160, height: 160, borderRadius: '50%',
              background: 'radial-gradient(closest-side, var(--sa-cool-glow), transparent 80%)',
              animation: 'sa-breath-cycle 8s var(--sa-breathe) infinite',
            }} />
          </div>

          <div style={{ position: 'relative' }}>
            <div className="sa-serif" style={{ fontSize: 48, color: 'var(--sa-ink-1)', marginBottom: 14, lineHeight: 1 }}>
              That's <em style={{ fontStyle: 'italic', color: 'var(--sa-cool)' }}>it.</em>
            </div>
            <div className="sa-serif-it" style={{ fontSize: 19, color: 'var(--sa-ink-2)', lineHeight: 1.4, maxWidth: 280, margin: '0 auto' }}>
              Stay as long as<br/>you need.
            </div>
          </div>
        </div>

        <div className="sa-enter" style={{
          marginTop: 64, animationDelay: '1.2s', position: 'relative',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
        }}>
          {/* Breath labels */}
          <div style={{ position: 'relative', height: 14, display: 'flex', alignItems: 'center' }}>
            <span className="sa-label" style={{
              fontSize: 9, color: 'var(--sa-cool)', position: 'absolute',
              animation: 'sa-breath-in-label 8s var(--sa-breathe) infinite',
            }}>BREATHE IN</span>
            <span className="sa-label" style={{
              fontSize: 9, color: 'var(--sa-cool)', position: 'absolute',
              animation: 'sa-breath-out-label 8s var(--sa-breathe) infinite',
            }}>BREATHE OUT</span>
          </div>
          <div className="sa-tap" onClick={onNext}>
            <div className="sa-ghost" style={{
              padding: '14px 28px', fontSize: 15,
              borderColor: 'var(--sa-cool)', color: 'var(--sa-cool)',
            }}>
              when you're ready
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 32 }} />
    </div>
  )
}

/* ── Reflect ── Restoration moment. Real session stats. */
function CoolReflect({ onNext, mode, slotIdx, workout, sessionStart }) {
  const [hydrated, setHydrated] = useState(false)

  // Actual elapsed time, falling back to planned duration
  const duration = sessionStart
    ? Math.round((Date.now() - sessionStart) / 60000)
    : (slotIdx !== undefined ? (SLOT_VALUES[slotIdx] || 60) : 60)

  // Total sets from main block
  const totalSets = workout ? workout.main.reduce((acc, ex) => {
    const spec = mode === 'str' ? ex.s : ex.d
    const m = spec && spec.match(/^(\d+)/)
    return acc + (m ? parseInt(m[1]) : 3)
  }, 0) : 0

  const effortLabel = mode === 'str' ? 'heavy' : 'steady'

  return (
    <div className="sa-app" data-sa-mode="cool"
      style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div className="sa-aura" />

      <div style={{ padding: '20px 28px 0' }}>
        <div className="sa-label" style={{ marginBottom: 14 }}>RESTORATION</div>
        <div className="sa-serif" style={{ fontSize: 34, lineHeight: 1.05, marginBottom: 4 }}>
          The body is <em style={{ fontStyle: 'italic', color: 'var(--sa-cool)' }}>open</em>
        </div>
        <div className="sa-serif" style={{ fontSize: 34, lineHeight: 1.05, color: 'var(--sa-ink-2)' }}>
          for the next hour.
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 20px 140px' }}>

        {/* Hydration */}
        <div className="sa-panel sa-enter" style={{ padding: '20px 22px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 100,
              background: 'var(--sa-cool-aura)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <SaIcon name="drop" size={20} color="var(--sa-cool)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 17, color: 'var(--sa-ink-1)', marginBottom: 4 }}>
                Water first.
              </div>
              <div style={{ fontSize: 13, color: 'var(--sa-ink-2)', lineHeight: 1.5, marginBottom: 14 }}>
                Two glasses, sipped slowly over the next ten minutes.
              </div>
              <SaSwitch on={hydrated} onChange={setHydrated} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="sa-panel sa-enter" style={{ padding: '22px 22px 20px', marginBottom: 14, animationDelay: '0.1s' }}>
          <div className="sa-label" style={{ fontSize: 9, marginBottom: 16 }}>WHAT YOU GAVE</div>
          <div style={{ display: 'flex', gap: 0 }}>
            <SaStat k="TIME"   v={String(duration)} sub="MIN" light />
            <div style={{ width: 1, background: 'var(--sa-rule)' }} />
            <SaStat k="SETS"   v={totalSets > 0 ? String(totalSets) : '—'} light />
            <div style={{ width: 1, background: 'var(--sa-rule)' }} />
            <SaStat k="EFFORT" v={effortLabel} light />
          </div>
          <div className="sa-rule" style={{ margin: '20px -22px 18px' }} />
          <div style={{ fontSize: 12, color: 'var(--sa-ink-2)', lineHeight: 1.55 }}>
            Heart rate settled <span style={{ color: 'var(--sa-cool)' }}>before the next song</span> finished.
            One of your steadier sessions.
          </div>
        </div>

        {/* Sauna */}
        <div className="sa-panel sa-enter" style={{
          padding: '20px 22px', marginBottom: 14,
          background: 'linear-gradient(180deg, var(--sa-str-aura), var(--sa-bg-elev))',
          animationDelay: '0.15s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 100, background: 'var(--sa-str-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SaIcon name="sun" size={20} color="var(--sa-str)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 17, color: 'var(--sa-ink-1)', marginBottom: 4 }}>
                The sauna is open.
              </div>
              <div style={{ fontSize: 12, color: 'var(--sa-ink-2)', lineHeight: 1.5 }}>
                Until 10pm. 15 minutes is plenty.
              </div>
            </div>
          </div>
        </div>

        {/* Breath exercise */}
        <div className="sa-panel sa-enter sa-tap" style={{ padding: '20px 22px', marginBottom: 14, animationDelay: '0.2s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 100, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--sa-rule)', flexShrink: 0 }}>
              <SaIcon name="leaf" size={20} color="var(--sa-ink-2)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 17, color: 'var(--sa-ink-1)', marginBottom: 4 }}>Four breaths.</div>
              <div style={{ fontSize: 12, color: 'var(--sa-ink-2)' }}>Two minutes · downshift the nervous system</div>
            </div>
            <SaIcon name="chevR" size={14} color="var(--sa-ink-3)" />
          </div>
        </div>
      </div>

      <SaFloatingDock>
        <button className="sa-cta" onClick={onNext} style={{
          background: 'var(--sa-cool)',
          boxShadow: '0 8px 32px var(--sa-cool-glow), inset 0 1px 0 rgba(255,255,255,0.25)',
        }}>
          Log and close
          <span className="arrow"><SaIcon name="arrowSm" size={16} color="#14110e" /></span>
        </button>
      </SaFloatingDock>
    </div>
  )
}

/* ── Close ── The journal. Mood + note + real week dots. */
function CoolClose({ onDone, sessions }) {
  const [mood, setMood] = useState(null)
  const [note, setNote] = useState('')

  const moods = [
    { id: 'heavy',  label: 'Heavy'  },
    { id: 'steady', label: 'Steady' },
    { id: 'light',  label: 'Light'  },
    { id: 'clear',  label: 'Clear'  },
  ]

  // Build week dot data from real sessions
  const monday    = weekMonday()
  const todayKey  = dayKey()
  const weekDays  = new Set(
    sessions
      .filter(s => s.timestamp >= monday.getTime())
      .map(s => dayKey(new Date(s.timestamp)))
  )
  weekDays.add(todayKey)   // today's session (being logged right now)

  const dayLabels  = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const todayDow   = (new Date().getDay() || 7) - 1   // 0 = Mon, 6 = Sun
  const weekVisits = weekDays.size

  // For each Mon-Sun cell, compute the actual calendar date
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(d.getDate() + i)
    d.setHours(0, 0, 0, 0)
    return d.getTime()
  })

  return (
    <div className="sa-app" data-sa-mode="cool"
      style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div className="sa-aura" />

      <div style={{ padding: '20px 28px 0' }}>
        <div className="sa-label" style={{ marginBottom: 14 }}>JOURNAL · TONIGHT</div>
        <div className="sa-serif" style={{ fontSize: 34, lineHeight: 1.05 }}>
          Before you <em style={{ fontStyle: 'italic', color: 'var(--sa-cool)' }}>leave</em>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 28px 140px' }}>

        {/* Mood */}
        <div className="sa-enter" style={{ marginBottom: 36 }}>
          <div className="sa-serif-it" style={{ fontSize: 18, color: 'var(--sa-ink-2)', marginBottom: 16 }}>
            How was your body?
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {moods.map(m => {
              const on = mood === m.id
              return (
                <span key={m.id} className={`sa-pill${on ? ' on' : ''}`} onClick={() => setMood(m.id)}
                  style={{
                    padding: '12px 20px', fontSize: 14,
                    background: on ? 'var(--sa-cool)' : 'transparent',
                    color: on ? '#14110e' : 'var(--sa-ink-1)',
                    borderColor: on ? 'var(--sa-cool)' : 'var(--sa-rule-hi)',
                    boxShadow: on ? '0 4px 16px var(--sa-cool-glow)' : 'none',
                  }}>
                  {m.label}
                </span>
              )
            })}
          </div>
        </div>

        {/* Note */}
        <div className="sa-enter" style={{ marginBottom: 28, animationDelay: '0.1s' }}>
          <div className="sa-serif-it" style={{ fontSize: 18, color: 'var(--sa-ink-2)', marginBottom: 12 }}>
            Anything to remember?
          </div>
          <textarea
            className="sa-textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="A line, if you want. Or leave it blank."
            style={{ minHeight: 90 }}
          />
        </div>

        {/* Week dots */}
        <div className="sa-enter" style={{
          padding: '20px 22px',
          background: 'var(--sa-bg-elev)',
          border: '1px solid var(--sa-rule)',
          borderRadius: 22,
          textAlign: 'center',
          animationDelay: '0.15s',
        }}>
          <div className="sa-label" style={{ fontSize: 9, marginBottom: 10 }}>VISITS THIS WEEK</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 10 }}>
            {dayLabels.map((d, i) => {
              const cellKey = weekDates[i]
              const has     = weekDays.has(cellKey)
              const today   = i === todayDow
              const future  = i > todayDow
              return (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: 100,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: today ? 'var(--sa-cool)' : has ? 'rgba(138,169,196,0.18)' : 'transparent',
                  border: `1px solid ${has || today ? 'var(--sa-cool)' : 'var(--sa-rule)'}`,
                  boxShadow: today ? '0 0 14px var(--sa-cool-glow)' : 'none',
                  opacity: future ? 0.35 : 1,
                }}>
                  <span style={{ fontFamily: 'Newsreader, serif', fontSize: 11, color: today ? '#14110e' : has ? 'var(--sa-cool)' : 'var(--sa-ink-3)' }}>
                    {d}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="sa-serif-it" style={{ fontSize: 13, color: 'var(--sa-ink-2)' }}>
            {weekVisits} {weekVisits === 1 ? 'reset' : 'resets'} this week.
          </div>
        </div>
      </div>

      <SaFloatingDock>
        <button className="sa-cta" onClick={() => onDone({ mood, note })} style={{
          background: 'var(--sa-cool)',
          boxShadow: '0 8px 32px var(--sa-cool-glow), inset 0 1px 0 rgba(255,255,255,0.25)',
        }}>
          Step out
          <span className="arrow"><SaIcon name="arrowSm" size={16} color="#14110e" /></span>
        </button>
      </SaFloatingDock>
    </div>
  )
}
