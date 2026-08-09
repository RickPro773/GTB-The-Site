import bcrypt from 'bcryptjs'
import { randomInt } from 'node:crypto'

// 12 rounds é o equilíbrio recomendado atualmente entre segurança
// e velocidade pra hash de senha com bcrypt (mais que isso deixa
// o login perceptivelmente lento sem ganho real de segurança).
const SALT_ROUNDS = 12

/**
 * Transforma uma senha em texto puro num hash seguro pra guardar
 * no banco. NUNCA guarde a senha em texto puro em lugar nenhum,
 * nem por um segundo, nem em log.
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS)
}

/**
 * Compara uma senha digitada no login com o hash salvo no banco.
 * Retorna true/false — nunca revela nada sobre o hash em si.
 */
export async function verifyPassword(plainPassword: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hash)
}

/**
 * Códigos de verificação (os de 6 dígitos mandados por e-mail)
 * também são hasheados antes de ir pro banco — mesma lógica de
 * senha: se o banco vazar um dia, ninguém consegue usar os hashes
 * pra se passar pelo código de verificação de ninguém.
 */
export async function hashVerificationCode(code: string): Promise<string> {
  // Códigos de verificação são curtos (6 dígitos) e de vida curta
  // (expiram em minutos), então um custo menor de hash é aceitável
  // aqui — o rate limit em cima das tentativas é a defesa principal
  // contra força bruta nesse caso, não o custo do hash em si.
  return bcrypt.hash(code, 10)
}

export async function verifyCode(plainCode: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainCode, hash)
}

/**
 * Gera um código numérico de 6 dígitos (ex: "042817") pra
 * verificação por e-mail. Usa o gerador criptográfico do Node
 * (crypto.randomInt), não Math.random() — Math.random() não é
 * seguro pra nada relacionado a autenticação/segredos, porque sua
 * sequência pode ser prevista.
 */
export function generateVerificationCode(): string {
  const n = randomInt(0, 1_000_000)
  return n.toString().padStart(6, '0')
}
