import type { VercelRequest, VercelResponse } from '@vercel/node'
import { serialize } from 'cookie'

/**
 * POST /api/auth/logout
 * Apaga o cookie de sessão (seta com data de expiração no passado
 * e maxAge 0, que é como se invalida um cookie no navegador).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' })
  }

  res.setHeader(
    'Set-Cookie',
    serialize('gtb_session', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })
  )

  return res.status(200).json({ message: 'Sessão encerrada.' })
}
