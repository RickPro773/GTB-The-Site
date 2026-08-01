import rickPhoto from '../assets/images/char-rick.png'
import raf3Photo from '../assets/images/char-raf-3.png'
import gta2dPhoto from '../assets/images/char-gta2d.png'
import foxPhoto from '../assets/images/char-fox.png'

/**
 * Cada personagem tem um array `photos` (não uma foto única).
 * Isso é o que deixa o sistema modular: se o personagem tem só
 * 1 foto, o card mostra ela parada. Se tiver 2+ fotos, ao clicar
 * no card ele troca entre elas com uma transição suave (crossfade),
 * sem precisar mexer em nenhum componente — é só adicionar mais
 * itens no array `photos` de qualquer personagem aqui embaixo.
 *
 * Pra adicionar uma foto nova a um personagem que já existe:
 * 1. Salve o arquivo em src/assets/images/
 * 2. Importe no topo deste arquivo (ex: import fotoNova from '...')
 * 3. Adicione `fotoNova` no array `photos` do personagem
 * Pronto — o card já mostra e a transição já funciona sozinha.
 *
 * `theme` é reservado pro sistema de tema por personagem que ainda
 * vai ser implementado (cores/paleta que mudam quando o personagem
 * está "selecionado" em algum lugar do site). Por ora só guarda a
 * cor de destaque de cada um, sem efeito visual ainda.
 */
export const roster = [
  {
    id: '01',
    name: 'Rick',
    tag: 'Torcedor do Leão 1918',
    photos: [rickPhoto],
    effect: null,
    theme: '#c026ff',
  },
  {
    id: '02',
    name: 'Dragon',
    tag: 'As vezes homem de terno, as vezes Moicano',
    photos: [raf3Photo],
    effect: 'alive', // efeito de "vivo"/respirando na foto
    theme: '#39d353',
  },
  {
    id: '03',
    name: 'GTA2D',
    tag: 'Terno & Cabelo Azul',
    photos: [gta2dPhoto],
    effect: null,
    theme: '#2f6bff',
  },
  {
    id: '04',
    name: 'Fotafox',
    tag: 'O Homem Uva',
    photos: [foxPhoto],
    effect: null,
    theme: '#c026ff',
  },
]
