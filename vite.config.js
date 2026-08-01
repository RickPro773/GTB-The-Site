import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANTE:
  // - Netlify: o site fica na raiz do domínio (ex: gtb-brodis.netlify.app)
  //   então use base: '/'
  // - GitHub Pages: o site fica numa subpasta
  //   (ex: usuario.github.io/gtb-site/), então use base: '/gtb-site/'
  //   trocando 'gtb-site' pelo nome exato do repositório.
  base: '/',
})
