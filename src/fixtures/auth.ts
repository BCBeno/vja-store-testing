import { test as base, Page } from '@playwright/test';
import { LoginPage } from  '../pages/login/login.page';
import { testUsers } from '../test-data/users';

type AuthFixtures = {
  loginAsDefaultUser: void;
  loginAsRandomUser: void;
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
});

export { expect, Page } from '@playwright/test';