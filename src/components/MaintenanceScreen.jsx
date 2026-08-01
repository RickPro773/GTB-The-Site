import React, { useState } from 'react'

// ⚙️ ONDE VOCÊ CONFIGURA O QUE TÁ CAÍDO OU RODANDO:
// true  = Operacional (Verde 🟢)
// false = Com Falha (Vermelho 🔴)
const SERVICOS = [
  { nome: 'Infraestrutura da Provedora', ok: false },
  { nome: 'Hospedagem Web (Netlify)', ok: true },
  { nome: 'Servidor de Áudio (Menu Theme)', ok: false },
  { nome: 'API de Dados / Personagens', ok: true },
  { nome: 'Integração com banco de dados', ok: false },
]

export default function MaintenanceScreen() {
  const [showModal, setShowModal] = useState(false)
  const [lastChecked, setLastChecked] = useState(() => 
    new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  )

  const handleReload = () => {
    setLastChecked(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
    window.location.reload()
  }

  return (
    <div style={styles.overlay}>
      <style>{`
        @font-face {
          font-family: 'Pricedown';
          src: url('/pricedown.otf') format('opentype'),
               url('/fonts/pricedown.otf') format('opentype');
          font-weight: normal;
          font-style: normal;
        }

        .font-pricedown {
          font-family: 'Pricedown', 'Impact', sans-serif;
        }

        @keyframes pulseAmber {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        .pulse {
          animation: pulseAmber 1.6s infinite ease-in-out;
        }

        .btn-reload {
          transition: all 0.2s ease-in-out;
        }
        .btn-reload:hover {
          background-color: #6d28d9 !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
        }

        .btn-details {
          transition: all 0.2s ease-in-out;
        }
        .btn-details:hover {
          background-color: #f1f5f9 !important;
          color: #0f172a !important;
        }
      `}</style>

      <div style={styles.card}>
        {/* Tag de Alerta Corporativo */}
        <div style={styles.statusBadge}>
          <span className="pulse" style={styles.badgeDot}></span>
          <span>INSTABILIDADE NO PROVEDOR DE HOSPEDAGEM</span>
        </div>

        {/* Título Principal */}
        <h1 className="font-pricedown" style={styles.title}>
          MANUTENÇÃO
        </h1>

        {/* Descrição Direta */}
        <p style={styles.description}>
          A plataforma encontra-se temporariamente indisponível devido a uma oscilação técnica nos <strong style={{ color: '#111827' }}>servidores da nossa provedora de infraestrutura</strong>.
        </p>

        {/* Tabela de Diagnóstico Técnico */}
        <div style={styles.infoBox}>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Causa</span>
            <span style={styles.infoValue}>Falha Externa do Provedor</span>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Status Atual</span>
            <span style={{ ...styles.infoValue, color: '#d97706' }}>Acompanhando Resolução</span>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Última Checagem</span>
            <span style={styles.infoValue}>Hoje às {lastChecked}</span>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>ID do Incidente</span>
            <span style={styles.codeValue}>INC-503-PROV-OUTAGE</span>
          </div>
        </div>

        {/* Botão de Abrir Detalhes dos Serviços */}
        <button 
          className="btn-details" 
          onClick={() => setShowModal(true)} 
          style={styles.detailsButton}
        >
          🔍 Ver Status dos Serviços ({SERVICOS.filter(s => !s.ok).length} com falha)
        </button>

        {/* Botão Tentar Novamente */}
        <button className="btn-reload" onClick={handleReload} style={styles.button}>
          🔄 Tentar Novamente
        </button>

        {/* Mensagem de Encerramento */}
        <p style={styles.subtext}>
          O acesso será restabelecido automaticamente assim que os serviços da fornecedora forem normalizados.
        </p>

        {/* Rodapé */}
        <div style={styles.footer}>
          <span className="font-pricedown" style={styles.brand}>GRAND THEFT BRODI</span>
        </div>
      </div>

      {/* 🟢 MODAL COM A LISTA DE SERVIÇOS (TRUE / FALSE) */}
      {showModal && (
        <div style={styles.modalBackdrop} onClick={() => setShowModal(false)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Diagnóstico do Sistema</h3>
              <button style={styles.closeButton} onClick={() => setShowModal(false)}>✕</button>
            </div>

            <p style={styles.modalSubtext}>
              Estado individual dos módulos do GRAND THEFT BRODI:
            </p>

            <div style={styles.servicesList}>
              {SERVICOS.map((servico, index) => (
                <div key={index} style={styles.serviceItem}>
                  <span style={styles.serviceName}>{servico.nome}</span>
                  {servico.ok ? (
                    <span style={styles.statusOnline}>🟢 Operacional</span>
                  ) : (
                    <span style={styles.statusOffline}>🔴 Com Falha</span>
                  )}
                </div>
              ))}
            </div>

            <button 
              className="btn-reload" 
              onClick={() => setShowModal(false)} 
              style={{ ...styles.button, marginTop: '20px', marginBottom: 0 }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#f8fafc',
    backgroundImage: 'radial-gradient(circle at 50% 0%, #ffffff 0%, #f1f5f9 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
    padding: '24px',
    boxSizing: 'border-box',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '40px 32px',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#fffbeb',
    border: '1px solid #fef3c7',
    padding: '6px 14px',
    borderRadius: '9999px',
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#b45309',
    letterSpacing: '0.05em',
    marginBottom: '24px',
  },
  badgeDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#d97706',
    borderRadius: '50%',
  },
  title: {
    fontSize: '3.4rem',
    color: '#0f172a',
    margin: '0 0 16px 0',
    letterSpacing: '0.02em',
    lineHeight: '1',
    textTransform: 'uppercase',
  },
  description: {
    color: '#475569',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    margin: '0 0 24px 0',
  },
  infoBox: {
    backgroundColor: '#f8fafc',
    border: '1px solid #f1f5f9',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '16px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.85rem',
  },
  infoLabel: {
    color: '#64748b',
    fontWeight: '500',
  },
  infoValue: {
    color: '#0f172a',
    fontWeight: '600',
  },
  codeValue: {
    color: '#475569',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: '0.8rem',
    fontWeight: '700',
    backgroundColor: '#e2e8f0',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '12px 0',
  },
  detailsButton: {
    width: '100%',
    backgroundColor: '#ffffff',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '10px 16px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '12px',
  },
  button: {
    width: '100%',
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '16px',
  },
  subtext: {
    fontSize: '0.825rem',
    color: '#94a3b8',
    margin: '0 0 24px 0',
    lineHeight: '1.4',
  },
  footer: {
    borderTop: '1px solid #f1f5f9',
    paddingTop: '20px',
  },
  brand: {
    color: '#7c3aed',
    fontSize: '1.25rem',
    letterSpacing: '0.05em',
  },

  /* ESTILOS DO MODAL */
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100000,
    padding: '20px',
  },
  modalCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '28px 24px',
    maxWidth: '420px',
    width: '100%',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.1rem',
    color: '#0f172a',
    fontWeight: '700',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '4px',
  },
  modalSubtext: {
    fontSize: '0.85rem',
    color: '#64748b',
    margin: '0 0 16px 0',
  },
  servicesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  serviceItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    border: '1px solid #f1f5f9',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '0.85rem',
  },
  serviceName: {
    color: '#334155',
    fontWeight: '500',
  },
  statusOnline: {
    color: '#16a34a',
    fontWeight: '600',
    fontSize: '0.8rem',
  },
  statusOffline: {
    color: '#dc2626',
    fontWeight: '600',
    fontSize: '0.8rem',
  },
}