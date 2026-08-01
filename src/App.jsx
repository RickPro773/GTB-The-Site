import React from 'react'
import StatusBar from './components/StatusBar'
import Header from './components/Header'
import Intro from './components/Intro'
import NowPlayingToast from './components/NowPlayingToast'
import Hero from './components/Hero'
import Characters from './components/Characters'
import PlaySection from './components/PlaySection'
import Footer from './components/Footer'
import ComingSoonModal from './components/ComingSoonModal'
import MaintenanceScreen from './components/MaintenanceScreen' // 1. Importação da tela de manutenção
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useComingSoon } from './hooks/useComingSoon'

// ⚙️ CHAVE DE MANUTENÇÃO: 
// Altere para 'true' para ATIVAR a manutenção.
// Altere para 'false' para VOLTAR o site ao ar normalmente.
const IN_MAINTENANCE = true

const SOCIAL_MESSAGES = {
  Discord: 'Nosso servidor do Discord está a caminho. É lá que vai rolar novidade, teste fechado e papo direto com a turma.',
  Roblox: 'A página do GTB no Roblox ainda não está no ar — assim que a build sair da alpha fechada, o link aparece aqui.',
}

export default function App() {
  const audio = useAudioPlayer()
  const { content, showComingSoon, closeComingSoon } = useComingSoon()

  // Se a manutenção estiver ativa, renderiza apenas a tela de aviso
  if (IN_MAINTENANCE) {
    return <MaintenanceScreen />
  }

  function handleSocialClick(network) {
    showComingSoon(network, SOCIAL_MESSAGES[network])
  }

  function handleQuadroClick() {
    showComingSoon(
      'Quadro',
      'Um mural com atualizações, bastidores e ideias do desenvolvimento do GTB. Em construção pela nossa turma.'
    )
  }

  return (
    <div className="bg-asphalt text-paper font-body overflow-x-hidden">
      <StatusBar />
      <Intro audio={audio} />
      <NowPlayingToast label={audio.nowPlayingLabel} />
      <Header onQuadroClick={handleQuadroClick} />
      <Hero />
      <Characters />
      <PlaySection />
      <Footer onSocialClick={handleSocialClick} />

      {content && (
        <ComingSoonModal
          title={content.title}
          message={content.message}
          onClose={closeComingSoon}
        />
      )}
    </div>
  )
}