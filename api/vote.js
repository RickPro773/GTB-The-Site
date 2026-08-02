import { kv } from '@vercel/kv'

// Slugs válidos — qualquer voto fora dessa lista é rejeitado, pra
// evitar que alguém chame a API direto com um valor inventado e
// polua o placar com uma chave qualquer.
const VALID_SLUGS = ['rick', 'dragon', 'gta2d', 'fotafox']

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { slug } = req.body || {}

  if (!VALID_SLUGS.includes(slug)) {
    return res.status(400).json({ error: 'Personagem inválido' })
  }

  try {
    const newCount = await kv.incr(`votes:${slug}`)
    return res.status(200).json({ slug, count: newCount })
  } catch (err) {
    // Se a Vercel KV ainda não foi configurada no projeto, isso
    // falha aqui — devolve um erro claro em vez de travar em
    // silêncio, pra facilitar o diagnóstico.
    return res.status(500).json({ error: 'Falha ao registrar voto. KV configurado?' })
  }
}
