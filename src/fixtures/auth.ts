import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/login/login.page';
import { testUsers } from '../test-data/users';

type AuthFixtures = {
  loginAsDefaultUser: void;
  loginAsRandomUser: void;
  authenticatedPage: Page;
};


export const test = base.extend<AuthFixtures>({
  loginAsDefaultUser: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.defaultUser.email, testUsers.defaultUser.password);
    await use();
  },
  loginAsRandomUser: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.randomUser.email, testUsers.randomUser.password);
    await use();
  },

  authenticatedPage: async ({ browser, request }, use) => {
    const response = await request.post('/api/auth/login', {
      data: {
        email: testUsers.defaultUser.email,
        password: testUsers.defaultUser.password,
      }
    });

    if (!response.ok()) {
      throw new Error(
        `Failed to login via API: ${response.status()} ${response.statusText()}`
      );
    }

    const storageState = await request.storageState();
    const sessionCookie = storageState.cookies.find(cookie => cookie.name === 'session');

    if (!sessionCookie) {
      throw new Error('API login succeeded, but no session cookie was returned');
    }

    const context = await browser.newContext();
    try {
      await context.addCookies([sessionCookie]);
      const page = await context.newPage();
      await use(page);
    } finally {
      await context.close();
    }

  },

});

export { expect, Page } from '@playwright/test';