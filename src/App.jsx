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
import RadioSelector from './components/RadioSelector'
import PatchNotes from './components/PatchNotes'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useComingSoon } from './hooks/useComingSoon'

// ⚙️ Troque para true quando o site precisar ficar em manutenção.
// Com isso ativo, o site inteiro (intro, sons, tudo) para de
// carregar e só a tela de aviso aparece.
const IN_MAINTENANCE = false

const SOCIAL_MESSAGES = {
  Discord:
    'Nosso servidor do Discord está a caminho. É lá que vai rolar novidade, teste fechado e papo direto com a turma.',
  Roblox:
    'A página do GTB no Roblox ainda não está no ar — assim que a build sair da alpha fechada, o link aparece aqui.',
}

export default function App() {
  // Enquanto em manutenção, nenhum hook de áudio/intro roda — a
  // tela de manutenção é tudo que existe, sem som nenhum.
  if (IN_MAINTENANCE) {
    return <MaintenanceScreen />
  }

  return <SiteContent />
}

function SiteContent() {
  const audio = useAudioPlayer()
  const { content, showComingSoon, closeComingSoon } = useComingSoon()

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
      <RadioSelector audio={audio} />

      <Hero />
      <Characters />
      <PatchNotes />
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
