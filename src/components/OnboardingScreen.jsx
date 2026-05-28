import React, { useState } from 'react'
import { SaIcon } from './SanctuaryAtoms'

export default function OnboardingScreen({ state }) {
  const { store, setMode, setTab } = state
  const [step,    setStep]    = useState(0)
  const [name,    setName]    = useState('')
  const [gym,     setGym]     = useState('')
  const [chosenMode, setChosenMode] = useState('def')

  function finish() {
    store.updateProfile({
      name:      name.trim() || 'Athlete',
      lastName:  '',
      gym:       gym.trim() || 'Your gym',
      onboarded: true,
    })
    setMode(chosenMode)
    setTab('tonight')
  }

  const steps = [
    // Step 0 — welcome
    <div key="welcome" className="sa-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 36px', textAlign: 'center' }}>
      <div className="sa-serif" style={{ fontSize: 44, lineHeight: 1.05, marginBottom: 16 }}>
        The room<br/>is <em style={{ fontStyle: 'italic', color: 'var(--sa-accent)' }}>yours.</em>
      </div>
      <div style={{ fontSize: 14, color: 'var(--sa-ink-2)', lineHeight: 1.65, maxWidth: 280, marginBottom: 48 }}>
        Athletic is a private workout journal — it learns your training over time and builds sessions around you. Two questions to start.
      </div>
      <button className="sa-cta" onClick={() => setStep(1)}>
        Let's go
        <span className="arrow"><SaIcon name="arrowSm" size={16} color="#14110e" /></span>
      </button>
    </div>,

    // Step 1 — name + gym
    <div key="name" className="sa-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 32px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="sa-label" style={{ marginBottom: 14 }}>WHO'S HERE</div>
        <div className="sa-serif" style={{ fontSize: 36, marginBottom: 32 }}>
          What should I<br/><em style={{ fontStyle: 'italic', color: 'var(--sa-accent)' }}>call you?</em>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div className="sa-label" style={{ fontSize: 9, marginBottom: 8 }}>FIRST NAME</div>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Brayden"
            autoFocus
            style={{
              width: '100%', padding: '16px 18px',
              background: 'var(--sa-bg-2)',
              border: '1px solid var(--sa-rule-hi)',
              borderRadius: 18,
              fontFamily: 'Newsreader, serif',
              fontSize: 20, fontStyle: 'italic',
              color: 'var(--sa-ink-1)',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: 40 }}>
          <div className="sa-label" style={{ fontSize: 9, marginBottom: 8 }}>GYM (OPTIONAL)</div>
          <input
            value={gym}
            onChange={e => setGym(e.target.value)}
            placeholder="e.g. Club Greenwood"
            style={{
              width: '100%', padding: '16px 18px',
              background: 'var(--sa-bg-2)',
              border: '1px solid var(--sa-rule-hi)',
              borderRadius: 18,
              fontFamily: 'Newsreader, serif',
              fontSize: 16, fontStyle: 'italic',
              color: 'var(--sa-ink-1)',
              outline: 'none',
            }}
          />
        </div>
      </div>

      <div style={{ paddingBottom: 28 }}>
        <button className="sa-cta" onClick={() => setStep(2)} disabled={!name.trim()}>
          Next
          <span className="arrow"><SaIcon name="arrowSm" size={16} color="#14110e" /></span>
        </button>
      </div>
    </div>,

    // Step 2 — mode
    <div key="mode" className="sa-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 32px' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="sa-label" style={{ marginBottom: 14 }}>DEFAULT TEMPO</div>
        <div className="sa-serif" style={{ fontSize: 36, marginBottom: 8 }}>
          How do you<br/><em style={{ fontStyle: 'italic', color: 'var(--sa-accent)' }}>train?</em>
        </div>
        <div style={{ fontSize: 13, color: 'var(--sa-ink-2)', lineHeight: 1.55, marginBottom: 36 }}>
          You can change this any time. It sets your default rep ranges and rest periods.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 40 }}>
          {[
            { id: 'def', label: 'Definition', body: 'Hypertrophy · 8–15 reps · 45–90s rest' },
            { id: 'str', label: 'Strength',   body: 'Force · 3–6 reps · 2–3 min rest'       },
          ].map(m => {
            const on = chosenMode === m.id
            return (
              <div key={m.id} className="sa-tap" onClick={() => setChosenMode(m.id)} style={{
                padding: '22px 18px',
                background: on ? 'var(--sa-bg-3)' : 'transparent',
                border: `1px solid ${on ? 'var(--sa-accent)' : 'var(--sa-rule)'}`,
                borderRadius: 22,
                transition: 'all 0.55s var(--sa-settle)',
                boxShadow: on ? '0 0 0 1px var(--sa-accent), 0 6px 28px var(--sa-accent-glow)' : 'none',
              }}>
                <div style={{ fontFamily: 'Newsreader, serif', fontWeight: 400, fontSize: 20, marginBottom: 6, color: on ? 'var(--sa-accent)' : 'var(--sa-ink-1)' }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--sa-ink-3)', lineHeight: 1.45 }}>{m.body}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ paddingBottom: 28 }}>
        <button className="sa-cta" onClick={finish}>
          Enter the room
          <span className="arrow"><SaIcon name="arrowSm" size={16} color="#14110e" /></span>
        </button>
      </div>
    </div>,
  ]

  return (
    <div className="sa-app" data-sa-mode={chosenMode}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sa-aura" />

      {/* Step indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '28px 0 0', position: 'relative' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: i === step ? 24 : 6, height: 6, borderRadius: 100,
            background: i === step ? 'var(--sa-accent)' : 'var(--sa-bg-3)',
            transition: 'all 0.55s var(--sa-settle)',
          }} />
        ))}
      </div>

      {steps[step]}
    </div>
  )
}
