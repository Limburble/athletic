import React from 'react'
import { motion } from 'framer-motion'
import WorkoutBlock from './WorkoutBlock'
import { SLOTS } from '../data/exercises'
import { Zap } from 'lucide-react'

export default function ResultScreen({ state, dark }) {
  const { workout, mode, slotIdx, groups, reset, compile, preConfigHIIT } = state
  if (!workout) return null

  const isStr = mode === 'str'
  const warmupExes = workout.warmup.map((w, i) => ({
    ...w, key: `wu-${i}`, d: w.sets, s: w.sets,
  }))

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ padding: '0.5rem 1.25rem 2rem' }}
    >
      {/* Session header */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.25rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div>
          <div className="t-label" style={{ marginBottom: '0.25rem' }}>
            Session compiled
          </div>
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '1.85rem',
            letterSpacing: '0.03em',
            color: 'var(--text-1)',
            lineHeight: 1,
          }}>
            {groups.join(' + ').toUpperCase()}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '1rem',
            color: 'var(--accent-hi)',
            letterSpacing: '0.06em',
            transition: 'color 0.5s ease',
          }}>
            {SLOTS[slotIdx].l}
          </div>
          <div className="t-label" style={{ marginTop: '0.1rem' }}>
            {isStr ? 'Strength' : 'Definition'}
          </div>
        </div>
      </motion.div>

      <WorkoutBlock
        title="Warmup Protocol"
        tag="warmup"
        exercises={warmupExes}
        mode={mode}
        delay={0.05}
      />

      <WorkoutBlock
        title="Main Session"
        tag="main"
        exercises={workout.main}
        mode={mode}
        delay={0.1}
      />

      <WorkoutBlock
        title="Core Block"
        tag={workout.abs[0]?.sessionLabel || 'core'}
        exercises={workout.abs}
        mode={mode}
        delay={0.15}
        footer={
          <motion.button
            onClick={preConfigHIIT}
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%',
              padding: '0.85rem 1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--accent-hi)',
              fontSize: '0.78rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              transition: 'color 0.5s ease',
            }}
          >
            <Zap size={13} strokeWidth={2.2} />
            Pre-Config HIIT from Core
            <span style={{ marginLeft: 'auto', opacity: 0.55, fontSize: '0.85rem' }}>→</span>
          </motion.button>
        }
      />

      {/* Notes */}
      <motion.div
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.38, delay: 0.2 }}
        style={{
          borderRadius: 18,
          padding: '1rem 1.1rem',
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          marginBottom: '1rem',
        }}
      >
        <div style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: '0.9rem',
          letterSpacing: '0.1em',
          color: 'rgba(160,82,45,0.85)',
          marginBottom: '0.6rem',
        }}>
          Field Notes
        </div>
        {workout.notes.map((n, i) => (
          <p key={i} style={{
            fontSize: '0.8rem',
            lineHeight: 1.7,
            color: 'var(--text-2)',
            fontStyle: 'italic',
            margin: '0 0 0.2rem',
          }}>
            — {n}
          </p>
        ))}
      </motion.div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={reset}
          style={{
            flex: 1, padding: '0.9rem',
            borderRadius: 16,
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
            color: 'var(--text-2)',
            fontSize: '0.72rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          ← New Session
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={compile}
          style={{
            flex: 1, padding: '0.9rem',
            borderRadius: 16,
            background: 'var(--accent-dim)',
            border: '1px solid var(--accent)',
            color: 'var(--accent-hi)',
            fontSize: '0.72rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            transition: 'all 0.5s ease',
          }}
        >
          Recompile ↺
        </motion.button>
      </div>
    </motion.div>
  )
}
