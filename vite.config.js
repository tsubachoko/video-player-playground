import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer';
import legacy from '@vitejs/plugin-legacy'


export default defineConfig({
  plugins: [
    legacy({
      targets: ['chrome >= 50', 'ie >= 11'],
      additionalLegacyPolyfills: [
        'regenerator-runtime/runtime',
        'core-js/stable'
      ],
      polyfills: [
        'es.promise',
        'es.array.from',
        'es.array.includes',
        'es.array.find',
        'es.array.find-index',
        'es.array.iterator',
        'es.object.assign',
        'es.object.entries',
        'es.object.values',
        'es.object.keys',
        'es.string.includes',
        'es.string.pad-start',
        'es.string.pad-end',
        'es.string.starts-with',
        'es.string.ends-with',
        'es.symbol',
        'es.symbol.iterator',
        'es.map',
        'es.set',
        'es.weak-map',
        'es.weak-set'
      ],
      modernPolyfills: false,
      renderLegacyChunks: true
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
    target: ['chrome50', 'safari11'],
    cssTarget: 'chrome50',
    rollupOptions: {
      plugins: [visualizer()],
      output: {
        manualChunks: {
          'vendor-videojs': ['video.js'],
          'vendor-hlsjs': ['hls.js'],
          'vendor-shaka': ['shaka-player']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      ecma: 5,
      safari10: true
    }
  }
})
