import { motion } from 'framer-motion'

/**
 * Envolve qualquer seção da página pra ela aparecer com um efeito
 * de "revelação" quando o usuário rola até ela — uma linha neon
 * (rosa/roxo, cores do GTA VI) varre a seção de baixo pra cima
 * (clip-path), o conteúdo sobe com uma mola de verdade e ganha
 * profundidade (blur + escala), em vez de simplesmente "estar lá"
 * desde o início.
 *
 * Usa o `whileInView` do Framer Motion (IntersectionObserver por
 * baixo). `once: true` garante que a animação roda só na primeira
 * vez que a seção entra na tela.
 *
 * Uso: <Reveal><Characters /></Reveal>
 * Uso com atraso: <Reveal delay={0.15}><Characters /></Reveal>
 * Efeito mais "duro" (wipe mais visível): <Reveal sweep><Hero2 /></Reveal>
 */
export default function Reveal({ children, delay = 0, sweep = true }) {
  return (
    <motion.div
      className="relative"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 56, scale: 0.96, filter: 'blur(8px)' },
          visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
        }}
        transition={{ type: 'spring', stiffness: 65, damping: 17, delay }}
      >
        {children}
      </motion.div>

      {sweep && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
          variants={{
            hidden: { clipPath: 'inset(0 0 100% 0)', opacity: 1 },
            visible: { clipPath: 'inset(0 0 0% 0)', opacity: [1, 1, 0] },
          }}
          transition={{ duration: 0.65, delay: delay + 0.05, times: [0, 0.85, 1], ease: 'easeInOut' }}
          style={{
            background:
              'linear-gradient(0deg, rgba(255,47,149,0) 0%, rgba(255,47,149,0.35) 92%, rgba(255,47,149,0.9) 100%)',
          }}
        />
      )}
    </motion.div>
  )
}
