import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('.env') });

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('[C46] Login With Valid Credentials', async ({ page }) => {
    let email = process.env.EMAIL_ACCOUNT || '';
    let password = process.env.EMAIL_PASSWORD || '';

    await test.step('Input fields are visible', async () => {
      await expect(page.getByTestId('login-email-input')).toBeVisible();
      await expect(page.getByTestId('login-password-input')).toBeVisible();
      await expect(page.getByTestId('login-btn')).toBeVisible();
    });


    await test.step('Fill in the input fields and submit', async () => {
      await page.getByTestId('login-email-input').fill(email);
      await page.getByTestId('login-password-input').fill(password);
      await expect(page.getByTestId('login-email-input')).toHaveValue(email);
      await expect(page.getByTestId('login-password-input')).toHaveValue(password);
      await expect(page.getByTestId('login-btn')).toBeEnabled();
      await page.getByTestId('login-btn').click();
    });

    await test.step('Verify successful login and redirection to products page', async () => {
      await expect(page.getByText('Welcome back')).toBeVisible();
      await expect(page).toHaveURL('/products');
    });
  });

  test('[C47] Login With Invalid Password', async ({ page }) => {
    await test.step('Input fields are visible', async () => {
      await expect(page.getByTestId('login-email-input')).toBeVisible();
      await expect(page.getByTestId('login-password-input')).toBeVisible();
      await expect(page.getByTestId('login-btn')).toBeVisible();
    });

    await test.step('Fill in the input fields with valid email and invalid password, then submit', async () => {
      await page.getByTestId('login-email-input').fill(process.env.EMAIL_ACCOUNT || '');
      await page.getByTestId('login-password-input').fill('wrongpassword');
      await expect(page.getByTestId('login-btn')).toBeEnabled();
      await page.getByTestId('login-btn').click();
    });

    await test.step('Verify error message is displayed and user remains on login page', async () => {
      await expect(page.getByTestId('login-error')).toContainText('Invalid email or password');
      await expect(page).toHaveURL('/login');
    });
  });

  test('[C49] Login Without Data', async ({ page }) => {
    await test.step('Input fields are visible', async () => {
      await expect(page.getByTestId('login-email-input')).toBeVisible();
      await expect(page.getByTestId('login-password-input')).toBeVisible();
      await expect(page.getByTestId('login-btn')).toBeVisible();
    });

    await test.step('Submit empty input fields', async () => {
      await page.getByTestId('login-email-input').fill('');
      await page.getByTestId('login-password-input').fill('');
      await expect(page.getByTestId('login-btn')).toBeEnabled();
      await page.getByTestId('login-btn').click();
    });

    await test.step('Verify error message is displayed', async () => {
      await expect(page.getByTestId('login-error')).toContainText('Enter a valid email');
      await expect(page).toHaveURL('/login');
    });
  });

  test('[C65] Login shows error with invalid email format', async ({ page }) => {

    await test.step('Input fields are visible', async () => {
      await expect(page.getByTestId('login-email-input')).toBeVisible();
      await expect(page.getByTestId('login-password-input')).toBeVisible();
      await expect(page.getByTestId('login-btn')).toBeVisible();
    });

    await test.step('Fill in the input fields with invalid email format and submit', async () => {
      await page.getByTestId('login-email-input').fill('invalidemail');
      await page.getByTestId('login-password-input').fill('somepassword');
      await expect(page.getByTestId('login-btn')).toBeEnabled();
      await page.getByTestId('login-btn').click();
    });

    await test.step('Verify error message is displayed', async () => {
      await expect(page.getByTestId('login-error')).toContainText('Enter a valid email');
      await expect(page).toHaveURL('/login');
    });
  });

  test('[C48] Login Without a Password', async ({ page }) => {
    await test.step('Input fields are visible', async () => {
      await expect(page.getByTestId('login-email-input')).toBeVisible();
      await expect(page.getByTestId('login-password-input')).toBeVisible();
      await expect(page.getByTestId('login-btn')).toBeVisible();
    });

    await test.step('Fill in the email field and leave the password field empty', async () => {
      await page.getByTestId('login-email-input').fill(process.env.EMAIL_ACCOUNT || '');
      await page.getByTestId('login-password-input').fill('');
      await expect(page.getByTestId('login-btn')).toBeEnabled();
      await page.getByTestId('login-btn').click();
    });

    await test.step('Verify that the error message is displayed and the user remains on the login page', async () => {
      await expect(page.getByTestId('login-error')).toContainText('Password is required');
      await expect(page).toHaveURL('/login');
    });
  });
});
