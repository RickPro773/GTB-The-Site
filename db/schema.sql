-- =============================================================
-- GTB — Schema do banco de dados (Neon Postgres)
-- =============================================================
-- Como rodar: cole este arquivo inteiro no SQL Editor do painel
-- da Neon (dashboard.vercel.com → seu projeto → Storage → o banco
-- → "Open in Neon Console" → SQL Editor), ou rode via `psql` se
-- preferir linha de comando. Só precisa rodar uma vez.

-- -------------------------------------------------------------
-- Tabela de usuários
-- -------------------------------------------------------------
-- `discriminator` é o número depois do # (ex: "1234" em
-- Brodis#1234). É gerado automaticamente no cadastro — veja a
-- lógica em api/lib/discriminator.ts. A combinação nickname +
-- discriminator é única (dois usuários podem ter o mesmo nick,
-- desde que o número depois do # seja diferente — igual Discord).
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nickname TEXT NOT NULL,
  discriminator TEXT NOT NULL,
  avatar_url TEXT,
  avatar_status TEXT NOT NULL DEFAULT 'none', -- 'none' | 'pending' | 'approved' | 'rejected'
  email_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT unique_nickname_discriminator UNIQUE (nickname, discriminator)
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- -------------------------------------------------------------
-- Códigos de verificação (cadastro e reset de senha)
-- -------------------------------------------------------------
-- Guarda o código de 6 dígitos mandado por e-mail. Expira sozinho
-- depois de um tempo (checado na hora de validar, não precisa de
-- job de limpeza — mas dá pra rodar DELETE FROM verification_codes
-- WHERE expires_at < now() de vez em quando se quiser manter a
-- tabela pequena).
CREATE TABLE IF NOT EXISTS verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL, -- o código em si nunca é salvo em texto puro
  purpose TEXT NOT NULL, -- 'signup' | 'password_reset'
  attempts INTEGER NOT NULL DEFAULT 0, -- quantas vezes tentaram validar (limita brute-force)
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes (email, purpose);

-- -------------------------------------------------------------
-- Rate limiting simples (tentativas de login, envio de código)
-- -------------------------------------------------------------
-- Guarda quantas vezes uma ação foi tentada numa janela de tempo,
-- por e-mail ou IP. Usado pra bloquear tentativa de força bruta
-- em login e em pedido de código por e-mail.
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- e-mail ou IP
  action TEXT NOT NULL, -- 'login' | 'signup_code' | 'password_reset_code'
  attempts INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT unique_identifier_action UNIQUE (identifier, action)
);
