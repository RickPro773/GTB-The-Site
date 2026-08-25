import charactersWheel from '../assets/images/characters-wheel.png'
import { roster } from '../data/roster.js'
import { usePoll } from '../hooks/usePoll.js'
import LoadingImage from './LoadingImage.jsx'

export default function CharacterPoll() {
  const { results, totalVotes, votedSlug, isLoading, error, vote } = usePoll()

  return (
    <section className="py-24 px-[5vw] bg-asphalt-2 border-t border-b border-white/[0.06] text-center">
      <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)] leading-[0.9] mb-2">
        Qual o <span className="text-logo-green text-3d-green">Melhor</span> Personagem?
      </h2>
      <p className="max-w-[560px] mx-auto text-paper/70 leading-relaxed mb-10">
        Vota no seu brodi favorito. Um voto por pessoa.
      </p>

      <div className="relative w-[min(320px,65vw)] mx-auto mb-10">
        <img
          src={charactersWheel}
          alt="Roleta de personagens do GTB"
          className="w-full h-auto block opacity-80"
          style={{ filter: 'drop-shadow(0 0 30px rgba(143,19,235,.25))' }}
        />
      </div>

      {error && !votedSlug && (
        <p className="text-warn-yellow text-sm max-w-md mx-auto mb-6">
          ⚠ Enquete temporariamente indisponível. Tenta de novo mais tarde.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
        {roster.map((char) => {
          const count = results?.[char.slug] ?? 0
          const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
          const isVoted = votedSlug === char.slug
          const hasVoted = Boolean(votedSlug)

          return (
            <button
              key={char.slug}
              onClick={() => vote(char.slug)}
              disabled={hasVoted || isLoading}
              className={`char-card group relative overflow-hidden rounded-lg aspect-[3/4] text-left disabled:cursor-default ${
                isVoted ? 'ring-2 ring-gta6-pink' : ''
              }`}
              style={{ '--char-theme': char.theme }}
            >
              <LoadingImage
                src={char.photos[0]}
                alt={char.name}
                className="w-full h-full object-cover"
                accentColor={char.theme}
              />

              <div
                className={`absolute inset-0 transition-colors ${
                  hasVoted ? 'bg-black/55' : 'bg-black/20 group-hover:bg-black/40'
                }`}
              />

              <div className="absolute left-0 right-0 bottom-0 p-3">
                <div className="font-display text-lg text-paper leading-none mb-1.5">
                  {char.name}
                </div>

                {hasVoted && (
                  <>
                    <div className="h-1.5 bg-white/15 rounded-full overflow-hidden mb-1">
                      <div
                        className="h-full rounded-full transition-[width] duration-700"
                        style={{ width: `${percent}%`, backgroundColor: char.theme }}
                      />
                    </div>
                    <div className="text-[0.65rem] text-paper/80 font-semibold">
                      {percent}% {isVoted && '· seu voto'}
                    </div>
                  </>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {votedSlug && (
        <p className="mt-8 text-paper/50 text-xs uppercase tracking-[1px]">
          {totalVotes} voto{totalVotes !== 1 ? 's' : ''} no total &middot; obrigado por votar 💜
        </p>
      )}
    </section>
  )
}
