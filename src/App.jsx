<<<<<<< HEAD
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
=======
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MeshBackground from './components/MeshBackground'
import Header from './components/Header'
import Dock from './components/Dock'
import ConfigScreen from './components/ConfigScreen'
import ResultScreen from './components/ResultScreen'
import TimerScreen from './components/TimerScreen'
import { useAppState } from './hooks/useAppState'

export default function App() {
  const state = useAppState()
  const { tab, setTab, buildScreen, setBuildScreen, mode, dark, setDark } = state

  // Sync data-mode attribute for CSS variables
  React.useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode === 'str' ? 'strength' : 'definition')
  }, [mode])

  const textPrimary = dark ? 'rgba(255,255,255,0.88)' : 'rgba(10,12,20,0.85)'
>>>>>>> f70bf3ebf97c6e10827c63b28d6e9c392955b2d9

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
<<<<<<< HEAD
      maxWidth: 430,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <Ambient mode={mode} dark={dark} />
=======
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 430,
      margin: '0 auto',
      overflow: 'hidden',
      color: textPrimary,
      transition: 'color 0.5s ease',
    }}>
      {/* Animated mesh background */}
      <MeshBackground mode={mode} dark={dark} />
>>>>>>> f70bf3ebf97c6e10827c63b28d6e9c392955b2d9

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 20, flexShrink: 0 }}>
        <Header mode={mode} dark={dark} setDark={setDark} />
<<<<<<< HEAD
        <Nav tab={tab} setTab={setTab} dark={dark} />
      </div>

      {/* Scrollable content */}
=======
      </div>

      {/* Build tab — back button when on result */}
      {tab === 'build' && buildScreen === 'result' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'relative',
            zIndex: 20,
            flexShrink: 0,
            paddingLeft: '1.25rem',
            paddingBottom: '0.25rem',
          }}
        >
          <button
            onClick={() => setBuildScreen('config')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.78rem',
              letterSpacing: '0.04em',
              color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(10,12,20,0.38)',
              padding: '0.2rem 0',
            }}
          >
            ← Back
          </button>
        </motion.div>
      )}

      {/* Scrollable content area */}
>>>>>>> f70bf3ebf97c6e10827c63b28d6e9c392955b2d9
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
<<<<<<< HEAD
            compiled ? (
              <ResultScreen key="result" state={state} dark={dark} />
            ) : (
              <BuildScreen key="build" state={state} dark={dark} />
=======
            buildScreen === 'config' ? (
              <ConfigScreen key="config" state={state} dark={dark} />
            ) : (
              <ResultScreen key="result" state={state} dark={dark} />
>>>>>>> f70bf3ebf97c6e10827c63b28d6e9c392955b2d9
            )
          ) : (
            <TimerScreen key="timer" state={state} dark={dark} />
          )}
        </AnimatePresence>
      </div>
<<<<<<< HEAD
=======

      {/* Bottom dock nav */}
      <div style={{ position: 'relative', zIndex: 20, flexShrink: 0 }}>
        <Dock tab={tab} setTab={setTab} dark={dark} mode={mode} />
      </div>
>>>>>>> f70bf3ebf97c6e10827c63b28d6e9c392955b2d9
    </div>
  )
}
