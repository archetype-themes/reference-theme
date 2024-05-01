import { EVENTS, subscribe } from '@archetype-themes/utils/pubsub'

export class LineItemPrice extends HTMLElement {
  connectedCallback() {
    this.cartChangeUnsubscriber = subscribe(EVENTS.lineItemChange, this.handleLineItemChange.bind(this))
  }

  disconnectedCallback() {
    this.cartChangeUnsubscriber()
  }

  handleLineItemChange({ detail }) {
    const { html, index } = detail
    if (index !== this.index) return

    this.price = html.querySelector(`line-item-price[index="${this.index}"]`).innerText
  }

  get index() {
    return this.getAttribute('index')
  }

  set price(count) {
    this.innerText = count
  }
}

customElements.define('line-item-price', LineItemPrice)
