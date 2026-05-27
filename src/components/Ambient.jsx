import React from 'react'

export default function Ambient({ mode, dark }) {
  const isDef = mode === 'def'
  const c1 = isDef ? '#0d2a12' : '#2a1200'
  const c2 = isDef ? '#061a0a' : '#1a0a00'
  const c3 = isDef ? '#0a1f0d' : '#1f0d00'

  return (
    <div className="ambient">
      <div style={{
        position: 'absolute', inset: 0,
        background: dark ? 'var(--bg)' : '#eef1f7',
        transition: 'background 0.55s ease',
      }} />
      <div className="ambient-orb" style={{
        width: '65vw', height: '65vw',
        top: '-12vw', left: '-18vw',
        background: `radial-gradient(circle, ${c1} 0%, transparent 72%)`,
        opacity: dark ? 0.9 : 0.3,
        animation: 'orbFloat1 14s ease-in-out infinite alternate',
      }} />
      <div className="ambient-orb" style={{
        width: '55vw', height: '55vw',
        bottom: '-8vw', right: '-14vw',
        background: `radial-gradient(circle, ${c2} 0%, transparent 72%)`,
        opacity: dark ? 0.85 : 0.28,
        animation: 'orbFloat2 17s ease-in-out infinite alternate',
      }} />
      <div className="ambient-orb" style={{
        width: '38vw', height: '38vw',
        top: '42%', left: '28%',
        background: `radial-gradient(circle, ${c3} 0%, transparent 72%)`,
        opacity: dark ? 0.55 : 0.18,
        animation: 'orbFloat3 20s ease-in-out infinite alternate',
      }} />
    </div>
  )
}
