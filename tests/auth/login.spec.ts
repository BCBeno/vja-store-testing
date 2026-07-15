import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('.env') });

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('[C46] Login With Valid Credentials', async ({ page }) => {
    //Arrange
    await expect(page.getByTestId('login-email-input')).toBeVisible();
    await expect(page.getByTestId('login-password-input')).toBeVisible();
    await expect(page.getByTestId('login-btn')).toBeVisible();
    const email = process.env.EMAIL_ACCOUNT || '';
    const password = process.env.EMAIL_PASSWORD || '';

    //Act
    await page.getByTestId('login-email-input').fill(email);
    await page.getByTestId('login-password-input').fill(password);
    await expect(page.getByTestId('login-email-input')).toHaveValue(email);
    await expect(page.getByTestId('login-password-input')).toHaveValue(password);
    await expect(page.getByTestId('login-btn')).toBeEnabled();
    await page.getByTestId('login-btn').click();
    //Assert
    await expect(page).toHaveURL('/products');
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
  });

  test('[C47] Login With Invalid Password', async ({ page }) => {
    //Arrange
    await expect(page.getByTestId('login-email-input')).toBeVisible();
    await expect(page.getByTestId('login-password-input')).toBeVisible();
    await expect(page.getByTestId('login-btn')).toBeVisible();

    //Arrange
    await page.getByTestId('login-email-input').fill(process.env.EMAIL_ACCOUNT || '');
    await page.getByTestId('login-password-input').fill('wrongpassword');
    await expect(page.getByTestId('login-btn')).toBeEnabled();
    await page.getByTestId('login-btn').click();
    
    //Assert
    await expect(page.getByTestId('login-error')).toContainText('Invalid email or password');
    await expect(page).toHaveURL('/login');
  });

  test('[C49] Register Without Data', async ({ page }) => {
    //Arrange
    await expect(page.getByTestId('login-email-input')).toBeVisible();
    await expect(page.getByTestId('login-password-input')).toBeVisible();
    await expect(page.getByTestId('login-btn')).toBeVisible();
    //Act
    await page.getByTestId('login-email-input').fill('');
    await page.getByTestId('login-password-input').fill('');
    await expect(page.getByTestId('login-btn')).toBeEnabled();
    await page.getByTestId('login-btn').click();
    //Assert
    await expect(page.getByTestId('login-error')).toContainText('Enter a valid email');
    await expect(page).toHaveURL('/login');
  });

  test('[C65] Login shows error with invalid email format', async ({ page }) => {
    //Arrange
    await expect(page.getByTestId('login-email-input')).toBeVisible();
    await expect(page.getByTestId('login-password-input')).toBeVisible();
    await expect(page.getByTestId('login-btn')).toBeVisible();
    //Act
    await page.getByTestId('login-email-input').fill('invalidemail');
    await page.getByTestId('login-password-input').fill('somepassword');
    await expect(page.getByTestId('login-btn')).toBeEnabled();
    await page.getByTestId('login-btn').click();
    //Assert
    await expect(page.getByTestId('login-error')).toContainText('Enter a valid email');
    await expect(page).toHaveURL('/login');
  });

  test('[C48] Login Without a Password', async ({ page }) => {
    //Arrange
    await test.step('Input fields are visible', async () => {
    await expect(page.getByTestId('login-email-input')).toBeVisible();
    await expect(page.getByTestId('login-password-input')).toBeVisible();
    await expect(page.getByTestId('login-btn')).toBeVisible();
    });
    //Act
    await test.step('Fill in the email field and leave the password field empty', async () => {
    await page.getByTestId('login-email-input').fill(process.env.EMAIL_ACCOUNT || '');
    await page.getByTestId('login-password-input').fill('');
    await expect(page.getByTestId('login-btn')).toBeEnabled();
    await page.getByTestId('login-btn').click();
    });
    //Assert
    await test.step('Verify that the error message is displayed and the user remains on the login page', async () => {
    await expect(page.getByTestId('login-error')).toContainText('Password is required');
    await expect(page).toHaveURL('/login');
    });
  });
});
