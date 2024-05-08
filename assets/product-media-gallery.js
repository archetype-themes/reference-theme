import { EVENTS, subscribe } from '@archetype-themes/utils/pubsub'

export class ProductMediaGallery extends HTMLElement {
  connectedCallback() {
    this.variantChangeUnsubscriber = subscribe(EVENTS.variantChange, this.handleVariantChange.bind(this))
  }

  disconnectedCallback() {
    this.variantChangeUnsubscriber()
  }

  handleVariantChange({ detail }) {
    const { sectionId, variant } = detail

    if (!variant) {
      return
    }

    const mediaContainer = this.querySelector(`[data-section-id="${sectionId}"][data-media-id="${variant.featured_media.id}"]`)

    if (!mediaContainer) {
      return
    }

    window.scroll({
      top: mediaContainer.offsetTop,
      behavior: 'smooth'
    })
  }
}

customElements.define('product-media-gallery', ProductMediaGallery)
