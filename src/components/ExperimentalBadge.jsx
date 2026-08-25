export default function ExperimentalBadge() {
  return (
    <div
      className="fixed top-3 right-3 z-[200] select-none pointer-events-none
                 bg-gradient-to-b from-gta6-pink to-gta6-pink-deep
                 text-[#2b0a1c] font-body font-bold uppercase
                 tracking-[1.5px] text-[0.65rem] sm:text-xs
                 px-3 py-1.5 rounded-full
                 shadow-[0_4px_14px_rgba(255,47,149,0.45)]
                 ring-1 ring-white/30"
    >
      Versão Experimental
    </div>
  )
}
