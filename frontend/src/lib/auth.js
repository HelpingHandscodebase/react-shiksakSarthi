// Authentication removed — keep no-op helpers for compatibility.
export function setAuth() {}
export function clearAuth() {}
export function getToken() { return ''; }
export function getUser() { return null; }

export default {
  setAuth,
  clearAuth,
  getToken,
  getUser
}
