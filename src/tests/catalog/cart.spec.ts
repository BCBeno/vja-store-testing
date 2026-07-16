import { test, expect } from '../../fixtures/cart';
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
  let navBarPage: NavBarPage;
  let productPage: ProductPage;


  test.beforeEach(async ({ page, loginAsDefaultUser, emptyCart }) => {
    cartPage = new CartPage(page);
    navBarPage = new NavBarPage(page);
    productPage = new ProductPage(page);

    // await test.step('Login', async () => {
    //   loginAsDefaultUser;
    // });

    await test.step('Verify login success', async () => {
      await expect(navBarPage.navbarLocators.logoutLink()).toBeVisible();
    });
    
    // await test.step('Clear cart', async () => {
    //   emptyCart;
    // });
    
    await test.step('Navigate to products', async () => {
      await navBarPage.goToProducts();
      await expect(page).toHaveURL('/products');
    });
  });

  test('[C56] Add to Cart Price Summary Calculation', async ({ page }) => {
    //Arrange
    await expect(navBarPage.navbarLocators.cartLink()).toBeVisible();
    await expect(productPage.productLocators.productCard().first()).toBeVisible();
    await expect(productPage.productLocators.addToCartButton().first()).toBeVisible();

    await expect(productPage.productLocators.productCard().nth(1)).toBeVisible();
    await expect(productPage.productLocators.addToCartButton().nth(1)).toBeVisible();

    await expect(productPage.productLocators.productCard().nth(2)).toBeVisible();
    await expect(productPage.productLocators.addToCartButton().nth(2)).toBeVisible();

    //Act
    await productPage.productLocators.addToCartButton().first().click();
    await productPage.productLocators.addToCartButton().nth(1).click();
    await productPage.productLocators.addToCartButton().nth(2).click();
    await cartPage.goto();
    const lineTexts = await cartPage.cartLocators.priceAndQuantityText().allTextContents();

    const expectedSubtotal = lineTexts.reduce((sum, text) => {
        const [priceStr, qtyStr] = text.split('·');
        const price = parseFloat(priceStr.replace('$', '').trim());
        const qty = parseInt(qtyStr.replace('Qty', '').trim(), 10);
        return sum + price * qty;
    }, 0);

    const subtotalText = await cartPage.cartLocators.subtotalText().textContent();
    const subtotal = parseFloat((subtotalText || '').replace('Subtotal$', ''));

    //Assert
    expect(subtotal).toEqual(expectedSubtotal);
    
  });

  test('[C57] Checkout With a Non-Empty Cart', async ({ page }) => {
    await test.step('Add item to cart and proceed to checkout', async () => {
      await productPage.productLocators.productCard().first().click();
      await productPage.productLocators.addToCartButton().first().click();
      await navBarPage.navbarLocators.cartLink().click();
      await cartPage.cartLocators.checkoutButton().click();
    });

    await test.step('Verify order was placed', async () => {
      await expect(cartPage.cartLocators.orderPlacedSuccessMessage()).toBeVisible();
    });
  });



  test.afterEach(async ({ page, emptyCart }) => {
    // await test.step('Clear cart', async () => {
    //   emptyCart;
    // });
    
    await test.step('Logout', async () => {
      await expect(navBarPage.navbarLocators.logoutLink()).toBeVisible();
      await navBarPage.navbarLocators.logoutLink().click();
    });
  });
  
});