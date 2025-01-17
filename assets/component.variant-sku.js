import { EVENTS, subscribe } from 'util.pubsub'

class VariantSku extends HTMLElement {
  connectedCallback() {
    this.variantChangeUnsubscriber = subscribe(EVENTS.variantChange, this.handleVariantChange.bind(this))
  }

  disconnectedCallback() {
    this.variantChangeUnsubscriber?.()
  }

  handleVariantChange({ detail }) {
    const { html, sectionId, variant } = detail

    if (!variant) {
      this.textContent = ''
      return
    }

    const skuSource = html.querySelector(`[data-section-id="${sectionId}"] variant-sku`)

    if (skuSource) {
      this.textContent = skuSource.textContent
    }
  }
}

customElements.define('variant-sku', VariantSku)
