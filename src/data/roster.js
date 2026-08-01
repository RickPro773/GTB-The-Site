import rickPhoto from '../assets/images/char-rick.png'
import raf2Photo from '../assets/images/char-raf-2.png'
import gta2dPhoto from '../assets/images/char-gta2d.png'

export const roster = [
  {
    id: '01',
    name: 'Rick',
    tag: 'Camisa do Fortaleza',
    photo: rickPhoto,
    effect: null,
  },
  {
    id: '02',
    name: 'Raf "Moicano"',
    tag: 'Moicano',
    photo: raf2Photo,
    effect: 'alive', // efeito de "vivo"/respirando na foto
  },
  {
    id: '03',
    name: 'GTA2D',
    tag: 'Terno & Cofre',
    photo: gta2dPhoto,
    effect: null,
  },
  {
    id: '04',
    name: 'Fox',
    tag: 'O Incendiário',
    photo: null, // sem foto individual ainda — aparece só na roleta
    effect: null,
  },
]