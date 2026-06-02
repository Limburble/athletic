import React, { useState, useEffect, useRef, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SaIcon } from './SanctuaryAtoms'
import MuscleMap, { EX_MUSCLES, muscleLabel } from './MuscleMap'

const INFO_VARIANTS = {
  initial: { opacity: 0, y: -6, scale: 0.98 },
  animate: { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] } },
}

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
  const { mode, workout, goCool, setTab, groups, store } = state
  const prefs = store?.prefs || {}
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
    return { key, name: ex.n, spec, total, restSec, reps, info: ex.i || null }
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
  const [showInfo,    setShowInfo]    = useState(false)
  const [popAnim,     setPopAnim]     = useState(false)

  // Screen wake lock — hold screen on while DeepScreen is mounted
  const wakeLock = useRef(null)
  useEffect(() => {
    if (!prefs.keepOn || !('wakeLock' in navigator)) return
    const acquire = async () => {
      try { wakeLock.current = await navigator.wakeLock.request('screen') } catch {}
    }
    acquire()
    const onVisibility = () => {
      if (document.visibilityState === 'visible') acquire()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      wakeLock.current?.release()
      wakeLock.current = null
    }
  }, [])

  function haptic(pattern) {
    if (!prefs.haptics || !navigator.vibrate) return
    navigator.vibrate(pattern)
  }

  // Rest countdown
  useEffect(() => {
    const id = setInterval(() => {
      const s = t.current
      if (s.phase !== 'rest' || !s.running) return
      s.timeLeft -= 1
      if (s.timeLeft <= 0) {
        advanceAfterRest()
      } else {
        if (s.timeLeft === 3) haptic([30])
        tick()
      }
    }, 1000)
    return () => clearInterval(id)
  }, [exerciseData])

  function advanceAfterRest() {
    haptic([40, 80, 40])
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
      setShowInfo(false)
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

    haptic([50])
    s.completed[ex.key] = (s.completed[ex.key] || 0) + 1
    setPopAnim(true)
    setTimeout(() => setPopAnim(false), 420)
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
    haptic([80, 80, 80, 80, 120])
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
      <div className="sa-aura" style={{ opacity: isWork ? 1 : 0.4, transition: 'opacity 0.9s var(--sa-settle)' }} />

      {/* Progress thread */}
      <div style={{ position: 'relative', padding: '14px 24px 0' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.05)' }}>
          <div style={{
            height: '100%', width: '100%',
            background: 'var(--sa-accent)',
            boxShadow: '0 0 12px var(--sa-accent-glow)',
            transform: `scaleX(${pct / 100})`,
            transformOrigin: 'left',
            transition: 'transform 0.8s var(--sa-settle)',
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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '28px 28px 0', position: 'relative' }}>
          <div className="sa-aura" />

          {/* Exercise counter */}
          <div className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-4)', marginBottom: 20, letterSpacing: '0.1em' }}>
            EXERCISE {s.exIdx + 1} OF {exerciseData.length}
          </div>

          {/* Exercise name — left-aligned, dominant */}
          <div className="sa-serif-it" style={{ fontSize: 34, lineHeight: 1.05, color: 'var(--sa-ink-1)', marginBottom: 12, position: 'relative' }}>
            {currEx.name.toLowerCase()}.
          </div>

          {/* Form cue — bare italic link, no pill */}
          {currEx.info && (
            <button onClick={() => setShowInfo(o => !o)} style={{
              background: 'none', border: 'none', padding: 0,
              marginBottom: 4, cursor: 'pointer',
              textAlign: 'left', display: 'block',
              fontFamily: 'Newsreader, serif', fontStyle: 'italic',
              fontSize: 13,
              color: showInfo ? 'var(--sa-accent)' : 'var(--sa-ink-4)',
              transition: 'color 0.2s',
            }}>
              <span style={{ fontFamily: 'Georgia, serif', marginRight: 5, fontSize: 11, opacity: 0.8 }}>i</span>
              form cue
            </button>
          )}

          {/* Form info panel — editorial: rules not card */}
          <AnimatePresence>
            {showInfo && currEx.info && (
              <motion.div
                key="deep-info"
                variants={INFO_VARIANTS}
                initial="initial" animate="animate" exit="exit"
                style={{ marginBottom: 4 }}
              >
                <div style={{
                  fontSize: 13, color: 'var(--sa-ink-2)', lineHeight: 1.65,
                  fontFamily: 'Newsreader, serif', fontStyle: 'italic',
                  padding: '12px 0',
                  borderTop: '1px solid var(--sa-rule)',
                  borderBottom: '1px solid var(--sa-rule)',
                }}>
                  {currEx.info}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rule */}
          <div className="sa-rule" style={{ margin: '18px 0 20px' }} />

          {/* Set row — text left, square markers right */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontFamily: 'Newsreader, serif', fontSize: 15, color: 'var(--sa-ink-2)' }}>
              Set {doneForCurr + 1}
              <span style={{ color: 'var(--sa-ink-4)', fontSize: 13 }}> of {currEx.total}</span>
            </div>
            <div style={{ display: 'flex', gap: 5 }}>
              {Array.from({ length: currEx.total }).map((_, i) => {
                const isDoneSet    = i < doneForCurr
                const isCurrentSet = i === doneForCurr
                return (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: 2, flexShrink: 0,
                    background: isDoneSet || isCurrentSet ? 'var(--sa-accent)' : 'rgba(255,255,255,0.1)',
                    opacity:    isDoneSet ? 0.38 : 1,
                    boxShadow:  isCurrentSet ? '0 0 10px var(--sa-accent-glow)' : 'none',
                    transition: 'background 0.3s var(--sa-settle), opacity 0.3s, box-shadow 0.3s',
                  }} />
                )
              })}
            </div>
          </div>

          {/* Reps — bare mono text, no pill */}
          {currEx.reps && (
            <div className="sa-mono" style={{ fontSize: 12, color: 'var(--sa-ink-4)' }}>
              {currEx.reps} reps · {currEx.restSec}s rest
            </div>
          )}

          {/* Checkmark + skip — centered in remaining space */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {(() => {
              const mm = EX_MUSCLES[currEx.key] || { p: [], s: [] }
              return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
                  <MuscleMap active={mm.p} secondary={mm.s} mode={mode} width={180} />
                  <div className="sa-label" style={{ fontSize: 9, marginTop: 12, color: 'var(--sa-accent)' }}>
                    {muscleLabel(mm.p)}
                  </div>
                </div>
              )
            })()}
            <button className="sa-tap" onClick={markSetDone} style={{
              width: 88, height: 88, borderRadius: 100, border: 'none',
              background: 'var(--sa-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 12px 40px var(--sa-accent-glow), inset 0 1px 0 rgba(255,255,255,0.25)',
              cursor: 'pointer', position: 'relative',
              animation: popAnim ? 'sa-set-pop 0.42s var(--sa-settle) both' : 'none',
            }}>
              <SaIcon name="check" size={32} color="#14110e" />
            </button>

            <button className="sa-tap" onClick={skipSet} style={{
              marginTop: 22,
              background: 'transparent', border: 'none',
              fontFamily: 'Newsreader, serif', fontStyle: 'italic',
              fontSize: 13, color: 'var(--sa-ink-4)', cursor: 'pointer',
              padding: '6px 0',
            }}>
              skip set
            </button>
          </div>
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
