import React from 'react'

export default function MaintenanceScreen() {
  return (
    <div style={styles.overlay}>
      {/* Importação da fonte Pricedown e animações sutis */}
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

        {/* Descrição Direta e Profissional */}
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
        </div>

        {/* Mensagem de Encerramento */}
        <p style={styles.subtext}>
          O acesso será restabelecido automaticamente assim que os serviços da fornecedora forem normalizados.
        </p>

        {/* Rodapé Clean */}
        <div style={styles.footer}>
          <span className="font-pricedown" style={styles.brand}>GRANDE THEFT BRODIS</span>
        </div>
      </div>
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
    backgroundColor: '#f8fafc', // Fundo claro e moderno
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
    color: '#0f172a', // Escuro para alto contraste sobre o card branco
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
    marginBottom: '20px',
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
  divider: {
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '12px 0',
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
    color: '#7c3aed', // Roxo marcante da identidade do site
    fontSize: '1.25rem',
    letterSpacing: '0.05em',
  },
}