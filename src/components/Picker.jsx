import React, { useRef, useEffect, useCallback } from 'react'
import { SLOTS } from '../data/exercises'

const ITEM_H = 44

export default function Picker({ slotIdx, setSlotIdx, dark }) {
  const scrollRef = useRef()

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
        pointerEvents: 'none', zIndex: 3,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }} />
      <div
        ref={scrollRef}
        className="picker-scroll"
        onScroll={onScroll}
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
                color: `rgba(${dark ? '255,255,255' : '8,9,15'},${opacity})`,
                transform: `scale(${scale})`,
                transition: 'all 0.22s ease',
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
