import { useEffect, useRef, useState } from 'react'

/**
 * Detecta quando um elemento entra na tela ao rolar a página, pra
 * aplicar uma animação de entrada suave (fade + leve deslocamento
 * pra cima). Usa IntersectionObserver — leve, nativo do navegador,
 * sem biblioteca externa.
 *
 * Uso:
 *   const [ref, isVisible] = useScrollReveal()
 *   <div ref={ref} className={isVisible ? 'opacity-100' : 'opacity-0'}>
 */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el) // anima só uma vez, não fica repetindo
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, isVisible]
}
