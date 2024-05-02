/**
 * Original source from https://www.npmjs.com/package/@motionone/dom
 * Usage: https://motion.dev/dom/in-view
 */
const thresholds = {
  any: 0,
  all: 1
}

export default function inView(elementOrSelector, onStart, { root, margin: rootMargin, amount = 'any' } = {}) {
  if (typeof IntersectionObserver === 'undefined') {
    return () => {}
  }

  let elements
  if (typeof elementOrSelector === 'string') {
    elements = document.querySelectorAll(elementOrSelector)
  } else if (elementOrSelector instanceof Element) {
    elements = [elementOrSelector]
  } else {
    elements = Array.from(elementOrSelector || [])
  }

  const activeIntersections = new WeakMap()
  const onIntersectionChange = (entries) => {
    entries.forEach((entry) => {
      const onEnd = activeIntersections.get(entry.target)
      if (entry.isIntersecting === Boolean(onEnd)) return
      if (entry.isIntersecting) {
        const newOnEnd = onStart(entry)
        if (typeof newOnEnd === 'function') {
          activeIntersections.set(entry.target, newOnEnd)
        } else {
          observer.unobserve(entry.target)
        }
      } else if (onEnd) {
        onEnd(entry)
        activeIntersections.delete(entry.target)
      }
    })
  }

  const observer = new IntersectionObserver(onIntersectionChange, {
    root,
    rootMargin,
    threshold: typeof amount === 'number' ? amount : thresholds[amount]
  })

  elements.forEach((element) => observer.observe(element))
  return () => observer.disconnect()
}
