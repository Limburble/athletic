import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HIIT_EXERCISES } from '../data/exercises'

export default function TimerScreen({ state, dark }) {
  const {
    hiitMode, setHiitMode,
    hiitWork, setHiitWork,
    hiitRest, setHiitRest,
    hiitRounds, setHiitRounds,
    hiitExIds, setHiitExIds,
    preloaded, setPreloaded,
    mode,
  } = state

  const isStr = mode === 'str'

  // Timer state
  const [phase,   setPhase]   = useState('idle')  // idle|work|rest|done
  const [seconds, setSeconds] = useState(hiitWork)
  const [round,   setRound]   = useState(1)
  const [exIdx,   setExIdx]   = useState(0)
  const [running, setRunning] = useState(false)
  const [fsOpen,  setFsOpen]  = useState(false)
  const intervalRef = useRef(null)

  const exList = HIIT_EXERCISES.filter(e => hiitExIds.includes(e.id))
  const curEx  = hiitMode === 'queue' && exList.length > 0
    ? exList[exIdx % exList.length] : null
  const maxSec = phase === 'rest' ? hiitRest : hiitWork
  const pct    = phase === 'idle' ? 1 : Math.max(0, seconds / maxSec)

  // Phase → fullscreen bg class
  const fsClass = phase === 'done' ? 'done'
    : phase === 'rest' ? (isStr ? 'rest-str' : 'rest-def')
    : (isStr ? 'work-str' : 'work-def')

  function tick() {
    setSeconds(prev => {
      if (prev <= 1) { advancePhase(); return 0 }
      return prev - 1
    })
  }

  function advancePhase() {
    setPhase(prev => {
      if (prev === 'work') {
        setSeconds(hiitRest)
        return 'rest'
      }
      // rest done — advance
      setExIdx(ei => {
        const next = ei + 1
        if (hiitMode === 'queue' && exList.length > 0 && next % exList.length === 0) {
          setRound(r => {
            const nr = r + 1
            if (nr > hiitRounds) { finish(); return r }
            return nr
          })
        } else {
          setRound(r => {
            const nr = r + 1
            if (hiitMode !== 'queue' && nr > hiitRounds) { finish(); return r }
            return nr
          })
        }
        return next
      })
      setSeconds(hiitWork)
      return 'work'
    })
  }

  function finish() {
    clearInterval(intervalRef.current)
    setRunning(false)
    setPhase('done')
  }

  function openTimer() {
    setPhase('work')
    setSeconds(hiitWork)
    setRound(1)
    setExIdx(0)
    setRunning(true)
    setFsOpen(true)
  }

  function togglePause() {
    setRunning(r => !r)
  }

  function resetTimer() {
    clearInterval(intervalRef.current)
    setRunning(false)
    setPhase('idle')
    setSeconds(hiitWork)
    setRound(1)
    setExIdx(0)
    setFsOpen(false)
  }

  function skipPhase() {
    advancePhase()
  }

  useEffect(() => {
    if (running && phase !== 'done' && phase !== 'idle') {
      intervalRef.current = setInterval(tick, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, phase, hiitWork, hiitRest])

  useEffect(() => {
    if (phase === 'idle') setSeconds(hiitWork)
  }, [hiitWork])

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  const accentHi = isStr ? '#d98c24' : '#63b356'

  const glassCard = {
    borderRadius: 20,
    overflow: 'hidden',
    background: 'var(--surface-1)',
    backdropFilter: 'blur(28px) saturate(180%)',
    WebkitBackdropFilter: 'blur(28px) saturate(180%)',
    border: '1px solid var(--border)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.08)',
    marginBottom: '0.875rem',
  }

  const sLabel = {
    fontSize: '0.58rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--accent-hi)',
    marginBottom: '0.75rem',
    transition: 'color 0.5s ease',
  }

  return (
    <>
      {/* ── FULLSCREEN TIMER OVERLAY ── */}
      <AnimatePresence>
        {fsOpen && (
          <motion.div
            className={`timer-fs ${fsClass}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            {/* Progress strip */}
            <div className="timer-strip">
              <motion.div
                className="timer-strip-fill"
                animate={{ width: `${pct * 100}%` }}
                transition={{ duration: 0.9, ease: 'linear' }}
              />
            </div>

            {/* Close button */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={resetTimer}
              style={{
                position: 'absolute',
                top: 'calc(var(--safe-top) + 1.25rem)',
                left: '1.375rem',
                width: 36, height: 36,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.55)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </motion.button>

            {/* Main content */}
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              flex: 1, width: '100%',
              padding: '2rem 1.5rem',
              gap: '0.5rem',
            }}>
              {/* Phase label */}
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: phase === 'work' ? accentHi : 'rgba(255,255,255,0.4)',
                  marginBottom: '0.5rem',
                }}
              >
                {phase === 'done' ? 'Complete' : running ? phase : 'Paused'}
              </motion.div>

              {/* Time */}
              <motion.div
                animate={{
                  scale: phase === 'work' && seconds <= 3 && seconds > 0 && running
                    ? [1, 0.93, 1] : 1,
                }}
                transition={{ duration: 0.4, repeat: phase === 'work' && seconds <= 3 ? Infinity : 0 }}
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: curEx ? '19vw' : '24vw',
                  lineHeight: 1,
                  color: 'rgba(255,255,255,0.95)',
                  letterSpacing: '0.02em',
                  textAlign: 'center',
                  transition: 'font-size 0.3s ease',
                }}
              >
                {phase === 'done' ? 'DONE' : `${mm}:${ss}`}
              </motion.div>

              {/* Exercise name */}
              {curEx && (
                <div style={{
                  fontSize: '1.25rem',
                  fontFamily: 'Bebas Neue, sans-serif',
                  letterSpacing: '0.06em',
                  color: 'rgba(255,255,255,0.75)',
                  textAlign: 'center',
                  marginTop: '0.25rem',
                }}>
                  {curEx.n}
                </div>
              )}

              {/* Round */}
              <div style={{
                fontSize: '0.62rem',
                letterSpacing: '0.18em',
                color: 'rgba(255,255,255,0.3)',
                marginTop: '0.5rem',
              }}>
                {phase === 'done'
                  ? `${hiitRounds} rounds complete`
                  : `Round ${round} of ${hiitRounds}`}
              </div>
            </div>

            {/* Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              paddingBottom: 'calc(var(--safe-bottom) + 2.5rem)',
            }}>
              {/* Reset */}
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={resetTimer}
                style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  color: 'rgba(255,255,255,0.55)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
                </svg>
              </motion.button>

              {/* Play/Pause */}
              <motion.button
                whileTap={{ scale: 0.91 }}
                onClick={phase === 'done' ? resetTimer : togglePause}
                style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: phase === 'done'
                    ? 'rgba(255,255,255,0.1)'
                    : `var(--accent)`,
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: phase === 'done' ? 'none' : '0 8px 28px var(--accent-glow)',
                  transition: 'background 0.5s ease, box-shadow 0.5s ease',
                }}
              >
                {phase === 'done' ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10"/>
                    <path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
                  </svg>
                ) : running ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                  </svg>
                ) : (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21"/>
                  </svg>
                )}
              </motion.button>

              {/* Skip */}
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={skipPhase}
                style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  color: 'rgba(255,255,255,0.55)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5,4 15,12 5,20"/>
                  <rect x="17" y="4" width="2" height="16"/>
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CONFIG SCREEN ── */}
      <motion.div
        key="timer-cfg"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        style={{ padding: '0.25rem 1.25rem 2rem' }}
      >
        {/* Mode tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
          {[['free','Free Timer'],['queue','Exercise Queue']].map(([id, label]) => (
            <motion.button
              key={id}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setHiitMode(id); setPreloaded(false) }}
              style={{
                flex: 1, padding: '0.65rem',
                borderRadius: 14,
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '0.9rem', letterSpacing: '0.08em',
                cursor: 'pointer',
                background: hiitMode === id
                  ? 'var(--accent)'
                  : 'var(--surface-1)',
                border: `1px solid ${hiitMode === id ? 'transparent' : 'var(--border)'}`,
                color: hiitMode === id ? 'white' : 'var(--text-2)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: hiitMode === id ? '0 4px 16px var(--accent-glow)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.34,1.2,0.64,1)',
              }}
            >
              {label}
            </motion.button>
          ))}
        </div>

        {/* Preloaded badge */}
        {preloaded && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              ...glassCard,
              padding: '0.65rem 1rem',
              marginBottom: '0.875rem',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              borderLeft: '3px solid var(--accent)',
              color: accentHi,
              fontSize: '0.72rem', letterSpacing: '0.08em',
            }}
          >
            ⚡ Pre-loaded from Core Block
          </motion.div>
        )}

        {/* Intervals */}
        <div style={{ ...glassCard, padding: '1rem 1.25rem' }}>
          <div style={sLabel}>Intervals</div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
            {[
              { label:'Work', val:hiitWork, set:setHiitWork, step:5, min:5 },
              { label:'Rest', val:hiitRest, set:setHiitRest, step:5, min:5 },
              { label:'Rounds', val:hiitRounds, set:setHiitRounds, step:1, min:1 },
            ].map(({ label, val, set, step, min }) => (
              <div key={label} style={{ flex:1, textAlign:'center' }}>
                <div style={{ fontSize:'0.52rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--text-3)', marginBottom:'0.35rem' }}>
                  {label}
                </div>
                <div style={{
                  fontFamily:'Bebas Neue, sans-serif',
                  fontSize:'2rem', lineHeight:1,
                  color:'var(--text-1)',
                  marginBottom:'0.45rem',
                }}>
                  {val}{label !== 'Rounds' && <span style={{ fontSize:'0.7rem', color:'var(--text-3)' }}>s</span>}
                </div>
                <div style={{ display:'flex', gap:'0.3rem', justifyContent:'center' }}>
                  {[-1,1].map(d => (
                    <motion.button
                      key={d}
                      whileTap={{ scale: 0.88 }}
                      onClick={() => set(v => Math.max(min, v + d * step))}
                      style={{
                        width:30, height:30,
                        borderRadius:9,
                        background:'var(--surface-1)',
                        border:'1px solid var(--border)',
                        color:'var(--text-1)',
                        fontSize:'1.05rem',
                        cursor:'pointer',
                        display:'flex', alignItems:'center', justifyContent:'center',
                      }}
                    >
                      {d > 0 ? '+' : '−'}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exercise queue */}
        {hiitMode === 'queue' && exList.length > 0 && (
          <div style={{ ...glassCard }}>
            <div style={{ padding:'0.875rem 1.1rem 0.5rem' }}>
              <div style={sLabel}>Queue</div>
            </div>
            {exList.map((ex, i) => (
              <div key={ex.id} style={{
                display:'flex', alignItems:'center', gap:'0.75rem',
                padding:'0.75rem 1.1rem',
                borderTop:'1px solid var(--border)',
              }}>
                <span style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:'0.95rem', color:'var(--text-3)', width:'1.5rem', textAlign:'center' }}>
                  {i + 1}
                </span>
                <span style={{ fontSize:'0.88rem', color:'var(--text-1)', flex:1 }}>{ex.n}</span>
                <span style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:'0.85rem', color:'var(--text-3)' }}>
                  {ex.work}s/{ex.rest}s
                </span>
                <button
                  onClick={() => setHiitExIds(ids => ids.filter(x => x !== ex.id))}
                  style={{ background:'transparent', border:'none', color:'var(--text-3)', cursor:'pointer', fontSize:'1.1rem', padding:'0.2rem' }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Exercise picker */}
        <div style={{ ...glassCard, padding:'1rem 1.25rem' }}>
          <div style={sLabel}>{hiitMode === 'queue' ? 'Add Exercises' : 'Exercise Library'}</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
            {HIIT_EXERCISES.map(ex => {
              const on = hiitExIds.includes(ex.id)
              return (
                <motion.button
                  key={ex.id}
                  whileTap={{ scale:0.92 }}
                  onClick={() => setHiitExIds(ids => on ? ids.filter(x => x !== ex.id) : [...ids, ex.id])}
                  className={`chip${on ? ' on' : ''}`}
                >
                  {ex.n}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Summary + start */}
        <div style={{ ...glassCard, padding:'0.75rem 1.1rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:'0.6rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--text-3)' }}>
            Est. Total
          </span>
          <span style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:'1rem', color:'var(--accent-hi)' }}>
            ~{Math.round((hiitWork + hiitRest) * hiitRounds / 60)} min
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={openTimer}
          className="btn-primary"
          style={{
            background: 'var(--accent)',
            boxShadow: '0 8px 28px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.2)',
            color: 'white',
          }}
        >
          <span>Start Session</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ opacity:0.8 }}>
            <polygon points="5,3 19,12 5,21"/>
          </svg>
        </motion.button>
      </motion.div>
    </>
  )
}
