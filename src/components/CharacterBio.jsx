import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { roster } from '../data/roster'
import { getCharacterMusic } from '../data/characterMusic'
import { usePageTitle } from '../hooks/usePageTitle'
import LogoGTB from './LogoGTB'
import LoadingImage from './LoadingImage'

export default function CharacterBio({ audio }) {
  const { slug } = useParams()
  const char = roster.find((c) => c.slug === slug)
  const [activePhoto, setActivePhoto] = useState(0)
  const musicRef = useRef(null)

  const musicSrc = char ? getCharacterMusic(char.musicFile) : null

  usePageTitle(char ? `${char.name} — GTB` : 'Personagem não encontrado — GTB')

  // ao entrar na bio: pausa qualquer música que já estava tocando
  // no site (menu theme / rádio) e toca o tema do personagem, se
  // o arquivo já existir no projeto. Ao sair, para a música dele.
  // Funciona igual tanto navegando pelo site quanto entrando direto
  // pela URL (ex: alguém abre /personagem/rick sem passar pela home).
  useEffect(() => {
    audio?.pauseMenuTrack?.()
    window.scrollTo(0, 0)

    if (musicRef.current && musicSrc) {
      musicRef.current.volume = 0.55
      musicRef.current.play().catch(() => {})
    }

    return () => {
      musicRef.current?.pause()
    }
  }, [musicSrc]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!char) {
    return (
      <div className="min-h-screen bg-asphalt flex flex-col items-center justify-center text-center px-6">
        <LogoGTB className="h-12 w-auto mb-6" />
        <h1 className="font-display text-3xl text-paper mb-3">Personagem não encontrado</h1>
        <p className="text-paper/60 text-sm mb-6">Esse brodi ainda não existe no elenco.</p>
        <Link
          to="/"
          className="btn-3d bg-neon-purple text-white rounded-lg py-3 px-6 text-sm font-bold hover:bg-neon-purple-dim transition-colors"
        >
          Voltar pro site
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-asphalt text-paper animate-fade-up">
      {musicSrc && <audio ref={musicRef} src={musicSrc} loop />}

      {/* Hero da bio: foto grande de fundo com overlay temático.
          Usa background-image direto (não LoadingImage) porque é
          full-bleed; o loading state aqui é sutil via fade do
          conteúdo por cima, que só aparece depois do primeiro
          paint mesmo se a imagem ainda estiver carregando. */}
      <div
        className="relative min-h-[60vh] flex items-end"
        style={{
          background: `linear-gradient(180deg, rgba(13,13,16,.15) 0%, rgba(13,13,16,.65) 60%, #0d0d10 100%), url(${char.photos[activePhoto]}) center 15% / cover no-repeat`,
        }}
      >
        <Link
          to="/"
          className="btn-3d absolute top-6 left-6 z-10 bg-asphalt-2/80 backdrop-blur-sm border border-white/15 text-paper text-xs tracking-[1.5px] uppercase py-2.5 px-4 rounded-lg hover:border-hood-green hover:text-hood-green transition-colors"
        >
          ← Voltar
        </Link>

        <div className="px-[5vw] pb-10 w-full">
          <div
            className="text-xs tracking-[4px] uppercase mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            style={{ color: char.theme }}
          >
            Ficha #{char.id} &middot; {char.tag}
          </div>
          <h1
            className="font-display text-[clamp(3rem,10vw,7rem)] leading-[0.9] drop-shadow-[0_10px_25px_rgba(0,0,0,0.7)]"
            style={{
              color: char.theme,
              textShadow: `2px 2px 0 rgba(0,0,0,0.5), 0 0 40px ${char.theme}55`,
            }}
          >
            {char.name}
          </h1>
        </div>
      </div>

      {/* Conteúdo: bio + stats + galeria */}
      <div className="max-w-4xl mx-auto px-[5vw] py-14 grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-10">
        <div>
          <h2 className="font-display text-2xl text-logo-green text-3d-green mb-4">História</h2>
          <p className="text-paper/80 leading-relaxed text-base">{char.bio}</p>

          {char.photos.length > 1 && (
            <div className="mt-10">
              <h3 className="font-display text-xl text-logo-purple text-3d-purple mb-3">
                Galeria
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {char.photos.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setActivePhoto(i)}
                    className={`char-card aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      i === activePhoto ? 'border-hood-green' : 'border-transparent'
                    }`}
                  >
                    <LoadingImage
                      src={src}
                      alt={`${char.name} — foto ${i + 1}`}
                      className="w-full h-full object-cover"
                      accentColor={char.theme}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="panel-3d bg-asphalt-2 border border-white/10 rounded-xl p-6">
            <h3 className="font-display text-xl text-warn-yellow mb-4">Ficha de Personagem</h3>
            <div className="flex flex-col gap-3">
              {char.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex justify-between items-center border-b border-white/[0.06] pb-2.5 last:border-0 last:pb-0"
                >
                  <span className="text-paper/50 text-xs uppercase tracking-[1px]">
                    {stat.label}
                  </span>
                  <span className="text-paper font-semibold text-sm text-right">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {musicSrc ? (
            <div className="panel-3d mt-4 bg-asphalt-2 border border-white/10 rounded-xl p-4 flex items-center gap-3">
              <span className="text-lg animate-pulse">🎵</span>
              <span className="text-xs text-paper/60 uppercase tracking-[1px]">
                Tocando o tema de {char.name}
              </span>
            </div>
          ) : (
            <div className="mt-4 bg-white/[0.03] border border-white/5 rounded-xl p-4 text-center">
              <span className="text-xs text-paper/35 uppercase tracking-[1px]">
                Tema musical ainda não disponível
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
