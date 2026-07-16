import { loginLocators } from './login.locators';
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly loginLocators;
    private readonly page: Page;
    constructor(page: Page) {
        this.loginLocators = loginLocators(page);
        this.page = page;
    }

    async goto() {
        await this.page.goto('/login');
    }

    async login(email: string, password: string) {
        await this.loginLocators.emailInput().fill(email);
        await this.loginLocators.passwordInput().fill(password);
        await this.loginLocators.loginButton().click();
    }

    

}