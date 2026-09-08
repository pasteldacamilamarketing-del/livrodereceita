import { BookEngine } from './components/book.js'
import { createLoadingScreen } from './components/loading.js'
import { createNavigation } from './components/navigation.js'
import { createPhotoViewer, createZoomViewer } from './components/viewers.js'
import { PAGE_COUNT, getPage, pageAsset, pages } from './config/book.js'
import { getLastPage, getSoundEnabled, setLastPage, setSoundEnabled } from './utils/storage.js'
import { playPageRustle } from './utils/sound.js'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

function pageFromHash() {
  const match = window.location.hash.match(/^#page=(\d+)$/)
  if (!match) return null
  return clamp(Number(match[1]), 1, PAGE_COUNT)
}

function setHash(page) {
  const next = `#page=${page}`
  if (window.location.hash !== next) history.replaceState(null, '', next)
}

function copyText(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text)
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  textarea.remove()
  return Promise.resolve()
}

function showSecretHeart(anchor) {
  const burst = document.createElement('div')
  burst.className = 'secret-heart-burst'
  burst.setAttribute('aria-hidden', 'true')
  burst.innerHTML = '<span>♥</span><span>♥</span><span>♥</span><span>♥</span><span>♥</span>'
  anchor.appendChild(burst)
  window.setTimeout(() => burst.remove(), 1250)
}

function showFinalFlourish(anchor) {
  const flourish = document.createElement('div')
  flourish.className = 'final-flourish'
  flourish.setAttribute('aria-hidden', 'true')
  flourish.textContent = '♥'
  anchor.appendChild(flourish)
  window.setTimeout(() => flourish.remove(), 1500)
}

function createResumeCard(lastPage, onContinue) {
  const card = document.createElement('aside')
  card.className = 'resume-card'
  card.setAttribute('aria-label', 'Continuar leitura')
  card.innerHTML = `
    <p>Continuar da página ${lastPage}?</p>
    <div>
      <button type="button" data-choice="continue">Continuar</button>
      <button type="button" data-choice="cover">Capa</button>
    </div>
  `
  card.querySelector('[data-choice="continue"]').addEventListener('click', () => {
    card.remove()
    onContinue()
  })
  card.querySelector('[data-choice="cover"]').addEventListener('click', () => card.remove())
  document.body.appendChild(card)
  return card
}

const loading = createLoadingScreen()
const app = document.querySelector('#root')
app.innerHTML = `
  <main class="app-shell" aria-label="Caderno digital de receitas do Pastel da Camila">
    <section class="book-stage" aria-label="Livro de receitas">
      <div id="book" aria-live="off"></div>
    </section>
    <div class="final-effect-anchor" aria-hidden="true"></div>
    <div class="sr-status" aria-live="polite" aria-atomic="true"></div>
  </main>
`

const bookElement = app.querySelector('#book')
const status = app.querySelector('.sr-status')
const finalAnchor = app.querySelector('.final-effect-anchor')
const photoViewer = createPhotoViewer()
const zoomViewer = createZoomViewer()
let soundEnabled = getSoundEnabled()
const hashPage = pageFromHash()
const initialPage = hashPage || 1
let currentPage = initialPage

const navigation = createNavigation({
  pages,
  soundEnabled,
  fullscreenAvailable: Boolean(document.documentElement.requestFullscreen),
})
document.body.appendChild(navigation.element)

const engine = new BookEngine(bookElement, {
  startPage: initialPage,
  onPageChange(pageNumber) {
    currentPage = pageNumber
    const page = getPage(pageNumber)
    navigation.updatePage(pageNumber)
    setHash(pageNumber)
    setLastPage(pageNumber)
    document.title = `${page.section} — ${page.title} | Pastel da Camila`
    status.textContent = `Página ${pageNumber} de ${PAGE_COUNT}. ${page.title}`
    if (pageNumber === 26) showFinalFlourish(finalAnchor)
  },
  onPhoto(pageNumber, rect, label) {
    const page = getPage(pageNumber)
    photoViewer.open(pageAsset(page), rect, label)
  },
  onTurn() {
    if (soundEnabled) playPageRustle()
  },
  onSecret() {
    showSecretHeart(bookElement)
  },
})

navigation.on('prev', () => engine.prev())
navigation.on('next', () => engine.next())
navigation.on('home', () => { navigation.closeUtilities(); engine.home() })
navigation.on('toc', () => engine.toc())
navigation.on('zoom', () => {
  navigation.closeUtilities()
  const page = getPage(currentPage)
  zoomViewer.open(pageAsset(page), `Página ${page.number}: ${page.title}`)
})
navigation.on('share', async () => {
  navigation.closeUtilities()
  const page = getPage(currentPage)
  const shareData = {
    title: 'Caderno de Receitas — Pastel da Camila',
    text: `${page.section}: ${page.title}`,
    url: window.location.href,
  }
  try {
    if (navigator.share) await navigator.share(shareData)
    else {
      await copyText(window.location.href)
      status.textContent = 'Link da página copiado.'
    }
  } catch (error) {
    if (error?.name !== 'AbortError') {
      await copyText(window.location.href)
      status.textContent = 'Link da página copiado.'
    }
  }
})
navigation.on('sound', () => {
  soundEnabled = !soundEnabled
  setSoundEnabled(soundEnabled)
  navigation.updateSound(soundEnabled)
  navigation.closeUtilities()
  status.textContent = soundEnabled ? 'Som de página ativado.' : 'Som de página desativado.'
})
navigation.on('full', async () => {
  navigation.closeUtilities()
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen()
    else await document.exitFullscreen()
  } catch { /* API opcional */ }
})
navigation.onPagePick((page) => engine.goto(page))
navigation.updatePage(initialPage)

window.addEventListener('keydown', (event) => {
  const interactive = ['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)
  if (event.key === 'Escape') {
    if (photoViewer.isOpen()) photoViewer.close()
    else if (zoomViewer.isOpen()) zoomViewer.close()
    else navigation.closeUtilities()
    return
  }
  if (interactive) return
  if (event.key === 'ArrowRight') engine.next()
  if (event.key === 'ArrowLeft') engine.prev()
  if (event.key === 'Home') engine.home()
})

window.addEventListener('hashchange', () => {
  const target = pageFromHash()
  if (target && target !== currentPage) engine.goto(target)
})

let hideTimer = null
function showControls() {
  document.body.classList.add('controls-visible')
  window.clearTimeout(hideTimer)
  hideTimer = window.setTimeout(() => {
    if (!navigation.element.matches(':focus-within')) document.body.classList.remove('controls-visible')
  }, 2800)
}
window.addEventListener('pointermove', showControls, { passive: true })
window.addEventListener('touchstart', showControls, { passive: true })
navigation.element.addEventListener('focusin', () => document.body.classList.add('controls-visible'))
navigation.element.addEventListener('focusout', () => showControls())
showControls()

Promise.all([engine.loadPage(initialPage), engine.loadPage(Math.min(initialPage + 1, PAGE_COUNT))]).then(() => {
  loading.hide()
  const stored = getLastPage()
  if (!hashPage && stored > 2) createResumeCard(stored, () => engine.goto(stored))
})

if ('serviceWorker' in navigator && !['localhost', '127.0.0.1'].includes(window.location.hostname)) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {})
  })
}
