interface Props {
  onClick: () => void
}

export function BackButton({ onClick }: Props) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick() }}
      className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center rounded-full text-white/40 hover:text-white/80 hover:bg-white/8 transition-all z-10"
      aria-label="Go back"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 5l-7 7 7 7" />
      </svg>
    </button>
  )
}
