import { motion } from 'framer-motion'

export default function Countdown() {
  return (
    <div
      className="fixed inset-0 z-[9999] bg-asphalt flex items-center justify-center overflow-hidden px-4"
      style={{
        background:
          'radial-gradient(circle at 50% 25%, rgba(107,47,214,.35), transparent 55%), linear-gradient(180deg, #0d0d10 0%, #1a0f2e 100%)',
      }}
    >
      <div className="site-grain" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-full max-w-[620px]"
      >
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111116]/95 shadow-[0_25px_80px_rgba(0,0,0,.55)] backdrop-blur-xl">

          {/* Cabeçalho */}
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white/10">
              <img
                src="/logo.png"
                alt="GTB"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <div className="font-display text-sm text-paper">
                Grand Theft Brodis
              </div>

              <div className="text-xs text-paper/40">
                Comunicado oficial
              </div>
            </div>
          </div>

          {/* Logo como imagem do post */}
          <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-black p-8">
            <img
              src="/logo.png"
              alt="Grand Theft Brodis"
              className="max-h-full max-w-full object-contain drop-shadow-[0_10px_35px_rgba(255,95,174,0.3)]"
            />
          </div>

          {/* Texto */}
          <div className="px-6 py-7 sm:px-8 sm:py-9">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mb-5 text-xs uppercase tracking-[4px] text-gta6-pink"
            >
              Comunicado
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="font-display text-2xl leading-tight text-paper sm:text-3xl"
            >
              Olá a todos!
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="mt-5 space-y-4 text-sm leading-relaxed text-paper/70 sm:text-base"
            >
              <p>
                Teremos que adiar o lançamento do GTB por problemas técnicos.
              </p>

              <p>
                Agora, o lançamento passa a ser em{' '}
                <span className="font-semibold text-paper">2030</span>.
              </p>

              <p>
                Desculpem a todos que estavam aguardando e obrigado pela
                compreensão.
              </p>
            </motion.div>

            {/* Novo lançamento */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-7 border-t border-white/10 pt-5"
            >
              <div className="text-[0.65rem] uppercase tracking-[3px] text-paper/30">
                Novo lançamento
              </div>

              <div className="mt-1 font-display text-3xl text-gta6-pink sm:text-4xl">
                2030
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}