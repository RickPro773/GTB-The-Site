import { useScrollReveal } from '../hooks/useScrollReveal'

/**
 * Envolve qualquer seção da página pra ela aparecer com um fade +
 * leve deslocamento suave quando o usuário rola até ela, em vez de
 * simplesmente "estar lá" desde o início. Efeito sutil de
 * propósito — não deve chamar mais atenção que o conteúdo em si.
 *
 * Uso: <Reveal><Characters /></Reveal>
 */
export default function Reveal({ children, delay = 0 }) {
  const [ref, isVisible] = useScrollReveal()

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}
