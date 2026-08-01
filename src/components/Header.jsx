import LogoGTB from './LogoGTB'

export default function Header() {
  return (
    <header className="fixed top-[34px] left-0 right-0 z-[100] flex items-center justify-between py-[18px] px-[5vw] bg-gradient-to-b from-asphalt/95 to-transparent">
      <LogoGTB className="h-8 sm:h-9 w-auto" />
      <nav className="hidden sm:block">
        <a
          href="#personagens"
          className="text-paper no-underline text-sm tracking-[2px] uppercase ml-8 opacity-75 transition hover:opacity-100 hover:text-hood-green"
        >
          Personagens
        </a>
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
