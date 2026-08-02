export default function TrailerSection() {
  return (
    <section id="trailer" className="py-24 px-[5vw] text-center">
      <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)] leading-[0.9] mb-2">
        <span className="text-logo-blue text-3d-purple">Trailer</span> Oficial
      </h2>
      <p className="max-w-[520px] mx-auto text-paper/70 leading-relaxed mb-8">
        O primeiro vídeo do GTB tá sendo produzido pela nossa turma.
      </p>

      <div className="panel-3d max-w-2xl mx-auto aspect-video rounded-xl border border-white/10 bg-asphalt-2 flex flex-col items-center justify-center gap-4">
        <span className="text-5xl opacity-40">🎬</span>
        <span className="font-display text-2xl text-paper/50">Em Breve</span>
        <span className="text-xs text-paper/30 uppercase tracking-[2px]">
          Trailer em produção
        </span>
      </div>
    </section>
  )
}
