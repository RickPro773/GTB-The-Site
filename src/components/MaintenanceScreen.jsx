import { useState } from 'react'
import LogoGTB from './LogoGTB'

// ⚙️ STATUS DOS SERVIÇOS DO PROJETO:
// true  = Operacional (verde)
// false = Pausado / Desativado (vermelho)
const SERVICOS = [
  { nome: 'Infraestrutura da Plataforma', ok: false },
  { nome: 'Hospedagem Web (Vercel)', ok: true },
  { nome: 'Servidor de Áudio (Menu Theme)', ok: false },
  { nome: 'API de Dados / Personagens', ok: false },
  { nome: 'Integração com Banco de Dados', ok: false },
]

export default function MaintenanceScreen() {
  const [showModal, setShowModal] = useState(false)
  const [lastChecked, setLastChecked] = useState(() =>
    new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  )

  function handleReload() {
    setLastChecked(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
    window.location.reload()
  }

  const pausedCount = SERVICOS.filter((s) => !s.ok).length

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-asphalt px-6 py-8"
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 20%, rgba(192,38,255,.12), transparent 55%)',
      }}
    >
      <div className="max-w-md w-full text-center">
        <LogoGTB className="h-14 w-auto mx-auto mb-8" />

        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/40 py-1.5 px-4 rounded-full text-[0.68rem] font-bold tracking-[1px] text-red-400 uppercase mb-6">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Serviços Pausados
        </div>

        <h1 className="font-display text-4xl text-paper mb-4">Atividades Encerradas</h1>

        <p className="text-paper/65 text-sm leading-relaxed mb-6">
          Devido aos <strong className="text-paper">altos custos para manter o servidor ativo</strong>, 
          decidimos suspender as operações do site no momento. O projeto não foi abandonado em definitivo e <strong className="text-paper">existe a possibilidade de voltarmos no futuro</strong>!
        </p>

        <div className="bg-asphalt-2 border border-white/10 rounded-lg p-5 mb-4 text-left">
          <Row label="Causa" value="Altos custos de servidor" valueClass="text-red-400" />
          <Divider />
          <Row label="Status atual" value="Operação suspensa" valueClass="text-warn-yellow" />
          <Divider />
          <Row label="Perspectiva" value="Possível retorno futuro" valueClass="text-paper/80" />
          <Divider />
          <Row label="Última checagem" value={`Hoje às ${lastChecked}`} />
          <Divider />
          <Row label="ID do evento" value="OFF-2026-SYS-PAUSED" mono />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="w-full border border-white/15 text-paper/70 rounded-lg py-2.5 px-4 text-sm font-semibold mb-3 hover:bg-white/5 transition"
        >
          🔍 Ver status dos módulos ({pausedCount} desativados)
        </button>

        <button
          onClick={handleReload}
          className="w-full bg-neon-purple text-white rounded-lg py-3 px-4 text-sm font-bold tracking-[0.5px] mb-5 hover:bg-neon-purple-dim transition"
        >
          🔄 Verificar novamente
        </button>

        <p className="text-paper/40 text-xs leading-relaxed">
          Agradecemos pelo apoio de todos até aqui. Fiquem atentos para futuros retornos!
        </p>

        <div className="mt-6 pt-5 border-t border-white/10">
          <span className="font-display text-lg text-logo-purple text-3d-purple">GRAND THEFT BRODIS</span>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/70 backdrop-blur-sm px-5"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-asphalt-2 border border-white/10 rounded-lg p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-paper font-bold text-lg">Diagnóstico do Sistema</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-paper/50 hover:text-paper transition text-lg leading-none"
              >
                ✕
              </button>
            </div>
            <p className="text-paper/55 text-sm mb-4">
              Estado atual dos módulos do GRAND THEFT BRODIS:
            </p>
            <div className="flex flex-col gap-2.5">
              {SERVICOS.map((servico) => (
                <div
                  key={servico.nome}
                  className="flex justify-between items-center bg-asphalt border border-white/5 rounded-md py-2.5 px-3.5 text-sm"
                >
                  <span className="text-paper/80">{servico.nome}</span>
                  {servico.ok ? (
                    <span className="text-hood-green text-xs font-bold">🟢 Operacional</span>
                  ) : (
                    <span className="text-red-400 text-xs font-bold">🔴 Desativado</span>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowModal(false)}
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

function Row({ label, value, valueClass = 'text-paper', mono = false }) {
  return (
    <div className="flex justify-between items-center text-sm py-0.5">
      <span className="text-paper/50">{label}</span>
      <span
        className={`font-semibold ${valueClass} ${mono ? 'font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded' : ''}`}
      >
        {value}
      </span>
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-white/10 my-2.5" />
}
