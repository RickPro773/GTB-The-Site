import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from '../lib/db.js'
import { generateVerificationCode, hashVerificationCode } from '../lib/crypto.js'
import { sendVerificationCodeEmail } from '../lib/email.js'
import { checkRateLimit } from '../lib/rateLimit.js'
import { passwordResetRequestSchema } from '../lib/validation.js'

/**
 * POST /api/auth/password-reset-request
 * Body: { email }
 *
 * Mesma lógica do signup-request, mas pra recuperação de senha —
 * só manda o código se o e-mail realmente tiver conta (mas a
 * resposta é sempre genérica, pelo mesmo motivo de anti-enumeração
 * explicado no login).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' })
  }

  const parsed = passwordResetRequestSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Dados inválidos.' })
  }
  const { email } = parsed.data

  const rateLimit = await checkRateLimit(email, 'password_reset_code')
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: `Muitas tentativas. Tente de novo em ${rateLimit.retryAfterMinutes} minuto(s).`,
    })
  }

  const genericResponse = {
    message: 'Se esse e-mail tiver uma conta, um código de recuperação foi enviado.',
  }

  const existing = await sql`SELECT 1 FROM users WHERE email = ${email} LIMIT 1`
  if (existing.length === 0) {
    // não revela se o e-mail existe ou não
    return res.status(200).json(genericResponse)
  }

  const code = generateVerificationCode()
  const codeHash = await hashVerificationCode(code)
  const expiresAt = new Date(Date.now() + 15 * 60_000)

  await sql`
    DELETE FROM verification_codes
    WHERE email = ${email} AND purpose = 'password_reset'
  `

  await sql`
    INSERT INTO verification_codes (email, code_hash, purpose, expires_at)
    VALUES (${email}, ${codeHash}, 'password_reset', ${expiresAt.toISOString()})
  `

  await sendVerificationCodeEmail(email, code, 'password_reset')

  return res.status(200).json(genericResponse)
}
