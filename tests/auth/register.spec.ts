import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('.env') });
import { faker } from '@faker-js/faker';

test.describe('Register', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('[C50] Register With Valid Data', async ({ page }) => {
    //Arrange
    await expect(page.getByTestId('register-name-input')).toBeVisible();
    await expect(page.getByTestId('register-email-input')).toBeVisible();
    await expect(page.getByTestId('register-password-input')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    
    //Act
    await page.getByTestId('register-name-input').fill(name);
    await page.getByTestId('register-email-input').fill(email);
    await page.getByTestId('register-password-input').fill(password);
    await page.getByRole('button', { name: 'Create account' }).click();
    
    //Assert
    await expect(page).toHaveURL('/login');
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('[C49] Register Without Data', async ({ page }) => {
    //Arrange
    await expect(page.getByTestId('register-name-input')).toBeVisible();
    await expect(page.getByTestId('register-email-input')).toBeVisible();
    await expect(page.getByTestId('register-password-input')).toBeVisible();
    await expect(page.getByTestId('register-btn')).toBeVisible();

    //Act
    await page.getByTestId('register-btn').click();

    //Assert
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('[C66] Register without an email', async ({ page }) => {
    await expect(page.getByTestId('register-name-input')).toBeVisible();
    await expect(page.getByTestId('register-email-input')).toBeVisible();
    await expect(page.getByTestId('register-password-input')).toBeVisible();
    await expect(page.getByTestId('register-btn')).toBeVisible();
    const name = faker.person.fullName();
    const password = faker.internet.password();

    //Act
    await page.getByTestId('register-name-input').fill(name);
    await page.getByTestId('register-password-input').fill(password);
    await page.getByTestId('register-btn').click();

    //Assert
    await expect(page.getByTestId('register-name-input')).toHaveValue(name);
    await expect(page.getByTestId('register-password-input')).toHaveValue(password);
    await expect(page.getByTestId('email-error')).toContainText('Email is required');
  });

  

});