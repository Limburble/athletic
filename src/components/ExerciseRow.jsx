import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function ChevronIcon({ open }) {
  return (
    <motion.svg
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9"/>
    </motion.svg>
  )
}

const ROLE_LABEL = { overload: 'Overload', builder: 'Builder', finisher: 'Finisher' }

export default function ExerciseRow({ ex, mode, delay = 0 }) {
  const [open, setOpen] = useState(false)
  const prescription = mode === 'str' ? (ex.s || ex.d) : ex.d

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay, ease: [0.16, 1, 0.3, 1] }}
      className="ex-row"
    >
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.9rem 1.1rem',
          gap: '0.75rem',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {ex.role && (
            <div style={{
              fontSize: '0.5rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: ex.role === 'overload'
                ? 'var(--accent-hi)'
                : ex.role === 'builder'
                ? 'var(--text-2)'
                : 'var(--text-3)',
              marginBottom: '0.15rem',
              transition: 'color 0.5s ease',
            }}>
              {ROLE_LABEL[ex.role] || ex.role}
            </div>
          )}
          <div style={{
            fontSize: '0.97rem',
            fontWeight: 500,
            color: 'var(--text-1)',
            lineHeight: 1.3,
            transition: 'color 0.5s ease',
          }}>
            {ex.n}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0 }}>
          <span style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '1rem',
            letterSpacing: '0.04em',
            color: 'var(--accent-hi)',
            transition: 'color 0.5s ease',
          }}>
            {prescription}
          </span>
          <span style={{ color: 'var(--text-3)' }}>
            <ChevronIcon open={open} />
          </span>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="info"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0.875rem 1.1rem 1rem',
              borderTop: '1px solid var(--border)',
              background: 'rgba(0,0,0,0.08)',
            }}>
              <p style={{
                fontSize: '0.82rem',
                lineHeight: 1.75,
                color: 'var(--text-2)',
                fontStyle: 'italic',
                margin: 0,
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
