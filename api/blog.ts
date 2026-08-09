import type { VercelRequest, VercelResponse } from '@vercel/node'
import { parse } from 'cookie'
import { sql } from '../_api-lib/db.js'
import { verifySessionToken } from '../_api-lib/session.js'
import { generateUniqueSlug } from '../_api-lib/slug.js'
import { createPostSchema, createCommentSchema } from '../_api-lib/validation.js'
import { containsBlockedWord } from '../_api-lib/blocklist.js'
import { checkRateLimit } from '../_api-lib/rateLimit.js'

/**
 * /api/blog — endpoint único cuidando de todas as ações do blog,
 * decidido pelo método HTTP e por um parâmetro `?action=`. Isso é
 * proposital: a Vercel Hobby limita 12 Serverless Functions no
 * total, então em vez de um arquivo por ação (get-posts.ts,
 * get-post.ts, create-post.ts, create-comment.ts...), tudo do
 * blog mora num arquivo só.
 *
 * Rotas:
 *   GET  /api/blog                    → lista os posts publicados (mais recentes primeiro)
 *   GET  /api/blog?slug=algum-post    → um post específico + comentários
 *   POST /api/blog                    → cria um post novo (precisa estar logado)
 *   POST /api/blog?action=comment     → cria um comentário (precisa estar logado)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return handleGet(req, res)
  }
  if (req.method === 'POST') {
    const action = req.query.action
    if (action === 'comment') {
      return handleCreateComment(req, res)
    }
    return handleCreatePost(req, res)
  }
  return res.status(405).json({ error: 'Método não permitido.' })
}

async function handleGet(req: VercelRequest, res: VercelResponse) {
  const slug = typeof req.query.slug === 'string' ? req.query.slug : null

  if (slug) {
    const postRows = await sql`
      SELECT p.id, p.slug, p.title, p.content, p.cover_image_url, p.created_at,
             u.nickname, u.discriminator, u.avatar_url
      FROM blog_posts p
      JOIN users u ON u.id = p.author_id
      WHERE p.slug = ${slug} AND p.published = true
      LIMIT 1
    `
    const post = postRows[0]
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado.' })
    }

    const comments = await sql`
      SELECT c.id, c.content, c.created_at, u.nickname, u.discriminator, u.avatar_url
      FROM blog_comments c
      JOIN users u ON u.id = c.author_id
      WHERE c.post_id = ${post.id}
      ORDER BY c.created_at ASC
    `

    return res.status(200).json({ post, comments })
  }

  // sem slug: lista todos os posts publicados, resumidos (sem o
  // corpo completo, pra não pesar a listagem)
  const posts = await sql`
    SELECT p.id, p.slug, p.title, p.cover_image_url, p.created_at,
           u.nickname, u.discriminator, u.avatar_url,
           LEFT(p.content, 240) AS excerpt
    FROM blog_posts p
    JOIN users u ON u.id = p.author_id
    WHERE p.published = true
    ORDER BY p.created_at DESC
    LIMIT 50
  `

  return res.status(200).json({ posts })
}

async function handleCreatePost(req: VercelRequest, res: VercelResponse) {
  const cookies = parse(req.headers.cookie || '')
  const session = verifySessionToken(cookies.gtb_session)
  if (!session) {
    return res.status(401).json({ error: 'Não autenticado.' })
  }

  const rateLimit = await checkRateLimit(session.userId, 'blog_post')
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: `Muitas tentativas. Tente de novo em ${rateLimit.retryAfterMinutes} minuto(s).`,
    })
  }

  const parsed = createPostSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Dados inválidos.' })
  }
  const { title, content, coverImageUrl, published } = parsed.data

  if (containsBlockedWord(title) || containsBlockedWord(content)) {
    return res.status(400).json({ error: 'O post contém conteúdo não permitido.' })
  }

  const slug = await generateUniqueSlug(title)

  const inserted = await sql`
    INSERT INTO blog_posts (author_id, slug, title, content, cover_image_url, published)
    VALUES (${session.userId}, ${slug}, ${title}, ${content}, ${coverImageUrl ?? null}, ${published ?? true})
    RETURNING id, slug, title, created_at
  `

  return res.status(201).json({ post: inserted[0] })
}

async function handleCreateComment(req: VercelRequest, res: VercelResponse) {
  const cookies = parse(req.headers.cookie || '')
  const session = verifySessionToken(cookies.gtb_session)
  if (!session) {
    return res.status(401).json({ error: 'Não autenticado.' })
  }

  const rateLimit = await checkRateLimit(session.userId, 'blog_comment')
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: `Você está comentando rápido demais. Espere ${rateLimit.retryAfterMinutes} minuto(s).`,
    })
  }

  const parsed = createCommentSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0]?.message ?? 'Dados inválidos.' })
  }
  const { postId, content } = parsed.data

  if (containsBlockedWord(content)) {
    return res.status(400).json({ error: 'Esse comentário contém conteúdo não permitido.' })
  }

  const postExists = await sql`SELECT 1 FROM blog_posts WHERE id = ${postId} LIMIT 1`
  if (postExists.length === 0) {
    return res.status(404).json({ error: 'Post não encontrado.' })
  }

  const inserted = await sql`
    INSERT INTO blog_comments (post_id, author_id, content)
    VALUES (${postId}, ${session.userId}, ${content})
    RETURNING id, content, created_at
  `

  return res.status(201).json({ comment: inserted[0] })
}
