import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import StatusBar from './components/StatusBar'
import ExperimentalBadge from './components/ExperimentalBadge'
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
import PatchNotes from './components/PatchNotes'
import CharacterBio from './components/CharacterBio'
import PageTransition from './components/PageTransition'
import Reveal from './components/Reveal'
import Countdown from './components/Countdown'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useComingSoon } from './hooks/useComingSoon'

// ⚙️ Troque para true quando o site precisar ficar em manutenção.
// Com isso ativo, o site inteiro (intro, sons, tudo) para de
// carregar e só a tela de aviso aparece. Tem prioridade sobre o
// countdown — se os dois estiverem ativos, a manutenção vence.
const IN_MAINTENANCE = false

// ⚙️ Troque para false quando quiser pular o countdown direto pro
// site (ex: enquanto você está testando/ajustando o resto do site
// no dia a dia, sem precisar esperar o cronômetro de verdade).
const COUNTDOWN_ENABLED = true

const SOCIAL_ERRORS = {
  Discord: 'Servidor do Discord ainda não disponível. Volte em breve.',
  Roblox: 'Link do Roblox ainda não disponível. Volte em breve.',
}

export default function App() {
  if (IN_MAINTENANCE) {
    return <MaintenanceScreen />
  }

  return <CountdownGate />
}

/**
 * Controla se o countdown ou o site de verdade está visível. O
 * site inteiro (SiteRoutes) já monta por baixo o tempo todo — ele
 * só fica coberto pelo <Countdown> em tela cheia até o tempo
 * zerar. Isso é proposital: quando o countdown termina, a
 * transição é instantânea (o site já estava pronto por baixo),
 * sem precisar carregar nada na hora.
 */
function CountdownGate() {
  const [revealed, setRevealed] = useState(!COUNTDOWN_ENABLED)

  return (
    <>
      <SiteRoutes />
      {!revealed && <Countdown onFinish={() => setRevealed(true)} />}
    </>
  )
}

function SiteRoutes() {
  const audio = useAudioPlayer()
  const location = useLocation()
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
      <div className="site-grain" aria-hidden="true" />
      <ExperimentalBadge />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <StatusBar />
                <Intro audio={audio} />
                <NowPlayingToast label={audio.nowPlayingLabel} />
                <Header onQuadroClick={handleQuadroClick} />

                <Hero />
                <Reveal><Characters /></Reveal>
                <Reveal><CharacterPoll /></Reveal>
                <Reveal><TrailerSection /></Reveal>
                <Reveal><PatchNotes /></Reveal>
                <Reveal><PlaySection /></Reveal>
                <Footer onSocialClick={handleSocialClick} />
              </PageTransition>
            }
          />
          <Route path="/personagem/:slug" element={<CharacterBio audio={audio} />} />
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
        {socialError && (
          <ErrorToast key="error-toast" message={socialError} onClose={() => setSocialError(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
