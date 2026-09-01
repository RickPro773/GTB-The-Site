import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import LogoFull from './LogoFull'
import { getHeroVideo } from '../data/heroVideo'
import { useParallax } from '../hooks/useParallax'

const heroVideoSrc = getHeroVideo()

export default function Hero() {
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = useRef(null)
  const [sectionRef, parallaxY] = useParallax(50)

  // tenta tocar o vídeo assim que ele carregar o suficiente — se
  // o navegador bloquear autoplay por qualquer motivo, o fundo de
  // imagem continua visível por baixo (nunca fica tela preta)
  useEffect(() => {
    if (!heroVideoSrc || !videoRef.current) return
    videoRef.current.play().catch(() => {})
  }, [])

  return (
    <section ref={sectionRef} className="hero-bg relative min-h-screen flex items-end overflow-hidden">
      {/* Vídeo de fundo — só renderiza se um .mp4 foi encontrado em
          src/assets/video/. Fica atrás do gradiente (hero-bg::before
          já cuida do overlay de cor) e do conteúdo. Se não tiver
          vídeo nenhum, esse bloco inteiro nem é montado, e o fundo
          de imagem definido em .hero-bg (CSS) já cobre tudo. */}
      {heroVideoSrc && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoReady ? 'opacity-100' : 'opacity-0'
          }`}
          src={heroVideoSrc}
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setVideoReady(true)}
        />
      )}

      <motion.div className="relative z-10 px-[5vw] pb-[6vw] w-full" style={{ y: parallaxY }}>
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
      </motion.div>

      {/* Indicador de "role pra baixo" — reforça a linguagem de site
          imersivo de trailer, incentiva continuar explorando */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-paper/50"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-[0.6rem] tracking-[3px] uppercase">Role pra baixo</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </section>
  )
}
