import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/iss-experience/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei']
        }
      }
    }
  },
  // Configurações específicas para GitHub Pages
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  // Resolve aliases se necessário
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})