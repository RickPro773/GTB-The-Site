import { useState, useRef, useEffect, useMemo } from 'react'
import { STATIONS_CONFIG } from '../data/radioConfig'

// Descobre TODOS os .mp3 dentro de src/assets/radio/<qualquer-pasta>/
// automaticamente, em tempo de build. Não precisa importar nada à
// mão — é só o Vite escaneando as pastas por conta própria.
const audioModules = import.meta.glob('../assets/radio/*/*.mp3', {
  eager: true,
  import: 'default',
})

// Agrupa as faixas encontradas por pasta (nome da estação), na
// ordem em que o STATIONS_CONFIG define, e ignora pastas vazias.
function buildStations() {
  const tracksByFolder = {}
  for (const path in audioModules) {
    const match = path.match(/radio\/([^/]+)\//)
    if (!match) continue
    const folder = match[1]
    if (!tracksByFolder[folder]) tracksByFolder[folder] = []
    tracksByFolder[folder].push(audioModules[path])
  }

  return STATIONS_CONFIG.filter((cfg) => tracksByFolder[cfg.folder]?.length > 0).map((cfg) => ({
    ...cfg,
    tracks: tracksByFolder[cfg.folder],
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
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)
  const progressBarRef = useRef(null)

  const station = stations[stationIndex]
  const currentSrc = station?.tracks[trackIndex]

  // sempre que a fonte muda (estação ou faixa diferente), recarrega
  // o elemento de áudio de forma segura — o React já garante que
  // `currentSrc` está atualizado antes deste efeito rodar.
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

  function changeStation(direction) {
    const next = (stationIndex + direction + stations.length) % stations.length
    setStationIndex(next)
    setTrackIndex(0)
  }

  function changeTrack(direction) {
    const total = station.tracks.length
    setTrackIndex((prev) => (prev + direction + total) % total)
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

  return (
    <section id="radio" className="py-24 px-[5vw] text-center">
      <audio ref={audioRef} src={currentSrc} onEnded={() => changeTrack(1)} />

      <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)] leading-[0.9] mb-2">
        📻 <span className="text-logo-green">Rádio</span> GTB
      </h2>
      <p className="max-w-[520px] mx-auto text-paper/70 leading-relaxed mb-10">
        Liga o som e curte a trilha sonora das ruas de Los Brodis.
      </p>

      <div className="panel-3d max-w-md mx-auto bg-asphalt-2 border border-white/10 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[0.65rem] tracking-[2px] text-warn-yellow uppercase font-bold">
            Estação de Rádio
          </span>
          <span className="text-[0.6rem] text-paper/50 uppercase bg-white/5 px-2 py-0.5 rounded">
            {station.genre}
          </span>
        </div>

        <div className="flex items-center justify-between bg-asphalt border border-white/10 rounded-lg py-3 px-3 mb-3">
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
          </div>
          <button
            onClick={() => changeStation(1)}
            className="text-warn-yellow text-lg px-2 hover:scale-110 transition-transform"
            aria-label="Próxima estação"
          >
            ▶
          </button>
        </div>

        {station.tracks.length > 1 && (
          <div className="flex items-center justify-between text-xs text-paper/50 mb-3 px-1">
            <button onClick={() => changeTrack(-1)} className="hover:text-paper transition">
              ‹ faixa anterior
            </button>
            <span>
              {trackIndex + 1}/{station.tracks.length}
            </span>
            <button onClick={() => changeTrack(1)} className="hover:text-paper transition">
              próxima faixa ›
            </button>
          </div>
        )}

        {/* Barra de progresso com tempo real, clicável pra pular na música */}
        <div className="mb-4">
          <div
            ref={progressBarRef}
            onClick={handleSeek}
            className="relative h-2 bg-asphalt border border-white/10 rounded-full cursor-pointer overflow-hidden group"
          >
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-logo-purple to-hood-green rounded-full transition-[width] duration-150"
              style={{ width: `${progressPercent}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_6px_rgba(0,0,0,0.6)] opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${progressPercent}% - 6px)` }}
            />
          </div>
          <div className="flex justify-between text-[0.65rem] text-paper/40 mt-1.5 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <button
          onClick={togglePlay}
          className="btn-3d w-full bg-neon-purple text-white rounded-lg py-3 text-sm font-bold tracking-[0.5px] hover:bg-neon-purple-dim transition-colors"
        >
          {isPlaying ? '⏸ Pausar Música' : '▶ Tocar Rádio'}
        </button>
      </div>
    </section>
  )
}
