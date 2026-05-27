import React, { useState } from 'react'
import { SaIcon, SaFloatingDock } from './SanctuaryAtoms'

const DAY_WORDS = [
  'zero', 'one', 'two', 'three', 'four', 'five',
  'six', 'seven', 'eight', 'nine', 'ten',
]

function daysText(n) {
  const word = n <= 10 ? DAY_WORDS[n] : String(n)
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function CheckSection({ n, label, children, delay = 0 }) {
  return (
    <div className="sa-enter" style={{ marginBottom: 18, animationDelay: `${delay}s` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10, paddingLeft: 4 }}>
        <span className="sa-serif-it" style={{ fontSize: 20, color: 'var(--sa-accent)' }}>{n}.</span>
        <span style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 17, color: 'var(--sa-ink-1)' }}>
          {label}
        </span>
      </div>
      <div style={{ background: 'var(--sa-bg-elev)', border: '1px solid var(--sa-rule)', borderRadius: 22, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}

export default function CheckinScreen({ state }) {
  const { mode, setTab, store } = state
  const { profile, thisWeekCheckin, stats } = store

  // Initialise from previous check-in this week, or from stored profile
  const [weight,     setWeight]   = useState(thisWeekCheckin?.weight   ?? profile.weight)
  const [heightOpen, setHO]       = useState(false)
  const [heightFt,   setHF]       = useState(profile.heightFt)
  const [heightIn,   setHI]       = useState(profile.heightIn)
  const [arrived,    setArrived]  = useState(thisWeekCheckin?.arrived   ?? null)
  const [aches,      setAches]    = useState(thisWeekCheckin?.aches     ?? [])
  const [sleep,      setSleep]    = useState(thisWeekCheckin?.sleep     ?? 2)
  const [intention,  setInt]      = useState(thisWeekCheckin?.intention ?? '')

  const now  = new Date()
  const week = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

  // Dynamic heading based on days in the programme
  const daysIn = stats.daysIn
  const bigText  = daysIn === 0 ? 'Welcome,' : `${daysText(daysIn)}`
  const emText   = daysIn === 0 ? 'begin.' : daysIn === 1 ? 'day' : 'days'
  const smallText = daysIn === 0 ? null : 'in.'

  const arrivedOpts = [
    { id: 'rested',  label: 'Rested'  },
    { id: 'even',    label: 'Even'    },
    { id: 'tired',   label: 'Tired'   },
    { id: 'wrecked', label: 'Wrecked' },
  ]
  const acheOpts = [
    { id: 'shoulders', label: 'Shoulders' },
    { id: 'midback',   label: 'Mid-back'  },
    { id: 'lowback',   label: 'Lower back'},
    { id: 'knees',     label: 'Knees'     },
    { id: 'hips',      label: 'Hips'      },
    { id: 'clear',     label: 'All clear' },
  ]
  const sleepLabels = ['Rough', 'Restless', 'Okay', 'Solid', 'Deep']

  function toggleAche(id) {
    if (id === 'clear') {
      setAches(a => a.includes('clear') ? [] : ['clear'])
      return
    }
    setAches(a => a.includes(id) ? a.filter(x => x !== id) : [...a.filter(x => x !== 'clear'), id])
  }

  function handleSave() {
    store.saveCheckin({ weight, heightFt, heightIn, arrived, aches, sleep, intention })
    setTab('path')
  }

  function handleSkip() {
    setTab('path')
  }

  return (
    <div className="sa-app" data-sa-mode={mode}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div className="sa-aura" />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
        <span className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-3)' }}>WEEK OF {week.toUpperCase()}</span>
        <span className="sa-tap" onClick={handleSkip}>
          <SaIcon name="close" size={18} color="var(--sa-ink-3)" />
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 28px 180px' }}>

        {/* Greeting */}
        <div className="sa-enter" style={{ marginBottom: 28 }}>
          <div className="sa-label" style={{ marginBottom: 14 }}>A SMALL CHECK-IN</div>
          <div className="sa-serif" style={{ fontSize: 36, lineHeight: 1.05, marginBottom: 4 }}>
            {bigText} <em style={{ fontStyle: 'italic', color: 'var(--sa-accent)' }}>{emText}</em>
          </div>
          {smallText && (
            <div className="sa-serif" style={{ fontSize: 36, lineHeight: 1.05, color: 'var(--sa-ink-2)' }}>{smallText}</div>
          )}
          <div style={{ fontSize: 13, color: 'var(--sa-ink-2)', lineHeight: 1.55, marginTop: 14, maxWidth: 300 }}>
            Two minutes. We'll know you a little better.
            Skip anything you don't feel like.
          </div>
        </div>

        {/* I. The body */}
        <CheckSection n="I" label="The body" delay={0.1}>
          {/* Weight */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 22px', borderBottom: '1px solid var(--sa-rule)' }}>
            <div>
              <div className="sa-label" style={{ fontSize: 9, marginBottom: 6 }}>WEIGHT</div>
              <div style={{ fontFamily: 'Newsreader, serif', fontWeight: 300, fontSize: 32, lineHeight: 1 }}>
                {weight}<span style={{ fontStyle: 'italic', color: 'var(--sa-ink-2)', fontSize: 18, marginLeft: 4 }}>lb</span>
              </div>
              <div className="sa-serif-it" style={{ fontSize: 11, color: 'var(--sa-ink-3)', marginTop: 4 }}>
                {profile.weight === weight ? 'same as last check-in' : `was ${profile.weight} lb`}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[['minus', -1], ['plus', 1]].map(([ico, delta]) => (
                <button key={ico} className="sa-tap" onClick={() => setWeight(w => w + delta)} style={{
                  width: 38, height: 38, borderRadius: 100,
                  border: '1px solid var(--sa-rule-hi)',
                  background: 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <SaIcon name={ico} size={14} color="var(--sa-ink-2)" />
                </button>
              ))}
            </div>
          </div>

          {/* Height (collapsed) */}
          <div className="sa-tap" onClick={() => setHO(!heightOpen)} style={{ padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="sa-label" style={{ fontSize: 9, marginBottom: 4 }}>HEIGHT</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: 'Newsreader, serif', fontWeight: 400, fontSize: 17 }}>{heightFt}′{heightIn}″</span>
                <span className="sa-serif-it" style={{ fontSize: 12, color: 'var(--sa-ink-3)' }}>rarely changes — tap if it has</span>
              </div>
            </div>
            <SaIcon name={heightOpen ? 'chevD' : 'chevR'} size={14} color="var(--sa-ink-3)" />
          </div>

          {heightOpen && (
            <div className="sa-enter" style={{ padding: '0 22px 18px', display: 'flex', gap: 14 }}>
              {[
                { label: 'FEET',   val: heightFt, set: setHF, min: 4, max: 7  },
                { label: 'INCHES', val: heightIn, set: setHI, min: 0, max: 11 },
              ].map(({ label, val, set, min, max }) => (
                <div key={label} style={{ flex: 1 }}>
                  <div className="sa-label" style={{ fontSize: 9, marginBottom: 6 }}>{label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button className="sa-tap" onClick={() => set(v => Math.max(min, v - 1))} style={{ width: 30, height: 30, borderRadius: 100, border: '1px solid var(--sa-rule-hi)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <SaIcon name="minus" size={12} color="var(--sa-ink-2)" />
                    </button>
                    <span style={{ fontFamily: 'Newsreader, serif', fontSize: 20, flex: 1, textAlign: 'center' }}>{val}</span>
                    <button className="sa-tap" onClick={() => set(v => Math.min(max, v + 1))} style={{ width: 30, height: 30, borderRadius: 100, border: '1px solid var(--sa-rule-hi)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <SaIcon name="plus" size={12} color="var(--sa-ink-2)" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CheckSection>

        {/* II. Today */}
        <CheckSection n="II" label="Today" delay={0.15}>
          {/* How did you arrive? */}
          <div style={{ padding: '20px 22px' }}>
            <div className="sa-serif-it" style={{ fontSize: 16, color: 'var(--sa-ink-2)', marginBottom: 12 }}>How did you arrive?</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {arrivedOpts.map(o => {
                const on = arrived === o.id
                return (
                  <span key={o.id} className={`sa-pill${on ? ' on' : ''}`} onClick={() => setArrived(o.id)} style={{
                    padding: '9px 16px', fontSize: 13,
                    background: on ? 'var(--sa-accent)' : 'transparent',
                    color: on ? '#14110e' : 'var(--sa-ink-1)',
                    borderColor: on ? 'var(--sa-accent)' : 'var(--sa-rule-hi)',
                  }}>{o.label}</span>
                )
              })}
            </div>
          </div>

          <div className="sa-rule" />

          {/* Anything tight? */}
          <div style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="sa-serif-it" style={{ fontSize: 16, color: 'var(--sa-ink-2)' }}>Anything tight?</div>
              <span className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-4)' }}>OPTIONAL</span>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {acheOpts.map(o => {
                const on    = aches.includes(o.id)
                const clear = o.id === 'clear'
                return (
                  <span key={o.id} className={`sa-pill${on ? ' on' : ''}`} onClick={() => toggleAche(o.id)} style={{
                    padding: '9px 16px', fontSize: 13,
                    background: on ? (clear ? 'var(--sa-cool)' : 'var(--sa-bg-3)') : 'transparent',
                    color: on ? (clear ? '#14110e' : 'var(--sa-ink-1)') : 'var(--sa-ink-2)',
                    borderColor: on ? (clear ? 'var(--sa-cool)' : 'var(--sa-ink-2)') : 'var(--sa-rule)',
                  }}>{o.label}</span>
                )
              })}
            </div>
          </div>

          <div className="sa-rule" />

          {/* Last night? */}
          <div style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <div className="sa-serif-it" style={{ fontSize: 16, color: 'var(--sa-ink-2)' }}>Last night?</div>
              <span style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 15, color: 'var(--sa-accent)' }}>
                {sleepLabels[sleep]}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {sleepLabels.map((l, i) => {
                const on = i === sleep
                return (
                  <div key={l} className="sa-tap" onClick={() => setSleep(i)}
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: on ? 14 : 8, height: on ? 14 : 8, borderRadius: 100,
                      background: on ? 'var(--sa-accent)' : 'rgba(255,255,255,0.08)',
                      boxShadow: on ? '0 0 12px var(--sa-accent-glow)' : 'none',
                      transition: 'all 0.55s var(--sa-settle)',
                    }} />
                    <span className="sa-label" style={{ fontSize: 8, color: on ? 'var(--sa-ink-1)' : 'var(--sa-ink-4)' }}>
                      {l[0]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </CheckSection>

        {/* III. The week */}
        <CheckSection n="III" label="The week" delay={0.2}>
          <div style={{ padding: '20px 22px' }}>
            <div className="sa-serif-it" style={{ fontSize: 16, color: 'var(--sa-ink-2)', marginBottom: 12 }}>Anything to set down?</div>
            <textarea
              className="sa-textarea"
              value={intention}
              onChange={(e) => setInt(e.target.value)}
              placeholder="One line if you have one. Otherwise leave it."
              style={{ minHeight: 76, background: 'transparent' }}
            />
          </div>
        </CheckSection>

        <div className="sa-enter" style={{ padding: '16px 8px 4px', textAlign: 'center', animationDelay: '0.25s' }}>
          <div className="sa-serif-it" style={{ fontSize: 12, color: 'var(--sa-ink-3)' }}>
            Just for you. Nothing leaves the room.
          </div>
        </div>
      </div>

      <SaFloatingDock>
        <button className="sa-cta" onClick={handleSave}>
          Saved · step in
          <span className="arrow"><SaIcon name="arrowSm" size={16} color="#14110e" /></span>
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
          <span className="sa-tap" onClick={handleSkip} style={{
            fontFamily: 'Newsreader, serif', fontStyle: 'italic',
            fontSize: 13, color: 'var(--sa-ink-3)',
          }}>
            skip this week
          </span>
        </div>
      </SaFloatingDock>
    </div>
  )
}
