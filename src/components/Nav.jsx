import React from 'react'
import { motion } from 'framer-motion'

const TABS = [
  { id: 'build', label: 'Build' },
  { id: 'timer', label: 'Timer' },
]

export default function Nav({ tab, setTab, dark }) {
  return (
    <div style={{
      display: 'flex',
      gap: '0.25rem',
      padding: '0 1.375rem 0.75rem',
      position: 'relative',
    }}>
      {TABS.map(({ id, label }) => {
        const active = tab === id
        return (
          <motion.button
            key={id}
            onClick={() => setTab(id)}
            whileTap={{ scale: 0.94 }}
            style={{
              position: 'relative',
              padding: '0.45rem 1.1rem',
              borderRadius: 100,
              border: `1px solid ${active ? 'var(--border-hi)' : 'var(--border)'}`,
              background: active ? 'var(--surface-2)' : 'transparent',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: active ? 600 : 400,
              letterSpacing: '0.04em',
              color: active ? 'var(--text-1)' : 'var(--text-3)',
              backdropFilter: active ? 'blur(20px)' : 'none',
              WebkitBackdropFilter: active ? 'blur(20px)' : 'none',
              transition: 'all 0.3s cubic-bezier(0.34,1.2,0.64,1)',
              boxShadow: active
                ? 'inset 0 1px 0 rgba(255,255,255,0.12), 0 2px 8px rgba(0,0,0,0.15)'
                : 'none',
            }}
          >
            {label}
            {active && (
              <motion.div
                layoutId="nav-dot"
                className="nav-indicator"
                style={{ left: '50%', transform: 'translateX(-50%)' }}
                transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
