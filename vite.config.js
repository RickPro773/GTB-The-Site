import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Publicando só no Netlify: o site fica na raiz do domínio
  // (ex: gtb-brodis.netlify.app), então base fica '/' e não precisa
  // mexer em mais nada aqui, independente do nome do repositório.
  base: '/',
})
