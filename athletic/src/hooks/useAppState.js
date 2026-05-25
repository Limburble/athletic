import { useState, useRef } from 'react'
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
  }

  function compile() {
    const result = buildRoutine(groups, mode, slotIdx, absRotation.current)
    absRotation.current = (absRotation.current + 1) % 5
    setWorkout(result)
    setBuildScreen('result')
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

  function toggleMode() {
    setMode(m => m === 'def' ? 'str' : 'def')
    document.documentElement.setAttribute('data-mode', mode === 'def' ? 'strength' : 'definition')
  }

  return {
    tab, setTab,
    buildScreen, setBuildScreen,
    mode, toggleMode,
    dark, setDark,
    slotIdx, setSlotIdx,
    groups, toggleGroup,
    workout, compile,
    hiitMode, setHiitMode,
    hiitWork, setHiitWork,
    hiitRest, setHiitRest,
    hiitRounds, setHiitRounds,
    hiitExIds, setHiitExIds,
    timerActive, setTimerActive,
    preloaded, setPreloaded,
    preConfigHIIT,
  }
}
