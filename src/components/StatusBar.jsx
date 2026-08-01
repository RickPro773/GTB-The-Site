export default function StatusBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[99] bg-warn-yellow text-neutral-900 text-center font-body font-bold tracking-[2px] text-[0.7rem] sm:text-xs uppercase py-2 px-4">
      🚧 Jogo indisponível no momento &middot; Versão{' '}
      <b className="text-neon-purple-dim">v0.0.5 Alpha Fechada</b>
    </div>
  )
}
