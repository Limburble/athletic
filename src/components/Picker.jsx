import React, { useRef, useEffect, useCallback } from 'react'
import { SLOTS } from '../data/exercises'

<<<<<<< HEAD
const ITEM_H = 44

export default function Picker({ slotIdx, setSlotIdx, dark }) {
  const scrollRef = useRef()
=======
export default function Picker({ slotIdx, setSlotIdx, dark }) {
  const scrollRef = useRef()
  const ITEM_H = 44
>>>>>>> f70bf3ebf97c6e10827c63b28d6e9c392955b2d9

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = slotIdx * ITEM_H
    }
  }, [])

  const onScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const idx = Math.max(0, Math.min(SLOTS.length - 1, Math.round(el.scrollTop / ITEM_H)))
    if (idx !== slotIdx) setSlotIdx(idx)
  }, [slotIdx, setSlotIdx])

  const scrollTo = (idx) => {
    scrollRef.current?.scrollTo({ top: idx * ITEM_H, behavior: 'smooth' })
    setSlotIdx(idx)
  }

<<<<<<< HEAD
  return (
    <div className="picker-wrap">
      {/* Fade top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 70, zIndex: 2,
        pointerEvents: 'none',
        background: dark
          ? 'linear-gradient(to bottom, rgba(8,9,15,0.96), transparent)'
          : 'linear-gradient(to bottom, rgba(240,242,247,0.96), transparent)',
        transition: 'background 0.55s ease',
      }} />
      {/* Fade bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, zIndex: 2,
        pointerEvents: 'none',
        background: dark
          ? 'linear-gradient(to top, rgba(8,9,15,0.96), transparent)'
          : 'linear-gradient(to top, rgba(240,242,247,0.96), transparent)',
        transition: 'background 0.55s ease',
      }} />
      {/* Selection line */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '1.25rem', right: '1.25rem',
        height: ITEM_H, marginTop: -ITEM_H / 2,
        border: '1px solid var(--border-hi)',
        borderRadius: 12,
        background: 'var(--surface-1)',
=======
  const textColor = dark ? 'rgba(255,255,255,OPACITY)' : 'rgba(10,12,20,OPACITY)'

  return (
    <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
      {/* Fade top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 78, zIndex: 2, pointerEvents: 'none',
        background: dark
          ? 'linear-gradient(to bottom, rgba(7,10,18,0.95), transparent)'
          : 'linear-gradient(to bottom, rgba(238,241,247,0.95), transparent)',
      }} />
      {/* Fade bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 78, zIndex: 2, pointerEvents: 'none',
        background: dark
          ? 'linear-gradient(to top, rgba(7,10,18,0.95), transparent)'
          : 'linear-gradient(to top, rgba(238,241,247,0.95), transparent)',
      }} />
      {/* Selection highlight */}
      <div style={{
        position: 'absolute', top: '50%', left: '1.5rem', right: '1.5rem',
        height: ITEM_H, marginTop: -ITEM_H / 2,
        border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(10,12,20,0.08)'}`,
        borderRadius: 12,
        background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(10,12,20,0.04)',
>>>>>>> f70bf3ebf97c6e10827c63b28d6e9c392955b2d9
        pointerEvents: 'none', zIndex: 3,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }} />
<<<<<<< HEAD
=======

>>>>>>> f70bf3ebf97c6e10827c63b28d6e9c392955b2d9
      <div
        ref={scrollRef}
        className="picker-scroll"
        onScroll={onScroll}
<<<<<<< HEAD
        style={{
          height: '100%',
          padding: `${180 / 2 - ITEM_H / 2}px 0`,
        }}
      >
        {SLOTS.map((s, i) => {
          const dist = Math.abs(i - slotIdx)
          const opacity = dist === 0 ? 1 : dist === 1 ? 0.4 : 0.18
          const scale = dist === 0 ? 1 : dist === 1 ? 0.91 : 0.83
          const fontSize = dist === 0 ? '1.7rem' : '1.3rem'
=======
        style={{ height: '100%', padding: `${(200 / 2) - ITEM_H / 2}px 0` }}
      >
        {SLOTS.map((s, i) => {
          const dist = Math.abs(i - slotIdx)
          const opacity = dist === 0 ? 1 : dist === 1 ? 0.45 : 0.2
          const scale = dist === 0 ? 1 : dist === 1 ? 0.92 : 0.85
          const fontSize = dist === 0 ? '1.75rem' : '1.35rem'
>>>>>>> f70bf3ebf97c6e10827c63b28d6e9c392955b2d9
          return (
            <div
              key={s.l}
              className="picker-item"
              onClick={() => scrollTo(i)}
              style={{
                height: ITEM_H,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize, letterSpacing: '0.06em',
<<<<<<< HEAD
                color: `rgba(${dark ? '255,255,255' : '8,9,15'},${opacity})`,
                transform: `scale(${scale})`,
                transition: 'all 0.22s ease',
=======
                color: dark ? `rgba(255,255,255,${opacity})` : `rgba(10,12,20,${opacity})`,
                transform: `scale(${scale})`,
                transition: 'all 0.2s ease',
>>>>>>> f70bf3ebf97c6e10827c63b28d6e9c392955b2d9
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              {s.l}
            </div>
          )
        })}
      </div>
    </div>
  )
}
