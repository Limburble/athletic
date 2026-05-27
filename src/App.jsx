import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppState } from './hooks/useAppState'
import Ambient from './components/Ambient'
import Header from './components/Header'
import Nav from './components/Nav'
import BuildScreen from './components/BuildScreen'
import ResultScreen from './components/ResultScreen'
import TimerScreen from './components/TimerScreen'

export default function App() {
  const state = useAppState()
  const { tab, setTab, compiled, mode, dark, setDark } = state

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode === 'str' ? 'strength' : 'definition')
  }, [mode])

  useEffect(() => {
    document.documentElement.setAttribute('data-dark', dark ? 'true' : 'false')
  }, [dark])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      maxWidth: 430,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <Ambient mode={mode} dark={dark} />

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 20, flexShrink: 0 }}>
        <Header mode={mode} dark={dark} setDark={setDark} />
        <Nav tab={tab} setTab={setTab} dark={dark} />
      </div>

      {/* Scrollable content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
        zIndex: 10,
        WebkitOverflowScrolling: 'touch',
      }}>
        <AnimatePresence mode="wait">
          {tab === 'build' ? (
            compiled ? (
              <ResultScreen key="result" state={state} dark={dark} />
            ) : (
              <BuildScreen key="build" state={state} dark={dark} />
            )
          ) : (
            <TimerScreen key="timer" state={state} dark={dark} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
