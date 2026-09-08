import { PAGE_COUNT, getPage, pageAsset } from '../config/book.js'
import {
  createCoverHotspots,
  createPageTabs,
  createPhotoHotspots,
  createTableOfContentsHotspots,
} from './hotspots.js'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export class BookEngine {
  constructor(container, options = {}) {
    this.container = container
    this.currentPage = clamp(options.startPage || 1, 1, PAGE_COUNT)
    this.onPageChange = options.onPageChange || (() => {})
    this.onPhoto = options.onPhoto || (() => {})
    this.onTurn = options.onTurn || (() => {})
    this.onSecret = options.onSecret || (() => {})
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    this.drag = null
    this.busy = false
    this.loaded = new Map()

    this.build()
    this.bindPointerGestures()
    this.renderPage(this.currentPage, { announce: false })
    this.preloadAround(this.currentPage)
  }

  build() {
    this.container.classList.add('book-frame')
    this.container.innerHTML = `
      <div class="under-page" aria-hidden="true"><img draggable="false" alt="" /></div>
      <div class="page-surface">
        <div class="page-face page-front"></div>
        <div class="page-face page-back" aria-hidden="true"><img draggable="false" alt="" /></div>
        <div class="flip-shade" aria-hidden="true"></div>
      </div>
      <div class="page-edge-glow" aria-hidden="true"></div>
    `
    this.surface = this.container.querySelector('.page-surface')
    this.front = this.container.querySelector('.page-front')
    this.backImg = this.container.querySelector('.page-back img')
    this.underImg = this.container.querySelector('.under-page img')
    this.shade = this.container.querySelector('.flip-shade')
  }

  async loadPage(pageNumber) {
    const page = getPage(pageNumber)
    if (this.loaded.has(page.number)) return this.loaded.get(page.number)
    const promise = new Promise((resolve) => {
      const image = new Image()
      image.decoding = 'async'
      image.onload = () => resolve(pageAsset(page))
      image.onerror = () => resolve(pageAsset(page))
      image.src = pageAsset(page)
    })
    this.loaded.set(page.number, promise)
    return promise
  }

  preloadAround(pageNumber) {
    for (let offset = -2; offset <= 2; offset += 1) {
      const candidate = pageNumber + offset
      if (candidate >= 1 && candidate <= PAGE_COUNT) this.loadPage(candidate)
    }
  }

  renderPage(pageNumber, { announce = true } = {}) {
    const page = getPage(pageNumber)
    this.currentPage = page.number
    this.front.innerHTML = ''
    const image = document.createElement('img')
    image.className = 'page-image'
    image.src = pageAsset(page)
    image.alt = `${page.section}: ${page.title}`
    image.draggable = false
    image.decoding = 'async'
    image.fetchPriority = page.number <= 2 ? 'high' : 'auto'
    this.front.appendChild(image)

    this.front.appendChild(createPageTabs((target) => this.goto(target)))
    if (page.number === 1) this.front.appendChild(createCoverHotspots((target) => this.goto(target), this.onSecret))
    if (page.number === 2) this.front.appendChild(createTableOfContentsHotspots((target) => this.goto(target)))
    const photos = createPhotoHotspots(page.number, this.onPhoto)
    if (photos) this.front.appendChild(photos)

    this.surface.style.transition = 'none'
    this.surface.style.transform = 'rotateY(0deg)'
    this.surface.style.transformOrigin = 'left center'
    this.shade.style.opacity = '0'
    this.backImg.removeAttribute('src')
    this.underImg.src = image.src
    this.container.dataset.page = String(page.number)
    this.preloadAround(page.number)
    if (announce) this.onPageChange(page.number)
  }

  async animateTo(targetPage, direction = null) {
    const target = clamp(targetPage, 1, PAGE_COUNT)
    if (target === this.currentPage || this.busy) return
    this.busy = true
    const forward = direction ? direction === 'forward' : target > this.currentPage
    const src = await this.loadPage(target)
    this.backImg.src = src
    this.underImg.src = src
    this.surface.style.transformOrigin = forward ? 'left center' : 'right center'
    this.container.classList.add('is-turning')

    if (this.reducedMotion) {
      this.busy = false
      this.renderPage(target)
      this.onTurn()
      this.container.classList.remove('is-turning')
      return
    }

    this.surface.style.transition = 'transform 460ms cubic-bezier(.22,.72,.16,1), filter 460ms ease'
    requestAnimationFrame(() => {
      this.shade.style.transition = 'opacity 220ms ease'
      this.shade.style.opacity = '0.22'
      this.surface.style.transform = `rotateY(${forward ? -180 : 180}deg)`
    })
    await sleep(470)
    this.busy = false
    this.renderPage(target)
    this.onTurn()
    this.container.classList.remove('is-turning')
  }

  goto(pageNumber) {
    return this.animateTo(pageNumber)
  }

  next() {
    if (this.currentPage < PAGE_COUNT) return this.animateTo(this.currentPage + 1, 'forward')
  }

  prev() {
    if (this.currentPage > 1) return this.animateTo(this.currentPage - 1, 'backward')
  }

  home() { return this.goto(1) }
  toc() { return this.goto(2) }

  setDragTransform(progress, direction) {
    const p = clamp(progress, 0, 1)
    const angle = p * 165 * (direction === 'forward' ? -1 : 1)
    this.surface.style.transition = 'none'
    this.surface.style.transformOrigin = direction === 'forward' ? 'left center' : 'right center'
    this.surface.style.transform = `rotateY(${angle}deg)`
    this.shade.style.transition = 'none'
    this.shade.style.opacity = String(Math.sin(Math.PI * p) * 0.32)
  }

  async finishDrag(commit) {
    if (!this.drag) return
    const { direction, target, progress } = this.drag
    this.drag = null
    this.container.classList.remove('is-dragging')
    if (!direction || !target) {
      this.surface.style.transform = 'rotateY(0deg)'
      return
    }

    if (!commit) {
      this.surface.style.transition = 'transform 210ms ease-out'
      this.shade.style.transition = 'opacity 180ms ease'
      this.shade.style.opacity = '0'
      this.surface.style.transform = 'rotateY(0deg)'
      await sleep(220)
      return
    }

    this.busy = true
    this.surface.style.transition = `transform ${Math.round(360 * (1 - progress) + 90)}ms cubic-bezier(.22,.72,.16,1)`
    this.shade.style.transition = 'opacity 180ms ease'
    this.shade.style.opacity = '0.12'
    this.surface.style.transform = `rotateY(${direction === 'forward' ? -180 : 180}deg)`
    await sleep(Math.round(360 * (1 - progress) + 110))
    this.busy = false
    this.renderPage(target)
    this.onTurn()
  }

  bindPointerGestures() {
    this.container.addEventListener('pointerdown', async (event) => {
      if (this.busy || event.button > 0) return
      if (event.target.closest('button, select, a')) return
      const rect = this.container.getBoundingClientRect()
      this.drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startTime: performance.now(),
        progress: 0,
        direction: null,
        target: null,
        rect,
      }
      this.container.setPointerCapture?.(event.pointerId)
    })

    this.container.addEventListener('pointermove', async (event) => {
      if (!this.drag || this.drag.pointerId !== event.pointerId || this.busy) return
      const dx = event.clientX - this.drag.startX
      const dy = event.clientY - this.drag.startY
      if (!this.drag.direction) {
        if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return
        const direction = dx < 0 ? 'forward' : 'backward'
        const target = this.currentPage + (direction === 'forward' ? 1 : -1)
        if (target < 1 || target > PAGE_COUNT) return
        this.drag.direction = direction
        this.drag.target = target
        const src = await this.loadPage(target)
        if (!this.drag) return
        this.backImg.src = src
        this.underImg.src = src
        this.container.classList.add('is-dragging')
      }
      const progress = clamp(Math.abs(dx) / this.drag.rect.width, 0, 1)
      this.drag.progress = progress
      this.setDragTransform(progress, this.drag.direction)
    })

    const release = async (event) => {
      if (!this.drag || this.drag.pointerId !== event.pointerId) return
      const drag = this.drag
      const dx = event.clientX - drag.startX
      const elapsed = Math.max(1, performance.now() - drag.startTime)
      const velocity = Math.abs(dx) / elapsed
      if (!drag.direction && Math.abs(dx) < 8) {
        this.drag = null
        const relativeX = (event.clientX - drag.rect.left) / drag.rect.width
        if (relativeX <= 0.16) this.prev()
        else if (relativeX >= 0.84) this.next()
        return
      }
      const commit = drag.progress >= 0.22 || velocity >= 0.55
      await this.finishDrag(commit)
    }

    this.container.addEventListener('pointerup', release)
    this.container.addEventListener('pointercancel', async (event) => {
      if (this.drag?.pointerId === event.pointerId) await this.finishDrag(false)
    })
  }
}
