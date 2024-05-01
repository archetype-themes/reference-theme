import { chromium } from '@playwright/test'

async function globalSetup(config) {
  const { baseURL, storageState } = config.projects[0].use
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await browser.newPage()
  try {
    await context.tracing.start({ screenshots: true, snapshots: true })
    await page.goto(baseURL)
    await page.getByLabel('Enter store password').click()
    await page.getByLabel('Enter store password').fill(process.env.SHOPIFY_STORE_PASSWORD)
    await page.getByLabel('Enter store password').press('Enter')
    await page.context().storageState({ path: storageState })
    await context.tracing.stop({
      path: './test-results/setup-trace.zip'
    })
    await browser.close()
  } catch (error) {
    await context.tracing.stop({
      path: './test-results/failed-setup-trace.zip'
    })
    await browser.close()
    throw error
  }
}

export default globalSetup
