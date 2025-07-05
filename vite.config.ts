import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://mister-subsidie-form-api-h8fvgydvheenczea.westeurope-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
