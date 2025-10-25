import { test, expect } from '@playwright/test';

test('should load homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/AutoMarket|Auto Marketplace/i);
});

test('should navigate to listings page', async ({ page }) => {
  await page.goto('/');

  // Click the listings link using an accessible role selector to ensure we target the correct link
  await page.getByRole('link', { name: /listings/i }).click();

  // Wait for navigation (works for full navigation and client-side routing)
  await page.waitForURL(/\/listings/);

  // Final assertion
  await expect(page).toHaveURL(/\/listings/);
});
