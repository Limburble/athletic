import React, { useState } from 'react'
import { SaIcon, SaStat, SaSwitch, SaFloatingDock } from './SanctuaryAtoms'
import { dayKey, weekMonday } from '../data/store'

function fmt12(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ampm = h < 12 ? 'AM' : 'PM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

const SLOT_VALUES = [15, 30, 45, 60, 75, 90, 105, 120]

export default function CoolScreen({ state }) {
  const { coolStep, setCoolStep, reset, groups, mode, slotIdx, workout, sessionStart, completedSets, store } = state

  function handleClose(data) {
    const duration = sessionStart
      ? Math.round((Date.now() - sessionStart) / 60000)
      : (SLOT_VALUES[slotIdx] || 60)

    const label = groups.length > 0
      ? groups.map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(' & ')
      : 'Full body'

    store.saveSession({ groups, mode, slotIdx, label, duration, mood: data.mood, note: data.note, completedSets })
    reset()
  }

  if (coolStep === 'arrive') return <CoolArrive onNext={() => setCoolStep('reflect')} />
  if (coolStep === 'reflect') return (
    <CoolReflect
      onNext={() => setCoolStep('close')}
      mode={mode}
      slotIdx={slotIdx}
      workout={workout}
      sessionStart={sessionStart}
      completedSets={completedSets}
      store={store}
    />
  )
  return <CoolClose onDone={handleClose} sessions={store.sessions} />
}

// ── Arrive ──────────────────────────────────────────────────────────────────
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
        padding: '0 32px', position: 'relative',
      }}>
        {/* Breathing rings */}
        <div className="sa-enter" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', border: '1px solid var(--sa-cool)', animation: 'sa-breath-cycle 8s var(--sa-breathe) infinite' }} />
          <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', border: '1px solid var(--sa-cool)', opacity: 0.7, animation: 'sa-breath-cycle 8s var(--sa-breathe) infinite' }} />
          <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(closest-side, var(--sa-cool-glow), transparent 80%)', animation: 'sa-breath-cycle 8s var(--sa-breathe) infinite' }} />

          <div style={{ position: 'relative', textAlign: 'center' }}>
            <div className="sa-serif" style={{ fontSize: 48, color: 'var(--sa-ink-1)', marginBottom: 14, lineHeight: 1 }}>
              That's <em style={{ fontStyle: 'italic', color: 'var(--sa-cool)' }}>it.</em>
            </div>
            <div className="sa-serif-it" style={{ fontSize: 19, color: 'var(--sa-ink-2)', lineHeight: 1.4, maxWidth: 280, margin: '0 auto' }}>
              Stay as long as<br/>you need.
            </div>
          </div>
        </div>

        {/* Breathe labels — centered */}
        <div className="sa-enter" style={{
          marginTop: 64, animationDelay: '1.2s', position: 'relative',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
        }}>
          <div style={{
            height: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 120, position: 'relative',
          }}>
            <span className="sa-label" style={{
              fontSize: 9, color: 'var(--sa-cool)',
              position: 'absolute', left: '50%', transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
              animation: 'sa-breath-in-label 8s var(--sa-breathe) infinite',
            }}>BREATHE IN</span>
            <span className="sa-label" style={{
              fontSize: 9, color: 'var(--sa-cool)',
              position: 'absolute', left: '50%', transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
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

// ── Reflect ──────────────────────────────────────────────────────────────────
function CoolReflect({ onNext, mode, slotIdx, workout, sessionStart, completedSets, store }) {
  const [hydrated, setHydrated] = useState(false)
  const isStr = mode === 'str'

  const duration = sessionStart
    ? Math.round((Date.now() - sessionStart) / 60000)
    : (SLOT_VALUES[slotIdx] || 60)

  // Total completed sets — use actual tracking if available, else spec count
  const totalSets = completedSets
    ? completedSets.reduce((a, e) => a + e.completed, 0)
    : workout
      ? workout.main.reduce((acc, ex) => {
          const spec = ex[isStr ? 's' : 'd']
          const m = spec && spec.match(/^(\d+)/)
          return acc + (m ? parseInt(m[1]) : 3)
        }, 0)
      : 0

  const effortLabel = isStr ? 'heavy' : 'steady'

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

      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 20px 100px' }}>

        {/* Hydration */}
        <div className="sa-panel sa-enter" style={{ padding: '20px 22px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 100, background: 'var(--sa-cool-aura)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <SaIcon name="drop" size={20} color="var(--sa-cool)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 17, color: 'var(--sa-ink-1)', marginBottom: 4 }}>Water first.</div>
              <div style={{ fontSize: 13, color: 'var(--sa-ink-2)', lineHeight: 1.5, marginBottom: 14 }}>Two glasses, sipped slowly over the next ten minutes.</div>
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

          {/* Per-exercise set breakdown */}
          {completedSets && completedSets.length > 0 && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--sa-rule)' }}>
              {completedSets.map(ex => (
                <div key={ex.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--sa-rule)' }}>
                  <span style={{ fontSize: 12, color: 'var(--sa-ink-2)', fontFamily: 'Newsreader, serif', fontStyle: 'italic' }}>{ex.name}</span>
                  <span className="sa-mono" style={{ fontSize: 11, color: ex.completed >= ex.total ? 'var(--sa-cool)' : 'var(--sa-ink-3)' }}>
                    {ex.completed}/{ex.total}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gym hours tile */}
        {(() => {
          const gymIsOpen = store?.stats?.gymIsOpen
          const gymName   = store?.profile?.gym || 'Your gym'
          const gymOpen   = store?.profile?.gymOpen  || '05:30'
          const gymClose  = store?.profile?.gymClose || '22:00'
          return (
            <div className="sa-panel sa-enter" style={{
              padding: '20px 22px', marginBottom: 14, animationDelay: '0.15s',
              background: gymIsOpen
                ? 'linear-gradient(180deg, var(--sa-str-aura), var(--sa-bg-elev))'
                : 'var(--sa-bg-elev)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 100,
                  background: gymIsOpen ? 'var(--sa-str-glow)' : 'var(--sa-bg-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <SaIcon name="sun" size={20} color={gymIsOpen ? 'var(--sa-str)' : 'var(--sa-ink-3)'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 17, color: 'var(--sa-ink-1)', marginBottom: 4 }}>
                    {gymIsOpen ? `${gymName} is still open.` : 'Rest and recover.'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--sa-ink-2)', lineHeight: 1.5 }}>
                    {gymIsOpen
                      ? `Closes at ${fmt12(gymClose)}. 15 minutes in the sauna is plenty.`
                      : `${gymName} reopens at ${fmt12(gymOpen)}.`}
                  </div>
                </div>
              </div>
            </div>
          )
        })()}
      </div>

      <SaFloatingDock>
        <button className="sa-cta" onClick={onNext} style={{ background: 'var(--sa-cool)', boxShadow: '0 8px 32px var(--sa-cool-glow), inset 0 1px 0 rgba(255,255,255,0.25)' }}>
          Log and close
          <span className="arrow"><SaIcon name="arrowSm" size={16} color="#14110e" /></span>
        </button>
      </SaFloatingDock>
    </div>
  )
}

// ── Close ────────────────────────────────────────────────────────────────────
function CoolClose({ onDone, sessions }) {
  const [mood, setMood] = useState(null)
  const [note, setNote] = useState('')

  const moods = [
    { id: 'heavy',  label: 'Heavy'  },
    { id: 'steady', label: 'Steady' },
    { id: 'light',  label: 'Light'  },
    { id: 'clear',  label: 'Clear'  },
  ]

  const monday    = weekMonday()
  const todayKey  = dayKey()
  const weekDays  = new Set(
    sessions
      .filter(s => s.timestamp >= monday.getTime())
      .map(s => dayKey(new Date(s.timestamp)))
  )
  weekDays.add(todayKey)

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const todayDow  = (new Date().getDay() || 7) - 1
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(d.getDate() + i)
    d.setHours(0, 0, 0, 0)
    return d.getTime()
  })
  const weekVisits = weekDays.size

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

      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 28px 100px' }}>

        {/* Mood */}
        <div className="sa-enter" style={{ marginBottom: 36 }}>
          <div className="sa-serif-it" style={{ fontSize: 18, color: 'var(--sa-ink-2)', marginBottom: 16 }}>How was your body?</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {moods.map(m => {
              const on = mood === m.id
              return (
                <span key={m.id} className={`sa-pill${on ? ' on' : ''}`} onClick={() => setMood(m.id)} style={{
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
          <div className="sa-serif-it" style={{ fontSize: 18, color: 'var(--sa-ink-2)', marginBottom: 12 }}>Anything to remember?</div>
          <textarea
            className="sa-textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="A line, if you want. Or leave it blank."
            style={{ minHeight: 90 }}
          />
        </div>

        {/* Week dots */}
        <div className="sa-enter" style={{ padding: '20px 22px', background: 'var(--sa-bg-elev)', border: '1px solid var(--sa-rule)', borderRadius: 22, textAlign: 'center', animationDelay: '0.15s' }}>
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
                  <span style={{ fontFamily: 'Newsreader, serif', fontSize: 11, color: today ? '#14110e' : has ? 'var(--sa-cool)' : 'var(--sa-ink-3)' }}>{d}</span>
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
        <button className="sa-cta" onClick={() => onDone({ mood, note })} style={{ background: 'var(--sa-cool)', boxShadow: '0 8px 32px var(--sa-cool-glow), inset 0 1px 0 rgba(255,255,255,0.25)' }}>
          Step out
          <span className="arrow"><SaIcon name="arrowSm" size={16} color="#14110e" /></span>
        </button>
      </SaFloatingDock>
    </div>
  )
}
