import { useEffect, useRef, useState } from 'react'
import scene1 from '../assets/images/scene1.png'
import scene2 from '../assets/images/scene2.png'
import scene3 from '../assets/images/scene3.png'
import introTheme from '../assets/audio/intro-theme.mp3'
import menuTheme from '../assets/audio/menu-theme.mp3'
import LogoFull from './LogoFull'
import { roster } from '../data/roster'

const SLIDES = [scene1, scene2, scene3,] // imagens de fundo da intro, tipo cutscene
const SLIDE_INTERVAL_MS = 4500 // ritmo de "cutscene" de créditos
const INTRO_DURATION_MS = 60000 // ~1 minuto

// nomes do elenco passando tipo créditos de abertura Rockstar,
// alternando junto com os slides de fundo
const CREDITS = roster.map((c) => c.name)

export default function Intro({ audio }) {
  const [hidden, setHidden] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [creditIndex, setCreditIndex] = useState(0)
  const endedRef = useRef(false)

  const { introRef, menuRef, soundOn, toggleSound, switchToMenuTrack } = audio

  useEffect(() => {
    if (SLIDES.length <= 1) return
    const id = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length)
    }, SLIDE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (CREDITS.length === 0) return
    const id = setInterval(() => {
      setCreditIndex((prev) => (prev + 1) % CREDITS.length)
    }, 2600)
    return () => clearInterval(id)
  }, [])

  function endIntro() {
    if (endedRef.current) return
    endedRef.current = true
    setHidden(true)
    switchToMenuTrack()
  }

  useEffect(() => {
    const timeout = setTimeout(endIntro, INTRO_DURATION_MS)
    const introEl = introRef.current
    introEl?.addEventListener('ended', endIntro)
    return () => {
      clearTimeout(timeout)
      introEl?.removeEventListener('ended', endIntro)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <audio ref={introRef} src={introTheme} preload="auto" />
      <audio ref={menuRef} src={menuTheme} loop preload="auto" />

      <div
        className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden transition-all duration-700 ${
          hidden ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible'
        }`}
      >
        {SLIDES.map((src, i) => (
          <div
            key={src}
            className={`intro-slide ${i === activeSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
        <div className="intro-scanline z-[2]" />
        <div className="intro-vignette z-[3]" />

        <div className="relative z-[5] text-center px-5 flex flex-col items-center">
          <div className="text-warn-yellow text-xs sm:text-sm tracking-[6px] uppercase mb-6 animate-fade-up">
            Um Jogo Roblox De Mundo Aberto
          </div>

          <div className="animate-flicker w-[min(680px,88vw)]">
            <LogoFull className="w-full h-auto drop-shadow-[0_0_35px_rgba(192,38,255,0.35)]" />
          </div>

          {/* créditos do elenco passando, estilo abertura Rockstar */}
          {CREDITS.length > 0 && (
            <div className="mt-8 h-6 overflow-hidden relative w-[min(400px,80vw)]">
              {CREDITS.map((name, i) => (
                <div
                  key={name}
                  className={`absolute inset-0 flex items-center justify-center text-[0.7rem] tracking-[3px] uppercase transition-opacity duration-700 ${
                    i === creditIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <span className="text-paper/40">Estrelando</span>
                  <span className="mx-2 text-hood-green">&middot;</span>
                  <span className="text-paper/70 font-semibold">{name}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 w-[min(460px,72vw)] h-[3px] bg-white/10 border border-white/20 relative overflow-hidden rounded-full">
            <div
              className="h-full bg-gradient-to-r from-neon-purple to-hood-green shadow-[0_0_12px_rgba(57,211,83,0.6)]"
              style={{ animation: `loadbar-slow ${INTRO_DURATION_MS}ms linear forwards` }}
            />
          </div>
          <div className="mt-4 text-[0.65rem] tracking-[4px] text-paper/45 uppercase">
            Carregando o bairro...
          </div>
          <div className="mt-8 text-[0.6rem] tracking-[2px] text-paper/30 uppercase">
            Intro Theme &middot; Grande Theft Brodis (Remix)
          </div>
        </div>

        <button
          onClick={toggleSound}
          className="absolute bottom-6 left-6 z-[6] bg-transparent border border-paper/40 text-paper font-body tracking-[2px] text-xs uppercase py-2.5 px-4 cursor-pointer transition hover:bg-hood-green hover:text-black hover:border-hood-green"
        >
          {soundOn ? '🔊 Som Ligado' : '🔇 Som Desligado'}
        </button>
        <button
          onClick={endIntro}
          className="absolute bottom-6 right-6 z-[6] bg-transparent border border-paper/40 text-paper font-body tracking-[2px] text-xs uppercase py-2.5 px-4 cursor-pointer transition hover:bg-paper hover:text-black"
        >
          Pular ▶
        </button>
      </div>

      <style>{`
        @keyframes loadbar-slow {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </>
  )
}
