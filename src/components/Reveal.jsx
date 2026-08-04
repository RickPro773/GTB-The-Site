import { motion } from 'framer-motion'

/**
 * Envolve qualquer seção da página pra ela aparecer com um fade +
 * leve deslocamento suave quando o usuário rola até ela, em vez de
 * simplesmente "estar lá" desde o início. Efeito sutil de
 * propósito — não deve chamar mais atenção que o conteúdo em si.
 *
 * Usa o `whileInView` do Framer Motion (baseado em
 * IntersectionObserver por baixo, igual a versão anterior em CSS
 * puro tinha) mas com física de mola de verdade em vez de curva de
 * easing fixa — a entrada tem uma sensação mais orgânica, com um
 * pouquinho de "assentamento" no final em vez de parar seco.
 *
 * `once: true` garante que a animação roda só na primeira vez que
 * a seção entra na tela, igual o comportamento anterior.
 *
 * Uso: <Reveal><Characters /></Reveal>
 * Uso com atraso: <Reveal delay={0.15}><Characters /></Reveal>
 */
export default function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ type: 'spring', stiffness: 90, damping: 18, delay }}
    >
      {children}
    </motion.div>
  )
}
