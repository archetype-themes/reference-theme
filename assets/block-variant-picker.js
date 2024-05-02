import { EVENTS, publish } from '@archetype-themes/utils/pubsub'

class BlockVariantPicker extends HTMLElement {
  connectedCallback() {
    this.productInfo = new Map()

    this.addEventListener('change', this.handleVariantChange.bind(this))
    this.addEventListener('touchstart', this.handleElementEvent.bind(this))
    this.addEventListener('mousedown', this.handleElementEvent.bind(this))
  }

  handleElementEvent(event) {
    // TODO: evaluate creating a custom dropdown component to listen to touchstart and mousedown events
    const target = event.target.previousElementSibling

    if (target?.tagName !== 'INPUT') {
      return
    }

    this.updateOptions(target)
    this.updateMasterId()
    this.currentVariant && this.getProductInfo()
  }

  async handleVariantChange() {
    this.updateOptions()
    this.updateMasterId()
    this.updateVariantStatuses()

    if (this.currentVariant) {
      this.updateURL()
      const html = await this.getProductInfo()

      publish(EVENTS.variantChange, {
        detail: {
          html,
          sectionId: this.sectionId,
          variant: this.currentVariant
        }
      })
    } else {
      publish(EVENTS.variantChange, {
        detail: {
          html: null,
          sectionId: this.sectionId,
          variant: null
        }
      })
    }
  }

  updateOptions(target) {
    this.options = Array.from(this.querySelectorAll('select, fieldset'), (element) => {
      if (element.tagName === 'SELECT') {
        return element.value
      }

      if (element.tagName === 'FIELDSET') {
        return Array.from(element.querySelectorAll('input')).find(
          (radio) => (target && radio === target) ?? radio.checked
        )?.value
      }
    })
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find(
      (variant) => !variant.options.map((option, index) => this.options[index] === option).includes(false)
    )
  }

  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent)
    return this.variantData
  }

  updateVariantStatuses() {
    const selectedOptionOneVariants = this.variantData.filter(
      (variant) => this.querySelector(':checked').value === variant.option1
    )
    const inputWrappers = [...this.querySelectorAll('fieldset')]
    inputWrappers.forEach((option, index) => {
      if (index === 0) return

      const optionInputs = [...option.querySelectorAll('input[type="radio"], option')]
      const previousOptionSelected = inputWrappers[index - 1].querySelector(':checked').value
      const availableOptionInputsValue = selectedOptionOneVariants
        .filter((variant) => variant.available && variant[`option${index}`] === previousOptionSelected)
        .map((variantOption) => variantOption[`option${index + 1}`])

      this.setInputAvailability(optionInputs, availableOptionInputsValue)
    })
  }

  setInputAvailability(elementList, availableValuesList) {
    elementList.forEach((element) => {
      const value = element.getAttribute('value')
      const availableElement = availableValuesList.includes(value)

      if (element.tagName === 'INPUT') {
        element.toggleAttribute('data-disabled', !availableElement)
      }
    })
  }

  updateURL() {
    if (!this.currentVariant || !this.updateUrl) {
      return
    }

    window.history.replaceState({}, '', `${this.url}?variant=${this.currentVariant.id}`)
  }

  getProductInfo() {
    const requestedVariantId = this.currentVariant.id

    if (this.productInfo.has(requestedVariantId)) {
      return this.productInfo.get(requestedVariantId)
    }

    this.productInfo.set(
      requestedVariantId,
      fetch(`${this.url}?variant=${requestedVariantId}&section_id=${this.sectionId}`)
        .then((response) => response.text())
        .then((responseText) => new DOMParser().parseFromString(responseText, 'text/html'))
    )

    return this.productInfo.get(requestedVariantId)
  }

  get sectionId() {
    return this.getAttribute('section-id')
  }

  get updateUrl() {
    return this.getAttribute('update-url') === 'true'
  }

  get url() {
    return this.getAttribute('url')
  }
}

customElements.define('block-variant-picker', BlockVariantPicker)
