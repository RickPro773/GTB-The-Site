import StatusBar from './components/StatusBar'
import Header from './components/Header'
import Intro from './components/Intro'
import NowPlayingToast from './components/NowPlayingToast'
import Hero from './components/Hero'
import Characters from './components/Characters'
import PlaySection from './components/PlaySection'
import Footer from './components/Footer'
import { useAudioPlayer } from './hooks/useAudioPlayer'

export default function App() {
  const audio = useAudioPlayer()

  return (
    <div className="bg-asphalt text-paper font-body overflow-x-hidden">
      <StatusBar />
      <Intro audio={audio} />
      <NowPlayingToast label={audio.nowPlayingLabel} />
      <Header />
      <Hero />
      <Characters />
      <PlaySection />
      <Footer />
    </div>
  )
}
