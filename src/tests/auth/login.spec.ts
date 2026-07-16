import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { LoginPage } from '../../pages/login/login.page';
dotenv.config({ path: path.resolve('.env') });

test.describe('Login', () => {

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('[C46] Login With Valid Credentials', async ({ page }) => {
    const email = process.env.EMAIL_ACCOUNT || '';
    const password = process.env.EMAIL_PASSWORD || '';

    await test.step('Input fields are visible', async () => {
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });


    await test.step('Fill in the input fields and submit', async () => {
      await loginPage.login(email, password);
    });

    await test.step('Verify successful login and redirection to products page', async () => {
      await expect(page.getByText('Welcome back')).toBeVisible();
      await expect(page).toHaveURL('/products');
    });
  });

  test('[C47] Login With Invalid Password', async ({ page }) => {
    await test.step('Input fields are visible', async () => {
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });

    await test.step('Fill in the input fields with valid email and invalid password, then submit', async () => {
      const email = process.env.EMAIL_ACCOUNT || '';
      const password = 'invalidpassword';
      await loginPage.login(email, password);
    });

    await test.step('Verify error message is displayed and user remains on login page', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Invalid email or password');
      await expect(page).toHaveURL('/login');
    });
  });

  test('[C49] Login Without Data', async ({ page }) => {
    await test.step('Input fields are visible', async () => {
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });

    await test.step('Submit empty input fields', async () => {
      await loginPage.login('', '');
    });

    await test.step('Verify error message is displayed', async () => {
      await expect(loginPage.errorMessage).toContainText('Enter a valid email');
      await expect(page).toHaveURL('/login');
    });
  });

  test('[C65] Login shows error with invalid email format', async ({ page }) => {

    await test.step('Input fields are visible', async () => {
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });

    await test.step('Fill in the input fields with invalid email format and submit', async () => {
      await loginPage.login('invalidemail', 'somepassword');
    });

    await test.step('Verify error message is displayed', async () => {
      await expect(loginPage.errorMessage).toContainText('Enter a valid email');
      await expect(page).toHaveURL('/login');
    });
  });

  test('[C48] Login Without a Password', async ({ page }) => {
    await test.step('Input fields are visible', async () => {
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });

    await test.step('Fill in the email field and leave the password field empty', async () => {
      await loginPage.login(process.env.EMAIL_ACCOUNT || '', '');
    });

    await test.step('Verify that the error message is displayed and the user remains on the login page', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Password is required');
      await expect(page).toHaveURL('/login');
    });
  });
});
