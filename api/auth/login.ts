import type { VercelRequest, VercelResponse } from '@vercel/node'
import { serialize } from 'cookie'
import { sql } from '../lib/db.js'
import { verifyPassword } from '../lib/crypto.js'
import { createSessionToken } from '../lib/session.js'
import { checkRateLimit } from '../lib/rateLimit.js'
import { loginSchema } from '../lib/validation.js'

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' })
  }

  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Dados inválidos.' })
  }
  const { email, password } = parsed.data

  const rateLimit = await checkRateLimit(email, 'login')
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: `Muitas tentativas de login. Tente de novo em ${rateLimit.retryAfterMinutes} minuto(s).`,
    })
  }

  const rows = await sql`
    SELECT id, password_hash, nickname, discriminator FROM users
    WHERE email = ${email}
    LIMIT 1
  `
  const user = rows[0] as
    | { id: string; password_hash: string; nickname: string; discriminator: string }
    | undefined

  // Mensagem de erro IDÊNTICA tanto se o e-mail não existe quanto
  // se a senha está errada — isso é proposital. Se a mensagem
  // fosse diferente ("e-mail não encontrado" vs "senha incorreta"),
  // alguém poderia usar o formulário de login pra descobrir quais
  // e-mails têm conta no sistema, tentando um por um.
  const genericError = 'E-mail ou senha incorretos.'

  if (!user) {
    return res.status(401).json({ error: genericError })
  }

  const passwordMatches = await verifyPassword(password, user.password_hash)
  if (!passwordMatches) {
    return res.status(401).json({ error: genericError })
  }

  const token = createSessionToken({
    userId: user.id,
    nickname: user.nickname,
    discriminator: user.discriminator,
  })

  res.setHeader(
    'Set-Cookie',
    serialize('gtb_session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    })
  )

  return res.status(200).json({
    user: { id: user.id, nickname: user.nickname, discriminator: user.discriminator },
  })
}
