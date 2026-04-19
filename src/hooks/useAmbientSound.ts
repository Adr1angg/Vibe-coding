import { useEffect, useRef, useState, useCallback } from 'react'
import { Howl } from 'howler'

export function useAmbientSound() {
  const howlRef = useRef<Howl | null>(null)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const h = new Howl({
      src: ['/sounds/rain.mp3'],
      loop: true,
      volume: 0,
    })
    howlRef.current = h
    h.play()
    h.fade(0, 0.5, 2000)

    return () => {
      h.fade(0.5, 0, 1000)
      setTimeout(() => h.unload(), 1100)
    }
  }, [])

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev
      if (howlRef.current) howlRef.current.mute(next)
      return next
    })
  }, [])

  return { muted, toggleMute }
}
