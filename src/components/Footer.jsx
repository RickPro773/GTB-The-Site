import { DiscordIcon, RobloxIcon } from './SocialIcons'

export default function Footer({ onSocialClick }) {
  return (
    <footer className="py-12 px-[5vw] flex justify-between items-center border-t border-white/[0.08] text-sm text-paper/50 flex-wrap gap-6">
      <div>
        <div>GTB — Gang's Thief's Brodis © 2026</div>
        <div className="text-xs mt-1">Fan project não oficial &middot; feito com 💜 no Roblox</div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onSocialClick('Discord')}
          aria-label="Discord (em breve)"
          className="w-10 h-10 flex items-center justify-center border border-white/15 text-paper/60 hover:text-gta6-pink hover:border-gta6-pink transition"
        >
          <DiscordIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onSocialClick('Roblox')}
          aria-label="Roblox (em breve)"
          className="w-10 h-10 flex items-center justify-center border border-white/15 text-paper/60 hover:text-gta6-pink hover:border-gta6-pink transition"
        >
          <RobloxIcon className="w-5 h-5" />
        </button>
      </div>
    </footer>
  )
}
