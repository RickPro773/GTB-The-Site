// Descobre automaticamente qualquer .mp4 dentro de
// src/assets/video/. Sistema modular: se você soltar um arquivo
// ali, o Hero passa a usar ele como fundo em vídeo; se a pasta
// estiver vazia, o Hero cai automaticamente no fundo de imagem
// (hero-bg), sem quebrar nada e sem precisar mexer em código.
const videoModules = import.meta.glob('../assets/video/*.mp4', {
  eager: true,
  import: 'default',
})

/**
 * Devolve a URL do primeiro vídeo encontrado em
 * src/assets/video/, ou null se a pasta estiver vazia.
 *
 * Pra ativar o vídeo de fundo do Hero: salve um arquivo .mp4
 * (ideal: 1920x1080, poucos segundos, em loop, sem áudio ou com
 * áudio mutado por padrão — navegadores bloqueiam autoplay com som)
 * dentro de src/assets/video/. Só pode ter UM vídeo na pasta;
 * se tiver mais de um, o primeiro encontrado é usado.
 */
export function getHeroVideo() {
  const paths = Object.keys(videoModules)
  if (paths.length === 0) return null
  return videoModules[paths[0]]
}
