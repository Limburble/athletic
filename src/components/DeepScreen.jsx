import React, { useState, useEffect, useRef, useCallback } from 'react'
import { SaIcon } from './SanctuaryAtoms'

// Work/rest times per mode (seconds)
const WORK_TIME = { def: 45, str: 90 }
const REST_TIME = { def: 20, str: 45 }

export default function DeepScreen({ state }) {
  const { mode, workout, setTab, goCool } = state
  const isStr = mode === 'str'

  // Flatten exercises from workout
  const exList = workout
    ? [...(workout.main || []), ...(workout.abs || [])].map(e => e.n)
    : ['Rest']

  const workSec  = WORK_TIME[mode] || 45
  const restSec  = REST_TIME[mode] || 20
  const totalRds = exList.length

  const [phase,   setPhase]   = useState('work')
  const [timeLeft, setTimeLeft] = useState(workSec)
  const [exIdx,   setExIdx]   = useState(0)
  const [running, setRunning] = useState(true)
  const intervalRef = useRef(null)

  const isWork = phase === 'work'
  const isRest = phase === 'rest'
  const isDone = phase === 'done'

  const totalRound = isWork ? workSec : restSec
  const pct = isDone ? 100 : Math.max(0, ((totalRound - timeLeft) / totalRound) * 100)

  const exName   = exList[exIdx] || ''
  const nextName = exList[exIdx + 1] || null

  const advancePhase = useCallback(() => {
    setPhase(prev => {
      if (prev === 'work') {
        setTimeLeft(restSec)
        return 'rest'
      }
      // rest done — next exercise
      const nextIdx = exIdx + 1
      if (nextIdx >= exList.length) {
        setRunning(false)
        return 'done'
      }
      setExIdx(nextIdx)
      setTimeLeft(workSec)
      return 'work'
    })
  }, [exIdx, exList.length, workSec, restSec])

  useEffect(() => {
    if (running && !isDone) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { advancePhase(); return 0 }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, isDone, advancePhase])

  function togglePause() { setRunning(r => !r) }

  function resetTimer() {
    clearInterval(intervalRef.current)
    setPhase('work')
    setTimeLeft(workSec)
    setExIdx(0)
    setRunning(true)
  }

  function skipPhase() {
    clearInterval(intervalRef.current)
    advancePhase()
  }

  function handleClose() {
    clearInterval(intervalRef.current)
    setTab('tonight')
  }

  function handleDone() {
    clearInterval(intervalRef.current)
    goCool()
  }

  const displayTime = isDone ? '✓' : String(timeLeft).padStart(2, '0')

  return (
    <div className="sa-app" data-sa-mode={mode} style={{
      height: '100%',
      background: isRest ? 'var(--sa-bg-0)' : 'var(--sa-bg-1)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Aura — faster during work */}
      <div className="sa-aura" style={{
        '--aura-duration-a': isWork ? '6s' : '14s',
        opacity: isWork ? 1 : 0.6,
      }} />

      {/* Progress thread at top */}
      <div style={{ position: 'relative', padding: '14px 24px 0' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.05)' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: 'var(--sa-accent)',
            boxShadow: '0 0 12px var(--sa-accent-glow)',
            transition: 'width 0.9s linear',
          }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="sa-tap" onClick={handleClose}>
            <SaIcon name="close" size={20} color="var(--sa-ink-3)" />
          </span>
          <span className="sa-tag">
            <span className="dot" style={{
              animation: isWork ? 'sa-breath 1.8s var(--sa-breathe) infinite' : 'none',
            }} />
            {isDone ? 'Complete' : isWork ? 'In the work' : 'Rest'}
          </span>
          <span className="sa-tap">
            <SaIcon name="waves" size={20} color="var(--sa-ink-3)" />
          </span>
        </div>
      </div>

      {/* Center — number + name */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 28px', position: 'relative',
      }}>
        {/* Breathing halo */}
        <div style={{
          position: 'absolute',
          width: 360, height: 360,
          background: 'radial-gradient(closest-side, var(--sa-accent-aura), transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          animation: `sa-breath ${isWork ? '4s' : '8s'} var(--sa-breathe) infinite`,
        }} />

        {/* Time number */}
        <div style={{
          fontFamily: 'Newsreader, serif',
          fontWeight: 200, fontSize: 260,
          letterSpacing: '-0.05em', lineHeight: 0.85,
          color: 'var(--sa-ink-1)',
          fontVariantNumeric: 'tabular-nums',
          textShadow: '0 0 60px var(--sa-accent-glow)',
          position: 'relative',
        }}>
          {displayTime}
        </div>

        {/* Exercise name */}
        <div className="sa-serif-it" style={{
          fontSize: 22, color: 'var(--sa-ink-2)',
          marginTop: 18, textAlign: 'center', position: 'relative',
        }}>
          {isDone ? 'you can let go.' : exName.toLowerCase() + '.'}
        </div>

        {/* Next label during rest */}
        {isRest && nextName && (
          <div className="sa-label" style={{ fontSize: 10, marginTop: 28, color: 'var(--sa-ink-3)', position: 'relative' }}>
            NEXT · {nextName.toUpperCase()}
          </div>
        )}

        {/* Round count */}
        {!isDone && (
          <div className="sa-label" style={{ fontSize: 9, marginTop: 20, color: 'var(--sa-ink-4)', position: 'relative' }}>
            {exIdx + 1} OF {totalRds}
          </div>
        )}
      </div>

      {/* Round pips */}
      {!isDone && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, padding: '0 0 18px', position: 'relative' }}>
          {Array.from({ length: Math.min(totalRds, 8) }).map((_, i) => (
            <div key={i} style={{
              width: 24, height: 3, borderRadius: 100,
              background: i < exIdx + 1
                ? 'var(--sa-accent)'
                : 'rgba(255,255,255,0.08)',
              boxShadow: i === exIdx ? '0 0 10px var(--sa-accent-glow)' : 'none',
              transition: 'all 0.55s var(--sa-settle)',
            }} />
          ))}
        </div>
      )}

      {/* Controls */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '12px 32px 40px', position: 'relative',
      }}>
        <button className="sa-tap" onClick={resetTimer} style={{
          width: 52, height: 52, borderRadius: 100,
          border: '1px solid var(--sa-rule-hi)',
          background: 'rgba(255,255,255,0.02)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <SaIcon name="reset" size={20} color="var(--sa-ink-2)" />
        </button>

        <button className="sa-tap" onClick={isDone ? handleDone : togglePause} style={{
          width: 88, height: 88, borderRadius: 100, border: 'none',
          background: isDone ? 'var(--sa-cool)' : 'var(--sa-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isDone
            ? '0 12px 40px var(--sa-cool-glow), inset 0 1px 0 rgba(255,255,255,0.25)'
            : '0 12px 40px var(--sa-accent-glow), inset 0 1px 0 rgba(255,255,255,0.25)',
          transition: 'all 0.55s var(--sa-settle)',
        }}>
          {isDone
            ? <SaIcon name="check" size={32} color="#14110e" />
            : running
              ? <SaIcon name="pause_lg" size={28} color="#14110e" />
              : <SaIcon name="play" size={28} color="#14110e" />
          }
        </button>

        <button className="sa-tap" onClick={skipPhase} style={{
          width: 52, height: 52, borderRadius: 100,
          border: '1px solid var(--sa-rule-hi)',
          background: 'rgba(255,255,255,0.02)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <SaIcon name="skip" size={20} color="var(--sa-ink-2)" />
        </button>
      </div>
    </div>
  )
}
