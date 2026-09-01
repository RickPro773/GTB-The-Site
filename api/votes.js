import { kv } from '@vercel/kv'

const VALID_SLUGS = ['rick', 'dragon', 'gta2d', 'fotafox']

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const keys = VALID_SLUGS.map((slug) => `votes:${slug}`)
    const values = await kv.mget(...keys)

    const results = {}
    VALID_SLUGS.forEach((slug, i) => {
      results[slug] = values[i] || 0
    })

    return res.status(200).json(results)
  } catch (err) {
    return res.status(500).json({ error: 'Falha ao buscar placar. KV configurado?' })
  }
}
