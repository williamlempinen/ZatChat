import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as dotenv from 'dotenv'

export default defineConfig(({ mode }) => {
  const envFilePath = `.env`
  dotenv.config({ path: envFilePath })

  const isDev = mode === 'development'
  const target = isDev ? 'http://localhost:8000' : process.env.VITE_API_URL

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
