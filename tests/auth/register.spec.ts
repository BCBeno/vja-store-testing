import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('.env') });
import { faker } from '@faker-js/faker';

test.describe('Register', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('Navigate to register page', async () => {
      await page.goto('/register');
    });
  });

  test('[C50] Register With Valid Data', async ({ page }) => {
    let name: string;
    let email: string;
    let password: string;
    
    await test.step('Verify that the input fields are visible', async () => {
      await expect(page.getByTestId('register-name-input')).toBeVisible();
      await expect(page.getByTestId('register-email-input')).toBeVisible();
      await expect(page.getByTestId('register-password-input')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
      name = faker.person.fullName();
      email = faker.internet.email();
      password = faker.internet.password();
    });
    
    await test.step('Fill the input fields and submit', async () => {
      await page.getByTestId('register-name-input').fill(name);
      await page.getByTestId('register-email-input').fill(email);
      await page.getByTestId('register-password-input').fill(password);
      await page.getByRole('button', { name: 'Create account' }).click();
    });
    
    await test.step('Verify redirect to login and success message', async () => {
      await expect(page).toHaveURL('/login');
      await expect(page.getByText('Welcome back')).toBeVisible();
    });
  });

  test('[C49] Register Without Data', async ({ page }) => {
    await test.step('Verify that the input fields are visible', async () => {
      await expect(page.getByTestId('register-name-input')).toBeVisible();
      await expect(page.getByTestId('register-email-input')).toBeVisible();
      await expect(page.getByTestId('register-password-input')).toBeVisible();
      await expect(page.getByTestId('register-btn')).toBeVisible();
    });

    await test.step('Submit empty input fields', async () => {
      await page.getByTestId('register-btn').click();
    });

    await test.step('Verify validation errors', async () => {
      await expect(page.getByText('Name is required')).toBeVisible();
      await expect(page.getByText('Email is required')).toBeVisible();
      await expect(page.getByText('Password is required')).toBeVisible();
    });
  });

  test('[C66] Register without an email', async ({ page }) => {
    let name: string;
    let password: string;
    
    await test.step('Verify input fields are visible', async () => {
      await expect(page.getByTestId('register-name-input')).toBeVisible();
      await expect(page.getByTestId('register-email-input')).toBeVisible();
      await expect(page.getByTestId('register-password-input')).toBeVisible();
      await expect(page.getByTestId('register-btn')).toBeVisible();
      name = faker.person.fullName();
      password = faker.internet.password();
    });

    await test.step('Fill name and password, submit without email', async () => {
      await page.getByTestId('register-name-input').fill(name);
      await page.getByTestId('register-password-input').fill(password);
      await page.getByTestId('register-btn').click();
    });

    await test.step('Verify form values retained and email error shown', async () => {
      await expect(page.getByTestId('register-name-input')).toHaveValue(name);
      await expect(page.getByTestId('register-password-input')).toHaveValue(password);
      await expect(page.getByTestId('email-error')).toContainText('Email is required');
    });
  });

  

});