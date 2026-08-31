import { useRef, useState, useCallback, useEffect } from 'react'

/**
 * Controla as duas faixas do site (intro e menu), a troca entre
 * elas quando a intro termina, e o botão de mute/unmute.
 * Isolar essa lógica num hook deixa os componentes visuais
 * (Intro.jsx) livres de lidar com <audio> na mão.
 */
export function useAudioPlayer() {
  const introRef = useRef(null)
  const menuRef = useRef(null)
  const [soundOn, setSoundOn] = useState(true)
  const [introEnded, setIntroEnded] = useState(false)
  const [nowPlayingLabel, setNowPlayingLabel] = useState(null)

  // tenta tocar a intro assim que os refs estiverem prontos
  useEffect(() => {
    if (!introRef.current) return
    introRef.current.volume = 0.7
    introRef.current.play().catch(() => {
      setSoundOn(false)
    })
  }, [])

  const showToastFor = useCallback((label, durationMs = 4500) => {
    setNowPlayingLabel(label)
    const t = setTimeout(() => setNowPlayingLabel(null), durationMs)
    return () => clearTimeout(t)
  }, [])

  const switchToMenuTrack = useCallback(() => {
    setIntroEnded(true)
    if (introRef.current) {
      introRef.current.pause()
      introRef.current.currentTime = 0
    }
    if (menuRef.current) {
      menuRef.current.volume = 0.5
      // só toca se o som estiver ligado no momento da troca
      if (soundOn) {
        menuRef.current.play().catch(() => {})
        showToastFor('Menu Theme')
      }
    }
  }, [soundOn, showToastFor])

  const toggleSound = useCallback(() => {
    setSoundOn((prev) => {
      const next = !prev
      if (next) {
        // ligando o som de novo
        if (introEnded) {
          menuRef.current?.play().catch(() => {})
          showToastFor('Menu Theme')
        } else {
          introRef.current?.play().catch(() => {})
        }
      } else {
        // desligando
        introRef.current?.pause()
        menuRef.current?.pause()
      }
      return next
    })
  }, [introEnded, showToastFor])

  // Pausa o Menu Theme sob demanda — reservado pra quando algum
  // player de áudio novo (ex: uma rádio, se voltar no futuro)
  // precisar garantir que só uma fonte de som toca por vez no site.
  const pauseMenuTrack = useCallback(() => {
    menuRef.current?.pause()
  }, [])

  return {
    introRef,
    menuRef,
    soundOn,
    introEnded,
    nowPlayingLabel,
    switchToMenuTrack,
    toggleSound,
    pauseMenuTrack,
  }
}
