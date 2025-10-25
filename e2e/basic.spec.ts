import { test, expect } from '@playwright/test';

test('should navigate to listings page', async ({ page }) => {
  await page.goto('/');

  // Use role-based selector for links and wait for navigation
  await Promise.all([
    page.waitForURL('**/cars'),
    page.getByRole('link', { name: /cars/i }).click()
  ]);

  await expect(page).toHaveURL(/\/cars/);
});
