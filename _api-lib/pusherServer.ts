import Pusher from 'pusher'

// ⚠️ ATENÇÃO: essas quatro variáveis precisam existir no ambiente
// da Vercel antes do chat funcionar. Veja o README na seção
// "Variáveis de ambiente necessárias". Todas vêm do painel do
// Pusher (dashboard.pusher.com → seu App → App Keys).
const PUSHER_APP_ID = process.env.PUSHER_APP_ID
const PUSHER_KEY = process.env.PUSHER_KEY
const PUSHER_SECRET = process.env.PUSHER_SECRET
const PUSHER_CLUSTER = process.env.PUSHER_CLUSTER

if (!PUSHER_APP_ID || !PUSHER_KEY || !PUSHER_SECRET || !PUSHER_CLUSTER) {
  throw new Error(
    'Variáveis do Pusher não configuradas (PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER).'
  )
}

export const pusherServer = new Pusher({
  appId: PUSHER_APP_ID,
  key: PUSHER_KEY,
  secret: PUSHER_SECRET,
  cluster: PUSHER_CLUSTER,
  useTLS: true,
})
