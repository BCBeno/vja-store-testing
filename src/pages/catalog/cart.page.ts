import { Page, Locator, expect } from '@playwright/test';
import { cartLocators } from './cart.locators';

export class CartPage {
    private readonly page: Page;
    readonly cartLocators;


    constructor(page: Page) {
        this.page = page;
        this.cartLocators = cartLocators(page);
    }

    async goto() {
        await this.page.goto('/cart');
    }

    async checkout() {
        await this.cartLocators.checkoutButton().click();
    }

    async removeCartItem() {
        await this.cartLocators.removeCartItemButton().first().click();
    }

    async removeAllCartItems() {
        let cartItemsCount = await this.cartLocators.removeCartItemButton().count();
        while (cartItemsCount > 0) {
            await this.cartLocators.removeCartItemButton().first().click();
            cartItemsCount--;
        }
    }

}