export function createLoadingScreen() {
  const loading = document.createElement('div')
  loading.className = 'loading-screen'
  loading.innerHTML = `
    <img src="./icons/icon-192.png" alt="Pastel da Camila" width="96" height="96" />
    <p>abrindo o caderno…</p>
  `
  document.body.appendChild(loading)
  return {
    hide() {
      loading.classList.add('is-hidden')
      window.setTimeout(() => loading.remove(), 480)
    },
  }
}
