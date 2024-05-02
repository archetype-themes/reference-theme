export function subscribe(eventName, callback) {
  let cb = (event) => callback(event)

  document.addEventListener(eventName, cb)

  return function unsubscribe() {
    document.removeEventListener(eventName, cb)
  }
}

export function publish(eventName, options) {
  document.dispatchEvent(new CustomEvent(eventName, options))
}

export const EVENTS = {
  cartBeforeChange: 'cart:before-change',
  cartChange: 'cart:change',
  cartError: 'cart:error',
  lineItemChange: 'line-item:change',
  variantChange: 'variant:change'
}
