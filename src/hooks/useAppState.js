import { useState, useRef } from 'react'
<<<<<<< HEAD
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
=======
import { SLOTS, MUSCLES, buildRoutine } from '../data/exercises'

export function useAppState() {
  const [tab, setTab]           = useState('build')        // 'build' | 'timer'
  const [buildScreen, setBuildScreen] = useState('config') // 'config' | 'result'
  const [mode, setMode]         = useState('def')           // 'def' | 'str'
  const [dark, setDark]         = useState(true)
  const [slotIdx, setSlotIdx]   = useState(2)
  const [groups, setGroups]     = useState([])
  const [workout, setWorkout]   = useState(null)
  const absRotation = useRef(0)

  // Timer state
  const [hiitMode, setHiitMode]       = useState('free')  // 'free' | 'queue'
  const [hiitWork, setHiitWork]       = useState(40)
  const [hiitRest, setHiitRest]       = useState(20)
  const [hiitRounds, setHiitRounds]   = useState(8)
  const [hiitExIds, setHiitExIds]     = useState([])
  const [timerActive, setTimerActive] = useState(false)
  const [preloaded, setPreloaded]     = useState(false)

  function toggleGroup(id) {
    setGroups(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
>>>>>>> f70bf3ebf97c6e10827c63b28d6e9c392955b2d9
  }

  function compile() {
    const result = buildRoutine(groups, mode, slotIdx, absRotation.current)
    absRotation.current = (absRotation.current + 1) % 5
    setWorkout(result)
<<<<<<< HEAD
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
=======
    setBuildScreen('result')
>>>>>>> f70bf3ebf97c6e10827c63b28d6e9c392955b2d9
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

<<<<<<< HEAD
  return {
    tab, setTab,
    activeStep, advanceStep,
    compiled, compile, reset,
=======
  function toggleMode() {
    setMode(m => m === 'def' ? 'str' : 'def')
    document.documentElement.setAttribute('data-mode', mode === 'def' ? 'strength' : 'definition')
  }

  return {
    tab, setTab,
    buildScreen, setBuildScreen,
>>>>>>> f70bf3ebf97c6e10827c63b28d6e9c392955b2d9
    mode, toggleMode,
    dark, setDark,
    slotIdx, setSlotIdx,
    groups, toggleGroup,
<<<<<<< HEAD
    workout,
=======
    workout, compile,
>>>>>>> f70bf3ebf97c6e10827c63b28d6e9c392955b2d9
    hiitMode, setHiitMode,
    hiitWork, setHiitWork,
    hiitRest, setHiitRest,
    hiitRounds, setHiitRounds,
    hiitExIds, setHiitExIds,
<<<<<<< HEAD
=======
    timerActive, setTimerActive,
>>>>>>> f70bf3ebf97c6e10827c63b28d6e9c392955b2d9
    preloaded, setPreloaded,
    preConfigHIIT,
  }
}
