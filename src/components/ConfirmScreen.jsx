import React from 'react'
import { SaIcon, SaModeTag } from './SanctuaryAtoms'

export default function ConfirmScreen({ state }) {
  const { pendingConfig: cfg, confirmWorkout, setTab } = state

  if (!cfg) {
    setTab('tonight')
    return null
  }

  const modeLabel  = cfg.mode === 'str' ? 'strength' : 'definition'
  const groupLabel = (cfg.groups || []).map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(' & ')

  return (
    <div className="sa-app" data-sa-mode={cfg.mode}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sa-aura" />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
        <span className="sa-tap" onClick={() => setTab('tonight')}>
          <SaIcon name="back" size={20} color="var(--sa-ink-2)" />
        </span>
        <span className="sa-label">YOUR PATH</span>
        <SaModeTag mode={cfg.mode} />
      </div>

      {/* Content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '0 32px',
      }}>

        <div className="sa-enter" style={{ marginBottom: 8 }}>
          <div className="sa-label" style={{ marginBottom: 18 }}>TONIGHT'S SESSION</div>
          <div className="sa-serif" style={{ fontSize: 42, lineHeight: 1.0, marginBottom: 6 }}>
            {groupLabel},
          </div>
          <div className="sa-serif" style={{ fontSize: 42, lineHeight: 1.0 }}>
            <em style={{ fontStyle: 'italic', color: 'var(--sa-accent)' }}>{cfg.minutes} minutes.</em>
          </div>
        </div>

        {/* Stats */}
        <div className="sa-enter" style={{
          animationDelay: '0.1s',
          display: 'flex', gap: 0,
          margin: '32px 0',
          background: 'var(--sa-bg-elev)',
          border: '1px solid var(--sa-rule)',
          borderRadius: 22,
          overflow: 'hidden',
        }}>
          {[
            { k: 'DURATION', v: String(cfg.minutes), sub: 'MIN' },
            { k: 'EFFORT',   v: cfg.effort },
            { k: 'MODE',     v: modeLabel },
          ].map((s, i) => (
            <React.Fragment key={s.k}>
              {i > 0 && <div style={{ width: 1, background: 'var(--sa-rule)' }} />}
              <div style={{ flex: 1, padding: '20px 12px', textAlign: 'center' }}>
                <div className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-3)', marginBottom: 8 }}>{s.k}</div>
                <div style={{
                  fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontWeight: 300,
                  fontSize: s.k === 'MODE' ? 13 : 20, color: 'var(--sa-ink-1)',
                }}>
                  {s.v}
                </div>
                {s.sub && <div className="sa-label" style={{ fontSize: 8, color: 'var(--sa-ink-4)', marginTop: 2 }}>{s.sub}</div>}
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="sa-enter" style={{ animationDelay: '0.15s' }}>
          {cfg.body && (
            <div style={{
              fontSize: 13, color: 'var(--sa-ink-2)', lineHeight: 1.65,
              marginBottom: 32, textAlign: 'center',
            }}>
              {cfg.body}
            </div>
          )}
          <button className="sa-cta" onClick={confirmWorkout}>
            Let's go
            <span className="arrow"><SaIcon name="arrowSm" size={18} color="#14110e" /></span>
          </button>
        </div>
      </div>
    </div>
  )
}
