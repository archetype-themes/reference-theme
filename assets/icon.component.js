class Icon extends HTMLElement {
  async connectedCallback() {
    if (!this.src || !this.name) {
      throw new Error('src and name attributes are required for x-icon element')
    }

    try {
      const response = await fetch(this.src)
      const svg = await response.text()

      this.innerHTML = svg
      this.querySelector('svg').classList.add('icon', `icon--${this.name}`)
    } catch (error) {
      console.log(`Error: ${error}`)
    }
  }

  get src() {
    return this.getAttribute('src')
  }

  get name() {
    return this.getAttribute('name')
  }
}

customElements.define('x-icon', Icon)
