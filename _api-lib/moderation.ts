// ⚠️ ATENÇÃO: essas duas variáveis precisam existir no ambiente da
// Vercel antes do upload de avatar funcionar. Veja o README na
// seção "Variáveis de ambiente necessárias".
const SIGHTENGINE_API_USER = process.env.SIGHTENGINE_API_USER
const SIGHTENGINE_API_SECRET = process.env.SIGHTENGINE_API_SECRET

if (!SIGHTENGINE_API_USER || !SIGHTENGINE_API_SECRET) {
  throw new Error(
    'SIGHTENGINE_API_USER / SIGHTENGINE_API_SECRET não configurados nas variáveis de ambiente da Vercel.'
  )
}

// Limiares de decisão — quanto MAIOR o valor (de 0 a 1), mais
// "confiante" o Sightengine está de que aquilo está presente na
// imagem. Ajuste esses números se a moderação estiver rejeitando
// coisa inocente demais (baixe o limiar de sensibilidade, ou seja,
// AUMENTE o número aqui) ou deixando passar coisa que não devia
// (diminua o número).
const NUDITY_THRESHOLD = 0.5
const OFFENSIVE_THRESHOLD = 0.5

export interface ModerationResult {
  approved: boolean
  reason?: string
}

/**
 * Manda a imagem (via URL pública, já que ela precisa estar
 * acessível pro Sightengine buscar) pra checagem de nudez e
 * conteúdo ofensivo. Retorna se foi aprovada ou não, com o motivo
 * caso tenha sido recusada.
 */
export async function moderateImage(imageUrl: string): Promise<ModerationResult> {
  const params = new URLSearchParams({
    url: imageUrl,
    models: 'nudity-2.1,offensive',
    api_user: SIGHTENGINE_API_USER!,
    api_secret: SIGHTENGINE_API_SECRET!,
  })

  const response = await fetch(`https://api.sightengine.com/1.0/check.json?${params.toString()}`)

  if (!response.ok) {
    // Se o serviço de moderação estiver fora do ar ou a chamada
    // falhar por qualquer motivo, é mais seguro RECUSAR a imagem
    // do que aprovar sem checar — o avatar fica pendente e a
    // pessoa pode tentar de novo depois, em vez de arriscar deixar
    // passar algo impróprio por causa de uma falha técnica.
    return { approved: false, reason: 'Não foi possível analisar a imagem no momento. Tente de novo.' }
  }

  const data = await response.json()

  const nudityScore = data?.nudity?.sexual_activity ?? data?.nudity?.raw ?? 0
  const offensiveScore = data?.offensive?.prob ?? 0

  if (nudityScore >= NUDITY_THRESHOLD) {
    return { approved: false, reason: 'Essa imagem contém conteúdo impróprio (nudez) e não pode ser usada.' }
  }

  if (offensiveScore >= OFFENSIVE_THRESHOLD) {
    return { approved: false, reason: 'Essa imagem contém conteúdo ofensivo e não pode ser usada.' }
  }

  return { approved: true }
}
