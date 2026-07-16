import { Page, Locator, expect } from '@playwright/test';
import { navbarLocators } from './navBar.locators';


export class NavBarPage {
    private readonly page: Page;
    readonly navbarLocators;

    constructor(page: Page) {
        this.page = page;
        this.navbarLocators = navbarLocators(page);
    }

    async goto() {
        await this.page.goto('/');
    }

    async login() {
        await this.navbarLocators.loginLink().click();
    }

    async logout() {
        await this.navbarLocators.logoutLink().click();
    }
    

    async register() {
        await this.navbarLocators.registerLink().click();
    }

    async goToCart() {
        await this.navbarLocators.cartLink().click();
    }

    async goToProducts() {
        await this.navbarLocators.productsLink().click();
    }

}