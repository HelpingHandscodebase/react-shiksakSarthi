const TOKEN_KEY = 'app_token_v1'
const USER_KEY = 'app_user_v1'

export function setAuth(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function getUser() {
  try {
    const v = localStorage.getItem(USER_KEY)
    return v ? JSON.parse(v) : null
  } catch {
    return null
  }
}

export default {
  setAuth,
  clearAuth,
  getToken,
  getUser
}
