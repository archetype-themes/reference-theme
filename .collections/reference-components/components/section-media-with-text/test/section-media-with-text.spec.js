import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'section-media-with-text' }).click()
  await page.getByRole('link', { name: 'Watch movie' }).click()
})
