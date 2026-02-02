import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import React from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [React(), tailwindcss()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 5173,
      host: true,
      open: true,
      // 仅在启用代理模式下使用代理
      proxy: env.VITE_ENABLE_PROXY
        ? {
            '/api': {
              target: 'http://localhost:8080',
              changeOrigin: true,
              rewrite: path => path.replace(/^\/api/, ''),
            },
          }
        : undefined,
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: env.MODE !== 'production',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          // 文件名规则
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',

          // chunk 拆分
          manualChunks(id) {
            if (!id.includes('node_modules')) return

            const chunks = {
              'vendor-core': ['react', 'react-dom', 'react-router'],
              'vendor-ui': [
                '@radix-ui',
                '@dnd-kit',
                'lucide-react',
                'motion',
                'tailwind-merge',
                'sonner',
                'class-variance-authority',
                'clsx',
                'tailwindcss',
                'tw-animate-css',
                '@tiptap/pm',
                '@tiptap/react',
                '@tiptap/starter-kit',
                '@tiptap/static-renderer',
              ],
              'vendor-utils': [
                'axios',
                'zod',
                'react-hook-form',
                'zustand',
                '@hookform/resolvers',
                '@tanstack/react-query',
              ],
            }

            for (const [name, libs] of Object.entries(chunks)) {
              if (libs.some(lib => id.includes(lib))) return name
            }

            // 兜底：node_modules 中未列出的依赖
            return 'vendor-other'
          },
        },
      },
    },
  }
})
