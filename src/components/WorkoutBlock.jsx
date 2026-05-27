import React from 'react'
import { motion } from 'framer-motion'
import ExerciseRow from './ExerciseRow'

export default function WorkoutBlock({ title, tag, exercises, mode, delay = 0, footer }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.38, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: '0.875rem',
        background: 'var(--surface-1)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      {/* Block header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.875rem 1.1rem 0.75rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: '1rem',
          letterSpacing: '0.1em',
          color: 'var(--accent-hi)',
          transition: 'color 0.5s ease',
        }}>
          {title}
        </span>
        <span style={{
          fontSize: '0.5rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--accent-hi)',
          border: '1px solid var(--accent)',
          padding: '0.18rem 0.5rem',
          borderRadius: 100,
          opacity: 0.65,
          transition: 'color 0.5s ease, border-color 0.5s ease',
        }}>
          {tag}
        </span>
      </div>

      {exercises.map((ex, i) => (
        <ExerciseRow
          key={ex.key || ex.n || i}
          ex={ex}
          mode={mode}
          delay={delay + i * 0.035}
        />
      ))}

      {footer && (
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {footer}
        </div>
      )}
    </motion.div>
  )
}
