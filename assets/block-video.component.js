import BaseMedia from 'base-media'
import loadScript from 'script-loader'

const onYouTubePromise = new Promise((resolve) => {
  window.onYouTubeIframeAPIReady = () => resolve()
})

export class VideoMedia extends BaseMedia {
  connectedCallback() {
    if (!this.autoplay) {
      this.addEventListener('click', this.play.bind(this), { once: true })
    }
  }

  getPlayerTarget() {
    this.setAttribute('loaded', '')

    if (this.host) {
      return this.setupThirdPartyVideoElement()
    } else {
      return this.setupNativeVideoElement()
    }
  }

  playerHandler(target, prop) {
    if (this.host === 'youtube') {
      prop === 'play' ? target.playVideo() : target.pauseVideo()
    } else {
      target[prop]()
    }
  }

  async setupThirdPartyVideoElement() {
    let player
    const template = this.querySelector('template')

    if (template) {
      template.replaceWith(template.content.firstElementChild.cloneNode(true))
    }

    if (this.host === 'youtube') {
      player = await this.setupYouTubePlayer()
    } else {
      player = await this.setupVimeoPlayer()
    }

    return player
  }

  setupNativeVideoElement() {
    const video = this.querySelector('video')

    video.addEventListener('play', () => {
      this.setAttribute('playing', '')
    })

    video.addEventListener('pause', () => {
      if (video.paused && !video.seeking) {
        this.removeAttribute('playing')
      }
    })

    video.addEventListener('click', () => {
      if (video.paused) {
        video.play()
      } else {
        video.pause()
      }
    })

    return video
  }

  setupYouTubePlayer() {
    return new Promise(async (resolve) => {
      if (!window.YT?.Player) {
        await loadScript('https://www.youtube.com/iframe_api')
      }

      await onYouTubePromise

      const player = new YT.Player(this.querySelector('iframe'), {
        events: {
          onReady: () => {
            resolve(player)
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
              this.setAttribute('playing', '')
            } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
              this.removeAttribute('playing')
            }
          }
        }
      })
    })
  }

  setupVimeoPlayer() {
    return new Promise(async (resolve) => {
      if (!window.Vimeo?.Player) {
        await loadScript('https://player.vimeo.com/api/player.js')
      }

      const player = new Vimeo.Player(this.querySelector('iframe'))

      player.on('play', () => this.setAttribute('playing', ''))
      player.on('pause', () => this.removeAttribute('playing'))
      player.on('ended', () => this.removeAttribute('playing'))

      resolve(player)
    })
  }

  get host() {
    return this.getAttribute('host')
  }
}

customElements.define('video-media', VideoMedia)
