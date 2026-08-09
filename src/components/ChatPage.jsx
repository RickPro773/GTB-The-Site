import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Pusher from 'pusher-js'
import LogoGTB from './LogoGTB'
import { usePageTitle } from '../hooks/usePageTitle'

let pusherClient = null

/** Cria (ou reaproveita) a instância única do cliente Pusher. */
function getPusherClient() {
  if (pusherClient) return pusherClient

  const key = import.meta.env.VITE_PUSHER_KEY
  const cluster = import.meta.env.VITE_PUSHER_CLUSTER
  if (!key || !cluster) return null

  pusherClient = new Pusher(key, {
    cluster,
    authEndpoint: '/api/chat?action=pusher-auth',
    auth: { headers: { 'Content-Type': 'application/json' } },
  })
  return pusherClient
}

export default function ChatPage({ auth, onOpenAuth }) {
  const [rooms, setRooms] = useState([])
  const [activeRoom, setActiveRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const [connectionError, setConnectionError] = useState(false)
  const messagesEndRef = useRef(null)
  const channelRef = useRef(null)

  usePageTitle('Chat — GTB')

  // carrega a lista de salas ao montar
  useEffect(() => {
    window.scrollTo(0, 0)
    fetch('/api/chat?action=rooms')
      .then((res) => res.json())
      .then((data) => {
        setRooms(data.rooms || [])
        if (data.rooms?.length > 0) setActiveRoom(data.rooms[0].slug)
      })
      .catch(() => setError('Não foi possível carregar as salas.'))
  }, [])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // ao trocar de sala (ou logar): busca o histórico e assina o
  // canal do Pusher pra receber mensagens novas em tempo real
  useEffect(() => {
    if (!activeRoom || !auth.user) return

    let cancelled = false
    setMessages([])

    fetch(`/api/chat?room=${encodeURIComponent(activeRoom)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setMessages(data.messages || [])
          setTimeout(scrollToBottom, 100)
        }
      })
      .catch(() => setError('Não foi possível carregar as mensagens.'))

    const client = getPusherClient()
    if (!client) {
      setConnectionError(true)
      return
    }

    const channel = client.subscribe(`private-chat-${activeRoom}`)
    channelRef.current = channel

    channel.bind('new-message', (payload) => {
      setMessages((prev) => [...prev, payload])
      setTimeout(scrollToBottom, 100)
    })

    channel.bind('pusher:subscription_error', () => setConnectionError(true))

    return () => {
      cancelled = true
      client.unsubscribe(`private-chat-${activeRoom}`)
      channelRef.current = null
    }
  }, [activeRoom, auth.user, scrollToBottom])

  async function handleSend(e) {
    e.preventDefault()
    setError('')

    if (!auth.user) {
      onOpenAuth()
      return
    }
    if (!messageText.trim()) return

    setIsSending(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ roomSlug: activeRoom, content: messageText.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Não foi possível enviar.')
      setMessageText('')
      // a mensagem enviada chega de volta via Pusher (evento
      // new-message) igual pra todo mundo, incluindo quem mandou —
      // não precisa adicionar ela na lista manualmente aqui
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-asphalt text-paper flex flex-col">
      <div className="px-[5vw] py-6 border-b border-white/[0.06] flex items-center gap-3">
        <Link to="/" className="text-paper/50 hover:text-paper text-xs tracking-[1.5px] uppercase transition">
          ← Site
        </Link>
        <LogoGTB className="h-6 w-auto" />
        <h1 className="font-display text-2xl text-paper">Chat</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Lista de salas */}
        <div className="w-48 sm:w-56 border-r border-white/[0.06] p-3 overflow-y-auto flex-shrink-0">
          {rooms.map((room) => (
            <button
              key={room.slug}
              onClick={() => setActiveRoom(room.slug)}
              className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                activeRoom === room.slug
                  ? 'bg-neon-purple/20 text-paper border border-neon-purple/40'
                  : 'text-paper/60 hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="text-sm font-semibold">{room.name}</div>
              {room.description && (
                <div className="text-[0.65rem] text-paper/40 truncate">{room.description}</div>
              )}
            </button>
          ))}
        </div>

        {/* Área de mensagens */}
        <div className="flex-1 flex flex-col min-w-0">
          {!auth.user ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <p className="text-paper/60 text-sm mb-4">Entre na sua conta pra participar do chat.</p>
              <button
                onClick={onOpenAuth}
                className="btn-3d bg-neon-purple text-white rounded-lg py-2.5 px-6 text-sm font-bold hover:bg-neon-purple-dim transition-colors"
              >
                Entrar / Criar conta
              </button>
            </div>
          ) : connectionError ? (
            <div className="flex-1 flex items-center justify-center text-center px-6">
              <p className="text-red-400 text-sm">
                Não foi possível conectar ao chat em tempo real agora. Tente recarregar a página.
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-asphalt-2 border border-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {msg.avatar_url ? (
                        <img src={msg.avatar_url} alt={msg.nickname} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[0.6rem] font-bold text-paper/70">
                          {msg.nickname.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs">
                        <span className="font-semibold text-paper">{msg.nickname}</span>
                        <span className="text-paper/40">#{msg.discriminator}</span>
                        <span className="text-paper/30 ml-2">
                          {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-paper/85 break-words">{msg.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="p-3 border-t border-white/[0.06] flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Escreva uma mensagem..."
                  maxLength={1000}
                  className="flex-1 bg-asphalt-2 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-paper outline-none focus:border-hood-green transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="btn-3d bg-neon-purple text-white rounded-lg px-5 text-sm font-bold hover:bg-neon-purple-dim transition-colors disabled:opacity-60"
                >
                  Enviar
                </button>
              </form>
              {error && <p className="text-red-400 text-xs px-4 pb-2">{error}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
