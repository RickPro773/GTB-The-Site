/**
 * Placeholder da Rádio enquanto o player completo está em
 * desenvolvimento. As faixas e imagens de estação (src/assets/radio,
 * src/data/radioConfig.js) continuam no projeto intactas — só o
 * player (RadioSelector.jsx) não é renderizado por enquanto. Quando
 * a rádio estiver pronta, é só trocar <RadioComingSoon /> de volta
 * por <RadioSelector audio={audio} /> no App.jsx.
 */
export default function RadioComingSoon() {
  return (
    <section id="radio" className="py-24 px-[5vw] text-center">
      <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)] leading-[0.9] mb-2">
        📻 <span className="text-logo-green">Rádio</span> GTB
      </h2>
      <p className="max-w-[520px] mx-auto text-paper/70 leading-relaxed mb-10">
        Liga o som e curte a trilha sonora das ruas de Los Brodis. Em breve.
      </p>

      <div className="panel-3d max-w-md mx-auto bg-asphalt-2 border border-white/10 rounded-xl p-10 flex flex-col items-center gap-4">
        <span className="text-5xl" aria-hidden="true">
          🚧
        </span>
        <div className="inline-block border border-gta6-pink text-gta6-pink text-xs tracking-[2px] uppercase py-2 px-5">
          Em desenvolvimento
        </div>
        <p className="text-paper/60 text-sm max-w-xs">
          As estações e as faixas já estão gravadas — só falta a nossa turma finalizar o player
          antes de colocar no ar.
        </p>
      </div>
    </section>
  )
}
