import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('C:\\Users\\Beno\\Desktop\\QA\\vja-tests\\.env') });
import { faker } from '@faker-js/faker';

test.describe('Register', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('[C50] Register With Valid Data', async ({ page }) => {
    await page.getByTestId('register-name-input').fill(faker.person.fullName());
    await page.getByTestId('register-email-input').fill(faker.internet.email());
    await page.getByTestId('register-password-input').fill(faker.internet.password());
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page).toHaveURL('/login');
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('[C49] Register Without Data', async ({ page }) => {
    await page.getByTestId('register-btn').click();
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  

});