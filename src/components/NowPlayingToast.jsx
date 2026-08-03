export default function NowPlayingToast({ label }) {
  const visible = Boolean(label)

  return (
    <div
      className={`panel-3d fixed top-[76px] left-1/2 -translate-x-1/2 sm:left-[5vw] sm:translate-x-0 z-[150] flex items-center gap-3 bg-asphalt-2/95 border border-white/10 rounded-full py-2.5 px-5 font-body text-xs tracking-[1px] uppercase text-paper backdrop-blur-md transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
      }`}
    >
      <div className="flex items-end gap-[3px] h-3.5">
        <span className="w-[3px] h-1.5 bg-hood-green rounded-full animate-eq [animation-delay:0s]" />
        <span className="w-[3px] h-3.5 bg-hood-green rounded-full animate-eq [animation-delay:.2s]" />
        <span className="w-[3px] h-2 bg-hood-green rounded-full animate-eq [animation-delay:.4s]" />
      </div>
      <span className="text-paper/60">
        Tocando agora &middot; <b className="text-paper font-semibold normal-case">{label}</b>
      </span>
    </div>
  )
}
