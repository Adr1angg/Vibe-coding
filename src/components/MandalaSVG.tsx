import { motion, useSpring, MotionValue, useAnimationFrame } from 'framer-motion'
import { useEffect, useRef } from 'react'
import type { BreathingPhase } from '../types/app'

const PETAL_COUNT = 8
const PETAL_SIZE = 90

function petalPath(size: number) {
  const w = size * 0.35
  return `M 0 0 C ${w} ${-size * 0.25}, ${w} ${-size * 0.7}, 0 ${-size} C ${-w} ${-size * 0.7}, ${-w} ${-size * 0.25}, 0 0`
}

interface PetalProps {
  index: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sharedPathLength: MotionValue<number>
}

function Petal({ index, sharedPathLength }: PetalProps) {
  const stiffness = 28 - index * 1.2
  const damping = 16
  // useSpring accepts MotionValue at runtime; cast to bypass TS overload mismatch
  const pl = useSpring(sharedPathLength as unknown as number, { stiffness, damping })
  const angle = (360 / PETAL_COUNT) * index

  return (
    <motion.g transform={`rotate(${angle})`} filter="url(#mandala-glow)">
      <motion.path
        d={petalPath(PETAL_SIZE)}
        fill="none"
        stroke="url(#petalGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
        pathLength={1}
        style={{ pathLength: pl }}
      />
    </motion.g>
  )
}

interface Props {
  mode: 'meditate' | 'breathe'
  phase?: BreathingPhase
  opacity?: number
}

export function MandalaSVG({ mode, phase, opacity = 1 }: Props) {
  const targetPathLength = useSpring(0.3, { stiffness: 20, damping: 14 })
  const ambientT = useRef(0)

  useAnimationFrame((_, delta) => {
    if (mode !== 'meditate') return
    ambientT.current += delta / 6000
    const val = 0.25 + 0.65 * (0.5 + 0.5 * Math.sin(ambientT.current * Math.PI * 2))
    targetPathLength.set(val)
  })

  useEffect(() => {
    if (mode !== 'breathe') return
    if (phase === 'inhale') targetPathLength.set(1)
    else if (phase === 'hold-in') targetPathLength.set(1)
    else targetPathLength.set(0.04)
  }, [mode, phase, targetPathLength])

  return (
    <motion.div style={{ opacity }} className="w-full h-full flex items-center justify-center">
      <svg
        viewBox="-140 -140 280 280"
        className="w-full h-full max-w-[340px] max-h-[340px]"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id="mandala-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0.3 0 0.7 0 0.05
                      0   0 0.4 0 0
                      0.7 0 1.1 0 0.2
                      0   0 0   0.65 0"
              result="coloredBlur"
            />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="center-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="petalGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>

        {Array.from({ length: PETAL_COUNT }, (_, i) => (
          <Petal key={i} index={i} sharedPathLength={targetPathLength} />
        ))}

        <circle cx="0" cy="0" r="5" fill="#e879f9" filter="url(#center-glow)" />
      </svg>
    </motion.div>
  )
}
