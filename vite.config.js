import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';

export default defineConfig(({ command, mode }) => {
  // Carica le variabili d'ambiente in base all'ambiente corrente
  const env = loadEnv(mode, process.cwd());
  
  return {
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
          },
        },
      },
      hmr: {
        overlay: false,
      },
    },
    build: {
      minify: 'terser',
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui': ['react-bootstrap', 'react-icons'],
            'charts': ['chart.js', 'react-chartjs-2'],
          },
        }
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'chart.js', 'react-chartjs-2', 'react-bootstrap'],
    }
  };
});