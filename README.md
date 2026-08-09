# GTB — Grande Theft Brodis (site oficial)

Site do jogo GTB, construído com **React + Vite + Tailwind CSS**
(build real, não CDN), com deploy automático pra **Vercel**.

## 🚨 Deu erro no `npm run build`? Leia isto primeiro

Se aparecer um erro tipo `Cannot find module
@rollup/rollup-linux-x64-gnu` (ou qualquer erro mencionando
`@rollup/rollup-...`), **não é bug no código do site** — é um
[bug conhecido do próprio npm](https://github.com/npm/cli/issues/4828)
com pacotes opcionais, que acontece quando a pasta `node_modules`
é copiada/zipada de um computador pra outro em vez de instalada do
zero em cada lugar (isso corrompe silenciosamente alguns pacotes
nativos do sistema).

**Correção (funciona sempre):**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

No Windows (PowerShell), o primeiro comando é:
```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
npm run build
```

**Regra geral pra evitar isso de novo:** nunca copie a pasta
`node_modules` entre computadores (nem dentro de um `.zip` do
projeto). Ela é sempre gerada de novo rodando `npm install` — é
por isso que `node_modules/` está no `.gitignore` e não deveria
ir nem pro Git nem pra nenhum zip que você me manda ou sobe em
outro lugar.

## 🚨 Deu erro "No more than 12 Serverless Functions" no deploy?

Isso já está corrigido no projeto atual, mas vale entender o
porquê pra não recriar o problema ao adicionar endpoints novos.

**A causa:** o plano gratuito (Hobby) da Vercel permite no máximo
**12 Serverless Functions** por deploy. A Vercel conta **qualquer**
arquivo `.ts`/`.js` dentro da pasta `api/` como uma function
separada — inclusive arquivos que não são endpoints de verdade,
só código compartilhado (tipo a conexão com o banco, funções de
hash de senha, etc). Isso estourou o limite rapidinho.

**A correção:** todo o código compartilhado (que não é um endpoint
chamável por URL) mora numa pasta separada, **fora** de `api/`,
chamada **`_api-lib/`** (na raiz do projeto, do lado de fora de
`api/`). A Vercel só escaneia dentro de `api/` pra contar
functions, então tudo que está em `_api-lib/` não conta pro limite.

**Ao adicionar um endpoint novo:**
- Se é um endpoint de verdade (algo que o front-end vai chamar via
  `fetch('/api/...')`), coloque dentro de `api/` — mas fique de
  olho no total (hoje temos 10, o limite é 12, sobra espaço pra só
  mais 2 sem precisar reorganizar de novo)
- Se é código compartilhado (uma função auxiliar, uma conexão, uma
  validação reutilizável), coloque em `_api-lib/`, nunca em
  `api/lib/`

**Ao importar algo de `_api-lib/` dentro de um endpoint em
`api/auth/*.ts` ou `api/account/*.ts`:** o caminho relativo é
`../../_api-lib/nome-do-arquivo.js` (dois níveis pra cima, porque
esses endpoints estão em subpastas dentro de `api/`).

## 🎬 Versão 1.1 — Fase 1: Framer Motion (concluída)

O site está em processo de virar a versão 1.1, que vai incluir
backend próprio (contas, chat, blog) em fases futuras. Esta
primeira fase adicionou **Framer Motion** ao front-end que já
existia, mantendo React + Tailwind + Vite como estavam — nada de
infraestrutura mudou ainda, só as animações ficaram mais ricas.

**O que mudou:**
- **`Reveal.jsx`**: as seções da home (Rádio, Enquete, Trailer,
  Patch Notes, Bora pra Rua) continuam aparecendo com fade ao rolar
  a página até elas, mas agora com física de mola de verdade
  (`whileInView` do Framer Motion) em vez de uma curva de easing
  fixa em CSS.
- **`Characters.jsx`**: os cards de personagem agora aparecem em
  sequência (um logo depois do outro) ao rolar até a seção, em vez
  de todos de uma vez — dá a sensação de "revelar o elenco".
- **Transição de página**: navegar da Home pra ficha de um
  personagem (e voltar) agora tem uma transição suave de verdade
  (fade + leve deslocamento), coordenada por `AnimatePresence` no
  `App.jsx`. Antes era só uma classe CSS estática, sem controle
  real sobre o momento de saída.
- **`ComingSoonModal.jsx`** e **`ErrorToast.jsx`**: agora animam
  também ao **fechar** (antes só a entrada era suave — o fechamento
  era um corte seco, porque CSS transition não consegue animar o
  desmonte de um componente React sem ajuda).
- **`RadioSelector.jsx`**: a barra de progresso e os botões de
  play/pular ganharam resposta mais viva (`whileTap` nos botões,
  barra de progresso animada em vez de só CSS transition).

**Próximas fases da v1.1** (ainda não implementadas, aguardando
decisões de infraestrutura):
- Backend em TypeScript nas Vercel Functions (sistema de contas,
  login por e-mail com código de verificação, senha com hash)
- Banco de dados Postgres (via Neon, integrado à Vercel)
- Envio de e-mail (via Resend)
- Chat, blog, e sistema de moderação de imagem de avatar

## 🔑 Variáveis de ambiente necessárias (Fases 2, 3 e 4 — Backend)

O sistema de contas, blog e chat **não funcionam sem essas
variáveis configuradas na Vercel**. Vá em
**Settings → Environment Variables** dentro do projeto na Vercel e
adicione cada uma:

| Variável | De onde vem | Obrigatória pra |
|---|---|---|
| `DATABASE_URL` ou `POSTGRES_URL` | Criada sozinha quando você conecta o banco Postgres (Neon) pela aba Storage | Tudo que usa banco (contas, blog, chat) |
| `JWT_SECRET` | Você gera (veja comando abaixo) | Login/sessão |
| `RESEND_API_KEY` | Painel do Resend → API Keys | Envio de e-mail |
| `EMAIL_FROM` | `GTB <onboarding@resend.dev>` por enquanto (veja nota abaixo) | Envio de e-mail |
| `SIGHTENGINE_API_USER` | Painel do Sightengine | Upload de avatar |
| `SIGHTENGINE_API_SECRET` | Painel do Sightengine | Upload de avatar |
| `BLOB_READ_WRITE_TOKEN` | Criada sozinha quando você cria o Vercel Blob pela aba Storage | Upload de avatar |
| `PUSHER_APP_ID` | Painel do Pusher → seu App → App Keys | Chat (Fase 4) |
| `PUSHER_KEY` | Painel do Pusher → seu App → App Keys | Chat (Fase 4) |
| `PUSHER_SECRET` | Painel do Pusher → seu App → App Keys | Chat (Fase 4) |
| `PUSHER_CLUSTER` | Painel do Pusher → seu App → App Keys (ex: `us2`, `sa1`) | Chat (Fase 4) |
| `VITE_PUSHER_KEY` | **Mesmo valor** de `PUSHER_KEY` acima | Chat (Fase 4) — front-end |
| `VITE_PUSHER_CLUSTER` | **Mesmo valor** de `PUSHER_CLUSTER` acima | Chat (Fase 4) — front-end |

⚠️ **Sobre as duas variáveis `VITE_PUSHER_*` duplicadas:** isso não
é engano — o Vite só expõe pro código do navegador (front-end) as
variáveis que começam com `VITE_`. As variáveis `PUSHER_KEY` e
`PUSHER_CLUSTER` (sem o prefixo) são usadas só pelo backend
(`_api-lib/pusherServer.ts`); as versões com `VITE_` são usadas
pelo `ChatPage.jsx` no navegador pra conectar ao Pusher
diretamente. Cadastre as duas variáveis com o mesmo valor.

**Gerar o `JWT_SECRET`** (roda isso no terminal do seu PC, com Node
instalado):
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```
Copia o resultado e cola como valor dessa variável.

**Criando o App no Pusher:**
1. Crie conta em [pusher.com](https://pusher.com) (sem cartão)
2. No dashboard, **Create app** → escolha um nome (ex: `gtb-chat`)
   e um **cluster** perto de você (ex: `sa1` pra América do Sul)
3. Vá em **App Keys** — lá estão os 4 valores (`app_id`, `key`,
   `secret`, `cluster`) que você vai colar nas variáveis acima

**Sobre o `EMAIL_FROM` usando `resend.dev`:** o Resend só permite
mandar e-mail de um endereço com **domínio verificado** — não dá
pra usar um Gmail (nem qualquer outro provedor de e-mail comum)
como remetente, é uma restrição de segurança do próprio serviço
(evita que qualquer um finja mandar e-mail "como se fosse" do
Gmail de outra pessoa). Enquanto você não tiver um domínio próprio
verificado no Resend, use `GTB <onboarding@resend.dev>` — é um
endereço de teste que o próprio Resend disponibiliza e que já
funciona de verdade, só aparece esse remetente genérico em vez de
algo com a cara do GTB. Quando tiver um domínio (mesmo um barato,
tipo `.xyz`), volte no painel do Resend → Domains → adicione e
verifique ele, e troque o valor de `EMAIL_FROM` pra algo como
`GTB <contato@seudominio.com>`.

⚠️ **Nunca cole nenhuma dessas chaves em conversa nenhuma (nem
aqui, nem com IA nenhuma) — elas só devem existir dentro do painel
de variáveis de ambiente da Vercel.** Se qualquer uma delas já foi
exposta antes, gere uma nova no painel do serviço correspondente
(Resend, Sightengine) antes de colar aqui.

Depois de adicionar/alterar qualquer variável, é preciso fazer um
novo deploy pra ela valer (`git push` qualquer coisa, ou
**Deployments → ⋯ → Redeploy** no painel).

## Rodando o SQL do banco (uma vez, antes do primeiro uso)

O arquivo `db/schema.sql` tem a estrutura de tabelas necessária
(usuários, códigos de verificação, rate limit). Antes do sistema de
contas funcionar, você precisa rodar esse SQL uma vez dentro do seu
banco Neon:

1. No painel da Vercel, vá em **Storage** → clique no banco Postgres
   que você criou
2. Procure o botão/link pra abrir o **SQL Editor** (ou "Query", ou
   "Neon Console" — a Vercel geralmente redireciona pro console do
   Neon)
3. Cola todo o conteúdo de `db/schema.sql` e executa
4. Pronto — as tabelas já existem, o backend já pode ler/escrever
   nelas

## Estrutura de pastas

```
gtb-site/
├── index.html                      (raiz do Vite, injeta o React)
├── package.json
├── vite.config.js                  (⚠️ ajustar "base", ver abaixo)
├── tailwind.config.js              (tema: cores, fontes, animações)
├── postcss.config.js
├── .gitignore
├── README.md
├── public/
│   └── favicon.svg
├── .github/
│   └── workflows/
│       └── deploy.yml              (build + deploy automático)
└── src/
    ├── main.jsx                    (entry point)
    ├── App.jsx                     (junta todos os componentes)
    ├── index.css                   (Tailwind + font-face + efeitos custom)
    ├── components/
    │   ├── StatusBar.jsx           (barra amarela "alpha fechada")
    │   ├── Header.jsx              (nav fixo)
    │   ├── Intro.jsx               (slideshow + barra de load + música)
    │   ├── NowPlayingToast.jsx     (aviso "tocando agora")
    │   ├── Hero.jsx                (seção principal)
    │   ├── Characters.jsx          (roleta de personagens)
    │   ├── PlaySection.jsx         (seção final "Bora pra Rua")
    │   └── Footer.jsx
    ├── hooks/
    │   └── useAudioPlayer.js       (lógica de troca intro→menu)
    ├── data/
    │   └── roster.js               (lista de personagens, editável)
    └── assets/
        ├── images/  (scene1.png, scene2.png, characters-wheel.png)
        ├── audio/   (intro-theme.mp3, menu-theme.mp3)
        └── fonts/   (pricedown.otf)
```

## Como rodar no seu PC

Precisa ter o **Node.js** instalado (versão 18 ou mais recente —
baixe em nodejs.org se não tiver).

```bash
cd gtb-site
npm install       # instala as dependências (só precisa fazer 1x)
npm run dev       # abre servidor local com hot-reload
```

Vai abrir algo como `http://localhost:5173`. Qualquer alteração
nos arquivos `.jsx` atualiza a página na hora.

Pra gerar a versão de produção manualmente (opcional, o GitHub
Actions já faz isso sozinho):

```bash
npm run build     # gera a pasta dist/
npm run preview   # testa a versão de produção localmente
```

## Deploy (Vercel)

O projeto está configurado pra Vercel (`vercel.json` na raiz). Não
precisa ajustar `base` no `vite.config.js` — na Vercel o site fica
na raiz do domínio, então `base: '/'` já está correto e não deve
ser mudado.

1. No painel da Vercel: **Add New → Project → Import** o
   repositório do GitHub.
2. A Vercel detecta Vite sozinha e usa as configs do `vercel.json`
   (`npm run build`, saída em `dist/`). Não precisa mexer em nada
   na tela de configuração.
3. A cada `git push` na branch principal, a Vercel builda e publica
   automaticamente. Deploys de outras branches viram "preview"
   automáticos também.

## Por que React + build real (e não mais o Tailwind via CDN)?

A versão anterior usava Tailwind CDN, que gera as classes CSS
**dinamicamente no navegador**. Isso causou o bug da fonte Pricedown
não aparecer: se o script do CDN atrasasse ou falhasse, as classes
nunca eram criadas. Com Tailwind **compilado no build** (o que este
projeto faz), o CSS final já sai pronto, testado e nunca depende de
JavaScript de terceiros carregando em tempo real — mais rápido e
muito mais confiável.

## Tailwind CSS

Tema centralizado em `tailwind.config.js`: cores (`asphalt`,
`neon-purple`, `hood-green`, `brodis-blue`, `paper`, `warn-yellow`),
fontes (`font-display` = Pricedown, `font-body` = Oswald) e as
animações customizadas (flicker do título, barra de load, equalizador
do toast, etc). O `src/index.css` só contém o que Tailwind não
resolve como utilitário: o `@font-face` da Pricedown e os efeitos de
vinheta/scanline/cross-fade da intro.

## Componentes React

Cada seção do site é um componente isolado em `src/components/`.
A lógica de áudio (tocar intro, trocar pra música do menu, mute)
fica isolada em `src/hooks/useAudioPlayer.js` — um hook customizado
que qualquer componente pode consumir sem reimplementar a lógica.

A lista de personagens em `src/data/roster.js` é só um array — pra
adicionar, remover ou renomear um personagem, edite esse arquivo
(não precisa mexer no componente `Characters.jsx`).

## Como a música funciona

- Ao abrir o site, toca **Intro Grande Theft Brodis (Remix)**
  durante a tela de carregamento/slideshow.
- Quando a intro termina (barra de load completa, música acaba,
  ou clique em "Pular"), a intro some e entra **Brodis Street 4**
  em loop, como tema do menu/site.
- Aparece um aviso "TOCANDO AGORA · Menu Theme" que some sozinho
  depois de alguns segundos (a música continua).
- Botão de som (🔊/🔇) fixo na intro, útil quando o navegador
  bloqueia autoplay com som antes de qualquer interação do usuário.

## Status do jogo

Editável em dois componentes:
- `src/components/StatusBar.jsx` — barra amarela fixa no topo.
- `src/components/PlaySection.jsx` — selo + aviso na seção final.

Quando o jogo sair da alpha fechada, atualize o texto nesses dois
arquivos e, se quiser, troque o aviso "indisponível" por um botão
de verdade apontando pro link do Roblox.

## Personalizando

- **Cores/fontes/animações**: tudo em `tailwind.config.js`.
- **Capa oficial (`capa.jpg`)**: quando tiver o arquivo, salve em
  `src/assets/images/capa.jpg`, importe no componente desejado
  (ex: `import capa from '../assets/images/capa.jpg'`) e use como
  preferir — hero, seção própria, ou meta tag de compartilhamento.
- **Fotos da intro**: hoje usa `scene1.png` e `scene2.png` dentro
  de `src/assets/images/`. Pra trocar, sobrescreva esses arquivos
  (mesmo nome) ou edite os imports no topo de
  `src/components/Intro.jsx`.
- **Roleta de personagens**: imagem em
  `src/assets/images/characters-wheel.png`. Nomes dos personagens
  em `src/data/roster.js`.

## Elenco / Personagens

Cada personagem é um objeto em `src/data/roster.js`:

```js
{
  id: '01',
  slug: 'rick',                 // usado na URL: /personagem/rick
  name: 'Rick',
  tag: 'Torcedor do Leão 1918',
  photos: [rickPhoto],          // galeria da bio — pode ter várias fotos
  effect: null,                  // ou 'alive' pro efeito de respiração
  theme: '#8f13eb',              // cor de destaque na ficha do personagem
  musicFile: 'rick-theme.mp3',   // nome do arquivo de música tema (veja abaixo)
  bio: 'Texto de história do personagem...',
  stats: [
    { label: 'Estilo', value: 'Discreto & Elegante' },
    { label: 'Arma Preferida', value: 'Pistola' },
    // adicione quantos quiser
  ],
}
```

Elenco atual: **Rick**, **Dragon**, **GTA2D**, **Fotafox**.

### Clicar no card abre a ficha do personagem

Cada card na seção Personagens agora leva pra uma página dedicada
em `/personagem/<slug>` (ex: `/personagem/rick`), com:
- Foto grande de fundo, hero temático na cor do personagem
- Texto de história (`bio`)
- Galeria de fotos (se o personagem tiver mais de uma em `photos`)
- Ficha de atributos (`stats`)
- Música tema própria do personagem tocando em loop (se o arquivo
  já existir — veja a seção seguinte)

Pra adicionar um personagem novo ao elenco: salve a foto em
`src/assets/images/`, importe no topo de `src/data/roster.js` e
adicione um objeto novo no array `roster` com todos os campos
acima. O card e a página de bio aparecem automaticamente — não
precisa mexer em `Characters.jsx` nem `CharacterBio.jsx`.

### Músicas dos personagens — nomes de arquivo esperados

Cada personagem tem sua própria música tema, tocada em loop na
página da bio dele. **Os arquivos ainda não existem no projeto** —
quando você criar cada uma, salve com o nome exato abaixo dentro de
`src/assets/character-music/`:

| Personagem | Nome do arquivo esperado |
|---|---|
| Rick | `rick-theme.mp3` |
| Dragon | `dragon-theme.mp3` |
| GTA2D | `gta2d-theme.mp3` |
| Fotafox | `fotafox-theme.mp3` |

Não precisa importar nem editar nenhum componente — o arquivo é
descoberto automaticamente pelo nome (`import.meta.glob` em
`src/data/characterMusic.js`). Enquanto um arquivo ainda não
existir, a bio daquele personagem funciona normalmente, só não
toca música (aparece um aviso discreto "Tema musical ainda não
disponível" no lugar).

Se quiser usar um nome de arquivo diferente do sugerido, é só
trocar o valor de `musicFile` no personagem correspondente em
`src/data/roster.js`.

### Sistema de tema por personagem

O campo `theme` (cor em hex) de cada personagem já tem efeito
visual real na página de bio — controla a cor do nome, da tag e do
brilho do hero. No card da seção Personagens, ele também define a
cor do botão "Ver Ficha" que aparece no hover.

## Redes sociais e aba "Quadro" (em breve)

**Redes sociais** (Discord e Roblox, ícones no footer): como ainda
não têm link real, clicar em qualquer um mostra uma mensagem de
erro discreta no rodapé da tela (estilo aviso de sistema, não uma
caixa grande) que some sozinha depois de alguns segundos. Isso é o
componente `src/components/ErrorToast.jsx`, e as mensagens de cada
rede ficam no objeto `SOCIAL_ERRORS` dentro de `src/App.jsx`.

**Quando tiver o link real do Discord ou Roblox:** troque o
`onClick={() => onSocialClick('Discord')}` (ou `'Roblox'`) em
`src/components/Footer.jsx` por um `<a href="...">` normal.

**Aba Quadro** (no menu): continua usando o modal maior
`ComingSoonModal.jsx` (controlado por `useComingSoon.js`), já que é
uma seção inteira do site, não um link externo. Quando estiver
pronta, troque o `<button onClick={onQuadroClick}>` em
`src/components/Header.jsx` por um link de verdade.

## Duração e estilo da intro


A intro agora dura cerca de **1 minuto** (60 segundos), com um
slideshow mais lento entre as fotos (troca a cada 4.5s) — dá o
clima de tela de abertura/créditos, estilo Rockstar, em vez de um
loading screen rápido. A logo completa (`LogoFull`, "grand theft
BRODIS") aparece grande no centro, com leve efeito de flicker.

Pra ajustar a duração ou a velocidade do slideshow, edite as
constantes no topo de `src/components/Intro.jsx`:

```js
const SLIDE_INTERVAL_MS = 4500  // troca de imagem a cada X ms
const INTRO_DURATION_MS = 60000 // duração total da intro em ms
```

## Logo GTB

Duas versões da logo, feitas em SVG (não são mais imagem estática),
reproduzindo a arte de referência do "grand theft BRODIS":

- **`src/components/LogoFull.jsx`** — logo completa "grand theft
  BRODIS", com "grand theft" em branco/contorno preto e "BRODIS"
  usando as cores exatas amostradas pixel a pixel da arte de
  referência original: B=verde, R=azul, O=verde, D=roxo, I=verde,
  S=branco (`#52db0f`, `#0016f5`, `#8f13eb`, também disponíveis
  como `logo-green`/`logo-blue`/`logo-purple` no Tailwind). Usada
  no Hero e nos créditos de abertura da Intro.
- **`src/components/LogoGTB.jsx`** — versão curta, só "GTB", roxo
  com contorno verde. Usada no Header, na Intro e na tela de
  Manutenção.

Ambas usam a fonte Pricedown (herdada do `@font-face` do
`src/index.css`) e são vetoriais — escalam sem perder qualidade em
qualquer tamanho. Pra usar em outro lugar do site:

```jsx
import LogoFull from './components/LogoFull'
import LogoGTB from './components/LogoGTB'

<LogoFull className="w-96" />
<LogoGTB className="h-12" />
```

## Sistema de rádio (modular)

A rádio é uma seção normal da página (`#radio`, linkada no menu),
com um player completo: trocar de estação, pular pra próxima ou
faixa anterior, barra de progresso clicável, tudo sempre visível e
funcionando a qualquer momento — mesmo com uma música já tocando.

**Adicionar música é só soltar o arquivo — não precisa editar
nenhum componente.** As faixas de cada estação são descobertas
automaticamente pelo Vite (`import.meta.glob`) direto das pastas em
`src/assets/radio/<nome-da-estação>/`, sem limite de quantidade
(1, 10, 30 músicas por pasta — tanto faz).

- **Pra adicionar uma música a uma estação que já existe:** solte o
  `.mp3` dentro da pasta da estação (ex:
  `src/assets/radio/los-brodis/nova-musica.mp3`). Pronto — o player
  já mostra "Faixa X de Y" atualizado e os botões de pular
  (⏮ ⏭) já funcionam pra ela.
- **Pra criar uma estação nova:** crie uma pasta em
  `src/assets/radio/`, coloque pelo menos um `.mp3` dentro, e
  adicione uma linha em `src/data/radioConfig.js` com o nome da
  pasta, nome de exibição e gênero. É o único arquivo que você
  precisa tocar — nenhum componente muda.
- Pastas sem nenhum `.mp3` são ignoradas automaticamente (não
  aparecem na rádio, não quebram nada).

**Controles do player:**
- **◀ ▶** no topo trocam de estação (volta pra primeira faixa da
  nova estação, continua tocando se já estava tocando)
- Bolinhas abaixo do nome da estação também trocam direto pra
  qualquer estação com um clique
- **⏮ ⏭** pulam pra faixa anterior/próxima dentro da mesma estação
  (ficam desabilitados, mas visíveis, se a estação só tiver 1
  faixa)
- Quando uma faixa termina sozinha, já toca a próxima
  automaticamente
- Barra de progresso é clicável — clique em qualquer ponto dela pra
  pular pra aquele momento da música

A rádio nunca toca ao mesmo tempo que o Menu Theme — quando você dá
play numa estação, o tema do menu para sozinho (coordenado via
`pauseMenuTrack` do `useAudioPlayer`).

## Modo manutenção

Pra tirar o site do ar rapidamente (sem intro, sem som, só um aviso
de manutenção), abra `src/App.jsx` e mude:

```js
const IN_MAINTENANCE = false
```

para

```js
const IN_MAINTENANCE = true
```

Com isso ativo, nenhum hook de áudio ou intro chega a rodar — só a
`MaintenanceScreen` aparece, com um card explicando a instabilidade,
um painel de status dos serviços (editável em
`src/components/MaintenanceScreen.jsx`, no array `SERVICOS`) e um
botão de recarregar.

## Navegação (React Router)

O site agora tem duas rotas:
- **`/`** — página inicial, com intro, hero, lista de personagens,
  rádio, patch notes, etc.
- **`/personagem/:slug`** — ficha completa de um personagem (ex:
  `/personagem/rick`, `/personagem/dragon`).

Isso usa `react-router-dom` (`<BrowserRouter>` envolvendo tudo em
`src/main.jsx`, e `<Routes>`/`<Route>` dentro de `src/App.jsx`). O
`vercel.json` já está configurado com um rewrite genérico
(`/(.*)  → /index.html`) pra que recarregar a página numa URL de
personagem funcione direto na Vercel, sem dar 404.

A Intro só roda na rota `/` — ela não aparece de novo quando o
visitante entra numa ficha de personagem e volta.

## Efeitos 3D e consistência visual

**Cores de título:** todo texto que usa a fonte Pricedown
(`font-display`) no site inteiro agora usa exclusivamente as
cores exatas da logo oficial (`text-logo-green`, `text-logo-blue`,
`text-logo-purple`, definidas em `tailwind.config.js`) combinadas
com as classes `.text-3d-green`/`.text-3d-purple` do
`src/index.css`, que dão a sombra em camadas. Antes, alguns
componentes usavam variações levemente diferentes de verde/roxo
(`hood-green`, `neon-purple`) nos títulos, o que criava
inconsistência visual entre seções — isso foi padronizado.

**Efeito 3D em cards e painéis:** três classes utilitárias novas em
`src/index.css`, reutilizáveis em qualquer componente:
- **`.char-card`** — inclinação 3D leve (`rotateX`/`rotateY`) e
  elevação com sombra colorida no hover, usando a cor `theme` do
  personagem. Usada nos cards da seção Personagens e nas fotos da
  galeria da bio.
- **`.panel-3d`** — sombra em camadas que dá sensação de painel
  "flutuando" sobre a página. Usada nos modais, no painel da rádio,
  na ficha de atributos da bio.
- **`.btn-3d`** — relevo físico nos botões (sombra sólida embaixo
  que "afunda" no clique). Usada nos CTAs principais do site.

## Acesso ao site

O site não tem mais nenhuma tela de "chave de acesso" — é aberto
para qualquer visitante. Se um sistema de acesso restrito for
necessário no futuro, vale lembrar que qualquer chave guardada só
no código JavaScript do front-end fica visível para qualquer
visitante que abrir o "Ver código-fonte" do navegador — não seria
uma restrição de verdade, só uma barreira decorativa. Uma
restrição real precisaria de alguma validação no servidor.

## ⚠️ Trocar a URL placeholder antes de publicar

Várias tags de SEO/Open Graph usam a URL provisória
`https://gtb-site.vercel.app/` — troque pela URL real do seu
projeto assim que souber. Está em 4 lugares:
- `index.html`: `<link rel="canonical">`, `<meta property="og:image">`,
  `<meta name="twitter:image">`
- `public/robots.txt`: linha `Sitemap:`
- `public/sitemap.xml`: todas as tags `<loc>`

## Favicon

Favicon feito a partir da arte real da logo GTB (o arquivo que você
adicionou em `src/assets/images/23_Sem_Titulo_20260709140216.png`),
recortada e aplicada sobre um fundo escuro arredondado, em três
tamanhos:
- `public/favicon.png` (512×512) — ícone principal, usado pela
  maioria dos navegadores modernos
- `public/favicon-32.png` — versão pequena, para a aba do navegador
- `public/apple-touch-icon.png` — ícone ao salvar o site na tela
  inicial de iPhone/iPad
- `public/favicon.svg` — mantido como fallback simples (texto
  "GTB" estilizado), usado apenas por navegadores muito antigos que
  não leem PNG como favicon

Pra trocar por uma versão nova no futuro (ex: quando tiver a arte
oficial definitiva), salve a imagem em
`src/assets/images/` e me avise, ou gere você mesmo os três
tamanhos e substitua os arquivos em `public/` mantendo os mesmos
nomes.

## SEO básico

- **Open Graph + Twitter Card** no `index.html`: título, descrição
  e imagem de capa (`public/og-image.jpg`) aparecem automaticamente
  ao compartilhar o link do site no Discord, WhatsApp, Twitter/X,
  etc.
- **`public/og-image.jpg`** é um placeholder gerado a partir de uma
  das artes do site — troque pela capa oficial (`capa.jpg`) quando
  ela estiver pronta. Tamanho recomendado: 1200×630px.
- **Título dinâmico por página**: a home usa "GTB — Grande Theft
  Brodis"; cada ficha de personagem usa "Nome — GTB" (ex: "Rick —
  GTB"), controlado pelo hook `src/hooks/usePageTitle.js`.
- **`public/robots.txt`** e **`public/sitemap.xml`**: permitem que
  buscadores indexem o site e conheçam todas as páginas (home + as
  4 fichas de personagem). Se adicionar mais personagens depois,
  adicione a URL correspondente no `sitemap.xml` também.

## Analytics

Usa `@vercel/analytics`, que já vem pronto pra funcionar assim que
o site for publicado na Vercel — não precisa criar conta em nenhum
serviço externo nem configurar nada além de já estar deployado lá.
Os dados aparecem direto no painel do projeto na Vercel, aba
"Analytics".

## Loading state nas imagens

Todas as imagens de personagem (cards da Home, galeria da bio,
enquete) usam o componente `src/components/LoadingImage.jsx`: mostra
um skeleton pulsante na cor de destaque do personagem enquanto a
imagem carrega, e faz um fade suave assim que ela aparece — evita o
"pulo" de layout e a sensação de site travado em conexões lentas.

Uso: `<LoadingImage src={foto} alt="..." className="..." accentColor={char.theme} />`

## Sistema de votação — "Qual o melhor personagem?"

Nova seção na home (`src/components/CharacterPoll.jsx`) onde
qualquer visitante vota no personagem favorito. Um voto por pessoa
(controlado por `localStorage` no navegador — a pessoa não consegue
votar de novo no mesmo navegador, mas nada impede votar de novo
limpando o navegador ou usando outro).

### ⚠️ Passo obrigatório: criar o banco de dados na Vercel

A votação real (contando os votos de **todo mundo**, não só do seu
próprio navegador) depende da **Vercel KV**, um banco de dados que
precisa ser criado uma vez no painel da Vercel — sem isso, a
enquete aparece na tela mas mostra um aviso de "indisponível no
momento" (o site não quebra, só a votação fica sem funcionar).

**Passo a passo (só precisa fazer uma vez):**
1. No painel da Vercel, abra o projeto do GTB
2. Vá em **Storage** → **Create Database** → escolha **KV**
   (Redis-compatible)
3. Dê um nome (ex: `gtb-votes`) e crie
4. A Vercel pergunta se quer conectar esse banco ao projeto —
   confirme que sim (isso adiciona as variáveis de ambiente
   necessárias automaticamente, não precisa copiar nada na mão)
5. Faça um novo deploy (um `git push` qualquer já dispara) pra essas
   variáveis serem aplicadas

Depois disso a votação passa a funcionar de verdade, com o placar
valendo pra todo mundo que acessa o site.

### Como funciona por dentro

- **`api/vote.js`** — recebe o voto (`POST /api/vote` com
  `{ slug: 'rick' }`), incrementa o contador daquele personagem no
  banco, devolve o total atualizado
- **`api/votes.js`** — devolve o placar atual de todos os
  personagens (`GET /api/votes`)
- **`src/hooks/usePoll.js`** — hook que busca o placar ao carregar a
  página, envia o voto, e atualiza a tela imediatamente (sem
  esperar resposta do servidor) pra parecer instantâneo
- Só os 4 slugs válidos (`rick`, `dragon`, `gta2d`, `fotafox`) são
  aceitos pela API — qualquer outro valor é rejeitado, pra evitar
  poluir o banco com votos inventados

Pra adicionar um personagem novo à enquete: já é automático, os
componentes leem a lista direto do `roster.js`. Só é preciso
adicionar o novo `slug` no array `VALID_SLUGS` dentro de
`api/vote.js` e `api/votes.js` — sem isso, a API rejeita votos pra
esse personagem por segurança.

### Testando a votação localmente

Rodando só `npm run dev` (Vite puro), as rotas `/api/vote` e
`/api/votes` não existem — isso é esperado, o Vite não sabe rodar
serverless functions da Vercel sozinho. A enquete aparece na tela
normalmente, mas mostra o aviso de indisponível (comportamento
seguro, não quebra nada). Pra testar a votação de verdade no seu
PC antes de publicar, use `vercel dev` no lugar de `npm run dev`
(precisa instalar a Vercel CLI: `npm i -g vercel`, depois `vercel
login` uma vez). Sem isso, o jeito mais simples é só testar depois
de já ter feito o deploy real.

## Aba de Trailer

Seção com a prévia dos 4 personagens em modelo Roblox
(`src/assets/images/trailer-img.png`), marcada com o selo "Em
Breve" logo abaixo — já linkada no menu (`#trailer`). Quando o
vídeo real estiver pronto, edite
`src/components/TrailerSection.jsx` e substitua a `<img>` por um
`<video>` ou embed do YouTube/etc, e pode remover o selo "Em Breve"
nessa hora.

## Scroll reveal (entrada suave das seções)

Cada seção da home (Personagens, Rádio, Enquete, Trailer, Patch
Notes, Bora pra Rua) agora aparece com um fade + leve deslocamento
suave ao rolar a página até ela, em vez de simplesmente já estar
visível desde o carregamento. Isso é feito pelo componente
`src/components/Reveal.jsx`, que usa o `whileInView` do próprio
Framer Motion (baseado em `IntersectionObserver` por baixo dos
panos, com física de mola em vez de curva de easing fixa).

Pra aplicar esse efeito em uma seção nova, basta envolver ela:
```jsx
<Reveal><MinhaSecaoNova /></Reveal>
```

A página de bio do personagem (`CharacterBio.jsx`) também ganhou
uma entrada suave (fade) ao navegar até ela, pra substituir o corte
seco que tinha antes.
