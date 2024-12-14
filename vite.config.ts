import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'
  const target = isDev ? 'http://localhost:8000' : 'https://zatchat-api.azurewebsites.net/'

  if (!target) {
    throw new Error('VITE_API_URL is not defined in the environment file')
  }

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
