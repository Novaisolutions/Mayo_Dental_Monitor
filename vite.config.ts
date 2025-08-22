import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/kommo': {
        target: 'https://bizmakermx.kommo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/kommo/, ''),
        headers: {
          'Authorization': `Bearer ${process.env.KOMMO_ACCESS_TOKEN || ''}`,
        },
      },
    },
  },
})