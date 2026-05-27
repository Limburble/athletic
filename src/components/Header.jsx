import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
      <line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

export default function Header({ mode, dark, setDark }) {
  const isStr = mode === 'str'

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingTop: 'calc(var(--safe-top) + 2.25rem)',
        paddingBottom: '1rem',
        paddingLeft: '1.375rem',
        paddingRight: '1.375rem',
      }}
    >
      {/* Wordmark */}
      <div>
        <div className="t-label" style={{ marginBottom: '0.3rem' }}>
          Training App
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '2.9rem',
            lineHeight: 0.88,
            color: 'var(--text-1)',
            letterSpacing: '0.015em',
            transition: 'color 0.5s ease',
          }}>
            Athlet
          </span>
          <span style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '1.55rem',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--accent-hi)',
            marginLeft: '0.05rem',
            alignSelf: 'flex-end',
            marginBottom: '0.18rem',
            transition: 'color 0.5s ease',
          }}>
            ic
          </span>
        </div>
        <div style={{
          fontSize: '0.7rem',
          color: 'var(--text-2)',
          marginTop: '0.18rem',
          letterSpacing: '0.04em',
          transition: 'color 0.5s ease',
        }}>
          Your training, structured.
        </div>
      </div>

      {/* Dark/light toggle */}
      <motion.button
        whileTap={{ scale: 0.86 }}
        onClick={() => {
          setDark(d => !d)
          document.documentElement.setAttribute('data-dark', dark ? 'false' : 'true')
        }}
        style={{
          width: 36, height: 36,
          borderRadius: '50%',
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          cursor: 'pointer',
          color: 'var(--text-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.3s ease, border-color 0.3s ease',
          flexShrink: 0,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={dark ? 'moon' : 'sun'}
            initial={{ rotate: -20, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 20, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2 }}
          >
            {dark ? <MoonIcon /> : <SunIcon />}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </motion.div>
  )
}
