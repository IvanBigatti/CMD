import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { apiEvaluaciones } from './servidor/apiEvaluaciones.ts'
import { apiResenas } from './servidor/apiResenas.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiResenas(), apiEvaluaciones()],
})
