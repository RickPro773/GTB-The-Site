-- =============================================================
-- GTB — Schema do banco de dados (Neon Postgres)
-- =============================================================
-- ⚠️ IMPORTANTE sobre como rodar isso no SQL Editor da Neon:
-- O editor web da Neon às vezes recusa colar o arquivo INTEIRO de
-- uma vez (erro "cannot insert multiple commands into a prepared
-- statement") — isso é uma limitação da ferramenta web, não um
-- erro no SQL em si. Se isso acontecer, rode cada bloco numerado
-- abaixo SEPARADO (selecione só aquele bloco, clique Run, depois
-- o próximo), em vez de colar o arquivo inteiro de uma vez.
--
-- Se preferir rodar tudo de uma vez sem esse problema, use `psql`
-- pela linha de comando em vez do editor web:
--   psql "sua-connection-string-aqui" -f db/schema.sql

-- ============ BLOCO 1 ============
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

-- ============ BLOCO 2 ============
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- ============ BLOCO 3 ============
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

-- ============ BLOCO 4 ============
CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes (email, purpose);

-- ============ BLOCO 5 ============
-- Rate limiting simples (tentativas de login, envio de código)
-- -------------------------------------------------------------
-- Guarda quantas vezes uma ação foi tentada numa janela de tempo,
-- por e-mail ou IP. Usado pra bloquear tentativa de força bruta
-- em login e em pedido de código por e-mail.
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- e-mail ou IP
  action TEXT NOT NULL, -- 'login' | 'signup_code' | 'password_reset_code' | 'verify_code' | 'avatar_upload'
  attempts INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT unique_identifier_action UNIQUE (identifier, action)
);

-- ============ BLOCO 6 ============
-- Blog — posts (Fase 3)
-- -------------------------------------------------------------
-- `slug` é o identificador usado na URL do post (ex:
-- /blog/novidades-da-v0-0-6). Gerado a partir do título no
-- momento da criação, com um sufixo numérico se colidir com um
-- slug já existente.
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- corpo do post, em Markdown simples
  cover_image_url TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ BLOCO 7 ============
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_created ON blog_posts (published, created_at DESC);

-- ============ BLOCO 8 ============
-- Blog — comentários (Fase 3)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ BLOCO 9 ============
CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON blog_comments (post_id, created_at);

-- ============ BLOCO 10 ============
-- Chat — salas/canais (Fase 4)
-- -------------------------------------------------------------
-- `slug` identifica a sala no Pusher (nome do canal) e na URL.
-- Salas fixas (tipo "Geral") podem ser inseridas direto aqui; o
-- sistema também permite criar salas novas pela própria interface
-- mais adiante, se você quiser habilitar isso.
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ BLOCO 11 ============
-- Cria as salas padrão do GTB. Não faz nada se elas já existirem
-- (seguro rodar de novo).
INSERT INTO chat_rooms (slug, name, description) VALUES
  ('geral', 'Geral', 'Papo geral da galera do GTB'),
  ('bugs-sugestoes', 'Bugs & Sugestões', 'Reporta bug ou manda ideia pro jogo'),
  ('off-topic', 'Off-topic', 'Qualquer assunto que não seja sobre o GTB')
ON CONFLICT (slug) DO NOTHING;

-- ============ BLOCO 12 ============
-- Chat — mensagens (Fase 4)
-- -------------------------------------------------------------
-- Mensagens ficam guardadas no banco (histórico persiste mesmo se
-- o Pusher reiniciar/cair) — o Pusher só é usado pra empurrar a
-- mensagem em tempo real pra quem está com a sala aberta; quem
-- entra depois vê o histórico vindo direto do banco.
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ BLOCO 13 ============
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_created ON chat_messages (room_id, created_at);
