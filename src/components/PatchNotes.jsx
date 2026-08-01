import React, { useState } from 'react'

const PATCH_LOGS = [
  {
    version: 'v0.0.5 Alpha',
    date: '15 de Agosto, 2026',
    status: 'Atual',
    highlights: [
      '🚗 Física de veículos e derrapagem atualizada.',
      '🏙️ Expansão do centro da cidade de Los Brodis.',
      '📻 Sistema de Rádios com canais exclusivos da comunidade.',
      '🔧 Correção de estabilidade no servidor.',
    ],
  },
  {
    version: 'v0.0.4 Alpha',
    date: '01 de Agosto, 2026',
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
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <button onClick={() => setIsOpen(true)} style={styles.triggerButton}>
        📜 NOTAS DE ATUALIZAÇÃO (PATCH NOTES)
      </button>

      {isOpen && (
        <div style={styles.backdrop} onClick={() => setIsOpen(false)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <span style={styles.subtext}>DIÁRIO DA ALPHA</span>
                <h2 className="font-pricedown" style={styles.modalTitle}>ATUALIZAÇÕES</h2>
              </div>
              <button style={styles.closeX} onClick={() => setIsOpen(false)}>✕</button>
            </div>

            <div style={styles.logsList}>
              {PATCH_LOGS.map((patch, idx) => (
                <div key={idx} style={styles.patchItem}>
                  <div style={styles.patchHead}>
                    <span className="font-pricedown" style={styles.version}>{patch.version}</span>
                    <span style={patch.status === 'Atual' ? styles.tagCurrent : styles.tagOld}>
                      {patch.date}
                    </span>
                  </div>
                  <ul style={styles.bulletList}>
                    {patch.highlights.map((item, itemIdx) => (
                      <li key={itemIdx} style={{ marginBottom: '6px' }}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>
              FECHAR
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  triggerButton: {
    backgroundColor: 'rgba(18, 18, 26, 0.8)',
    color: '#ffb703',
    border: '1px solid rgba(255, 183, 3, 0.4)',
    borderRadius: '12px',
    padding: '14px 24px',
    fontSize: '0.85rem',
    fontWeight: '800',
    letterSpacing: '1px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(8px)',
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(5, 5, 10, 0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
    padding: '20px',
  },
  modalCard: {
    backgroundColor: '#12121a',
    border: '1px solid rgba(139, 0, 255, 0.4)',
    borderRadius: '16px',
    padding: '28px',
    maxWidth: '480px',
    width: '100%',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(139,0,255,0.2)',
    textAlign: 'left',
    color: '#ffffff',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: '12px',
    marginBottom: '16px',
  },
  subtext: {
    fontSize: '0.7rem',
    color: '#8b00ff',
    fontWeight: '800',
    letterSpacing: '1px',
  },
  modalTitle: {
    margin: 0,
    fontSize: '2rem',
    color: '#00ff88',
  },
  closeX: {
    background: 'none',
    border: 'none',
    color: '#a0a0b8',
    fontSize: '1.2rem',
    cursor: 'pointer',
  },
  logsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  patchItem: {
    backgroundColor: '#0c0c12',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
    padding: '14px',
  },
  patchHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  version: {
    fontSize: '1.2rem',
    color: '#ffffff',
  },
  tagCurrent: {
    color: '#ffb703',
    fontSize: '0.72rem',
    fontWeight: '700',
  },
  tagOld: {
    color: '#6e6e82',
    fontSize: '0.72rem',
  },
  bulletList: {
    margin: 0,
    paddingLeft: '18px',
    color: '#c0c0d0',
    fontSize: '0.85rem',
    lineHeight: '1.5',
  },
  closeBtn: {
    width: '100%',
    backgroundColor: '#8b00ff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontWeight: '800',
    marginTop: '20px',
    cursor: 'pointer',
  },
}