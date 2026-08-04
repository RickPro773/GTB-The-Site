import { useState, useEffect, useCallback } from 'react'

/**
 * Gerencia o estado de autenticação do site inteiro: quem está
 * logado (se alguém), e as ações de login/cadastro/logout — todas
 * conversando com os endpoints em api/auth/*.
 *
 * A sessão em si mora num cookie httpOnly (o JS do navegador nem
 * consegue ler o valor dele diretamente, só o servidor) — esse
 * hook só guarda em memória os DADOS do usuário (nickname,
 * discriminator, avatar) pra exibir na tela, não o token em si.
 */
export function useAuth() {
  const [user, setUser] = useState(null) // null = não logado, ou { id, nickname, discriminator, avatarUrl, avatarStatus }
  const [isLoading, setIsLoading] = useState(true) // true até a primeira checagem de sessão terminar

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // checa se já existe sessão válida assim que o site carrega
  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  async function requestSignupCode(email) {
    const res = await fetch('/api/auth/signup-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Não foi possível enviar o código.')
    return data
  }

  async function confirmSignup({ email, code, password, nickname }) {
    const res = await fetch('/api/auth/signup-confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, code, password, nickname }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Não foi possível criar a conta.')
    setUser(data.user)
    return data.user
  }

  async function login({ email, password }) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Não foi possível entrar.')
    setUser(data.user)
    return data.user
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
  }

  async function requestPasswordReset(email) {
    const res = await fetch('/api/auth/password-reset-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Não foi possível enviar o código.')
    return data
  }

  async function confirmPasswordReset({ email, code, newPassword }) {
    const res = await fetch('/api/auth/password-reset-confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, code, newPassword }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Não foi possível redefinir a senha.')
    return data
  }

  return {
    user,
    isLoading,
    isLoggedIn: Boolean(user),
    refreshUser,
    requestSignupCode,
    confirmSignup,
    login,
    logout,
    requestPasswordReset,
    confirmPasswordReset,
  }
}
