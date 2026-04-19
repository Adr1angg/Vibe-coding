import { useEffect, useRef, useState, useCallback } from 'react'

export function useSessionTimer(durationSeconds: number, onExpire: () => void) {
  const [remaining, setRemaining] = useState(durationSeconds)
  const [isRunning, setIsRunning] = useState(true)
  const expiredRef = useRef(false)
  const startTimeRef = useRef(Date.now())
  const pausedAtRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  const tick = useCallback(() => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000
    const rem = Math.max(0, durationSeconds - elapsed)
    setRemaining(rem)

    if (rem <= 0 && !expiredRef.current) {
      expiredRef.current = true
      onExpireRef.current()
      return
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [durationSeconds])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [tick])

  const pause = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    pausedAtRef.current = Date.now()
    setIsRunning(false)
  }, [])

  const resume = useCallback(() => {
    if (pausedAtRef.current !== null) {
      startTimeRef.current += Date.now() - pausedAtRef.current
      pausedAtRef.current = null
    }
    setIsRunning(true)
    rafRef.current = requestAnimationFrame(tick)
  }, [tick])

  const toggle = useCallback(() => {
    if (isRunning) pause()
    else resume()
  }, [isRunning, pause, resume])

  return { remaining, isRunning, toggle }
}
