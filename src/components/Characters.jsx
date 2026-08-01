import charactersWheel from '../assets/images/characters-wheel.png'
import { roster } from '../data/roster'

export default function Characters() {
  return (
    <section
      id="personagens"
      className="bg-asphalt-2 border-t border-b border-white/[0.06] text-center py-28 px-[5vw]"
    >
      <h2 className="font-display text-[clamp(2.5rem,6.5vw,4.8rem)] leading-[0.9] mb-2">
        O <span className="text-neon-purple">Elenco</span> da Rua
      </h2>
      <p className="max-w-[620px] mx-auto text-paper/70 leading-relaxed mb-10">
        Escolha seu brodi. Cada um tem sua própria história dentro do bairro.
      </p>

      <div className="relative w-[min(480px,80vw)] mx-auto">
        <img
          src={charactersWheel}
          alt="Roleta de seleção de personagens do GTB, estilo GTA, com quatro brodis diferentes"
          className="w-full h-auto block animate-wheel-in"
          style={{ filter: 'drop-shadow(0 0 40px rgba(192,38,255,.25))' }}
        />
      </div>
      <p className="mt-8 text-paper/60 text-sm max-w-[480px] mx-auto leading-relaxed">
        A seleção de personagens do GTB — cada quadrante representa um brodi jogável, com seu
        próprio estilo dentro do bairro.
      </p>

      <div className="flex justify-center flex-wrap gap-4 mt-10">
        {roster.map((c) => (
          <div
            key={c.id}
            className="border border-white/15 py-2.5 px-5 text-sm tracking-[1.5px] uppercase text-paper bg-white/[0.03]"
          >
            <b className="text-hood-green">{c.id}</b> · {c.name}
          </div>
        ))}
      </div>
    </section>
  )
}
