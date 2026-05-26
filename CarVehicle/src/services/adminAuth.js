const STORAGE_KEY = 'carvehicle-admin-session'

function getStorage() {
  return window.sessionStorage
}

export function isAdminAuthenticated() {
  return Boolean(getStorage().getItem(STORAGE_KEY))
}

export function setAdminCredentials(username, password) {
  const token = window.btoa(`${String(username)}:${String(password)}`)
  getStorage().setItem(STORAGE_KEY, token)
}

export function clearAdminCredentials() {
  getStorage().removeItem(STORAGE_KEY)
}

export function getAdminAuthorizationHeader() {
  const token = getStorage().getItem(STORAGE_KEY)
  if (!token) return null
  return `Basic ${token}`
}
