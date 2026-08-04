import type { VercelRequest, VercelResponse } from '@vercel/node'
import { parse } from 'cookie'
import { put, del } from '@vercel/blob'
import { verifySessionToken } from '../lib/session.js'
import { sql } from '../lib/db.js'
import { moderateImage } from '../lib/moderation.js'
import { checkRateLimit } from '../lib/rateLimit.js'

// Configuração pra Vercel aceitar o corpo da requisição como
// binário bruto (a imagem em si), em vez de tentar interpretar
// como JSON — precisa disso pra receber arquivo.
export const config = {
  api: {
    bodyParser: false,
  },
}

const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

async function readRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}

/**
 * POST /api/account/avatar-upload
 * Body: o arquivo de imagem em binário puro (não JSON), com o
 * header Content-Type indicando o tipo (image/jpeg, image/png, etc)
 *
 * Fluxo: valida sessão → valida arquivo (tamanho/tipo) → sobe pro
 * Vercel Blob → manda a URL pra moderação no Sightengine → se
 * aprovado, salva como avatar oficial e marca 'approved'; se
 * recusado, apaga o arquivo do Blob e marca 'rejected', sem nunca
 * deixar a imagem recusada visível como avatar de ninguém.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' })
  }

  const cookies = parse(req.headers.cookie || '')
  const session = verifySessionToken(cookies.gtb_session)
  if (!session) {
    return res.status(401).json({ error: 'Não autenticado.' })
  }

  // limita quantos uploads de avatar a mesma conta pode tentar
  // numa janela de tempo — evita abuso da cota de moderação/storage
  const rateLimit = await checkRateLimit(session.userId, 'avatar_upload')
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: `Muitas tentativas. Tente de novo em ${rateLimit.retryAfterMinutes} minuto(s).`,
    })
  }

  const contentType = req.headers['content-type'] || ''
  if (!ALLOWED_TYPES.includes(contentType)) {
    return res.status(400).json({
      error: 'Formato de imagem não aceito. Use JPEG, PNG ou WebP.',
    })
  }

  const buffer = await readRawBody(req)

  if (buffer.length === 0) {
    return res.status(400).json({ error: 'Nenhuma imagem recebida.' })
  }
  if (buffer.length > MAX_FILE_SIZE) {
    return res.status(400).json({ error: 'Imagem muito grande. O limite é 4 MB.' })
  }

  const extension = contentType.split('/')[1]
  const filename = `avatars/${session.userId}-${Date.now()}.${extension}`

  // marca como "pending" no banco já de início, pra refletir na
  // interface que o avatar está em análise enquanto a moderação
  // roda (evita a pessoa achar que travou)
  await sql`UPDATE users SET avatar_status = 'pending' WHERE id = ${session.userId}`

  const blob = await put(filename, buffer, {
    access: 'public',
    contentType,
  })

  const moderation = await moderateImage(blob.url)

  if (!moderation.approved) {
    // apaga o arquivo do Blob — não faz sentido manter um arquivo
    // rejeitado ocupando espaço de armazenamento
    await del(blob.url).catch(() => {}) // não trava a resposta se a limpeza falhar por algum motivo
    await sql`UPDATE users SET avatar_status = 'rejected' WHERE id = ${session.userId}`
    return res.status(422).json({
      error: moderation.reason || 'Essa imagem não pode ser usada como avatar.',
      avatarStatus: 'rejected',
    })
  }

  await sql`
    UPDATE users
    SET avatar_url = ${blob.url}, avatar_status = 'approved', updated_at = now()
    WHERE id = ${session.userId}
  `

  return res.status(200).json({ avatarUrl: blob.url, avatarStatus: 'approved' })
}
