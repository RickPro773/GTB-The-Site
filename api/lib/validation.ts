import { z } from 'zod'

// Regras de senha: mínimo 8 caracteres, pelo menos 1 letra e 1
// número. Não exagera em exigências (tipo obrigar caractere
// especial) porque isso empiricamente faz as pessoas usarem senhas
// PIORES e mais previsíveis (ex: "Senha123!" em vez de uma
// passphrase mais longa e única) — a orientação mais atual de
// segurança (NIST) prioriza comprimento sobre complexidade forçada.
export const passwordSchema = z
  .string()
  .min(8, 'A senha precisa ter pelo menos 8 caracteres.')
  .max(72, 'A senha não pode passar de 72 caracteres.') // limite do próprio bcrypt
  .regex(/[a-zA-Z]/, 'A senha precisa ter pelo menos uma letra.')
  .regex(/[0-9]/, 'A senha precisa ter pelo menos um número.')

export const emailSchema = z.string().email('E-mail inválido.').max(254).toLowerCase()

// Nickname: 3-20 caracteres, letras/números/underscore/espaço.
// Não pode ser só espaço nem ter espaço nas pontas.
export const nicknameSchema = z
  .string()
  .trim()
  .min(3, 'O nickname precisa ter pelo menos 3 caracteres.')
  .max(20, 'O nickname não pode passar de 20 caracteres.')
  .regex(/^[a-zA-Z0-9_ ]+$/, 'Use só letras, números, espaço ou underscore no nickname.')

export const verificationCodeSchema = z
  .string()
  .length(6, 'O código precisa ter 6 dígitos.')
  .regex(/^\d+$/, 'O código só pode ter números.')

export const signupRequestSchema = z.object({
  email: emailSchema,
})

export const signupConfirmSchema = z.object({
  email: emailSchema,
  code: verificationCodeSchema,
  password: passwordSchema,
  nickname: nicknameSchema,
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Digite sua senha.'),
})

export const passwordResetRequestSchema = z.object({
  email: emailSchema,
})

export const passwordResetConfirmSchema = z.object({
  email: emailSchema,
  code: verificationCodeSchema,
  newPassword: passwordSchema,
})
