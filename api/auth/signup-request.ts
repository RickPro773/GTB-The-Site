import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from '../lib/db.js'
import { generateVerificationCode, hashVerificationCode } from '../lib/crypto.js'
import { sendVerificationCodeEmail } from '../lib/email.js'
import { checkRateLimit } from '../lib/rateLimit.js'
import { signupRequestSchema } from '../lib/validation.js'

/**
 * POST /api/auth/signup-request
 * Body: { email: string }
 *
 * Primeiro passo do cadastro: a pessoa digita só o e-mail, a gente
 * manda um código de 6 dígitos pra esse e-mail. O código expira em
 * 15 minutos. O próximo passo (signup-confirm) pede o código de
 * volta junto com senha e nickname escolhidos.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' })
  }

  const parsed = signupRequestSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Dados inválidos.' })
  }
  const { email } = parsed.data

  // Limita quantos códigos podem ser pedidos pro mesmo e-mail numa
  // janela de tempo, pra evitar spam de e-mail (e custo desperdiçado
  // na cota do Resend).
  const rateLimit = await checkRateLimit(email, 'signup_code')
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: `Muitas tentativas. Tente de novo em ${rateLimit.retryAfterMinutes} minuto(s).`,
    })
  }

  // Verifica se já existe uma conta com esse e-mail
  const existing = await sql`SELECT 1 FROM users WHERE email = ${email} LIMIT 1`
  if (existing.length > 0) {
    // Por segurança, não revelamos diretamente "esse e-mail já tem
    // conta" de forma que ajude alguém a descobrir quais e-mails
    // estão cadastrados no sistema (enumeration attack) — a
    // mensagem é genérica o bastante pra não confirmar/negar.
    return res.status(200).json({
      message: 'Se esse e-mail ainda não tiver conta, um código de verificação foi enviado.',
    })
  }

  const code = generateVerificationCode()
  const codeHash = await hashVerificationCode(code)
  const expiresAt = new Date(Date.now() + 15 * 60_000) // 15 minutos

  // remove códigos antigos de cadastro pendentes pra esse e-mail,
  // pra não acumular lixo caso a pessoa peça o código várias vezes
  await sql`
    DELETE FROM verification_codes
    WHERE email = ${email} AND purpose = 'signup'
  `

  await sql`
    INSERT INTO verification_codes (email, code_hash, purpose, expires_at)
    VALUES (${email}, ${codeHash}, 'signup', ${expiresAt.toISOString()})
  `

  await sendVerificationCodeEmail(email, code, 'signup')

  return res.status(200).json({
    message: 'Se esse e-mail ainda não tiver conta, um código de verificação foi enviado.',
  })
}
