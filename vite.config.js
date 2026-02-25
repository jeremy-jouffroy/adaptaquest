import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/adaptaquest/', // ← remplace par le nom de ton repo GitHub
})
