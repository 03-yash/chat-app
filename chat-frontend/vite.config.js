import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:2221',
        changeOrigin: true,
        secure: false,
      }, '/chat': {
        target: 'http://localhost:2221',
        changeOrigin: true,
        secure: false,
      },
      '/message': {
        target: 'http://localhost:2221',
        changeOrigin: true,
        secure: false,
      },
    }
  }
})
