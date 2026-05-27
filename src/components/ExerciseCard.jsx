import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function ExerciseCard({ ex, mode, dark, delay = 0, roleLabel, accentColor }) {
  const [open, setOpen] = useState(false)
  const prescription = mode === 'str' ? (ex.s || ex.d) : ex.d
  const textPrimary = dark ? 'rgba(255,255,255,0.90)' : 'rgba(10,12,20,0.88)'
  const textSecondary = dark ? 'rgba(255,255,255,0.42)' : 'rgba(10,12,20,0.42)'
  const textMuted = dark ? 'rgba(255,255,255,0.28)' : 'rgba(10,12,20,0.28)'

  const roleColors = {
    overload: accentColor,
    builder:  dark ? 'rgba(255,255,255,0.5)' : 'rgba(10,12,20,0.45)',
    finisher: dark ? 'rgba(255,255,255,0.35)' : 'rgba(10,12,20,0.3)',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      className="ex-row-glass"
      style={{ borderRadius: 0 }}
    >
      {/* Main row */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.9rem 1.1rem',
          cursor: 'pointer',
          gap: '0.75rem',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {roleLabel && (
            <div style={{
              fontSize: '0.5rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: roleColors[ex.role] || textMuted,
              marginBottom: '0.2rem',
              transition: 'color 0.5s ease',
            }}>
              {ex.role || roleLabel}
            </div>
          )}
          <div style={{
            fontSize: '1rem',
            fontWeight: 500,
            color: textPrimary,
            lineHeight: 1.3,
            transition: 'color 0.5s ease',
          }}>
            {ex.n}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '1.05rem',
            letterSpacing: '0.04em',
            color: accentColor,
            transition: 'color 0.5s ease',
          }}>
            {prescription}
          </div>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <ChevronDown size={15} style={{ color: textMuted }} strokeWidth={1.8} />
          </motion.div>
        </div>
      </div>

      {/* Expandable info */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="info"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0.875rem 1.1rem 1rem',
              borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(10,12,20,0.06)'}`,
              background: dark ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.25)',
            }}>
              <p style={{
                fontSize: '0.82rem',
                lineHeight: 1.75,
                color: textSecondary,
                fontStyle: 'italic',
                margin: 0,
                transition: 'color 0.5s ease',
              }}>
                {ex.i}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
