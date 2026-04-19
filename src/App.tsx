import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HomeScreen } from './screens/HomeScreen'
import { TimeDialScreen } from './screens/TimeDialScreen'
import { MeditateScreen } from './screens/MeditateScreen'
import { BreatheScreen } from './screens/BreatheScreen'
import { EndScreen } from './screens/EndScreen'
import type { AppMode, AppScreen, EndData } from './types/app'

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('home')
  const [mode, setMode] = useState<AppMode>('meditate')
  const [sessionDuration, setSessionDuration] = useState(0)
  const [endData, setEndData] = useState<EndData | null>(null)

  const goHome = () => setScreen('home')

  return (
    <div className="w-screen h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === 'home' && (
          <ScreenWrapper key="home">
            <HomeScreen
              onSelect={(m) => {
                setMode(m)
                setScreen('dial')
              }}
            />
          </ScreenWrapper>
        )}

        {screen === 'dial' && (
          <ScreenWrapper key="dial">
            <TimeDialScreen
              mode={mode}
              onBack={goHome}
              onStart={(dur) => {
                setSessionDuration(dur)
                setScreen(mode === 'meditate' ? 'meditate' : 'breathe')
              }}
            />
          </ScreenWrapper>
        )}

        {screen === 'meditate' && (
          <ScreenWrapper key="meditate">
            <MeditateScreen
              durationSeconds={sessionDuration}
              onBack={goHome}
              onEnd={(dur) => {
                setEndData({ mode: 'meditate', durationSeconds: dur })
                setScreen('end')
              }}
            />
          </ScreenWrapper>
        )}

        {screen === 'breathe' && (
          <ScreenWrapper key="breathe">
            <BreatheScreen
              durationSeconds={sessionDuration}
              onBack={goHome}
              onEnd={(dur) => {
                setEndData({ mode: 'breathe', durationSeconds: dur })
                setScreen('end')
              }}
            />
          </ScreenWrapper>
        )}

        {screen === 'end' && endData && (
          <ScreenWrapper key="end">
            <EndScreen
              mode={endData.mode}
              durationSeconds={endData.durationSeconds}
              onDone={goHome}
            />
          </ScreenWrapper>
        )}
      </AnimatePresence>
    </div>
  )
}

function ScreenWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}
