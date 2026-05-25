import React from 'react'
import { motion } from 'framer-motion'

export default function ModeToggle({ mode, onToggle, dark }) {
  const isStr = mode === 'str'
  const accentColor = isStr ? '#C47B1A' : '#3D6B35'

  return (
    <div
      className="mode-toggle-track flex"
      onClick={onToggle}
      style={{ width: 220, height: 42, padding: 2 }}
    >
      <motion.div
        className="mode-toggle-thumb"
        animate={{ x: isStr ? '100%' : '0%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        style={{ background: accentColor }}
      />
      {['Definition', 'Strength'].map((label, i) => {
        const active = (i === 0 && !isStr) || (i === 1 && isStr)
        return (
          <div
            key={label}
            style={{
              position: 'relative', zIndex: 2,
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '0.9rem', letterSpacing: '0.1em',
              color: active
                ? 'rgba(255,255,255,0.95)'
                : dark ? 'rgba(255,255,255,0.4)' : 'rgba(10,12,20,0.4)',
              transition: 'color 0.3s ease',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {label}
          </div>
        )
      })}
    </div>
  )
}
