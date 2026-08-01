import React from 'react'

// Componentes da Estrutura Principal
import StatusBar from './components/StatusBar'
import Header from './components/Header'
import Intro from './components/Intro'
import NowPlayingToast from './components/NowPlayingToast'
import Hero from './components/Hero'
import Characters from './components/Characters'
import PlaySection from './components/PlaySection'
import Footer from './components/Footer'
import ComingSoonModal from './components/ComingSoonModal'
import MaintenanceScreen from './components/MaintenanceScreen'

// 🎵 Componentes Especiais (Rádio e Patch Notes)
import RadioSelector from './components/RadioSelector'
import PatchNotes from './components/PatchNotes'

// 🔑 Portal de Acesso por Chave
import AccessGate from './components/AccessGate'

// Hooks
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useComingSoon } from './hooks/useComingSoon'

// ⚙️ Alterne para true apenas quando o servidor estiver em manutenção
const IN_MAINTENANCE = false

const SOCIAL_MESSAGES = {
  Discord: 'Nosso servidor do Discord está a caminho.',
  Roblox: 'A página do GTB no Roblox ainda não está no ar.',
}

export default function App() {
  const audio = useAudioPlayer()
  const { content, showComingSoon, closeComingSoon } = useComingSoon()

  // Se a manutenção estiver ativa, exibe apenas a tela de aviso
  if (IN_MAINTENANCE) {
    return <MaintenanceScreen />
  }

  function handleSocialClick(network) {
    showComingSoon(network, SOCIAL_MESSAGES[network])
  }

  function handleQuadroClick() {
    showComingSoon('Quadro', 'Um mural com atualizações do GTB.')
  }

  return (
    <AccessGate>
      <div className="bg-asphalt text-paper font-body overflow-x-hidden">
        <StatusBar />
        <Intro audio={audio} />
        <NowPlayingToast label={audio.nowPlayingLabel} />
        <Header onQuadroClick={handleQuadroClick} />

        {/* 🚀 Banner Principal */}
        <Hero />

        {/* 📻 Seletor de Rádios */}
        <RadioSelector />

        {/* 🎭 Seção de Personagens */}
        <Characters />

        {/* 📜 Notas de Atualização (Patch Notes) */}
        <PatchNotes />

        {/* 🎮 Seção de Jogar / Entrar no Servidor */}
        <PlaySection />

        {/* 📌 Rodapé */}
        <Footer onSocialClick={handleSocialClick} />

        {/* Modal de Recursos em Breve */}
        {content && (
          <ComingSoonModal
            title={content.title}
            message={content.message}
            onClose={closeComingSoon}
          />
        )}
      </div>
    </AccessGate>
  )
}