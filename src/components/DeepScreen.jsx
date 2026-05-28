import React, { useState, useEffect, useRef, useMemo } from 'react'
import { SaIcon } from './SanctuaryAtoms'

// Parse "4 × 8–12 (75s)" → 4
function parseSets(spec) {
  if (!spec) return 3
  const m = spec.match(/^(\d+)/)
  return m ? parseInt(m[1]) : 3
}

// Parse rest from last parenthetical: "(75s)" → 75, "(2 min)" → 120, "(2.5 min)" → 150
function parseRestSec(spec) {
  if (!spec) return 60
  const all = [...spec.matchAll(/\(([^)]+)\)/g)]
  if (!all.length) return 60
  const last = all[all.length - 1][1].trim()
  const minM = last.match(/^([\d.]+)\s*min$/)
  if (minM) return Math.round(parseFloat(minM[1]) * 60)
  const secM = last.match(/^(\d+)s$/)
  if (secM) return parseInt(secM[1])
  return 60
}

// Build a flat list of work/rest intervals from exercises
function buildIntervals(exercises, isStr) {
  const workSec = isStr ? 25 : 40
  const result  = []

  exercises.forEach(ex => {
    const spec      = isStr ? ex.s : ex.d
    const totalSets = parseSets(spec)
    const restSec   = parseRestSec(spec)
    const key       = ex.key || ex.n

    for (let set = 1; set <= totalSets; set++) {
      result.push({ type: 'work', key, name: ex.n, setNum: set, totalSets, workSec })
      // Rest after every set; inter-exercise rest = 15s after last set
      result.push({
        type: 'rest', key, name: ex.n, setNum: set, totalSets,
        restSec: set < totalSets ? restSec : Math.min(restSec, 20),
        interEx: set === totalSets,
      })
    }
  })

  // Drop trailing rest
  while (result.length && result[result.length - 1].type === 'rest') result.pop()
  return result
}

export default function DeepScreen({ state }) {
  const { mode, workout, goCool, setTab } = state
  const isStr = mode === 'str'

  const allExercises = useMemo(() => workout
    ? [...(workout.main || []), ...(workout.abs || [])]
    : [], [workout])

  const intervals = useMemo(
    () => buildIntervals(allExercises, isStr),
    [allExercises, isStr]
  )

  // All timer state in a ref to avoid stale closures in setInterval
  const t = useRef({
    idx:       0,
    timeLeft:  intervals[0]?.workSec ?? 40,
    running:   true,
    completed: {}, // { [key]: count }
  })
  const [, re] = useState(0)
  const tick = () => re(n => n + 1)

  // Exit confirmation state
  const [confirmExit, setConfirmExit] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      const s = t.current
      if (!s.running || s.idx >= intervals.length) return

      s.timeLeft -= 1
      if (s.timeLeft > 0) { tick(); return }

      const curr = intervals[s.idx]
      // Count natural completions of work intervals
      if (curr.type === 'work') {
        s.completed[curr.key] = (s.completed[curr.key] || 0) + 1
      }
      s.idx += 1
      if (s.idx < intervals.length) {
        const next = intervals[s.idx]
        s.timeLeft = next.type === 'work' ? next.workSec : next.restSec
      } else {
        s.timeLeft = 0
      }
      tick()
    }, 1000)
    return () => clearInterval(id)
  }, [intervals])

  function togglePause() { t.current.running = !t.current.running; tick() }

  function skipInterval() {
    const s = t.current
    if (s.idx >= intervals.length) return
    s.idx += 1
    if (s.idx < intervals.length) {
      const next = intervals[s.idx]
      s.timeLeft = next.type === 'work' ? next.workSec : next.restSec
    }
    tick()
  }

  function resetTimer() {
    t.current = { idx: 0, timeLeft: intervals[0]?.workSec ?? 40, running: true, completed: {} }
    tick()
  }

  function buildCompletedSets() {
    return allExercises.map(ex => {
      const key       = ex.key || ex.n
      const spec      = isStr ? ex.s : ex.d
      const total     = parseSets(spec)
      const completed = t.current.completed[key] || 0
      return { key, name: ex.n, completed, total }
    })
  }

  function handleDone() {
    goCool(buildCompletedSets())
  }

  function handleClose() {
    if (!confirmExit) { setConfirmExit(true); setTimeout(() => setConfirmExit(false), 3000); return }
    // Second tap — bail out without saving
    setTab('tonight')
  }

  const s        = t.current
  const isDone   = s.idx >= intervals.length
  const curr     = intervals[s.idx]
  const isWork   = curr?.type === 'work'
  const isRest   = curr?.type === 'rest' || curr?.type === 'inter-rest'
  const timeLeft = s.timeLeft

  const totalWork    = intervals.filter(i => i.type === 'work').length
  const doneWork     = Object.values(s.completed).reduce((a, b) => a + b, 0)
  const pct          = isDone ? 100 : (doneWork / Math.max(totalWork, 1)) * 100

  // Group intervals by exercise to show progress pips
  const exerciseKeys = [...new Set(intervals.filter(i => i.type === 'work').map(i => i.key))]
  const currExKey    = curr?.key

  return (
    <div className="sa-app" data-sa-mode={mode} style={{
      height: '100%',
      background: isRest ? 'var(--sa-bg-0)' : 'var(--sa-bg-1)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div className="sa-aura" style={{ opacity: isWork ? 1 : 0.45 }} />

      {/* Top bar */}
      <div style={{ position: 'relative', padding: '14px 24px 0' }}>
        {/* Overall progress thread */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.05)' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: 'var(--sa-accent)',
            boxShadow: '0 0 12px var(--sa-accent-glow)',
            transition: 'width 1.2s var(--sa-settle)',
          }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="sa-tap" onClick={handleClose}>
            {confirmExit
              ? <span style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 13, color: 'var(--sa-str)' }}>Tap again to exit</span>
              : <SaIcon name="close" size={20} color="var(--sa-ink-3)" />}
          </span>
          <span className="sa-tag">
            <span className="dot" style={{ animation: isWork ? 'sa-breath 1.8s var(--sa-breathe) infinite' : 'none' }} />
            {isDone ? 'Complete' : isWork ? 'In the work' : curr?.interEx ? 'Next exercise' : 'Rest'}
          </span>
          <span style={{ width: 20 }} />
        </div>
      </div>

      {/* Center */}
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

        {/* Timer number */}
        <div style={{
          fontFamily: 'Newsreader, serif',
          fontWeight: 200, fontSize: 240,
          letterSpacing: '-0.05em', lineHeight: 0.85,
          color: 'var(--sa-ink-1)',
          fontVariantNumeric: 'tabular-nums',
          textShadow: '0 0 60px var(--sa-accent-glow)',
          position: 'relative',
        }}>
          {isDone ? '✓' : String(timeLeft).padStart(2, '0')}
        </div>

        {/* Exercise + set label */}
        <div className="sa-serif-it" style={{
          fontSize: 22, color: 'var(--sa-ink-2)',
          marginTop: 18, textAlign: 'center', position: 'relative',
        }}>
          {isDone ? 'you can let go.' : (curr?.name || '').toLowerCase() + '.'}
        </div>

        {!isDone && curr && (
          <div className="sa-label" style={{ fontSize: 10, marginTop: 10, color: 'var(--sa-ink-3)', position: 'relative' }}>
            {isWork
              ? `SET ${curr.setNum} OF ${curr.totalSets}`
              : curr.interEx
                ? (() => {
                    const nextIdx = exerciseKeys.indexOf(curr.key) + 1
                    const nextKey = exerciseKeys[nextIdx]
                    const nextEx  = nextKey && allExercises.find(e => (e.key || e.n) === nextKey)
                    return nextEx ? `NEXT · ${nextEx.n.toUpperCase()}` : 'FINISHING UP'
                  })()
                : `REST · SET ${curr.setNum + 1} OF ${curr.totalSets} UP NEXT`
            }
          </div>
        )}

        {/* Reps hint during work */}
        {isWork && curr && (
          <div style={{ position: 'relative', marginTop: 8, padding: '8px 16px', background: 'var(--sa-bg-2)', borderRadius: 100, border: '1px solid var(--sa-rule)' }}>
            <span className="sa-mono" style={{ fontSize: 11, color: 'var(--sa-ink-2)' }}>
              {(isStr ? allExercises.find(e => (e.key || e.n) === curr.key)?.s : allExercises.find(e => (e.key || e.n) === curr.key)?.d) || ''}
            </span>
          </div>
        )}
      </div>

      {/* Exercise pips */}
      {!isDone && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '0 28px 16px', flexWrap: 'wrap', position: 'relative' }}>
          {exerciseKeys.slice(0, 10).map((key, i) => {
            const done    = s.completed[key] > 0
            const current = key === currExKey
            const ex      = allExercises.find(e => (e.key || e.n) === key)
            const total   = parseSets(isStr ? ex?.s : ex?.d)
            const comp    = s.completed[key] || 0
            return (
              <div key={key} style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                {Array.from({ length: total }).map((_, si) => (
                  <div key={si} style={{
                    width: current && si === comp ? 18 : 8,
                    height: 4, borderRadius: 100,
                    background: si < comp
                      ? 'var(--sa-accent)'
                      : current && si === comp
                        ? 'var(--sa-accent)'
                        : 'rgba(255,255,255,0.08)',
                    opacity: si < comp ? 0.9 : current && si === comp ? 1 : 0.3,
                    boxShadow: current && si === comp ? '0 0 8px var(--sa-accent-glow)' : 'none',
                    transition: 'all 0.55s var(--sa-settle)',
                  }} />
                ))}
              </div>
            )
          })}
        </div>
      )}

      {/* Controls */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '12px 32px 44px', position: 'relative',
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
            : t.current.running
              ? <SaIcon name="pause_lg" size={28} color="#14110e" />
              : <SaIcon name="play" size={28} color="#14110e" />
          }
        </button>

        <button className="sa-tap" onClick={skipInterval} style={{
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
