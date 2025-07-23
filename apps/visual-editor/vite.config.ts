import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { aichatPlugin } from './vite-aichat-plugin.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Enable polyfills for specific globals and modules
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Enable polyfills for specific Node.js modules
      protocolImports: true,
    }),
    aichatPlugin(), // 添加 AIChat API 插件
  ],

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
    // 添加 AIChat API 中间件
    middlewareMode: false,
    proxy: {},
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

  // Define global constants and polyfills for WebContainer
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '0.1.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    // WebContainer polyfills
    global: 'globalThis',
    process: JSON.stringify({
      env: {},
      version: '18.0.0',
      platform: 'browser',
      nextTick: 'setTimeout',
    }),
  },
})
