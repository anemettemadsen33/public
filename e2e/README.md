# End-to-End Tests

This directory contains Playwright-based end-to-end tests for the Auto Marketplace application.

## Setup

Before running the tests, you need to install Playwright browsers:

```bash
npx playwright install chromium
```

Or install all browsers with system dependencies:

```bash
npx playwright install --with-deps
```

## Running Tests

### Run all tests (headless mode)
```bash
npm run test:e2e
```

### Run tests with UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see the browser)
```bash
npm run test:e2e:headed
```

## Test Structure

### basic.spec.ts

Contains navigation tests that verify:
- Users can navigate to the cars listings page
- Users can navigate to the trucks listings page
- Users can navigate to the dealers page

All tests use:
- **Role-based selectors** (`getByRole('link', { name: /.../ })`) for accessibility-aware element selection
- **Navigation waiting** (`Promise.all` with `waitForURL`) to ensure navigation completes before assertions
- **URL assertions** (`toHaveURL`) to verify the final URL matches expectations

## Why These Patterns Matter

The tests follow Playwright best practices to avoid race conditions:

1. **Promise.all with waitForURL**: Ensures the test waits for navigation to complete before proceeding
2. **Role-based selectors**: More robust than text selectors, works across translations and styling changes
3. **URL pattern matching**: Provides flexible assertion that retries until success or timeout

These patterns prevent the common test failure where `page.url()` is checked before navigation completes.
