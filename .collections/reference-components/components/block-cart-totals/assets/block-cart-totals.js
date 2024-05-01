import { EVENTS, subscribe } from '@archetype-themes/utils/pubsub'

export class CartTotalPrice extends HTMLElement {
  connectedCallback() {
    this.lineItemChangeSubscriber = subscribe(EVENTS.lineItemChange, this.handleLineItemChange.bind(this))
  }

  disconnectedCallback() {
    this.lineItemChangeSubscriber()
  }

  handleLineItemChange({ detail }) {
    const { html } = detail
    const price = html.querySelector('cart-total-price').innerText

    this.price = price
  }

  set price(count) {
    this.innerText = count
  }
}

customElements.define('cart-total-price', CartTotalPrice)
