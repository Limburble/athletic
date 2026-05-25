import React from 'react'
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
            transition: 'color 0.5s ease',
          }}>
            Athlet
          </span>
          <span style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '1.65rem',
            fontWeight: 300,
            fontStyle: 'italic',
            color: accentColor,
            alignSelf: 'flex-end',
            marginBottom: '0.22rem',
            transition: 'color 0.5s ease',
          }}>
            ic
          </span>
        </div>
        <div style={{
          fontSize: '0.6rem',
          letterSpacing: '0.06em',
          color: dark ? 'rgba(255,255,255,0.35)' : 'rgba(10,12,20,0.4)',
          marginTop: '0.2rem',
          transition: 'color 0.5s ease',
        }}>
          {isStr ? 'Heavy. Intentional. Yours.' : 'Grounded. Loaded. Yours.'}
        </div>
      </div>

      {/* Dark/light toggle */}
      <motion.button
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
      </motion.button>
    </motion.div>
  )
}
