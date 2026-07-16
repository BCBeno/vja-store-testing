import { test, expect } from '../../fixtures/cart';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('.env') });
import { NavBarPage } from '../../pages/navigation-bar/navBar.page';
import { ProductPage } from '../../pages/product/product.page';
import { CartPage } from '../../pages/catalog/cart.page';


test.describe('Role based login (fake data)', () => {

    test('login with valid credentials for role based access', async ({ page, loginAsDefaultUser }) => {
        await expect(page).toHaveURL('/products');
    });
    
    test('login with invalid credentials for role based access', async ({ page, loginAsRandomUser }) => {
        await expect(page).toHaveURL('/login');
    });
});

test.describe('Core Feature Flow', () => {
    let navBarPage: NavBarPage;
    let productPage: ProductPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page, loginAsDefaultUser }) => {
        navBarPage = new NavBarPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);

        await productPage.goto();
    });

    test('user can complete an order successfully', async ({ page }) => {

        //Act
        await productPage.productLocators.productCard().first().click();
        await productPage.productLocators.addToCartButton().first().click();
        await navBarPage.navbarLocators.cartLink().click();
        await cartPage.cartLocators.checkoutButton().click();

        //Assert
        await expect(cartPage.cartLocators.orderPlacedSuccessMessage()).toBeVisible();

    });

    test('user cannot checkout with an empty cart', async ({ page, emptyCart }) => {
        let cartItemsCount = await cartPage.cartLocators.priceAndQuantityText().count();
        await expect(cartItemsCount).toEqual(0);
        await cartPage.checkout();
        await expect(cartPage.cartLocators.emptyCartMessage()).toBeVisible();
    });
    


    test.afterEach(async ({ page }) => {
        await expect(navBarPage.navbarLocators.logoutLink()).toBeVisible();
        await navBarPage.logout();
    });
});