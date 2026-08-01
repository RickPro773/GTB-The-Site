import React, { useState, useRef } from 'react'

// Imports das rádios
import LosBrodisTrack from '../assets/radio/los-brodis/Na_quatro_por_merda.mp3'
import radioCaosTrack from '../assets/radio/radio-caos/The_Hungry_Trombone.mp3'
import samuraFmTrack from '../assets/radio/samura-fm/Maconha_Do_Samura.mp3'

const STATIONS = [
  { id: 'los-brodis', name: 'LOS BRODIS', genre: 'LOS BRODIS', src: LosBrodisTrack },
  { id: 'radio-caos', name: 'RÁDIO CAOS GTB', genre: 'ROCK & CAOS', src: radioCaosTrack },
  { id: 'samura-fm', name: 'SAMURA FM', genre: 'ESPECIAL SAMURA', src: samuraFmTrack },
]

export default function RadioSelector() {
  const [currentStationIndex, setCurrentStationIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isChanging, setIsChanging] = useState(false)
  const audioRef = useRef(null)

  const station = STATIONS[currentStationIndex]

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }

  const changeStation = (direction) => {
    setIsChanging(true)
    let nextIndex = currentStationIndex + direction
    if (nextIndex < 0) nextIndex = STATIONS.length - 1
    if (nextIndex >= STATIONS.length) nextIndex = 0

    setCurrentStationIndex(nextIndex)

    setTimeout(() => {
      setIsChanging(false)
      if (audioRef.current) {
        audioRef.current.load()
        if (isPlaying) {
          audioRef.current.play().catch(() => {})
        }
      }
    }, 200)
  }

  return (
    <div style={styles.sectionContainer}>
      <style>{`
        @keyframes staticNoise {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.3; }
        }
        .station-changing {
          animation: staticNoise 0.2s infinite;
        }
      `}</style>

      <audio ref={audioRef} src={station.src} loop />

      <div style={styles.radioCard}>
        <div style={styles.topInfo}>
          <span style={styles.badge}>📻 ESTAÇÃO DE RÁDIO</span>
          <span style={styles.genreTag}>{station.genre}</span>
        </div>

        {/* Display estilo Rádio GTA */}
        <div className={isChanging ? 'station-changing' : ''} style={styles.displayBox}>
          <button style={styles.arrowBtn} onClick={() => changeStation(-1)}>◀</button>
          
          <div style={styles.stationTitleWrapper}>
            <div className="font-pricedown" style={styles.stationName}>
              {isChanging ? '⚡ BUSCANDO...' : station.name}
            </div>
          </div>

          <button style={styles.arrowBtn} onClick={() => changeStation(1)}>▶</button>
        </div>

        {/* Botão Tocar/Pausar em Roxo Néon */}
        <button style={styles.playBtn} onClick={togglePlay}>
          {isPlaying ? '⏸ PAUSAR MÚSICA' : '▶ TOCAR RÁDIO'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  sectionContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '30px 20px',
  },
  radioCard: {
    backgroundColor: 'rgba(18, 18, 26, 0.9)',
    border: '1px solid rgba(139, 0, 255, 0.4)',
    borderRadius: '16px',
    padding: '24px 28px',
    maxWidth: '460px',
    width: '100%',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(139, 0, 255, 0.15)',
    backdropFilter: 'blur(10px)',
  },
  topInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },
  badge: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#ffb703',
    letterSpacing: '1px',
  },
  genreTag: {
    fontSize: '0.72rem',
    color: '#a0a0b8',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '3px 8px',
    borderRadius: '6px',
    textTransform: 'uppercase',
  },
  displayBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0c0c12',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '16px',
  },
  arrowBtn: {
    background: 'none',
    border: 'none',
    color: '#ffb703',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '4px 8px',
  },
  stationTitleWrapper: {
    textAlign: 'center',
  },
  stationName: {
    fontSize: '1.6rem',
    color: '#00ff88',
    letterSpacing: '1px',
    textShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
  },
  playBtn: {
    width: '100%',
    backgroundColor: '#8b00ff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px',
    fontSize: '0.9rem',
    fontWeight: '800',
    letterSpacing: '0.5px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(139, 0, 255, 0.4)',
  },
}