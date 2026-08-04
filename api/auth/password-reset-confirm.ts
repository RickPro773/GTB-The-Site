import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from '../lib/db.js'
import { hashPassword, verifyCode } from '../lib/crypto.js'
import { checkRateLimit } from '../lib/rateLimit.js'
import { passwordResetConfirmSchema } from '../lib/validation.js'

/**
 * POST /api/auth/password-reset-confirm
 * Body: { email, code, newPassword }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' })
  }

  const parsed = passwordResetConfirmSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Dados inválidos.' })
  }
  const { email, code, newPassword } = parsed.data

  const rateLimit = await checkRateLimit(email, 'verify_code')
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: `Muitas tentativas. Tente de novo em ${rateLimit.retryAfterMinutes} minuto(s).`,
    })
  }

  const codeRows = await sql`
    SELECT id, code_hash, attempts, expires_at FROM verification_codes
    WHERE email = ${email} AND purpose = 'password_reset'
    ORDER BY created_at DESC
    LIMIT 1
  `
  const codeRow = codeRows[0] as
    | { id: string; code_hash: string; attempts: number; expires_at: string }
    | undefined

  if (!codeRow) {
    return res.status(400).json({ error: 'Nenhum código pendente para esse e-mail. Peça um novo.' })
  }
  if (new Date(codeRow.expires_at) < new Date()) {
    return res.status(400).json({ error: 'Esse código expirou. Peça um novo.' })
  }
  if (codeRow.attempts >= 5) {
    return res
      .status(400)
      .json({ error: 'Esse código foi tentado demais vezes. Peça um código novo.' })
  }

  const codeMatches = await verifyCode(code, codeRow.code_hash)
  if (!codeMatches) {
    await sql`UPDATE verification_codes SET attempts = attempts + 1 WHERE id = ${codeRow.id}`
    return res.status(400).json({ error: 'Código incorreto.' })
  }

  const newPasswordHash = await hashPassword(newPassword)

  await sql`
    UPDATE users
    SET password_hash = ${newPasswordHash}, updated_at = now()
    WHERE email = ${email}
  `

  await sql`DELETE FROM verification_codes WHERE id = ${codeRow.id}`

  return res.status(200).json({ message: 'Senha redefinida com sucesso.' })
}
