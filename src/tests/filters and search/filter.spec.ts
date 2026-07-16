import { test, expect } from '../../fixtures/cart';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('.env') });
import { NavBarPage } from '../../pages/navigation-bar/navBar.page';
import { ProductPage } from '../../pages/product/product.page';

test.describe('Filtering flow', () => {
    let navBarPage: NavBarPage;
    let productPage: ProductPage;

    test.beforeEach(async ({ page, loginAsDefaultUser, emptyCart }) => {
        await test.step('Login and navigate to products', async () => {
            navBarPage = new NavBarPage(page);
            productPage = new ProductPage(page);

            await expect(page).toHaveURL('/products');
            await productPage.goto();
        });
    });

    test('[C61] Sort Options Work Correctly (Ascending)', async ({ page }) => {
        let firstPrice: number;
        
        await test.step('Get initial price', async () => {
            const firstPriceText = await productPage.productLocators.productPrice(1).nth(0).textContent();
            firstPrice = parseFloat((firstPriceText || '').replace('$', ''));
        });
        
        await test.step('Select ascending sort option', async () => {
            await productPage.productLocators.sortSelect().selectOption('price-asc');
        });
        
        await test.step('Verify new price is less than or equal to first price', async () => {
            const newPriceText = await productPage.productLocators.productPrice(1).nth(0).textContent();
            const newPrice = parseFloat((newPriceText || '').replace('$', ''));
            expect(newPrice).toBeLessThanOrEqual(firstPrice);
        });
    });

    test('[C61] Sort Options Work Correctly (Descending)', async ({ page }) => {
        let firstPrice: number;
        
        await test.step('Get initial price', async () => {
            const firstPriceText = await productPage.productLocators.productPrice(0).textContent();
            firstPrice = parseFloat((firstPriceText || '').replace('$', ''));
        });
        
        await test.step('Select descending sort option', async () => {
            await productPage.productLocators.sortSelect().selectOption('price-desc');
        });
        
        await test.step('Verify new price is greater than or equal to first price', async () => {
            const newPriceText = await productPage.productLocators.productPrice(0).textContent();
            const newPrice = parseFloat((newPriceText || '').replace('$', ''));
            expect(newPrice).toBeGreaterThanOrEqual(firstPrice);
        });
    });


    test('[C62] Clear Filters Resets All Filter States', async ({ page }) => {
        let firstPrice: number;
        
        await test.step('Get initial price', async () => {
            const firstPriceText = await productPage.productLocators.productPrice(0).textContent();
            firstPrice = parseFloat((firstPriceText || '').replace('$', ''));
        });

        await test.step('Apply filters and verify them', async () => {
            await productPage.productLocators.filterCheckbox('Adidas').click();
            await productPage.productLocators.sortSelect().selectOption('price-asc');
            const newPriceText = await productPage.productLocators.productPrice(0).textContent();
            const newPrice = parseFloat((newPriceText || '').replace('$', ''));
            await expect(newPrice).toBeLessThanOrEqual(firstPrice);
            await expect( productPage.productLocators.filterCheckbox('Adidas') ).toBeChecked();
            await expect(productPage.productLocators.sortSelect()).toHaveValue('price-asc');
        });

        await test.step('Clear the filters', async () => {
            await productPage.productLocators.clearFiltersButton().click();
        });
        
        await test.step('Verify all filters are cleared', async () => {
            await expect(productPage.productLocators.sortSelect()).toHaveValue('featured');
            await expect(productPage.productLocators.filterCheckbox('Adidas')).not.toBeChecked();
        });
    });

});