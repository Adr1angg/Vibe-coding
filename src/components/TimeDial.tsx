import { useRef, useCallback } from 'react'

interface Props {
  value: number // seconds
  min: number // seconds
  max: number // seconds
  onChange: (val: number) => void
}

const TWO_PI = Math.PI * 2
const START_ANGLE = (2 * Math.PI) / 3  // 7 o'clock
const SWEEP = (300 / 360) * TWO_PI     // 300° arc — no wrap-around

function angleToValue(angle: number, min: number, max: number): number {
  let norm = (angle - START_ANGLE + TWO_PI) % TWO_PI
  norm = Math.min(Math.max(norm, 0), SWEEP)
  const raw = min + (norm / SWEEP) * (max - min)
  return Math.round(raw / 60) * 60 // snap to whole minutes
}

function valueToAngle(value: number, min: number, max: number): number {
  return START_ANGLE + ((value - min) / (max - min)) * SWEEP
}

function formatTime(seconds: number): string {
  return `${Math.round(seconds / 60)} min`
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

  const trackEnd = START_ANGLE + SWEEP
  const trackPath = describeArc(CX, CY, TRACK_R, START_ANGLE, trackEnd)
  const arcPath = value <= min
    ? ''
    : describeArc(CX, CY, TRACK_R, START_ANGLE, thumbAngle)

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
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>

        {/* Track */}
        <path
          d={trackPath}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Filled arc */}
        {arcPath && (
          <path
            d={arcPath}
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        )}

        {/* Center time display */}
        <text
          x={CX} y={CY}
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

        {/* Thumb dot */}
        <circle
          cx={thumbX} cy={thumbY} r="10"
          fill="#2dd4bf"
          filter="url(#thumb-glow)"
        />
      </svg>
    </div>
  )
}
