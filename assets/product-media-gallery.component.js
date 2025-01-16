import { EVENTS, subscribe } from 'pubsub'

export class ProductMediaGallery extends HTMLElement {
  connectedCallback() {
    this.variantChangeUnsubscriber = subscribe(EVENTS.variantChange, this.handleVariantChange.bind(this))
  }

  disconnectedCallback() {
    this.variantChangeUnsubscriber()
  }

  handleVariantChange({ detail }) {
    const { sectionId, variant } = detail

    if (!variant || !variant.featured_media) {
      return
    }

    const mediaContainer = this.querySelector(
      `[data-section-id="${sectionId}"][data-media-id="${variant.featured_media.id}"]`
    )

    if (!mediaContainer) {
      return
    }

    const isMobile = window.matchMedia('screen and (max-width: 768px)').matches
    const scrollOptions = isMobile
      ? { left: mediaContainer.offsetLeft - (this.offsetWidth - mediaContainer.offsetWidth) / 2, behavior: 'smooth' }
      : { top: mediaContainer.offsetTop, behavior: 'smooth' }

    isMobile ? this.scrollTo(scrollOptions) : window.scroll(scrollOptions)
  }
}

customElements.define('product-media-gallery', ProductMediaGallery)
