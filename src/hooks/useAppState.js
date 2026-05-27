import { useState, useRef } from 'react'
import { buildRoutine } from '../data/exercises'

export function useAppState() {
  const [tab, setTab]               = useState('build')
  const [activeStep, setActiveStep] = useState(0)   // 0=time, 1=muscles, 2=mode
  const [compiled, setCompiled]     = useState(false)
  const [mode, setMode]             = useState('def')
  const [dark, setDark]             = useState(true)
  const [slotIdx, setSlotIdx]       = useState(2)
  const [groups, setGroups]         = useState([])
  const [workout, setWorkout]       = useState(null)
  const absRotation                 = useRef(0)

  // Timer
  const [hiitMode, setHiitMode]     = useState('free')
  const [hiitWork, setHiitWork]     = useState(40)
  const [hiitRest, setHiitRest]     = useState(20)
  const [hiitRounds, setHiitRounds] = useState(8)
  const [hiitExIds, setHiitExIds]   = useState([])
  const [preloaded, setPreloaded]   = useState(false)

  function toggleGroup(id) {
    setGroups(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function advanceStep(step) {
    setActiveStep(step)
  }

  function compile() {
    const result = buildRoutine(groups, mode, slotIdx, absRotation.current)
    absRotation.current = (absRotation.current + 1) % 5
    setWorkout(result)
    setCompiled(true)
  }

  function reset() {
    setCompiled(false)
    setActiveStep(0)
    setGroups([])
    setWorkout(null)
  }

  function toggleMode() {
    const next = mode === 'def' ? 'str' : 'def'
    setMode(next)
    document.documentElement.setAttribute('data-mode', next === 'str' ? 'strength' : 'definition')
  }

  function preConfigHIIT() {
    setHiitMode('queue')
    setHiitWork(40)
    setHiitRest(20)
    setHiitRounds(4)
    setHiitExIds(['weightedCrunchHIIT', 'straightLegHIIT', 'russianTwistHIIT', 'mtnClimb'])
    setPreloaded(true)
    setTab('timer')
  }

  return {
    tab, setTab,
    activeStep, advanceStep,
    compiled, compile, reset,
    mode, toggleMode,
    dark, setDark,
    slotIdx, setSlotIdx,
    groups, toggleGroup,
    workout,
    hiitMode, setHiitMode,
    hiitWork, setHiitWork,
    hiitRest, setHiitRest,
    hiitRounds, setHiitRounds,
    hiitExIds, setHiitExIds,
    preloaded, setPreloaded,
    preConfigHIIT,
  }
}
