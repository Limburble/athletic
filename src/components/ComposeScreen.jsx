import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SaIcon, SaModeTag, SaFloatingDock } from './SanctuaryAtoms'
import { DEF_POOL, STR_POOL, SLOTS } from '../data/exercises'

const INFO_VARIANTS = {
  initial: { opacity: 0, y: -6, scale: 0.98 },
  animate: { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] } },
}

function SaPhase({ n, label, subtitle, children, delay = 0 }) {
  return (
    <div className="sa-enter" style={{ marginBottom: 32, animationDelay: `${delay}s` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 8 }}>
        <span className="sa-serif-it" style={{ fontSize: 22, color: 'var(--sa-accent)' }}>{n}.</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 18, color: 'var(--sa-ink-1)' }}>{label}</div>
          <div className="sa-label" style={{ fontSize: 9, marginTop: 2 }}>{subtitle}</div>
        </div>
      </div>
      <div className="sa-rule" style={{ marginBottom: 10 }} />
      {children}
    </div>
  )
}

function SaItineraryRow({ title, meta, sub, info }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--sa-rule)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Newsreader, serif', fontWeight: 400, fontSize: 16, color: 'var(--sa-ink-1)', marginBottom: sub ? 3 : 0, letterSpacing: '-0.005em' }}>
            {title}
          </div>
          {sub && <div className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-3)' }}>{sub.toUpperCase()}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginLeft: 12 }}>
          <div className="sa-mono" style={{ fontSize: 11, fontWeight: 300, color: 'var(--sa-ink-2)', letterSpacing: '0.03em' }}>
            {meta}
          </div>
          {info && (
            <button onClick={() => setOpen(o => !o)} style={{
              width: 22, height: 22, borderRadius: 100, flexShrink: 0,
              border: `1px solid ${open ? 'var(--sa-accent)' : 'var(--sa-rule-hi)'}`,
              background: open ? 'var(--sa-accent)' : 'transparent',
              color: open ? '#14110e' : 'var(--sa-ink-3)',
              fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 11,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1, padding: 0,
            }}>i</button>
          )}
        </div>
      </div>
      <AnimatePresence>
        {open && info && (
          <motion.div
            key="info"
            variants={INFO_VARIANTS}
            initial="initial" animate="animate" exit="exit"
            style={{ padding: '2px 0 14px', overflow: 'hidden' }}
          >
            <div style={{
              fontSize: 13, color: 'var(--sa-ink-2)', lineHeight: 1.65,
              fontFamily: 'Newsreader, serif', fontStyle: 'italic',
              padding: '14px 16px', background: 'var(--sa-bg-2)',
              borderRadius: 14, border: '1px solid var(--sa-rule)',
            }}>
              {info}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ComposeScreen({ state }) {
  const { mode, groups, workout, setTab } = state

  if (!workout) {
    return (
      <div className="sa-app" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="sa-serif-it" style={{ color: 'var(--sa-ink-3)', fontSize: 16 }}>No path composed yet.</span>
      </div>
    )
  }

  const { warmup, main, abs, notes } = workout
  const isStr = mode === 'str'

  // Group main exercises by muscle group
  const groupedMain = groups.map(g => {
    const pool = (isStr ? STR_POOL : DEF_POOL)[g] || []
    const poolKeys = new Set(pool.map(([key]) => key))
    return { group: g, items: main.filter(ex => poolKeys.has(ex.key)) }
  }).filter(g => g.items.length > 0)

  const totalEx   = main.length + abs.length + warmup.length
  const totalSets = main.reduce((acc, ex) => {
    const spec = isStr ? ex.s : ex.d
    const m = spec && spec.match(/^(\d+)/)
    return acc + (m ? parseInt(m[1]) : 3)
  }, 0)

  const groupLabels = groups.map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(' & ')

  function handleStart() {
    state.goDeep()
  }

  return (
    <div className="sa-app" data-sa-mode={mode}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div className="sa-aura" />

      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
        <span className="sa-tap" onClick={() => setTab(state.workoutSource === 'path' ? 'path' : 'tonight')}>
          <SaIcon name="back" size={20} color="var(--sa-ink-2)" />
        </span>
        <SaModeTag mode={mode} />
        <span style={{ width: 20 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 28px 140px' }}>

        {/* Title */}
        <div className="sa-enter" style={{ marginBottom: 32 }}>
          <div className="sa-label" style={{ marginBottom: 12 }}>Tonight's itinerary</div>
          <div className="sa-serif" style={{ fontSize: 38, lineHeight: 1, marginBottom: 6 }}>
            {groupLabels},
          </div>
          <div className="sa-serif" style={{ fontSize: 38, lineHeight: 1, color: 'var(--sa-ink-2)' }}>
            <em style={{ fontStyle: 'italic', color: 'var(--sa-accent)' }}>
              {state.slotIdx !== undefined ? ['fifteen', 'thirty', 'forty-five', 'sixty', 'seventy-five', 'ninety', 'a hundred five', 'a hundred twenty'][Math.min(state.slotIdx, 7)] : 'sixty'} minutes.
            </em>
          </div>
        </div>

        {/* Stats pills */}
        <div className="sa-enter" style={{ display: 'flex', gap: 8, marginBottom: 36, animationDelay: '0.1s' }}>
          {[
            { k: 'EXERCISES', v: totalEx },
            { k: 'SETS',      v: totalSets },
            { k: 'FINISH',    v: '~' + new Date(Date.now() + SLOTS[state.slotIdx].v * 60000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) },
          ].map(s => (
            <div key={s.k} style={{ flex: 1, padding: '14px 16px', background: 'var(--sa-bg-2)', borderRadius: 18, border: '1px solid var(--sa-rule)' }}>
              <div className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-3)', marginBottom: 6 }}>{s.k}</div>
              <div style={{ fontFamily: 'Newsreader, serif', fontWeight: 300, fontSize: s.k === 'FINISH' ? 14 : 22, paddingTop: s.k === 'FINISH' ? 5 : 0 }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Phase I — Warmup */}
        <SaPhase n="I" label="Wake the body" subtitle={`${warmup.length * 3} minutes · warmup`} delay={0.15}>
          {warmup.map((w, i) => (
            <SaItineraryRow key={i} title={w.n} meta={w.sets} info={w.i} />
          ))}
        </SaPhase>

        {/* Phase II — Main work */}
        <SaPhase n="II" label="The work" subtitle={`${Math.round(SLOTS[state.slotIdx].v * 0.7)} minutes · main block`} delay={0.2}>
          {groupedMain.map((g, gi) => (
            <div key={gi} style={{ marginBottom: gi < groupedMain.length - 1 ? 20 : 0 }}>
              <div className="sa-serif-it" style={{ fontSize: 17, color: 'var(--sa-accent)', marginBottom: 10, marginTop: 6 }}>
                {g.group.toLowerCase()}.
              </div>
              {g.items.map((ex, ei) => (
                <SaItineraryRow
                  key={ei}
                  title={ex.n}
                  meta={isStr ? ex.s.split(' (')[0] : ex.d.split(' (')[0]}
                  info={ex.i}
                />
              ))}
            </div>
          ))}
        </SaPhase>

        {/* Phase III — Core */}
        <SaPhase n="III" label="The floor" subtitle="8 minutes · core" delay={0.25}>
          <div className="sa-serif-it" style={{ fontSize: 17, color: 'var(--sa-accent)', marginBottom: 10, marginTop: 6 }}>
            {abs[0]?.sessionLabel?.toLowerCase() || 'core circuit'}.
          </div>
          {abs.map((ex, ei) => (
            <SaItineraryRow
              key={ei}
              title={ex.n}
              meta={isStr ? ex.s.split(' (')[0] : ex.d.split(' (')[0]}
              sub={ex.role}
              info={ex.i}
            />
          ))}
        </SaPhase>

        {/* Coach note */}
        {notes && notes[0] && (
          <div className="sa-enter" style={{
            margin: '32px 0 16px', padding: '24px 22px',
            background: 'linear-gradient(180deg, var(--sa-accent-aura), transparent)',
            border: '1px solid var(--sa-rule)',
            borderRadius: 22,
            animationDelay: '0.3s',
          }}>
            <div className="sa-label" style={{ fontSize: 9, marginBottom: 10 }}>A NOTE FOR TONIGHT</div>
            <div className="sa-serif-it" style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--sa-ink-1)' }}>
              {notes[0]}
            </div>
          </div>
        )}
      </div>

      <SaFloatingDock>
        <button className="sa-cta" onClick={handleStart}>
          Settle in
          <span className="arrow"><SaIcon name="arrowSm" size={16} color="#14110e" /></span>
        </button>
      </SaFloatingDock>
    </div>
  )
}
