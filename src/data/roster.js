import rickPhoto from '../assets/images/char-rick.png'
import raf3Photo from '../assets/images/char-raf-3.png'
import gta2dPhoto from '../assets/images/char-gta2d.png'
import foxPhoto from '../assets/images/char-fox.png'

// ============================================================
// COMO ADICIONAR MAIS FOTOS A UM PERSONAGEM (passo a passo)
// ============================================================
// O array `photos` de cada personagem aceita quantas fotos você
// quiser — não é preciso mudar nenhum componente, a galeria da
// bio já se ajusta sozinha (2 fotos por linha, tanto no PC quanto
// no celular).
//
// 1. Salve a foto nova dentro de src/assets/images/
//    (ex: rick-foto2.png)
//
// 2. Adicione um import aqui em cima, junto dos outros:
//      import rickFoto2 from '../assets/images/rick-foto2.png'
//
// 3. Lá embaixo, ache o personagem certo e adicione a variável
//    nova dentro do array `photos`:
//      photos: [rickPhoto, rickFoto2],
//
// Pronto — a galeria na bio do personagem já mostra as duas fotos
// automaticamente, com clique pra trocar a foto de fundo do topo.
// Pode repetir esse processo pra quantas fotos quiser por
// personagem.
// ============================================================

/**
 * Cada personagem tem um array `photos` — a galeria da bio mostra
 * todas elas. Hoje a maioria tem só 1, mas é só adicionar mais
 * itens no array que a galeria da página de bio já exibe todas
 * automaticamente (não precisa mexer em nenhum componente).
 *
 * Pra adicionar uma foto nova a um personagem que já existe:
 * 1. Salve o arquivo em src/assets/images/
 * 2. Importe no topo deste arquivo (ex: import fotoNova from '...')
 * 3. Adicione `fotoNova` no array `photos` do personagem
 *
 * `slug` é o identificador usado na URL da bio
 * (ex: /personagem/rick). Precisa ser único, minúsculo, sem espaço.
 *
 * `bio` é o texto de história/sinopse mostrado na página do
 * personagem.
 *
 * `stats` é uma lista livre de atributos estilo "ficha de
 * personagem" (rótulo + valor) — pode ter quantos quiser, aparecem
 * na ordem em que estão no array.
 *
 * `musicFile` é só o NOME do arquivo de música tema do personagem.
 * O arquivo em si não existe ainda no projeto — veja o README na
 * seção "Músicas dos personagens" pra saber onde colocar cada um.
 * Enquanto o arquivo não existir, a bio mostra normalmente mas sem
 * tocar música (sem quebrar nada).
 *
 * `heroPosition` (opcional) ajusta o enquadramento da foto grande
 * de fundo na página de bio do personagem — usa a mesma sintaxe do
 * CSS `background-position` (ex: `'center 8%'`, `'center top'`).
 * Se não definir, usa `'center 15%'` como padrão. Só precisa
 * mexer nisso se a foto de algum personagem aparecer cortada
 * (cabeça sumindo, por exemplo) — geralmente acontece quando a
 * foto tem proporção bem diferente das outras.
 */
export const roster = [
  {
    id: '01',
    slug: 'rick',
    name: 'Rick',
    tag: 'Torcedor do Leão 1918',
    photos: [rickPhoto],
    effect: null,
    theme: '#8f13eb',
    musicFile: 'rick-theme.mp3',
    bio: 'Rick é o cara de terno que ninguém sabe se é segurança, advogado ou o próprio dono do banco. Fala pouco, resolve rápido — e sempre com um sorriso torto de quem já viu de tudo em Los Brodis.',
    stats: [
      { label: 'Estilo', value: 'Discreto & Elegante' },
      { label: 'Time do Coração', value: 'Fortaleza' },
      { label: 'Arma Preferida', value: 'Deagle Gold' },
      { label: 'Nível de Perigo', value: '★★★☆☆' },
    ],
  },
  {
    id: '02',
    slug: 'dragon',
    name: 'Dragon',
    tag: 'As vezes homem de terno, as vezes Moicano',
    photos: [raf3Photo],
    heroPosition: 'center 8%', // a foto dele é mais alta, "center 15%" cortava o rosto
    effect: 'alive',
    theme: '#52db0f',
    musicFile: 'dragon-theme.mp3',
    bio: 'Dragon vive entre dois mundos: um dia é o executivo discreto de terno fechado, no outro é o moicano com máscara que ninguém quer encontrar num beco escuro. Ninguém sabe ao certo qual dos dois é o disfarce.',
    stats: [
      { label: 'Estilo', value: 'Imprevisível' },
      { label: 'Apelido', value: 'Moicano' },
      { label: 'Arma Preferida', value: 'AK-47 Gold' },
      { label: 'Nível de Perigo', value: '★★★★★' },
    ],
  },
  {
    id: '03',
    slug: 'gta2d',
    name: 'GTA2D',
    tag: 'Terno & Cabelo Azul',
    photos: [gta2dPhoto],
    effect: null,
    theme: '#0016f5',
    musicFile: 'gta2d-theme.mp3',
    bio: 'no GTA eu sou foda não tenta me matar quando estou com meu trio a chacina vai rolar.',
    stats: [
      { label: 'Estilo', value: 'Executivo' },
      { label: 'Marca Registrada', value: 'Cabelo Azul' },
      { label: 'Arma Preferida', value: 'Graveto' },
      { label: 'Nível de Perigo', value: '★★★★☆' },
    ],
  },
  {
    id: '04',
    slug: 'fotafox',
    name: 'Fotafox',
    tag: 'O Homem Uva',
    photos: [foxPhoto],
    effect: null,
    theme: '#8f13eb',
    musicFile: 'fotafox-theme.mp3',
    bio: 'Maluco Mora dentro do esgoto é pobre e não tem ninguém pra contar inicialmente, ninguém sabe realmente como que sua pele se tornou roxa, mas foda-se porque junto a seus parceiros ele quer dominar essa cidade. suas habilidades são uma durabilidade totalmente fora do normal, força e uma percepção de quem pode manipular ou não.',
    stats: [
      { label: 'Estilo', value: 'Caótico' },
      { label: 'Marca Registrada', value: 'Galão de Gasolina' },
      { label: 'Arma Preferida', value: 'Isqueiro' },
      { label: 'Nível de Perigo', value: '★★★★★' },
    ],
  },
]
