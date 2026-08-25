import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import charactersWheel from '../assets/images/characters-wheel.png'
import { roster } from '../data/roster.js'
import LoadingImage from './LoadingImage.jsx'

// Cada card aparece com um pequeno atraso em relação ao anterior —
// dá a sensação de "revelar o elenco um por um" em vez de todos
// surgirem de uma vez. O container define o ritmo (staggerChildren),
// cada card só define seu próprio estado inicial/final.
const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 16 },
  },
}

function CharacterCard({ char }) {
  const aliveClass = char.effect === 'alive' ? 'char-card--alive' : ''

  return (
    <motion.div variants={cardVariants}>
      <Link
        to={`/personagem/${char.slug}`}
        className={`char-card group relative overflow-hidden bg-asphalt aspect-[4/5] block rounded-lg ${aliveClass}`}
        style={{ '--char-theme': char.theme }}
      >
        <LoadingImage
          src={char.photos[0]}
          alt={`${char.name} — ${char.tag}`}
          className="absolute inset-0 w-full h-full object-cover"
          accentColor={char.theme}
        />

        {/* overlay que escurece e mostra "Ver ficha" no hover, com
            uma pequena mola no texto pra sentir mais vivo */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <motion.span
            className="text-xs tracking-[3px] uppercase font-bold py-2 px-5 rounded-full border-2 backdrop-blur-sm"
            style={{ borderColor: char.theme, color: char.theme, backgroundColor: 'rgba(13,13,16,0.5)' }}
            initial={{ scale: 0.85 }}
            whileHover={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            Ver Ficha →
          </motion.span>
        </div>

        <div className="absolute left-0 right-0 bottom-0 p-5 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
          <div className="text-[0.65rem] tracking-[3px] text-warn-yellow uppercase">
            Ficha #{char.id}
          </div>
          <h3 className="font-display text-2xl text-paper leading-none mt-1">{char.name}</h3>
          <p className="text-sm text-paper/75 mt-1">{char.tag}</p>
        </div>
      </Link>
    </motion.div>
  )
}

export default function Characters() {
  return (
    <section
      id="personagens"
      className="bg-asphalt-2 border-t border-b border-white/[0.06] text-center py-28 px-[5vw]"
    >
      <h2 className="font-display text-[clamp(2.5rem,6.5vw,4.8rem)] leading-[0.9] mb-2">
        O <span className="text-gta6-pink text-3d-purple">Elenco</span> da Rua
      </h2>
      <p className="max-w-[620px] mx-auto text-paper/70 leading-relaxed mb-14">
        Escolha seu brodi. Clique num card pra ver a ficha completa de cada um.
      </p>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto text-left"
        variants={gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {roster.map((char) => (
          <CharacterCard key={char.id} char={char} />
        ))}
      </motion.div>

      <div className="mt-20">
        <div className="relative w-[min(420px,75vw)] mx-auto">
          <img
            src={charactersWheel}
            alt="Roleta de seleção de personagens do GTB, estilo GTA, com os brodis do elenco"
            className="w-full h-auto block animate-wheel-in"
            style={{ filter: 'drop-shadow(0 0 40px rgba(143,19,235,.3))' }}
          />
        </div>
        <p className="mt-6 text-paper/50 text-xs tracking-[1px] max-w-[440px] mx-auto leading-relaxed uppercase">
          Tela de seleção de personagem &middot; estilo GTA
        </p>
      </div>
    </section>
  )
}
