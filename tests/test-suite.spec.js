// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Card Benefit Tracker test-suite.html', () => {
  test('runs all automated tests with zero failures', async ({ page }) => {
    await page.goto('/test-suite.html');

    await expect(page.getByRole('heading', { name: 'Credit Card Benefit Tracker - Test Suite' })).toBeVisible();

    await page.getByRole('button', { name: 'Run All Tests' }).click();

    const summary = page.locator('#test-summary');
    await expect(summary).toBeVisible();

    const summaryText = (await summary.textContent()) || '';

    const totalMatch = summaryText.match(/Total Tests:\s*(\d+)/);
    const passedMatch = summaryText.match(/Passed:\s*(\d+)/);
    const failedMatch = summaryText.match(/Failed:\s*(\d+)/);

    expect(totalMatch, `could not parse Total Tests from summary: ${summaryText}`).not.toBeNull();
    expect(passedMatch, `could not parse Passed from summary: ${summaryText}`).not.toBeNull();
    expect(failedMatch, `could not parse Failed from summary: ${summaryText}`).not.toBeNull();

    const total = Number(totalMatch && totalMatch[1]);
    const passed = Number(passedMatch && passedMatch[1]);
    const failed = Number(failedMatch && failedMatch[1]);

    expect(failed, `expected 0 failed tests, summary was: ${summaryText}`).toBe(0);
    expect(total, `expected the harness to report at least 7 tests but got ${total}`).toBeGreaterThanOrEqual(7);
    expect(passed).toBe(total);

    const failureRows = await page.locator('.test-result.test-fail').count();
    expect(failureRows).toBe(0);
  });
});
