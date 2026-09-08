import {
  coverOpenHotspot,
  coverSecretHotspot,
  photoHotspotsByPage,
  tabHotspots,
  tocCategoryHotspots,
  tocRecipeHotspots,
} from '../config/hotspots.js'

function applyRect(element, rect) {
  element.style.left = `${rect.x}%`
  element.style.top = `${rect.y}%`
  element.style.width = `${rect.width}%`
  element.style.height = `${rect.height}%`
}

function buttonFor(rect, ariaLabel, className, handler) {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = `hotspot ${className}`
  button.setAttribute('aria-label', ariaLabel)
  button.title = ariaLabel
  applyRect(button, rect)
  button.addEventListener('pointerdown', (event) => event.stopPropagation())
  button.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()
    handler()
  })
  return button
}

export function createPageTabs(onNavigate) {
  const layer = document.createElement('div')
  layer.className = 'hotspot-layer page-tabs'
  tabHotspots.forEach((hotspot) => {
    layer.appendChild(buttonFor(
      hotspot,
      `Ir para receitas ${hotspot.label}`,
      'tab-hotspot',
      () => onNavigate(hotspot.targetPage),
    ))
  })
  return layer
}

export function createTableOfContentsHotspots(onNavigate) {
  const layer = document.createElement('div')
  layer.className = 'hotspot-layer toc-hotspots'
  ;[...tocCategoryHotspots, ...tocRecipeHotspots].forEach((hotspot) => {
    layer.appendChild(buttonFor(
      hotspot,
      `Ir para ${hotspot.label}`,
      'toc-hotspot',
      () => onNavigate(hotspot.targetPage),
    ))
  })
  return layer
}

export function createPhotoHotspots(pageNumber, onPhoto) {
  const hotspots = photoHotspotsByPage[pageNumber] || []
  if (!hotspots.length) return null
  const layer = document.createElement('div')
  layer.className = 'hotspot-layer photo-hotspots'
  hotspots.forEach((hotspot) => {
    layer.appendChild(buttonFor(
      hotspot,
      hotspot.label,
      'photo-hotspot',
      () => onPhoto(pageNumber, hotspot, hotspot.label),
    ))
  })
  return layer
}

export function createCoverHotspots(onNavigate, onSecret) {
  const layer = document.createElement('div')
  layer.className = 'hotspot-layer cover-hotspots'
  layer.appendChild(buttonFor(
    coverOpenHotspot,
    'Abrir caderno',
    'cover-open-hotspot',
    () => onNavigate(coverOpenHotspot.targetPage),
  ))

  let taps = 0
  let resetTimer = null
  const secret = buttonFor(coverSecretHotspot, 'Detalhe do logo', 'secret-hotspot', () => {
    taps += 1
    window.clearTimeout(resetTimer)
    resetTimer = window.setTimeout(() => { taps = 0 }, 1400)
    if (taps >= 3) {
      taps = 0
      onSecret()
    }
  })
  layer.appendChild(secret)
  return layer
}
