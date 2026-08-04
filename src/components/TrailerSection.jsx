import trailerImg from '../assets/images/trailer-img.png'

export default function TrailerSection() {
  return (
    <section id="trailer" className="py-24 px-[5vw] text-center">
      <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)] leading-[0.9] mb-2">
        <span className="text-logo-blue text-3d-purple">Trailer</span> Oficial
      </h2>
      <p className="max-w-[520px] mx-auto text-paper/70 leading-relaxed mb-8">
        O primeiro vídeo do GTB tá sendo produzido pela nossa turma.
      </p>

      <div className="panel-3d max-w-2xl mx-auto rounded-xl border border-white/10 bg-asphalt-2 overflow-hidden">
        <div className="aspect-video flex items-center justify-center p-6 bg-gradient-to-b from-asphalt-2 to-asphalt">
          <img
            src={trailerImg}
            alt="Prévia dos personagens do GTB — Rick, Fotafox, GTA2D e Dragon em modelo Roblox"
            className="max-w-full max-h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
          />
        </div>
        <div className="border-t border-white/10 py-3 px-4 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-warn-yellow animate-pulse" />
          <span className="font-display text-lg text-warn-yellow tracking-wide">Em Breve</span>
        </div>
      </div>
    </section>
  )
}
