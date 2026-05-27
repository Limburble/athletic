import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppState } from './hooks/useAppState'
import TonightScreen  from './components/TonightScreen'
import PathScreen     from './components/PathScreen'
import ComposeScreen  from './components/ComposeScreen'
import DeepScreen     from './components/DeepScreen'
import CoolScreen     from './components/CoolScreen'
import LogScreen      from './components/LogScreen'
import RoomScreen     from './components/RoomScreen'
import CheckinScreen  from './components/CheckinScreen'

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
}

export default function App() {
  const state = useAppState()
  const { tab } = state

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      maxWidth: 430,
      margin: '0 auto',
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          variants={fade}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ position: 'absolute', inset: 0 }}
        >
          {tab === 'tonight'  && <TonightScreen  state={state} />}
          {tab === 'checkin'  && <CheckinScreen  state={state} />}
          {tab === 'path'     && <PathScreen     state={state} />}
          {tab === 'compose'  && <ComposeScreen  state={state} />}
          {tab === 'deep'     && <DeepScreen     state={state} />}
          {tab === 'cool'     && <CoolScreen     state={state} />}
          {tab === 'log'      && <LogScreen      state={state} />}
          {tab === 'room'     && <RoomScreen     state={state} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
