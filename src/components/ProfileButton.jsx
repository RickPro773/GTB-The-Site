import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Ícone no canto do header. Deslogado: um círculo neutro com um
 * ícone de "pessoa" — clique abre o modal de login/cadastro.
 * Logado: mostra a foto de avatar (ou as iniciais do nickname se
 * ainda não tiver avatar aprovado) — clique abre um menu curto com
 * nickname#XXXX e opção de sair.
 */
export default function ProfileButton({ user, isLoading, onOpenAuth, onLogout, onAvatarUpdated }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const containerRef = useRef(null)
  const fileInputRef = useRef(null)

  // fecha o menu ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleFileSelected(e) {
    const file = e.target.files?.[0]
    e.target.value = '' // permite selecionar o mesmo arquivo de novo depois, se precisar
    if (!file) return

    setUploadError('')

    if (file.size > 4 * 1024 * 1024) {
      setUploadError('Imagem muito grande. O limite é 4 MB.')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadError('Use uma imagem JPEG, PNG ou WebP.')
      return
    }

    setIsUploading(true)
    try {
      const res = await fetch('/api/account/avatar-upload', {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        credentials: 'include',
        body: file,
      })
      const data = await res.json()

      if (!res.ok) {
        setUploadError(data.error || 'Não foi possível enviar a imagem.')
        // mesmo em caso de recusa, o status pode ter mudado pra
        // 'rejected' no banco — atualiza o estado do usuário pra
        // refletir isso na tela
        onAvatarUpdated?.()
        return
      }

      onAvatarUpdated?.()
    } catch {
      setUploadError('Falha de conexão. Tente de novo.')
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    // estado neutro enquanto ainda não sabemos se tem sessão —
    // evita o "pisca" de mostrar login e depois trocar pro avatar
    return <div className="w-9 h-9 rounded-full bg-white/5 animate-pulse" />
  }

  if (!user) {
    return (
      <button
        onClick={onOpenAuth}
        aria-label="Entrar ou criar conta"
        className="w-9 h-9 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-paper/70 hover:text-hood-green hover:border-hood-green transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="currentColor">
          <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.24-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.76-3.6-5-8-5Z" />
        </svg>
      </button>
    )
  }

  const initials = user.nickname.slice(0, 2).toUpperCase()

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Menu da conta"
        className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/15 hover:border-hood-green transition-colors flex items-center justify-center bg-asphalt-2"
      >
        {user.avatarUrl && user.avatarStatus === 'approved' ? (
          <img src={user.avatarUrl} alt={user.nickname} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs font-bold text-paper/80">{initials}</span>
        )}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="panel-3d absolute right-0 top-12 w-56 bg-asphalt-2 border border-white/10 rounded-lg p-3 z-[200]"
          >
            <div className="px-2 py-1.5 border-b border-white/[0.06] mb-2">
              <div className="text-sm font-semibold text-paper">
                {user.nickname}
                <span className="text-paper/40">#{user.discriminator}</span>
              </div>
              {user.avatarStatus === 'pending' && (
                <div className="text-[0.65rem] text-warn-yellow mt-0.5">
                  Avatar em análise
                </div>
              )}
              {user.avatarStatus === 'rejected' && (
                <div className="text-[0.65rem] text-red-400 mt-0.5">
                  Avatar recusado — envie outro
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelected}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full text-left px-2 py-1.5 text-sm text-paper/70 hover:text-hood-green hover:bg-white/5 rounded transition-colors disabled:opacity-50"
            >
              {isUploading ? 'Enviando...' : 'Trocar avatar'}
            </button>
            {uploadError && (
              <p className="px-2 text-[0.65rem] text-red-400 mt-1 leading-relaxed">{uploadError}</p>
            )}

            <button
              onClick={() => {
                setMenuOpen(false)
                onLogout()
              }}
              className="w-full text-left px-2 py-1.5 text-sm text-paper/70 hover:text-red-400 hover:bg-white/5 rounded transition-colors mt-1"
            >
              Sair da conta
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
