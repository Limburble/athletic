import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function StepCard({
  stepNum, title, summary, status, // status: 'active' | 'done' | 'locked'
  onHeaderClick, dark, children,
}) {
  const isActive = status === 'active'
  const isDone   = status === 'done'
  const isLocked = status === 'locked'

  return (
    <motion.div
      layout
      className={`step-card glass ${status}`}
      style={{ marginBottom: '0.75rem' }}
      transition={{ layout: { duration: 0.42, ease: [0.4, 0, 0.2, 1] } }}
    >
      {/* Header — always visible */}
      <div
        onClick={isDone ? onHeaderClick : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem',
          padding: isActive ? '1.1rem 1.25rem 0.75rem' : '0.875rem 1.25rem',
          cursor: isDone ? 'pointer' : 'default',
          transition: 'padding 0.35s ease',
        }}
      >
        {/* Step number bubble */}
        <div style={{
          width: 28, height: 28,
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          background: isActive
            ? 'var(--accent)'
            : isDone
            ? 'var(--accent-dim)'
            : 'var(--surface-1)',
          border: `1px solid ${isActive ? 'transparent' : isDone ? 'var(--accent)' : 'var(--border)'}`,
          transition: 'all 0.4s ease',
          boxShadow: isActive ? '0 0 12px var(--accent-glow)' : 'none',
        }}>
          {isDone ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="var(--accent-hi)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <span style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '0.85rem',
              color: isActive ? 'white' : 'var(--text-3)',
              lineHeight: 1,
              transition: 'color 0.4s ease',
            }}>
              {stepNum}
            </span>
          )}
        </div>

        {/* Title + summary */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: isActive
              ? 'var(--text-1)'
              : isDone
              ? 'var(--text-2)'
              : 'var(--text-3)',
            transition: 'color 0.4s ease',
            marginBottom: summary && !isActive ? '0.1rem' : 0,
          }}>
            {title}
          </div>
          {/* Collapsed summary — shows when done */}
          <AnimatePresence>
            {(isDone || isLocked) && summary && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                style={{
                  fontSize: '0.8rem',
                  color: isDone ? 'var(--accent-hi)' : 'var(--text-3)',
                  letterSpacing: '0.02em',
                  overflow: 'hidden',
                  transition: 'color 0.4s ease',
                }}
              >
                {summary}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Edit indicator on done cards */}
        {isDone && (
          <div style={{
            fontSize: '0.6rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-3)',
          }}>
            Edit
          </div>
        )}
      </div>

      {/* Body — only rendered when active */}
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            key="body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              borderTop: '1px solid var(--border)',
              padding: '1rem 1.25rem 1.25rem',
            }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
