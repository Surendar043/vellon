/**
 * Vellum — the vanilla layer.
 *
 * This file is intentionally plain, framework-free JavaScript. It is loaded
 * with a classic <script> tag, not as a module, and it is never bundled with
 * the React application.
 *
 * Two things live here:
 *
 *   1. `<fd-counter>` — a custom element that counts a number up the first
 *      time it scrolls into view. It needs to work before React mounts and
 *      it owns its own animation frame loop, so a custom element is a
 *      better fit than a React component.
 *
 *   2. A helper that copies text to the clipboard, used by the code sample
 *      in the playground.
 *
 * React renders `<fd-counter>` as an ordinary unknown element and never
 * touches it again.
 */

;(function () {
  'use strict'

  const REDUCED_MOTION = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false }

  /**
   * Eases a value from 0 to 1.
   *
   * @param {number} t
   * @returns {number}
   */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3)
  }

  /**
   * Formats a number the way the statistics band expects: 1.2k, 45, 3.4m.
   *
   * @param {number} value
   * @returns {string}
   */
  function formatValue(value) {
    if (value >= 1000000) return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'm'
    if (value >= 1000) return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
    return String(Math.round(value))
  }

  /**
   * The custom element itself.
   *
   * The configuration is read from attributes, and the matching properties
   * are reflected back onto those attributes. React assigns to properties
   * rather than attributes when the property exists on the element, so both
   * routes have to work.
   */
  class FdCounter extends HTMLElement {
    static get observedAttributes() {
      return ['value', 'decimals', 'suffix']
    }

    constructor() {
      super()
      this._target = 0
      this._decimals = 0
      this._suffix = ''
      this._started = false
      this._frame = 0
      this._observer = null
    }

    /**
     * Reads the configuration and starts watching for the scroll into view.
     */
    connectedCallback() {
      this._read()
      this._started = true
      this._render(this._target)

      if (typeof IntersectionObserver === 'undefined') {
        this._run()
        return
      }

      this._observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              this._run()
              this._observer.disconnect()
              break
            }
          }
        },
        { threshold: 0.4 },
      )

      this._observer.observe(this)
    }

    /**
     * React assigns to the property, so the attribute has to be updated too.
     */
    attributeChangedCallback() {
      this._read()
      if (this._started) this._render(this._target)
    }

    disconnectedCallback() {
      if (this._frame) cancelAnimationFrame(this._frame)
      if (this._observer) this._observer.disconnect()
    }

    /* --------------------------- Reflected props -------------------------- */

    get value() {
      return Number(this.getAttribute('value') || '0')
    }

    set value(next) {
      this.setAttribute('value', String(next))
    }

    get decimals() {
      return parseInt(this.getAttribute('decimals') || '0', 10)
    }

    set decimals(next) {
      this.setAttribute('decimals', String(next))
    }

    get suffix() {
      return this.getAttribute('suffix') || ''
    }

    set suffix(next) {
      this.setAttribute('suffix', String(next))
    }

    /* ------------------------------ Internals ----------------------------- */

    /**
     * Re-reads the configuration from the attributes.
     */
    _read() {
      this._target = Number(this.getAttribute('value') || '0')
      this._decimals = parseInt(this.getAttribute('decimals') || '0', 10)
      this._suffix = this.getAttribute('suffix') || ''
    }

    /**
     * Runs the count-up animation.
     */
    _run() {
      if (this._frame) return

      if (REDUCED_MOTION.matches) {
        this._render(this._target)
        return
      }

      const duration = 1400
      const startedAt = performance.now()

      const step = (now) => {
        const progress = Math.min(1, (now - startedAt) / duration)
        this._render(this._target * easeOutCubic(progress))
        if (progress < 1) this._frame = requestAnimationFrame(step)
      }

      this._frame = requestAnimationFrame(step)
    }

    /**
     * @param {number} value
     */
    _render(value) {
      const text =
        (this._decimals > 0 ? value.toFixed(this._decimals) : formatValue(value)) + this._suffix
      this.textContent = text
    }
  }

  if (!customElements.get('fd-counter')) {
    customElements.define('fd-counter', FdCounter)
  }

  /**
   * Copies text to the clipboard, with a fallback for browsers that do not
   * expose the async clipboard API in an insecure context.
   *
   * @param {string} text
   * @returns {Promise<boolean>}
   */
  window.vellumCopy = function vellumCopy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        () => true,
        () => legacyCopy(text),
      )
    }
    return Promise.resolve(legacyCopy(text))
  }

  /**
   * @param {string} text
   * @returns {boolean}
   */
  function legacyCopy(text) {
    const field = document.createElement('textarea')
    field.value = text
    field.setAttribute('readonly', '')
    field.style.position = 'fixed'
    field.style.opacity = '0'
    document.body.appendChild(field)
    field.select()

    try {
      const copied = document.execCommand('copy')
      document.body.removeChild(field)
      return copied
    } catch {
      document.body.removeChild(field)
      return false
    }
  }
})()
