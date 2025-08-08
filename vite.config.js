import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer';
import legacy from '@vitejs/plugin-legacy'


export default defineConfig({
  plugins: [
    legacy({
      targets: ['chrome >= 50'],
      additionalLegacyPolyfills: [
        'regenerator-runtime/runtime',
        'core-js/modules/es.promise.js',
        'core-js/modules/es.array.from.js',
        'core-js/modules/es.array.includes.js',
        'core-js/modules/es.object.assign.js',
        'core-js/modules/es.object.entries.js',
        'core-js/modules/es.object.values.js',
        'core-js/modules/es.string.includes.js',
        'core-js/modules/es.string.pad-start.js',
        'core-js/modules/es.string.pad-end.js'
      ],
      polyfills: true,
      modernPolyfills: false
    })
  ],
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    include: ['video.js', 'hls.js', 'shaka-player']
  },
  build: {
    target: 'es2015',
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
