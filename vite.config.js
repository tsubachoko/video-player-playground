import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    include: ['video.js', 'hls.js', 'shaka-player']
  }
})
