import { motion } from 'framer-motion'
import { useEffect } from 'react'

/**
 * Modal genérico "Em breve", usado tanto pelas redes sociais
 * (Discord/Roblox) quanto pela aba "Quadro" no menu.
 * Fecha ao clicar fora, no X, ou apertando Esc.
 *
 * Precisa ficar dentro de um <AnimatePresence> no componente pai
 * (veja App.jsx) pra animação de SAÍDA funcionar — sem isso, o
 * React desmonta o componente na hora que a condição vira falsa,
 * sem dar tempo da animação rodar.
 */
export default function ComingSoonModal({ title, message, onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/75 backdrop-blur-sm px-6"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="panel-3d relative bg-asphalt-2 border border-white/10 rounded-xl max-w-sm w-full p-8 text-center"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 16 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 text-paper/50 hover:text-paper transition text-lg leading-none w-8 h-8 flex items-center justify-center"
        >
          ✕
        </button>
        <div className="inline-block border border-logo-purple text-logo-purple text-[0.65rem] tracking-[2px] uppercase py-1.5 px-4 mb-4 rounded-full">
          Em breve
        </div>
        <h3 className="font-display text-3xl text-logo-green text-3d-green mb-3">{title}</h3>
        <p className="text-paper/70 text-sm leading-relaxed">{message}</p>
      </motion.div>
    </motion.div>
  )
}
