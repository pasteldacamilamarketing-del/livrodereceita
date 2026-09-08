const KEYS = {
  lastPage: 'caderno-camila:last-page',
  sound: 'caderno-camila:sound',
}

export function getLastPage() {
  const value = Number(localStorage.getItem(KEYS.lastPage))
  return Number.isInteger(value) && value >= 1 && value <= 26 ? value : 1
}

export function setLastPage(page) {
  localStorage.setItem(KEYS.lastPage, String(page))
}

export function getSoundEnabled() {
  return localStorage.getItem(KEYS.sound) === 'on'
}

export function setSoundEnabled(enabled) {
  localStorage.setItem(KEYS.sound, enabled ? 'on' : 'off')
}
