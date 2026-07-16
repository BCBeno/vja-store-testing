import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('.env') });
import { LoginPage } from '../../pages/login/login.page';
import { NavBarPage } from '../../pages/navigation-bar/navBar.page';
import { ProductPage } from '../../pages/product/product.page';
import { CartPage } from '../../pages/catalog/cart.page';
import { testUsers } from '../../test-data/users';


test.describe('Core Feature Flow', () => {
    let loginPage: LoginPage;
    let navBarPage: NavBarPage;
    let productPage: ProductPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        navBarPage = new NavBarPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);

        await loginPage.goto();
        await loginPage.login(testUsers.defaultUser.email, testUsers.defaultUser.password);
        await expect(page).toHaveURL('/products');
        await productPage.goto();
    });

    test('user can complete an order successfully', async ({ page }) => {

        //Act
        await productPage.productCard.first().click();
        await productPage.addToCartButton.first().click();
        await navBarPage.goToCart();
        await cartPage.checkout();

        //Assert
        await expect(cartPage.orderPlacedSuccessMessage).toBeVisible();

    });

    test('user cannot checkout with an empty cart', async ({ page }) => {
        //Arrange
        await cartPage.goto();
        let cartItemsCount = await cartPage.priceAndQuantityText.count();
        await cartPage.removeAllCartItems();
        await expect(cartItemsCount).toEqual(0);



        //Act
        await cartPage.checkout();


        //Assert
        await expect(cartPage.emptyCartMessage).toBeVisible();
    });


    test.afterEach(async ({ page }) => {
    await expect(navBarPage.logoutLink).toBeVisible();
    await navBarPage.logout();
  });
});