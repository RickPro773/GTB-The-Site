import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProfileButton from './ProfileButton'

export default function Header({ onQuadroClick, auth, onOpenAuth }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleQuadroClick() {
    setMobileOpen(false)
    onQuadroClick()
  }

  return (
    <header className="fixed top-[34px] left-0 right-0 z-[100] bg-gradient-to-b from-asphalt/95 to-transparent">
      <div className="flex items-center justify-between py-[18px] px-[5vw]">
        <a
          href="#"
          className="font-body font-bold text-sm tracking-[3px] text-paper/80 no-underline hover:text-hood-green transition"
        >
          GTB
        </a>

        <nav className="hidden sm:flex items-center">
          <a
            href="#personagens"
            className="text-paper no-underline text-sm tracking-[2px] uppercase ml-8 opacity-75 transition hover:opacity-100 hover:text-hood-green"
          >
            Personagens
          </a>
          <a
            href="#radio"
            className="text-paper no-underline text-sm tracking-[2px] uppercase ml-8 opacity-75 transition hover:opacity-100 hover:text-hood-green"
          >
            Rádio
          </a>
          <a
            href="#trailer"
            className="text-paper no-underline text-sm tracking-[2px] uppercase ml-8 opacity-75 transition hover:opacity-100 hover:text-logo-blue"
          >
            Trailer
          </a>
          <Link
            to="/blog"
            className="text-paper no-underline text-sm tracking-[2px] uppercase ml-8 opacity-75 transition hover:opacity-100 hover:text-logo-purple"
          >
            Blog
          </Link>
          <Link
            to="/chat"
            className="text-paper no-underline text-sm tracking-[2px] uppercase ml-8 opacity-75 transition hover:opacity-100 hover:text-hood-green"
          >
            Chat
          </Link>
          <button
            onClick={onQuadroClick}
            className="text-paper no-underline text-sm tracking-[2px] uppercase ml-8 opacity-75 transition hover:opacity-100 hover:text-neon-purple bg-transparent border-0 cursor-pointer font-body"
          >
            Quadro
          </button>
          <a
            href="#jogar"
            className="text-paper no-underline text-sm tracking-[2px] uppercase ml-8 opacity-75 transition hover:opacity-100 hover:text-hood-green"
          >
            Jogar
          </a>
        </nav>

        <div className="hidden sm:block">
          <ProfileButton
            user={auth.user}
            isLoading={auth.isLoading}
            onOpenAuth={onOpenAuth}
            onLogout={auth.logout}
            onAvatarUpdated={auth.refreshUser}
          />
        </div>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="sm:hidden text-paper w-9 h-9 flex flex-col items-center justify-center gap-1.5"
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={mobileOpen}
        >
          <span
            className={`block w-6 h-0.5 bg-paper transition-transform ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`}
          />
          <span className={`block w-6 h-0.5 bg-paper transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
          <span
            className={`block w-6 h-0.5 bg-paper transition-transform ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`}
          />
        </button>
      </div>

      {/* menu mobile — some/aparece, mantém a mesma paleta do site */}
      <nav
        className={`sm:hidden overflow-hidden bg-asphalt/98 backdrop-blur-sm transition-[max-height] duration-300 ${
          mobileOpen ? 'max-h-72' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col px-[5vw] py-4 gap-4">
          <a
            href="#personagens"
            onClick={() => setMobileOpen(false)}
            className="text-paper no-underline text-sm tracking-[2px] uppercase opacity-80 hover:text-hood-green"
          >
            Personagens
          </a>
          <a
            href="#radio"
            onClick={() => setMobileOpen(false)}
            className="text-paper no-underline text-sm tracking-[2px] uppercase opacity-80 hover:text-hood-green"
          >
            Rádio
          </a>
          <a
            href="#trailer"
            onClick={() => setMobileOpen(false)}
            className="text-paper no-underline text-sm tracking-[2px] uppercase opacity-80 hover:text-logo-blue"
          >
            Trailer
          </a>
          <Link
            to="/blog"
            onClick={() => setMobileOpen(false)}
            className="text-paper no-underline text-sm tracking-[2px] uppercase opacity-80 hover:text-logo-purple"
          >
            Blog
          </Link>
          <Link
            to="/chat"
            onClick={() => setMobileOpen(false)}
            className="text-paper no-underline text-sm tracking-[2px] uppercase opacity-80 hover:text-hood-green"
          >
            Chat
          </Link>
          <button
            onClick={handleQuadroClick}
            className="text-left text-paper no-underline text-sm tracking-[2px] uppercase opacity-80 hover:text-neon-purple bg-transparent border-0 cursor-pointer font-body"
          >
            Quadro
          </button>
          <a
            href="#jogar"
            onClick={() => setMobileOpen(false)}
            className="text-paper no-underline text-sm tracking-[2px] uppercase opacity-80 hover:text-hood-green"
          >
            Jogar
          </a>

          <div className="pt-2 border-t border-white/[0.06]">
            {auth.user ? (
              <button
                onClick={() => {
                  setMobileOpen(false)
                  auth.logout()
                }}
                className="text-left text-red-400 text-sm tracking-[2px] uppercase opacity-80"
              >
                Sair ({auth.user.nickname}#{auth.user.discriminator})
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileOpen(false)
                  onOpenAuth()
                }}
                className="text-left text-logo-green text-sm tracking-[2px] uppercase opacity-90"
              >
                Entrar / Criar conta
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
