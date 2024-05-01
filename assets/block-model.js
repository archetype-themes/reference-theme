import BaseMedia from '@archetype-themes/custom-elements/base-media'
import { loadProduct } from '@archetype-themes/utils/product-loader'

export class ModelMedia extends BaseMedia {
  getPlayerTarget() {
    return new Promise((resolve) => {
      this.setAttribute('loaded', '')

      window.Shopify.loadFeatures([
        {
          name: 'shopify-xr',
          version: '1.0',
          onLoad: this.setupShopifyXr.bind(this)
        },
        {
          name: 'model-viewer-ui',
          version: '1.0',
          onLoad: () => {
            const modelViewerUi = this.setupModelViewerUi()
            resolve(modelViewerUi)
          }
        }
      ])
    })
  }

  playerHandler(target, prop) {
    target[prop]()
  }

  async setupShopifyXr() {
    if (!window.ShopifyXR) {
      document.addEventListener('shopify_xr_initialized', this.setupShopifyXr.bind(this))
    } else {
      const productJSON = await loadProduct(this.getAttribute('handle'))
      const productModels = productJSON['media'].filter((media) => media['media_type'] === 'model')

      window.ShopifyXR.addModels(productModels)
      window.ShopifyXR.setupXRElements()
    }
  }

  setupModelViewerUi() {
    const modelViewer = this.querySelector('model-viewer')

    modelViewer.addEventListener('shopify_model_viewer_ui_toggle_play', () => {
      this.setAttribute('playing', '')
    })

    modelViewer.addEventListener('shopify_model_viewer_ui_toggle_pause', () => {
      this.removeAttribute('playing')
    })

    return new window.Shopify.ModelViewerUI(modelViewer, {
      focusOnPlay: false
    })
  }
}

customElements.define('model-media', ModelMedia)
