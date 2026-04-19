import { motion } from 'framer-motion'
import { MandalaSVG } from '../components/MandalaSVG'
import type { AppMode } from '../types/app'

interface Props {
  onSelect: (mode: AppMode) => void
}

export function HomeScreen({ onSelect }: Props) {
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center animated-bg"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, hsl(var(--hue), 60%, 8%) 0%, #06060c 70%)' }}
    >
      {/* Background mandala watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.07 }}>
        <div style={{ width: '90vmin', height: '90vmin' }}>
          <MandalaSVG mode="meditate" opacity={1} />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center gap-16"
      >
        {/* Wordmark */}
        <div className="text-center">
          <h1 className="text-white/90 font-light tracking-[0.3em] text-2xl uppercase">
            Letting Go
          </h1>
          <div className="mt-2 h-px w-16 mx-auto bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Mode buttons */}
        <div className="flex flex-col gap-4 w-64">
          <ModeButton
            label="Meditate"
            description="Ambient breathing, your pace"
            onClick={() => onSelect('meditate')}
            delay={0.2}
          />
          <ModeButton
            label="Breathe"
            description="Guided 4-7-8 exercise"
            onClick={() => onSelect('breathe')}
            delay={0.35}
          />
        </div>
      </motion.div>
    </div>
  )
}

interface ModeButtonProps {
  label: string
  description: string
  onClick: () => void
  delay: number
}

function ModeButton({ label, description, onClick, delay }: ModeButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full py-5 px-6 rounded-2xl flex flex-col items-start gap-1 text-left transition-colors"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.10)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <span className="text-white/90 font-light tracking-widest text-sm uppercase">{label}</span>
      <span className="text-white/35 text-xs">{description}</span>
    </motion.button>
  )
}
