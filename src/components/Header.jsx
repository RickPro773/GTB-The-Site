import LogoGTB from './LogoGTB'

export default function Header({ onQuadroClick }) {
  return (
    <header className="fixed top-[34px] left-0 right-0 z-[100] flex items-center justify-between py-[18px] px-[5vw] bg-gradient-to-b from-asphalt/95 to-transparent">
      <LogoGTB className="h-8 sm:h-9 w-auto" />
      <nav className="hidden sm:flex items-center">
        <a
          href="#personagens"
          className="text-paper no-underline text-sm tracking-[2px] uppercase ml-8 opacity-75 transition hover:opacity-100 hover:text-hood-green"
        >
          Personagens
        </a>
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
    </header>
  )
}
