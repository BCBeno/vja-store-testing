import { LOGIN_LOCATORS } from './login.locators';
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    private readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        const locators = LOGIN_LOCATORS(page);
        this.emailInput = locators.emailInput();
        this.passwordInput = locators.passwordInput();
        this.loginButton = locators.loginButton();
        this.errorMessage = locators.errorMessage();
    }

    async goto() {
        await this.page.goto('/login');
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    

}