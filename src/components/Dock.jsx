import React from 'react'
import { motion } from 'framer-motion'
import { Dumbbell, Timer } from 'lucide-react'

const TABS = [
  { id: 'build', label: 'Build', Icon: Dumbbell },
  { id: 'timer', label: 'Timer', Icon: Timer },
]

export default function Dock({ tab, setTab, dark, mode }) {
  const accentColor = mode === 'str' ? '#C47B1A' : '#5A9E4A'

  return (
    <motion.div
      className="relative z-20 flex justify-center"
      style={{ paddingBottom: 'calc(var(--safe-bottom) + 1rem)', paddingTop: '0.5rem' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="dock flex gap-1 p-1.5"
        style={{ borderRadius: 28 }}
      >
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id
          return (
            <motion.button
              key={id}
              onClick={() => setTab(id)}
              whileTap={{ scale: 0.92 }}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.2rem',
                padding: '0.55rem 1.75rem',
                borderRadius: 22,
                background: active ? (dark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.75)') : 'transparent',
                border: active ? `1px solid rgba(255,255,255,0.22)` : '1px solid transparent',
                boxShadow: active ? '0 2px 12px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.2)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.34,1.2,0.64,1)',
              }}
            >
              {/* Active indicator dot */}
              {active && (
                <motion.div
                  layoutId="dock-indicator"
                  style={{
                    position: 'absolute',
                    bottom: 5,
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: accentColor,
                    boxShadow: `0 0 6px ${accentColor}`,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                />
              )}
              <Icon
                size={18}
                strokeWidth={active ? 2 : 1.5}
                style={{
                  color: active ? accentColor : (dark ? 'rgba(255,255,255,0.4)' : 'rgba(10,12,20,0.35)'),
                  transition: 'color 0.3s ease, stroke-width 0.2s ease',
                }}
              />
              <span style={{
                fontSize: '0.6rem',
                letterSpacing: '0.08em',
                fontWeight: active ? 600 : 400,
                color: active ? (dark ? 'rgba(255,255,255,0.9)' : 'rgba(10,12,20,0.85)') : (dark ? 'rgba(255,255,255,0.35)' : 'rgba(10,12,20,0.35)'),
                transition: 'color 0.3s ease',
                textTransform: 'uppercase',
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              }}>
                {label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
