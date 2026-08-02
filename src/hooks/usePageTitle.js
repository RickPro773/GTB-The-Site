import { useEffect } from 'react'

/**
 * Atualiza o <title> da aba do navegador enquanto o componente
 * estiver montado, e devolve pro título padrão do site ao sair
 * (ex: ao voltar da bio de um personagem pra home).
 */
export function usePageTitle(title) {
  useEffect(() => {
    const previous = document.title
    document.title = title
    return () => {
      document.title = previous
    }
  }, [title])
}
