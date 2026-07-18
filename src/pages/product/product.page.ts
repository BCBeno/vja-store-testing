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

    async addFirstProductToCart() {
        await this.productLocators.productCard().first().click();
        await this.productLocators.addToCartButton().first().click();
    }

    async add3ProductsToCart() {
        await this.productLocators.addToCartButton().first().click();
        await this.productLocators.addToCartButton().nth(1).click();
        await this.productLocators.addToCartButton().nth(2).click();
    }

    async applyFilter(filterName: string) {
        await this.productLocators.filterCheckbox(filterName).click();
    }

    async applySortOption(sortOption: string) {
        await this.productLocators.sortSelect().selectOption(sortOption);
    }

    async getProductPriceByIndex(index: number){
        const priceText = await this.productLocators.productPrice(index).textContent();
        return parseFloat((priceText || '').replace('$', ''));
    }


}