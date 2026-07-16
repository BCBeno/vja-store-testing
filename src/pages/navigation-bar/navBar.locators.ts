import { Page, Locator } from '@playwright/test';

export const NAVBAR_LOCATORS = (page: Page) => ({
    homeLink: (): Locator => page.getByRole('link', { name: 'VJA Store' }),
    productsLink: (): Locator => page.getByRole('banner').getByRole('link', { name: 'Products' }),
    cartLink: (): Locator => page.getByTestId('cart-link'),
    loginLink: (): Locator => page.getByRole('link', { name: 'Login' }),
    logoutLink: (): Locator => page.getByTestId('logout-btn'),
    registerLink: (): Locator => page.getByRole('link', { name: 'Register' }),
});

