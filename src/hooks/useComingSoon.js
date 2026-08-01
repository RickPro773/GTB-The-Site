import { useState, useCallback } from 'react'

/**
 * Controla a exibição do modal "Em breve", usado por qualquer
 * botão/link que ainda não tem destino real (redes sociais,
 * aba Quadro, etc). Cada chamador passa seu próprio título e
 * mensagem, o hook só guarda qual está aberto no momento.
 */
export function useComingSoon() {
  const [content, setContent] = useState(null) // { title, message } | null

  const showComingSoon = useCallback((title, message) => {
    setContent({ title, message })
  }, [])

  const closeComingSoon = useCallback(() => {
    setContent(null)
  }, [])

  return { content, showComingSoon, closeComingSoon }
}
