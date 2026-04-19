import { useRef, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  value: number // seconds
  min: number // seconds
  max: number // seconds
  onChange: (val: number) => void
}

const TWO_PI = Math.PI * 2
const START_ANGLE = -Math.PI / 2 // 12 o'clock

function angleToValue(angle: number, min: number, max: number): number {
  let norm = (angle - START_ANGLE + TWO_PI) % TWO_PI
  return Math.round(min + (norm / TWO_PI) * (max - min))
}

function valueToAngle(value: number, min: number, max: number): number {
  const norm = (value - min) / (max - min)
  return START_ANGLE + norm * TWO_PI
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (s === 0) return `${m} min`
  return `${m}:${String(s).padStart(2, '0')}`
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const x1 = cx + r * Math.cos(startAngle)
  const y1 = cy + r * Math.sin(startAngle)
  const x2 = cx + r * Math.cos(endAngle)
  const y2 = cy + r * Math.sin(endAngle)
  const large = endAngle - startAngle > Math.PI ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

const CX = 160
const CY = 160
const R = 120
const TRACK_R = 120

export function TimeDial({ value, min, max, onChange }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)
  const [extended, setExtended] = useState(false)

  const getAngleFromEvent = useCallback((e: PointerEvent | React.PointerEvent) => {
    if (!svgRef.current) return 0
    const rect = svgRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - CX * (rect.width / 320)
    const y = e.clientY - rect.top - CY * (rect.height / 320)
    return Math.atan2(y, x)
  }, [])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true
    ;(e.target as Element).setPointerCapture(e.pointerId)
    const angle = getAngleFromEvent(e)
    const newVal = Math.max(min, Math.min(max, angleToValue(angle, min, max)))
    onChange(newVal)
  }, [getAngleFromEvent, min, max, onChange])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    const angle = getAngleFromEvent(e)
    const newVal = Math.max(min, Math.min(max, angleToValue(angle, min, max)))
    onChange(newVal)
  }, [getAngleFromEvent, min, max, onChange])

  const onPointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  const thumbAngle = valueToAngle(value, min, max)
  const thumbX = CX + R * Math.cos(thumbAngle)
  const thumbY = CY + R * Math.sin(thumbAngle)

  const arcEnd = thumbAngle
  const arcPath = describeArc(CX, CY, TRACK_R, START_ANGLE, arcEnd <= START_ANGLE ? START_ANGLE + 0.001 : arcEnd)

  const atMax = value >= max

  return (
    <div className="relative flex flex-col items-center">
      <svg
        ref={svgRef}
        viewBox="0 0 320 320"
        className="w-72 h-72 touch-none cursor-pointer"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <defs>
          <filter id="thumb-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e879f9" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={CX} cy={CY} r={TRACK_R}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="4"
        />

        {/* Filled arc */}
        <path
          d={arcPath}
          fill="none"
          stroke="url(#arcGrad)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Center time display */}
        <text
          x={CX} y={CY - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="28"
          fontWeight="300"
          letterSpacing="-0.5"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          {formatTime(value)}
        </text>
        <text
          x={CX} y={CY + 22}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(255,255,255,0.35)"
          fontSize="11"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          {value < 60 ? 'seconds' : ''}
        </text>

        {/* Thumb dot */}
        <circle
          cx={thumbX} cy={thumbY} r="10"
          fill="#e879f9"
          filter="url(#thumb-glow)"
        />
      </svg>

      {/* Extend time tab */}
      <AnimatePresence>
        {atMax && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            onClick={() => {
              setExtended(true)
              onChange(max)
            }}
            className="mt-2 px-4 py-1.5 rounded-full text-sm text-white/60 border border-white/15 backdrop-blur-sm hover:border-white/30 hover:text-white/90 transition-colors"
          >
            {extended ? 'Max extended' : 'More time →'}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
