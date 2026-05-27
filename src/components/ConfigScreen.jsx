import React from 'react'
import { motion } from 'framer-motion'
import Picker from './Picker'
import ModeToggle from './ModeToggle'
import { MUSCLES, SLOTS } from '../data/exercises'

export default function ConfigScreen({ state, dark }) {
  const {
    slotIdx, setSlotIdx, groups, toggleGroup,
    mode, toggleMode, compile,
  } = state

  const isStr = mode === 'str'
  const accentColor = isStr ? '#C47B1A' : '#3D6B35'
  const accentLight = isStr ? '#E09030' : '#5A9E4A'
  const hasGroups = groups.length > 0
  const textPrimary = dark ? 'rgba(255,255,255,0.88)' : 'rgba(10,12,20,0.85)'
  const textMuted = dark ? 'rgba(255,255,255,0.38)' : 'rgba(10,12,20,0.38)'

  const glassCard = {
    borderRadius: 20,
    overflow: 'hidden',
    background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(24px) saturate(160%)',
    WebkitBackdropFilter: 'blur(24px) saturate(160%)',
    border: `1px solid ${dark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.75)'}`,
    boxShadow: dark
      ? '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
      : '0 4px 24px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.85)',
    marginBottom: '1rem',
  }

  const sectionLabel = {
    fontSize: '0.58rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: accentColor,
    marginBottom: '0.65rem',
    transition: 'color 0.5s ease',
  }

  return (
    <motion.div
      key="config"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ padding: '0.25rem 1.25rem 1.5rem' }}
    >
      {/* Time picker */}
      <div style={{ ...glassCard }}>
        <div style={{ padding: '1rem 1.25rem 0.5rem' }}>
          <div style={sectionLabel}>Session Duration</div>
        </div>
        <Picker slotIdx={slotIdx} setSlotIdx={setSlotIdx} dark={dark} />
        {/* Total time badge */}
        <div style={{
          padding: '0.6rem 1.25rem',
          borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(10,12,20,0.06)'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: textMuted }}>
            Selected
          </span>
          <span style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '1rem',
            color: accentColor,
            letterSpacing: '0.06em',
            transition: 'color 0.5s ease',
          }}>
            {SLOTS[slotIdx].l}
          </span>
        </div>
      </div>

      {/* Muscle groups */}
      <div style={{ ...glassCard }}>
        <div style={{ padding: '1rem 1.25rem 0.75rem' }}>
          <div style={sectionLabel}>Target Muscles</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {MUSCLES.map(m => {
              const selected = groups.includes(m.id)
              return (
                <motion.button
                  key={m.id}
                  onClick={() => toggleGroup(m.id)}
                  whileTap={{ scale: 0.92 }}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 100,
                    fontSize: '0.78rem',
                    letterSpacing: '0.06em',
                    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                    cursor: 'pointer',
                    border: selected
                      ? `1px solid ${accentColor}80`
                      : `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(10,12,20,0.1)'}`,
                    background: selected
                      ? `${accentColor}22`
                      : dark ? 'rgba(255,255,255,0.06)' : 'rgba(10,12,20,0.04)',
                    color: selected
                      ? accentLight
                      : textMuted,
                    boxShadow: selected
                      ? `0 0 12px ${accentColor}30, inset 0 1px 0 rgba(255,255,255,0.15)`
                      : 'none',
                    transition: 'all 0.22s cubic-bezier(0.34,1.2,0.64,1)',
                  }}
                >
                  {m.l}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mode toggle */}
      <div style={{ ...glassCard, padding: '1rem 1.25rem' }}>
        <div style={sectionLabel}>Training Mode</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <ModeToggle mode={mode} onToggle={toggleMode} dark={dark} />
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '0.95rem',
            letterSpacing: '0.08em',
            color: accentColor,
            transition: 'color 0.5s ease',
          }}>
            {isStr ? 'Strength' : 'Definition'}
          </div>
        </div>
      </div>

      {/* Compile button */}
      <motion.button
        onClick={compile}
        disabled={!hasGroups}
        whileTap={hasGroups ? { scale: 0.97 } : {}}
        style={{
          width: '100%',
          padding: '1.1rem 1.5rem',
          borderRadius: 18,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: hasGroups ? 'pointer' : 'not-allowed',
          background: hasGroups
            ? `linear-gradient(135deg, ${accentColor}, ${accentLight})`
            : dark ? 'rgba(255,255,255,0.06)' : 'rgba(10,12,20,0.06)',
          boxShadow: hasGroups
            ? `0 8px 24px ${accentColor}50, inset 0 1px 0 rgba(255,255,255,0.25)`
            : 'none',
          transition: 'all 0.4s cubic-bezier(0.34,1.2,0.64,1)',
        }}
      >
        <span style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: '1.3rem',
          letterSpacing: '0.12em',
          color: hasGroups ? 'rgba(255,255,255,0.95)' : textMuted,
          transition: 'color 0.3s ease',
        }}>
          Compile Session
        </span>
        <span style={{
          fontSize: '1.1rem',
          color: hasGroups ? 'rgba(255,255,255,0.8)' : textMuted,
          transition: 'color 0.3s ease',
        }}>
          →
        </span>
      </motion.button>

      {!hasGroups && (
        <p style={{
          textAlign: 'center',
          fontSize: '0.58rem',
          letterSpacing: '0.12em',
          color: textMuted,
          marginTop: '0.5rem',
        }}>
          Select at least one muscle group
        </p>
      )}
    </motion.div>
  )
}
