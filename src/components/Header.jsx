import React from 'react'
<<<<<<< HEAD
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
=======
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

export default function Header({ mode, dark, setDark }) {
  const isStr = mode === 'str'
  const accentColor = isStr ? '#C47B1A' : '#5A9E4A'

  return (
    <motion.div
      className="relative z-20 flex items-end justify-between px-5 pb-4"
      style={{ paddingTop: 'calc(var(--safe-top) + 2.5rem)' }}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Logo */}
      <div>
        <div style={{
          fontFamily: 'SF Mono, Fira Code, monospace',
          fontSize: '0.52rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: accentColor,
          marginBottom: '0.25rem',
          opacity: 0.85,
          transition: 'color 0.5s ease',
        }}>
          Training App
        </div>
        <div className="flex items-baseline gap-0.5">
          <span style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '3.2rem',
            lineHeight: 0.88,
            color: dark ? 'rgba(255,255,255,0.95)' : 'rgba(10,12,20,0.92)',
            letterSpacing: '0.01em',
>>>>>>> f70bf3ebf97c6e10827c63b28d6e9c392955b2d9
            transition: 'color 0.5s ease',
          }}>
            Athlet
          </span>
          <span style={{
            fontFamily: 'Fraunces, serif',
<<<<<<< HEAD
            fontSize: '1.55rem',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--accent-hi)',
            marginLeft: '0.05rem',
            alignSelf: 'flex-end',
            marginBottom: '0.18rem',
=======
            fontSize: '1.65rem',
            fontWeight: 300,
            fontStyle: 'italic',
            color: accentColor,
            alignSelf: 'flex-end',
            marginBottom: '0.22rem',
>>>>>>> f70bf3ebf97c6e10827c63b28d6e9c392955b2d9
            transition: 'color 0.5s ease',
          }}>
            ic
          </span>
        </div>
        <div style={{
<<<<<<< HEAD
          fontSize: '0.7rem',
          color: 'var(--text-2)',
          marginTop: '0.18rem',
          letterSpacing: '0.04em',
          transition: 'color 0.5s ease',
        }}>
          Your training, structured.
=======
          fontSize: '0.6rem',
          letterSpacing: '0.06em',
          color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(10,12,20,0.4)',
          marginTop: '0.2rem',
          transition: 'color 0.5s ease',
        }}>
          {isStr ? 'Heavy. Intentional. Yours.' : 'Grounded. Loaded. Yours.'}
>>>>>>> f70bf3ebf97c6e10827c63b28d6e9c392955b2d9
        </div>
      </div>

      {/* Dark/light toggle */}
      <motion.button
<<<<<<< HEAD
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
=======
        whileTap={{ scale: 0.88 }}
        onClick={() => setDark(d => !d)}
        className="relative flex items-center justify-center"
        style={{
          width: 38, height: 38,
          borderRadius: '50%',
          background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(10,12,20,0.08)',
          border: `1px solid ${dark ? 'rgba(255,255,255,0.18)' : 'rgba(10,12,20,0.12)'}`,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          cursor: 'pointer',
          color: dark ? 'rgba(255,255,255,0.7)' : 'rgba(10,12,20,0.6)',
          transition: 'background 0.3s ease, border-color 0.3s ease',
        }}
      >
        <motion.div
          key={dark ? 'moon' : 'sun'}
          initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {dark ? <Moon size={15} strokeWidth={1.5} /> : <Sun size={15} strokeWidth={1.5} />}
        </motion.div>
>>>>>>> f70bf3ebf97c6e10827c63b28d6e9c392955b2d9
      </motion.button>
    </motion.div>
  )
}
