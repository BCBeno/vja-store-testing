import { Page, Locator } from '@playwright/test';

export const REGISTER_LOCATORS = (page: Page) => ({
  nameInput: (): Locator => page.getByTestId('register-name-input'),
  emailInput: (): Locator => page.getByTestId('register-email-input'),
  passwordInput: (): Locator => page.getByTestId('register-password-input'),
  registerButton: (): Locator => page.getByTestId('register-btn'),
});