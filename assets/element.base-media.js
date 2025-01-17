import inView from 'vendor.in-view'

export default class extends HTMLElement {
  constructor() {
    super()

    const handler = {
      get: (target, prop) => {
        return async () => {
          target = await target
          this.playerHandler(target, prop)
        }
      }
    }

    this.player = new Proxy(this.getPlayerTarget(), handler)
    this.pausedByUser = false
    this.playingWhenLastViewed = false

    inView(this, () => {
      if ((this.autoplay && !this.pausedByUser) || this.playingWhenLastViewed) {
        this.play()
      }

      return () => {
        this.playingWhenLastViewed = this.playing
        this.pause()
      }
    })
  }

  static get observedAttributes() {
    return ['playing']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name !== 'playing') return

    if (oldValue === null && newValue === '') {
      this.dispatchEvent(new CustomEvent('media:play', { bubbles: true }))
    } else if (newValue === null) {
      this.dispatchEvent(new CustomEvent('media:pause', { bubbles: true }))
    }
  }

  play() {
    this.pausedByUser = false

    if (this.playing) return
    this.player.play()
    this.playingWhenLastViewed = true
  }

  pause() {
    this.pausedByUser = true

    if (!this.playing) return
    this.player.pause()
  }

  getPlayerTarget() {
    throw new Error('getPlayerTarget must be implemented in a subclass')
  }

  playerHandler() {
    throw new Error('playerHandler must be implemented in a subclass')
  }

  get playing() {
    return this.hasAttribute('playing')
  }

  get autoplay() {
    return this.hasAttribute('autoplay')
  }
}
