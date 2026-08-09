import type { VercelRequest, VercelResponse } from '@vercel/node'
import { parse } from 'cookie'
import { sql } from '../_api-lib/db.js'
import { verifySessionToken } from '../_api-lib/session.js'
import { sendMessageSchema, pusherAuthSchema } from '../_api-lib/validation.js'
import { containsBlockedWord } from '../_api-lib/blocklist.js'
import { checkRateLimit } from '../_api-lib/rateLimit.js'
import { pusherServer } from '../_api-lib/pusherServer.js'

/**
 * /api/chat — endpoint único cuidando de todas as ações do chat,
 * pelo mesmo motivo do /api/blog: economizar o limite de 12
 * Serverless Functions do plano Hobby da Vercel.
 *
 * Rotas:
 *   GET  /api/chat?action=rooms                 → lista as salas disponíveis
 *   GET  /api/chat?room=geral                    → histórico de mensagens de uma sala
 *   POST /api/chat                                → manda uma mensagem numa sala
 *   POST /api/chat?action=pusher-auth             → autentica o canal privado do Pusher
 *
 * Sobre canais privados: as salas usam canais PRIVADOS do Pusher
 * (nome começa com "private-"), não públicos — isso exige que
 * cada cliente se autentique antes de poder ouvir/mandar evento
 * num canal, o que impede qualquer um de escutar o chat sem estar
 * logado no site. O `action=pusher-auth` é chamado automaticamente
 * pela biblioteca pusher-js no navegador, você não precisa mexer
 * nisso manualmente no front-end.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const action = req.query.action
    if (action === 'rooms') {
      return handleListRooms(req, res)
    }
    return handleGetMessages(req, res)
  }

  if (req.method === 'POST') {
    const action = req.query.action
    if (action === 'pusher-auth') {
      return handlePusherAuth(req, res)
    }
    return handleSendMessage(req, res)
  }

  return res.status(405).json({ error: 'Método não permitido.' })
}

async function handleListRooms(req: VercelRequest, res: VercelResponse) {
  const rooms = await sql`
    SELECT slug, name, description FROM chat_rooms ORDER BY name ASC
  `
  return res.status(200).json({ rooms })
}

async function handleGetMessages(req: VercelRequest, res: VercelResponse) {
  const roomSlug = typeof req.query.room === 'string' ? req.query.room : null
  if (!roomSlug) {
    return res.status(400).json({ error: 'Parâmetro "room" é obrigatório.' })
  }

  const roomRows = await sql`SELECT id FROM chat_rooms WHERE slug = ${roomSlug} LIMIT 1`
  const room = roomRows[0] as { id: string } | undefined
  if (!room) {
    return res.status(404).json({ error: 'Sala não encontrada.' })
  }

  // últimas 50 mensagens da sala, mais antigas primeiro (ordem de
  // leitura natural de um chat)
  const messages = await sql`
    SELECT m.id, m.content, m.created_at, u.nickname, u.discriminator, u.avatar_url
    FROM chat_messages m
    JOIN users u ON u.id = m.author_id
    WHERE m.room_id = ${room.id}
    ORDER BY m.created_at DESC
    LIMIT 50
  `

  return res.status(200).json({ messages: messages.reverse() })
}

async function handleSendMessage(req: VercelRequest, res: VercelResponse) {
  const cookies = parse(req.headers.cookie || '')
  const session = verifySessionToken(cookies.gtb_session)
  if (!session) {
    return res.status(401).json({ error: 'Não autenticado.' })
  }

  const rateLimit = await checkRateLimit(session.userId, 'chat_message')
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: `Você está mandando mensagem rápido demais. Espere um pouco.`,
    })
  }

  const parsed = sendMessageSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Dados inválidos.' })
  }
  const { roomSlug, content } = parsed.data

  if (containsBlockedWord(content)) {
    return res.status(400).json({ error: 'Essa mensagem contém conteúdo não permitido.' })
  }

  const roomRows = await sql`SELECT id FROM chat_rooms WHERE slug = ${roomSlug} LIMIT 1`
  const room = roomRows[0] as { id: string } | undefined
  if (!room) {
    return res.status(404).json({ error: 'Sala não encontrada.' })
  }

  const userRows = await sql`
    SELECT nickname, discriminator, avatar_url FROM users WHERE id = ${session.userId} LIMIT 1
  `
  const user = userRows[0] as { nickname: string; discriminator: string; avatar_url: string | null }

  const inserted = await sql`
    INSERT INTO chat_messages (room_id, author_id, content)
    VALUES (${room.id}, ${session.userId}, ${content})
    RETURNING id, content, created_at
  `
  const message = inserted[0] as { id: string; content: string; created_at: string }

  const payload = {
    id: message.id,
    content: message.content,
    created_at: message.created_at,
    nickname: user.nickname,
    discriminator: user.discriminator,
    avatar_url: user.avatar_url,
  }

  // empurra a mensagem em tempo real pra quem estiver com a sala
  // aberta agora — quem entrar depois vê ela normalmente porque já
  // está salva no banco (buscada via handleGetMessages)
  await pusherServer.trigger(`private-chat-${roomSlug}`, 'new-message', payload)

  return res.status(201).json({ message: payload })
}

async function handlePusherAuth(req: VercelRequest, res: VercelResponse) {
  const cookies = parse(req.headers.cookie || '')
  const session = verifySessionToken(cookies.gtb_session)
  if (!session) {
    return res.status(401).json({ error: 'Não autenticado.' })
  }

  const parsed = pusherAuthSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Requisição de autenticação inválida.' })
  }
  const { socket_id, channel_name } = parsed.data

  // Só autoriza canais que seguem o padrão "private-chat-<slug>" —
  // isso impede que alguém tente se autenticar num canal privado
  // qualquer inventado na mão.
  if (!channel_name.startsWith('private-chat-')) {
    return res.status(403).json({ error: 'Canal não permitido.' })
  }

  const authResponse = pusherServer.authorizeChannel(socket_id, channel_name, {
    user_id: session.userId,
    user_info: { nickname: session.nickname, discriminator: session.discriminator },
  })

  return res.status(200).json(authResponse)
}
