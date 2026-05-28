import React, { useState, useEffect, useRef, useMemo } from 'react'
import { SaIcon } from './SanctuaryAtoms'

function parseSets(spec) {
  if (!spec) return 3
  const m = spec.match(/^(\d+)/)
  return m ? parseInt(m[1]) : 3
}

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

function parseReps(spec) {
  if (!spec) return null
  const m = spec.match(/×\s*([\d–\-]+)/)
  return m ? m[1] : null
}

export default function DeepScreen({ state }) {
  const { mode, workout, goCool, setTab, groups } = state
  const isStr         = mode === 'str'
  const isSingleGroup = (groups || []).length <= 1
  const restFactor    = isSingleGroup ? 0.7 : 1.0

  const allExercises = useMemo(() =>
    workout ? [...(workout.main || []), ...(workout.abs || [])] : [],
    [workout])

  const exerciseData = useMemo(() => allExercises.map(ex => {
    const spec    = isStr ? ex.s : ex.d
    const total   = parseSets(spec)
    const restSec = Math.round(parseRestSec(spec) * restFactor)
    const reps    = parseReps(spec)
    const key     = ex.key || ex.n
    return { key, name: ex.n, spec, total, restSec, reps }
  }), [allExercises, isStr, restFactor])

  const t = useRef({
    exIdx:     0,
    phase:     'work', // 'work' | 'rest' | 'done'
    timeLeft:  0,
    running:   false,
    completed: {},     // { [key]: completedSetCount }
  })
  const [, re] = useState(0)
  const tick = () => re(n => n + 1)

  const [confirmExit, setConfirmExit] = useState(false)

  // Rest countdown
  useEffect(() => {
    const id = setInterval(() => {
      const s = t.current
      if (s.phase !== 'rest' || !s.running) return
      s.timeLeft -= 1
      if (s.timeLeft <= 0) {
        advanceAfterRest()
      } else {
        tick()
      }
    }, 1000)
    return () => clearInterval(id)
  }, [exerciseData])

  function advanceAfterRest() {
    const s  = t.current
    const ex = exerciseData[s.exIdx]
    if (!ex) { s.phase = 'done'; s.running = false; tick(); return }

    const done = s.completed[ex.key] || 0
    if (done < ex.total) {
      s.phase   = 'work'
      s.running = false
    } else if (s.exIdx + 1 < exerciseData.length) {
      s.exIdx  += 1
      s.phase   = 'work'
      s.running = false
    } else {
      s.phase   = 'done'
      s.running = false
    }
    tick()
  }

  function markSetDone() {
    const s  = t.current
    const ex = exerciseData[s.exIdx]
    if (!ex || s.phase !== 'work') return

    s.completed[ex.key] = (s.completed[ex.key] || 0) + 1
    const done     = s.completed[ex.key]
    const lastEx   = s.exIdx >= exerciseData.length - 1
    const lastSet  = done >= ex.total

    if (lastEx && lastSet) {
      s.phase   = 'done'
      s.running = false
    } else {
      s.phase    = 'rest'
      s.timeLeft = ex.restSec
      s.running  = true
    }
    tick()
  }

  function skipSet() {
    const s  = t.current
    const ex = exerciseData[s.exIdx]
    if (!ex || s.phase !== 'work') return
    // Advance without crediting
    const done    = s.completed[ex.key] || 0
    const lastEx  = s.exIdx >= exerciseData.length - 1
    const lastSet = done + 1 >= ex.total

    if (lastEx && lastSet) {
      s.phase = 'done'; s.running = false
    } else if (done + 1 >= ex.total) {
      // Last set of this exercise — skip to next
      s.exIdx += 1; s.phase = 'work'; s.running = false
    } else {
      // More sets in this exercise — move to next set without credit
      // Treat as if this set was done for advancement purposes
      // We'll fake the count temporarily for advancement only
      const fake = { ...s.completed, [ex.key]: done + 1 }
      s.completed = fake  // advance the completed count so advanceAfterRest works
      s.phase = 'rest'; s.timeLeft = ex.restSec; s.running = true
    }
    tick()
  }

  function skipRest() {
    const s = t.current
    if (s.phase !== 'rest') return
    s.timeLeft = 0
    s.running  = false
    advanceAfterRest()
  }

  function toggleRestPause() {
    const s = t.current
    if (s.phase !== 'rest') return
    s.running = !s.running
    tick()
  }

  function handleClose() {
    if (!confirmExit) {
      setConfirmExit(true)
      setTimeout(() => setConfirmExit(false), 3000)
      return
    }
    setTab('tonight')
  }

  function handleDone() {
    const completedSets = exerciseData.map(ex => ({
      key:       ex.key,
      name:      ex.name,
      completed: t.current.completed[ex.key] || 0,
      total:     ex.total,
    }))
    goCool(completedSets)
  }

  const s       = t.current
  const isDone  = s.phase === 'done'
  const isRest  = s.phase === 'rest'
  const isWork  = s.phase === 'work'
  const currEx  = exerciseData[s.exIdx]

  // What comes after current rest?
  const doneForCurr    = currEx ? (s.completed[currEx.key] || 0) : 0
  const hasMoreSets    = currEx && doneForCurr < currEx.total
  const nextAfterRest  = !hasMoreSets ? exerciseData[s.exIdx + 1] : null

  // Overall progress
  const totalSets = exerciseData.reduce((a, e) => a + e.total, 0)
  const doneSets  = Object.values(s.completed).reduce((a, b) => a + b, 0)
  const pct       = isDone ? 100 : (doneSets / Math.max(totalSets, 1)) * 100

  return (
    <div className="sa-app" data-sa-mode={mode} style={{
      height: '100%',
      background: isRest ? 'var(--sa-bg-0)' : 'var(--sa-bg-1)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div className="sa-aura" style={{ opacity: isWork ? 1 : 0.4 }} />

      {/* Progress thread */}
      <div style={{ position: 'relative', padding: '14px 24px 0' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.05)' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: 'var(--sa-accent)',
            boxShadow: '0 0 12px var(--sa-accent-glow)',
            transition: 'width 0.8s var(--sa-settle)',
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
            {isDone ? 'Complete' : isRest ? 'Rest' : 'In the work'}
          </span>
          <span style={{ width: 20 }} />
        </div>
      </div>

      {/* ── DONE ── */}
      {isDone && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px' }}>
          <div style={{
            fontFamily: 'Newsreader, serif', fontWeight: 200, fontSize: 160,
            lineHeight: 0.85, color: 'var(--sa-ink-1)',
            textShadow: '0 0 60px var(--sa-accent-glow)', position: 'relative',
          }}>✓</div>
          <div className="sa-serif-it" style={{ fontSize: 22, color: 'var(--sa-ink-2)', marginTop: 28, position: 'relative' }}>
            you can let go.
          </div>
          <button className="sa-tap" onClick={handleDone} style={{
            marginTop: 48, padding: '18px 48px', borderRadius: 100, border: 'none',
            background: 'var(--sa-cool)', cursor: 'pointer',
            fontFamily: 'Newsreader, serif', fontStyle: 'italic',
            fontSize: 17, color: '#14110e',
            boxShadow: '0 12px 40px var(--sa-cool-glow)',
            position: 'relative',
          }}>
            Cool down →
          </button>
        </div>
      )}

      {/* ── REST ── */}
      {isRest && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px' }}>
          <div className="sa-label" style={{ marginBottom: 12, color: 'var(--sa-ink-4)', letterSpacing: '0.12em' }}>REST</div>

          <div style={{
            fontFamily: 'Newsreader, serif', fontWeight: 200,
            fontSize: 180, letterSpacing: '-0.05em', lineHeight: 0.85,
            color: 'var(--sa-ink-1)', fontVariantNumeric: 'tabular-nums',
            textShadow: '0 0 40px var(--sa-accent-glow)',
            animation: 'sa-breath 8s var(--sa-breathe) infinite',
          }}>
            {String(s.timeLeft).padStart(2, '0')}
          </div>

          <div className="sa-serif-it" style={{ fontSize: 16, color: 'var(--sa-ink-3)', textAlign: 'center', marginTop: 20, minHeight: 24 }}>
            {hasMoreSets
              ? `set ${doneForCurr + 1} of ${currEx?.total} up next.`
              : nextAfterRest
                ? `next · ${nextAfterRest.name.toLowerCase()}.`
                : ''}
          </div>

          <div style={{ marginTop: 36, display: 'flex', gap: 10 }}>
            <button className="sa-tap" onClick={toggleRestPause} style={{
              padding: '10px 22px', borderRadius: 100,
              border: '1px solid var(--sa-rule-hi)', background: 'transparent',
              fontFamily: 'Newsreader, serif', fontStyle: 'italic',
              fontSize: 14, color: 'var(--sa-ink-2)', cursor: 'pointer',
            }}>
              {s.running ? 'Pause' : 'Resume'}
            </button>
            <button className="sa-tap" onClick={skipRest} style={{
              padding: '10px 22px', borderRadius: 100,
              border: '1px solid var(--sa-rule)', background: 'transparent',
              fontFamily: 'Newsreader, serif', fontStyle: 'italic',
              fontSize: 14, color: 'var(--sa-ink-3)', cursor: 'pointer',
            }}>
              Skip rest
            </button>
          </div>
        </div>
      )}

      {/* ── WORK ── */}
      {isWork && currEx && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', position: 'relative' }}>
          <div className="sa-aura" />

          {/* Exercise label */}
          <div className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-4)', marginBottom: 14, position: 'relative' }}>
            EXERCISE {s.exIdx + 1} OF {exerciseData.length}
          </div>

          {/* Exercise name */}
          <div className="sa-serif-it" style={{
            fontSize: 30, color: 'var(--sa-ink-1)',
            textAlign: 'center', lineHeight: 1.1,
            marginBottom: 28, position: 'relative',
          }}>
            {currEx.name.toLowerCase()}.
          </div>

          {/* Set pips */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, position: 'relative' }}>
            {Array.from({ length: currEx.total }).map((_, i) => {
              const isDoneSet    = i < doneForCurr
              const isCurrentSet = i === doneForCurr
              return (
                <div key={i} style={{
                  width:      isCurrentSet ? 28 : 10,
                  height:     10,
                  borderRadius: 100,
                  background: isDoneSet || isCurrentSet ? 'var(--sa-accent)' : 'rgba(255,255,255,0.1)',
                  opacity:    isDoneSet ? 0.6 : 1,
                  boxShadow:  isCurrentSet ? '0 0 14px var(--sa-accent-glow)' : 'none',
                  transition: 'all 0.4s var(--sa-settle)',
                }} />
              )
            })}
          </div>

          <div className="sa-label" style={{ fontSize: 10, color: 'var(--sa-ink-3)', marginBottom: 24, position: 'relative' }}>
            SET {doneForCurr + 1} OF {currEx.total}
          </div>

          {/* Reps + rest pill */}
          {currEx.reps && (
            <div style={{
              position: 'relative', marginBottom: 36,
              padding: '10px 20px', borderRadius: 100,
              background: 'var(--sa-bg-2)', border: '1px solid var(--sa-rule)',
            }}>
              <span className="sa-mono" style={{ fontSize: 12, color: 'var(--sa-ink-2)' }}>
                {currEx.reps} reps · {currEx.restSec}s rest
              </span>
            </div>
          )}

          {/* Done button */}
          <button className="sa-tap" onClick={markSetDone} style={{
            width: 88, height: 88, borderRadius: 100, border: 'none',
            background: 'var(--sa-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 12px 40px var(--sa-accent-glow), inset 0 1px 0 rgba(255,255,255,0.25)',
            position: 'relative', cursor: 'pointer',
            transition: 'transform 0.15s var(--sa-settle)',
          }}>
            <SaIcon name="check" size={32} color="#14110e" />
          </button>
          <div className="sa-label" style={{ fontSize: 9, marginTop: 12, color: 'var(--sa-ink-4)', position: 'relative' }}>
            TAP WHEN SET IS DONE
          </div>

          <button className="sa-tap" onClick={skipSet} style={{
            marginTop: 20, padding: '8px 20px',
            background: 'transparent', border: 'none',
            fontFamily: 'Newsreader, serif', fontStyle: 'italic',
            fontSize: 13, color: 'var(--sa-ink-4)', cursor: 'pointer',
          }}>
            skip set
          </button>
        </div>
      )}

      {/* Exercise progress dots */}
      {!isDone && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '0 28px 44px', position: 'relative' }}>
          {exerciseData.slice(0, 12).map((ex, i) => {
            const allDone = (s.completed[ex.key] || 0) >= ex.total
            const current = i === s.exIdx
            return (
              <div key={ex.key} style={{
                width:        current ? 20 : 6,
                height:       4,
                borderRadius: 100,
                background:   allDone
                  ? 'var(--sa-accent)'
                  : current
                    ? 'var(--sa-accent)'
                    : 'rgba(255,255,255,0.08)',
                opacity:      allDone ? 0.7 : 1,
                boxShadow:    current ? '0 0 8px var(--sa-accent-glow)' : 'none',
                transition:   'all 0.5s var(--sa-settle)',
              }} />
            )
          })}
        </div>
      )}
    </div>
  )
}
