/**
 * Logo "grand theft BRODIS" em SVG, reproduzindo o estilo da arte
 * original: "grand theft" em branco com contorno grosso preto
 * (fonte Pricedown), e "BRODIS" com letras alternando verde/roxo
 * do projeto, terminando em branco no S — igual à referência.
 *
 * Uso: <LogoFull className="w-64" />
 */
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

      {/* BRODIS — cada letra com sua cor, alternando verde/roxo, S em branco */}
      <text
        y="182"
        fontFamily="Pricedown, Anton, sans-serif"
        fontSize="62"
        stroke="#000000"
        strokeWidth="6"
        paintOrder="stroke"
      >
        <tspan x="10" fill="#39d353">B</tspan>
        <tspan fill="#c026ff">R</tspan>
        <tspan fill="#39d353">O</tspan>
        <tspan fill="#c026ff">D</tspan>
        <tspan fill="#39d353">I</tspan>
        <tspan fill="#ffffff">S</tspan>
      </text>
    </svg>
  )
}
