import { useState } from 'react'
import { motion } from 'framer-motion'
import { TimeDial } from '../components/TimeDial'
import { BackButton } from '../components/BackButton'
import type { AppMode } from '../types/app'

interface Props {
  mode: AppMode
  onBack: () => void
  onStart: (durationSeconds: number) => void
}

const MODE_CONFIG = {
  meditate: { max: 60 * 60, label: 'Meditate' },
  breathe: { max: 10 * 60, label: 'Breathe' },
}

const DEFAULT_SECONDS = {
  meditate: 10 * 60,
  breathe: 3 * 60,
}

export function TimeDialScreen({ mode, onBack, onStart }: Props) {
  const config = MODE_CONFIG[mode]
  const min = 3 * 60 // 3 minutes

  const [value, setValue] = useState(DEFAULT_SECONDS[mode])

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center animated-bg"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, hsl(var(--hue), 55%, 7%) 0%, #06060c 70%)' }}
    >
      <BackButton onClick={onBack} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex flex-col items-center gap-10"
      >
        <p className="text-white/35 tracking-[0.25em] text-xs uppercase">{config.label}</p>

        <TimeDial
          value={value}
          min={min}
          max={config.max}
          onChange={setValue}
        />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onStart(value)}
          className="mt-2 px-12 py-4 rounded-full text-white/90 tracking-widest text-sm uppercase font-light transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(232,121,249,0.2), rgba(129,140,248,0.2))',
            border: '1px solid rgba(232,121,249,0.3)',
            backdropFilter: 'blur(12px)',
          }}
        >
          Begin
        </motion.button>
      </motion.div>
    </div>
  )
}
