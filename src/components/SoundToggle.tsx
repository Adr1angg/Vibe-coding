interface Props {
  muted: boolean
  onToggle: () => void
}

export function SoundToggle({ muted, onToggle }: Props) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle() }}
      className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full text-white/40 hover:text-white/80 hover:bg-white/8 transition-all z-10"
      aria-label={muted ? 'Unmute' : 'Mute'}
    >
      {muted ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  )
}
