import { useState, useRef, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { STATIONS_CONFIG, TRACK_METADATA, STATION_ADS, AD_FREQUENCY } from '../data/radioConfig'

// Descobre TODOS os .mp3 dentro de src/assets/radio/<qualquer-pasta>/
// automaticamente, em tempo de build — sem limite de quantidade
// (pode ter 1, 10, 30 músicas por pasta, tanto faz). Não precisa
// importar nem listar nada à mão, é só o Vite escaneando as pastas.
const audioModules = import.meta.glob('../assets/radio/*/*.mp3', {
  eager: true,
  import: 'default',
})

// Agrupa as faixas encontradas por pasta (nome da estação), na
// ordem em que o STATIONS_CONFIG define, e ignora pastas vazias.
// Cada faixa já sai com título/artista resolvidos a partir de
// TRACK_METADATA (ou usa o nome cru do arquivo como fallback, se
// a faixa ainda não tiver metadado preenchido).
function buildStations() {
  const tracksByFolder = {}
  for (const path in audioModules) {
    const match = path.match(/radio\/([^/]+)\/([^/]+\.mp3)$/)
    if (!match) continue
    const [, folder, filename] = match
    if (!tracksByFolder[folder]) tracksByFolder[folder] = []

    const metadata = TRACK_METADATA[filename]
    const fallbackTitle = filename.replace(/\.mp3$/i, '').replace(/[_-]+/g, ' ')

    tracksByFolder[folder].push({
      src: audioModules[path],
      title: metadata?.title || fallbackTitle,
      artist: metadata?.artist || null,
      isAd: false,
    })
  }

  return STATIONS_CONFIG.filter((cfg) => tracksByFolder[cfg.folder]?.length > 0).map((cfg) => ({
    ...cfg,
    tracks: tracksByFolder[cfg.folder],
    ads: (STATION_ADS[cfg.folder] || []).map((ad) => ({
      src: ad.file,
      title: ad.label,
      artist: 'Publicidade',
      isAd: true,
    })),
  }))
}

// Formata segundos em "m:ss" (ex: 125 -> "2:05"). Retorna "0:00"
// enquanto o tempo ainda não é um número válido (áudio carregando).
function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function RadioSelector({ audio }) {
  const stations = useMemo(buildStations, [])
  const [stationIndex, setStationIndex] = useState(0)
  const [trackIndex, setTrackIndex] = useState(0)
  const [isPlayingAd, setIsPlayingAd] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)
  const progressBarRef = useRef(null)

  const station = stations[stationIndex]
  const currentTrack = isPlayingAd
    ? station?.ads[trackIndex % Math.max(station.ads.length, 1)]
    : station?.tracks[trackIndex]
  const currentSrc = currentTrack?.src

  // sempre que a fonte muda (estação, faixa, ou entrada/saída de
  // anúncio), recarrega o elemento de áudio de forma segura. O
  // React já garante que `currentSrc` está atualizado antes deste
  // efeito rodar, então não existe risco de tocar a faixa errada.
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.load()
    setCurrentTime(0)
    setDuration(0)
    if (isPlaying) {
      audioRef.current.play().catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSrc])

  // acompanha o progresso da faixa em tempo real
  useEffect(() => {
    const el = audioRef.current
    if (!el) return

    function handleTimeUpdate() {
      setCurrentTime(el.currentTime)
    }
    function handleLoadedMetadata() {
      setDuration(el.duration)
    }

    el.addEventListener('timeupdate', handleTimeUpdate)
    el.addEventListener('loadedmetadata', handleLoadedMetadata)
    return () => {
      el.removeEventListener('timeupdate', handleTimeUpdate)
      el.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [])

  if (!station) return null // nenhuma estação com música ainda

  function play() {
    audio?.pauseMenuTrack?.() // garante só uma fonte de som tocando
    audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {})
  }

  function pause() {
    audioRef.current?.pause()
    setIsPlaying(false)
  }

  function togglePlay() {
    isPlaying ? pause() : play()
  }

  // Troca de ESTAÇÃO — funciona a qualquer momento, mesmo com
  // música tocando. Sempre volta pra primeira faixa da nova
  // estação (nunca pra um anúncio), e continua tocando
  // automaticamente se já estava tocando antes da troca.
  function changeStation(direction) {
    const next = (stationIndex + direction + stations.length) % stations.length
    setStationIndex(next)
    setTrackIndex(0)
    setIsPlayingAd(false)
  }

  function selectStation(index) {
    if (index === stationIndex) return
    setStationIndex(index)
    setTrackIndex(0)
    setIsPlayingAd(false)
  }

  // Pula pra PRÓXIMA/ANTERIOR faixa dentro da mesma estação —
  // funciona a qualquer momento, com a música tocando ou pausada.
  // Pular manualmente sempre volta pra música (sai do anúncio, se
  // estiver nele), porque é uma ação explícita da pessoa.
  function changeTrack(direction) {
    setIsPlayingAd(false)
    const total = station.tracks.length
    setTrackIndex((prev) => (prev + direction + total) % total)
  }

  // Quando uma faixa termina sozinha: decide se toca um anúncio
  // (só se a estação tiver algum cadastrado) com a probabilidade
  // definida em AD_FREQUENCY, ou simplesmente segue pra próxima
  // música normalmente.
  function handleTrackEnded() {
    if (isPlayingAd) {
      // um anúncio acabou de tocar — volta pra música normal,
      // avançando pra próxima faixa
      setIsPlayingAd(false)
      const total = station.tracks.length
      setTrackIndex((prev) => (prev + 1) % total)
      return
    }

    const hasAds = station.ads.length > 0
    const shouldPlayAd = hasAds && Math.random() < AD_FREQUENCY

    if (shouldPlayAd) {
      setIsPlayingAd(true)
      setTrackIndex(Math.floor(Math.random() * station.ads.length))
    } else {
      const total = station.tracks.length
      setTrackIndex((prev) => (prev + 1) % total)
    }
  }

  // clique/arraste na barra pula pra posição correspondente na música
  function handleSeek(e) {
    if (!audioRef.current || !progressBarRef.current || !duration) return
    const rect = progressBarRef.current.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    audioRef.current.currentTime = ratio * duration
    setCurrentTime(ratio * duration)
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0
  const hasMultipleTracks = station.tracks.length > 1

  return (
    <section id="radio" className="py-24 px-[5vw] text-center">
      <audio ref={audioRef} src={currentSrc} onEnded={handleTrackEnded} />

      <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)] leading-[0.9] mb-2">
        📻 <span className="text-logo-green">Rádio</span> GTB
      </h2>
      <p className="max-w-[520px] mx-auto text-paper/70 leading-relaxed mb-10">
        Liga o som e curte a trilha sonora das ruas de Los Brodis.
      </p>

      <div className="panel-3d max-w-md mx-auto bg-asphalt-2 border border-white/10 rounded-xl p-6">
        {/* Seletor de estação — sempre visível, funciona mesmo tocando */}
        <div className="flex items-center justify-between bg-asphalt border border-white/10 rounded-lg py-3 px-3 mb-2">
          <button
            onClick={() => changeStation(-1)}
            className="text-warn-yellow text-lg px-2 hover:scale-110 transition-transform"
            aria-label="Estação anterior"
          >
            ◀
          </button>
          <div className="text-center px-2 overflow-hidden">
            <div className="font-display text-xl text-paper leading-none truncate">
              {station.name}
            </div>
            <div className="text-[0.6rem] text-paper/40 uppercase tracking-[1px] mt-1">
              {station.genre}
            </div>
          </div>
          <button
            onClick={() => changeStation(1)}
            className="text-warn-yellow text-lg px-2 hover:scale-110 transition-transform"
            aria-label="Próxima estação"
          >
            ▶
          </button>
        </div>

        {/* Bolinhas indicando quantas estações existem e qual está ativa */}
        {stations.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mb-4">
            {stations.map((s, i) => (
              <button
                key={s.folder}
                onClick={() => selectStation(i)}
                aria-label={`Ir para ${s.name}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === stationIndex ? 'w-5 bg-logo-green' : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Nome da faixa/anúncio tocando agora */}
        <div className="mb-3 min-h-[3.2rem]">
          <div
            className={`text-[0.65rem] tracking-[2px] uppercase font-bold mb-1 ${
              isPlayingAd ? 'text-logo-blue' : 'text-warn-yellow'
            }`}
          >
            {isPlayingAd ? '📢 Publicidade' : 'Tocando agora'}
          </div>
          <div className="text-sm text-paper font-semibold truncate">{currentTrack?.title}</div>
          {currentTrack?.artist && (
            <div className="text-xs text-paper/50 truncate">{currentTrack.artist}</div>
          )}
          {!isPlayingAd && (
            <div className="text-[0.65rem] text-paper/35 mt-0.5">
              Faixa {trackIndex + 1} de {station.tracks.length}
            </div>
          )}
        </div>

        {/* Barra de progresso com tempo real, clicável pra pular na música */}
        <div className="mb-4">
          <div
            ref={progressBarRef}
            onClick={handleSeek}
            className="relative h-2 bg-asphalt border border-white/10 rounded-full cursor-pointer overflow-hidden group"
          >
            <motion.div
              className={`absolute inset-y-0 left-0 rounded-full ${
                isPlayingAd ? 'bg-logo-blue' : 'bg-gradient-to-r from-logo-purple to-gta6-pink'
              }`}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.15, ease: 'linear' }}
            />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_6px_rgba(0,0,0,0.6)] opacity-0 group-hover:opacity-100 transition-opacity"
              animate={{ left: `calc(${progressPercent}% - 6px)` }}
              transition={{ duration: 0.15, ease: 'linear' }}
            />
          </div>
          <div className="flex justify-between text-[0.65rem] text-paper/40 mt-1.5 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controles principais: pular faixa (anterior/próxima) + play/pause,
            sempre visíveis e clicáveis — o botão de pular fica
            desabilitado (mas visível) se a estação só tem 1 faixa. */}
        <div className="flex items-center justify-center gap-3">
          <motion.button
            onClick={() => changeTrack(-1)}
            disabled={!hasMultipleTracks}
            aria-label="Faixa anterior"
            whileTap={hasMultipleTracks ? { scale: 0.88 } : undefined}
            className="btn-3d w-12 h-12 flex items-center justify-center rounded-full bg-asphalt border border-white/10 text-paper text-lg disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:border-gta6-pink enabled:hover:text-gta6-pink transition-colors"
          >
            ⏮
          </motion.button>

          <motion.button
            onClick={togglePlay}
            whileTap={{ scale: 0.9 }}
            className="btn-3d w-16 h-16 flex items-center justify-center rounded-full bg-gta6-pink text-white text-2xl hover:bg-gta6-purple transition-colors"
            aria-label={isPlaying ? 'Pausar' : 'Tocar'}
          >
            {isPlaying ? '⏸' : '▶'}
          </motion.button>

          <motion.button
            onClick={() => changeTrack(1)}
            disabled={!hasMultipleTracks}
            aria-label="Pular para a próxima música"
            whileTap={hasMultipleTracks ? { scale: 0.88 } : undefined}
            className="btn-3d w-12 h-12 flex items-center justify-center rounded-full bg-asphalt border border-white/10 text-paper text-lg disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:border-gta6-pink enabled:hover:text-gta6-pink transition-colors"
          >
            ⏭
          </motion.button>
        </div>

        <p className="text-[0.65rem] text-paper/35 uppercase tracking-[1px] mt-4">
          Troque de estação a qualquer momento — mesmo com a música tocando
        </p>
      </div>
    </section>
  )
}
