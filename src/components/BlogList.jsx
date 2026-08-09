import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import LogoGTB from './LogoGTB'
import { usePageTitle } from '../hooks/usePageTitle'

export default function BlogList() {
  const [posts, setPosts] = useState(null) // null = carregando
  const [error, setError] = useState(false)

  usePageTitle('Blog — GTB')

  useEffect(() => {
    window.scrollTo(0, 0)
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => setPosts(data.posts || []))
      .catch(() => setError(true))
  }, [])

  return (
    <div className="min-h-screen bg-asphalt text-paper px-[5vw] py-16">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="text-paper/50 hover:text-paper text-xs tracking-[1.5px] uppercase transition"
        >
          ← Voltar pro site
        </Link>

        <div className="flex items-center gap-3 mt-4 mb-10">
          <LogoGTB className="h-7 w-auto" />
          <h1 className="font-display text-4xl text-paper">Blog</h1>
        </div>

        {error && (
          <p className="text-red-400 text-sm">Não foi possível carregar os posts agora.</p>
        )}

        {posts === null && !error && (
          <p className="text-paper/40 text-sm">Carregando...</p>
        )}

        {posts?.length === 0 && (
          <p className="text-paper/40 text-sm">Nenhum post publicado ainda. Volte em breve.</p>
        )}

        <div className="flex flex-col gap-4">
          {posts?.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="panel-3d block bg-asphalt-2 border border-white/10 rounded-xl p-6 hover:border-logo-purple transition-colors"
              >
                <h2 className="font-display text-2xl text-paper mb-2">{post.title}</h2>
                <p className="text-paper/60 text-sm leading-relaxed mb-3">{post.excerpt}...</p>
                <div className="flex items-center gap-2 text-xs text-paper/40">
                  <span>
                    {post.nickname}#{post.discriminator}
                  </span>
                  <span>&middot;</span>
                  <span>{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
