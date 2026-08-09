import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import LogoGTB from './LogoGTB'
import { usePageTitle } from '../hooks/usePageTitle'

export default function BlogPost({ auth, onOpenAuth }) {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [commentError, setCommentError] = useState('')

  usePageTitle(post ? `${post.title} — GTB` : 'Blog — GTB')

  useEffect(() => {
    window.scrollTo(0, 0)
    setNotFound(false)
    setError(false)
    fetch(`/api/blog?slug=${encodeURIComponent(slug)}`)
      .then(async (res) => {
        if (res.status === 404) {
          setNotFound(true)
          return
        }
        if (!res.ok) throw new Error()
        const data = await res.json()
        setPost(data.post)
        setComments(data.comments || [])
      })
      .catch(() => setError(true))
  }, [slug])

  async function handleSubmitComment(e) {
    e.preventDefault()
    setCommentError('')

    if (!auth.user) {
      onOpenAuth()
      return
    }

    if (!commentText.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/blog?action=comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ postId: post.id, content: commentText.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Não foi possível comentar.')

      setComments((prev) => [
        ...prev,
        {
          ...data.comment,
          nickname: auth.user.nickname,
          discriminator: auth.user.discriminator,
          avatar_url: auth.user.avatarUrl,
        },
      ])
      setCommentText('')
    } catch (err) {
      setCommentError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-asphalt flex flex-col items-center justify-center text-center px-6">
        <LogoGTB className="h-12 w-auto mb-6" />
        <h1 className="font-display text-3xl text-paper mb-3">Post não encontrado</h1>
        <Link
          to="/blog"
          className="btn-3d bg-neon-purple text-white rounded-lg py-3 px-6 text-sm font-bold hover:bg-neon-purple-dim transition-colors"
        >
          Voltar pro blog
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-asphalt text-paper px-[5vw] py-16">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/blog"
          className="text-paper/50 hover:text-paper text-xs tracking-[1.5px] uppercase transition"
        >
          ← Voltar pro blog
        </Link>

        {error && <p className="text-red-400 text-sm mt-6">Não foi possível carregar o post.</p>}

        {!post && !error && <p className="text-paper/40 text-sm mt-6">Carregando...</p>}

        {post && (
          <>
            <h1 className="font-display text-4xl text-paper mt-6 mb-3">{post.title}</h1>
            <div className="flex items-center gap-2 text-xs text-paper/40 mb-8">
              <span>
                {post.nickname}#{post.discriminator}
              </span>
              <span>&middot;</span>
              <span>{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
            </div>

            {post.cover_image_url && (
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full rounded-xl mb-8 border border-white/10"
              />
            )}

            <div className="text-paper/85 leading-relaxed whitespace-pre-wrap mb-14">
              {post.content}
            </div>

            <h2 className="font-display text-2xl text-logo-green text-3d-green mb-5">
              Comentários ({comments.length})
            </h2>

            <form onSubmit={handleSubmitComment} className="mb-8">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={auth.user ? 'Escreva um comentário...' : 'Entre pra comentar'}
                disabled={!auth.user}
                maxLength={2000}
                rows={3}
                className="w-full bg-asphalt-2 border border-white/10 rounded-lg py-3 px-4 text-sm text-paper outline-none focus:border-hood-green transition-colors disabled:opacity-50 resize-none"
              />
              {commentError && <p className="text-red-400 text-xs mt-2">{commentError}</p>}
              <button
                type={auth.user ? 'submit' : 'button'}
                onClick={!auth.user ? onOpenAuth : undefined}
                disabled={isSubmitting}
                className="btn-3d mt-3 bg-neon-purple text-white rounded-lg py-2.5 px-6 text-sm font-bold hover:bg-neon-purple-dim transition-colors disabled:opacity-60"
              >
                {auth.user ? (isSubmitting ? 'Enviando...' : 'Comentar') : 'Entrar pra comentar'}
              </button>
            </form>

            <div className="flex flex-col gap-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-white/[0.06] pb-4">
                  <div className="text-sm font-semibold text-paper mb-1">
                    {comment.nickname}
                    <span className="text-paper/40">#{comment.discriminator}</span>
                  </div>
                  <p className="text-paper/75 text-sm leading-relaxed">{comment.content}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
