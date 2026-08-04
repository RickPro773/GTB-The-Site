import { useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Modal de autenticação com vários "modos" (telas internas):
 * - login: e-mail + senha
 * - signup-email: pede só o e-mail, dispara o código
 * - signup-code: confirma o código de 6 dígitos
 * - signup-details: escolhe senha e nickname (finaliza o cadastro)
 * - forgot-email: pede e-mail pra recuperar senha
 * - forgot-code: confirma código + define nova senha
 *
 * Precisa ficar dentro de <AnimatePresence> no componente pai pra
 * animar a saída também (ver App.jsx).
 */
export default function AuthModal({ auth, onClose }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [infoMessage, setInfoMessage] = useState('')

  function resetFeedback() {
    setError('')
    setInfoMessage('')
  }

  async function handleLogin(e) {
    e.preventDefault()
    resetFeedback()
    setIsSubmitting(true)
    try {
      await auth.login({ email, password })
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSignupEmailSubmit(e) {
    e.preventDefault()
    resetFeedback()
    setIsSubmitting(true)
    try {
      await auth.requestSignupCode(email)
      setMode('signup-code')
      setInfoMessage(`Mandamos um código pra ${email}. Confira sua caixa de entrada (e o spam).`)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleCodeConfirmed(e) {
    e.preventDefault()
    resetFeedback()
    if (code.length !== 6) {
      setError('Digite os 6 dígitos do código.')
      return
    }
    setMode('signup-details')
  }

  async function handleSignupFinish(e) {
    e.preventDefault()
    resetFeedback()
    setIsSubmitting(true)
    try {
      await auth.confirmSignup({ email, code, password, nickname })
      onClose()
    } catch (err) {
      setError(err.message)
      // se o código informado tiver ficado inválido nesse meio
      // tempo, volta pra etapa do código em vez de deixar a pessoa
      // presa numa tela que não vai funcionar de jeito nenhum
      if (err.message.toLowerCase().includes('código')) {
        setMode('signup-code')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleForgotEmailSubmit(e) {
    e.preventDefault()
    resetFeedback()
    setIsSubmitting(true)
    try {
      await auth.requestPasswordReset(email)
      setMode('forgot-code')
      setInfoMessage(`Se ${email} tiver conta, um código foi enviado.`)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleForgotFinish(e) {
    e.preventDefault()
    resetFeedback()
    setIsSubmitting(true)
    try {
      await auth.confirmPasswordReset({ email, code, newPassword: password })
      setInfoMessage('Senha redefinida! Já pode entrar com a senha nova.')
      setMode('login')
      setPassword('')
      setCode('')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function switchMode(newMode) {
    resetFeedback()
    setMode(newMode)
  }

  return (
    <motion.div
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black/75 backdrop-blur-sm px-6"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="panel-3d relative bg-asphalt-2 border border-white/10 rounded-xl max-w-sm w-full p-8"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 text-paper/50 hover:text-paper transition text-lg leading-none w-8 h-8 flex items-center justify-center"
        >
          ✕
        </button>

        {mode === 'login' && (
          <form onSubmit={handleLogin}>
            <h2 className="font-display text-2xl text-paper mb-1">Entrar</h2>
            <p className="text-paper/60 text-sm mb-5">Acesse sua conta do GTB.</p>

            <Field label="E-mail" type="email" value={email} onChange={setEmail} required autoFocus />
            <Field label="Senha" type="password" value={password} onChange={setPassword} required />

            {error && <ErrorText>{error}</ErrorText>}

            <SubmitButton isSubmitting={isSubmitting}>Entrar</SubmitButton>

            <div className="flex justify-between mt-4 text-xs">
              <button
                type="button"
                onClick={() => switchMode('forgot-email')}
                className="text-paper/50 hover:text-paper transition"
              >
                Esqueci minha senha
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup-email')}
                className="text-logo-green hover:underline"
              >
                Criar conta
              </button>
            </div>
          </form>
        )}

        {mode === 'signup-email' && (
          <form onSubmit={handleSignupEmailSubmit}>
            <h2 className="font-display text-2xl text-paper mb-1">Criar conta</h2>
            <p className="text-paper/60 text-sm mb-5">
              Primeiro, confirme seu e-mail. Mandamos um código de verificação.
            </p>

            <Field label="E-mail" type="email" value={email} onChange={setEmail} required autoFocus />

            {error && <ErrorText>{error}</ErrorText>}

            <SubmitButton isSubmitting={isSubmitting}>Enviar código</SubmitButton>

            <BackToLogin onClick={() => switchMode('login')} />
          </form>
        )}

        {mode === 'signup-code' && (
          <form onSubmit={handleCodeConfirmed}>
            <h2 className="font-display text-2xl text-paper mb-1">Confirme o código</h2>
            {infoMessage && <InfoText>{infoMessage}</InfoText>}

            <Field
              label="Código de 6 dígitos"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(v) => setCode(v.replace(/\D/g, ''))}
              required
              autoFocus
              centered
            />

            {error && <ErrorText>{error}</ErrorText>}

            <SubmitButton isSubmitting={isSubmitting}>Continuar</SubmitButton>

            <button
              type="button"
              onClick={() => switchMode('signup-email')}
              className="text-paper/50 hover:text-paper text-xs mt-4 block mx-auto transition"
            >
              ← usar outro e-mail
            </button>
          </form>
        )}

        {mode === 'signup-details' && (
          <form onSubmit={handleSignupFinish}>
            <h2 className="font-display text-2xl text-paper mb-1">Quase lá</h2>
            <p className="text-paper/60 text-sm mb-5">Escolha sua senha e seu nickname.</p>

            <Field label="Senha" type="password" value={password} onChange={setPassword} required />
            <p className="text-paper/40 text-[0.7rem] -mt-3 mb-4">Pelo menos 8 caracteres, com letra e número.</p>

            <Field label="Nickname" type="text" value={nickname} onChange={setNickname} required maxLength={20} />
            <p className="text-paper/40 text-[0.7rem] -mt-3 mb-4">
              Você vai ganhar um código único, tipo{' '}
              <span className="text-paper/60">{nickname || 'SeuNick'}#0472</span>.
            </p>

            {error && <ErrorText>{error}</ErrorText>}

            <SubmitButton isSubmitting={isSubmitting}>Criar minha conta</SubmitButton>
          </form>
        )}

        {mode === 'forgot-email' && (
          <form onSubmit={handleForgotEmailSubmit}>
            <h2 className="font-display text-2xl text-paper mb-1">Recuperar senha</h2>
            <p className="text-paper/60 text-sm mb-5">
              Digite seu e-mail — se tiver conta, mandamos um código.
            </p>

            <Field label="E-mail" type="email" value={email} onChange={setEmail} required autoFocus />

            {error && <ErrorText>{error}</ErrorText>}

            <SubmitButton isSubmitting={isSubmitting}>Enviar código</SubmitButton>

            <BackToLogin onClick={() => switchMode('login')} />
          </form>
        )}

        {mode === 'forgot-code' && (
          <form onSubmit={handleForgotFinish}>
            <h2 className="font-display text-2xl text-paper mb-1">Nova senha</h2>
            {infoMessage && <InfoText>{infoMessage}</InfoText>}

            <Field
              label="Código de 6 dígitos"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(v) => setCode(v.replace(/\D/g, ''))}
              required
              autoFocus
              centered
            />
            <Field label="Nova senha" type="password" value={password} onChange={setPassword} required />

            {error && <ErrorText>{error}</ErrorText>}

            <SubmitButton isSubmitting={isSubmitting}>Redefinir senha</SubmitButton>

            <BackToLogin onClick={() => switchMode('login')} />
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}

// ---- Sub-componentes de formulário, reutilizados nas telas acima ----

function Field({ label, type, value, onChange, required, autoFocus, maxLength, inputMode, centered }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs text-paper/60 uppercase tracking-[1px] mb-1.5">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoFocus={autoFocus}
        maxLength={maxLength}
        inputMode={inputMode}
        className={`w-full bg-asphalt border border-white/10 rounded-lg py-2.5 px-3.5 text-sm text-paper outline-none focus:border-hood-green transition-colors ${
          centered ? 'text-center tracking-[6px] text-lg' : ''
        }`}
      />
    </label>
  )
}

function SubmitButton({ children, isSubmitting }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="btn-3d w-full bg-neon-purple text-white rounded-lg py-3 text-sm font-bold tracking-[0.5px] hover:bg-neon-purple-dim transition-colors disabled:opacity-60"
    >
      {isSubmitting ? 'Aguarde...' : children}
    </button>
  )
}

function ErrorText({ children }) {
  return <p className="text-red-400 text-xs mb-4 -mt-1">{children}</p>
}

function InfoText({ children }) {
  return <p className="text-paper/60 text-xs mb-4">{children}</p>
}

function BackToLogin({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-paper/50 hover:text-paper text-xs mt-4 block mx-auto transition"
    >
      ← voltar pro login
    </button>
  )
}
