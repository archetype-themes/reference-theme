import { EVENTS, publish, subscribe } from 'pubsub'

class BlockBuyButtons extends HTMLElement {
  connectedCallback() {
    this.addEventListener('submit', this.handleSubmit.bind(this))

    this.variantChangeUnsubscriber = subscribe(EVENTS.variantChange, this.handleVariantChange.bind(this))
    this.cartChangeUnsubscriber = subscribe(EVENTS.cartChange, this.handleCartChange.bind(this))
  }

  disconnectedCallback() {
    this.variantChangeUnsubscriber()
  }

  handleVariantChange({ detail }) {
    const { html, variant } = detail

    if (!variant) {
      this.toggleAddButton(true, this.getLocales().unavailable)
      return
    }

    this.updateVariantInput(variant)
    this.renderProductInfo(html)
  }

  handleCartChange() {
    window.location.href = `${window.Shopify.routes.root}cart`
  }

  renderProductInfo(html) {
    const addButtonUpdated = html.getElementById(`ProductSubmitButton-${this.dataset.sectionId}`)

    if (addButtonUpdated) {
      this.toggleAddButton(addButtonUpdated.hasAttribute('disabled'), this.getLocales().soldOut)
    }
  }

  getLocales() {
    this.locales = this.locales || JSON.parse(this.querySelector('[type="application/json"]').textContent)
    return this.locales
  }

  toggleAddButton(disable = true, text) {
    const productForm = document.getElementById(`product-form-${this.dataset.sectionId}`)

    if (!productForm) return

    const addButton = productForm.querySelector('[name="add"]')
    const addButtonText = productForm.querySelector('[name="add"] > span')

    if (!addButton) return

    if (disable) {
      addButton.setAttribute('disabled', 'disabled')
      if (text) addButtonText.textContent = text
    } else {
      addButton.removeAttribute('disabled')
      addButtonText.textContent = this.getLocales().addToCart
    }
  }

  updateVariantInput(variant) {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.sectionId}, #product-form-installment-${this.dataset.sectionId}`
    )

    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]')
      input.value = variant.id

      input.dispatchEvent(new Event('change', { bubbles: true }))
    })
  }

  async handleSubmit(event) {
    event.preventDefault()
    this.disableAddToCartButton()

    try {
      const responseJson = await this.addVariantToCart()
      const cart = await this.fetchCart()

      publish(EVENTS.cartChange, {
        detail: {
          cart,
          items: 'items' in responseJson ? responseJson['items'] : [responseJson]
        }
      })
    } catch (error) {
      console.error(`Error adding to cart: ${error}`)
    } finally {
      this.enableAddToCartButton()
    }
  }

  async addVariantToCart() {
    const formData = this.getFormDataWithSections()

    const response = await fetch(`${window.Shopify.routes.root}cart/add.js`, {
      method: 'POST',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    return response.json()
  }

  async fetchCart() {
    return (await fetch(`${window.Shopify.routes.root}cart.js`)).json()
  }

  getFormDataWithSections() {
    const productForm = this.querySelector(`#product-form-${this.dataset.sectionId}`)
    const formData = new FormData(productForm)

    formData.set('sections_url', `${window.Shopify.routes.root}variants/${productForm.id.value}`)

    return formData
  }

  enableAddToCartButton() {
    const productForm = document.getElementById(`product-form-${this.dataset.sectionId}`)

    if (!productForm) return

    const addButton = productForm.querySelector('[name="add"]')
    addButton.removeAttribute('disabled')
    addButton.removeAttribute('aria-busy')
  }

  disableAddToCartButton() {
    const productForm = document.getElementById(`product-form-${this.dataset.sectionId}`)

    if (!productForm) return

    const addButton = productForm.querySelector('[name="add"]')
    addButton.setAttribute('disabled', '')
    addButton.setAttribute('aria-busy', 'true')
  }
}

customElements.define('block-buy-buttons', BlockBuyButtons)
