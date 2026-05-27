function buildQuery(params = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    search.set(key, String(value))
  })
  const query = search.toString()
  return query ? `?${query}` : ''
}

export async function fetchEvents({ month, year } = {}) {
  const baseUrl = import.meta.env.VITE_EVENTS_API_URL || '/api/events'
  const url = `${baseUrl}${buildQuery({ month, year })}`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch events')
  return res.json()
}

export async function fetchEventById(id) {
  if (!id) throw new Error('Missing event id')

  const baseUrl = import.meta.env.VITE_EVENTS_API_URL || '/api/events'
  const url = `${baseUrl}/${encodeURIComponent(String(id))}`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch event')
  return res.json()
}
