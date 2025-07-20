import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@core': resolve(__dirname, './src/core'),
      '@features': resolve(__dirname, './src/features'),
      '@layouts': resolve(__dirname, './src/layouts'),
      '@providers': resolve(__dirname, './src/providers'),
      '@styles': resolve(__dirname, './src/styles'),
      '@shared': resolve(__dirname, '../../packages/shared'),
      '@prompt-engine': resolve(__dirname, '../../packages/prompt-engine'),
    },
  },

  // Development server configuration
  server: {
    port: 3000,
    host: true,
    open: true,
    cors: true,
    // WebContainer API requires specific headers
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },

  // Build configuration
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'antd-vendor': ['antd', '@ant-design/icons'],
          'monaco-vendor': ['@monaco-editor/react', 'monaco-editor'],
          'ai-vendor': ['@google/generative-ai'],
          'webcontainer-vendor': ['@webcontainer/api'],
          'babel-vendor': ['@babel/parser', '@babel/traverse', '@babel/types'],
        },
      },
    },
    // Optimize for WebContainer environment
    chunkSizeWarningLimit: 1000,
  },

  // Optimizations for WebContainer
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'antd',
      '@ant-design/icons',
      'zustand',
      '@monaco-editor/react',
      'monaco-editor',
    ],
    exclude: ['@webcontainer/api'],
  },

  // Ensure workspace packages are properly resolved
  ssr: {
    noExternal: ['@pixelmind/shared', '@pixelmind/prompt-engine'],
  },

  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '0.1.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
})
