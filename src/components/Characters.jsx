import charactersWheel from '../assets/images/characters-wheel.png'
import { roster } from '../data/roster'

function CharacterCard({ char }) {
  const aliveClass = char.effect === 'alive' ? 'char-card--alive' : ''

  return (
    <div
      className={`char-card relative overflow-hidden bg-asphalt aspect-[4/5] ${aliveClass}`}
    >
      {char.photo ? (
        <img
          src={char.photo}
          alt={`${char.name} — ${char.tag}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-asphalt-3">
          <span className="font-display text-4xl text-white/10">?</span>
        </div>
      )}
      <div className="absolute left-0 right-0 bottom-0 p-5 bg-gradient-to-t from-black/90 to-transparent">
        <div className="text-[0.65rem] tracking-[3px] text-warn-yellow uppercase">
          Ficha #{char.id}
        </div>
        <h3 className="font-display text-2xl text-paper leading-none mt-1">{char.name}</h3>
        <p className="text-sm text-paper/75 mt-1">{char.tag}</p>
      </div>
    </div>
  )
}

export default function Characters() {
  return (
    <section
      id="personagens"
      className="bg-asphalt-2 border-t border-b border-white/[0.06] text-center py-28 px-[5vw]"
    >
      <h2 className="font-display text-[clamp(2.5rem,6.5vw,4.8rem)] leading-[0.9] mb-2">
        O <span className="text-neon-purple">Elenco</span> da Rua
      </h2>
      <p className="max-w-[620px] mx-auto text-paper/70 leading-relaxed mb-14">
        Escolha seu brodi. Cada um tem sua própria história dentro do bairro.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto text-left">
        {roster.map((char) => (
          <CharacterCard key={char.id} char={char} />
        ))}
      </div>

      <div className="mt-20">
        <div className="relative w-[min(420px,75vw)] mx-auto">
          <img
            src={charactersWheel}
            alt="Roleta de seleção de personagens do GTB, estilo GTA, com os brodis do elenco"
            className="w-full h-auto block animate-wheel-in"
            style={{ filter: 'drop-shadow(0 0 40px rgba(192,38,255,.25))' }}
          />
        </div>
        <p className="mt-6 text-paper/50 text-xs tracking-[1px] max-w-[440px] mx-auto leading-relaxed uppercase">
          Tela de seleção de personagem &middot; estilo GTA
        </p>
      </div>
    </section>
  )
}
