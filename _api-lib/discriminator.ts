import { randomInt } from 'node:crypto'
import { sql } from './db.js'

const MAX_ATTEMPTS = 20

/**
 * Gera um discriminator de 4 dígitos (ex: "0472") pra um nickname,
 * garantindo que a combinação nickname+discriminator ainda não
 * existe no banco — igual o sistema clássico do Discord
 * (Fulano#1234). Tenta algumas vezes com números aleatórios antes
 * de desistir (na prática, colisão é rara a menos que um nickname
 * específico já tenha milhares de contas).
 */
export async function generateDiscriminator(nickname: string): Promise<string> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const candidate = randomInt(0, 10_000).toString().padStart(4, '0')

    const existing = await sql`
      SELECT 1 FROM users
      WHERE nickname = ${nickname} AND discriminator = ${candidate}
      LIMIT 1
    `

    if (existing.length === 0) {
      return candidate
    }
  }

  // Extremamente improvável de chegar aqui (precisaria de milhares
  // de contas com o mesmo nickname exato), mas se acontecer é
  // melhor um erro claro do que um discriminator duplicado.
  throw new Error(
    `Não foi possível gerar um discriminator único para "${nickname}" após ${MAX_ATTEMPTS} tentativas.`
  )
}
