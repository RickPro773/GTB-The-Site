export default function NowPlayingToast({ label }) {
  const visible = Boolean(label)

  return (
    <div
      className={`fixed top-[120px] left-[5vw] z-[150] flex items-center gap-2.5 bg-asphalt/85 border border-paper/15 border-l-[3px] border-l-hood-green py-2.5 px-4 font-body text-xs tracking-[1.5px] uppercase text-paper backdrop-blur-md transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2.5 pointer-events-none'
      }`}
    >
      <div className="flex items-end gap-0.5 h-3.5">
        <span className="w-[3px] h-1.5 bg-hood-green animate-eq [animation-delay:0s]" />
        <span className="w-[3px] h-3.5 bg-hood-green animate-eq [animation-delay:.2s]" />
        <span className="w-[3px] h-2 bg-hood-green animate-eq [animation-delay:.4s]" />
      </div>
      <span>
        TOCANDO AGORA &middot; <b className="text-hood-green font-semibold">{label}</b>
      </span>
    </div>
  )
}
