import { useState, useRef } from 'react'
import { buildRoutine } from '../data/exercises'

export function useAppState() {
  const [tab,      setTab]      = useState('tonight')
  const [mode,     setMode]     = useState('def')
  const [light,    setLight]    = useState(false)
  const [slotIdx,  setSlotIdx]  = useState(3)   // default: 60 min
  const [groups,   setGroups]   = useState([])
  const [workout,  setWorkout]  = useState(null)
  const [coolStep, setCoolStep] = useState('arrive')
  const absRotation = useRef(0)

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
  }

  function goCool() {
    setCoolStep('arrive')
    setTab('cool')
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
    coolStep, setCoolStep,
  }
}
