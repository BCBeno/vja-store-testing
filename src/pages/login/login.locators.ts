import { Page, Locator } from '@playwright/test';

export const loginLocators = (page: Page) => ({
  emailInput: (): Locator => page.getByTestId('login-email-input'),
  passwordInput: (): Locator => page.getByTestId('login-password-input'),
  loginButton: (): Locator => page.getByTestId('login-btn'),
  errorMessage: (): Locator => page.getByTestId('login-error'),
});