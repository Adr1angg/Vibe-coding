import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MandalaSVG } from '../components/MandalaSVG'
import { BackButton } from '../components/BackButton'
import { SoundToggle } from '../components/SoundToggle'
import { useBreathingCycle } from '../hooks/useBreathingCycle'
import { useSessionTimer } from '../hooks/useSessionTimer'
import { useAmbientSound } from '../hooks/useAmbientSound'

interface Props {
  durationSeconds: number
  onBack: () => void
  onEnd: (durationSeconds: number) => void
}

export function BreatheScreen({ durationSeconds, onBack, onEnd }: Props) {
  const { phase, cycleCount, isRunning, toggle, cycleJustCompleted } = useBreathingCycle()
  const { muted, toggleMute } = useAmbientSound()
  const timerExpiredRef = useRef(false)

  const { toggle: toggleTimer } = useSessionTimer(durationSeconds, () => {
    timerExpiredRef.current = true
  })

  // End after timer expires AND current cycle completes
  useEffect(() => {
    if (timerExpiredRef.current && cycleJustCompleted) {
      onEnd(durationSeconds)
    }
  }, [cycleJustCompleted, durationSeconds, onEnd])

  const handleToggle = () => {
    toggle()
    toggleTimer()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative w-full h-full flex flex-col items-center justify-center animated-bg cursor-pointer select-none"
      style={{ background: 'radial-gradient(ellipse at 50% 45%, hsl(var(--hue), 55%, 7%) 0%, #06060c 70%)' }}
      onClick={handleToggle}
    >
      <BackButton onClick={onBack} />
      <SoundToggle muted={muted} onToggle={toggleMute} />

      {/* Cycle counter */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white/20 text-sm font-light tracking-widest pointer-events-none">
        {cycleCount > 0 ? `Cycle ${cycleCount}` : ''}
      </div>

      {!isRunning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-16 text-white/30 text-xs tracking-widest uppercase pointer-events-none"
        >
          Paused · tap to resume
        </motion.div>
      )}

      <div
        className="pointer-events-none"
        style={{ width: '70vmin', height: '70vmin', maxWidth: 380, maxHeight: 380 }}
      >
        <MandalaSVG mode="breathe" phase={phase} />
      </div>
    </motion.div>
  )
}
