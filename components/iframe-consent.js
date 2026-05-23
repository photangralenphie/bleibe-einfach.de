class IframeConsentBanner extends HTMLElement {
    connectedCallback() {
        this.render()
        this.attachEvents()
        window.addEventListener('iframe-consent-updated', () => this.updateVisibility())
        this.updateVisibility()
    }

    render() {
        this.innerHTML = `
            <div class="iframe-consent-banner" role="region" aria-label="Externe Inhalte laden">
                <p>Externe Inhalte von Google Maps und Google Kalender laden? Dabei können personenbezogene Daten an Google übermittelt werden.</p>
                <p><a href="https://policies.google.com/privacy?hl=de" target="_blank" rel="noopener noreferrer">Datenschutzhinweise von Google</a></p>
                <button type="button" class="iframe-consent-btn" data-consent-action="accept-all">Alle Google-Inhalte laden</button>
                <label class="iframe-consent-remember">
                    <input type="checkbox" data-consent-remember checked>
                    Immer erlauben
                </label>
            </div>
        `
    }

    attachEvents() {
        const button = this.querySelector('[data-consent-action="accept-all"]')
        if (!button) {
            return
        }

        button.addEventListener('click', () => {
            const rememberCheckbox = this.querySelector('[data-consent-remember]')
            const persist = rememberCheckbox ? rememberCheckbox.checked : true
            window.iframeConsentManager?.acceptAll(persist)
        })
    }

    updateVisibility() {
        const hasPending = !!document.querySelector('.google-embed-consent[data-consent-loaded="false"]')
        this.style.display = hasPending ? 'block' : 'none'
    }
}

class IframeConsentManager {
    constructor(selector) {
        this.storageKey = 'bleibeEinfachIframeConsent'
        this.selector = selector
        this.consents = this.readConsents()
    }

    init() {
        const placeholders = document.querySelectorAll(this.selector)
        placeholders.forEach(placeholder => this.initPlaceholder(placeholder))
    }

    initPlaceholder(placeholder) {
        const service = placeholder.dataset.consentService
        const src = placeholder.dataset.iframeSrc
        const title = placeholder.dataset.iframeTitle || 'Externer Inhalt'

        if (!service || !src) {
            return
        }

        placeholder.dataset.consentLoaded = 'false'

        if (this.hasConsent(service)) {
            this.loadIframe(placeholder)
            return
        }

        this.renderPlaceholder(placeholder, service, title)
    }

    renderPlaceholder(placeholder, service, title) {
        const serviceLabel = service === 'calendar' ? 'Google Kalender' : 'Google Maps'
        const consentMessage = placeholder.dataset.consentMessage || `Zum Anzeigen von ${title} werden Inhalte von ${serviceLabel} geladen.`
        const dataTransferHint = 'Dabei können personenbezogene Daten an Google übermittelt werden.'

        placeholder.innerHTML = `
            <div class="iframe-consent-box" role="note">
                <p>${consentMessage} ${dataTransferHint}</p>
                <p><a href="https://policies.google.com/privacy?hl=de" target="_blank" rel="noopener noreferrer">Datenschutzhinweise von Google</a></p>
                <label class="iframe-consent-remember">
                    <input type="checkbox" data-consent-remember checked>
                    Immer erlauben
                </label>
                <button type="button" class="iframe-consent-btn" data-consent-load="${service}">${serviceLabel} laden</button>
            </div>
        `

        const button = placeholder.querySelector('[data-consent-load]')
        if (!button) {
            return
        }

        button.addEventListener('click', () => {
            const rememberCheckbox = placeholder.querySelector('[data-consent-remember]')
            const persist = rememberCheckbox ? rememberCheckbox.checked : true
            this.setConsent(service, true, persist)
            this.loadByService(service)
        })
    }

    loadByService(service) {
        const placeholders = document.querySelectorAll(`${this.selector}[data-consent-service="${service}"]`)
        placeholders.forEach(placeholder => this.loadIframe(placeholder))
        this.notifyUpdate()
    }

    loadIframe(placeholder) {
        if (placeholder.dataset.consentLoaded === 'true') {
            return
        }

        const src = placeholder.dataset.iframeSrc
        const title = placeholder.dataset.iframeTitle || 'Externer Inhalt'

        const iframe = document.createElement('iframe')
        iframe.src = src
        iframe.title = title
        iframe.allowFullscreen = true
        iframe.loading = 'lazy'
        iframe.referrerPolicy = 'strict-origin-when-cross-origin'

        placeholder.innerHTML = ''
        placeholder.appendChild(iframe)
        placeholder.dataset.consentLoaded = 'true'
    }

    acceptAll(persist = true) {
        this.setConsent('maps', true, persist)
        this.setConsent('calendar', true, persist)
        this.loadByService('maps')
        this.loadByService('calendar')
    }

    hasConsent(service) {
        return this.consents[service] === true
    }

    setConsent(service, value, persist = true) {
        this.consents[service] = value

        if (persist) {
            localStorage.setItem(this.storageKey, JSON.stringify(this.consents))
        }
    }

    readConsents() {
        try {
            const raw = localStorage.getItem(this.storageKey)
            return raw ? JSON.parse(raw) : {}
        } catch (error) {
            return {}
        }
    }

    notifyUpdate() {
        window.dispatchEvent(new Event('iframe-consent-updated'))
    }
}

customElements.define('iframe-consent-banner', IframeConsentBanner)

window.iframeConsentManager = new IframeConsentManager('.google-embed-consent')
window.iframeConsentManager.init()
window.iframeConsentManager.notifyUpdate()
