import { useRef } from 'react'
import { useScroll, useTransform } from 'framer-motion'

/**
 * Cria um efeito de parallax sutil num elemento conforme a página
 * rola: o conteúdo se move numa velocidade ligeiramente diferente
 * do scroll normal, dando sensação de profundidade — o mesmo
 * truque usado em sites de trailer de jogo (o fundo "atrasa" um
 * pouco em relação ao primeiro plano).
 *
 * `strength` controla a intensidade do deslocamento em pixels
 * (positivo desloca pra baixo conforme rola, negativo desloca pra
 * cima — valores pequenos tipo 40-100 já dão um efeito perceptível
 * sem ficar exagerado).
 *
 * Uso:
 *   const [ref, y] = useParallax(60)
 *   <motion.div ref={ref} style={{ y }}>...</motion.div>
 */
export function useParallax(strength = 60) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength])
  return [ref, y]
}
