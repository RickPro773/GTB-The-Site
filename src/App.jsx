import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
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
import BlogList from './components/BlogList'
import BlogPost from './components/BlogPost'
import ChatPage from './components/ChatPage'
import PageTransition from './components/PageTransition'
import Reveal from './components/Reveal'
import AuthModal from './components/AuthModal'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useComingSoon } from './hooks/useComingSoon'
import { useAuth } from './hooks/useAuth'
import { useState } from 'react'

// ⚙️ Troque para true quando o site precisar ficar em manutenção.
// Com isso ativo, o site inteiro (intro, sons, tudo) para de
// carregar e só a tela de aviso aparece.
const IN_MAINTENANCE = false

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
  const location = useLocation()
  const auth = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
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
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <StatusBar />
                <Intro audio={audio} />
                <NowPlayingToast label={audio.nowPlayingLabel} />
                <Header onQuadroClick={handleQuadroClick} auth={auth} onOpenAuth={() => setAuthModalOpen(true)} />

                <Hero />
                <Characters />
                <Reveal><RadioSelector audio={audio} /></Reveal>
                <Reveal><CharacterPoll /></Reveal>
                <Reveal><TrailerSection /></Reveal>
                <Reveal><PatchNotes /></Reveal>
                <Reveal><PlaySection /></Reveal>
                <Footer onSocialClick={handleSocialClick} />
              </PageTransition>
            }
          />
          <Route path="/personagem/:slug" element={<CharacterBio audio={audio} />} />
          <Route path="/blog" element={<BlogList />} />
          <Route
            path="/blog/:slug"
            element={<BlogPost auth={auth} onOpenAuth={() => setAuthModalOpen(true)} />}
          />
          <Route
            path="/chat"
            element={<ChatPage auth={auth} onOpenAuth={() => setAuthModalOpen(true)} />}
          />
        </Routes>
      </AnimatePresence>

      <AnimatePresence>
        {content && (
          <ComingSoonModal
            key="coming-soon"
            title={content.title}
            message={content.message}
            onClose={closeComingSoon}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {authModalOpen && (
          <AuthModal key="auth-modal" auth={auth} onClose={() => setAuthModalOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {socialError && (
          <ErrorToast key="error-toast" message={socialError} onClose={() => setSocialError(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
