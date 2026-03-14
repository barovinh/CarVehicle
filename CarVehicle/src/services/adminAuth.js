const STORAGE_KEY = 'carvehicle-admin-basic'

export function isAdminAuthenticated() {
  return Boolean(localStorage.getItem(STORAGE_KEY))
}

export function setAdminCredentials(username, password) {
  const token = window.btoa(`${String(username)}:${String(password)}`)
  localStorage.setItem(STORAGE_KEY, token)
}

export function clearAdminCredentials() {
  localStorage.removeItem(STORAGE_KEY)
}

export function getAdminAuthorizationHeader() {
  const token = localStorage.getItem(STORAGE_KEY)
  if (!token) return null
  return `Basic ${token}`
}
