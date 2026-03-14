import { getAdminAuthorizationHeader } from './adminAuth'

export async function adminFetch(path, options = {}) {
  const auth = getAdminAuthorizationHeader()
  const headers = new Headers(options.headers || {})

  if (auth) headers.set('Authorization', auth)
  if (!headers.has('Content-Type') && options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(path, {
    ...options,
    headers,
  })

  if (!res.ok) {
    let payload = null
    try {
      payload = await res.json()
    } catch {
      // ignore
    }

    const message = payload?.error || payload?.message || `Request failed (${res.status})`
    const err = new Error(message)
    err.status = res.status
    err.payload = payload
    throw err
  }

  return res.json()
}

export function adminGet(path) {
  return adminFetch(path)
}

export function adminPost(path, body) {
  return adminFetch(path, { method: 'POST', body: JSON.stringify(body ?? {}) })
}

export function adminPut(path, body) {
  return adminFetch(path, { method: 'PUT', body: JSON.stringify(body ?? {}) })
}

export function adminDelete(path) {
  return adminFetch(path, { method: 'DELETE' })
}
