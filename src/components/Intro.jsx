import { useEffect, useRef, useState } from 'react'
import scene1 from '../assets/images/scene1.png'
import scene2 from '../assets/images/scene2.png'
import scene3 from '../assets/images/scene3.png'
import introTheme from '../assets/audio/intro-theme.mp3'
import menuTheme from '../assets/audio/menu-theme.mp3'
import LogoFull from './LogoFull'

const SLIDES = [scene1, scene2]
const SLIDE_INTERVAL_MS = 4500 // mais lento, estilo "cutscene" de créditos
const INTRO_DURATION_MS = 60000 // ~1 minuto, como pedido

export default function Intro({ audio }) {
  const [hidden, setHidden] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const endedRef = useRef(false)

  const { introRef, menuRef, soundOn, toggleSound, switchToMenuTrack } = audio

  // slideshow de imagens de fundo, em loop pelos 60s da intro
  useEffect(() => {
    if (SLIDES.length <= 1) return
    const id = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length)
    }, SLIDE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  function endIntro() {
    if (endedRef.current) return
    endedRef.current = true
    setHidden(true)
    switchToMenuTrack()
  }

  // termina automaticamente após ~1 minuto, ou quando a própria
  // faixa da intro chega ao fim (o que vier primeiro), ou no skip
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
            <LogoFull className="w-full h-auto" />
          </div>

          <div className="mt-10 w-[min(460px,72vw)] h-[3px] bg-white/10 border border-white/20 relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-purple to-hood-green"
              style={{ animation: `loadbar-slow ${INTRO_DURATION_MS}ms linear forwards` }}
            />
          </div>
          <div className="mt-4 text-[0.65rem] tracking-[4px] text-paper/45 uppercase">
            Carregando o bairro...
          </div>
          <div className="mt-10 text-[0.6rem] tracking-[2px] text-paper/30 uppercase">
            Intro Theme &middot; Grand Theft Brodis (Remix)
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
