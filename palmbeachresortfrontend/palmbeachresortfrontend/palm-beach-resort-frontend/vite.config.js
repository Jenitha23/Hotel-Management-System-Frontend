import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'palm-beach-backend-acd9hmgphegsfdee.centralindia-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})