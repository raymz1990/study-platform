import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ---------------------------------------------------------------------------
// Plugin: serve content/ as /content/ in dev and copy to dist/content/ in build
// ---------------------------------------------------------------------------

function contentServerPlugin(): Plugin {
  return {
    name: 'content-server',
    configureServer(server) {
      server.middlewares.use('/content', (req, res) => {
        const urlPath = req.url?.split('?')[0] ?? ''
        const filePath = path.join(__dirname, 'content', urlPath)
        // Security: prevent directory traversal
        const resolved = path.resolve(filePath)
        const contentRoot = path.resolve(__dirname, 'content')
        if (!resolved.startsWith(contentRoot)) {
          res.statusCode = 403
          res.end('Forbidden')
          return
        }
        fs.readFile(filePath, (err, data) => {
          if (err) {
            res.statusCode = 404
            res.end('Not found')
            return
          }
          const ext = path.extname(filePath)
          const mimeTypes: Record<string, string> = {
            '.md': 'text/markdown; charset=utf-8',
            '.json': 'application/json',
          }
          res.setHeader('Content-Type', mimeTypes[ext] ?? 'application/octet-stream')
          res.end(data)
        })
      })
    },
    writeBundle() {
      const src = path.join(__dirname, 'content')
      const dst = path.join(__dirname, 'dist', 'content')
      if (!fs.existsSync(src)) return
      fs.mkdirSync(dst, { recursive: true })
      const copyRecursive = (srcDir: string, dstDir: string) => {
        fs.mkdirSync(dstDir, { recursive: true })
        for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
          const srcEntry = path.join(srcDir, entry.name)
          const dstEntry = path.join(dstDir, entry.name)
          if (entry.isDirectory()) {
            copyRecursive(srcEntry, dstEntry)
          } else {
            fs.copyFileSync(srcEntry, dstEntry)
          }
        }
      }
      copyRecursive(src, dst)
      // eslint-disable-next-line no-console
      console.log(`[content-server] copied content/ → dist/content/`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/study-platform/',
  plugins: [
    react(),
    contentServerPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.png', 'icon.svg', 'icon-192x192.png', 'icon-512x512.png', 'icon-maskable-512x512.png'],
      manifest: {
        name: 'Concurso AI Platform',
        short_name: 'Concurso AI',
        description: 'Plataforma inteligente para preparação em concursos públicos.',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/study-platform/',
        start_url: '/study-platform/',
        lang: 'pt-BR',
        categories: ['education', 'productivity'],
        icons: [
          {
            src: '/study-platform/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/study-platform/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/study-platform/icon-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 ano
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.md$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'markdown-content-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 dias
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\/content\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'discipline-content-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /search-index\.json/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'search-index-cache',
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
        skipWaiting: true,
        clientsClaim: true,
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
