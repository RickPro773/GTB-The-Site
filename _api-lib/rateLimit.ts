import { sql } from './db.js'

interface RateLimitConfig {
  maxAttempts: number
  windowMinutes: number
}

// Limites por tipo de ação. Ajuste aqui se precisar deixar mais ou
// menos rígido — não precisa mexer em nenhum outro arquivo.
const LIMITS: Record<string, RateLimitConfig> = {
  login: { maxAttempts: 8, windowMinutes: 15 },
  signup_code: { maxAttempts: 5, windowMinutes: 60 },
  password_reset_code: { maxAttempts: 5, windowMinutes: 60 },
  verify_code: { maxAttempts: 10, windowMinutes: 15 },
  avatar_upload: { maxAttempts: 10, windowMinutes: 60 },
  blog_post: { maxAttempts: 10, windowMinutes: 60 },
  blog_comment: { maxAttempts: 20, windowMinutes: 10 },
  chat_message: { maxAttempts: 30, windowMinutes: 1 },
}

/**
 * Verifica se uma ação (login, pedido de código, etc) pode ser
 * tentada de novo, ou se o identificador (e-mail ou IP) já bateu
 * no limite dentro da janela de tempo configurada. Se puder,
 * registra a tentativa. Se não puder, não registra nada (evita
 * inflar o contador além do necessário).
 *
 * Retorna `{ allowed: true }` se pode seguir, ou
 * `{ allowed: false, retryAfterMinutes }` se precisa esperar.
 */
export async function checkRateLimit(
  identifier: string,
  action: keyof typeof LIMITS
): Promise<{ allowed: true } | { allowed: false; retryAfterMinutes: number }> {
  const config = LIMITS[action]

  const rows = await sql`
    SELECT attempts, window_start FROM rate_limits
    WHERE identifier = ${identifier} AND action = ${action}
  `

  const existing = rows[0] as { attempts: number; window_start: string } | undefined

  if (!existing) {
    // primeira tentativa desse identificador nessa ação — cria o
    // registro e libera
    await sql`
      INSERT INTO rate_limits (identifier, action, attempts, window_start)
      VALUES (${identifier}, ${action}, 1, now())
    `
    return { allowed: true }
  }

  const windowStart = new Date(existing.window_start)
  const windowEnd = new Date(windowStart.getTime() + config.windowMinutes * 60_000)
  const now = new Date()

  if (now > windowEnd) {
    // a janela anterior já expirou — reseta o contador e libera
    await sql`
      UPDATE rate_limits
      SET attempts = 1, window_start = now()
      WHERE identifier = ${identifier} AND action = ${action}
    `
    return { allowed: true }
  }

  if (existing.attempts >= config.maxAttempts) {
    const retryAfterMinutes = Math.ceil((windowEnd.getTime() - now.getTime()) / 60_000)
    return { allowed: false, retryAfterMinutes }
  }

  // ainda dentro da janela e do limite — incrementa e libera
  await sql`
    UPDATE rate_limits
    SET attempts = attempts + 1
    WHERE identifier = ${identifier} AND action = ${action}
  `
  return { allowed: true }
}
