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
  define: {
    // che le variabili di ambiente siano gestite correttamente
    'process.env': {}
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://yovendo-ai.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Sending Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
    hmr: {
      overlay: false,
    },
  },
  build: {
    minify: 'terser', // Riattiva la minificazione per la produzione
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'ui': ['react-bootstrap', 'react-icons'],
          'charts': ['chart.js', 'react-chartjs-2'],
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'chart.js', 'react-chartjs-2', 'react-bootstrap'],
  },
  // Aggiungi supporto per gestire gli errori di connessione al backend
  experimental: {
    hmrErrorOverlay: false,
  }
});