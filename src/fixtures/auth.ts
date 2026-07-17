import { test as base, Page } from '@playwright/test';
import { LoginPage } from  '../pages/login/login.page';
import { testUsers } from '../test-data/users';

type AuthFixtures = {
  loginAsDefaultUser: void;
  loginAsRandomUser: void;
  loginAsDefaultUserApi: void;
};

let cachedSessionCookie: any = null;


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

  loginAsDefaultUserApi: async ({ page, request }, use) => {
    if (!cachedSessionCookie) {
      const response = await request.post('/api/auth/login', {
        data: {
          email: testUsers.defaultUser.email,
          password: testUsers.defaultUser.password,
        },
      });
      if(!response.ok()) {
        throw new Error(`Failed to login: ${response.status()} ${response.statusText()}`);
      }

      const {cookies} = await request.storageState();
      const sessionCookie = cookies.find(cookie => cookie.name === 'session');
  
      if (!sessionCookie) {
        throw new Error('Session cookie not found');
      }
  
      cachedSessionCookie = sessionCookie;
    }
    await page.context().addCookies([cachedSessionCookie]);
    await use();
    },

});

export { expect, Page } from '@playwright/test';