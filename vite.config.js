import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  base: './',
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
      ],
    },
  },
  // Ottimizza le dipendenze
  optimizeDeps: {
    include: ['chart.js', 'react-chartjs-2', 'react-bootstrap', 'react-icons', 'react-router-dom'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('Proxy error:', err);
          });
        },
      },
    },
    hmr: {
      overlay: false,
    },
  },
  build: {
    minify: 'terser',
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        // Organizza i chunk in modo più efficiente
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react';
            }
            if (id.includes('react-router')) {
              return 'router';
            }
            if (id.includes('react-bootstrap') || id.includes('react-icons')) {
              return 'ui';
            }
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
              return 'charts';
            }
            return 'vendor';
          }
        },
      },
    },
    // Attiva sourcemap per debug
    sourcemap: true,
    // Assicura la compatibilità con ambienti diversi
    target: 'es2015',
    // Migliora la gestione degli errori
    reportCompressedSize: false,
  },
  // Evita avvisi per errori comuni di ESBuild
  esbuild: {
    logOverride: { 
      'this-is-undefined-in-esm': 'silent',
      'unsupported-jsx-comment': 'silent',
    },
  },
  // Configurazione per gestire eventuali polyfill necessari
  resolve: {
    alias: {
      // Aggiungi alias se necessario
    },
  },
});