import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-i18n': ['vue-i18n']
        }
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/r1d-api': {
        target: 'http://r1dms.elbadaernu.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/r1d-api/, '')
      }
    }
  }
}) 