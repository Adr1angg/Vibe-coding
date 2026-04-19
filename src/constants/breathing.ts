import type { PatternPhase } from '../types/app'

export const PATTERN_478: PatternPhase[] = [
  { phase: 'inhale', duration: 4 },
  { phase: 'hold-in', duration: 7 },
  { phase: 'exhale', duration: 8 },
]

export const CYCLE_DURATION = PATTERN_478.reduce((sum, p) => sum + p.duration, 0) // 19s
