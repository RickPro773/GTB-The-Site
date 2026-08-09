import type { VercelRequest, VercelResponse } from '@vercel/node'
import { parse } from 'cookie'
import { verifySessionToken } from '../../_api-lib/session.js'
import { sql } from '../../_api-lib/db.js'

/**
 * GET /api/auth/me
 * Lê o cookie de sessão e devolve os dados básicos do usuário
 * logado, ou 401 se não tiver sessão válida. O front-end chama
 * isso ao carregar o site pra saber se mostra o avatar de "logado"
 * ou o botão de "entrar/cadastrar".
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido.' })
  }

  const cookies = parse(req.headers.cookie || '')
  const session = verifySessionToken(cookies.gtb_session)

  if (!session) {
    return res.status(401).json({ error: 'Não autenticado.' })
  }

  // busca os dados atuais no banco (não confia só no que está no
  // token, que pode estar desatualizado se o usuário mudou algo
  // recentemente) — assim o avatar/nickname mostrado sempre reflete
  // o estado real da conta.
  const rows = await sql`
    SELECT id, nickname, discriminator, avatar_url, avatar_status FROM users
    WHERE id = ${session.userId}
    LIMIT 1
  `
  const user = rows[0] as
    | {
        id: string
        nickname: string
        discriminator: string
        avatar_url: string | null
        avatar_status: string
      }
    | undefined

  if (!user) {
    // conta foi deletada mas o token antigo ainda existe — trata
    // como não autenticado
    return res.status(401).json({ error: 'Não autenticado.' })
  }

  return res.status(200).json({
    user: {
      id: user.id,
      nickname: user.nickname,
      discriminator: user.discriminator,
      avatarUrl: user.avatar_url,
      avatarStatus: user.avatar_status,
    },
  })
}
