import { test, expect } from '@playwright/test'
import { EVENTS } from '@archetype-themes/utils/pubsub'

test('block-price', async ({ page }) => {
  // Given
  await page.goto('/')
  await page.getByRole('link', { name: 'block-price' }).click()
  let el = await page.locator('block-price')
  let sectionId = await el.getAttribute('data-section-id')
  let data = { eventName: EVENTS.variantChange, options: { detail: { variant: {} } }, sectionId }
  // When
  await page.evaluate(({ eventName, options, sectionId }) => {
    options.detail.html = new DOMParser().parseFromString(
      `<block-price data-section-id="${sectionId}">
        <div class="block-price__container heading-font-stack h4">
          <span aria-hidden="true">$100<sup>00</sup></span>
          <span class="visually-hidden">$100.00</span>
        </div>
      </block-price>`,
      'text/html'
    )
    return Promise.resolve(setTimeout(() => document.dispatchEvent(new CustomEvent(eventName, options)), 300))
  }, data)
  // Then
  await expect(el).toContainText('$100.00')
})
