import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from '../../_api-lib/db.js'
import { hashPassword, verifyCode } from '../../_api-lib/crypto.js'
import { generateDiscriminator } from '../../_api-lib/discriminator.js'
import { createSessionToken } from '../../_api-lib/session.js'
import { checkRateLimit } from '../../_api-lib/rateLimit.js'
import { signupConfirmSchema } from '../../_api-lib/validation.js'
import { containsBlockedWord } from '../../_api-lib/blocklist.js'
import { serialize } from 'cookie'

/**
 * POST /api/auth/signup-confirm
 * Body: { email, code, password, nickname }
 *
 * Segundo (e último) passo do cadastro: valida o código que a
 * pessoa recebeu por e-mail, cria a conta de verdade com senha
 * hasheada e nickname#XXXX gerado, e já loga a pessoa (seta o
 * cookie de sessão) — não precisa fazer login separado depois.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' })
  }

  const parsed = signupConfirmSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Dados inválidos.' })
  }
  const { email, code, password, nickname } = parsed.data

  const rateLimit = await checkRateLimit(email, 'verify_code')
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: `Muitas tentativas. Tente de novo em ${rateLimit.retryAfterMinutes} minuto(s).`,
    })
  }

  if (containsBlockedWord(nickname)) {
    return res.status(400).json({ error: 'Esse nickname não é permitido. Escolha outro.' })
  }

  // busca o código de verificação pendente mais recente pra esse e-mail
  const codeRows = await sql`
    SELECT id, code_hash, attempts, expires_at FROM verification_codes
    WHERE email = ${email} AND purpose = 'signup'
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

  // Checa de novo se o e-mail já foi usado nesse meio tempo (ex:
  // duas abas abertas tentando cadastrar o mesmo e-mail ao mesmo
  // tempo) — evita duas contas com o mesmo e-mail por condição de
  // corrida.
  const existing = await sql`SELECT 1 FROM users WHERE email = ${email} LIMIT 1`
  if (existing.length > 0) {
    return res.status(409).json({ error: 'Já existe uma conta com esse e-mail.' })
  }

  const passwordHash = await hashPassword(password)
  const discriminator = await generateDiscriminator(nickname)

  const inserted = await sql`
    INSERT INTO users (email, password_hash, nickname, discriminator, email_verified_at)
    VALUES (${email}, ${passwordHash}, ${nickname}, ${discriminator}, now())
    RETURNING id, nickname, discriminator
  `
  const user = inserted[0] as { id: string; nickname: string; discriminator: string }

  // código já usado — apaga pra não sobrar lixo nem dar pra reusar
  await sql`DELETE FROM verification_codes WHERE id = ${codeRow.id}`

  const token = createSessionToken({
    userId: user.id,
    nickname: user.nickname,
    discriminator: user.discriminator,
  })

  res.setHeader(
    'Set-Cookie',
    serialize('gtb_session', token, {
      httpOnly: true, // JS do navegador não consegue ler esse cookie (proteção contra XSS roubando o token)
      secure: true, // só envia o cookie por HTTPS
      sameSite: 'lax', // proteção básica contra CSRF
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 dias, em segundos
    })
  )

  return res.status(201).json({
    user: { id: user.id, nickname: user.nickname, discriminator: user.discriminator },
  })
}
