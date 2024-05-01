import { test, expect } from '@playwright/test'
import { EVENTS } from '@archetype-themes/utils/pubsub'

test('block-buy-buttons', async ({ page }) => {
  // Given
  await page.goto('/')
  await page.getByRole('link', { name: 'block-buy-buttons' }).click()
  let el = await page.locator('block-buy-buttons')
  let sectionId = await el.getAttribute('data-section-id')
  let raw = await page.locator("script[type='application/json']").last().textContent()
  let json = JSON.parse(raw)
  let variant = json.find((v) => !v.available)
  let data = { eventName: EVENTS.variantChange, options: { detail: { variant } }, sectionId }
  let button = await page.getByRole('button').first()
  // When
  await page.evaluate(({ eventName, options, sectionId }) => {
    options.detail.html = new window.DOMParser().parseFromString(
      `<button id="ProductSubmitButton-${sectionId}" disabled="disabled">
        <span>Sold Out</span>
      </button>`,
      'text/html'
    )
    return Promise.resolve(setTimeout(() => document.dispatchEvent(new CustomEvent(eventName, options)), 300))
  }, data)
  // Then
  await expect(button).toContainText('Sold Out')
  await expect(button).toBeDisabled()
})
