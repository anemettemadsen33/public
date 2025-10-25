import { test, expect } from '@playwright/test'

test.describe('Auto Marketplace - Basic Flow', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')

    // Check that the page title is correct
    await expect(page).toHaveTitle(/Auto Marketplace/i)

    // Check for main navigation elements
    await expect(page.locator('nav')).toBeVisible()
  })

  test('should navigate to listings page', async ({ page }) => {
    await page.goto('/')

    // Click on a category or listings link
    await page.click('text=/listings/i')

    // Verify we're on the listings page
    await expect(page.url()).toContain('/listings')
  })
})
