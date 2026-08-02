// Descobre automaticamente qualquer .mp3 dentro de
// src/assets/character-music/. Não precisa importar nada à mão —
// é só o arquivo existir com o nome certo (definido em
// `musicFile` no roster.js) que ele já é encontrado.
const musicModules = import.meta.glob('../assets/character-music/*.mp3', {
  eager: true,
  import: 'default',
})

// Recebe o nome do arquivo esperado (ex: "rick-theme.mp3") e
// devolve a URL processada pelo Vite, ou null se o arquivo ainda
// não existe no projeto — assim a bio funciona normalmente mesmo
// sem a música ter sido adicionada ainda.
export function getCharacterMusic(fileName) {
  if (!fileName) return null
  const match = Object.keys(musicModules).find((path) => path.endsWith(`/${fileName}`))
  return match ? musicModules[match] : null
}
