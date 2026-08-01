/**
 * Logo "grand theft BRODIS" em SVG, reproduzindo a arte de
 * referência original com as cores exatas (amostradas pixel a
 * pixel da imagem de referência): "grand theft" em branco com
 * contorno preto grosso, e "BRODIS" com B=verde, R=azul, O=verde,
 * D=roxo, I=verde, S=branco.
 *
 * Uso: <LogoFull className="w-64" />
 */
const BRODIS_GREEN = '#52db0f'
const BRODIS_BLUE = '#0016f5'
const BRODIS_PURPLE = '#8f13eb'

export default function LogoFull({ className = '' }) {
  return (
    <svg
      viewBox="0 0 520 210"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Grand Theft Brodis"
    >
      <text
        x="10"
        y="60"
        fontFamily="Pricedown, Anton, sans-serif"
        fontSize="58"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="6"
        paintOrder="stroke"
      >
        grand
      </text>
      <text
        x="10"
        y="112"
        fontFamily="Pricedown, Anton, sans-serif"
        fontSize="58"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="6"
        paintOrder="stroke"
      >
        theft
      </text>

      {/* BRODIS — cores exatas da referência, letra por letra */}
      <text
        y="182"
        fontFamily="Pricedown, Anton, sans-serif"
        fontSize="62"
        stroke="#000000"
        strokeWidth="6"
        paintOrder="stroke"
      >
        <tspan x="10" fill={BRODIS_GREEN}>B</tspan>
        <tspan fill={BRODIS_BLUE}>R</tspan>
        <tspan fill={BRODIS_GREEN}>O</tspan>
        <tspan fill={BRODIS_PURPLE}>D</tspan>
        <tspan fill={BRODIS_GREEN}>I</tspan>
        <tspan fill="#ffffff">S</tspan>
      </text>
    </svg>
  )
}
