import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3036,
    open: true
  },
  build: {
    outDir: 'dish',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})