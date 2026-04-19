import { useEffect, useRef, useState, useCallback } from 'react'
import { PATTERN_478 } from '../constants/breathing'
import type { BreathingPhase } from '../types/app'

interface BreathingState {
  phase: BreathingPhase
  progress: number // 0–1 within current phase
  cycleCount: number
  isRunning: boolean
  cycleJustCompleted: boolean // true for one tick when a cycle finishes
}

export function useBreathingCycle() {
  const [state, setState] = useState<BreathingState>({
    phase: 'inhale',
    progress: 0,
    cycleCount: 0,
    isRunning: false,
    cycleJustCompleted: false,
  })

  const isRunningRef = useRef(false)
  const elapsedRef = useRef(0)
  const lastTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const cycleCountRef = useRef(0)

  const totalCycleDuration = PATTERN_478.reduce((s, p) => s + p.duration, 0)

  const tick = useCallback((timestamp: number) => {
    if (!isRunningRef.current) return

    if (lastTimeRef.current !== null) {
      const delta = (timestamp - lastTimeRef.current) / 1000
      elapsedRef.current += delta
    }
    lastTimeRef.current = timestamp

    const cycleElapsed = elapsedRef.current % totalCycleDuration
    const prevCycleCount = cycleCountRef.current
    const newCycleCount = Math.floor(elapsedRef.current / totalCycleDuration)
    cycleCountRef.current = newCycleCount
    const cycleJustCompleted = newCycleCount > prevCycleCount

    let accumulated = 0
    let currentPhase: BreathingPhase = 'inhale'
    let progress = 0

    for (const p of PATTERN_478) {
      if (cycleElapsed < accumulated + p.duration) {
        currentPhase = p.phase
        progress = (cycleElapsed - accumulated) / p.duration
        break
      }
      accumulated += p.duration
    }

    setState({
      phase: currentPhase,
      progress,
      cycleCount: newCycleCount,
      isRunning: true,
      cycleJustCompleted,
    })

    rafRef.current = requestAnimationFrame(tick)
  }, [totalCycleDuration])

  const start = useCallback(() => {
    isRunningRef.current = true
    lastTimeRef.current = null
    rafRef.current = requestAnimationFrame(tick)
    setState(s => ({ ...s, isRunning: true }))
  }, [tick])

  const pause = useCallback(() => {
    isRunningRef.current = false
    lastTimeRef.current = null
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setState(s => ({ ...s, isRunning: false }))
  }, [])

  const toggle = useCallback(() => {
    if (isRunningRef.current) pause()
    else start()
  }, [start, pause])

  const reset = useCallback(() => {
    isRunningRef.current = false
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    elapsedRef.current = 0
    lastTimeRef.current = null
    cycleCountRef.current = 0
    setState({ phase: 'inhale', progress: 0, cycleCount: 0, isRunning: false, cycleJustCompleted: false })
  }, [])

  useEffect(() => {
    start()
    return () => {
      isRunningRef.current = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [start])

  return { ...state, toggle, reset }
}
