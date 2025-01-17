import { EVENTS, subscribe } from 'util.pubsub'

class CartCount extends HTMLElement {
  connectedCallback() {
    this.cartChangeUnsubscriber = subscribe(EVENTS.cartChange, this.handleCartChange.bind(this))
  }

  disconnectedCallback() {
    this.cartChangeUnsubscriber()
  }

  handleCartChange({ detail }) {
    const { cart } = detail
    this.itemCount = cart.item_count
  }

  get itemCount() {
    return parseInt(this.innerText)
  }

  set itemCount(count) {
    if (this.itemCount === count) return

    this.innerText = count.toString()
    this.hidden = count === 0
  }
}

customElements.define('cart-count', CartCount)
