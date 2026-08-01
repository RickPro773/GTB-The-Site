/**
 * Logo curta "GTB" em SVG — usa a fonte Pricedown já carregada
 * pelo @font-face do site (src/index.css). Ideal para o header,
 * favicon dinâmico, ou qualquer lugar que precise só da marca curta.
 *
 * Uso: <LogoGTB className="h-10 w-auto" />
 */
export default function LogoGTB({ className = '' }) {
  return (
    <svg
      viewBox="0 0 300 130"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="GTB"
    >
      <text
        x="10"
        y="95"
        fontFamily="Pricedown, Anton, sans-serif"
        fontSize="90"
        fill="#c026ff"
        stroke="#39d353"
        strokeWidth="4"
        paintOrder="stroke"
      >
        GTB
      </text>
    </svg>
  )
}
