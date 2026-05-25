import React from 'react'
import { motion } from 'framer-motion'
import WorkoutBlock from './WorkoutBlock'
import { SLOTS } from '../data/exercises'
import { Zap } from 'lucide-react'

export default function ResultScreen({ state, dark }) {
  const { workout, mode, slotIdx, groups, setBuildScreen, compile, preConfigHIIT } = state
  if (!workout) return null

  const isStr = mode === 'str'
  const accentColor = isStr ? '#C47B1A' : '#3D6B35'
  const accentLight = isStr ? '#E09030' : '#5A9E4A'
  const textPrimary = dark ? 'rgba(255,255,255,0.88)' : 'rgba(10,12,20,0.85)'
  const textMuted = dark ? 'rgba(255,255,255,0.38)' : 'rgba(10,12,20,0.38)'

  const warmupExes = workout.warmup.map((w, i) => ({ ...w, key: `wu-${i}`, d: w.sets, s: w.sets }))

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ padding: '0.25rem 1.25rem 1.5rem' }}
    >
      {/* Session header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.25rem',
          paddingBottom: '1rem',
          borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(10,12,20,0.07)'}`,
        }}
      >
        <div>
          <div style={{
            fontSize: '0.52rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: accentColor,
            marginBottom: '0.2rem',
            transition: 'color 0.5s ease',
          }}>
            Session compiled
          </div>
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '1.9rem',
            letterSpacing: '0.03em',
            color: textPrimary,
            lineHeight: 1,
            transition: 'color 0.5s ease',
          }}>
            {groups.join(' + ').toUpperCase()}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '1rem',
            color: accentColor,
            letterSpacing: '0.06em',
            transition: 'color 0.5s ease',
          }}>
            {SLOTS[slotIdx].l}
          </div>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: textMuted, textTransform: 'uppercase' }}>
            {isStr ? 'Strength' : 'Definition'}
          </div>
        </div>
      </motion.div>

      {/* Warmup */}
      <WorkoutBlock
        title="Warmup Protocol"
        tag="warmup"
        exercises={warmupExes}
        mode={mode}
        dark={dark}
        accentColor={accentLight}
        delay={0.05}
      />

      {/* Main */}
      <WorkoutBlock
        title="Main Session"
        tag="main"
        exercises={workout.main}
        mode={mode}
        dark={dark}
        accentColor={accentColor}
        delay={0.1}
      />

      {/* Core block with pre-config HIIT button */}
      <WorkoutBlock
        title="Core Block"
        tag={workout.abs[0]?.sessionLabel || 'core'}
        exercises={workout.abs}
        mode={mode}
        dark={dark}
        accentColor={accentColor}
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
              color: accentColor,
              fontSize: '0.78rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              transition: 'color 0.5s ease',
            }}
          >
            <Zap size={14} strokeWidth={2} />
            Pre-Config HIIT from Core
            <span style={{ marginLeft: 'auto', opacity: 0.6 }}>→</span>
          </motion.button>
        }
      />

      {/* Notes */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          borderRadius: 20,
          padding: '1rem 1.1rem',
          background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)'}`,
          marginBottom: '1rem',
        }}
      >
        <div style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: '0.9rem',
          letterSpacing: '0.1em',
          color: isStr ? '#C06030' : '#8B3A1A',
          marginBottom: '0.6rem',
        }}>
          Field Notes
        </div>
        {workout.notes.map((n, i) => (
          <p key={i} style={{
            fontSize: '0.8rem',
            lineHeight: 1.7,
            color: textMuted,
            fontStyle: 'italic',
            margin: '0 0 0.25rem',
          }}>
            — {n}
          </p>
        ))}
      </motion.div>

      {/* Bottom buttons */}
      <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
        <motion.button
          onClick={() => setBuildScreen('config')}
          whileTap={{ scale: 0.96 }}
          style={{
            flex: 1, padding: '0.9rem',
            borderRadius: 16,
            background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(10,12,20,0.05)',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(10,12,20,0.08)'}`,
            color: textMuted,
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
          onClick={compile}
          whileTap={{ scale: 0.96 }}
          style={{
            flex: 1, padding: '0.9rem',
            borderRadius: 16,
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}40`,
            color: accentLight,
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
