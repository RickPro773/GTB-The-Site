# GTB — Grande Theft Brodis (site oficial)

Site do jogo GTB, construído com **React + Vite + Tailwind CSS**
(build real, não CDN), com deploy automático pro GitHub Pages via
**GitHub Actions**.

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

## ⚠️ Passo obrigatório antes de subir: ajustar o "base"

Abra `vite.config.js` e confira a linha `base:`. Ela precisa bater
com o nome exato do seu repositório no GitHub:

- Se o repositório se chama `gtb-site` e a URL final vai ser
  `https://seuusuario.github.io/gtb-site/` → deixe
  `base: '/gtb-site/'` (já vem configurado assim).
- Se o repositório se chama `seuusuario.github.io` (site pessoal
  na raiz) → troque para `base: '/'`.

Se esquecer esse passo, o site builda mas as imagens/CSS/JS não
carregam quando publicado (ficam todos com 404).

## Como publicar (deploy automático)

1. Crie o repositório no GitHub (ex: `gtb-site`).
2. `git init`, `git add .`, `git commit`, `git remote add origin ...`,
   `git push -u origin main` (veja o histórico da conversa se
   precisar relembrar os comandos exatos).
3. No repositório do GitHub, vá em **Settings → Pages** e em
   "Build and deployment" escolha **Source: GitHub Actions**
   (não escolha "Deploy from a branch").
4. Pronto. A cada `git push` na branch `main`, o workflow em
   `.github/workflows/deploy.yml` builda o projeto (Tailwind incluso)
   e publica sozinho. Acompanhe o progresso na aba **Actions** do
   repositório.
5. Depois do primeiro deploy, o site fica em
   `https://seuusuario.github.io/gtb-site/`.

Você não precisa mais rodar `npm run build` manualmente nem subir
uma pasta `dist/` — o Actions faz isso a cada push.

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
