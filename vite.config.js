import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
//  base: '/sol/', // Cambia '/sol/' por el nombre de tu subcarpeta
  plugins: [react()],
})
