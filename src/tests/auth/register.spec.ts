import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('.env') });
import { faker } from '@faker-js/faker';
import { RegisterPage } from '../../pages/register/register.page';
import { testNewUsers } from '../../test-data/newUsers';

test.describe('Register', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await test.step('Navigate to register page', async () => {
      await registerPage.goto();
    });
  });

  test('[C50] Register With Valid Data', async ({ page }) => {
    let name: string;
    let email: string;
    let password: string;
    
    await test.step('Verify that the input fields are visible and generate data', async () => {
      await expect(registerPage.nameInput).toBeVisible();
      await expect(registerPage.emailInput).toBeVisible();
      await expect(registerPage.passwordInput).toBeVisible();
      await expect(registerPage.registerButton).toBeVisible();
      name = testNewUsers.randomUser.name;
      email = testNewUsers.randomUser.email;
      password = testNewUsers.randomUser.password;
    });
    
    await test.step('Fill the input fields and submit', async () => {
      await registerPage.register(name, email, password);
    });
    
    await test.step('Verify redirect to login and success message', async () => {
      await expect(page).toHaveURL('/login');
      await expect(page.getByText('Welcome back')).toBeVisible();
    });
  });

  test('[C49] Register Without Data', async ({ page }) => {
    await test.step('Verify that the input fields are visible', async () => {
      await expect(registerPage.nameInput).toBeVisible();
      await expect(registerPage.emailInput).toBeVisible();
      await expect(registerPage.passwordInput).toBeVisible();
      await expect(registerPage.registerButton).toBeVisible();
    });

    await test.step('Submit empty input fields', async () => {
      await registerPage.registerWithoutData();
    });

    await test.step('Verify validation errors', async () => {
      await expect(registerPage.registerEmailError).toContainText('Email is required');
      await expect(registerPage.registerNameError).toContainText('Name is required');
      await expect(registerPage.registerPasswordError).toContainText('Password is required');
      
    });
  });

  test('[C66] Register without an email', async ({ page }) => {
    let name: string;
    let password: string;
    
    await test.step('Verify input fields are visible', async () => {
      await expect(registerPage.nameInput).toBeVisible();
      await expect(registerPage.emailInput).toBeVisible();
      await expect(registerPage.passwordInput).toBeVisible();
      await expect(registerPage.registerButton).toBeVisible();
      name = testNewUsers.randomUser.name;
      password = testNewUsers.randomUser.password;
    });

    await test.step('Fill name and password, submit without email', async () => {
      await registerPage.nameInput.fill(name);
      await registerPage.passwordInput.fill(password);
      await registerPage.registerButton.click();
    });

    await test.step('Verify form values retained and email error shown', async () => {
      await expect(registerPage.nameInput).toHaveValue(name);
      await expect(registerPage.passwordInput).toHaveValue(password);
      await expect(registerPage.registerEmailError).toBeVisible();
      await expect(registerPage.registerEmailError).toContainText('Email is required');
    });
  });

  

});