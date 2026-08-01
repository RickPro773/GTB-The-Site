import React, { useState, useEffect } from 'react'

// 🔐 LISTA DAS 4 CHAVES DE ATIVAÇÃO VÁLIDAS:
const VALID_KEYS = [
  'BRODI-ALPHA-01',
  'BRODI-ALPHA-02',
  'BRODI-ALPHA-03',
  'BRODI-ALPHA-04',
]

export default function AccessGate({ children }) {
  const [inputKey, setInputKey] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Verifica se o usuário já inseriu a chave anteriormente
  useEffect(() => {
    const savedAccess = localStorage.getItem('gtb_access_granted')
    if (savedAccess === 'true') {
      setIsUnlocked(true)
    }
    setIsLoading(false)
  }, [])

  const handleVerifyKey = (e) => {
    e.preventDefault()
    const cleanKey = inputKey.trim().toUpperCase()

    if (VALID_KEYS.includes(cleanKey)) {
      // Salva a permissão no navegador (persistente)
      localStorage.setItem('gtb_access_granted', 'true')
      setIsUnlocked(true)
      setErrorMsg('')
    } else {
      setErrorMsg('Chave inválida ou expirada. Tente novamente!')
    }
  }

  // Enquanto verifica o localStorage na inicialização
  if (isLoading) return null

  // Se já tiver liberado o acesso, renderiza o site normal
  if (isUnlocked) {
    return <>{children}</>
  }

  // Se não estiver liberado, exibe a tela de chave de acesso
  return (
    <div style={styles.overlay}>
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 25px rgba(139, 0, 255, 0.3); }
          50% { box-shadow: 0 0 45px rgba(139, 0, 255, 0.6); }
        }
        .glow-card {
          animation: pulseGlow 3s infinite ease-in-out;
        }
        .key-input:focus {
          outline: none;
          border-color: #00ff88 !important;
          box-shadow: 0 0 12px rgba(0, 255, 136, 0.4);
        }
      `}</style>

      <div className="glow-card" style={styles.card}>
        <div style={styles.badge}>
          🔒 ACESSO RESTRITO
        </div>

        <h1 className="font-pricedown" style={styles.title}>
          CHAVE DE ATIVAÇÃO
        </h1>

        <p style={styles.description}>
          Para acessar a plataforma do <strong style={{ color: '#fff' }}>GRAND THEFT BRODI</strong>, digite uma das chaves de acesso ativas.
        </p>

        <form onSubmit={handleVerifyKey} style={styles.form}>
          <input
            type="text"
            className="key-input"
            placeholder="EX: 14 Caracteres"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            style={styles.input}
          />

          {errorMsg && <p style={styles.errorText}>{errorMsg}</p>}

          <button type="submit" style={styles.button}>
            LIBERAR ACESSO 🚀
          </button>
        </form>

        <div style={styles.footer}>
          <span>Sua permissão ficará salva neste navegador.</span>
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
    backgroundColor: '#0a0a0e',
    backgroundImage: `
      radial-gradient(circle at 50% 30%, rgba(139, 0, 255, 0.2) 0%, transparent 60%),
      radial-gradient(circle at 50% 80%, rgba(0, 255, 136, 0.08) 0%, transparent 50%)
    `,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999999,
    padding: '20px',
    boxSizing: 'border-box',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  card: {
    backgroundColor: 'rgba(18, 18, 26, 0.92)',
    border: '1px solid rgba(139, 0, 255, 0.5)',
    borderRadius: '20px',
    padding: '40px 32px',
    maxWidth: '450px',
    width: '100%',
    textAlign: 'center',
    backdropFilter: 'blur(16px)',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: 'rgba(255, 183, 3, 0.1)',
    border: '1px solid rgba(255, 183, 3, 0.3)',
    color: '#ffb703',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '800',
    letterSpacing: '1px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '3rem',
    color: '#00ff88',
    margin: '0 0 12px 0',
    letterSpacing: '2px',
    lineHeight: '1',
  },
  description: {
    color: '#a0a0b8',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    margin: '0 0 24px 0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  input: {
    width: '100%',
    backgroundColor: '#0c0c12',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '10px',
    padding: '14px 16px',
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: '1.5px',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: '0.82rem',
    fontWeight: '600',
    margin: '-4px 0 4px 0',
  },
  button: {
    width: '100%',
    backgroundColor: '#8b00ff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '14px',
    fontSize: '0.95rem',
    fontWeight: '800',
    letterSpacing: '1px',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(139, 0, 255, 0.4)',
    transition: 'transform 0.1s ease',
  },
  footer: {
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    fontSize: '0.78rem',
    color: '#6e6e82',
  },
}