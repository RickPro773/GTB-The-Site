import { Resend } from 'resend'
import { EMAIL_TEMPLATE } from './emailTemplate.js'

// ⚠️ ATENÇÃO: essas duas variáveis precisam existir no ambiente da
// Vercel antes do envio de e-mail funcionar. Veja o README na
// seção "Variáveis de ambiente necessárias".
const RESEND_API_KEY = process.env.RESEND_API_KEY
const EMAIL_FROM = process.env.EMAIL_FROM // ex: "GTB <contato@seudominio.com>"

if (!RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY não configurado nas variáveis de ambiente da Vercel.')
}
if (!EMAIL_FROM) {
  throw new Error(
    'EMAIL_FROM não configurado. Defina o remetente (precisa ser de um domínio verificado no Resend).'
  )
}

const resend = new Resend(RESEND_API_KEY)

/**
 * Substitui as variáveis {{nome}} do template pelo valor real.
 * Simples de propósito — o template só tem 4 variáveis, não
 * precisa de uma lib de templating pra isso.
 */
function fillTemplate(vars: Record<string, string>): string {
  let html = EMAIL_TEMPLATE
  for (const [key, value] of Object.entries(vars)) {
    html = html.replaceAll(`{{${key}}}`, value)
  }
  return html
}

/**
 * Manda o e-mail com o código de verificação de 6 dígitos —
 * usado tanto no cadastro quanto na recuperação de senha. Usa o
 * template real criado no dashboard do Resend (api/lib/emailTemplate.html),
 * não HTML solto no código.
 */
export async function sendVerificationCodeEmail(
  toEmail: string,
  code: string,
  purpose: 'signup' | 'password_reset'
) {
  const subject =
    purpose === 'signup' ? 'Seu código de verificação — GTB' : 'Recuperação de senha — GTB'

  const emailTitle = purpose === 'signup' ? 'Confirme seu código de verificação' : 'Redefinir sua senha'

  const emailIntro =
    purpose === 'signup'
      ? 'Recebemos um pedido pra criar uma conta no GTB. Use o código abaixo para concluir seu cadastro:'
      : 'Recebemos um pedido pra redefinir a senha da sua conta no GTB. Use o código abaixo para continuar:'

  // Antes do cadastro terminar, ainda não existe nickname — usamos
  // a parte antes do @ do e-mail como saudação nesse caso. Na
  // recuperação de senha, a conta já existe, mas por simplicidade
  // (a função não recebe o nickname aqui) seguimos o mesmo padrão;
  // se quiser usar o nickname real na recuperação de senha, é só
  // passar ele como parâmetro extra dessa função.
  const firstName = toEmail.split('@')[0]

  const html = fillTemplate({
    email_title: emailTitle,
    first_name: firstName,
    email_intro: emailIntro,
    verification_code: code,
  })

  await resend.emails.send({
    from: EMAIL_FROM,
    to: toEmail,
    subject,
    html,
  })
}
