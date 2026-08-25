import LoadingImage from './LoadingImage'

/**
 * Foto tipo "mugshot" (boletim policial) do personagem, com placa
 * de numeração presa embaixo e réguas de altura atrás — só aparece
 * na ficha do personagem se ele tiver `mugshot` definido no roster.
 *
 * Como ativar pra um personagem (veja o passo a passo completo em
 * data/roster.js, campo `mugshot`):
 * 1. Salve a foto em src/assets/images/ (ex: rick-mugshot.png)
 * 2. Importe em roster.js e adicione `mugshot: rickMugshot` no
 *    personagem
 * 3. (Opcional) defina `inmateNumber` — se não definir, um número
 *    é gerado automaticamente a partir do `id` do personagem.
 */
export default function MugshotPlacard({ char }) {
  if (!char.mugshot) return null

  const number = char.inmateNumber || `GTB-${char.id.padStart(2, '0')}-1918`

  return (
    <div className="panel-3d mt-4 bg-asphalt-2 border border-white/10 rounded-xl p-4">
      <h3 className="font-display text-xl text-gta6-pink mb-3 flex items-center gap-2">
        Ficha Criminal <span className="text-[0.6rem] tracking-[2px] uppercase text-paper/40 font-body">Depto. de Los Brodis</span>
      </h3>

      <div className="relative aspect-[4/5] rounded-lg overflow-hidden border-2 border-white/15">
        {/* réguas de altura ao fundo, estilo boletim policial */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 40px)',
          }}
        />
        <div className="absolute inset-y-0 left-0 w-full flex flex-col justify-between py-2 pointer-events-none z-10">
          {['180', '170', '160', '150'].map((mark) => (
            <div key={mark} className="flex items-center px-2">
              <span className="text-[0.55rem] text-white/50 font-mono">{mark}</span>
              <div className="flex-1 h-px bg-white/20 ml-2" />
            </div>
          ))}
        </div>

        <LoadingImage
          src={char.mugshot}
          alt={`Mugshot de ${char.name} — ficha criminal`}
          className="absolute inset-0 w-full h-full object-cover"
          accentColor={char.theme}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
      </div>

      {/* placa presa embaixo da foto, tipo cartaz de detido */}
      <div
        className="mt-3 rounded-md border-2 py-2 px-3 flex items-center justify-between font-mono"
        style={{ borderColor: char.theme, backgroundColor: 'rgba(0,0,0,0.4)' }}
      >
        <div>
          <div className="text-[0.6rem] tracking-[2px] uppercase text-paper/40">Preso Nº</div>
          <div className="text-lg font-bold tracking-[1px]" style={{ color: char.theme }}>
            {number}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[0.6rem] tracking-[2px] uppercase text-paper/40">Nome</div>
          <div className="text-sm font-bold text-paper uppercase">{char.name}</div>
        </div>
      </div>
    </div>
  )
}