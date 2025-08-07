import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer';


export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    include: ['video.js', 'hls.js', 'shaka-player']
  },
  build: {
    rollupOptions: {
      plugins: [visualizer()],
      output: {
        manualChunks: {
          'vendor-videojs': ['video.js'],
          'vendor-hlsjs': ['hls.js'],
          'vendor-shaka': ['shaka-player']
        }
      }
    }
  }
})
