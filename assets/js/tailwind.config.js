/* =========================================================
   GTB — Grande Theft Brodis
   tailwind.config.js — configuração do tema Tailwind (via CDN)
   ========================================================= */

tailwind.config = {
  theme: {
    extend: {
      colors: {
        asphalt: {
          DEFAULT: '#0d0d10',
          2: '#161619',
          3: '#1e1e23',
        },
        neon: {
          purple: '#c026ff',
          'purple-dim': '#7c1fb0',
        },
        hood: {
          green: '#39d353',
          'green-dim': '#1f7a34',
        },
        brodis: {
          blue: '#2f6bff',
        },
        paper: '#e9e6df',
        warn: {
          yellow: '#ffcf3d',
        },
      },
      fontFamily: {
        display: ['Pricedown', 'Anton', 'sans-serif'],
        body: ['Oswald', 'sans-serif'],
      },
      keyframes: {
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: 1 },
          '20%, 22%, 24%, 55%': { opacity: 0.85 },
        },
        load: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        eq: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        },
        wheelSpinIn: {
          from: { opacity: 0, transform: 'rotate(-25deg) scale(0.9)' },
          to: { opacity: 1, transform: 'rotate(0deg) scale(1)' },
        },
      },
      animation: {
        flicker: 'flicker 3.5s infinite',
        load: 'load 5.6s linear forwards',
        eq: 'eq 0.9s ease-in-out infinite',
        'wheel-in': 'wheelSpinIn 1s ease-out',
      },
    },
  },
};