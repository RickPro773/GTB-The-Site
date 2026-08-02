import { useState } from 'react'

/**
 * <img> com loading state embutido: mostra um skeleton pulsante
 * (na cor de destaque, se fornecida) enquanto a imagem carrega, e
 * faz um fade suave assim que ela aparece — evita o "pulo" feio de
 * layout e a sensação de site quebrado em conexões lentas.
 *
 * Uso: <LoadingImage src={foto} alt="..." className="w-full h-full object-cover" />
 */
export default function LoadingImage({ src, alt, className = '', accentColor, ...rest }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative w-full h-full overflow-hidden">
      {!loaded && (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-asphalt-2 to-asphalt-3"
          style={accentColor ? { boxShadow: `inset 0 0 40px ${accentColor}22` } : undefined}
        />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
        {...rest}
      />
    </div>
  )
}
