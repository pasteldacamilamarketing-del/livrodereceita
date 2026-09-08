const icon = (name) => {
  const paths = {
    prev: '<path d="M15 18l-6-6 6-6"/><path d="M9 12h10"/>',
    next: '<path d="M9 18l6-6-6-6"/><path d="M5 12h10"/>',
    home: '<path d="M3 11.5L12 4l9 7.5"/><path d="M5.5 10v10h13V10"/>',
    book: '<path d="M4 5.5c3.5 0 6 .8 8 2.3 2-1.5 4.5-2.3 8-2.3v13c-3.5 0-6 .8-8 2.2-2-1.4-4.5-2.2-8-2.2z"/><path d="M12 7.8v12.9"/>',
    zoom: '<circle cx="11" cy="11" r="6"/><path d="M16 16l5 5"/><path d="M11 8v6M8 11h6"/>',
    share: '<circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="M8 11l8-5M8 13l8 5"/>',
    soundOff: '<path d="M11 5L6 9H3v6h3l5 4z"/><path d="M16 9l5 6M21 9l-5 6"/>',
    soundOn: '<path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15 9.5c1.2 1.3 1.2 3.7 0 5M18 7c2.8 2.8 2.8 7.2 0 10"/>',
    full: '<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/>',
    more: '<circle cx="5" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.2" fill="currentColor" stroke="none"/>',
  }
  return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`
}

function controlButton(action, label, iconName, extraClass = '') {
  return `<button type="button" class="nav-button ${extraClass}" data-action="${action}" aria-label="${label}" title="${label}">${icon(iconName)}</button>`
}

export function createNavigation({ pages, soundEnabled, fullscreenAvailable }) {
  const nav = document.createElement('nav')
  nav.className = 'navigation-dock'
  nav.setAttribute('aria-label', 'Navegação do caderno')
  nav.innerHTML = `
    <div class="primary-controls">
      ${controlButton('toc', 'Ir para o sumário', 'book')}
      ${controlButton('prev', 'Página anterior', 'prev')}
      <label class="page-picker-wrap" aria-label="Escolher página">
        <select class="page-picker" aria-label="Escolher página">
          ${pages.map((page) => `<option value="${page.number}">${page.number}</option>`).join('')}
        </select>
        <span class="page-indicator" aria-live="polite">1 / ${pages.length}</span>
      </label>
      ${controlButton('next', 'Próxima página', 'next')}
      ${controlButton('more', 'Mais opções', 'more')}
    </div>
    <div class="utility-panel" hidden>
      ${controlButton('home', 'Ir para a capa', 'home', 'utility-button')}
      ${controlButton('zoom', 'Ampliar página', 'zoom', 'utility-button')}
      ${controlButton('share', 'Compartilhar página', 'share', 'utility-button')}
      <button type="button" class="nav-button utility-button" data-action="sound" aria-label="${soundEnabled ? 'Desativar som de página' : 'Ativar som de página'}" title="${soundEnabled ? 'Desativar som de página' : 'Ativar som de página'}">${icon(soundEnabled ? 'soundOn' : 'soundOff')}</button>
      ${fullscreenAvailable ? controlButton('full', 'Tela cheia', 'full', 'utility-button') : ''}
    </div>
  `

  const picker = nav.querySelector('.page-picker')
  const indicator = nav.querySelector('.page-indicator')
  const utilities = nav.querySelector('.utility-panel')
  const more = nav.querySelector('[data-action="more"]')
  more.addEventListener('click', () => {
    utilities.hidden = !utilities.hidden
    more.setAttribute('aria-expanded', String(!utilities.hidden))
  })

  return {
    element: nav,
    on(action, handler) {
      const target = nav.querySelector(`[data-action="${action}"]`)
      if (target) target.addEventListener('click', handler)
    },
    onPagePick(handler) {
      picker.addEventListener('change', () => handler(Number(picker.value)))
    },
    updatePage(page) {
      picker.value = String(page)
      indicator.textContent = `${page} / ${pages.length}`
      nav.querySelector('[data-action="prev"]').disabled = page <= 1
      nav.querySelector('[data-action="next"]').disabled = page >= pages.length
    },
    updateSound(enabled) {
      const button = nav.querySelector('[data-action="sound"]')
      button.innerHTML = icon(enabled ? 'soundOn' : 'soundOff')
      button.setAttribute('aria-label', enabled ? 'Desativar som de página' : 'Ativar som de página')
      button.title = enabled ? 'Desativar som de página' : 'Ativar som de página'
    },
    closeUtilities() {
      utilities.hidden = true
      more.setAttribute('aria-expanded', 'false')
    },
  }
}
