import React from 'react'
import { motion } from 'framer-motion'
<<<<<<< HEAD
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
=======
import ExerciseCard from './ExerciseCard'

export default function WorkoutBlock({ title, tag, exercises, mode, dark, accentColor, delay = 0, footer }) {
  const textMuted = dark ? 'rgba(255,255,255,0.35)' : 'rgba(10,12,20,0.35)'

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: '1rem',
        background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.7)'}`,
        boxShadow: dark
          ? '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
          : '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
>>>>>>> f70bf3ebf97c6e10827c63b28d6e9c392955b2d9
      }}
    >
      {/* Block header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.875rem 1.1rem 0.75rem',
<<<<<<< HEAD
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
=======
        borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(10,12,20,0.06)'}`,
      }}>
        <div style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: '1.05rem',
          letterSpacing: '0.1em',
          color: accentColor,
          transition: 'color 0.5s ease',
        }}>
          {title}
        </div>
        <div style={{
          fontSize: '0.5rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: accentColor,
          border: `1px solid ${accentColor}55`,
          padding: '0.18rem 0.5rem',
          borderRadius: 100,
          opacity: 0.7,
          transition: 'color 0.5s ease, border-color 0.5s ease',
        }}>
          {tag}
        </div>
      </div>

      {/* Exercises */}
      {exercises.map((ex, i) => (
        <ExerciseCard
          key={ex.key || ex.n || i}
          ex={ex}
          mode={mode}
          dark={dark}
          delay={delay + i * 0.04}
          roleLabel={ex.role}
          accentColor={accentColor}
        />
      ))}

      {/* Optional footer slot */}
      {footer && (
        <div style={{
          borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(10,12,20,0.06)'}`,
        }}>
>>>>>>> f70bf3ebf97c6e10827c63b28d6e9c392955b2d9
          {footer}
        </div>
      )}
    </motion.div>
  )
}
