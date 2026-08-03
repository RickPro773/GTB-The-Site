import trailerImg from '../assets/images/trailer-img.png';

export default function TrailerSection() {
  return (
    <section id="trailer" className="py-24 px-[5vw] text-center">
      <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)] leading-[0.9] mb-2">
        <span className="text-logo-blue text-3d-purple">Trailer</span> Oficial
      </h2>
      <p className="max-w-[520px] mx-auto text-paper/70 leading-relaxed mb-8">
        O primeiro vídeo do GTB tá sendo produzido.
      </p>

      <div className="panel-3d max-w-2xl mx-auto aspect-video rounded-xl border border-white/10 bg-asphalt-2 overflow-hidden flex items-center justify-center p-4">
        <img 
          src={trailerImg} 
          alt="Preview do Trailer Oficial" 
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </section>
  )
}
