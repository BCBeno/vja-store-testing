import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('C:\\Users\\Beno\\Desktop\\QA\\vja-tests\\.env') });

test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-email-input').fill(process.env.EMAIL_ACCOUNT || '');
    await page.getByTestId('login-password-input').fill(process.env.EMAIL_PASSWORD || '');
    await page.getByTestId('login-btn').click();
    await page.goto('/products');
  });




  test.afterEach(async ({ page }) => {
    await expect(page.getByTestId('logout-btn')).toBeVisible();
    await page.getByTestId('logout-btn').click();
  });
  
});