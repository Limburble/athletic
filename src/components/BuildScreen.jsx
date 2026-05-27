import React from 'react'
import { motion } from 'framer-motion'
import StepCard from './StepCard'
import Picker from './Picker'
import { MUSCLES, SLOTS } from '../data/exercises'

function ModeToggle({ mode, onToggle, dark }) {
  const isStr = mode === 'str'
  const halfW = 105

  return (
    <div className="toggle-track" style={{ width: halfW * 2 + 6 }} onClick={onToggle}>
      <motion.div
        className="toggle-thumb"
        style={{ width: halfW, left: 3 }}
        animate={{ x: isStr ? halfW : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      />
      {['Definition', 'Strength'].map((label, i) => {
        const active = (i === 0 && !isStr) || (i === 1 && isStr)
        return (
          <div key={label} className="toggle-label" style={{
            width: halfW,
            color: active ? 'white' : 'var(--text-2)',
          }}>
            {label}
          </div>
        )
      })}
    </div>
  )
}

export default function BuildScreen({ state, dark }) {
  const {
    activeStep, advanceStep,
    slotIdx, setSlotIdx,
    groups, toggleGroup,
    mode, toggleMode,
    compile,
  } = state

  const hasGroups = groups.length > 0
  const isStr = mode === 'str'

  // Step summaries
  const timeSummary = SLOTS[slotIdx].l
  const musclesSummary = groups.length > 0
    ? groups.map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(', ')
    : null
  const modeSummary = isStr ? 'Strength' : 'Definition'

  function stepStatus(n) {
    if (activeStep === n) return 'active'
    if (activeStep > n)   return 'done'
    return 'locked'
  }

  return (
    <motion.div
      key="build"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      style={{ padding: '0.5rem 1.25rem 2rem' }}
    >

      {/* ── STEP 1: TIME ── */}
      <StepCard
        stepNum={1}
        title="Session Duration"
        summary={timeSummary}
        status={stepStatus(0)}
        onHeaderClick={() => advanceStep(0)}
        dark={dark}
      >
        <Picker slotIdx={slotIdx} setSlotIdx={setSlotIdx} dark={dark} />
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => advanceStep(1)}
          className="btn-primary accent-bg"
          style={{
            marginTop: '1rem',
            color: 'white',
            fontSize: '1.1rem',
          }}
        >
          <span>Set Duration</span>
          <span style={{ opacity: 0.7 }}>→</span>
        </motion.button>
      </StepCard>

      {/* ── STEP 2: MUSCLES ── */}
      <StepCard
        stepNum={2}
        title="Target Muscles"
        summary={musclesSummary}
        status={stepStatus(1)}
        onHeaderClick={() => advanceStep(1)}
        dark={dark}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {MUSCLES.map(m => {
            const on = groups.includes(m.id)
            return (
              <motion.button
                key={m.id}
                whileTap={{ scale: 0.91 }}
                onClick={() => toggleGroup(m.id)}
                className={`chip${on ? ' on' : ''}`}
              >
                {m.l}
              </motion.button>
            )
          })}
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => hasGroups && advanceStep(2)}
          className="btn-primary"
          disabled={!hasGroups}
          style={{
            background: hasGroups ? 'var(--accent)' : undefined,
            boxShadow: hasGroups ? '0 6px 24px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.2)' : undefined,
            color: hasGroups ? 'white' : undefined,
          }}
        >
          <span>Select Muscles</span>
          <span style={{ opacity: 0.7 }}>→</span>
        </motion.button>
        {!hasGroups && (
          <p style={{
            fontSize: '0.62rem',
            color: 'var(--text-3)',
            textAlign: 'center',
            marginTop: '0.5rem',
            letterSpacing: '0.1em',
          }}>
            Select at least one group
          </p>
        )}
      </StepCard>

      {/* ── STEP 3: MODE ── */}
      <StepCard
        stepNum={3}
        title="Training Mode"
        summary={modeSummary}
        status={stepStatus(2)}
        onHeaderClick={() => advanceStep(2)}
        dark={dark}
      >
        {/* Mode description */}
        <div style={{
          marginBottom: '1.25rem',
          padding: '0.875rem 1rem',
          borderRadius: 14,
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
        }}>
          <div style={{
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--accent-hi)',
            marginBottom: '0.3rem',
            transition: 'color 0.5s ease',
          }}>
            {isStr ? 'Strength' : 'Definition'}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.55 }}>
            {isStr
              ? '3–6 reps · 80–90% 1RM · 2–3 min rest · Neural adaptation focus'
              : '8–15 reps · 60–80% 1RM · 60–90s rest · Hypertrophy focus'}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <ModeToggle mode={mode} onToggle={toggleMode} dark={dark} />
        </div>

        {/* Compile */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={compile}
          className="btn-primary"
          style={{
            background: 'var(--accent)',
            boxShadow: '0 8px 28px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.2)',
            color: 'white',
          }}
        >
          <span>Build My Workout</span>
          <span style={{ opacity: 0.75 }}>→</span>
        </motion.button>
      </StepCard>
    </motion.div>
  )
}
