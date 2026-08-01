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
    // path é algo como '../assets/radio/los-brodis/Musica.mp3'
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

export default function RadioSelector({ audio }) {
  const stations = useMemo(buildStations, [])
  const [isOpen, setIsOpen] = useState(false)
  const [stationIndex, setStationIndex] = useState(0)
  const [trackIndex, setTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const station = stations[stationIndex]
  const currentSrc = station?.tracks[trackIndex]

  // sempre que a fonte muda (estação ou faixa diferente), recarrega
  // o elemento de áudio de forma segura, sem race condition — o
  // React já garante que `currentSrc` está atualizado antes deste
  // efeito rodar.
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.load()
    if (isPlaying) {
      audioRef.current.play().catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSrc])

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

  return (
    <>
      <audio ref={audioRef} src={currentSrc} onEnded={() => changeTrack(1)} />

      {/* Botão de aba fixo — abre/fecha o painel da rádio */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-[140] flex items-center gap-2 py-3 px-3 border border-r-0 border-white/15 rounded-l-lg transition-colors ${
          isOpen ? 'bg-asphalt-2' : 'bg-asphalt-2/80 hover:bg-asphalt-2'
        }`}
        aria-label={isOpen ? 'Fechar rádio' : 'Abrir rádio'}
      >
        <span className={`text-lg ${isPlaying ? 'animate-pulse' : ''}`}>📻</span>
        <span className="hidden sm:inline text-[0.65rem] tracking-[2px] uppercase text-paper/70 [writing-mode:vertical-rl]">
          Rádio
        </span>
      </button>

      {/* Painel da rádio */}
      <div
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-[139] w-[min(320px,85vw)] bg-asphalt-2 border border-white/10 border-r-0 rounded-l-xl p-5 shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <span className="text-[0.65rem] tracking-[2px] text-warn-yellow uppercase font-bold">
            📻 Estação de Rádio
          </span>
          <span className="text-[0.6rem] text-paper/40 uppercase bg-white/5 px-2 py-0.5 rounded">
            {station.genre}
          </span>
        </div>

        <div className="flex items-center justify-between bg-asphalt border border-white/10 rounded-lg py-3 px-3 mb-3">
          <button
            onClick={() => changeStation(-1)}
            className="text-warn-yellow text-lg px-1 hover:scale-110 transition"
            aria-label="Estação anterior"
          >
            ◀
          </button>
          <div className="text-center px-2 overflow-hidden">
            <div className="font-display text-lg text-hood-green leading-none truncate">
              {station.name}
            </div>
          </div>
          <button
            onClick={() => changeStation(1)}
            className="text-warn-yellow text-lg px-1 hover:scale-110 transition"
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

        <button
          onClick={togglePlay}
          className="w-full bg-neon-purple text-white rounded-lg py-3 text-sm font-bold tracking-[0.5px] hover:bg-neon-purple-dim transition"
        >
          {isPlaying ? '⏸ Pausar Música' : '▶ Tocar Rádio'}
        </button>
      </div>
    </>
  )
}
