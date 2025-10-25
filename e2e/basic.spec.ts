import { test, expect } from '@playwright/test';

test('should navigate to cars listings page', async ({ page }) => {
  await page.goto('/');

  // Use role-based selector for links and wait for navigation
  await Promise.all([
    page.waitForURL('**/cars'),
    page.getByRole('link', { name: /cars/i }).click()
  ]);

  await expect(page).toHaveURL(/\/cars/);
});

test('should navigate to trucks listings page', async ({ page }) => {
  await page.goto('/');

  // Use role-based selector for links and wait for navigation
  await Promise.all([
    page.waitForURL('**/trucks'),
    page.getByRole('link', { name: /trucks/i }).click()
  ]);

  await expect(page).toHaveURL(/\/trucks/);
});

test('should navigate to dealers page', async ({ page }) => {
  await page.goto('/');

  // Use role-based selector for links and wait for navigation
  await Promise.all([
    page.waitForURL('**/dealers'),
    page.getByRole('link', { name: /dealers/i }).click()
  ]);

  await expect(page).toHaveURL(/\/dealers/);
});
