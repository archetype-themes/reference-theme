import { EVENTS, subscribe } from 'pubsub'

class BlockPrice extends HTMLElement {
  connectedCallback() {
    this.variantChangeUnsubscriber = subscribe(EVENTS.variantChange, this.handleVariantChange.bind(this))
  }

  disconnectedCallback() {
    this.variantChangeUnsubscriber()
  }

  handleVariantChange({ detail }) {
    const { html, variant } = detail

    if (!variant) {
      this.querySelector('[data-price-container]').innerHTML = '&nbsp;'
      return
    }

    const priceSource = html.querySelector(
      `block-price[data-section-id="${this.dataset.sectionId}"] [data-price-container]`
    )
    const priceDestination = this.querySelector('[data-price-container]')

    if (priceSource && priceDestination) {
      priceDestination.outerHTML = priceSource.outerHTML
    }
  }
}

customElements.define('block-price', BlockPrice)
