import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('C:\\Users\\Beno\\Desktop\\QA\\vja-tests\\.env') });

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('[C46] Login With Valid Credentials', async ({ page }) => {
    await page.getByLabel('Email').fill(process.env.EMAIL_ACCOUNT || '');
    await page.getByLabel('Password').fill(process.env.EMAIL_PASSWORD || '');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL('/products');
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
  });

  test('[C47] Login With Invalid Password', async ({ page }) => {
    await page.getByLabel('Email').fill(process.env.EMAIL_ACCOUNT || '');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByTestId('login-error')).toContainText('Invalid email or password');
    await expect(page).toHaveURL('/login');
  });

  test('[C49] Register Without Data', async ({ page }) => {
    await page.getByLabel('Email').fill('');
    await page.getByLabel('Password').fill('');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByTestId('login-error')).toContainText('Enter a valid email');
    await expect(page).toHaveURL('/login');
  });

  test('[C65] Login shows error with invalid email format', async ({ page }) => {
    await page.getByTestId('login-email-input').fill('invalidemail');
    await page.getByTestId('login-password-input').fill('somepassword');
    await page.getByTestId('login-btn').click();
    await expect(page.getByTestId('login-error')).toContainText('Enter a valid email');
    await expect(page).toHaveURL('/login');
  });

  test('[C48] Login Without a Password', async ({ page }) => {
    await page.getByTestId('login-email-input').fill(process.env.EMAIL_ACCOUNT || '');
    await page.getByTestId('login-password-input').fill('');
    await page.getByTestId('login-btn').click();
    await expect(page.getByTestId('login-error')).toContainText('Password is required');
    await expect(page).toHaveURL('/login');
  });
});
