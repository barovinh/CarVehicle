import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import prices from './src/mock/prices.js'

const mockApiPlugin = () => ({
  name: 'mock-api',
  configureServer(server) {
    server.middlewares.use('/api/prices', (req, res, next) => {
      const match = req.url.match(/^\/([^?]+)/)
      const segment = match ? match[1] : ''

      if (segment && segment !== '') {
        // /api/prices/:id
        const item = prices.find((p) => p.id === segment)
        res.setHeader('Content-Type', 'application/json')
        if (item) {
          res.end(JSON.stringify({ item }))
        } else {
          res.statusCode = 404
          res.end(JSON.stringify({ error: 'Not found' }))
        }
        return
      }

      // /api/prices — list
      res.setHeader('Content-Type', 'application/json')
      res.end(
        JSON.stringify({
          updatedAt: new Date().toISOString(),
          items: prices
        })
      )
    })
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    mockApiPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
