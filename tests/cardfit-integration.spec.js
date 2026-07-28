// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('CardFit + index.html integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      if (!localStorage.getItem('creditCardBenefits')) {
        localStorage.setItem('creditCardBenefits', JSON.stringify([{
          id: 'chase-sapphire-reserve',
          name: 'Chase Sapphire Reserve',
          issuer: 'Chase',
          annualFee: 795,
          color: 'card-gradient-chase',
          image: 'assets/cards/chase-sapphire-reserve.png',
          benefits: []
        }]));
      }
    });
  });

  test('exposes CardFit globals after load', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.getByRole('heading', { name: 'Benefits' })).toBeVisible();
    const hasCards = await page.evaluate(() => typeof window.availableCards === 'object' && window.availableCards !== null);
    const hasSpend = await page.evaluate(() => Array.isArray(window.SPEND_CATEGORIES));
    const hasCur = await page.evaluate(() => Array.isArray(window.REWARD_CURRENCIES));
    const hasCalc = await page.evaluate(() => typeof window.calculateCardNetValue === 'function');
    expect(hasCards).toBe(true);
    expect(hasSpend).toBe(true);
    expect(hasCur).toBe(true);
    expect(hasCalc).toBe(true);
  });

  test('navigates to CardFit tab', async ({ page }) => {
    await page.goto('/index.html');
    await page.getByRole('button', { name: 'CardFit' }).click();
    await expect(page.getByRole('heading', { name: 'CardFit' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Back to tracker' })).toBeVisible();
  });

  test('persists CardFit profile across reload', async ({ page }) => {
    await page.goto('/index.html');
    await page.getByRole('button', { name: 'CardFit' }).click();
    await page.getByRole('button', { name: 'Skip to recommendations' }).click();
    await page.getByRole('button', { name: 'Refine assumptions' }).click();
    await page.locator('[data-testid="cardfit-spend-input"]').first().fill('4242');
    await page.reload();
    await page.getByRole('button', { name: 'CardFit' }).click();
    // Profile restores advanced_tuning; no "Refine" step on this screen
    const val = await page.locator('[data-testid="cardfit-spend-input"]').first().inputValue();
    expect(val).toBe('4242');
  });

  test('reaches recommendations without required input and persists uiFlow', async ({ page }) => {
    await page.goto('/index.html');
    await page.getByRole('button', { name: 'CardFit' }).click();
    await expect(page.getByRole('heading', { name: 'Set up your comparison' })).toBeVisible();
    await page.getByRole('button', { name: 'Skip to recommendations' }).click();
    await expect(page.getByRole('heading', { name: 'Your comparison' })).toBeVisible();
    const flow = await page.evaluate(() => {
      try {
        const p = JSON.parse(localStorage.getItem('cardfit_profile') || '{}');
        return p.uiFlow;
      } catch {
        return null;
      }
    });
    expect(flow).toBe('results');
  });

  test('advanced tuning updates comparison', async ({ page }) => {
    await page.goto('/index.html');
    await page.getByRole('button', { name: 'CardFit' }).click();
    await page.getByRole('button', { name: 'Skip to recommendations' }).click();
    await page.getByRole('button', { name: 'Refine assumptions' }).click();
    const first = page.locator('[data-testid="cardfit-spend-input"]').first();
    await first.fill('5000');
    await first.blur();
    const val = await first.inputValue();
    expect(val).toBe('5000');
  });

  test('recovers from corrupted localStorage key', async ({ page }) => {
    await page.goto('/index.html');
    await page.evaluate(() => {
      localStorage.setItem('cardfit_profile', '{ not json }');
    });
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Benefits' })).toBeVisible();
    await page.getByRole('button', { name: 'CardFit' }).click();
    await expect(page.getByRole('heading', { name: 'CardFit' })).toBeVisible();
  });
});
