import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'gtb-poll-voted-slug'

/**
 * Controla a enquete "qual o melhor personagem":
 * - Busca o placar atual da API (/api/votes) ao montar
 * - Impede votar duas vezes NO MESMO NAVEGADOR (guarda em
 *   localStorage qual slug a pessoa já votou)
 * - Se a API falhar (ex: Vercel KV ainda não configurada no
 *   projeto), não quebra a página — só mostra que a enquete está
 *   indisponível no momento, com um aviso claro
 */
export function usePoll() {
  const [results, setResults] = useState(null) // { rick: 0, dragon: 0, ... } | null
  const [votedSlug, setVotedSlug] = useState(() => localStorage.getItem(STORAGE_KEY))
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchResults = useCallback(async () => {
    try {
      const res = await fetch('/api/votes')
      if (!res.ok) throw new Error('bad response')
      const data = await res.json()
      setResults(data)
      setError(false)
    } catch {
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  async function vote(slug) {
    if (votedSlug) return // já votou, não deixa votar de novo

    // atualização otimista: já mostra o voto contado na hora,
    // sem esperar a resposta do servidor
    setResults((prev) => (prev ? { ...prev, [slug]: (prev[slug] || 0) + 1 } : prev))
    setVotedSlug(slug)
    localStorage.setItem(STORAGE_KEY, slug)

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      if (!res.ok) throw new Error('bad response')
      const data = await res.json()
      // sincroniza com o valor real do servidor (caso a estimativa
      // otimista tenha ficado levemente errada por concorrência)
      setResults((prev) => (prev ? { ...prev, [slug]: data.count } : prev))
    } catch {
      // Se a API falhar, mantém o voto salvo localmente (a pessoa
      // já "votou" do ponto de vista dela) mas marca erro geral —
      // evita que ela tente de novo e ache que não votou.
      setError(true)
    }
  }

  const totalVotes = results ? Object.values(results).reduce((a, b) => a + b, 0) : 0

  return { results, totalVotes, votedSlug, isLoading, error, vote }
}
