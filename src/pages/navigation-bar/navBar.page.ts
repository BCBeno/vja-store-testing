import { Page, Locator, expect } from '@playwright/test';
import { NAVBAR_LOCATORS } from './navBar.locators';


export class NavBarPage {
    private readonly page: Page;
    readonly homeLink: Locator;
    readonly productsLink: Locator;
    readonly cartLink: Locator;
    readonly loginLink: Locator;
    readonly registerLink: Locator;
    readonly logoutLink: Locator;

    constructor(page: Page) {
        this.page = page;
        const locators = NAVBAR_LOCATORS(page);
        this.homeLink = locators.homeLink();
        this.productsLink = locators.productsLink();
        this.cartLink = locators.cartLink();
        this.loginLink = locators.loginLink();
        this.registerLink = locators.registerLink();
        this.logoutLink = locators.logoutLink();
    }

    async goto() {
        await this.page.goto('/');
    }

    async login() {
        await this.loginLink.click();
    }

    async logout() {
        await this.logoutLink.click();
    }
    

    async register() {
        await this.registerLink.click();
    }

    async goToCart() {
        await this.cartLink.click();
    }

    async goToProducts() {
        await this.productsLink.click();
    }

}