import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  define: {
    // Assicuriamoci che le variabili di ambiente siano gestite correttamente
    'process.env': {}
  },
  build: {
    minify: false, // Disabilita temporaneamente la minificazione per debug
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      // Semplifichiamo completamente la configurazione
      output: {
        manualChunks: undefined,
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
});