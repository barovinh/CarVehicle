import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import prices from './src/mock/prices.js'
import events from './src/mock/events.js'
import featuredProductIds from './src/mock/featuredProducts.js'

function registerCollectionApi({ middlewares, basePath, items }) {
  middlewares.use(basePath, (req, res) => {
    const match = req.url.match(/^\/([^?]+)/)
    const segment = match ? match[1] : ''

    const url = new URL(req.url, 'http://localhost')
    const month = url.searchParams.get('month')
    const year = url.searchParams.get('year')

    if (segment && segment !== '') {
      const item = items.find((p) => p.id === segment)
      res.setHeader('Content-Type', 'application/json')
      if (item) {
        res.end(JSON.stringify({ item }))
      } else {
        res.statusCode = 404
        res.end(JSON.stringify({ error: 'Not found' }))
      }
      return
    }

    let list = items
    if (month || year) {
      const monthNum = month ? Number(month) : null
      const yearNum = year ? Number(year) : null
      list = items.filter((ev) => {
        const startAt = ev.startAt ? new Date(ev.startAt) : null
        if (!startAt || Number.isNaN(startAt.getTime())) return false
        if (yearNum && startAt.getFullYear() !== yearNum) return false
        if (monthNum && startAt.getMonth() + 1 !== monthNum) return false
        return true
      })
    }

    res.setHeader('Content-Type', 'application/json')
    res.end(
      JSON.stringify({
        updatedAt: new Date().toISOString(),
        items: list
      })
    )
  })
}

function registerFeaturedProductsApi({ middlewares }) {
  middlewares.use('/api/featured-products', (req, res) => {
    const url = new URL(req.url, 'http://localhost')
    const limitRaw = url.searchParams.get('limit')
    const limit = limitRaw ? Number(limitRaw) : 0

    const featured = featuredProductIds
      .map((id) => prices.find((p) => p.id === id))
      .filter(Boolean)

    const items = Number.isFinite(limit) && limit > 0 ? featured.slice(0, limit) : featured

    res.setHeader('Content-Type', 'application/json')
    res.end(
      JSON.stringify({
        updatedAt: new Date().toISOString(),
        items
      })
    )
  })
}

const mockApiPlugin = () => ({
  name: 'mock-api',
  configureServer(server) {
    registerCollectionApi({ middlewares: server.middlewares, basePath: '/api/prices', items: prices })
    registerCollectionApi({ middlewares: server.middlewares, basePath: '/api/events', items: events })
    registerFeaturedProductsApi({ middlewares: server.middlewares })
  },
  configurePreviewServer(server) {
    registerCollectionApi({ middlewares: server.middlewares, basePath: '/api/prices', items: prices })
    registerCollectionApi({ middlewares: server.middlewares, basePath: '/api/events', items: events })
    registerFeaturedProductsApi({ middlewares: server.middlewares })
  }
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const useMockApi = env.VITE_USE_MOCK_API === '1' || env.VITE_USE_MOCK_API === 'true'

  return {
    plugins: [vue(), vueDevTools(), ...(useMockApi ? [mockApiPlugin()] : [])],
    server: useMockApi
      ? undefined
      : {
          proxy: {
            '/api': {
              target: 'http://127.0.0.1:8000',
              changeOrigin: true,
            },
          },
        },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
