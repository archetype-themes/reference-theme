export class CartNote extends HTMLElement {
  connectedCallback() {
    this.addEventListener('change', this.handleChange.bind(this))
  }

  async handleChange({ target }) {
    if (target.getAttribute('name') !== 'note') return

    await this.updateCart({ note: target.value })
  }

  async updateCart(body) {
    const response = await fetch(`${window.Shopify.routes.root}cart/update.js`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true
    })

    if (!response.ok) {
      console.error('Failed to update cart')
    }

    return response
  }
}

customElements.define('cart-note', CartNote)
