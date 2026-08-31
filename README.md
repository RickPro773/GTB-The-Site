# GTB — Grande Theft Brodis (site oficial)

Site do jogo GTB, construído com **React + Vite + Tailwind CSS +
Framer Motion**, com deploy automático pra **Vercel**.

## 🚨 Deu erro no `npm run build`? Leia isto primeiro

Se aparecer um erro tipo `Cannot find module
@rollup/rollup-linux-x64-gnu` (ou qualquer erro mencionando
`@rollup/rollup-...`), **não é bug no código do site** — é um
bug conhecido do próprio npm com pacotes opcionais, que acontece
quando a pasta `node_modules` é copiada/zipada de um computador
pra outro em vez de instalada do zero em cada lugar.

**Correção (funciona sempre):**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Regra geral pra evitar isso de novo:** nunca copie a pasta
`node_modules` entre computadores (nem dentro de um `.zip` do
projeto). Ela é sempre gerada de novo rodando `npm install`.

## 🎬 Estado atual do projeto (leia antes de mexer)

O site passou por uma reorganização grande: **os sistemas de
conta/login, blog e chat foram removidos por completo** (código,
endpoints de API, e schema de banco) — não é só uma tela escondida,
foi decisão de produto de não usar isso por enquanto. Se um dia
quiser esses sistemas de volta, seria um projeto novo a partir do
zero, não uma reativação (o código foi deletado, não só ocultado).

**A rádio foi desativada mas as músicas continuam no projeto**,
guardadas pra uma reativação futura — veja a seção "Rádio (arquivos
preservados)" mais abaixo.

**O que existe e está ativo hoje:**
- Countdown em tela cheia (tela de "chegando em breve")
- Intro com slideshow + música
- Hero, seção de Personagens (com fichas individuais), Enquete de
  personagem favorito, Trailer, Patch Notes, seção final
- Sistema de votos (`/api/vote`, `/api/votes`) via Vercel KV —
  esse é o único endpoint de backend que sobrou

## Countdown

O site inteiro fica coberto por uma tela de contagem regressiva
até uma data/hora marcada no código — é a ÚNICA coisa visível
enquanto o tempo não zera. O resto do site (Hero, Personagens,
etc) já carrega por baixo o tempo todo, só fica escondido atrás do
countdown; assim, quando o tempo zera, a transição é instantânea.

**Pra mudar a data/hora alvo:** edite a constante `TARGET_DATE` no
topo de `src/components/Countdown.jsx`:
```js
const TARGET_DATE = new Date('2026-09-15T20:00:00-03:00')
```
Formato: `AAAA-MM-DDTHH:MM:SS-03:00` (o `-03:00` é o fuso de
Brasília — ajuste se quiser outro fuso).

**Pra testar o site sem esperar o countdown zerar:** abra
`src/App.jsx` e troque:
```js
const COUNTDOWN_ENABLED = true
```
para `false`. Lembre de voltar pra `true` antes de publicar de
verdade, se ainda não for a hora de revelar o site.

## Rádio (arquivos preservados, sistema desativado)

O player de rádio (componente, config, endpoints) foi removido do
site, mas **as músicas continuam guardadas** em
`src/assets/radio/` e `src/assets/radio-ads/` (12 arquivos ao
todo), prontas pra quando você quiser reativar ou reconstruir esse
sistema no futuro. Nenhum código hoje referencia esses arquivos —
eles só estão parados na pasta esperando.

## Estrutura de pastas

```
gtb-site/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── vercel.json
├── postcss.config.js
├── api/
│   ├── vote.js          (registra voto de personagem — Vercel KV)
│   └── votes.js         (lê o placar de votos — Vercel KV)
├── public/
│   ├── favicon.png / favicon-32.png / apple-touch-icon.png / favicon.svg
│   ├── og-image.jpg     (capa ao compartilhar o link)
│   ├── robots.txt
│   └── sitemap.xml
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/       (ver lista abaixo)
    ├── hooks/
    │   ├── useAudioPlayer.js
    │   ├── useComingSoon.js
    │   ├── usePageTitle.js
    │   └── usePoll.js
    ├── data/
    │   ├── roster.js         (dados dos 4 personagens)
    │   └── characterMusic.js (descoberta automática de música-tema por personagem)
    └── assets/
        ├── images/  (fotos dos personagens, cenas da intro, wheel, trailer)
        ├── audio/   (intro-theme.mp3, menu-theme.mp3)
        ├── radio/       (preservado, sem uso ativo)
        └── radio-ads/   (preservado, sem uso ativo)
```

## Como rodar no seu PC

Precisa ter o **Node.js** instalado (versão 18 ou mais recente).

```bash
cd gtb-site
npm install       # instala as dependências (só precisa fazer 1x)
npm run dev       # abre servidor local com hot-reload
```

Pra gerar a versão de produção manualmente (opcional, a Vercel já
faz isso sozinha a cada push):
```bash
npm run build
npm run preview
```

## Deploy (Vercel)

1. No painel da Vercel: **Add New → Project → Import** o
   repositório do GitHub.
2. A Vercel detecta Vite sozinha e usa as configs do `vercel.json`.
   Não precisa mexer em nada na tela de configuração.
3. A cada `git push` na branch principal, a Vercel builda e publica
   automaticamente.

## Variáveis de ambiente

Hoje o único sistema que depende de variável de ambiente é o de
votos, que usa **Vercel KV** — crie pelo painel (**Storage → Create
Database → KV**) e conecte ao projeto; a variável necessária é
criada sozinha, não precisa copiar nada na mão.

## Componentes principais

- **`Countdown.jsx`** — tela de contagem regressiva (ver seção acima)
- **`Intro.jsx`** — slideshow de imagens + música de abertura,
  aparece só na home, depois do countdown zerar
- **`Hero.jsx`** — seção principal com a logo grande
- **`Characters.jsx`** — grade de cards do elenco, leva pra
  `CharacterBio.jsx` (ficha individual de cada personagem)
- **`CharacterPoll.jsx`** — enquete "qual o melhor personagem",
  usa `/api/vote` e `/api/votes`
- **`TrailerSection.jsx`** — prévia dos personagens em modelo
  Roblox, com selo "Em Breve"
- **`PatchNotes.jsx`** — modal com histórico de versões
- **`PlaySection.jsx`** — seção final com status do jogo
- **`MaintenanceScreen.jsx`** — tela de manutenção (ativada via
  `IN_MAINTENANCE` em `App.jsx`, tem prioridade sobre o countdown)
- **`Reveal.jsx`** — wrapper de entrada suave (fade + leve
  deslocamento) ao rolar até uma seção, usando Framer Motion
- **`ExperimentalBadge.jsx`** — selo indicando que o site está em
  desenvolvimento ativo

## Elenco / Personagens

Cada personagem é um objeto em `src/data/roster.js`, com `slug`
(usado na URL `/personagem/<slug>`), `photos` (array — pode ter
várias fotos, a galeria da bio se ajusta sozinha), `bio`, `stats`
(ficha de atributos), `musicFile` (nome do arquivo de tema
individual, descoberto automaticamente se existir em
`src/assets/character-music/`), e `heroPosition` (opcional, ajusta
o enquadramento da foto grande na bio se ela aparecer cortada).

Elenco atual: **Rick**, **Dragon**, **GTA2D**, **Fotafox**.

## Sistema de votação

`CharacterPoll.jsx` + o hook `usePoll.js` conversam com
`api/vote.js` (registra) e `api/votes.js` (lê o placar), ambos
usando Vercel KV. Um voto por navegador (controlado via
`localStorage`, não impede voto duplicado entre navegadores
diferentes).

## Logo GTB

`LogoFull.jsx` (logo completa "grand theft BRODIS") e `LogoGTB.jsx`
(versão curta "GTB") são SVG puro com as cores exatas amostradas da
arte de referência oficial: B=verde, R=azul, O=verde, D=roxo,
I=roxo, S=roxo (`#52db0f`, `#0016f5`, `#8f13eb`).
