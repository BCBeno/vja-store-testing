import { Page, Locator, expect } from '@playwright/test';
import { CART_LOCATORS } from './cart.locators';

export class CartPage {
    private readonly page: Page;
    readonly checkoutButton: Locator;
    readonly emptyCartMessage: Locator;
    readonly removeCartItemButton: Locator;
    readonly priceAndQuantityText: Locator;
    readonly subtotalText: Locator;
    readonly orderPlacedSuccessMessage: Locator;


    constructor(page: Page) {
        this.page = page;
        const locators = CART_LOCATORS(page);
        this.checkoutButton = locators.checkoutButton();
        this.emptyCartMessage = locators.emptyCartMessage();
        this.removeCartItemButton = locators.removeCartItemButton();
        this.priceAndQuantityText = locators.priceAndQuantityText();
        this.subtotalText = locators.subtotalText();
        this.orderPlacedSuccessMessage = locators.orderPlacedSuccessMessage();
    }

    async goto() {
        await this.page.goto('/cart');
    }

    async checkout() {
        await this.checkoutButton.click();
    }

    async removeCartItem() {
        await this.removeCartItemButton.first().click();
    }

    async removeAllCartItems() {
        let cartItemsCount = await this.removeCartItemButton.count();
        while (cartItemsCount > 0) {
            await this.removeCartItemButton.first().click();
            cartItemsCount--;
        }
    }

}