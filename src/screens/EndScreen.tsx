import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Howl } from 'howler'
import type { AppMode } from '../types/app'

interface Props {
  mode: AppMode
  durationSeconds: number
  onDone: () => void
}

function formatDuration(s: number): string {
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} minute${m !== 1 ? 's' : ''}`
  const h = Math.floor(m / 60)
  const rem = m % 60
  return rem > 0 ? `${h}h ${rem}m` : `${h} hour${h !== 1 ? 's' : ''}`
}

export function EndScreen({ mode, durationSeconds, onDone }: Props) {
  useEffect(() => {
    const chime = new Howl({
      src: [`${import.meta.env.BASE_URL}sounds/chime.mp3`],
      volume: 0.6,
    })
    chime.play()
    return () => { chime.unload() }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="relative w-full h-full flex flex-col items-center justify-center"
      style={{ background: '#06060c' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="flex flex-col items-center gap-8"
      >
        {/* Decorative line */}
        <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="text-center flex flex-col gap-2">
          <p className="text-white/35 tracking-[0.3em] text-xs uppercase">
            {mode === 'meditate' ? 'You meditated for' : 'You breathed for'}
          </p>
          <p className="text-white/80 text-3xl font-light tracking-wider">
            {formatDuration(durationSeconds)}
          </p>
        </div>

        <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onDone}
          className="mt-4 px-10 py-3 rounded-full text-white/60 text-sm tracking-widest uppercase font-light transition-colors hover:text-white/90"
          style={{
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
          }}
        >
          Done
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
