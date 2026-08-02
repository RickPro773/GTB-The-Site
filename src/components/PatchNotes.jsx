import { useState } from 'react'

// Adicione novas versões no topo do array — a mais recente aparece
// primeiro. status: 'Atual' destaca em amarelo, qualquer outro
// valor aparece neutro.
const PATCH_LOGS = [
  {
    version: 'v0.0.5 Alpha',
    date: '01 de Agosto, 2026',
    status: 'Atual',
    highlights: [
      '🚗 Física de veículos e derrapagem atualizada.',
      '🏙️ Expansão do centro da cidade de Los Brodis.',
      '📻 Sistema de rádios com canais exclusivos da comunidade.',
      '🔧 Correção de estabilidade no servidor.',
    ],
  },
  {
    version: 'v0.0.4 Alpha',
    date: '01 de Julho, 2026',
    status: 'Anterior',
    highlights: [
      '🧢 Novos itens e roupas exclusivas.',
      '🔫 Ajustes no sistema de armas e inventário.',
    ],
  },
]

export default function PatchNotes() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="text-center py-8">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-asphalt-2/80 border border-warn-yellow/40 text-warn-yellow rounded-xl py-3.5 px-6 text-sm font-bold tracking-[1px] backdrop-blur-sm hover:bg-asphalt-2 transition"
      >
        📜 Notas de Atualização (Patch Notes)
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/75 backdrop-blur-sm px-5"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-asphalt-2 border border-neon-purple/40 rounded-2xl p-7 max-w-md w-full max-h-[80vh] overflow-y-auto text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start border-b border-white/10 pb-3 mb-4">
              <div>
                <span className="text-neon-purple text-xs font-bold tracking-[1px] uppercase">
                  Diário da Alpha
                </span>
                <h2 className="font-display text-3xl text-logo-green text-3d-green leading-none mt-1">
                  Atualizações
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-paper/50 hover:text-paper transition text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3.5">
              {PATCH_LOGS.map((patch) => (
                <div key={patch.version} className="bg-asphalt border border-white/[0.06] rounded-lg p-3.5">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="font-display text-xl text-paper">{patch.version}</span>
                    <span
                      className={`text-[0.7rem] font-bold ${
                        patch.status === 'Atual' ? 'text-warn-yellow' : 'text-paper/40'
                      }`}
                    >
                      {patch.date}
                    </span>
                  </div>
                  <ul className="text-paper/70 text-sm leading-relaxed pl-4 list-disc space-y-1.5">
                    {patch.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-neon-purple text-white rounded-lg py-3 mt-5 text-sm font-bold hover:bg-neon-purple-dim transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
