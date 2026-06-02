import { useState, useRef } from 'react'
import { buildRoutine, SLOTS, MUSCLES } from '../data/exercises'
import { useSanctuaryStore } from '../data/store'

export function useAppState() {
  const store = useSanctuaryStore()

  const [tab,           setTab]          = useState('tonight')
  const [mode,          setModeState]    = useState(() => store.prefs.mode)
  const [light,         setLightState]   = useState(() => store.prefs.light)
  const [slotIdx,       setSlotIdx]      = useState(3)
  const [groups,        setGroups]       = useState([])
  const [workout,       setWorkout]      = useState(null)
  const [coolStep,      setCoolStep]     = useState('arrive')
  const [sessionStart,  setSessionStart] = useState(null)
  const [completedSets, setCompletedSets] = useState(null)
  const [pendingConfig,   setPendingConfig]   = useState(null)
  const [workoutSource,   setWorkoutSource]   = useState('path')
  const [pathSeedGroups,  setPathSeedGroups]  = useState([])
  const absRotation = useRef(0)

  function setMode(m) {
    setModeState(m)
    store.updatePrefs({ mode: m })
  }

  function setLight(l) {
    setLightState(l)
    store.updatePrefs({ light: l })
  }

  function toggleGroup(id) {
    setGroups(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function compile({ groups: g, mode: m, slotIdx: s, useHome: uh } = {}) {
    const useGroups  = g ?? groups
    const useMode    = m ?? mode
    const useSlotIdx = s ?? slotIdx
    const banned     = store.profile.banned || []
    const result = buildRoutine(useGroups, useMode, useSlotIdx, absRotation.current, banned, uh ?? false)
    absRotation.current = (absRotation.current + 1) % 5
    setWorkout(result)
    if (g !== undefined) setGroups(g)
    if (m !== undefined) setMode(m)
    if (s !== undefined) setSlotIdx(s)
  }

  function reset() {
    setTab('tonight')
    setWorkout(null)
    setGroups([])
    setCoolStep('arrive')
    setSessionStart(null)
    setCompletedSets(null)
    setPendingConfig(null)
    setPathSeedGroups([])
  }

  function goCool(csData = null) {
    setCompletedSets(csData)
    setCoolStep('arrive')
    setTab('cool')
  }

  function goDeep() {
    setSessionStart(Date.now())
    setTab('deep')
  }

  // Kick off a suggested workout — always requires checkin first
  function beginWorkout(config) {
    setPendingConfig(config)
    setWorkoutSource('confirm')
    setTab('checkin')
  }

  // After confirming the workout summary, compile and enter compose
  function confirmWorkout() {
    if (!pendingConfig) return
    compile(pendingConfig)
    setTab('compose')
  }

  // Manual path — go straight to the custom compiler; seedGroups pre-selects muscles
  function goPath(seedGroups = []) {
    setPathSeedGroups(seedGroups)
    setWorkoutSource('path')
    setTab('path')
  }

  return {
    tab, setTab,
    mode, setMode,
    light, setLight,
    slotIdx, setSlotIdx,
    groups, setGroups, toggleGroup,
    workout,
    compile,
    reset,
    goCool,
    goDeep,
    goPath,
    beginWorkout,
    confirmWorkout,
    pendingConfig,
    workoutSource,
    pathSeedGroups,
    coolStep, setCoolStep,
    sessionStart,
    completedSets,
    store,
  }
}
