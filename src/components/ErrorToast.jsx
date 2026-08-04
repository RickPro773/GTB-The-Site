import { motion } from 'framer-motion'
import { useEffect } from 'react'

/**
 * Toast compacto de erro, estilo "mensagem de sistema" — usado
 * pelos ícones de rede social que ainda não têm link real. Some
 * sozinho depois de alguns segundos, sem exigir clique pra fechar.
 * Diferente do ComingSoonModal (que é uma caixa grande centralizada),
 * este é discreto e não interrompe a navegação.
 *
 * Precisa ficar dentro de um <AnimatePresence> no componente pai
 * (veja App.jsx) pra animação de saída (sumir deslizando pra baixo)
 * funcionar de verdade, em vez de simplesmente desaparecer.
 */
export default function ErrorToast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <div className="panel-3d flex items-center gap-2.5 bg-asphalt-2 border border-red-500/40 rounded-lg py-3 px-5 text-sm text-paper/85 max-w-[90vw]">
        <span className="text-red-400">⚠</span>
        <span>{message}</span>
      </div>
    </motion.div>
  )
}
