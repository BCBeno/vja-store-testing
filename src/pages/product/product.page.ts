import { Page, Locator, expect } from '@playwright/test';
import { productLocators } from './product.locators';

export class ProductPage {
    private readonly page: Page;
    readonly addToCartButton: Locator;
    readonly productCard: Locator;
    readonly productFavoriteButton: Locator;
    readonly productPrice: (productNumber: number) => Locator;
    readonly sortSelect: Locator;
    readonly filterCheckbox: (brand: string) => Locator;
    readonly clearFiltersButton: Locator;



    constructor(page: Page) {
        this.page = page;
        const locators = productLocators(page);
        this.addToCartButton = locators.addToCartButton();
        this.productCard = locators.productCard();
        this.productFavoriteButton = locators.productFavoriteButton();
        this.productPrice = locators.productPrice;
        this.sortSelect = locators.sortSelect();
        this.filterCheckbox = locators.filterCheckbox;
        this.clearFiltersButton = locators.clearFiltersButton();
    }

    async goto() {
        await this.page.goto('/products');
    }
    
}