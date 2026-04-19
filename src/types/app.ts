export type AppMode = 'meditate' | 'breathe'

export type AppScreen = 'home' | 'dial' | 'meditate' | 'breathe' | 'end'

export type BreathingPhase = 'inhale' | 'hold-in' | 'exhale'

export interface PatternPhase {
  phase: BreathingPhase
  duration: number // seconds
}

export interface EndData {
  mode: AppMode
  durationSeconds: number
}
