import { Routes, Route } from 'react-router-dom'
import StatusBar from './components/StatusBar'
import Header from './components/Header'
import Intro from './components/Intro'
import NowPlayingToast from './components/NowPlayingToast'
import Hero from './components/Hero'
import Characters from './components/Characters'
import CharacterPoll from './components/CharacterPoll'
import TrailerSection from './components/TrailerSection'
import PlaySection from './components/PlaySection'
import Footer from './components/Footer'
import ComingSoonModal from './components/ComingSoonModal'
import ErrorToast from './components/ErrorToast'
import MaintenanceScreen from './components/MaintenanceScreen'
import RadioSelector from './components/RadioSelector'
import PatchNotes from './components/PatchNotes'
import CharacterBio from './components/CharacterBio'
import Reveal from './components/Reveal'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useComingSoon } from './hooks/useComingSoon'
import { useState } from 'react'

// ⚙️ Troque para true quando o site precisar ficar em manutenção.
// Com isso ativo, o site inteiro (intro, sons, tudo) para de
// carregar e só a tela de aviso aparece.
const IN_MAINTENANCE = true

const SOCIAL_ERRORS = {
  Discord: 'Servidor do Discord ainda não disponível. Volte em breve.',
  Roblox: 'Link do Roblox ainda não disponível. Volte em breve.',
}

export default function App() {
  // Enquanto em manutenção, nenhum hook de áudio/intro roda — a
  // tela de manutenção é tudo que existe, sem som nenhum.
  if (IN_MAINTENANCE) {
    return <MaintenanceScreen />
  }

  return <SiteRoutes />
}

function SiteRoutes() {
  const audio = useAudioPlayer()
  const { content, showComingSoon, closeComingSoon } = useComingSoon()
  const [socialError, setSocialError] = useState(null)

  function handleSocialClick(network) {
    setSocialError(SOCIAL_ERRORS[network])
  }

  function handleQuadroClick() {
    showComingSoon(
      'Quadro',
      'Um mural com atualizações, bastidores e ideias do desenvolvimento do GTB. Em construção pela nossa turma.'
    )
  }

  return (
    <div className="bg-asphalt text-paper font-body overflow-x-hidden">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <StatusBar />
              <Intro audio={audio} />
              <NowPlayingToast label={audio.nowPlayingLabel} />
              <Header onQuadroClick={handleQuadroClick} />

              <Hero />
              <Reveal><Characters /></Reveal>
              <Reveal><RadioSelector audio={audio} /></Reveal>
              <Reveal><CharacterPoll /></Reveal>
              <Reveal><TrailerSection /></Reveal>
              <Reveal><PatchNotes /></Reveal>
              <Reveal><PlaySection /></Reveal>
              <Footer onSocialClick={handleSocialClick} />
            </>
          }
        />
        <Route path="/personagem/:slug" element={<CharacterBio audio={audio} />} />
      </Routes>

      {content && (
        <ComingSoonModal
          title={content.title}
          message={content.message}
          onClose={closeComingSoon}
        />
      )}

      {socialError && <ErrorToast message={socialError} onClose={() => setSocialError(null)} />}
    </div>
  )
}
