import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { apiResenas } from './servidor/apiResenas.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiResenas()],
})
