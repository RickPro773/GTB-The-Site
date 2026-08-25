/**
 * Logo "gang's thief's BRODIS" em SVG, reproduzindo a arte de
 * referência original com as cores exatas (amostradas pixel a
 * pixel da imagem de referência): "gang's thief's" em branco com
 * contorno preto grosso, e "BRODIS" com B=verde, R=azul, O=verde,
 * D=roxo, I=roxo, S=roxo.
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
      aria-label="Gang's Thief's Brodis"
    >
      <text
        x="10"
        y="58"
        fontFamily="Pricedown, Anton, sans-serif"
        fontSize="46"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="5"
        paintOrder="stroke"
      >
        gang's
      </text>
      <text
        x="10"
        y="110"
        fontFamily="Pricedown, Anton, sans-serif"
        fontSize="46"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="5"
        paintOrder="stroke"
      >
        thief's
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
        <tspan fill={BRODIS_PURPLE}>I</tspan>
        <tspan fill={BRODIS_PURPLE}>S</tspan>
      </text>
    </svg>
  )
}
