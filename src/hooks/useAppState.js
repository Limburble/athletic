import { useState, useRef } from 'react'
import { buildRoutine } from '../data/exercises'
import { useSanctuaryStore } from '../data/store'

export function useAppState() {
  const store = useSanctuaryStore()

  const [tab,          setTab]         = useState('tonight')
  const [mode,         setModeState]   = useState(() => store.prefs.mode)
  const [light,        setLightState]  = useState(() => store.prefs.light)
  const [slotIdx,      setSlotIdx]     = useState(3)   // default: 60 min
  const [groups,       setGroups]      = useState([])
  const [workout,      setWorkout]     = useState(null)
  const [coolStep,     setCoolStep]    = useState('arrive')
  const [sessionStart, setSessionStart] = useState(null)
  const absRotation = useRef(0)

  // Wrappers that also persist prefs
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

  function compile({ groups: g, mode: m, slotIdx: s } = {}) {
    const useGroups  = g ?? groups
    const useMode    = m ?? mode
    const useSlotIdx = s ?? slotIdx
    const result = buildRoutine(useGroups, useMode, useSlotIdx, absRotation.current)
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
  }

  function goCool() {
    setCoolStep('arrive')
    setTab('cool')
  }

  /** Begin the deep-work screen, recording the session start timestamp. */
  function goDeep() {
    setSessionStart(Date.now())
    setTab('deep')
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
    coolStep, setCoolStep,
    sessionStart,
    store,
  }
}
