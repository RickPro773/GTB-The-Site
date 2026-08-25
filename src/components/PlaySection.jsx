export default function PlaySection() {
  return (
    <section
      id="jogar"
      className="text-center py-28 px-[5vw]"
      style={{
        background:
          'linear-gradient(180deg, rgba(107,47,214,.12) 0%, transparent 30%), radial-gradient(circle at 50% 20%, rgba(255,47,149,.2), transparent 55%), radial-gradient(circle at 50% 60%, rgba(107,47,214,.18), transparent 60%), #0d0d10',
      }}
    >
      <div className="inline-block border border-gta6-pink text-gta6-pink text-xs tracking-[2px] uppercase py-2 px-5 mb-6 rounded-full">
        v0.0.5 &middot; Alpha Fechada
      </div>
      <h2 className="gtb-play-title font-display text-[clamp(2.8rem,8.5vw,6.5rem)] text-gta6-pink">
        Bora pra Rua?
      </h2>
      <p className="max-w-[520px] mx-auto mt-4 mb-6 text-paper/70">
        O Gang's Thief's Brodis ainda está em desenvolvimento pela nossa turma. Assim que a build
        estiver pronta pra galera, o link do Roblox aparece aqui.
      </p>
      <div className="panel-3d inline-flex items-center gap-2.5 bg-white/[0.04] border border-white/10 py-4 px-7 text-sm tracking-[1px] uppercase text-paper/75 rounded-lg">
        <span
          className="w-2 h-2 rounded-full bg-red-500"
          style={{ boxShadow: '0 0 8px #ff4d4d' }}
        />
        Jogo indisponível no momento
      </div>
    </section>
  )
}
