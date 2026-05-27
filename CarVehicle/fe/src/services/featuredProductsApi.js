export async function fetchFeaturedProducts({ limit } = {}) {
  const baseUrl = import.meta.env.VITE_FEATURED_PRODUCTS_API_URL || '/api/featured-products'
  const url = new URL(baseUrl, window.location.origin)

  if (limit !== undefined && limit !== null && limit !== '') {
    url.searchParams.set('limit', String(limit))
  }

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Failed to fetch featured products')
  return res.json()
}
