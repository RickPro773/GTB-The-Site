import jwt from 'jsonwebtoken'

// ⚠️ ATENÇÃO: essa variável precisa existir no ambiente da Vercel
// (Settings → Environment Variables → JWT_SECRET) antes do deploy
// funcionar. Veja o README na seção "Variáveis de ambiente
// necessárias" pra gerar um valor seguro.
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error(
    'JWT_SECRET não configurado. Adicione essa variável de ambiente no painel da Vercel antes de usar autenticação.'
  )
}

const SESSION_DURATION = '30d' // sessão fica válida por 30 dias

export interface SessionPayload {
  userId: string
  nickname: string
  discriminator: string
}

/**
 * Cria o token de sessão (JWT) assinado que vai pro cookie do
 * usuário depois de um login bem-sucedido. O token guarda só o
 * necessário pra identificar o usuário — NUNCA a senha ou o hash
 * dela, mesmo dentro do token (JWT não é criptografado, é só
 * assinado — qualquer um consegue LER o conteúdo, só não consegue
 * FORJAR um token válido sem o segredo).
 */
export function createSessionToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: SESSION_DURATION })
}

/**
 * Valida um token de sessão vindo do cookie. Retorna o payload se
 * for válido, ou null se estiver expirado, adulterado, ou ausente.
 */
export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null

  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload
  } catch {
    // token expirado, assinatura inválida, ou formato quebrado —
    // em qualquer um desses casos, tratamos como "não logado"
    return null
  }
}
