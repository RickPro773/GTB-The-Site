// Lista negra de palavras bloqueadas em nicknames (e, no futuro,
// em posts do blog e mensagens do chat). Fica isolada num arquivo
// só pra ser fácil de editar sem mexer na lógica dos endpoints.
//
// IMPORTANTE: isso é uma primeira camada básica, não uma solução
// completa de moderação — pega palavrão/ofensa óbvia e escrita
// direta, mas não detecta variações criativas (tipo trocar letra
// por número, espaçamento estranho, etc). Para o chat e blog, no
// futuro vale considerar complementar com um serviço de moderação
// de texto mais robusto além dessa lista.
const BLOCKED_WORDS = [
  // Lista propositalmente deixada enxuta aqui — adicione os termos
  // que fizerem sentido pra comunidade do GTB nesta array.
  // Exemplo de formato: 'palavraofensiva',
]

/**
 * Verifica se um texto contém alguma palavra da lista negra.
 * Comparação case-insensitive e ignora acentos, pra pegar variações
 * simples (ex: "Idiota" e "idiota" e "ídiota" todos batem).
 */
export function containsBlockedWord(text: string): boolean {
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos

  return BLOCKED_WORDS.some((word) => normalized.includes(word))
}
