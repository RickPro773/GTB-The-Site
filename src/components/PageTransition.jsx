import { motion } from 'framer-motion'

/**
 * Transição de página leve (só fade, sem deslocamento) — usada na
 * Home. Diferente da bio do personagem (que tem fade + slide
 * vertical mais perceptível), a Home já tem a Intro cobrindo a
 * tela inteira na primeira visita, então um efeito mais forte
 * aqui ficaria redundante/competindo visualmente com ela.
 */
export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  )
}
