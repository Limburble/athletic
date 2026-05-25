import React, { useEffect, useRef } from 'react'

export default function MeshBackground({ mode, dark }) {
  const orb1Ref = useRef()
  const orb2Ref = useRef()
  const orb3Ref = useRef()

  const isDef = mode === 'def'

  const colors = isDef
    ? { o1: '#1a3d1a', o2: '#0d2a1f', o3: '#162d16' }
    : { o1: '#3d2000', o2: '#2a1500', o3: '#1f0f00' }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden" style={{ background: dark ? '#070a12' : '#eef1f7' }}>
      {/* Orb 1 — large, top-left */}
      <div
        ref={orb1Ref}
        className="mesh-orb animate-mesh-slow"
        style={{
          width: '70vw', height: '70vw',
          top: '-15vw', left: '-20vw',
          background: `radial-gradient(circle, ${colors.o1} 0%, transparent 70%)`,
          opacity: dark ? 0.9 : 0.35,
        }}
      />
      {/* Orb 2 — medium, bottom-right */}
      <div
        ref={orb2Ref}
        className="mesh-orb animate-mesh-slow2"
        style={{
          width: '60vw', height: '60vw',
          bottom: '-10vw', right: '-15vw',
          background: `radial-gradient(circle, ${colors.o2} 0%, transparent 70%)`,
          opacity: dark ? 0.85 : 0.3,
        }}
      />
      {/* Orb 3 — small, mid */}
      <div
        ref={orb3Ref}
        className="mesh-orb"
        style={{
          width: '40vw', height: '40vw',
          top: '40%', left: '30%',
          background: `radial-gradient(circle, ${colors.o3} 0%, transparent 70%)`,
          opacity: dark ? 0.6 : 0.2,
          animation: 'meshMove 18s ease-in-out infinite alternate',
        }}
      />
      {/* Subtle noise overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
