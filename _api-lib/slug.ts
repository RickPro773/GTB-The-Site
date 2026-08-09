import { sql } from './db.js'

/** Converte "Novidades da v0.0.6!" em "novidades-da-v0-0-6" */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // remove tudo que não é letra/número/espaço/traço
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

/**
 * Gera um slug único pra um post novo, a partir do título. Se o
 * slug básico já existir, adiciona um sufixo numérico (-2, -3...)
 * até achar um livre.
 */
export async function generateUniqueSlug(title: string): Promise<string> {
  const base = slugify(title) || 'post'

  let candidate = base
  let suffix = 2

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await sql`SELECT 1 FROM blog_posts WHERE slug = ${candidate} LIMIT 1`
    if (existing.length === 0) return candidate
    candidate = `${base}-${suffix}`
    suffix++
  }
}
