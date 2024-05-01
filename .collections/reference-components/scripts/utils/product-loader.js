const loadedProducts = new Map()

export async function loadProduct(handle) {
  if (!handle) {
    throw new Error('The handle of the product is required before product can be loaded')
  }

  if (loadedProducts.has(handle)) {
    return loadedProducts.get(handle)
  }

  const productJSON = await getProductJSON(`products/${handle}.js`)

  loadedProducts.set(handle, productJSON)

  return productJSON
}

export async function getProductJSON(endpoint) {
  const response = await fetch(`${window.Shopify.routes.root}${endpoint}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch data from endpoint: ${endpoint}`)
  }

  return response.json()
}
