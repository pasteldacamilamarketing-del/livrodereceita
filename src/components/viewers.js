export function createPhotoViewer() {
  const overlay = document.createElement('div')
  overlay.className = 'viewer photo-viewer'
  overlay.hidden = true
  overlay.setAttribute('role', 'dialog')
  overlay.setAttribute('aria-modal', 'true')
  overlay.setAttribute('aria-label', 'Foto ampliada')
  overlay.innerHTML = `
    <button class="viewer-close" type="button" aria-label="Fechar foto">×</button>
    <figure class="polaroid-expanded">
      <div class="photo-crop" role="img"></div>
    </figure>
  `
  const crop = overlay.querySelector('.photo-crop')
  const close = () => {
    overlay.hidden = true
    document.body.classList.remove('viewer-open')
  }
  overlay.querySelector('.viewer-close').addEventListener('click', close)
  overlay.addEventListener('pointerdown', (event) => {
    if (event.target === overlay) close()
  })
  document.body.appendChild(overlay)

  return {
    open(src, rect, label) {
      const xScale = 100 / rect.width
      const yScale = 100 / rect.height
      crop.style.aspectRatio = `${rect.width} / ${rect.height}`
      crop.style.backgroundImage = `url("${src}")`
      crop.style.backgroundSize = `${xScale * 100}% ${yScale * 100}%`
      crop.style.backgroundPosition = `${(rect.x / (100 - rect.width)) * 100}% ${(rect.y / (100 - rect.height)) * 100}%`
      crop.setAttribute('aria-label', label)
      overlay.hidden = false
      document.body.classList.add('viewer-open')
      overlay.querySelector('.viewer-close').focus({ preventScroll: true })
    },
    close,
    isOpen: () => !overlay.hidden,
  }
}

export function createZoomViewer() {
  const overlay = document.createElement('div')
  overlay.className = 'viewer zoom-viewer'
  overlay.hidden = true
  overlay.setAttribute('role', 'dialog')
  overlay.setAttribute('aria-modal', 'true')
  overlay.setAttribute('aria-label', 'Página ampliada')
  overlay.innerHTML = `
    <div class="zoom-toolbar" role="toolbar" aria-label="Controles de zoom">
      <button type="button" data-action="out" aria-label="Diminuir zoom">−</button>
      <span class="zoom-level" aria-live="polite">100%</span>
      <button type="button" data-action="in" aria-label="Aumentar zoom">+</button>
      <button type="button" data-action="reset" aria-label="Restaurar zoom">1:1</button>
      <button type="button" data-action="close" aria-label="Fechar ampliação">×</button>
    </div>
    <div class="zoom-scroll">
      <img alt="" draggable="false" />
    </div>
  `
  const img = overlay.querySelector('img')
  const level = overlay.querySelector('.zoom-level')
  const scroller = overlay.querySelector('.zoom-scroll')
  let zoom = 1

  const apply = () => {
    img.style.width = `${Math.round(zoom * 100)}%`
    level.textContent = `${Math.round(zoom * 100)}%`
  }
  const close = () => {
    overlay.hidden = true
    document.body.classList.remove('viewer-open')
    zoom = 1
    apply()
  }
  overlay.querySelector('[data-action="in"]').addEventListener('click', () => {
    zoom = Math.min(3, Math.round((zoom + 0.25) * 100) / 100)
    apply()
  })
  overlay.querySelector('[data-action="out"]').addEventListener('click', () => {
    zoom = Math.max(0.75, Math.round((zoom - 0.25) * 100) / 100)
    apply()
  })
  overlay.querySelector('[data-action="reset"]').addEventListener('click', () => {
    zoom = 1
    scroller.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    apply()
  })
  overlay.querySelector('[data-action="close"]').addEventListener('click', close)
  overlay.addEventListener('pointerdown', (event) => {
    if (event.target === overlay) close()
  })
  document.body.appendChild(overlay)

  return {
    open(src, label) {
      img.src = src
      img.alt = label
      zoom = 1
      apply()
      overlay.hidden = false
      document.body.classList.add('viewer-open')
      overlay.querySelector('[data-action="close"]').focus({ preventScroll: true })
    },
    close,
    isOpen: () => !overlay.hidden,
  }
}
