import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import LogoFull from './LogoFull'

// ⚙️ DATA/HORA ALVO DO COUNTDOWN — é só isso que você precisa mexer.
// Formato: 'AAAA-MM-DDTHH:MM:SS' no horário de Brasília (America/Sao_Paulo).
// Exemplo: '2026-09-01T18:40:00' = 1 de setembro de 2026, 18h40.
const TARGET_DATE = new Date('2026-09-01T18:40:00-03:00')

function getTimeLeft() {
  const diff = TARGET_DATE.getTime() - Date.now()
  if (diff <= 0) return null

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

/**
 * Tela de contagem regressiva em tela cheia. Enquanto o tempo não
 * zera, é a ÚNICA coisa visível no site — nenhuma outra seção
 * carrega por baixo (ver App.jsx: o resto do site só monta depois
 * que isso termina). Quando `TARGET_DATE` é alcançada, chama
 * `onFinish` uma única vez pra revelar o site de verdade.
 */
export default function Countdown({ onFinish }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)

  useEffect(() => {
    // se a data já passou desde o carregamento, revela na hora
    if (!timeLeft) {
      onFinish()
      return
    }

    const interval = setInterval(() => {
      const next = getTimeLeft()
      setTimeLeft(next)
      if (!next) {
        clearInterval(interval)
        onFinish()
      }
    }, 1000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!timeLeft) return null // onFinish já foi chamado, App.jsx troca de tela

  return (
    <div
      className="fixed inset-0 z-[9999] bg-asphalt flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at 50% 30%, rgba(107,47,214,.35), transparent 60%), linear-gradient(180deg, #0d0d10 0%, #1a0f2e 100%)',
      }}
    >
      <div className="site-grain" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-[min(560px,86vw)] mb-10"
      >
        <LogoFull className="w-full h-auto drop-shadow-[0_10px_35px_rgba(255,95,174,0.35)]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-gta6-pink text-xs sm:text-sm tracking-[6px] uppercase mb-8"
      >
        Chegando em breve
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="flex gap-4 sm:gap-8"
      >
        <TimeUnit value={timeLeft.days} label="Dias" />
        <TimeUnit value={timeLeft.hours} label="Horas" />
        <TimeUnit value={timeLeft.minutes} label="Min" />
        <TimeUnit value={timeLeft.seconds} label="Seg" />
      </motion.div>
    </div>
  )
}

function TimeUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="font-display text-[clamp(2.2rem,8vw,4.5rem)] leading-none text-paper tabular-nums">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-paper/40 text-[0.65rem] sm:text-xs tracking-[3px] uppercase mt-2">
        {label}
      </div>
    </div>
  )
}
