import { neon } from '@neondatabase/serverless'

// A Vercel injeta automaticamente a variável DATABASE_URL (ou
// POSTGRES_URL, dependendo de como o banco foi conectado pelo
// painel) assim que você cria o banco Postgres pela aba Storage.
// Não precisa copiar/colar nada na mão — já funciona sozinho tanto
// em produção quanto rodando `vercel dev` localmente.
const connectionString =
  process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING

if (!connectionString) {
  throw new Error(
    'Variável de conexão com o banco não encontrada (DATABASE_URL / POSTGRES_URL). ' +
      'Confirme que o banco Postgres está criado e conectado ao projeto na Vercel.'
  )
}

// `sql` é uma função "tagged template" — usa assim:
//   const rows = await sql`SELECT * FROM users WHERE email = ${email}`
// Os valores interpolados são automaticamente escapados contra SQL
// injection pelo driver, então NUNCA construa query concatenando
// strings na mão (isso reabriria a porta pra injection).
export const sql = neon(connectionString)
