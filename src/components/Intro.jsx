import { useEffect, useRef, useState } from 'react'
import scene1 from '../assets/images/scene1.png'
import scene2 from '../assets/images/scene2.png'
import introTheme from '../assets/audio/intro-theme.mp3'
import menuTheme from '../assets/audio/menu-theme.mp3'

const SLIDES = [scene1, scene2]
const SLIDE_INTERVAL_MS = 2600
const INTRO_DURATION_MS = 6200

export default function Intro({ audio }) {
  const [hidden, setHidden] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const endedRef = useRef(false)

  const { introRef, menuRef, soundOn, toggleSound, switchToMenuTrack } = audio

  // slideshow de imagens de fundo
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

  // termina automaticamente quando a barra de load acaba, ou quando
  // a própria faixa da intro chega ao fim (o que vier primeiro)
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

        <div className="relative z-[5] text-center px-5">
          <h1 className="gtb-outline-title font-display text-[clamp(3.5rem,15vw,10rem)] leading-[0.85] text-paper tracking-[4px] animate-flicker">
            GTB
          </h1>
          <div className="font-body font-semibold tracking-[10px] text-[clamp(0.75rem,2vw,1.1rem)] text-hood-green mt-2 uppercase">
            Grande Theft Brodis
          </div>

          <div className="mt-10 w-[min(420px,70vw)] h-1.5 bg-white/15 border border-white/30 mx-auto relative overflow-hidden">
            <div className="h-full w-0 bg-gradient-to-r from-neon-purple to-hood-green animate-loadbar" />
          </div>
          <div className="mt-4 text-[0.7rem] tracking-[3px] text-paper/50 uppercase">
            Carregando o bairro...
          </div>
          <div className="mt-8 text-[0.65rem] tracking-[2px] text-paper/35 uppercase">
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
    </>
  )
}
