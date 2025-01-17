import { EVENTS, subscribe } from 'util.pubsub'

export class CartStatusNotifier extends HTMLElement {
  connectedCallback() {
    this.cartBeforeChangeUnsubscriber = subscribe(EVENTS.cartBeforeChange, this.handleBeforeCartChange.bind(this))
    this.cartErrorUnsubscriber = subscribe(EVENTS.cartError, this.handleCartError.bind(this))
  }

  disconnectedCallback() {
    this.cartBeforeChangeUnsubscriber()
    this.cartErrorUnsubscriber()
  }

  handleBeforeCartChange() {
    this.hidden = true
  }

  handleCartError({ detail }) {
    const { errors } = detail
    this.querySelector('span').innerText = errors

    this.hidden = false
  }

  set text(text) {
    this.innerText = text
  }
}

customElements.define('cart-status-notifier', CartStatusNotifier)
