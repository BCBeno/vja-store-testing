import { REGISTER_LOCATORS } from './register.locators';
import { Page, Locator, expect } from '@playwright/test';

export class RegisterPage {
    private readonly page: Page;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly registerButton: Locator;

    constructor (page: Page){
        this.page = page;
        const locators = REGISTER_LOCATORS(page);
        this.nameInput = locators.nameInput();
        this.emailInput = locators.emailInput();
        this.passwordInput = locators.passwordInput();
        this.registerButton = locators.registerButton();
    }

    async goto(){
        await this.page.goto('/register');
    }

    async register(name: string, email: string, password: string){
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.registerButton.click();
    }

    async registerWithoutData(){
        await this.registerButton.click();
    }

}