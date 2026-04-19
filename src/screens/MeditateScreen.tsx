import { motion } from 'framer-motion'
import { MandalaSVG } from '../components/MandalaSVG'
import { BackButton } from '../components/BackButton'
import { SoundToggle } from '../components/SoundToggle'
import { useSessionTimer } from '../hooks/useSessionTimer'
import { useAmbientSound } from '../hooks/useAmbientSound'

interface Props {
  durationSeconds: number
  onBack: () => void
  onEnd: (durationSeconds: number) => void
}

function formatRemaining(s: number): string {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}

export function MeditateScreen({ durationSeconds, onBack, onEnd }: Props) {
  const { remaining, isRunning, toggle } = useSessionTimer(durationSeconds, () => {
    onEnd(durationSeconds)
  })
  const { muted, toggleMute } = useAmbientSound()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative w-full h-full flex flex-col items-center justify-center animated-bg cursor-pointer select-none"
      style={{ background: 'radial-gradient(ellipse at 50% 45%, hsl(var(--hue), 55%, 7%) 0%, #06060c 70%)' }}
      onClick={toggle}
    >
      <BackButton onClick={onBack} />
      <SoundToggle muted={muted} onToggle={toggleMute} />

      {/* Timer */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white/25 text-sm font-light tracking-widest pointer-events-none">
        {formatRemaining(remaining)}
      </div>

      {/* Paused indicator */}
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
        <MandalaSVG mode="meditate" />
      </div>
    </motion.div>
  )
}
