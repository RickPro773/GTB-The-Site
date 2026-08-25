import LogoFull from './LogoFull'

export default function Hero() {
  return (
    <section className="hero-bg relative min-h-screen flex items-end">
      <div className="px-[5vw] pb-[6vw] w-full">
        <div className="inline-block text-gta6-pink text-xs sm:text-sm tracking-[4px] uppercase mb-3 px-3 py-1 rounded-full border border-gta6-pink/40 bg-black/30 backdrop-blur-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          Roblox &middot; Mundo Aberto &middot; Feito pelos Brodis
        </div>
        <h1 className="sr-only">Gang's Thief's Brodis</h1>
        <LogoFull className="w-[min(560px,90vw)] h-auto -ml-1 drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]" />
        <p className="max-w-[520px] mt-5 text-base sm:text-lg text-paper/85 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
          Um jogo de mundo aberto no Roblox.
        </p>
        <div className="mt-8 flex gap-4 flex-wrap">
          <a
            href="#personagens"
            className="btn-pill-pink inline-block py-3.5 px-7 font-body font-bold tracking-[2px] uppercase text-sm no-underline cursor-pointer"
          >
            Ver Personagens
          </a>
          <a
            href="#jogar"
            className="btn-3d inline-block py-3.5 px-7 rounded-full font-body font-bold tracking-[2px] uppercase text-sm no-underline cursor-pointer border-2 border-paper text-paper bg-asphalt-2/60 backdrop-blur-sm transition-colors hover:border-gta6-pink hover:text-gta6-pink"
          >
            Status do Jogo
          </a>
        </div>
      </div>
    </section>
  )
}
