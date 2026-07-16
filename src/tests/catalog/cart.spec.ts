import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('.env') });
import {CartPage} from '../../pages/catalog/cart.page';
import { LoginPage } from '../../pages/login/login.page';
import { testUsers } from '../../test-data/users';
import { NavBarPage } from '../../pages/navigation-bar/navBar.page';
import { ProductPage } from '../../pages/product/product.page';

test.describe('Cart', () => {
  let cartPage: CartPage;
  let loginPage: LoginPage;
  let navBarPage: NavBarPage;
  let productPage: ProductPage;


  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
    loginPage = new LoginPage(page);
    navBarPage = new NavBarPage(page);
    productPage = new ProductPage(page);

    await test.step('Login', async () => {
      await loginPage.goto();
      await loginPage.login(testUsers.defaultUser.email, testUsers.defaultUser.password); 
      await expect(page).toHaveURL('/products');
    });

    await test.step('Verify login success', async () => {
      await expect(navBarPage.logoutLink).toBeVisible();
    });
    
    await test.step('Clear cart', async () => {
      await cartPage.goto();
      await cartPage.removeAllCartItems();
    });
    
    await test.step('Navigate to products', async () => {
      await navBarPage.goToProducts();
      await expect(page).toHaveURL('/products');
    });
  });

  test('[C56] Add to Cart Price Summary Calculation', async ({ page }) => {
    //Arrange
    await expect(navBarPage.cartLink).toBeVisible();
    await expect(productPage.productCard.first()).toBeVisible();
    await expect(productPage.addToCartButton.first()).toBeVisible();

    await expect(productPage.productCard.nth(1)).toBeVisible();
    await expect(productPage.addToCartButton.nth(1)).toBeVisible();

    await expect(productPage.productCard.nth(2)).toBeVisible();
    await expect(productPage.addToCartButton.nth(2)).toBeVisible();

    //Act
    await productPage.addToCartButton.first().click();
    await productPage.addToCartButton.nth(1).click();
    await productPage.addToCartButton.nth(2).click();
    await cartPage.goto();
    const lineTexts = await cartPage.priceAndQuantityText.allTextContents();

    const expectedSubtotal = lineTexts.reduce((sum, text) => {
        const [priceStr, qtyStr] = text.split('·');
        const price = parseFloat(priceStr.replace('$', '').trim());
        const qty = parseInt(qtyStr.replace('Qty', '').trim(), 10);
        return sum + price * qty;
    }, 0);

    const subtotalText = await cartPage.subtotalText.textContent();
    const subtotal = parseFloat((subtotalText || '').replace('Subtotal$', ''));

    //Assert
    expect(subtotal).toEqual(expectedSubtotal);
    
  });

  test('[C57] Checkout With a Non-Empty Cart', async ({ page }) => {
    await test.step('Add item to cart and proceed to checkout', async () => {
      await productPage.productCard.first().click();
      await productPage.addToCartButton.first().click();
      await navBarPage.goToCart();
      await cartPage.checkout();
    });

    await test.step('Verify order was placed', async () => {
      await expect(cartPage.orderPlacedSuccessMessage).toBeVisible();
    });
  });



  test.afterEach(async ({ page }) => {
    await test.step('Clear cart', async () => {
      await cartPage.goto();
      await cartPage.removeAllCartItems();
    });
    
    await test.step('Logout', async () => {
      await expect(navBarPage.logoutLink).toBeVisible();
      await navBarPage.logout();
    });
  });
  
});