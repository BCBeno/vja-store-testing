import { Page, Locator, expect } from '@playwright/test';
import { productLocators } from './product.locators';

export class ProductPage {
    private readonly page: Page;
    readonly productLocators;



    constructor(page: Page) {
        this.page = page;
        this.productLocators = productLocators(page);
    }

    async goto() {
        await this.page.goto('/products');
    }
    
}