bimport { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
base: '/ai/',ai    // ← 这里填你 GitHub 仓库的名字
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.deepseek.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
          'Authorization': 'Bearer sk-f68b37a987564843b21a08f43329f57e'
        }
      }
    }
  }
})

